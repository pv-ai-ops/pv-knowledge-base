const { spawnSync } = require('child_process');

function killByPort(port) {
  const result = spawnSync('lsof', ['-ti', `:${port}`], { encoding: 'utf8' });
  if (result.status !== 0 || !result.stdout.trim()) {
    return false;
  }

  const pids = result.stdout.trim().split(/\s+/);
  let killed = false;

  pids.forEach(pid => {
    try {
      process.kill(Number(pid), 'SIGTERM');
      console.log(`Stopped process ${pid} on port ${port}`);
      killed = true;
    } catch (error) {
      console.warn(`Failed to stop process ${pid}: ${error.message}`);
    }
  });

  return killed;
}

function killByPattern(pattern) {
  const result = spawnSync('pkill', ['-f', pattern]);
  return result.status === 0;
}

function main() {
  const stoppedByPort = killByPort(4000);
  const stoppedByPattern = stoppedByPort ? false : killByPattern('hexo(.*)server');
  const stoppedFallback = stoppedByPort || stoppedByPattern ? false : killByPattern('hexo');

  if (stoppedByPort || stoppedByPattern || stoppedFallback) {
    console.log('Hexo preview server stopped');
  } else {
    console.log('Hexo server not running');
  }
}

if (require.main === module) {
  main();
} else {
  module.exports = { killByPort, killByPattern, main };
}
