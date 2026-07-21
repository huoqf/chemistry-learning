# 高中化学交互动画学习系统

交互式化学动画学习平台，覆盖高中化学核心知识点，通过动画演示帮助理解化学现象与概念。

## 技术栈

- React 19 + TypeScript 5.5+ (strict mode)
- Vite 6 (base: './')
- TailwindCSS 4
- Zustand (状态管理)
- HashRouter (路由)
- SVG / Canvas / PixiJS (动画渲染)
- KaTeX (数学公式)

## 快速开始

```bash
npm install
npm run dev
```

## 目录结构

```
src/
├── app/                    # 应用壳、路由、全局布局
├── components/             # 公共组件
│   ├── Chemistry/          # 化学器材/矢量箭头组件
│   ├── Chart/              # 化学图表组件
│   ├── Layout/             # 三栏布局、SVG 画布容器
│   └── UI/                 # UI 基础组件
├── features/               # 业务模块（按化学主题拆分）
├── chemistry/              # 纯化学计算（无副作用）
├── data/                   # 注册表、化学量构建器、知识树
├── hooks/                  # 复用 Hook
├── pages/                  # 页面容器
├── scene/                  # 场景缩放与坐标转换
├── stores/                 # Zustand Store
├── theme/                  # 设计 token（统一入口 @/theme）
└── utils/                  # 工具函数
```

## 规范

详见 `.trae/rules/project_rules.md` 和 `docs/agent-rules/` 下各文档。
