# 高中化学交互动画学习系统

交互式化学动画学习平台，覆盖高中化学核心知识点与高考高频解题母题，通过 2D/3D 动画与定量图表帮助理解化学现象与概念。

## 技术栈

- React 19 + TypeScript 6 (strict mode)
- Vite 8 (`base: './'`)
- TailwindCSS 4（`@theme` 定义于 `src/index.css`）
- Zustand（状态管理）
- React Router（`HashRouter` only）
- SVG / Canvas / Three.js + React Three Fiber（2D/3D 动画渲染）
- KaTeX（完全离线数学/化学公式渲染）
- Vitest + Testing Library + Playwright + oxlint

## 快速开始

```bash
npm install
npm run dev
```

## 常用校验命令

```bash
npx tsc --noEmit     # TypeScript 类型检查
npm run lint         # 架构与规范静态门禁
npm run lint:ox      # oxlint 零警告检查
npm run test:run     # Vitest 全量单元测试
npm run build        # 生产构建
npm run ci           # lint + test:run + build
```

## 目录结构

```
src/
├── app/                    # 应用壳、初始化、全局导航布局
├── assets/                 # 静态资源
├── chemistry/              # 纯化学计算（零 React/DOM/window 依赖）
├── components/             # 公共组件
│   ├── Chart/              # 化学图表组件（BaseChart 及高阶图表）
│   ├── Chemistry/          # 化学器材、装置、矢量箭头组件
│   ├── Chemistry3D/        # 3D 晶胞与分子网格组件（R3F + WebGL 检测）
│   ├── Layout/             # 三栏布局、SVG 画布容器
│   └── UI/                 # UI 基础组件与三屏面板
├── context/                # 全局上下文（AnimationLayoutContext 等）
├── data/                   # 动画注册表、化学量构建器、知识树、高考母题与题库
├── features/               # 业务模块（按化学主题与高考母题拆分）
├── hooks/                  # 复用 Hook（视口、比例尺、生命周期）
├── pages/                  # 页面容器（HomePage / AnimationPage / GaokaoToolPage）
├── scene/                  # 场景缩放与坐标转换
├── stores/                 # Zustand Store
├── test/                   # 测试全局配置与 setup
├── theme/                  # 设计 token（统一入口 @/theme）
└── utils/                  # 工具函数
```

## 规范

详见 `.agents/AGENTS.md`、`.trae/rules/project_rules.md` 和 `docs/agent-rules/` 下各文档。
