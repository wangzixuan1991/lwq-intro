# 李文琦个人网站 / Wenqi Li Personal Site

Astro + Tailwind 静态站。双语（中/英）+ 11 套可切换审美主题。

🔗 **线上**：https://lwq-intro.vercel.app

---

## 工作流（最重要）

**本地代码路径**：`/Users/wangzx2026/Desktop/lwq-intro`

带 approve gate 的两段式部署：

```
[改动 / 预览阶段]
  本地改 → git commit & push origin dev
                ↓
            GitHub dev 分支
                ↓ (auto)
            Vercel 预览构建
                ↓ ~30s
   https://lwq-intro-git-dev-gtzixuan-9605s-projects.vercel.app
                ↓
            人类审核 ✓

[上线阶段 · 需 approve]
  你说 "deploy" → git checkout main && git merge dev && git push origin main
                ↓
            GitHub main 分支
                ↓ (auto)
            Vercel 生产构建
                ↓ ~30s
            https://lwq-intro.vercel.app
```

**规则**：
- **默认在 `dev` 分支**做所有修改
- `main` 分支只通过 `dev` 合并更新，不直接推
- 任何 push 到 `dev` → Vercel 自动给一个预览 URL
- 用户在预览 URL 看完说 OK，才推 `main`
- **Source of truth**：GitHub repo `wangzixuan1991/lwq-intro`
- 不去 GitHub 网页编辑、不去 Vercel 后台改设置

---

## 本地开发

```bash
pnpm install
pnpm dev          # http://localhost:4321/lwq-intro/
pnpm build        # 构建到 dist/
```

`astro.config.mjs` 通过 `process.env.VERCEL` 切换 base path：
- Vercel：site=`lwq-intro.vercel.app`，base=`/`
- GitHub Pages：site=`wangzixuan1991.github.io`，base=`/lwq-intro/`

---

## 主题系统

11 套已 commit 的审美方向，右下角浮动切换器：

| # | id | 字体（display / body） |
|---|---|---|
| 01 | editorial-noir（默认） | Fraunces / Source Serif 4 |
| 02 | brutal-minimal | Bricolage Grotesque / Albert Sans |
| 03 | maximalist-chaos | Anton / Newsreader |
| 04 | retro-futuristic | Orbitron / Syne |
| 05 | organic-natural | DM Serif Display / Lora |
| 06 | luxury-refined | Cormorant Garamond / Cardo |
| 07 | playful-toy | Fredoka / Quicksand |
| 08 | brutalist-raw | JetBrains Mono 全栈 |
| 09 | art-deco | Cinzel / EB Garamond |
| 10 | soft-pastel | Instrument Serif / DM Sans |
| 11 | industrial | Archivo / DM Mono |

每套有自己的色板、字体、装饰语法（分隔线/eyebrow 形态/h 标题大小）。最终选定一套后，删除其余 + `ThemeSwitcher` 组件即可。

---

## 内容收集器

`collector/index.html` 是给李文琦填内容的工具。双击打开 → 填写 → 点 `导出 JSON`。

```bash
pnpm import-content path/to/lwq-content-YYYYMMDD.json
git commit -am "content: import from collector" && git push
```

---

## 仓库 / 部署链接

- GitHub repo：https://github.com/wangzixuan1991/lwq-intro
- Vercel 项目：https://vercel.com/gtzixuan-9605s-projects/lwq-intro
- GitHub 账号：`wangzixuan1991`（personal，gt.zixuan@gmail.com）
- Vercel 账号：`gtzixuan-9605`（已通过 GitHub App 绑定 repo）

---

## 文档

- 设计规格：`docs/superpowers/specs/2026-05-08-lwq-intro-design.md`
- 实施计划：`docs/superpowers/plans/2026-05-08-lwq-intro-plan.md`
