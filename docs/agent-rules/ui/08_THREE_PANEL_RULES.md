# 08_THREE_PANEL_RULES — 三屏职责与侧屏组件规范

> 优先级：低于 02_UI_RULES.md
> AI任务入口：实现或修改左侧屏、右侧屏、CenterExtra 时必须读本文件
> 最后更新：2026-07-19

---

## 1. 三屏职责边界（不可违反）

三屏职责边界表、职责分离铁律统一定义于 `02_UI_RULES.md 5.1`，本文件不再重复。

---

## 2. 左侧屏组件规范

### 2.1 左侧屏标准结构

```text
LeftPanel                         <- AnimationPage 左屏唯一顶层容器
  +- LeftPanelSection             <- 同考点模型切换 / 声明式控件分组 / 自定义分区
  +- ControlPanel                 <- 由 animationRegistry.controlMeta 生成
  +- ParamControl                 <- 由 animationRegistry.paramMeta 生成
  +- LeftPanelScrollArea          <- 承载复杂 SidebarExtra 长内容
```

**布局顺序**：同考点模型切换 -> controlMeta 声明式控件 -> paramMeta 数值参数 -> 复杂 SidebarExtra。

### 2.2 声明式优先级（执行规范权威来源）

| 优先级 | 机制 | 适用内容 |
|---:|------|----------|
| 1 | paramMeta -> ParamControl | 连续数值型化学参数 |
| 2 | controlMeta -> ControlPanel | 模式、开关、预设、提示 |
| 3 | SidebarExtra | 真正复杂的页面专属控制 |

### 2.3 组件使用边界

| 组件 / 协议 | 语义 | 使用场景 |
|------|------|----------|
| LeftPanel | 左屏顶层控制台容器 | AnimationPage 左侧屏 |
| LeftPanelSection | 左屏分区卡片 | 模型选择、显示辅助、预设、提示 |
| LeftPanelScrollArea | 左屏长内容滚动区 | SidebarExtra 内容较长时 |
| ParamControl | 标准数值参数组 | registry paramMeta |
| ControlPanel | 标准非数值控制组 | registry controlMeta |
| Slider | 连续参数调节 | 仅在复杂 SidebarExtra 中临时使用 |
| SegmentedControl | 互斥视图切换 | 复杂 SidebarExtra 中临时使用 |

**禁止**：新 SidebarExtra 中手写按钮组、自定义 toggle、原生 input[type="range"]。

### 2.4 条件显示与公式渲染

#### 条件显示

`paramMeta` 与 `controlMeta` 均支持条件字段，**必须在需要时主动使用**，避免所有参数在所有模式下常驻：

| 字段 | 类型 | 语义 |
|------|------|------|
| `showIf` | `string` | 依赖参数 key，当该参数 truthy 或等于 `showIfValue` 时显示 |
| `showIfValue` | `number` | 与 `showIf` 配合的精确匹配值 |
| `hideIf` | `string` | 依赖参数 key，当该参数等于 `hideIfValue` 时隐藏 |
| `hideIfValue` | `number` | 与 `hideIf` 配合的精确匹配值 |

**示例**：仅在 "进阶模式"（`mode === 1`）下显示活化能参数：

```ts
paramMeta: [
  { key: 'temp', label: '温度', min: 273, max: 398, step: 5, unit: 'K' },
  { key: 'Ea', label: '活化能', min: 10, max: 200, step: 5, unit: 'kJ/mol', showIf: 'mode', showIfValue: 1 },
]
```

#### 公式渲染

左屏控件 `label` 统一支持 `string | React.ReactNode`，可直接传入 `<KatexFormula />` 渲染化学式、离子式、分式等：

```ts
import { KatexFormula } from '@/components/UI'

paramMeta: [
  { key: 'c0', label: <KatexFormula formula="c_0" />, min: 0.1, max: 5, step: 0.1, unit: 'mol/L' },
  { key: 'Ka', label: <KatexFormula formula="K_a" />, min: 1e-5, max: 1, step: 1e-5 },
]

controlMeta: [
  {
    type: 'segmented',
    key: 'mode',
    label: <KatexFormula formula="\text{反应类型}" />,
    options: [
      { label: <KatexFormula formula="\text{可逆}" />, value: 0 },
      { label: <KatexFormula formula="\text{不可逆}" />, value: 1 },
    ],
  },
]
```

> 简单下标（如 `NO₂`）可直接用 Unicode 字符；复杂公式（分式、离子、上标下标混排）必须用 `KatexFormula`。

### 2.5 进阶模式统一规范

| 情况 | 推荐组件 |
|------|----------|
| 基础/进阶是两个完整视图 | SegmentedControl |
| 进阶只是叠加显示额外控件 | ToggleSwitch |
| 进阶模式会触发中心区域布局变化 | SegmentedControl + resetAnimation() |

### 2.5 样式 token 规则

#### 控件状态色（必须走 UI token）

| 状态 | 样式 |
|------|------|
| 选中态 | bg-primary-50 text-primary-700 border-primary-600 |
| 未选中态 | bg-white text-neutral-600 border-neutral-200 |
| 禁用态 | opacity-40 cursor-not-allowed |

#### 化学量颜色（必须走 chemistry token）

化学量颜色只用于图表曲线、矢量箭头、标签点，**不得**用于控件状态色。

---

## 3. 右侧屏内容规范

### 3.1 三段式结构（不可变骨架）

```text
右侧面板
  +- QuantitySection      <- 化学量（名称 + 符号 + 当前值 + 单位）
  +- FormulaSection       <- 公式（KaTeX + 适用条件 + 易错提醒）
  +- ExamPointSection     <- 高考要点（5级重要性标签）
```

### 3.2 Formula 数据结构

```text
Formula
  +- name: string          公式名称
  +- latex: string         KaTeX 表达式
  +- condition?: string    适用条件
  +- variables?: object    变量解释
  +- note?: string         易错提醒
  +- level?: string        重要性
```

### 3.3 化学量区规范

- 每个化学量包含：名称、符号、当前值、单位
- 当前值实时联动动画状态

---

## 4. SidebarExtraProps 接口规范

### 4.1 接口定义

```text
SidebarExtraProps
  +- params: Record<string, number>
  +- updateParam: (key, value) => void
  +- setParams: (params) => void
  +- disabled: boolean
  +- animationActions
      +- resetAnimation: () => void
      +- pauseAnimation: () => void
      +- restartAnimation: () => void
```

### 4.2 禁止事项

- SidebarExtra **不得**直接访问 animation store
- 所需动画数据和动作必须由 AnimationPage 通过 props 注入

---

## 5. CenterExtra 职责规范

### 5.1 允许内容

- 动画组件、图表、数据表、实时反馈、短公式标注

### 5.2 禁止内容

- 完整公式体系和推导过程 -> 移到右侧屏 FormulaSection
- 知识讲解文本 -> 移到右侧屏
- 高考考点总结 -> 移到右侧屏 ExamPointSection

---

## 6. 新章节验收检查清单

| 检查项 | 标准 |
|--------|------|
| 左侧屏是否只包含控制类内容 | 是 |
| 参数是否通过 paramMeta / controlMeta 生成 | 是 |
| SidebarExtra 是否仅保留复杂自定义控制 | 是 |
| 是否存在硬编码控件状态色 | 否 |
| SidebarExtra 是否直接访问 animation store | 否 |
| 右侧屏是否包含化学量、公式、高考要点三段 | 是 |
| 公式是否包含适用条件 | 是（如适用） |

---

## 7. 底部播放控制器规范

controlsMode 的完整定义见 ARCHITECTURE_RULES.md 8.1.4。

- 三种模式底部控制区的**高度应保持一致**
- 控制区只能出现在 AnimationCenter 内部

---

## 8. 扩展预留

| 扩展组件 | 适用场景 | 预计章节 |
|----------|----------|----------|
| StructureSelector | 分子结构选择 | 有机化学 |
| ConcentrationSlider | 浓度精确调节 | 溶液 |
| ReactionPreset | 反应预设（标题+描述+参数预览） | 化学平衡 |
