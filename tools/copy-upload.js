const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', '..', 'hexo-blog', 'tools', 'upload.js');
let s = fs.readFileSync(src, 'utf8');
s = s.replace('LiuCuSO4/LiuCuSO4.github.io', 'LiuCuSO4/chunhua');
fs.writeFileSync(path.join(__dirname, 'upload.js'), s);
console.log('ok', s.includes('LiuCuSO4/chunhua'));
