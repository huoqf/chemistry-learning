# AGENTS.md — 化学学习系统工作区规则（自动加载，优先级最高）

> 本文件由 Trae IDE 自动加载，无需手动读取。铁律违反 = 本次任务无效。
> 详细规范见 `.trae/rules/project_rules.md` 与 `docs/agent-rules/` 下各文档。

---

## 三屏内容分配铁律（设计前必读）

```
左屏（LeftPanel）         中屏（AnimationSvgCanvas）        右屏（右侧面板）
──────────────────        ──────────────────────────        ──────────────────────
• paramMeta 数值参数      • 动画场景（SVG 主体）            • QuantitySection（化学量）
• controlMeta 模式开关    • CenterExtra 图表（可选）         • FormulaSection（公式+条件）
• SidebarExtra（复杂）    禁止大段教学文字                  • ExamPointSection（高考要点）
                          禁止完整公式推导                   禁止动画控制控件
                          禁止高考考点总结
```

**主屏文字约束**：SVG 内只允许出现化学量数值标注（如 `c = 0.5 mol/L`）和坐标轴标签，禁止教学解释段落。

## 布局 preset 选择铁律（分屏是主流，按动画方向选）

> 动画配合图表更能帮助学生理解化学过程，**splitV/splitH 是大多数页面的首选**。

| preset | 设计尺寸 | 选用条件 |
|--------|---------|---------|
| CANVAS_PRESETS.splitHw | 280x650 | **化学主力布局**：左窄（装置区）+ 右宽（图表区560px），平衡/滴定/速率/气体/沉淀 |
| CANVAS_PRESETS.splitH | 420x650 | **左右均分**：容器+简单图表（离子反应/溶液配制） |
| CANVAS_PRESETS.splitV | 840x325 | **水平变化**（反应速率对比/能量图），化学低频 |
| CANVAS_PRESETS.full | 840x650 | 无需配套图表的纯场景（分子结构、晶体模型、电化学池、有机路径等） |
| CANVAS_PRESETS.square | 650x650 | 圆形/旋转对称（分子轨道、杂化轨道、晶体结构） |

**决策直觉**：装置+图表 -> splitHw（化学首选）；竖直变化+简单图 -> splitH；水平变化 -> splitV；无图表 -> full；圆形对称 -> square

> 严禁 wide / tall 等废弃 preset；严禁手写 width={900} 固定像素。

---

## 其他铁律速查（违反则任务无效）

### 铁律 1：统一来源，禁止硬编码

| 禁止 | 正确替代 |
|------|---------|
| 硬编码颜色 fill="#3B82F6" | import { CHEMISTRY_COLORS } from '@/theme' |
| 硬编码尺寸 fontSize={14} | font(14)（来自 canvasSize.font） |
| 自造 marker / line 矢量箭头 | ChemistryVectorArrow 或 VectorArrow |
| 直接 requestAnimationFrame(...) | useAnimationLifecycle / src/utils/animation.ts |
| 写死 scale = 0.8 | useSceneScale({ vp, preset, anchor }) |
| 任何魔法数字坐标 | worldToDesign() from @/scene |
| **画布区或图表区的任何包裹 `div` 手写背景色**（深色如 `bg-slate-900`/`bg-gray-800`，或浅灰色如 `bg-gray-50`/`bg-slate-100`/`bg-neutral-100`/`bg-white`） | 全部删除；背景一律由系统 Light Theme 统一提供，`AnimationSvgCanvas` 自身无背景 |

### 铁律 2：新页面布局唯一路径

```tsx
// 唯一标准写法（新页面必须）
const { containerRef, canvasSize, vp } = useAnimationViewport({ preset: CANVAS_PRESETS.full })
const sceneScale = useSceneScale({ vp, preset: CANVAS_PRESETS.full, anchor: 'center' })
<AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
  ...
</AnimationSvgCanvas>
```

### 铁律 3：左屏控制台必须使用声明式体系

```tsx
// 正确
paramMeta -> 由 registry 驱动 ParamControl（数值参数）
controlMeta -> 由 registry 驱动 ControlPanel（模式/开关/提示）
// 禁止
手写 <input type="range" />   // 散乱控件
新建 SidebarExtra 放简单开关  // 仅复杂自定义才用
```

### 铁律 3B：化学专用控件

| 化学场景 | 控件 | 类型 |
|---------|------|------|
| 逐步加入试剂 | controlMeta type='step' | 离散步进按钮（如"加入一滴NaOH"），点击自动增加参数值+重置时间 |
| 化学平衡自动暂停 | AnimationConfig.stopCondition | 返回 true 时自动暂停并显示"已达平衡"徽章 |

```tsx
// step 控件示例（左屏 ControlPanel）
controlMeta: [
  {
    type: 'step',
    label: '加入 NaOH',
    paramKey: 'volumeNaOH',
    step: 0.5,       // 每次增加 0.5 mL
    unit: 'mL',
    max: 50,
    resetTime: true, // 加试剂后反应重新开始
  },
]

// stopCondition 示例（AnimationConfig）
stopCondition: (params, t) => {
  return Math.abs(forwardRate - reverseRate) < 0.001
}
```

### 铁律 4：组件复用，禁止重复手写

| 场景 | 必须使用 | import |
|------|---------|--------|
| 三栏页面 | ThreePanel | @/components/Layout |
| SVG 画布容器 | AnimationSvgCanvas | @/components/Layout |
| 化学矢量 | ChemistryVectorArrow | @/components/Chemistry |
| 视觉标注箭头 | VectorArrow | @/components/Chemistry |
| 化学图表基座 | BaseChart | @/components/Chart |
| 实时时序图 | MiniChart | @/components/UI |
| 左屏容器 | LeftPanel / LeftPanelSection | @/components/UI |

**图表约束**：禁止手写 toSvgX / toSvgY 坐标轴；禁止 foreignObject 内嵌 React 图表；需图表时必须在现有组件基础上扩展或组合。

| 图表需求 | 必须使用 | import |
|---------|---------|--------|
| 浓度-时间图 | BaseChart + 插件 | @/components/Chart |
| 速率-时间图 | BaseChart + 插件 | @/components/Chart |
| pH 滴定曲线 | BaseChart + 插件 | @/components/Chart |
| 自定义关系图 | BaseChart + 插件 | @/components/Chart |
| 轻量实时图 | MiniChart | @/components/UI |

### 铁律 4B：颜色语义层级隔离（混用即违规）

| 语义层级 | 对应 Token 导出 | Token 声明文件 | 唯一适用场景 | 严禁混用 |
|---------|---------------|--------------|------------|---------|
| UI 界面 | `colors.*` | `colors.ts` | 界面按钮、卡片、侧边栏、弹窗、标示徽章 | 严禁在 Canvas 器材或 SVG 图表曲线中使用 `colors.primary` |
| 场景器材 | `SCENE_COLORS.*` | `sceneColors.ts` | 烧杯/试管/铁架台/炉体/导管等物理外观 | 严禁在图表曲线或 UI 控件中使用 `SCENE_COLORS.container.beaker` |
| 图表数据 | `CHART_COLORS.*`<br>`PH_CHART_COLORS`<br>`RATE_CHART_COLORS` | `chartColors.ts` | 滴定曲线、正逆速率线、指示剂变色带、坐标网格 | 严禁在实验器材绘制中直接使用 `CHART_COLORS.primary` |
| 化学物理量 | `CHEMISTRY_COLORS.*` | `chemistry/colors.ts` | 浓度/速率/能量/pH 等矢量标注与量 | 严禁作为器材材质填充色 |
| Canvas 基础设施 | `CANVAS_COLORS.*` | `chemistry/colors.ts` | 画布网格线/坐标轴/参考线 | 用 `colors.neutral[200]` 直接 |
| 透明度变体 | `withAlpha(token, 0.3)` | `chemistry/colors.ts` | 任意半透明色 | 手拼 `rgba(...)` |

```ts
// 正确 import（统一入口 `@/theme`，禁止任何子路径）
import { CHEMISTRY_COLORS, SCENE_COLORS, CANVAS_COLORS, CHART_COLORS, withAlpha } from '@/theme'

// 禁止任何子路径导入
import { withAlpha } from '@/theme/chemistry/colors'
import { SCENE_COLORS } from '@/theme/chemistry'
```

### 铁律 4C：theme 统一入口（所有业务组件必须遵守）

所有业务组件（`src/components/`、`src/pages/`、`src/features/`）导入 theme token 必须 100% 使用统一入口 `'@/theme'`，绝对禁止使用任何子路径（如 `@/theme/chemistry` 或 `@/theme/colors`）。

**唯一例外**：`src/theme/` 内部模块之间的相互引用允许使用子路径。

### 铁律 5：HashRouter Only

禁止引入 BrowserRouter，路由跳转仅用 to="/xxx"（HashRouter 内部路径）。

### 铁律 6：化学计算层纯净

src/chemistry/ 内禁止出现 DOM、React、window、Store 依赖。所有函数必须有 JSDoc + 单位注释。

### 铁律 7：SVG 字体必须 font() 包裹

所有 SVG/Canvas 内的 `fontSize` 属性必须通过 `font()` 缩放函数包裹，禁止直接使用 `FONT.*` 原始值。

```tsx
// ✅ 正确 — font() 包裹
<text fontSize={font(FONT.label)} />
<text fontSize={font(FONT.small)} />

// ❌ 禁止 — 直接使用 token 值
<text fontSize={FONT.label} />
<text fontSize={14} />
```

`font()` 函数由 `useAnimationViewport` 提供（canvasSize.font），确保高 DPR 下字号正确缩放。
若组件不接受 `font` prop（如纯 SVG 静态组件），使用 `identityFontScaler` 作为默认值。

### 铁律 8：时序图全量预计算 / 状态生命周期 / LaTeX 宽度

**时序图定标**：v-t / c-t / p-t 等时序图的 history 数组必须基于**固定全量时间轴**预计算，再用 `.filter(p => p.time <= time)` 动态揭示；图表必须显式传入 `xDomain={[0, maxTime]}`，X 轴刻度在动画过程中恒定不变。

```ts
// ❌ 禁止 — 随 time 动态采样，X 轴随时间拉伸
const history = computeHistory(0, time)

// ✅ 正确 — 全量预计算 + filter 揭示
const fullHistory = useMemo(() => computeHistory(0, MAX_TIME), [params])
const history = fullHistory.filter(p => p.time <= time)
// 图表
<BaseChart xDomain={[0, MAX_TIME]} data={history} />
```

**状态生命周期**：`stopCondition` 触发的所有衍生状态（如 `equilibriumReached`）必须在 `handleReset`、`setParams`、`updateParam` 每个重置路径中同步清空。

### 铁律 9：双视角平行板块与高考母题双向关联

系统采用**双视角平行导航**（教材章节知识树 + 高考解题母题专题）。所有新增的高考母题与记忆矩阵专题必须在 `src/data/gaokaoModels.ts` 独立注册，并保持与 `knowledgeTree.ts` 原有教材节点的 `relatedModelIds` 双向互通；**严禁直接修改或破坏现有 3D 页面及教材节点路由**。

---

## 新建页面前必须确认的 8 件事

1. **选择 preset**：full / splitV / splitH / splitHw / square（化学装置+图表首选 splitHw，无图表用 full，圆形对称用 square）
2. **选择 controlsMode**：高中化学**默认 timed**（有起点/终点的反应过程动画）；静态参数展示用 param；永续循环才用 loop
3. **分层结构**：XxxAnimation.tsx（编排）+ hooks/useXxxChemistry.ts（化学计算）+ components/XxxScene.tsx（渲染）
4. **颜色来源（按语义隔离）**：化学量 -> CHEMISTRY_COLORS；场景器材 -> SCENE_COLORS；图表 -> CHART_COLORS；Canvas 基础设施 -> CANVAS_COLORS；透明度变体 -> withAlpha()
5. **坐标系统**：worldToDesign() 转换，useSceneScale 比例尺，禁止手写 x * scale + offset；SVG 字体必须 font(N) 包裹
6. **Registry 注册（5 个文件全部完成）**：data/registries/<domain>.ts（paramMeta/controlMeta/defaultParams as const）+ data/quantities/<domain>/<topic>.ts（化学量构建器）+ data/chemistryQuantities.ts（注册构建器）+ data/knowledgeTree.ts（确认知识点）
7. **组件复用检查**：新增场景前必须查阅 COMPONENT_REGISTRY.md，有现成组件时禁止手写等效实现
8. **化学逻辑对照**：涉及热化学（ΔH）、平衡移动方向、酸碱滴定、电极极性时，完成代码后必须对照高中化学教材逐字核对"反应方向 - 吸/放热 - 浓度/压强/温度影响方向"三要素，禁止仅凭直觉编写化学逻辑

---

## 按需读取索引

| 触发条件 | 读取文档 |
|---------|---------|
| 涉及 Canvas/SVG/图表布局 | docs/agent-rules/ui/07_CANVAS_SVG_CHART_RULES.md |
| 涉及 UI 组件/颜色/间距 | docs/agent-rules/ui/02_UI_RULES.md |
| 实现左侧/右侧屏组件 | docs/agent-rules/ui/08_THREE_PANEL_RULES.md |
| 需要完整组件 API | docs/agent-rules/ui/COMPONENT_REGISTRY.md |
| 提交前验收 | docs/agent-rules/process/CHECKLIST.md |

---

*最后更新：2026-07-20 | 清理迁移遗留内容，统一 import 路径为 @/theme，移除存量禁止项*
