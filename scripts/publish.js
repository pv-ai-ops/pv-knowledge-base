const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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

function createSafeAssetFileName(assetFile, prefix, targetAssetsDir) {
  const ext = path.extname(assetFile);
  const extLower = ext ? ext.toLowerCase() : '';
  const baseName = ext ? path.basename(assetFile, ext) : assetFile;

  let safeBase = createSafeFileName(baseName).toLowerCase();
  if (!safeBase) {
    safeBase = crypto.createHash('sha1').update(assetFile).digest('hex').slice(0, 16);
  }

  // 防止超长文件名导致文件系统限制
  const maxBaseLength = 120;
  if (safeBase.length > maxBaseLength) {
    const hash = crypto.createHash('sha1').update(assetFile).digest('hex').slice(0, 10);
    safeBase = safeBase.slice(0, maxBaseLength) + '-' + hash;
  }

  let candidate = `${prefix}${safeBase}${extLower}`;
  let counter = 1;
  while (fs.existsSync(path.join(targetAssetsDir, candidate))) {
    candidate = `${prefix}${safeBase}-${counter}${extLower}`;
    counter += 1;
  }
  return candidate;
}

function sanitizeUrlForMarkdown(url) {
  const trimmed = url.trim();
  if (!/\s/.test(trimmed) && !/[()]/.test(trimmed)) {
    return trimmed;
  }

  return trimmed
    .replace(/%(?![0-9A-Fa-f]{2})/g, '%25')
    .replace(/\s/g, '%20')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function sanitizeMarkdownHttpLinks(markdown) {
  const lines = markdown.split(/\r?\n/);
  let inFence = false;
  let fenceMarker = null;

  const sanitized = lines.map(line => {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (marker === fenceMarker) {
        inFence = false;
        fenceMarker = null;
      }
      return line;
    }

    if (inFence) {
      return line;
    }

    return line.replace(/\]\(\s*(https?:\/\/[^)]+?)\s*\)/g, (match, url) => {
      const sanitizedUrl = sanitizeUrlForMarkdown(url);
      return `](${sanitizedUrl})`;
    });
  });

  return sanitized.join('\n');
}

function sanitizeMarkdownForPublish(content) {
  if (!content.startsWith('---')) {
    return sanitizeMarkdownHttpLinks(content);
  }

  const frontMatterMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!frontMatterMatch) {
    return sanitizeMarkdownHttpLinks(content);
  }

  const frontMatter = frontMatterMatch[0];
  const body = content.slice(frontMatter.length);
  return frontMatter + sanitizeMarkdownHttpLinks(body);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function pickPreferredFileByExtension(files) {
  if (!files || files.length === 0) return null;

  const preferred = ['.webp', '.jpg', '.jpeg', '.png'];
  const ranked = files
    .slice()
    .sort((a, b) => {
      const extA = path.extname(a).toLowerCase();
      const extB = path.extname(b).toLowerCase();
      const rankA = preferred.includes(extA) ? preferred.indexOf(extA) : preferred.length;
      const rankB = preferred.includes(extB) ? preferred.indexOf(extB) : preferred.length;
      if (rankA !== rankB) return rankA - rankB;
      return a.localeCompare(b);
    });

  return ranked[0] || null;
}

function isSupportedImage(file) {
  const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp']);
  return imageExts.has(path.extname(file).toLowerCase());
}

function findCoverFileByBaseName(files, baseName) {
  if (!files || files.length === 0) return null;
  const candidates = files
    .filter(file => !file.endsWith(':Zone.Identifier'))
    .filter(isSupportedImage)
    .filter(file => path.basename(file, path.extname(file)) === baseName);
  return pickPreferredFileByExtension(candidates);
}

function createSafeCoverFileName(baseName, ext, targetDir) {
  const extLower = ext ? ext.toLowerCase() : '';

  let safeBase = createSafeFileName(baseName);
  if (!safeBase) {
    safeBase = crypto.createHash('sha1').update(baseName).digest('hex').slice(0, 16);
  }

  const maxBaseLength = 120;
  if (safeBase.length > maxBaseLength) {
    const hash = crypto.createHash('sha1').update(baseName).digest('hex').slice(0, 10);
    safeBase = safeBase.slice(0, maxBaseLength) + '-' + hash;
  }

  let candidate = `${safeBase}${extLower}`;
  let counter = 1;
  while (fs.existsSync(path.join(targetDir, candidate))) {
    candidate = `${safeBase}-${counter}${extLower}`;
    counter += 1;
  }

  return candidate;
}

function processCover(inboxDir, sourceDir, baseName) {
  const coversDir = path.join(inboxDir, 'covers');
  if (!fs.existsSync(coversDir)) return null;

  const coverFiles = fs.readdirSync(coversDir);
  const coverFile = findCoverFileByBaseName(coverFiles, baseName);
  if (!coverFile) return null;

  const coverSourcePath = path.join(coversDir, coverFile);
  const coverExt = path.extname(coverFile);

  const coversTargetDir = path.join(sourceDir, 'assets', 'covers');
  ensureDir(coversTargetDir);

  const coverTargetFileName = createSafeCoverFileName(baseName, coverExt, coversTargetDir);
  const coverTargetPath = path.join(coversTargetDir, coverTargetFileName);
  fs.copyFileSync(coverSourcePath, coverTargetPath);
  fs.unlinkSync(coverSourcePath);

  const zoneIdentifierPath = path.join(coversDir, `${coverFile}:Zone.Identifier`);
  if (fs.existsSync(zoneIdentifierPath)) {
    fs.unlinkSync(zoneIdentifierPath);
  }

  console.log(`  🖼️ 处理封面: covers/${coverFile} → covers/${coverTargetFileName}`);
  return `/assets/covers/${coverTargetFileName}`;
}

function ensurePhotosFrontMatter(markdown, photoUrl) {
  if (!photoUrl) return markdown;
  if (!markdown.startsWith('---')) return markdown;

  const frontMatterMatch = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!frontMatterMatch) return markdown;

  const frontMatter = frontMatterMatch[0];
  if (/^photos\s*:/m.test(frontMatter)) return markdown;

  const newline = frontMatter.includes('\r\n') ? '\r\n' : '\n';
  const lines = frontMatter.split(/\r?\n/);
  const closingIndex = lines.findIndex((line, idx) => idx > 0 && line.trim() === '---');
  if (closingIndex === -1) return markdown;

  const findLastIndex = predicate => {
    let found = -1;
    for (let i = 0; i < closingIndex; i += 1) {
      if (predicate(lines[i])) found = i;
    }
    return found;
  };

  const afterDate = findLastIndex(line => /^date\s*:/i.test(line));
  const afterTitle = findLastIndex(line => /^title\s*:/i.test(line));
  const insertIndex = (afterDate !== -1 ? afterDate : afterTitle !== -1 ? afterTitle : 0) + 1;

  const photoLine = `photos: [\"${photoUrl}\"]`;
  lines.splice(Math.min(insertIndex, closingIndex), 0, photoLine);

  const updatedFrontMatter = lines.join(newline);
  return updatedFrontMatter + markdown.slice(frontMatter.length);
}

function ensureCoverFrontMatter(markdown, coverUrl) {
  if (!coverUrl) return markdown;
  if (!markdown.startsWith('---')) return markdown;

  const frontMatterMatch = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!frontMatterMatch) return markdown;

  const frontMatter = frontMatterMatch[0];
  if (/^cover\s*:/m.test(frontMatter)) return markdown;

  const newline = frontMatter.includes('\r\n') ? '\r\n' : '\n';
  const lines = frontMatter.split(/\r?\n/);
  const closingIndex = lines.findIndex((line, idx) => idx > 0 && line.trim() === '---');
  if (closingIndex === -1) return markdown;

  const findLastIndex = predicate => {
    let found = -1;
    for (let i = 0; i < closingIndex; i += 1) {
      if (predicate(lines[i])) found = i;
    }
    return found;
  };

  const afterDate = findLastIndex(line => /^date\s*:/i.test(line));
  const afterTitle = findLastIndex(line => /^title\s*:/i.test(line));
  const insertIndex = (afterDate !== -1 ? afterDate : afterTitle !== -1 ? afterTitle : 0) + 1;

  const coverLine = `cover: \"${coverUrl}\"`;
  lines.splice(Math.min(insertIndex, closingIndex), 0, coverLine);

  const updatedFrontMatter = lines.join(newline);
  return updatedFrontMatter + markdown.slice(frontMatter.length);
}

function copyDirSync(sourceDir, targetDir) {
  ensureDir(targetDir);
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  entries.forEach(entry => {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(sourcePath, targetPath);
      return;
    }

    if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensurePdfJsAssets(sourceDir) {
  const repoRoot = path.join(__dirname, '..');
  const pdfjsRoot = path.join(repoRoot, 'node_modules', 'pdfjs-dist');
  if (!fs.existsSync(pdfjsRoot)) {
    console.log('  ⚠️ 未检测到 pdfjs-dist，跳过 PDF 预览器资源准备');
    return false;
  }

  const targetDir = path.join(sourceDir, 'assets', 'pdfjs');
  ensureDir(targetDir);

  const resolveFirstExisting = candidates => {
    for (const relativePath of candidates) {
      const fullPath = path.join(pdfjsRoot, relativePath);
      if (fs.existsSync(fullPath)) return fullPath;
    }
    return null;
  };

  const pdfBundleSource = resolveFirstExisting([
    'build/pdf.min.js',
    'build/pdf.js',
    'legacy/build/pdf.min.js',
    'legacy/build/pdf.js'
  ]);
  const workerSource = resolveFirstExisting([
    'build/pdf.worker.min.js',
    'build/pdf.worker.js',
    'legacy/build/pdf.worker.min.js',
    'legacy/build/pdf.worker.js'
  ]);

  if (!pdfBundleSource || !workerSource) {
    console.log('  ⚠️ 未找到可用的 pdf.js 构建产物，跳过 PDF 预览器资源准备');
    return false;
  }

  const pdfBundleTarget = path.join(targetDir, 'pdf.min.js');
  const workerTarget = path.join(targetDir, 'pdf.worker.min.js');

  if (!fs.existsSync(pdfBundleTarget)) {
    fs.copyFileSync(pdfBundleSource, pdfBundleTarget);
  }

  if (!fs.existsSync(workerTarget)) {
    fs.copyFileSync(workerSource, workerTarget);
  }

  // Optional: cmaps + standard fonts (improve rendering compatibility)
  const cmapsSource = resolveFirstExisting(['cmaps', 'legacy/cmaps']);
  const fontsSource = resolveFirstExisting(['standard_fonts', 'legacy/standard_fonts']);

  if (cmapsSource) {
    const cmapsTarget = path.join(targetDir, 'cmaps');
    if (!fs.existsSync(cmapsTarget)) {
      copyDirSync(cmapsSource, cmapsTarget);
    }
  }

  if (fontsSource) {
    const fontsTarget = path.join(targetDir, 'standard_fonts');
    if (!fs.existsSync(fontsTarget)) {
      copyDirSync(fontsSource, fontsTarget);
    }
  }

  return true;
}

async function extractPdfTextForSearch(pdfPath, { maxChars = 200000 } = {}) {
  let pdfjsLib;
  const originalWarn = console.warn;
  try {
    console.warn = (...args) => {
      const message = args.map(String).join(' ');
      if (message.includes('Cannot polyfill `DOMMatrix`') || message.includes('Cannot polyfill `Path2D`')) {
        return;
      }
      originalWarn(...args);
    };

    // Use legacy build for Node.js compatibility
    pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  } catch (error) {
    console.log('  ⚠️ 无法加载 pdfjs-dist（将跳过PDF文本抽取，站内搜索不包含PDF全文）');
    return '';
  } finally {
    console.warn = originalWarn;
  }

  let doc;
  try {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    doc = await pdfjsLib.getDocument({ data, disableWorker: true }).promise;
  } catch (error) {
    console.log(`  ⚠️ PDF解析失败（跳过全文索引）: ${error.message}`);
    return '';
  }

  const parts = [];
  let totalLength = 0;

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ').replace(/\u0000/g, '');
    if (!pageText) continue;

    parts.push(pageText);
    totalLength += pageText.length + 1;
    if (totalLength >= maxChars) break;
  }

  const text = parts.join(' ').replace(/\s+/g, ' ').trim();
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

function loadPdfSidecarText(pdfDir, pdfFile) {
  const baseName = path.basename(pdfFile, path.extname(pdfFile));
  const candidates = [`${baseName}.search.txt`, `${baseName}.txt`, `${baseName}.md`];
  for (const candidate of candidates) {
    const candidatePath = path.join(pdfDir, candidate);
    if (!fs.existsSync(candidatePath)) continue;
    try {
      const raw = fs.readFileSync(candidatePath, 'utf8');
      const text = raw.replace(/\u0000/g, '').trim();
      if (!text) continue;
      return { text, path: candidatePath };
    } catch (error) {
      console.log(`  ⚠️ 读取PDF索引侧车文件失败: ${candidate} (${error.message})`);
      continue;
    }
  }
  return null;
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
    let coverPhotoUrl = null;

    coverPhotoUrl = processCover(inboxDir, sourceDir, originalTitle);

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

        const newAssetFileName = createSafeAssetFileName(assetFile, articlePrefix, path.join(sourceDir, 'assets'));
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

    content = sanitizeMarkdownForPublish(content);

    // 检查是否已有Front Matter
    let finalContent = content;
    if (!content.startsWith('---')) {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');

      finalContent = `---
title: ${originalTitle}
date: ${dateStr}
${coverPhotoUrl ? `cover: \"${coverPhotoUrl}\"\n` : ''}tags: [AI]
categories: [技术分析]
---

${content}`;
    }

    if (coverPhotoUrl) {
      finalContent = ensureCoverFrontMatter(finalContent, coverPhotoUrl);
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

    const coverPhotoUrl = processCover(inboxDir, sourceDir, htmlFileName);

    const markdownContent = `---
title: ${htmlFileName}
date: ${dateStr}
${coverPhotoUrl ? `cover: \"${coverPhotoUrl}\"\n` : ''}tags: [AI, 交互式工具]
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

async function processPdf(inboxDir, sourceDir) {
  let processedFiles = 0;
  const pdfDir = path.join(inboxDir, 'pdf');
  if (!fs.existsSync(pdfDir)) {
    return processedFiles;
  }

  const pdfFiles = fs
    .readdirSync(pdfDir)
    .filter(file => file.toLowerCase().endsWith('.pdf') && !file.endsWith(':Zone.Identifier'));

  if (pdfFiles.length === 0) {
    return processedFiles;
  }

  const hasPdfJs = ensurePdfJsAssets(sourceDir);

  for (const file of pdfFiles) {
    const sourcePath = path.join(pdfDir, file);
    const originalTitle = path.basename(file, '.pdf');
    const displayTitle = originalTitle.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

    const safePdfFileName = createSafeAssetFileName(file, '', path.join(sourceDir, 'assets'));
    const targetPdfPath = path.join(sourceDir, 'assets', safePdfFileName);
    fs.copyFileSync(sourcePath, targetPdfPath);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');
    const coverPhotoUrl = processCover(inboxDir, sourceDir, originalTitle);

    const viewerSrc = `/pv-knowledge-base/pdf-slides.html?file=${encodeURIComponent(
      `assets/${safePdfFileName}`
    )}&title=${encodeURIComponent(displayTitle || originalTitle)}`;

    let extractedText = '';
    let sidecarPath = null;
    if (hasPdfJs) {
      try {
        extractedText = await extractPdfTextForSearch(targetPdfPath, { maxChars: 200000 });
      } catch (error) {
        console.log(`  ⚠️ PDF全文抽取失败（跳过索引）: ${error.message}`);
      }
    }

    if (!extractedText) {
      const sidecar = loadPdfSidecarText(pdfDir, file);
      if (sidecar && sidecar.text) {
        extractedText = sidecar.text;
        sidecarPath = sidecar.path;
        console.log(`  🔎 使用侧车索引文件: ${path.basename(sidecarPath)}`);
      }
    }

    const searchIndexBlock = extractedText
      ? `\n<div class="pdf-search-index" style="display:none">\n${escapeHtml(extractedText)}\n</div>\n`
      : '\n<!-- PDF全文索引未生成（可能缺少pdfjs-dist或解析失败） -->\n';

    const markdownContent = `---
title: ${displayTitle || originalTitle}
date: ${dateStr}
${coverPhotoUrl ? `cover: \"${coverPhotoUrl}\"\n` : ''}tags: [AI, PDF]
categories: [资料库]
---

## 📄 PDF 文档

- 在线预览（幻灯片模式）：<a href="${viewerSrc}" target="_blank" rel="noopener">点击打开</a>
- 下载：[/assets/${safePdfFileName}](/assets/${safePdfFileName})

---

## 🖥️ 幻灯片预览（支持全屏）

<iframe src="${viewerSrc}" frameborder="0" allowfullscreen style="width: 100%; height: 82vh; min-height: 520px; max-height: 1200px; border: 1px solid #e1e5e9; border-radius: 8px; margin: 20px 0;"></iframe>
${searchIndexBlock}`;

    const safeMarkdownFileName = createSafeFileName(displayTitle || originalTitle) + '.md';
    const markdownPath = path.join(sourceDir, '_posts', safeMarkdownFileName);
    fs.writeFileSync(markdownPath, markdownContent);

    fs.unlinkSync(sourcePath);
    if (sidecarPath && fs.existsSync(sidecarPath)) {
      fs.unlinkSync(sidecarPath);
    }

    console.log(`✅ 处理PDF: ${file} -> assets/${safePdfFileName} (创建文章 + 幻灯片预览${extractedText ? ' + 全文索引' : ''})`);
    processedFiles += 1;
  }

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

async function main(argv = process.argv.slice(2)) {
  const shouldPreview = argv.includes('--preview') || process.env.PUBLISH_PREVIEW === '1';

  console.log('🚀 开始处理content-inbox中的新内容...');

  const inboxDir = path.join(__dirname, '../content-inbox');
  const sourceDir = path.join(__dirname, '../source');

  ensureDir(path.join(inboxDir, 'markdown'));
  ensureDir(path.join(inboxDir, 'html'));
  ensureDir(path.join(inboxDir, 'covers'));
  ensureDir(path.join(inboxDir, 'assets'));
  ensureDir(path.join(inboxDir, 'pdf'));

  ensureDir(path.join(sourceDir, '_posts'));
  ensureDir(path.join(sourceDir, 'assets'));
  ensureDir(path.join(sourceDir, 'assets', 'covers'));

  let processedFiles = 0;
  processedFiles += processMarkdown(inboxDir, sourceDir);
  processedFiles += processHtml(inboxDir, sourceDir);
  processedFiles += await processPdf(inboxDir, sourceDir);
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
  main().catch(error => {
    console.error('❌ 发布脚本执行失败:', error);
    process.exitCode = 1;
  });
} else {
  module.exports = {
    createSafeFileName,
    findCoverFileByBaseName,
    processCover,
    ensureCoverFrontMatter,
    ensurePhotosFrontMatter,
    main
  };
}
