const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// 创建URL安全的文件名处理函数
function createSafeFileName(fileName) {
  let safeName = fileName;

  // 先尝试解码URL编码，避免Hexo后续处理时产生不一致
  try {
    safeName = decodeURIComponent(safeName);
  } catch (e) {
    // 如果解码失败，保持原文件名
    console.log(`  ⚠️ URL解码失败，保持原文件名: ${fileName}`);
  }

  return safeName
    .replace(/\s+vs\.\s+/g, '-vs-')         // "vs." -> "-vs-"
    .replace(/\s*[:：]\s*/g, '-')           // 冒号 -> "-"
    .replace(/\s+/g, '-')                   // 空格 -> "-"
    .replace(/[^\w\u4e00-\u9fa5\-]/g, '')   // 保留字母数字中文和连字符，完全移除%等特殊字符
    .replace(/-+/g, '-')                    // 多个连字符合并
    .replace(/^-|-$/g, '');                 // 移除首尾连字符
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function processMarkdown(inboxDir, sourceDir) {
  let processedFiles = 0;
  const markdownDir = path.join(inboxDir, 'markdown');
  if (!fs.existsSync(markdownDir)) {
    return processedFiles;
  }

  const markdownFiles = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));
  markdownFiles.forEach(file => {
    const sourcePath = path.join(markdownDir, file);
    let content = fs.readFileSync(sourcePath, 'utf8');

    // 生成URL安全的文件名
    const originalTitle = path.basename(file, '.md');
    const safeFileName = createSafeFileName(originalTitle) + '.md';

    // 检查是否有同名的.assets文件夹
    const assetsDir = path.join(markdownDir, originalTitle + '.assets');
    if (fs.existsSync(assetsDir)) {
      console.log(`📁 发现关联assets文件夹: ${originalTitle}.assets`);

      // 生成文章唯一前缀（防止图片命名冲突）
      const articlePrefix = createSafeFileName(originalTitle).toLowerCase() + '-';
      console.log(`  🏷️ 使用前缀: ${articlePrefix}`);

      // 复制.assets文件夹中的图片文件到source/assets，添加唯一前缀
      const assetFiles = fs.readdirSync(assetsDir);
      const assetMapping = new Map(); // 记录原文件名→新文件名的映射

      assetFiles.forEach(assetFile => {
        // 跳过Zone.Identifier文件
        if (assetFile.endsWith(':Zone.Identifier')) {
          return;
        }

        const assetSourcePath = path.join(assetsDir, assetFile);

        // 为图片添加文章唯一前缀
        const newAssetFileName = articlePrefix + assetFile.toLowerCase();
        const assetTargetPath = path.join(sourceDir, 'assets', newAssetFileName);

        // 记录文件名映射关系
        assetMapping.set(assetFile, newAssetFileName);

        fs.copyFileSync(assetSourcePath, assetTargetPath);
        console.log(`  📎 复制资源: ${assetFile} → ${newAssetFileName}`);
      });

      // 更新markdown内容中的图片路径和文件名
      assetMapping.forEach((newFileName, oldFileName) => {
        // 使用正确的路径格式（避免重复路径问题）
        const oldImageRef = new RegExp(
          `${originalTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.assets/${oldFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
          'g'
        );
        const newImageRef = `/assets/${newFileName}`;

        content = content.replace(oldImageRef, newImageRef);
        console.log(`  🔗 更新图片引用: ${originalTitle}.assets/${oldFileName} → ${newImageRef}`);
      });

      // 如果还有其他通用的assets路径需要修正
      const genericOldPathPattern = new RegExp(`${originalTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.assets/`, 'g');
      content = content.replace(genericOldPathPattern, '/assets/');
      console.log(`  📝 通用路径修正: ${originalTitle}.assets/ → /assets/`);

      // 清理可能残留的 ./assets/ 相对路径前缀
      content = content.replace(/\.\/*assets\//g, '/assets/');
      console.log('  🧹 去除残留的 ./assets/ 前缀');

      // 删除原始.assets文件夹
      fs.rmSync(assetsDir, { recursive: true });
      console.log('  🗑️ 清理原始assets文件夹');
    }

    // 检查是否已有Front Matter
    let finalContent = content;
    if (!content.startsWith('---')) {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');

      finalContent = `---
title: ${originalTitle}
date: ${dateStr}
tags: [药物警戒, AI]
categories: [技术分析]
---

${content}`;
    }

    // 使用安全的文件名移动到_posts目录
    const targetPath = path.join(sourceDir, '_posts', safeFileName);
    fs.writeFileSync(targetPath, finalContent);
    fs.unlinkSync(sourcePath);

    console.log(`✅ 处理Markdown: ${file} -> ${safeFileName}`);
    processedFiles++;
  });

  return processedFiles;
}

function processHtml(inboxDir, sourceDir) {
  let processedFiles = 0;
  const htmlDir = path.join(inboxDir, 'html');
  if (!fs.existsSync(htmlDir)) {
    return processedFiles;
  }

  const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => {
    const sourcePath = path.join(htmlDir, file);
    const htmlFileName = path.basename(file, '.html');

    // 使用统一的文件名安全处理函数
    const safeFileName = createSafeFileName(htmlFileName) + '.html';

    // 1. 复制HTML到source根目录 (用于直接访问)
    const targetHtmlPath = path.join(sourceDir, safeFileName);
    fs.copyFileSync(sourcePath, targetHtmlPath);

    // 2. 创建对应的Markdown文章 (用于在文章列表中显示)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');

    const markdownContent = `---
title: ${htmlFileName}
date: ${dateStr}
tags: [药物警戒, AI, 交互式工具]
categories: [技术分析]
---

## 交互式分析工具

这是一个交互式的技术分析工具，提供动态数据可视化和深度对比功能。

---

## 📱 完整交互式应用

<iframe src="/pv-knowledge-base/${safeFileName}" width="100%" height="1200px" frameborder="0" style="border: 1px solid #e1e5e9; border-radius: 8px; margin: 20px 0;"></iframe>

---

## 工具特性

该工具包含：
- 动态图表和可视化
- 交互式数据对比 
- 实时参数调整
- 专业的技术分析

上方为完整功能的交互式应用，支持所有动态功能和数据可视化。`;

    const safeMarkdownFileName = createSafeFileName(htmlFileName) + '.md';
    const markdownPath = path.join(sourceDir, '_posts', safeMarkdownFileName);
    fs.writeFileSync(markdownPath, markdownContent);

    fs.unlinkSync(sourcePath);

    console.log(`✅ 处理HTML应用: ${file} -> ${safeFileName} (创建文章 + 保留交互功能)`);
    processedFiles++;
  });

  return processedFiles;
}

function processAssets(inboxDir, sourceDir) {
  let processedFiles = 0;
  const assetsDir = path.join(inboxDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    return processedFiles;
  }

  const assetFiles = fs.readdirSync(assetsDir);
  assetFiles.forEach(file => {
    const sourcePath = path.join(assetsDir, file);
    const targetPath = path.join(sourceDir, 'assets', file);

    fs.copyFileSync(sourcePath, targetPath);
    fs.unlinkSync(sourcePath);

    console.log(`✅ 处理资源文件: ${file}`);
    processedFiles++;
  });

  return processedFiles;
}

function buildSite({ shouldPreview }) {
  console.log('📝 正在执行 hexo clean && hexo generate ...');
  try {
    execSync('hexo clean && hexo generate', { stdio: 'inherit' });
    console.log('✅ 静态文件已生成到 docs/ 目录');

    if (shouldPreview) {
      console.log('🌐 正在后台启动预览服务器: http://localhost:4000/pv-knowledge-base/');
      const child = spawn('hexo', ['server'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'ignore',
        detached: true
      });
      child.unref();
      console.log('ℹ️ 预览已在后台运行。完成检查后可运行 `npm run preview:stop` 或执行 `pkill -f \"hexo server\"` 手动结束。');
    } else {
      console.log('ℹ️ 预览未自动启动。如需本地预览请运行 `npm run preview` 或在命令后追加 `--preview`。');
    }
  } catch (error) {
    console.error('❌ 生成或启动服务器失败:', error.message);
  }
}

function main(argv = process.argv.slice(2)) {
  const shouldPreview = argv.includes('--preview') || process.env.PUBLISH_PREVIEW === '1';

  console.log('🚀 开始处理content-inbox中的新内容...');

  const inboxDir = path.join(__dirname, '../content-inbox');
  const sourceDir = path.join(__dirname, '../source');

  ensureDir(path.join(sourceDir, '_posts'));
  ensureDir(path.join(sourceDir, 'assets'));

  let processedFiles = 0;
  processedFiles += processMarkdown(inboxDir, sourceDir);
  processedFiles += processHtml(inboxDir, sourceDir);
  processedFiles += processAssets(inboxDir, sourceDir);

  console.log(`\n🎉 处理完成! 共处理 ${processedFiles} 个文件`);

  const needsBuild = processedFiles > 0 || shouldPreview;
  if (!needsBuild) {
    console.log('📭 inbox为空，无需处理');
    return;
  }

  buildSite({ shouldPreview });
}

if (require.main === module) {
  main();
} else {
  module.exports = { createSafeFileName, main };
}
