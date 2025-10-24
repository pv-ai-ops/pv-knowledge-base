const { spawnSync } = require('child_process');

const result = spawnSync('pkill', ['-f', 'hexo server'], {
  stdio: 'inherit',
  shell: false
});

if (result.status === 0) {
  console.log('Hexo server stopped');
} else {
  console.log('Hexo server not running');
}
