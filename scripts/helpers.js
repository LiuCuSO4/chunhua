/* 主题用的小工具：内联图标 + 摘要文本 */

const ICONS = {
  bilibili:
    '<path d="M6.8 3.2 10 6.6M17.2 3.2 14 6.6" /><rect x="2.8" y="6.8" width="18.4" height="13.2" rx="3.4"/><path d="M8.7 11.6v3M15.3 11.6v3"/>',
  weibo:
    '<ellipse cx="10.2" cy="14.6" rx="6.2" ry="4.6"/><path d="M17.8 5.4c2.4.6 3.8 2.6 3.4 5"/><path d="M17.2 8.6c1.2.3 1.9 1.3 1.7 2.5"/>',
  douyin:
    '<path d="M14.2 3.4v10.9a3.9 3.9 0 1 1-3.3-3.8"/><path d="M14.2 3.4c.4 2.7 2.2 4.4 4.9 4.7"/>',
  xiaohongshu:
    '<rect x="3" y="6.4" width="18" height="12.2" rx="3.2"/><path d="M7.6 10.4v4.2M16.4 10.4v4.2"/>',
  qq:
    '<path d="M12 3.4c3.4 0 5.4 2.4 5.4 5.6 2 2.4 2.8 4.6 2.3 5.6-.4.8-1.7.6-2.6.2-.5 1.5-1.6 2.6-3 3.1l.6 1.7"/><path d="M12 3.4C8.6 3.4 6.6 5.8 6.6 9c-2 2.4-2.8 4.6-2.3 5.6.4.8 1.7.6 2.6.2.5 1.5 1.6 2.6 3 3.1L9.3 19.6"/>',
  mail:
    '<rect x="2.8" y="5.2" width="18.4" height="13.6" rx="3"/><path d="m4.4 7.4 7.6 5.6 7.6-5.6"/>',
  link:
    '<path d="M10.4 13.6a4 4 0 0 0 5.7 0l2.4-2.4a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M13.6 10.4a4 4 0 0 0-5.7 0l-2.4 2.4a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
  arrow: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  play: '<path d="M8.5 5.8v12.4L19 12z" fill="currentColor" stroke="none"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  top: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.2 2"/>',
  pin: '<path d="M9 4h6l-.8 5.2 3.3 2.6-4.9 1L12 20l-1.6-7.2-4.9-1 3.3-2.6z"/>'
};

hexo.extend.helper.register('icon', function (name, cls) {
  const body = ICONS[name] || ICONS.link;
  const klass = 'ic' + (cls ? ' ' + cls : '');
  return (
    '<svg class="' + klass + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    body +
    '</svg>'
  );
});

hexo.extend.helper.register('plain', function (html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
});

hexo.extend.helper.register('excerpt_of', function (post, len) {
  const raw = post.excerpt || post.content || '';
  let text = this.plain(raw);
  if (text.length > len) text = text.slice(0, len).replace(/[，。、；：,.;:\s]+$/, '') + '…';
  return text;
});

hexo.extend.helper.register('cover_of', function (post) {
  return post.cover || (this.theme.default_cover || '/img/cover-intro.jpg');
});
