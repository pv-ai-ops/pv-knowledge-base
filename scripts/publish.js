const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始处理content-inbox中的新内容...');

const inboxDir = path.join(__dirname, '../content-inbox');
const sourceDir = path.join(__dirname, '../source');

// 创建URL安全的文件名处理函数
function createSafeFileName(fileName) {
  return fileName
    .replace(/\s+vs\.\s+/g, '-vs-')         // "vs." -> "-vs-"
    .replace(/\s*[:：]\s*/g, '-')           // 冒号 -> "-" 
    .replace(/\s+/g, '-')                   // 空格 -> "-"
    .replace(/[^\w\u4e00-\u9fa5\-]/g, '')   // 保留字母数字中文和连字符
    .replace(/-+/g, '-')                    // 多个连字符合并
    .replace(/^-|-$/g, '');                 // 移除首尾连字符
}

// 确保目标目录存在
if (!fs.existsSync(path.join(sourceDir, 'assets'))) {
  fs.mkdirSync(path.join(sourceDir, 'assets'), { recursive: true });
}

let processedFiles = 0;

// 处理Markdown文件
const markdownDir = path.join(inboxDir, 'markdown');
if (fs.existsSync(markdownDir)) {
  const markdownFiles = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));
  
  markdownFiles.forEach(file => {
    const sourcePath = path.join(markdownDir, file);
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // 生成URL安全的文件名
    const originalTitle = path.basename(file, '.md');
    const safeFileName = createSafeFileName(originalTitle) + '.md';
    
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
}

// 处理HTML文件 - 创建对应的Markdown文章并保留HTML文件
const htmlDir = path.join(inboxDir, 'html');
if (fs.existsSync(htmlDir)) {
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
}

// 处理资源文件
const assetsDir = path.join(inboxDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  
  assetFiles.forEach(file => {
    const sourcePath = path.join(assetsDir, file);
    const targetPath = path.join(sourceDir, 'assets', file);
    
    fs.copyFileSync(sourcePath, targetPath);
    fs.unlinkSync(sourcePath);
    
    console.log(`✅ 处理资源文件: ${file}`);
    processedFiles++;
  });
}

console.log(`\n🎉 处理完成! 共处理 ${processedFiles} 个文件`);

if (processedFiles > 0) {
  console.log('📝 正在生成静态文件并启动预览...');
  try {
    execSync('hexo clean && hexo generate', { stdio: 'inherit' });
    console.log('🌐 启动预览服务器: http://localhost:4000/pv-knowledge-base/');
    execSync('hexo server', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ 生成或启动服务器失败:', error.message);
  }
} else {
  console.log('📭 inbox为空，无需处理');
}