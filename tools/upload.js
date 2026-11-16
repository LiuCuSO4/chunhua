/**
 * 通过 GitHub Git Data API 提交本地文件。
 * 用于 github.com:443 被网络阻断、git push 不可用的情况。
 *
 * 用法：node tools/upload.js "提交说明"
 * 依赖：gh（已登录，token 含 repo 权限）
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = 'LiuCuSO4/chunhua';
const BRANCH = 'main';
const ROOT = path.join(__dirname, '..');

const token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();

async function api(method, url, body) {
  const res = await fetch('https://api.github.com' + url, {
    method,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'hexo-blog-uploader',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(method + ' ' + url + ' -> ' + res.status + ' ' + (data.message || text));
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function listFiles() {
  const out = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  return out.split('\0').filter(Boolean);
}

(async () => {
  const message = process.argv[2] || 'update: publish from local';

  const files = listFiles();
  console.log('files:', files.length);

  // 防呆：远端有、本地没有的文件，这次提交会把它们删掉。先列出来让人确认。
  try {
    const remote = await api('GET', `/repos/${REPO}/git/trees/${BRANCH}?recursive=1`);
    const remoteFiles = remote.tree.filter((t) => t.type === 'blob').map((t) => t.path);
    const localSet = new Set(files.map((p) => p.split(path.sep).join('/')));
    const missing = remoteFiles.filter((p) => !localSet.has(p));
    if (missing.length) {
      if (process.env.CONFIRM_PRUNE !== '1') {
        console.error('\n[!] 远端有 ' + missing.length + ' 个文件，本地没有；继续提交会把它们删掉：');
        missing.slice(0, 20).forEach((p) => console.error('    - ' + p));
        console.error('\n先把这些文件同步到本地，或确认要删除后加 CONFIRM_PRUNE=1 重新运行。\n');
        process.exit(1);
      }
      console.log('prune:', missing.length, '个远端文件将被删除');
    }
  } catch (e) {
    if (e.status !== 404) throw e;
  }

  // 1. 上传 blob
  const tree = [];
  let done = 0;
  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    const content = fs.readFileSync(abs).toString('base64');
    const blob = await api('POST', `/repos/${REPO}/git/blobs`, { content, encoding: 'base64' });
    tree.push({ path: rel.split(path.sep).join('/'), mode: '100644', type: 'blob', sha: blob.sha });
    done++;
    if (done % 20 === 0) console.log('  blobs', done + '/' + files.length);
  }

  // 2. 生成 tree
  let newTree;
  try {
    newTree = await api('POST', `/repos/${REPO}/git/trees`, { tree });
  } catch (e) {
    console.error('tree payload entries:', tree.length);
    console.error('first:', JSON.stringify(tree[0]));
    console.error('last:', JSON.stringify(tree[tree.length - 1]));
    console.error('response:', JSON.stringify(e.data));
    throw e;
  }
  console.log('tree:', newTree.sha);

  // 3. 父提交（如果远端已有 main）
  let parents = [];
  try {
    const ref = await api('GET', `/repos/${REPO}/git/ref/heads/${BRANCH}`);
    parents = [ref.object.sha];
    console.log('parent:', ref.object.sha);
  } catch (e) {
    if (e.status !== 404) throw e;
    console.log('no existing branch, creating first commit');
  }

  // 4. 提交
  const commit = await api('POST', `/repos/${REPO}/git/commits`, {
    message,
    tree: newTree.sha,
    parents
  });
  console.log('commit:', commit.sha);

  // 5. 更新或创建分支引用
  if (parents.length) {
    await api('PATCH', `/repos/${REPO}/git/refs/heads/${BRANCH}`, { sha: commit.sha, force: false });
  } else {
    await api('POST', `/repos/${REPO}/git/refs`, { ref: `refs/heads/${BRANCH}`, sha: commit.sha });
  }
  console.log('pushed to', BRANCH);
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
