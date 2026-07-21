# 02_UI_RULES — UI 视觉铁律

> 优先级：低于 core/ARCHITECTURE_RULES，高于其他专题
> AI任务入口：涉及任何 UI 实现前必须读本文件
> 最后更新：2026-07-19

---

## 1. 设计哲学（不可违反）

本产品气质：**精密学习工具**，介于科学仪器与教育软件之间。

| 维度 | 应有 | 禁止 |
|------|--------|--------|
| 颜色 | 深蓝主色，冷白背景，冷灰中性色 | 彩虹色、荧光色、卡通暖色 |
| Canvas | 干净轴线、精确标注 | 游戏风粒子爆炸、霓虹效果 |
| 动效 | ease-out / ease-in-out，符合物理惯性 | bounce、弹跳、随机飞入 |
| 排版 | 科学论文级清晰度，克制留白 | 过度装饰、四处塞满内容 |

---

## 2. Token 体系（权威来源：src/theme/）

所有实现必须从以下文件引用 token，**禁止硬编码任何颜色/间距/圆角值**：

| 文件 | 内容 | import 路径 |
|------|------|------------|
| src/theme/colors.ts | 5套色阶 | @/theme |
| src/theme/chemistry/colors.ts | 化学量颜色 | @/theme |
| src/theme/chemistry/sceneColors.ts | 场景器材外观色 | @/theme |
| src/theme/chemistry/chartColors.ts | 化学图像配色 | @/theme |
| src/theme/chemistry/canvasStyle.ts | SVG/Canvas 绘制规范 | @/theme |
| src/theme/spacing.ts | 间距比例尺 + CANVAS_PRESETS | @/theme |
| src/theme/animationTokens.ts | 动画 UI token | @/theme |
| src/theme/radius.ts | 圆角规范 | @/theme |
| src/theme/shadow.ts | 阴影规范 | @/theme |
| src/theme/motion.ts | 动效时长与 easing | @/theme |
| src/theme/chemistry/vectorStyle.ts | VectorType 枚举、视觉权重 | @/theme |
| src/theme/chemistry/arrowStyle.ts | ArrowGeometry 箭头几何规格 | @/theme |

---

## 3. 化学量颜色语义（不可更改）

Canvas/SVG 中每类化学量有固定颜色，**权威色值见 `src/theme/chemistry/colors.ts`**。

核心摘要：

| 化学量 | 颜色语义（token） | 用途与设计规范 |
|--------|------|------|
| 浓度 c | concentration（经典蓝） | 浓度标注、c-t曲线 |
| 反应速率 v | reactionRate（警示红） | 速率标注、v-t曲线 |
| 活化能 Ea | activationEnergy（动力橙） | 能量图标注 |
| pH | phValue（酸碱指示色） | pH 标注、滴定曲线 |
| 电子 e- | electron（电场蓝） | 电子转移标注 |

**铁律规则**：
1. 同一画面最多同时展示 5 种化学量颜色。
2. 场景器材材质必须引用 SCENE_COLORS，**禁止**任何 HEX 颜色值的硬编码。

### 3.0.1 Canvas 内颜色隔离规则

| 语义层级 | 颜色来源 | 适用场景 |
|----------|----------|----------|
| 化学量 | CHEMISTRY_COLORS.* | 浓度、速率、能量等矢量与标注 |
| 场景器材 | SCENE_COLORS.* | 烧杯、试管、仪器材质 |
| Canvas 基础设施 | CANVAS_COLORS.* | 网格、坐标轴、标注框 |
| 图表 | CHART_COLORS.* | 图表曲线与填充 |
| UI 教学状态 | colors.primary/danger/success/warning | 非化学量的教学反馈 |

**隔离铁律**：
1. Canvas 内禁止使用 UI 色表达化学量
2. withAlpha 半透明派生使用 withAlpha(token, alpha)，禁止手拼 rgba()
3. 禁止 colors.neutral.* 直接用于 Canvas/SVG
4. 禁止子路径导入
5. SVG 文字必须用 font() 缩放

---

## 4. 信息密度铁律

**Canvas 黄金规则：任意时刻可见元素 <= 7个**

三屏布局密度上限：
- 左侧参数区：最多 5个参数
- Canvas 中间：最多 7个元素，Canvas内文字标注 <= 5个
- 右侧看板：最多 8行化学量 + 高考要点卡片（<= 3条，每条<= 30字）

---

## 5. 三屏联动布局规范

使用 ThreePanel 组件，断点与面板宽度由 BREAKPOINT / PANEL 常量驱动：

| 断点 | 左侧 | 中间 | 右侧 |
|------|------|------|------|
| >= 1440px（standard） | 280px 固定 | 自适应 | 320px 固定 |
| 1280-1439px（compact） | 240px 固定 | 自适应 | 280px 固定 |
| 1024-1279px（tablet） | 抽屉 | 自适应 | 280px 固定 |
| < 1024px（mobile） | 抽屉 | 自适应 | 下移至 Canvas 下方 |

### 5.1 三屏职责边界（不可违反）

| 区域 | 核心职责 | 可包含 | 不应承载 |
|------|----------|--------|----------|
| 左侧屏 | 交互控制 | ParamControl、SegmentedControl、ToggleSwitch | 公式体系、知识讲解 |
| 中间屏 | 现象展示 | 动画、图表、实时标注 | 完整知识清单、公式推导 |
| 右侧屏 | 知识展示 | 化学量、公式、高考要点 | 参数调节、模式切换 |

---

## 6. 学习状态视觉体系

### 知识点掌握四态

未学习（neutral-300）-> 已浏览（primary-400）-> 练习中（primary-600）-> 已掌握（success-500）

### 高考重要性标签（5级）

| importance | 标签 | 样式 |
|-----------|------|------|
| gaokao | 高考高频 | accent 金色系 |
| hard | 难点 | danger 红色系 |
| core | 核心 | primary 蓝色系 |
| basic | 基础 | neutral 灰色系 |
| extend | 拓展 | secondary 紫色系 |

---

## 7. 组件规范摘要

### 按钮尺寸

| 尺寸 | 高度 | 字号 |
|------|------|------|
| sm | 32px | 13px |
| md（默认）| 40px | 14px |
| lg | 48px | 16px |

### 排版层级

| 级别 | 尺寸/字重 | 颜色 |
|------|---------|------|
| h1 | 28px/700 | neutral-800 |
| h2 | 22px/600 | neutral-800 |
| h3 | 18px/600 | neutral-700 |
| body | 15px/400 | neutral-600 |
| body-sm | 13px/400 | neutral-500 |
| mono（数值）| 14px/400 | neutral-700 |

字体栈：'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif

**Canvas/SVG 内字体**：必须使用 font() 函数缩放，禁止裸值 fontSize={11}。

### 7.1 化学公共组件（公共组件规范）

化学组件统一存放在 `src/components/Chemistry/` 下。

#### Chemistry — 化学场景渲染（@/components/Chemistry）

| 组件 | 适用场景 |
|------|---------|
| VectorArrow | 视觉标注/几何图形/等长示意矢量箭头 |
| ChemistryVectorArrow | 化学矢量箭头（浓度/速率等，禁止 pixelLength） |
| VectorDefs | SVG marker 定义 |

> 化学器材组件（烧杯、试管、分子模型等）待后续开发时补充。

#### Chart — 化学图表（@/components/Chart）

| 组件 | 适用场景 |
|------|---------|
| BaseChart | 所有新图表的原子容器 |
| ChartCursor | 图表游标 |
| ChartArea | 曲线下方面积填充 |
| ChartTangent | 切线 + 切点 |

#### Layout — 布局（@/components/Layout）

| 组件 | 适用场景 |
|------|---------|
| ThreePanel | 三栏主布局 |
| AnimationSvgCanvas | SVG 画布容器 |

#### UI — UI 基础（@/components/UI）

| 组件 | 适用场景 |
|------|---------|
| AnimationControls | 播放/暂停/重置控制条 |
| LeftPanel | 左屏控制台顶层容器 |
| LeftPanelSection | 左屏分区卡片 |
| ParamControl | 参数滑块控件 |
| ControlPanel | 声明式左屏控件渲染器 |
| Slider | 通用滑条 |
| SegmentedControl | 分段选择控件 |
| ToggleSwitch | 开关切换 |
| Button | 通用按钮 |
| KatexFormula | KaTeX 公式渲染 |
| MiniChart | 小型内嵌图表 |
| TipCard | 提示卡片 |

> barrel import 规则：所有组件从对应目录的 barrel 入口导入，禁止子路径导入。

---

## 8. UI 专属禁止项

- 禁止硬编码任何颜色值
- Canvas 化学量颜色必须从 @/theme 引用
- 禁止在 Canvas 内使用 lucide 图标
- 禁止单页面试验深色模式
- 禁止发明新颜色或新 token
- 禁止在 tailwind.config.* 中重复定义颜色值

---

## 9. 详细规则索引

| 需要查询 | 查阅位置 |
|---------|---------|
| 完整色阶 HEX 值 | src/theme/colors.ts |
| 化学量颜色完整表 | src/theme/chemistry/colors.ts |
| Canvas/SVG/图表规范 | ui/07_CANVAS_SVG_CHART_RULES.md |
| 三屏职责与侧屏组件规范 | ui/08_THREE_PANEL_RULES.md |
