---
title: Methodology Guide Advanced AI Agent Orchestration for Lean Mathematical Formalization
date: 2026-03-09 01:10:08
photos: ["/assets/covers/Methodology-Guide-Advanced-AI-Agent-Orchestration-for-Lean-Mathematical-Formalization.png"]
cover: "/assets/covers/Methodology-Guide-Advanced-AI-Agent-Orchestration-for-Lean-Mathematical-Formalization.png"
tags: [AI]
categories: [技术分析]
---
## 📎 附件资料

- 在线预览（幻灯片模式）：<a href="/pv-knowledge-base/pdf-slides.html?file=assets%2Fterence_taos_ai_proof_workflow.pdf&title=Methodology%20Guide%20Advanced%20AI%20Agent%20Orchestration%20for%20Lean%20Mathematical%20Formalization" target="_blank" rel="noopener">点击打开</a>
- 下载：[/assets/terence_taos_ai_proof_workflow.pdf](/assets/terence_taos_ai_proof_workflow.pdf)

## 🖥️ 幻灯片预览（支持全屏）

<iframe src="/pv-knowledge-base/pdf-slides.html?file=assets%2Fterence_taos_ai_proof_workflow.pdf&title=Methodology%20Guide%20Advanced%20AI%20Agent%20Orchestration%20for%20Lean%20Mathematical%20Formalization" frameborder="0" allowfullscreen style="width: 100%; height: 82vh; min-height: 520px; max-height: 1200px; border: 1px solid #e1e5e9; border-radius: 8px; margin: 20px 0;"></iframe>

<!-- PDF全文索引未生成（可能缺少pdfjs-dist或解析失败） -->

---

### 1. Introduction: The Evolution of AI-Assisted Formal Proofs

The landscape of formal mathematical verification is shifting from simple "step-by-step manual entry" assisted by autocomplete tools (e.g., GitHub Copilot) to a paradigm of autonomous agent orchestration. In this new model, the mathematician transitions from a coder to a Principal Architect, overseeing high-throughput agents like Claude Code. This shift is necessitated by the inherent brittleness of "monolithic prompting."

A naive approach—requesting a full formal proof in a single prompt—frequently collapses under the weight of its own complexity. As evidenced in high-level formalization tasks, such attempts often lead to system-level crashes, rapid context window pollution, and "stochastic wandering," where the agent engages in sub-optimal branching within the proof search. Rather than converging on a solution, the agent "overthinks" the logic, burning tokens on unproductive tactical paths. To achieve professional-grade results, one must move away from unstructured requests toward a rigorous orchestration framework that constrains the agent’s state-space exploration.

### 2. The "Step-by-Step Recipe": A Framework for Incremental Success

The primary defense against agent logic drift and task failure is the implementation of a granular "recipe." By decomposing the high-level formalization goal into distinct, iterative phases, the architect maintains control over the agent's logical trajectory and prevents the accumulation of "technical debt" in the proof state.

The following four-step framework provides a repeatable structure for formalizing complex informal proofs:

1. **Step 0: Notation & Definitions:** Establish the symbolic foundation and notation "shortcuts" (e.g., S and F notations). This ensures the agent operates within a defined symbolic vocabulary, improving readability and reducing token overhead.
2. **Step 1: The Structural Skeleton:** Formalize high-level lemma statements (e.g., Equation 1689) without attempting to prove them. Every lemma is closed immediately with the `sorry` tactic.
3. **Step 2: Line-by-Line Decomposition:** Transform the informal proof’s prose into a sequence of Lean code lines. This creates a 1:1 parity between the human argument and the formal structure, with justifications still left as `sorry`.
4. **Step 3: Systematic Proof Filling:** Replace the `sorry` markers with verified, compilable code, solving each sub-problem individually while monitoring for tactical efficiency.

This modularity ensures **resumability**. Long-running, unstructured tasks are vulnerable to system crashes and token exhaustion, which often result in total progress loss. However, a Lean file populated with `sorry` markers remains compilable; this allows the mathematician to restore the logical state immediately after a crash, picking up the formalization from the last verified lemma.

### 3. Strategic Skeletonization: Preventing LLM "Overthinking"

The "Skeleton-First" strategy is designed to decouple logical architecture (the "What") from tactical implementation (the "How"). When agents are tasked with proving lemmas immediately, they often become bogged down in the "tactical weeds," spending excessive context and time on low-level steps that they eventually fail or backtrack upon.

By establishing a "compilable but incomplete" skeleton, the architect fixes the global logical constraints. This prevents the agent from hallucinating divergent logical paths while struggling with local computation.

```lean
-- Example Skeleton State
lemma lemma_one (a b c : Theory) : SBA = a FPC :=
by
  sorry

lemma lemma_two (x y z : Theory) : ... :=
by
  sorry
```

This strategy ensures the formal output remains strictly aligned with the informal human proof. It forces the agent to follow the intended argument structure, resulting in a final product that is not only verified but also readable and debuggable for the human supervisor.

### 4. The Human-Agent Parallel Workflow

The "Parallel Workflow" represents a superior collaboration model where the human and agent operate on different logical tiers simultaneously. Rather than a sequential hand-off, the human performs high-level abstractions or manual tactical fixes while the agent concurrently handles the mechanization of the next phase.

A prime example of this is the extraction of a **Key Equation Lemma** (or "Slapped Ideal" lemma). While the agent is busy skeletonizing or filling routine "sorries" for a secondary lemma, the human architect may identify a repeating logical pattern and manually extract it into a standalone lemma. This simplifies the proof state and prevents the agent from struggling with redundant logic.

#### **Level of Automation Decision Matrix**

| Task Type                  | Assigned To | Reasoning                                                    |
| -------------------------- | ----------- | ------------------------------------------------------------ |
| **Skeletonization**        | Agent       | High-throughput structural task; establishes global state.   |
| **Routine Proof Filling**  | Agent       | Mechanization of established logical steps.                  |
| **Error Correction**       | Human       | Required when agent enters a backtracking loop (stochastic wandering). |
| **High-level Abstraction** | Human       | Identifying and extracting standalone lemmas (e.g., Slapped Ideal) to simplify the overall architecture. |

### 5. Overcoming Technical Bottlenecks: Tokens, Logic, and Crashes

Current LLM agents are high-throughput but low-judgment engines. Navigating their limitations requires "constrained autonomy"—intervening at specific failure modes observed during long-range tasks.

- **Context Window Pollution:** Unstructured tasks quickly deplete the context window with failed proof attempts.
  - *Counter-Strategy:* Use the step-by-step recipe to clear the context and focus the agent on a single, isolated `sorry` at a time.
- **Logic Drift & Over-expansion:** Agents may expand terms too aggressively. A common error involves expanding a term like S_A twice when the proof requires only a single expansion to allow for cancellation.
  - *Counter-Strategy:* Manually intervene using the `congr` tactic or provide a "one-liner" hint to force the agent back onto a simplified, readable path.
- **Backtracking Fatigue:** Agents burn significant tokens by repeatedly failing and retrying the same incorrect tactical branch.
  - *Counter-Strategy:* When an agent begins to loop, the human must provide a manual tactical intervention or extract a new lemma to reduce the complexity of the current goal.

### 6. Conclusion: The Future of Formalization via Agent Orchestration

The transition from "AI as a tool" to "AI as an agent" fundamentally redefines the mathematician’s role. Success is no longer measured simply by a finished proof, but by the mathematician’s ability to act as an architect who ensures the formalization is aligned with human reasoning and structured for long-term maintenance. Maintaining this alignment prevents the architect from "turning their brain off," ensuring they retain the ability to debug and refactor the code as the project evolves.

#### **Best Practices Checklist**

- **[ ] Define Step 0:** Establish all notation and symbolic shortcuts (e.g., S and F) before the first lemma.
- **[ ] Skeletonize First:** Use `sorry` to map the global proof architecture before committing to local proofs.
- **[ ] Decouple Tiers:** Tackle complex abstractions manually while delegating routine mechanization to the agent.
- **[ ] Monitor Expansion:** Intervene immediately if the agent produces unreadable, "over-expanded" code blocks.
- **[ ] Ensure 1:1 Parity:** Maintain strict alignment between informal proof lines and Lean code blocks to facilitate human-in-the-loop debugging.