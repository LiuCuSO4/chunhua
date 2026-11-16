# 椿华动漫社 · 站点

Hexo + 自写主题 `chunhua`，部署在 GitHub Pages：
<https://liucuso4.github.io/chunhua/>

## 本地预览

```bash
npm install
npx hexo server -p 4100
# 打开 http://localhost:4100/chunhua/
```

## 写一篇新动态

在 `source/_posts/` 新建 `.md`，开头照抄这一段改就行：

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
description: 一句话摘要
---
```

- `top: true` 置顶（首页大卡片）
- `cover` 卡片封面，`top_img` 文章页横幅
- 正文用 Markdown

## 发布

推送到 `main` 后，GitHub Actions 自动构建并发布，约 1 分钟。

## 改外观

- 频道（B 站等）：`themes/chunhua/_config.yml` 的 `channels`
- 导航、首页文案：同文件 `menu` / `hero`
- 颜色：`themes/chunhua/source/css/style.css` 顶部的 `:root` 变量

## 目录

```
source/_posts/        文章
source/about|join/    关于 / 投稿页
themes/chunhua/       主题（模板、样式、脚本）
source/img/           图片素材（社娘立绘、封面）
tools/make-assets.py  从原图生成头图/封面/头像
```
