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

⚠️ **worldWidth 账本**：`useSceneScale` 的 `worldWidth` 等于 **SVG 画布实际宽度**（splitH 左区=**420**，splitHw 装置区=**280**，full=**840**），写错导致场景双倍/半倍缩放。

⚠️ **高度账本**：多图表时用 `flex-1 min-h-0` 弹性平分，严禁手写 `h-[280px]` 固定高度与 `overflow-y-auto` 滚动。

> 三屏内容分配铁律（主屏禁止教学文字、左屏走 paramMeta/controlMeta、右屏由框架渲染）见 AGENTS.md 开头。

### 0B：controlsMode

| 模式 | 典型场景 |
|------|---------|
| `'timed'`（默认，可省略） | 化学反应/滴定/浓度变化——**绝大多数** |
| `'param'` | 静态结构、参数分析，无时间轴 |
| `'loop'` | 分子振动、布朗运动，永续循环 |
| `'loop'` + stopCondition | 化学平衡（正逆速率相等自动暂停） |

### 0C：其余参数

| 项 | 说明 |
|----|------|
| anchor | `'center'`（圆周对称）/ `'viewport'`（充满型）/ `'design'`（固定原点） |
| worldWidth/Height | 化学场景真实尺寸（anchor='viewport' 时必填） |
| CenterExtra | 需要实时图表时才加 |

---

## Step 1：文件结构

```
src/features/<domain>/<topic>/
├── <Topic>Animation.tsx          ← 薄编排层（store + 组件组合，零化学公式）
├── hooks/
│   └── use<Topic>Chemistry.ts    ← 纯化学计算 hook（零 JSX，零副作用）
├── components/
│   └── <Topic>Scene.tsx          ← SVG 渲染（零化学公式，零 store 访问）
└── index.ts
```

如有 CenterExtra：根目录追加 `<Topic>CenterExtra.tsx`。

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
    physicsWidth: 10,
    physicsHeight: 8,
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
>         <BaseChart title="图表 1" xDomain={[0, 2]} yDomain={[-2, 8]} ... />
>       </div>
>     </div>
>   </div>
> )
> // splitH sceneScale: worldWidth = 左区宽度 420
> // useSceneScale({ vp, preset: CANVAS_PRESETS.splitH, anchor: 'viewport', worldWidth: 420, worldHeight: 650 })
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
    // 纯化学计算，无副作用，无 DOM/React/window/store 依赖
    const c = c0 * Math.exp(-k * time)
    const v = k * c
    return { c, v }
  }, [c0, k, time])
}
```

### `components/<Topic>Scene.tsx`

```tsx
// 颜色/Token 见 AGENTS.md 铁律 4B（化学量→CHEMISTRY_COLORS，器材→SCENE_COLORS，图表→CHART_COLORS）
// 组件复用见 AGENTS.md 铁律 4（44+ 化学器材组件）
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
      {/* 坐标：worldToDesign({ x, y }, sceneScale)，禁止手写 x * scale + offset */}
      {/* 字号：font(N)，禁止裸 fontSize={14}（见 AGENTS.md 铁律 7） */}
    </g>
  )
}
```

---

## Step 3：Registry 注册（5 个文件，同一任务必须全部完成）

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

> **label 支持 KaTeX**：`{ key: 'Ka', label: <KatexFormula formula="K_a" />, ... }`（从 `@/components/UI` 导入）。

### 3B：化学量构建器（`src/data/quantities/<domain>/<topic>.ts`）

```ts
// ⚠️ 只提供右屏「化学量数值」，formulas/gaokaoPoints 在 registry 字段定义，不在此处
import type { ChemistryQuantity } from '../../chemistryQuantities'

export function build<Topic>Quantities(
  params: Record<string, number>,
  time: number,
): ChemistryQuantity[] {
  const { c0 = 1.0, k = 0.5 } = params
  const c = c0 * Math.exp(-k * time)
  const v = k * c
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

### 3C：知识树（`src/data/knowledgeTree.ts`）

`resolveAnimationIds()` 自动关联，无需手动操作。只需确认：
1. `knowledgeId` 与 `knowledge/<domain>.ts` 中节点 `id` 一致（静默失败，必须手动核对）
2. 全新领域需在 `knowledge/<domain>.ts` 添加节点，并在 `knowledge/index.ts` 导出

---

## 执行前 Checklist

- [ ] **三屏**：主屏无教学文字；左屏走 paramMeta/controlMeta；右屏由框架渲染（见 AGENTS.md 三屏铁律）
- [ ] **布局**：preset 正确；worldWidth 对应 SVG 实际宽度；多图表用 `flex-1 min-h-0`；无手写固定高度；无 `foreignObject`
- [ ] **时序图**：history 全量预计算 + `.filter(p => p.time <= time)`；图表显式传 `xDomain={[0, MAX_TIME]}`；stopCondition 用化学条件（非时间截断）；reset 路径同步清空衍生状态
- [ ] **右屏**：`formulas`/`gaokaoPoints` 为动态函数形式（多模型页面必须）；LaTeX 中 `\text{}` 内中文 ≤ 6 字
- [ ] **Registry**：5 个文件全部完成（注册表 as const + 化学量构建器 + 知识点 id 核对）
- [ ] **化学逻辑**：热化学/平衡移动/滴定/电极极性已逐字对照教材核对三要素
- [ ] **代码**：barrel import；无裸 requestAnimationFrame；`tsc --noEmit` 通过
