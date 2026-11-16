# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFilter
import os

SRC = r'C:\Users\Liu_CuSO4\Desktop\椿华'
OUT = r'C:\Users\Liu_CuSO4\Documents\deepseek-harness\default-workspace\chunhua-blog\source\img'
os.makedirs(OUT, exist_ok=True)

def trim(im):
    bbox = im.getchannel('A').getbbox()
    return im.crop(bbox) if bbox else im

# ---------- 人物素材 ----------
cutout = Image.open(os.path.join(SRC, '椿华娘图片无背景抠图.png')).convert('RGBA')
cutout = trim(cutout)
h = 1200
w = round(cutout.width * h / cutout.height)
hero = cutout.resize((w, h), Image.LANCZOS)
hero.save(os.path.join(OUT, 'hero-mascot.png'), optimize=True)

full = Image.open(os.path.join(SRC, '椿华娘抠图.PNG')).convert('RGBA')
full = trim(full)
h2 = 1400
w2 = round(full.width * h2 / full.height)
full_s = full.resize((w2, h2), Image.LANCZOS)
full_s.save(os.path.join(OUT, 'mascot.png'), optimize=True)

# ---------- 头像 ----------
head = full.crop((int(full.width * 0.30), 0, int(full.width * 0.72), int(full.height * 0.20)))
head = trim(head)
side = max(head.size)
canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
canvas.paste(head, ((side - head.width) // 2, (side - head.height) // 2), head)
avatar = canvas.resize((320, 320), Image.LANCZOS)
avatar.save(os.path.join(OUT, 'avatar.png'), optimize=True)
avatar.resize((64, 64), Image.LANCZOS).save(os.path.join(OUT, 'favicon.png'), optimize=True)

# ---------- 封面 ----------
def gradient(size, top, bottom):
    w, h = size
    base = Image.new('RGB', (1, h))
    d = ImageDraw.Draw(base)
    for y in range(h):
        t = y / max(h - 1, 1)
        d.point((0, y), tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h), Image.BICUBIC)

def cover(bg_top, bg_bottom, fig, fig_h, x_ratio=0.72, y_ratio=0.54, out='cover.jpg'):
    W, H = 1200, 760
    base = gradient((W, H), bg_top, bg_bottom).convert('RGBA')

    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W * 0.45, -H * 0.25, W * 1.15, H * 0.95], fill=(255, 255, 255, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    base = Image.alpha_composite(base, glow)

    fh = fig_h
    fw = round(fig.width * fh / fig.height)
    f = fig.resize((fw, fh), Image.LANCZOS)
    x = int(W * x_ratio - fw / 2)
    y = int(H * y_ratio - fh / 2)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    layer.paste(f, (x, y), f)
    base = Image.alpha_composite(base, layer)

    base.convert('RGB').save(os.path.join(OUT, out), quality=90, optimize=True)

# 1. 社团介绍：直接裁原背景图
bg = Image.open(os.path.join(SRC, '椿华娘背景.jpeg')).convert('RGB')
ratio = 1200 / 760
w0, h0 = bg.size
if w0 / h0 > ratio:
    nw = round(h0 * ratio)
    bg = bg.crop(((w0 - nw) // 2, 0, (w0 + nw) // 2, h0))
else:
    nh = round(w0 / ratio)
    bg = bg.crop((0, 0, w0, nh))
bg.resize((1200, 760), Image.LANCZOS).save(os.path.join(OUT, 'cover-intro.jpg'), quality=90, optimize=True)

# 2. 社娘：粉底 + 立绘
cover((253, 238, 241), (245, 186, 199), full, 1000, 0.72, 0.655, 'cover-mascot.jpg')

# 3. 投稿：深红底 + 立绘（靠左）
cover((122, 29, 48), (70, 16, 30), full, 1000, 0.27, 0.655, 'cover-guide.jpg')

# ---------- 宽幅头图 ----------
def wide(bg_top, bg_bottom, fig, fig_h, x_ratio, out):
    W, H = 2000, 700
    base = gradient((W, H), bg_top, bg_bottom).convert('RGBA')
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W * 0.55, -H * 0.4, W * 1.1, H * 1.1], fill=(255, 255, 255, 60))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    base = Image.alpha_composite(base, glow)
    fw = round(fig.width * fig_h / fig.height)
    f = fig.resize((fw, fig_h), Image.LANCZOS)
    x = int(W * x_ratio - fw / 2)
    y = int(H * 0.62 - fig_h / 2)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    layer.paste(f, (x, y), f)
    base = Image.alpha_composite(base, layer)
    base.convert('RGB').save(os.path.join(OUT, out), quality=88, optimize=True)

# 介绍页头图：从原画裁一条宽幅（保留人物与花枝）
bw, bh = bg.size
crop_h = round(bw / (2000 / 700))
top = max(0, min(bh - crop_h, round(bh * 0.10)))
crop = bg.crop((0, top, bw, top + crop_h)).resize((2000, 700), Image.LANCZOS)
crop.save(os.path.join(OUT, 'hero-intro.jpg'), quality=88, optimize=True)

wide((253, 238, 241), (246, 202, 213), full, 760, 0.78, 'hero-mascot.jpg')
wide((122, 29, 48), (64, 14, 28), full, 760, 0.22, 'hero-guide.jpg')

print('done')

