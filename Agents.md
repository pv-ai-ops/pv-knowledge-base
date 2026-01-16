# PV Knowledge Base – Agent Operating Guide

## 1. 项目概览
- 基于 Hexo 7.x 的静态知识库，源码位于 `source/`，构建产物输出到 `docs/` 并由 GitHub Pages 托管。
- 所有原始素材先进入 `content-inbox/`，通过自动化脚本完成整理、发布预览和上线。
- 文章访问根路径为 `/pv-knowledge-base/`，确保所有链接与资源引用使用站点根目录。

## 2. 目录与素材投放
- `content-inbox/markdown/`：放置待发布的 Markdown 文章；若存在同名 `*.assets/` 文件夹，内部资源将一并处理。
- `content-inbox/html/`：放置需要保留交互功能的 HTML 文件；脚本会复制原文件并自动生成一篇引用 iframe 的 Markdown 文章。
- `content-inbox/pdf/`：放置需要以“幻灯片/PPT”形式预览的 PDF 文件；脚本会复制到站点资源目录，自动生成一篇包含 iframe 预览/下载链接的 Markdown 文章，并抽取 PDF 文本用于站内搜索（若PDF无文本层，可提供同名 `.search.txt`/`.txt`/`.md` 作为索引侧车）。
- `content-inbox/covers/`：文章封面图片（与正文 assets 拆分）；文件名必须与对应 Markdown/HTML/PDF 的文件名基名一致（不含扩展名），例如 `Foo.md` → `covers/Foo.jpg`；未提供则默认不展示封面。
- `content-inbox/assets/`：公共共享资源（图片、附件等），会被复制到站点资源目录。
- 不要手动修改 `source/` 与 `docs/` 中的文件；所有调整通过重新投放素材 + 发布脚本完成。

## 2.1 文章封面规范（方案 A / NexT photos）
- 封面是“显式启用”：仅当 `content-inbox/covers/` 中存在同名封面文件时才展示；否则隐藏（默认）。
- 命名规则：`covers/<文章文件名基名>.<ext>`（基名必须与 Markdown/HTML/PDF 文件一致），例如 `小儿自闭症成因探究.md` → `covers/小儿自闭症成因探究.jpg`。
- 支持的图片格式（白名单）：`jpg/jpeg/png/webp`；若同一基名存在多个扩展名，优先选择 `webp > jpg > jpeg > png`。
- 脚本会将封面写入文章 Front Matter：`cover: "/assets/covers/..."`（封面元数据与正文图片分离）；正文图片仍使用 Markdown 图片语法。
- Hexo 生成阶段会自动将 `cover` 映射为 NexT 所需的 `photos`（仅当文章未显式配置 `photos` 时），以复用主题现成的封面渲染能力。
- 如需强制不显示封面：可在文章 Front Matter 显式写 `cover: false`（脚本不会覆盖已有 `cover`）。

## 3. 自动化处理流程
1. 执行 `npm run publish`（默认仅搬运素材并生成静态页）。
2. `scripts/publish.js` 会：
   - 读取 `content-inbox/markdown/`：补充 Front Matter、生成安全文件名、写入 `source/_posts/`。
   - 找到关联的 `*.assets/`：按文章标题生成唯一前缀，复制至 `source/assets/` 并重写 Markdown 中的图片引用为 `/assets/<prefixed-name>`，避免部署路径失效。
   - 读取 `content-inbox/covers/`：若存在与文章同名基名的封面图片，复制至 `source/assets/covers/` 并写入文章 Front Matter `cover`（未提供则不展示）。
   - 解析 `content-inbox/html/`：复制 HTML 到 `source/` 根目录，并生成嵌入 `<iframe>` 的 Markdown 文章以便出现在文章索引。
   - 复制 `content-inbox/assets/` 下的文件到 `source/assets/`。
3. 处理完成后脚本会运行 `hexo clean && hexo generate` 完成 `docs/` 目录更新；若需要自动启动预览，可在命令后追加 `--preview`、执行 `npm run publish:preview`，或设置 `PUBLISH_PREVIEW=1`。
4. 原始素材在成功搬运后会从 `content-inbox/` 中移除，请提前自行备份需要长期保留的源文件。
5. 如果访问 `http://localhost:4000/pv-knowledge-base/` 仍能打开页面，说明预览进程尚未停止，应立即运行 `npm run preview:stop`。

## 4. 常用命令
- `npm run publish`：执行全量处理 + 构建；如需自动预览执行 `npm run publish:preview` 或 `npm run publish -- --preview`（后台启动，完成后运行 `npm run preview:stop` 关闭）。
- `npm run preview`：清理、构建并启动 Hexo 预览服务器；适用于无需重复搬运内容时的检查，同样通过 `Ctrl+C` 结束。
- `npm run preview:stop`：通过进程搜索关闭所有正在运行的 Hexo 预览实例。
- `npm run build`：仅构建静态内容到 `docs/`。
- `npm run clean`：清理 Hexo 缓存文件。
- `npm run deploy`：在确认预览正确后执行，提交并推送 `doc-page` 分支以发布到 GitHub Pages。

## 5. 发布前检查清单
- [ ] 本地预览无 404、样式错乱或脚本报错。
- [ ] 图片与附件引用均为 `/assets/...` 绝对路径，页面显示正常。
- [ ] Front Matter 中 `title`、`date`、`tags`、`categories` 合理且无需手动调整。
- [ ] 新增交互式 HTML 页面在 Markdown 文章中 iframe 嵌入正常工作。
- [ ] Git 状态仅包含与本次发布相关的改动，准备好提交信息。

## 6. 注意事项
- 保持 Markdown 文件使用 UTF-8，无需额外 BOM。
- 避免在自动生成的文件上直接手改，如需调整请修改原始素材并重新执行发布流程。
- 使用 `--preview`/`npm run publish:preview` 会在后台启动预览，完成检查后记得运行 `npm run preview:stop`（脚本会通过端口查杀 Hexo 实例）；直接运行 `npm run preview` 时依旧使用 `Ctrl+C` 结束。
- 若脚本失败或遇到特殊场景（例如需保留未压缩的资源目录结构），请记录原因并与团队沟通后再处理。
