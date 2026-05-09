# 李文琦个人网站 / Wenqi Li Personal Site

Astro + Tailwind 静态站，双语（中/英），3 个可切换 theme，部署到 GitHub Pages。

## 本地开发

```bash
pnpm install
pnpm dev          # http://localhost:4321/lwq-intro/
pnpm build        # → dist/
```

## 内容收集器

`collector/index.html` 是给李文琦填内容的工具。双击打开 → 填写 → 点 `导出 JSON`。
也可线上访问：`https://wangzx_microsoft.github.io/lwq-intro/collector/`

## 导入她填好的内容

```bash
pnpm import-content path/to/lwq-content-YYYYMMDD.json
pnpm build
git commit -am "content: import from collector" && git push
```

## 风格切换

右下角浮动按钮 `Theme: A · B · C`：
- **A · Editorial** — 衬线大标题 + 米白底 + 暖金，温润学术
- **B · Modern Minimal** — 紧凑无衬线 + 强对比，冷峻克制
- **C · Classical Premium** — 极简留白 + 灰阶，奢华克制

李文琦确认风格后，删除其余两个 theme 与 `ThemeSwitcher` 组件。

## 部署

push 到 `main` → GitHub Actions 构建 → 发布到 `https://wangzx_microsoft.github.io/lwq-intro/`。

需要 GitHub repo 的 Pages 设置改为 `Source: GitHub Actions`：
```bash
gh api -X POST /repos/wangzx_microsoft/lwq-intro/pages -f build_type=workflow
```

## 文档

- 设计规格：`docs/superpowers/specs/2026-05-08-lwq-intro-design.md`
- 实施计划：`docs/superpowers/plans/2026-05-08-lwq-intro-plan.md`
