## AI 速查违禁行为表（读此文件必先扫此表）

> 以下行为一旦出现，视为规范违反，必须回滚。

| 禁止行为 | 正确替代 | 关联铁律 |
|------------|-----------|---------|
| fill="#..." / stroke="red" 等硬编码颜色 | CHEMISTRY_COLORS.* / SCENE_COLORS.* / CHART_COLORS.* | 铁律1-1 |
| fontSize={14} 直接写死字号 | font(14)（来自 canvasSize.font） | 铁律1-1 |
| requestAnimationFrame(cb) 裸调用 | useAnimationLifecycle / src/utils/animation.ts | 铁律1-4 |
| 手写 line + marker 矢量箭头 | VectorArrow / ChemistryVectorArrow | 铁律1-5 |
| 新页面手写 input type="range" / 散乱左屏容器 | paramMeta -> ParamControl / controlMeta -> ControlPanel | 铁律6 |
| foreignObject 内嵌 React 图表 | HTML 层 flex 分区，图表与 SVG 平级 | 铁律1-10 |
| BrowserRouter | HashRouter only | 铁律4 |
| src/chemistry/ 中 import React / DOM / window | 化学计算层纯函数，零副作用 | 铁律2 |

---

# 项目规范 — 高中化学交互动画学习系统

> Trae IDE 默认加载的项目规范文件。
> 详细规范见下方「快速索引」部分。
> 最后更新：2026-07-20

---

## 1. 项目目标

1. 建立完整且清晰的高中化学知识结构
2. 用交互动画帮助理解化学现象与概念
3. 通过真题拆解帮助学习者建立解题思路
4. 可长期扩展，便于持续加入新章节、新题型与新场景

---

## 2. 技术栈

| 类别 | 选型 |
|------|------|
| 前端框架 | React 19 |
| 构建工具 | Vite 6，base: './' |
| 语言 | TypeScript 5.5+（strict mode） |
| CSS 框架 | TailwindCSS 4 |
| 状态管理 | Zustand |
| 路由 | react-router-dom（HashRouter only） |
| 动画渲染 | SVG（教学图解优先）/ Canvas（高频动画）/ PixiJS（后期复杂场景） |
| 数学公式 | KaTeX（完全离线） |
| 图标 | lucide-react |
| 数据验证 | Zod |
| 本地存储 | IndexedDB（主）/ LocalStorage（轻量配置） |
| 测试 | Vitest + Testing Library |
| 打包目标 | 浏览器本地运行优先，后期平滑迁移 Electron |

---

## 3. 目录结构

关键目录：app/（路由壳）| components/（公共组件）| hooks/（复用 Hook）| pages/（页面薄壳）| features/（业务模块）| chemistry/（纯化学计算）| scene/（场景缩放）| theme/（设计 token）。完整目录树见 docs/agent-rules/core/ARCHITECTURE_RULES.md 2。

---

## 4. 全局铁律（不得违反）

> 铁律 = 违反会直接导致系统 bug 的架构约束。流程习惯见下方 4.1。

| 序号 | 铁律 | 禁止 |
|------|------|------|
| 1 | 统一来源，禁止绕过（十条子约束见下方展开） | 硬编码颜色/魔法数字/裸值 fontSize={N}/自造 marker/直接 requestAnimationFrame/写死 scale = N |
| 2 | 化学计算层纯函数可序列化：src/chemistry/ 无副作用、无 DOM/React/window 依赖、有 JSDoc + 单位注释；所有数据结构可序列化 | 在 chemistry/ 中访问 DOM/Store；不可序列化的数据结构（Set/Map/Function） |
| 3 | 组件职责边界：页面组件薄壳（路由+布局+数据注入）；三屏不交叉；动画状态统一 useAnimationStore | 页面塞业务逻辑；右侧屏放参数控件；左侧屏放公式推导；另建 useChemistryState |
| 4 | HashRouter only：禁止 BrowserRouter（Electron file:// 下路由 404） | BrowserRouter |
| 5 | 组件复用优先：场景中存在可复用组件时必须直接使用，禁止在 features/ 中重复手写等效实现 | 手写已有组件实现（烧杯/试管/分子模型/矢量箭头/图表轴等） |
| 6 | 左屏控制台声明式优先：左屏必须使用 LeftPanel 体系；数值参数优先 paramMeta -> ParamControl，模式/开关/预设/提示优先 controlMeta -> ControlPanel | 新页面手写散乱左屏容器、简单模式切换/开关仍写 SidebarExtra、直接手写 input[type=range] |

### 铁律 1 展开：统一来源十条子约束

1. 颜色/间距/圆角/阴影/动效 -> 必须从 src/theme/ 引用
2. 坐标转换 -> 新页面必须走 worldToDesign()（src/scene，通过 useSceneScale 构造 SceneScale）
3. 场景缩放 -> 新页面统一使用 useSceneScale（src/hooks/useSceneScale.ts）构造 SceneScale，通过 anchor 模式选择缩放策略；化学坐标->设计坐标统一使用 worldToDesign（src/scene）
4. 动画调度 -> 必须通过 src/utils/animation.ts 的 Hook（禁止直接调用 requestAnimationFrame）
5. 矢量箭头 -> 必须使用 VectorArrow 或 ChemistryVectorArrow 组件；化学矢量（浓度/速率/能量变化等）优先使用 ChemistryVectorArrow（禁止 pixelLength，长度通过 sceneScale.refMagnitudes 归一化）；视觉标注/几何图形/等长示意使用 VectorArrow
6. 画布尺寸 -> 新页面通过 useAnimationViewport({ preset }) 统一获取（见约束 8）
7. 字体缩放 -> 必须走 font() 函数（内置 clamp 7-16，来自 useCanvasSize 返回值）
8. 布局缩放策略：新页面唯一标准路径为 useAnimationViewport({ preset }) + AnimationSvgCanvas，无 viewBox，SVG 以 CSS 尺寸为视口
9. Canvas+SVG 混合渲染坐标对齐：SVG 使用 useSceneScale + worldToDesign；Canvas 使用 useCanvasViewport({ mode: 'raw' }) + designToPixel
10. 渲染缩放策略互斥：同一组件只能选一条核心渲染策略。严禁在 SVG 内用 foreignObject 嵌入响应式 React 图表组件
11. viewModel 纯净性：model/viewModel.ts 只返回化学坐标系数据，禁止引入 viewport 相关坐标

### CANVAS_PRESETS 画布预设规格（5 种）

页面主屏为 ThreePanel 固定三栏（左参数 / 中画布 / 右公式），CANVAS_PRESETS（定义于 src/theme/spacing.ts）按动画在中屏的布局区域提供以下五种预设：

| preset | 设计尺寸 | 选用条件 |
|--------|----------------|----------|
| full   | 840x650 | 动画独占中屏全区域，无图表分区 |
| splitV | 840x325 | 中屏上下并列（上图表+下场景，或反向） |
| splitH | 420x650 | 中屏左右均分（左场景+右图表面板） |
| splitHw | 280x650 | 左窄右宽：化学主力布局（场景区窄+图表区宽560px） |
| square | 650x650 | 圆形或旋转对称（分子结构、晶体对称） |

> 新增动画组件只允许使用以上五个有效 preset。如首次开发无法确定布局，默认选 full。
> 化学动画优先选 splitHw（装置+图表），而非 splitH（均分）。splitV 在化学中低频使用。

### 铁律 5 展开：组件复用

实现动画场景时，必须优先使用 src/components/ 下已有组件，禁止在 features/ 内重新手写等效逻辑。

核心 API 入口：

| 需求 | 用什么 | import |
|------|--------|--------|
| 动画视口 | useAnimationViewport | @/hooks |
| SVG 画布容器 | AnimationSvgCanvas | @/components/Layout |
| 三栏页面布局 | ThreePanel | @/components/Layout |
| 化学矢量箭头 | ChemistryVectorArrow / VectorArrow | @/components/Chemistry |
| 场景比例尺 | useSceneScale | @/hooks |
| 坐标->设计坐标 | worldToDesign | @/scene |
| Canvas 视口 | useCanvasViewport | @/hooks |
| 左屏控制台 | LeftPanel / LeftPanelSection | @/components/UI |
| 左屏数值参数 | ParamControl | @/components/UI |
| 左屏模式开关 | ControlPanel | @/components/UI |
| SVG 坐标映射 | useViewportPointer | @/utils |
| 动画生命周期 | useAnimationLifecycle | @/hooks |
| 化学图表基座 | BaseChart | @/components/Chart |

完整组件清单及 barrel import 规则见 docs/agent-rules/ui/02_UI_RULES.md 7.1。
详细调用示例、必需 props、推荐组合与禁止替代写法见 docs/agent-rules/ui/COMPONENT_REGISTRY.md。

### 4.1 流程规范（习惯，非铁律）

| 序号 | 规范 |
|------|------|
| 1 | 新增 npm 包先在 PROCESS_LOG.md 申报再安装 |
| 2 | 提交前在 PROCESS_LOG.md 添加记录 |

---

## 5. 规范优先级

1. project_rules.md（本文件） - 全局铁律与索引
2. ARCHITECTURE_RULES.md - 架构细则
3. 02_UI_RULES.md - UI 视觉铁律
4. 其他专题规范

---

## 6. 快速索引

| 场景 | 查阅文档 |
|------|----------|
| 公共组件用途、import、最小调用示例 | docs/agent-rules/ui/COMPONENT_REGISTRY.md |
| 架构分层、状态管理、数据规则 | docs/agent-rules/core/ARCHITECTURE_RULES.md |
| UI 视觉、token 引用、三屏布局 | docs/agent-rules/ui/02_UI_RULES.md |
| Canvas/SVG/图表动态布局 | docs/agent-rules/ui/07_CANVAS_SVG_CHART_RULES.md |
| 三屏职责与侧屏组件规范 | docs/agent-rules/ui/08_THREE_PANEL_RULES.md |
| 工程日志与提交流程 | docs/agent-rules/process/PROCESS_LOG.md |
| 提交 Checklist | docs/agent-rules/process/CHECKLIST.md |

---

## 7. 提交 Checklist

提交前按 CHECKLIST.md 逐项验收。铁律 1-6 违反则提交无效。
