# 药物警戒知识库 - 内容投放区

## 使用说明

将新内容放入对应目录，然后运行 `npm run publish` 自动发布。

支持两种投放方式：

- **平铺投放**：按 `markdown/`、`pdf/`、`covers/`、`assets/` 等既有目录分别放置文件
- **目录式投放**：在 `content-inbox/` 根目录下为每篇文章新建一个独立目录，目录内放正文 Markdown、1 张封面图、可选 1 个 PDF 附件

### 目录说明

- **markdown/**: 放置 `.md` 格式的博客文章
- **html/**: 放置 `.html` 格式的交互式应用
- **pdf/**: 放置需要发布成“幻灯片预览”的 `.pdf` 文件（会自动生成对应文章并支持站内搜索；如PDF无文本层，可额外提供同名 `.search.txt` 作为索引侧车）
- **covers/**: 放置文章封面图片（与正文 assets 拆分）；文件名需与对应 Markdown/HTML/PDF 基名一致，例如 `Foo.md` → `covers/Foo.jpg`（支持：jpg/jpeg/png/webp；未提供则不展示）
- **assets/**: 放置图片、文档等资源文件

### 目录式投放规则

在 `content-inbox/` 根目录下直接新建文章目录，例如：

```text
content-inbox/
  My Article Bundle/
    My Article.md
    unnamed.png
    Slides.pdf
```

规则如下：

- 每个文章目录必须且只能有 **1 个主 Markdown 文件**
- 可选 **1 个 PDF 文件**，发布后会作为同一篇文章里的在线预览和下载附件
- 可选 **1 张封面图**，支持 `jpg/jpeg/png/webp`，文件名不需要和文章同名，`unnamed.png` 也可以
- 如需给 PDF 提供站内搜索文本，可在同目录放同名侧车：`Slides.search.txt` 或 `Slides.txt`
- 当前 **不直接支持** `.ppt/.pptx`，请先转换为 `.pdf` 再投放
- 当前目录式投放不支持额外正文配图/多附件；如果目录里还有其他文件，发布脚本会跳过该目录并打印错误

### 发布流程

1. 将内容文件放入对应目录
2. 运行 `npm run publish` - 自动处理并启动预览
3. 检查预览效果: http://localhost:4000/pv-knowledge-base/
4. 运行 `npm run deploy` - 推送到GitHub Pages

### 注意事项

- 处理完成后原文件会被自动删除
- 目录式投放成功后，会删除整篇文章的原始目录
- 建议重要文件先备份
- HTML文件会保持原有交互功能
- Windows下载/复制的文件可能会带 `*:Zone.Identifier` 侧车文件，脚本会自动清理
