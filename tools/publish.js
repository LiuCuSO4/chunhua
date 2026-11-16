#!/usr/bin/env node
/* 一键发布：提交本地改动 → 推送源码 → 等 GitHub Actions 构建完成 */
const { execFileSync, spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REPO = 'LiuCuSO4/chunhua';
const SITE = 'https://liucuso4.github.io/chunhua/';

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', ...opts });
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

try {
  run('git', ['add', '-A']);

  const dirty = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: ROOT }).status !== 0;
  if (dirty) {
    run('git', ['-c', 'user.name=LiuCuSO4', '-c', 'user.email=947235462@qq.com',
      'commit', '-m', `update: ${stamp()}`]);
    console.log('已提交本地改动');
  } else {
    console.log('没有新的改动，直接发布现有版本');
  }

  console.log('上传源码到 main …');
  run('node', [path.join(ROOT, 'tools', 'upload.js'), `update: ${stamp()}`]);

  const list = JSON.parse(run('gh', ['run', 'list', '--repo', REPO, '--limit', '1',
    '--json', 'databaseId,status,headSha']));
  if (!list.length) {
    console.log('没找到构建记录，去 Actions 页面看看：https://github.com/' + REPO + '/actions');
    process.exit(0);
  }

  const runId = list[0].databaseId;
  console.log(`等待构建 #${runId} …（约 1 分钟）`);
  const watch = spawnSync('gh', ['run', 'watch', String(runId), '--repo', REPO,
    '--interval', '10', '--exit-status'], { cwd: ROOT, stdio: 'inherit' });

  if (watch.status === 0) {
    console.log('\n发布完成：' + SITE);
    process.exit(0);
  } else {
    console.log('\n构建失败，查看日志：https://github.com/' + REPO + '/actions/runs/' + runId);
    process.exit(1);
  }
} catch (e) {
  console.error('发布失败：' + (e.message || e));
  process.exit(1);
}
