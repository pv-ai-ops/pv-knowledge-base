#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shlex
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence


class CommandError(RuntimeError):
    pass


@dataclass(frozen=True)
class StatusEntry:
    status: str
    path: str


@dataclass(frozen=True)
class Settings:
    repo: Path
    preview: bool
    stop_preview: bool
    deploy: bool
    branch: str
    remote: str
    checkout: bool
    include_all: bool
    commit_message: str
    dry_run: bool


def _print_cmd(cmd: Sequence[str], cwd: Path) -> None:
    print(f"+ (cd {cwd}) {shlex.join(cmd)}")


def run(cmd: Sequence[str], *, cwd: Path, dry_run: bool, check: bool = True) -> subprocess.CompletedProcess:
    _print_cmd(cmd, cwd)
    if dry_run:
        return subprocess.CompletedProcess(args=list(cmd), returncode=0)
    return subprocess.run(cmd, cwd=str(cwd), check=check)


def run_capture_bytes(cmd: Sequence[str], *, cwd: Path, dry_run: bool) -> bytes:
    _print_cmd(cmd, cwd)
    if dry_run:
        return b""
    return subprocess.check_output(cmd, cwd=str(cwd))


def ensure_repo(repo: Path) -> None:
    package_json = repo / "package.json"
    publish_script = repo / "scripts" / "publish.js"
    config = repo / "_config.yml"
    if not package_json.exists():
        raise CommandError(f"Expected repo root with package.json: {repo}")
    if not publish_script.exists():
        raise CommandError(f"Expected PVKB publish script at {publish_script}")
    if not config.exists():
        raise CommandError(f"Expected Hexo config at {config}")


def npm_install_if_needed(settings: Settings) -> None:
    if (settings.repo / "node_modules").is_dir():
        return
    print("node_modules/ not found; installing dependencies with npm ci ...")
    run(["npm", "ci"], cwd=settings.repo, dry_run=settings.dry_run)


def git_current_branch(settings: Settings) -> str:
    out = run_capture_bytes(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        cwd=settings.repo,
        dry_run=settings.dry_run,
    )
    if settings.dry_run:
        return settings.branch
    return out.decode("utf-8", errors="replace").strip()


def git_status(settings: Settings) -> list[StatusEntry]:
    out = run_capture_bytes(
        ["git", "status", "--porcelain=v1", "-z"],
        cwd=settings.repo,
        dry_run=settings.dry_run,
    )
    if not out:
        return []

    tokens = out.split(b"\0")
    entries: list[StatusEntry] = []
    i = 0
    while i < len(tokens) and tokens[i]:
        record = tokens[i].decode("utf-8", errors="surrogateescape")
        status = record[:2]
        path = record[3:]
        if status and status[0] in ("R", "C"):
            i += 1
            if i < len(tokens):
                dest = tokens[i].decode("utf-8", errors="surrogateescape")
                entries.append(StatusEntry(status=status, path=dest))
        else:
            entries.append(StatusEntry(status=status, path=path))
        i += 1
    return entries


def _is_under_allowed_roots(path: str) -> bool:
    if path in {"docs", "source"}:
        return True
    return path.startswith(("docs/", "source/"))


def _find_extra_entries(entries: Iterable[StatusEntry]) -> list[StatusEntry]:
    extras: list[StatusEntry] = []
    for entry in entries:
        if _is_under_allowed_roots(entry.path):
            continue
        if entry.status == "??":
            continue
        extras.append(entry)
    return extras


def _has_deployable_changes(entries: Iterable[StatusEntry]) -> bool:
    for entry in entries:
        if _is_under_allowed_roots(entry.path):
            return True
    return False


def publish(settings: Settings) -> None:
    npm_install_if_needed(settings)
    script = "publish:preview" if settings.preview else "publish"
    run(["npm", "run", script], cwd=settings.repo, dry_run=settings.dry_run)

    if settings.preview:
        print("Preview URL: http://localhost:4000/pv-knowledge-base/")

    if settings.stop_preview:
        run(["npm", "run", "preview:stop"], cwd=settings.repo, dry_run=settings.dry_run, check=False)


def deploy(settings: Settings) -> None:
    if not settings.deploy:
        return

    current = git_current_branch(settings)
    if current != settings.branch:
        if settings.checkout:
            run(["git", "checkout", settings.branch], cwd=settings.repo, dry_run=settings.dry_run)
        else:
            raise CommandError(
                f"On branch '{current}', expected '{settings.branch}'. "
                f"Switch branches or pass --checkout."
            )

    entries = git_status(settings)
    if not _has_deployable_changes(entries) and not settings.include_all:
        print("No changes under docs/ or source/; nothing to deploy.")
        return

    extras = _find_extra_entries(entries)
    if extras and not settings.include_all:
        preview = "\n".join(f"- {e.status} {e.path}" for e in extras[:20])
        raise CommandError(
            "Refusing to deploy because there are tracked changes outside docs/ and source/.\n"
            "Commit or discard them, or re-run with --include-all.\n"
            f"Extra entries:\n{preview}"
        )

    if settings.include_all:
        run(["git", "add", "-A"], cwd=settings.repo, dry_run=settings.dry_run)
    else:
        run(["git", "add", "docs", "source"], cwd=settings.repo, dry_run=settings.dry_run)

    diff_rc = run(
        ["git", "diff", "--cached", "--quiet"],
        cwd=settings.repo,
        dry_run=settings.dry_run,
        check=False,
    ).returncode
    if diff_rc == 0:
        print("No staged changes; skip commit/push.")
        return
    if diff_rc != 1 and not settings.dry_run:
        raise CommandError(f"Unexpected return code from git diff --cached --quiet: {diff_rc}")

    run(["git", "commit", "-m", settings.commit_message], cwd=settings.repo, dry_run=settings.dry_run)
    run(["git", "push", settings.remote, settings.branch], cwd=settings.repo, dry_run=settings.dry_run)


def parse_args(argv: Sequence[str]) -> Settings:
    parser = argparse.ArgumentParser(description="Publish and deploy the PV Knowledge Base (Hexo).")
    parser.add_argument(
        "--repo",
        default=".",
        help="Path to the pv-knowledge-base repository (default: current directory).",
    )
    parser.add_argument("--preview", action="store_true", help="Start local preview after publishing.")
    parser.add_argument(
        "--stop-preview",
        action="store_true",
        help="Stop the preview server (port 4000) after starting it.",
    )
    parser.add_argument(
        "--deploy",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Commit and push docs/ + source/ to the deployment branch (default: enabled).",
    )
    parser.add_argument("--branch", default="doc-page", help="Deployment branch to push (default: doc-page).")
    parser.add_argument("--remote", default="origin", help="Git remote to push to (default: origin).")
    parser.add_argument(
        "--checkout",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Auto-checkout --branch before deploying (default: enabled).",
    )
    parser.add_argument(
        "--include-all",
        action="store_true",
        help="Include tracked changes outside docs/ and source/ in the deploy commit.",
    )
    parser.add_argument(
        "--commit-message",
        default="Deploy: update PV Knowledge Base",
        help="Commit message to use when deploying.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print commands without executing them.")
    args = parser.parse_args(argv)

    repo = Path(args.repo).expanduser().resolve()
    return Settings(
        repo=repo,
        preview=args.preview,
        stop_preview=args.stop_preview,
        deploy=args.deploy,
        branch=args.branch,
        remote=args.remote,
        checkout=args.checkout,
        include_all=args.include_all,
        commit_message=args.commit_message,
        dry_run=args.dry_run,
    )


def main(argv: Sequence[str]) -> int:
    settings = parse_args(argv)
    try:
        ensure_repo(settings.repo)
        publish(settings)
        deploy(settings)
        return 0
    except CommandError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        return 2
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Command failed (exit={e.returncode}): {e.cmd}", file=sys.stderr)
        return e.returncode


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
