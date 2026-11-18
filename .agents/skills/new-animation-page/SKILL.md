---
name: new-animation-page
description: 新建动画页面 / 创建新的化学动画组件 / 新增动画场景 / 添加新的 feature 动画 / 实现新动画
---

# 新建动画页面 Skill

> 在写第一行代码前，必须逐项过完本 Skill。所有「禁止」一旦出现即视为任务无效。

---

## Step 0：设计决策（代码前确认）

### 0A：preset 选择

> 见 AGENTS.md 布局铁律完整表。快速决策：
> - 装置+实时曲线 → **splitHw**（化学首选，装置 280px + 图表 560px）
> - SVG 场景+辅助对照图 → **splitH**（左右各 420px）
> - 水平变化+图表在上 → **splitV**（低频）
> - 无图表 → **full**；圆形对称 → **square**

⚠️ **worldWidth 账本**：`useSceneScale` 的 `worldWidth` 是**化学/物理逻辑坐标系的场景域宽度**（`scaleX = visibleDesign.width / worldWidth`，如反应容器跨度 `10` 个逻辑单位）；不要把设计画布宽度 `420/280/840` 当作 `worldWidth`（那会导致 `scaleX ≈ 1` 而丧失世界坐标映射）。

⚠️ **高度账本**：多图表时用 `flex-1 min-h-0` 弹性平分，严禁手写 `h-[280px]` 固定高度与 `overflow-y-auto` 滚动。

> 三屏内容分配铁律（主屏禁止教学文字、左屏走 paramMeta/controlMeta、右屏由框架渲染）见 AGENTS.md 开头。

### 0B：controlsMode

| 模式 | 典型场景 |
|------|---------|
| `'timed'`（默认，可省略） | 化学反应/滴定/浓度变化/化学平衡（配 `stopCondition`）——**绝大多数** |
| `'param'` | 静态结构、参数分析，无时间轴 |
| `'loop'` | 分子热运动、布朗运动等永续循环演示 |

### 0C：其余参数

| 项 | 说明 |
|----|------|
| anchor | `'center'`（圆周对称，配 `scaleDesign`）/ `'viewport'`（充满型，配 `worldWidth`/`worldHeight`）/ `'design'`（固定原点） |
| worldWidth/Height | 化学场景逻辑坐标系宽高（`anchor='viewport'` 时必填） |
| 右屏与附属展示 | 通过 `chemistryQuantities.ts` + registry `formulas`/`gaokaoPoints` 驱动（`AnimationPage` 自身不消费 `CenterExtra`） |

---

## Step 1：文件结构

```
src/chemistry/<domain>.ts         ← 纯物理化学底层计算（统一来源，无 React 依赖）
src/features/<domain>/<topic>/
├── <Topic>Animation.tsx          ← 薄编排层（store + 组件组合，零化学公式）
├── hooks/
│   └── use<Topic>Chemistry.ts    ← 化学计算 hook（引入 @/chemistry 纯计算，零 JSX，零副作用）
├── components/
│   └── <Topic>Scene.tsx          ← SVG 渲染（零化学公式，零 store 访问）
└── index.ts
```

⚠️ **纯计算层唯一来源**：化学公式推导、平衡态演化、微观速率、电极转移电子数等核心计算必须在 `src/chemistry/` 集中收敛。Hook 与右屏 Quantities 构建器**100% 共同 import 同一纯函数**，严禁在两处各写一套导致数据脱节。

**viewModel 约束**：如有 model/viewModel.ts，只返回化学坐标数据，**禁止**引入 vp.scale/transform/visibleW/H 或任何 SVG 坐标。

---

## Step 2：骨架代码

### `<Topic>Animation.tsx`（full 布局）

```tsx
import { useAnimationViewport, useSceneScale } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { use<Topic>Chemistry } from './hooks/use<Topic>Chemistry'
import { <Topic>Scene } from './components/<Topic>Scene'

export default function <Topic>Animation() {
  const { params, time } = useAnimationStore(
    useShallow((s) => ({ params: s.params, time: s.time }))
  )

  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,   // ← Step 0A 决策结果
  })

  const { c0 = 0, k = 1 } = params

  const chemistry = use<Topic>Chemistry({ c0, k, time })

  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.full,
    anchor: 'center',
    scaleDesign: 40, // 1 逻辑单位 = 40 设计像素
  })

  return (
    <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
      <<Topic>Scene chemistry={chemistry} canvasSize={canvasSize} sceneScale={sceneScale} />
    </AnimationSvgCanvas>
  )
}
```

> **splitHw 布局**（化学装置+多图表，首选）：
> ```tsx
> return (
>   <div className="w-full h-full flex flex-row overflow-hidden">
>     <div className="w-[280px] h-full shrink-0">
>       <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
>         <<Topic>Scene ... />
>       </AnimationSvgCanvas>
>     </div>
>     <div className="flex-1 h-full min-w-0 flex flex-col">
>       <div className="flex-1 min-h-0 w-full p-2 border-b border-slate-200/60">
>         <BaseChart title="图表 1" ... />
>       </div>
>       <div className="flex-1 min-h-0 w-full p-2">
>         <BaseChart title="图表 2" ... />
>       </div>
>     </div>
>   </div>
> )
> ```
>
> **splitH 布局**（左右均分，⚠️ 图表在 DOM 层严禁 foreignObject）：
> ```tsx
> return (
>   <div className="w-full h-full flex flex-row overflow-hidden">
>     {/* 左侧：SVG 动画，占 50% 宽 */}
>     <div className="flex-1 h-full min-w-0">
>       <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
>         <<Topic>Scene ... />
>       </AnimationSvgCanvas>
>     </div>
>     {/* 右侧：图表区，DOM 层与 SVG 平级，无 foreignObject */}
>     <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden border-l border-slate-200/60">
>       <div className="flex-1 min-h-0 w-full p-2">
>         <BaseChart title="图表 1" xDomain={[0, MAX_TIME]} yDomain={[0, 2]} xLabel="t / s" yLabel="c / (mol·L⁻¹)" ... />
>       </div>
>     </div>
>   </div>
> )
> // splitH sceneScale: worldWidth 为化学逻辑域宽度（例如反应区 10 个逻辑单位）
> // useSceneScale({ vp, preset: CANVAS_PRESETS.splitH, anchor: 'viewport', worldWidth: 10, worldHeight: 15 })
> ```
>
> **splitV 布局**（上图表+下动画）：
> ```tsx
> return (
>   <div className="w-full h-full flex flex-col overflow-hidden">
>     <div className="flex-1 min-h-0 w-full">
>       <BaseChart ... />
>     </div>
>     <div className="flex-1 min-h-0 w-full">
>       <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
>         <<Topic>Scene ... />
>       </AnimationSvgCanvas>
>     </div>
>   </div>
> )
> ```

### `hooks/use<Topic>Chemistry.ts`

```ts
import { useMemo } from 'react'

interface Use<Topic>ChemistryParams {
  c0: number   // 初始浓度 mol/L
  k: number    // 速率常数
  time: number // 时间 s
}

export interface <Topic>ChemistryResult {
  c: number    // 当前浓度 mol/L
  v: number    // 反应速率 mol/(L*s)
}

/**
 * 计算 <Topic> 化学状态
 * @param c0 - 初始浓度 (mol/L)
 * @param k  - 速率常数
 * @param time - 时间 (s)
 */
export function use<Topic>Chemistry({ c0, k, time }: Use<Topic>ChemistryParams): <Topic>ChemistryResult {
  return useMemo(() => {
    // 委托 src/chemistry/<domain>.ts 纯函数计算（与右屏 Quantities 共享同一公式源）
    return compute<Topic>State(c0, k, time)
  }, [c0, k, time])
}
```

### `components/<Topic>Scene.tsx`

```tsx
// 颜色/Token 见 AGENTS.md 铁律 4B（化学量→CHEMISTRY_COLORS，器材→SCENE_COLORS，图表→CHART_COLORS）
// 组件复用见 AGENTS.md 铁律 4（完整清单见 docs/agent-rules/ui/COMPONENT_REGISTRY.md）
// import 路径见 AGENTS.md 铁律 4C（统一 @/theme 入口，barrel import）
import { VectorArrow } from '@/components/Chemistry'
import { CHEMISTRY_COLORS, SCENE_COLORS, CANVAS_COLORS } from '@/theme'
import { worldToDesign } from '@/scene'
import type { SceneScale } from '@/scene'
import type { <Topic>ChemistryResult } from '../hooks/use<Topic>Chemistry'

interface <Topic>SceneProps {
  chemistry: <Topic>ChemistryResult
  canvasSize: { font: (size: number) => number }
  sceneScale: SceneScale
}

export function <Topic>Scene({ chemistry, canvasSize, sceneScale }: <Topic>SceneProps) {
  const { font } = canvasSize

  return (
    <g>
      {/* 器材：用现有组件，禁止手写等效 SVG */}
      {/* 坐标：const { px, py } = worldToDesign(x, y, sceneScale)，禁止手写 x * scale + offset */}
      {/* 字号：font(N)，禁止裸 fontSize={14}（见 AGENTS.md 铁律 7） */}
    </g>
  )
}
```

---

## Step 3：Registry 注册（4 个核心文件 + 知识点同步，同一任务必须全部完成）

### 3A：动画注册表（`src/data/registries/<domain>.ts`）

```ts
import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'

export const <domain>Animations = defineAnimations({
  'anim-<topic>': {
    title: '动画标题',
    knowledgeId: '<domain>-x-x',
    Component: lazy(() => import('@/features/<domain>/<topic>/<Topic>Animation')),
    controlsMode: 'timed',         // ← Step 0B 决策结果
    stopCondition: (params, t) => {
      // ✅ 化学条件判断（如正逆速率之差 < 0.001）
      // ❌ 禁止纯时间截断：return t >= 5.0
      return false
    },
    defaultParams: {
      c0: 1.0,
      k: 0.5,
    } as const,                    // 必须 as const（编译期类型校验）
    paramMeta: [
      { key: 'c0', label: '初始浓度', min: 0.1, max: 5, step: 0.1, unit: 'mol/L', group: '反应参数' },
      { key: 'k',  label: '速率常数', min: 0.01, max: 2, step: 0.01, unit: 's⁻¹' },
      // showIf 条件显示示例：
      { key: 'Ea', label: '活化能', min: 10, max: 200, step: 5, unit: 'kJ/mol', showIf: 'mode', showIfValue: 1 },
    ],
    controlMeta: [
      {
        type: 'segmented',
        key: 'mode',
        group: '模型选择',
        resetOnChange: true,
        options: [{ label: '基础', value: 0 }, { label: '进阶', value: 1 }],
      },
      { type: 'tip', group: '教学提示', content: '拖动滑块观察浓度变化' },
      // step 控件（逐步加入试剂）：
      { type: 'step', label: '加入反应物', paramKey: 'c0', step: 0.2, unit: 'mol/L', max: 5, resetTime: true },
    ],
    // ⚠️ 多模型页面必须写成动态函数（静态数组右屏不联动且无编译报错）
    formulas: (params) => getTopicFormulas(params),
    gaokaoPoints: (params) => getTopicExamPoints(params),
  },
})
```

> **label 支持 KaTeX**：`label` 类型为 `string | ReactNode`，若需直接传入 `<KatexFormula formula="K_a" />`（从 `@/components/UI` 导入），注册表文件须使用 `.tsx` 扩展名；在纯 `.ts` 注册表中请使用纯字符串或 Unicode 下标（如 `Kₐ`、`NO₂`）。

### 3B：化学量构建器（`src/data/quantities/<domain>/<topic>.ts`）

```ts
// ⚠️ 只提供右屏「化学量数值」，formulas/gaokaoPoints 在 registry 字段定义，不在此处
import type { ChemistryQuantity } from '../../chemistryQuantities'

export function build<Topic>Quantities(
  params: Record<string, number>,
  time: number,
): ChemistryQuantity[] {
  const { c0 = 1.0, k = 0.5 } = params
  // 与 Hook 共同调用 src/chemistry/<domain>.ts 纯函数
  const { c, v } = compute<Topic>State(c0, k, time)
  return [
    { key: 'c', label: '浓度', value: parseFloat(c.toFixed(4)), unit: 'mol/L',     colorKey: 'concentration' },
    { key: 'v', label: '速率', value: parseFloat(v.toFixed(4)), unit: 'mol/(L·s)', colorKey: 'reactionRate'  },
  ]
}
```

```ts
// src/data/chemistryQuantities.ts 追加：
import { build<Topic>Quantities } from './quantities/<domain>/<topic>'
registerQuantityBuilder('anim-<topic>', build<Topic>Quantities)
```

### 3C：知识树（`src/data/knowledgeTree.ts` & `src/data/knowledge/<domain>.ts`）

需核对以下两处：
1. `knowledgeId` 与 `src/data/knowledge/<domain>.ts` 中节点 `id` 一致（静默失败，必须手动核对）；
2. `src/data/knowledgeTree.ts` 的 `resolveAnimationIds` 在 `loadExtendedRegistry()` 后会自动按 `knowledgeId` 反向注入，同时需把新动画 ID 追加到同步回退列表 `animIds` 中（全新领域还需在 `knowledge/<domain>.ts` 添加节点，并在 `knowledge/index.ts` 导出）。

---

## 执行前 Checklist

- [ ] **三屏**：主屏无教学文字；左屏走 paramMeta/controlMeta；右屏由框架渲染（见 AGENTS.md 三屏铁律）
- [ ] **布局**：preset 正确；worldWidth 对应逻辑坐标系宽度；多图表用 `flex-1 min-h-0`；无手写固定高度；无 `foreignObject`
- [ ] **背景色**：画布区及图表区任何包裹 div 绝不手写背景色（包括 bg-white、bg-slate-50 等，由 Light Theme 统一提供）
- [ ] **纯计算层**：复杂反应/平衡/动力学公式在 `src/chemistry/` 权威收敛，Hook 与右屏 Quantities 100% 同源引用
- [ ] **时序图**：history 全量预计算 + `.filter(p => p.time <= time)`；图表显式传 `xDomain={[0, MAX_TIME]}`；stopCondition 用化学条件（非时间截断）；reset 路径同步清空衍生状态
- [ ] **右屏**：`formulas`/`gaokaoPoints` 为动态函数形式（多模型页面必须）；LaTeX 中 `\text{}` 内中文 ≤ 6 字
- [ ] **Registry**：4 个核心文件 + 知识点核对全部完成（注册表 as const + 化学量构建器 + 登记 + 知识点 id 核对）
- [ ] **化学逻辑**：热化学/平衡移动/滴定/电极极性已逐字对照教材核对三要素
- [ ] **代码**：barrel import；无裸 requestAnimationFrame；`tsc --noEmit` 通过
