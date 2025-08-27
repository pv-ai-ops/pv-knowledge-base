const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始处理content-inbox中的新内容...');

const inboxDir = path.join(__dirname, '../content-inbox');
const sourceDir = path.join(__dirname, '../source');

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
    
    // 检查是否已有Front Matter
    let finalContent = content;
    if (!content.startsWith('---')) {
      const title = path.basename(file, '.md');
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');
      
      finalContent = `---
title: ${title}
date: ${dateStr}
tags: [药物警戒, AI]
categories: [技术分析]
---

${content}`;
    }
    
    // 移动到_posts目录
    const targetPath = path.join(sourceDir, '_posts', file);
    fs.writeFileSync(targetPath, finalContent);
    fs.unlinkSync(sourcePath);
    
    console.log(`✅ 处理Markdown: ${file}`);
    processedFiles++;
  });
}

// 处理HTML文件
const htmlDir = path.join(inboxDir, 'html');
if (fs.existsSync(htmlDir)) {
  const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
  
  htmlFiles.forEach(file => {
    const sourcePath = path.join(htmlDir, file);
    const targetPath = path.join(sourceDir, file);
    
    fs.copyFileSync(sourcePath, targetPath);
    fs.unlinkSync(sourcePath);
    
    console.log(`✅ 处理HTML应用: ${file}`);
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