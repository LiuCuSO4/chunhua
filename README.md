# 椿华动漫社 · 站点

社团的官方网站，Hexo + 自写主题 `chunhua`，构建后托管在 GitHub Pages。

- 线上地址：<https://liucuso4.github.io/chunhua/>
- 仓库：<https://github.com/LiuCuSO4/chunhua>

这个 README 是「改站指南」：哪个文件管什么、字段是什么意思、常见改动怎么做。

---

## 一、先跑起来

```bash
npm install            # 第一次
npx hexo server -p 4100
```

打开 <http://localhost:4100/chunhua/>。改文件保存后浏览器会自动刷新。

发布上线：双击项目根目录的 **发布博客.bat**（提交 → 推送 → 等 GitHub Actions 构建 → 打开网站）。

> 前提：已安装 Node.js 与 GitHub CLI（`gh`），且 `gh` 登录过。

---

## 二、目录结构

```
chunhua-blog/
├─ source/                 站点内容
│  ├─ _posts/              文章（一篇一个 .md）
│  ├─ about/index.md       关于页
│  ├─ join/index.md        投稿页
│  └─ img/                 图片素材（社娘、封面、头图）
├─ themes/chunhua/         主题
│  ├─ _config.yml          导航、频道、首屏文案、页脚
│  ├─ layout/              页面模板（EJS）
│  │  ├─ layout.ejs        全站骨架
│  │  ├─ index.ejs         首页
│  │  ├─ post.ejs          文章页
│  │  ├─ page.ejs          普通页面（关于/投稿）
│  │  ├─ archive.ejs       归档页
│  │  ├─ tag.ejs / category.ejs
│  │  └─ partials/         head / nav / hero / channels / post-card / footer
│  └─ source/
│     ├─ css/style.css     全部样式
│     └─ js/main.js        菜单、入场动画、返回顶部
├─ scripts/helpers.js      主题辅助函数（图标、摘要、封面）
├─ tools/                  发布与素材脚本
├─ _config.yml             站点配置
├─ README.md
└─ 发布博客.bat
```

---

## 三、写一篇动态

在 `source/_posts/` 新建 `任意英文名.md`，开头写：

```yaml
---
title: 标题
date: 2026-11-20 20:00:00
cover: /img/cover-intro.jpg
top_img: /img/hero-intro.jpg
categories:
  - 社团
tags:
  - 活动
description: 一句话摘要，会显示在文章标题下面
---
```

正文从 `---` 下面开始，Markdown 写法：

| 想要 | 写法 |
| --- | --- |
| 二级标题 | `## 小标题` |
| 列表 | `- 一项` |
| 加粗 | `**重点**` |
| 链接 | `[文字](https://...)` |
| 图片 | `![说明](/img/xxx.jpg)` |
| 引用 | `> 一句话` |
| 分割线 | `---`（上下要空行） |

### front matter 字段说明

| 字段 | 必填 | 作用 |
| --- | --- | --- |
| `title` | 是 | 文章标题，显示在卡片、文章页、浏览器标签 |
| `date` | 是 | 发布时间，`YYYY-MM-DD HH:mm:ss`；决定排序 |
| `top` | 否 | 写 `true` 就置顶：首页变成第一张大卡，归档页带「置顶」标 |
| `cover` | 否 | 卡片封面（建议 1200×760）。不写就用默认封面 |
| `top_img` | 否 | 文章页顶部横幅（建议 2000×700）。不写就用 `cover` |
| `categories` | 否 | 分类，写成列表；文章页左上角显示第一个 |
| `tags` | 否 | 标签，写成列表；文章底部显示 |
| `description` | 否 | 摘要，显示在文章大标题下面 |
| `permalink` | 否 | 自定义网址，如 `/spring/`，不写就是 `posts/文件名/` |

> 卡片摘要取正文开头（自动截断）。想手动控制摘要，可以在正文里加一行 `<!-- more -->`，它前面的内容就是摘要。

---

## 四、关于页 / 投稿页

`source/about/index.md`、`source/join/index.md` 用的是 `page` 布局：

```yaml
---
title: 关于椿华动漫社
layout: page
en: ABOUT          # 大标题上方的小字，英文
description: 一句话副标题
---
```

正文同样是 Markdown，会渲染进白色卡片里。

---

## 五、改导航、频道、首屏

这些都在 `themes/chunhua/_config.yml`。

### 品牌

```yaml
brand:
  name: 椿华动漫社        # 导航左侧、页脚、浏览器标题
  en: CHUNHUA ANIME CLUB  # 名字下面的小英文
  slogan: 以热爱为名，记录每一次相遇
```

### 导航

```yaml
menu:
  - name: 首页
    url: /
  - name: 动态
    url: /archives/
```

加一项就多一个导航；删一项就没。地址是站内路径（`/about/`）或外链。

### 频道（视频平台）

```yaml
channels:
  - name: 哔哩哔哩
    handle: 椿华动漫社
    desc: 活动记录与视频投稿
    url: https://space.bilibili.com/3747582505388978
    icon: bilibili
    color: '#00a1d6'
```

| 字段 | 说明 |
| --- | --- |
| `name` | 平台名 |
| `handle` | 账号名，显示在名字下面 |
| `desc` | 一句话说明 |
| `url` | 点卡片跳转的地址 |
| `icon` | 图标：`bilibili` / `weibo` / `douyin` / `xiaohongshu` / `qq` / `mail` / `link` |
| `color` | 图标和悬停色，十六进制 |

加平台：照着复制一段改内容即可，首页会自动排成网格。

`channel_more: true` 会保留最后那张「更多平台 · 陆续开通中」的占位卡；不想要就改 `false`。

### 首屏

```yaml
hero:
  image: /img/hero-mascot.webp   # 右侧社娘
  eyebrow: CAMELLIA · ANIME CLUB # 标题上方小字
  title: 椿华动漫社
  subtitle: 以热爱为名，记录每一次相遇
  lead: 宅舞、cosplay、游戏、音游、卡牌——把每一次相聚，都留在这里。
  primary:                       # 红色主按钮
    text: 看看我们在做什么
    url: /archives/
  secondary:                     # 描边副按钮
    text: 了解社团
    url: /about/
```

### 页脚

```yaml
footer:
  since: 2026        # 版权年份起点
  text: 椿华动漫社
```

---

## 六、站点配置 `_config.yml`

大部分不用动，常改的几个：

| 字段 | 当前值 | 作用 |
| --- | --- | --- |
| `title` | 椿华动漫社 | 浏览器标签、SEO 标题 |
| `subtitle` | 以热爱为名…… | 副标题 |
| `description` | …… | SEO 描述 |
| `keywords` | 椿华动漫社, 动漫社…… | SEO 关键词 |
| `url` + `root` | `https://liucuso4.github.io` + `/chunhua/` | 部署路径，换仓库要一起改 |
| `permalink` | `posts/:title/` | 文章网址规则 |
| `index_generator.per_page` | 9 | 首页每页几篇 |
| `default_category` | 动态 | 没写分类时的默认值 |

> `root` 必须是 `/chunhua/`，因为站点挂在个人主页的子路径下。改成自定义域名时，`url` 改成域名，`root` 改成 `/`。

---

## 七、改颜色和样式

全站样式在 `themes/chunhua/source/css/style.css`，最上面的变量：

```css
:root {
  --red:   #c9314b;   /* 主色：按钮、链接、标题前竖条 */
  --red-2: #a82340;   /* 主色深一档：悬停 */
  --deep:  #6e1526;   /* 页脚、深色背景 */
  --blush: #fbe9ee;   /* 页面底色 */
  --blush-2:#f6d2db;  /* 渐变的第二层粉 */
  --cream: #fff9f7;   /* 卡片底色 */
  --ink:   #2a1a20;   /* 正文颜色 */
}
```

改这几个值，全站跟着变。想做深色模式，需要另加一套变量和切换逻辑，现在没做。

其它常用类：

| 类名 | 位置 |
| --- | --- |
| `.hero` | 首屏（高度 `92vh`、水印「椿」、光斑） |
| `.hero-art img` | 右侧社娘大小（`width: min(100%, 44vw)`） |
| `.channels` / `.channel-card` | 频道区 |
| `.card` / `.card-featured` | 文章卡片 / 置顶大卡 |
| `.post-hero` | 文章页横幅（高度、遮罩） |
| `.markdown` | 正文排版 |
| `.footer` | 页脚 |

---

## 八、图片素材

都在 `source/img/`：

| 文件 | 用在哪 | 建议尺寸 |
| --- | --- | --- |
| `hero-mascot.webp` | 首页右侧社娘 | 1587×1200，透明底 |
| `mascot.webp` | 备用立绘 | 不限 |
| `avatar.webp` | 导航头像、站点图标 | 320×320 |
| `favicon.png` | 浏览器标签图标 | 64×64 |
| `cover-intro.jpg` | 文章卡片封面 | 1200×760 |
| `hero-intro.jpg` | 文章页横幅 | 2000×700 |
| `cover-mascot.jpg` / `cover-guide.jpg` | 另外两张封面 | 1200×760 |
| `hero-mascot.jpg` / `hero-guide.jpg` | 另外两张横幅 | 2000×700 |

换图最简单的办法：**用同名文件直接替换**（保持宽高比）。

想从原图重新生成，运行：

```bash
python tools/make-assets.py
```

脚本会读 `C:\Users\Liu_CuSO4\Desktop\椿华` 里的原图（路径写在脚本第 5 行），输出立绘、头像、封面、横幅。需要 Python 和 Pillow。

> 首屏图控制在 200KB 以内比较稳，太大在慢网下会一张张往下加载。

---

## 九、发布流程

`.github/workflows/pages.yml`：推到 `main` → 安装依赖 → `hexo generate` → 上传 `public/` → 发布到 Pages。

`发布博客.bat` 只是把这套动作串起来：

1. `git add -A`，有改动就 commit
2. `node tools/upload.js` 把源码推到 `main`（走 GitHub API，绕开 `github.com:443` 连不上的问题）
3. `gh run watch` 等 Actions 跑完
4. 打开线上地址

`tools/upload.js` 有个保护：如果远端有、本地没有的文件，会拒绝删除并列出清单。确实要删时加环境变量 `CONFIRM_PRUNE=1`。

---

## 十、常见改动速查

| 想改什么 | 改哪里 |
| --- | --- |
| 站点名字/副标题 | `_config.yml` 的 `title` / `subtitle` |
| 导航菜单 | `themes/chunhua/_config.yml` 的 `menu` |
| 加抖音/微博等频道 | 同文件 `channels`，复制一条 |
| 首页大标题、按钮 | 同文件 `hero` |
| 页脚版权年份 | 同文件 `footer.since` |
| 主色、背景色 | `themes/chunhua/source/css/style.css` 的 `:root` |
| 置顶某篇 | 文章 front matter 加 `top: true` |
| 换社娘立绘 | 替换 `source/img/hero-mascot.webp` 与 `avatar.webp` |
| 改文章网址 | front matter 加 `permalink: /xxx/` |
| 关于/投稿内容 | `source/about/index.md`、`source/join/index.md` |

---

## 十一、几个坑

- **中文文件名**：文章文件名建议用英文/拼音，标题用中文写在 `title` 里，避免网址变成一长串 `%E6%A4%BF...`。
- **构建失败**：先看 GitHub 仓库的 Actions 日志；本地先 `npx hexo clean && npx hexo generate` 复现。
- **页面没更新**：Pages 有缓存，构建成功后等半分钟再刷新（Ctrl+F5）。
- **YAML 语法**：冒号后面必须空格，中文标题不用加引号，但标题里有 `:` 时要写成 `title: "标题: 副标题"`。
- **改完没生效**：确认改的是 `themes/chunhua/` 下的文件，不是 `node_modules` 里的。
