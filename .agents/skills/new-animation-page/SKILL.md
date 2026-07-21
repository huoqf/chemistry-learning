---
name: new-animation-page
description: 新建动画页面 / 创建新的化学动画组件 / 新增动画场景 / 添加新的 feature 动画 / 实现新动画
---

# 新建动画页面 Skill

> 在写第一行代码前，必须逐项过完本 Skill。所有「禁止」一旦出现即视为任务无效。

---

## Step 0：设计决策（代码前确认）

### 0A：布局 preset 选择

> **分屏是主流**：动画配合化学图表更能帮助学生理解过程和解题，大量页面使用 splitV 或 splitH。full 适合无需图表的纯场景演示。

| preset | 设计尺寸 | 选用条件 |
|--------|---------|---------|
| CANVAS_PRESETS.splitHw | 280x650 | **化学主力布局**：装置区窄（280px）+ 图表区宽（560px），化学平衡/滴定/速率/气体/沉淀 |
| CANVAS_PRESETS.splitH | 420x650 | **左右均分**：容器+简单图表（离子反应/溶液配制） |
| CANVAS_PRESETS.full | 840x650 | 无需图表的纯场景（分子结构/晶体/电化学池/有机路径/氧化还原） |
| CANVAS_PRESETS.square | 650x650 | 圆形/旋转对称（分子轨道/杂化轨道/粒子扩散/原子结构） |
| CANVAS_PRESETS.splitV | 840x325 | 上下分区（反应速率对比/能量图），化学低频 |

**决策直觉**：
- **装置+图表**（化学反应+实时曲线）-> **splitHw**（化学首选，装置区280px+图表区560px）
- 竖直变化+简单图表 -> splitH（均分）
- 水平变化+图表在上 -> splitV（低频）
- 无配套图表 -> full；圆形对称 -> square

> 严禁 wide/tall 等废弃 preset；严禁手写 width={840} 固定像素。


### 0B：三屏内容分配（铁律）

```
左屏（LeftPanel）         中屏（AnimationSvgCanvas）         右屏（由框架渲染）
─────────────────         ─────────────────────────         ─────────────────────
paramMeta -> 数值参数      动画场景 SVG 主体                  QuantitySection 化学量
controlMeta -> 模式开关    可选：CenterExtra 图表              FormulaSection 公式+条件
SidebarExtra（仅复杂）    禁止大段教学文字                    ExamPointSection 高考要点
                          禁止完整公式推导                    禁止参数控件
                          禁止高考考点总结
```

**主屏 SVG 文字约束**：只允许出现化学量数值标注（如 `c = 0.5 mol/L`）和坐标轴标签。禁止教学说明段落。


### 0C：controlsMode 选择

**高中化学动画默认选 timed。**

| 模式 | 值 | 典型场景 |
|------|---|---------|
| 完整控制栏 | 'timed'（默认，可省略） | 化学反应过程、滴定过程、浓度变化 — **绝大多数** |
| 参数提示条 | 'param' | 静态分子结构、化学键参数、平衡状态分析 |
| 循环速度栏 | 'loop' | 分子振动、布朗运动、电子云 — 少数 |
| 自动暂停型 | 'loop' + stopCondition | 化学平衡过程 — loop 循环运行，stopCondition 检测到正逆速率相等时自动暂停 |

判断顺序：
1. 动画有明确过程（起点/终点/时间推进）？-> 'timed'
2. 画面只随参数变化，无时间轴？-> 'param'
3. 永续循环无终点？-> 'loop'
4. 有平衡终点（化学平衡、滴定终点）？-> 'loop' + stopCondition


### 0D：其余参数

| 项 | 说明 |
|----|------|
| anchor | 'center'（圆周/旋转对称）/ 'viewport'（充满型，坐标原点在左下角）/ 'design'（设计坐标原点）/ 'custom'（手动指定） |
| worldWidth / worldHeight | 化学场景真实尺寸（用于 anchor='viewport'） |
| scaleDesign | 设计坐标比例（用于 anchor='center'） |
| 是否需要 CenterExtra | 需要实时图表时才加 |

---

## Step 1：文件结构（必须遵守）

```
src/features/<domain>/<topic>/
├── <Topic>Animation.tsx          <- 薄编排层（store + 组件组合，零化学公式）
├── hooks/
│   └── use<Topic>Chemistry.ts    <- 纯化学计算 hook（零 JSX，零副作用）
├── components/
│   └── <Topic>Scene.tsx          <- SVG 渲染（零化学公式，零 store 访问）
└── index.ts
```

如有 CenterExtra：根目录追加 <Topic>CenterExtra.tsx。

**viewModel 约束**：如有 model/viewModel.ts，只返回化学坐标数据，**禁止**引入 vp.scale/transform/visibleW/H 或任何 SVG 坐标。

---

## Step 2：骨架代码（替换 <Topic> -> 实际名称）

### <Topic>Animation.tsx

```tsx
import { useAnimationViewport, useSceneScale, useAnimationLifecycle } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { use<Topic>Chemistry } from './hooks/use<Topic>Chemistry'
import { <Topic>Scene } from './components/<Topic>Scene'

export default function <Topic>Animation() {
  // 1. Store（精确订阅，高频字段单独隔离）
  const { params, time } = useAnimationStore(
    useShallow((s) => ({ params: s.params, time: s.time }))
  )

  // 2. Viewport（新页面唯一标准路径）
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,   // <- Step 0A 决策结果
  })

  // 3. 参数提取
  const { c0 = 0, k = 1 } = params

  // 4. 化学计算（hook，不在 JSX 中写公式）
  const chemistry = use<Topic>Chemistry({ c0, k, time })

  // 5. SceneScale（禁止手写 x * scale + offset）
  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.full,   // <- 与上方一致
    anchor: 'center',               // <- Step 0D
    physicsWidth: 10,               // <- Step 0D
    physicsHeight: 8,
  })

  // 6. 渲染（containerRef 仅由 AnimationSvgCanvas 内部绑定，禁止外层 div 重复绑定）
  return (
    <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
      <<Topic>Scene chemistry={chemistry} canvasSize={canvasSize} sceneScale={sceneScale} />
    </AnimationSvgCanvas>
  )
}
```

> **splitV/splitH 布局模式**（图表+动画分区）：
> ```tsx
> // splitV：上图表 + 下动画，flex-col，各自独立 div，禁止互相嵌套
> return (
>   <div className="w-full h-full flex flex-col">
>     <div className="h-[310px] shrink-0">
>       <BaseChart points={ctPoints} currentTime={time} tMax={10} title="c-t" />
>     </div>
>     <div className="flex-1 min-h-0">
>       <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
>         <<Topic>Scene ... />
>       </AnimationSvgCanvas>
>     </div>
>   </div>
> )
> ```
>
> **splitHw 布局模式**（化学装置+图表，首选）：
> ```tsx
> // splitHw：左窄装置(280px) + 右宽图表(560px)，flex-row
> return (
>   <div className="w-full h-full flex flex-row">
>     <div className="w-[280px] h-full shrink-0">
>       <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
>         <<Topic>Scene ... />
>       </AnimationSvgCanvas>
>     </div>
>     <div className="flex-1 h-full min-w-0">
>       <BaseChart ... />
>     </div>
>   </div>
> )
> ```

### AnimationPage.tsx（页面薄壳，三屏组装）

> `<Topic>Animation` 只负责中屏内容，AnimationPage 负责三屏组装。
> 底部播放控制（AnimationControls）由 AnimationPage 自动渲染在中屏底部，**feature 组件无需手动添加**。

```tsx
// src/pages/AnimationPage.tsx — 框架层，一般无需修改
import { ThreePanel } from '@/components/Layout'
import { LeftPanel, LeftPanelSection, ParamControl, ControlPanel } from '@/components/UI'
import { RightPanel } from './RightPanel'
// 从 registry 读取 paramMeta / controlMeta / quantities / formulas / examPoints

<ThreePanel
  left={
    <LeftPanel>
      <ParamControl ... />    {/* registry paramMeta 驱动 */}
      <ControlPanel ... />    {/* registry controlMeta 驱动 */}
    </LeftPanel>
  }
  center={<TopicAnimation />}  {/* 本 Skill 创建的组件 */}
  right={<RightPanel quantities={...} formulas={...} examPoints={...} />}
/>
```

- 左屏控件由 registry 的 paramMeta / controlMeta 驱动，**禁止手写散乱控件**
- 右屏由框架渲染 QuantitySection + FormulaSection + ExamPointSection
- 播放控制（AnimationControls）由框架自动渲染在中屏底部

### hooks/use<Topic>Chemistry.ts

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

### components/<Topic>Scene.tsx

```tsx
// barrel import，禁止子路径
import { VectorArrow } from '@/components/Chemistry'
// ✅ 统一从 `@/theme` 导入所有颜色 Token（100% 遵从 UI: colors / 器材: SCENE_COLORS / 图表: CHART_COLORS / 化学量: CHEMISTRY_COLORS）
import { CHEMISTRY_COLORS, SCENE_COLORS, CANVAS_COLORS, CHART_COLORS } from '@/theme'
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

  // 化学坐标 -> 设计坐标（唯一合法路径）
  // const pos = worldToDesign({ x: chemistry.x, y: chemistry.y }, sceneScale)

  return (
    <g>
      {/* 场景器材：用现有组件（@/components/Chemistry 有 44+ 器材组件），禁止手写 */}
      {/* <BeakerApparatus x={100} y={200} width={80} fillLevel={0.6} font={font} /> */}

      {/* 矢量箭头：禁止手写 line+marker */}
      {/* <ChemistryVectorArrow originDesign={pos} vector={v} type="concentration" sceneScale={sceneScale} /> */}

      {/* SVG 文字：只标注化学量数值，font() 包裹，禁止裸 fontSize={N} */}
      {/* <text fontSize={font(11)} fill={CHEMISTRY_COLORS.concentration} textAnchor="middle">
        {`c = ${chemistry.c.toFixed(2)} mol/L`}
      </text> */}

      {/* 网格/轴线：用 CANVAS_COLORS，禁止 colors.neutral[200] */}
    </g>
  )
}
```

---

## Step 3：Registry 注册（5 个文件，同一任务必须全部完成）

### 3A：动画注册表（src/data/registries/<domain>.ts）

```ts
import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'

export const <domain>Animations = defineAnimations({
  'anim-<topic>': {
    title: '动画标题',
    knowledgeId: '<domain>-x-x',
    Component: lazy(() => import('@/features/<domain>/<topic>/<Topic>Animation')),
    controlsMode: 'timed',   // <- Step 0C 决策结果
    stopCondition: (params, t) => {
      // 示例：当正逆反应速率之差 < 0.001 时认为达到平衡
      const c = params.c0 * Math.exp(-params.k * t)
      const vForward = params.k * c
      const vReverse = params.k * (params.c0 - c)
      return Math.abs(vForward - vReverse) < 0.001
      // ❌ 禁止纯时间截断：return t >= 5.0  — 用时间代替化学判断
    },
    defaultParams: {
      c0: 1.0,
      k: 0.5,
    } as const,              // <- 必须 as const（编译期类型校验）
    paramMeta: [
      { key: 'c0', label: '初始浓度', min: 0.1, max: 5, step: 0.1, unit: 'mol/L', group: '反应参数' },
      { key: 'k',  label: '速率常数', min: 0.01, max: 2, step: 0.01, unit: 's⁻¹' },
      // 条件显示示例：仅在进阶模式（mode === 1）下显示活化能参数
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
      {
        type: 'step',
        label: '加入反应物',
        paramKey: 'c0',
        step: 0.2,
        unit: 'mol/L',
        max: 5,
        resetTime: true,
        hint: '每次加入 0.2 mol/L',
      },
    ],
  },
)
```

> **label 支持 KaTeX 公式**：paramMeta / controlMeta 中的 `label` 统一支持 `string | React.ReactNode`。化学式、离子式、上标下标混排等复杂公式应传入 `<KatexFormula formula="..." />`：
>
> ```ts
> import { KatexFormula } from '@/components/UI'
> paramMeta: [
>   { key: 'c0', label: <KatexFormula formula="c_0" />, min: 0.1, max: 5, step: 0.1, unit: 'mol/L' },
>   { key: 'Ka', label: <KatexFormula formula="K_a" />, min: 1e-5, max: 1, step: 1e-5 },
> ]
> ```

### 3B：化学量构建器（src/data/quantities/<domain>/）

```ts
// src/data/quantities/<domain>/<topic>.ts
import type { ChemistryPanelData } from '../types'
import { normalizeParams, type ParamDefs } from '../types'

interface <Topic>Params {
  c0: number  // mol/L
  k: number   // s^-1
}

const DEFAULTS: ParamDefs<<Topic>Params> = {
  c0: { default: 1.0 },
  k: { default: 0.5 },
}

export function build<Topic>Quantities(
  animId: string,
  params: Record<string, number>,
  time: number,
): ChemistryPanelData | null {
  const p = normalizeParams(params, DEFAULTS)
  const c = p.c0 * Math.exp(-p.k * time)
  const v = p.k * c
  return {
    quantities: [
      { label: '浓度', symbol: 'c', value: parseFloat(c.toFixed(4)), unit: 'mol/L' },
      { label: '速率', symbol: 'v', value: parseFloat(v.toFixed(4)), unit: 'mol/(L·s)' },
    ],
    formulas: [
      { name: '一级反应浓度公式', latex: 'c = c_0 e^{-kt}', level: 'core', condition: '一级反应' },
      { name: '速率方程', latex: 'v = kc', level: 'core' },
    ],
    examPoints: [
      { content: '能正确判断反应级数与浓度关系', importance: 'gaokao' },
    ],
  }
}
```

```ts
// src/data/chemistryQuantities.ts 中添加
'anim-<topic>': {
  loader: () => import('./quantities/<domain>/<topic>'),
  builderName: 'build<Topic>Quantities',
},
```

### 3C：知识树（src/data/knowledgeTree.ts）

确认 knowledgeId 对应的节点已存在，或添加新节点。

---

## Step 4：化学量颜色选用（按语义层级严格隔离）

| 语义层级 | 来源 | 适用 | import |
|---------|------|------|--------|
| **化学量** | CHEMISTRY_COLORS.* | 浓度、速率、能量等矢量标注 | @/theme |
| **场景器材** | SCENE_COLORS.* | 烧杯、试管、仪器材质 | @/theme |
| **Canvas 基础设施** | CANVAS_COLORS.* | 网格线、参考线、坐标轴 | @/theme |
| **图表** | CHART_COLORS.* | 图表曲线、填充 | @/theme |
| **透明度变体** | withAlpha(token, 0.3) | 任意半透明色 | @/theme |

```ts
// 禁止
fill="#3B82F6"                 // 硬编码 hex
stroke="red"
fill={colors.neutral[200]}    // UI 中性色用于 Canvas 基础设施
fill="rgba(0,0,0,0.3)"        // 手拼 rgba
import { withAlpha } from '@/theme/chemistry/colors'  // 子路径导入

// 正确
fill={CHEMISTRY_COLORS.concentration}
stroke={CHEMISTRY_COLORS.reactionRate}
stroke={CANVAS_COLORS.grid}   // 网格线
fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.3)}  // 从 @/theme 统一入口
```

---

## Step 5：组件复用速查（用现有组件，禁止手写等效实现）

> **铁律**：新建场景前必须查阅此表。`@/components/Chemistry` barrel 导出 44+ 组件，有现成组件时**禁止手写等效实现**。

### Chemistry 组件（@/components/Chemistry，barrel import）

| 分类 | 组件 | 用途 |
|------|------|------|
| **矢量标注** | ChemistryVectorArrow | 化学矢量（浓度/速率等，通过 refMagnitudes 归一化） |
| | VectorArrow | 视觉标注/几何图形/等长示意 |
| | VectorDefs | SVG marker 定义 |
| **粒子特效** | ParticleEmitter | 粒子发射源（布朗运动/扩散） |
| | ParticleTrajectory | 粒子轨迹渲染 |
| | BubbleEmitter | 气泡发射 |
| | IonMigration | 离子迁移 |
| **数据可视化** | QuantityBars | 化学量横向条形对比图 |
| **交互** | DragHandle | 可拖拽手柄 |
| **高中实验器材** | BeakerApparatus | 烧杯 |
| | ErlenmeyerFlaskApparatus | 锥形瓶 |
| | BuretteApparatus | 滴定管 |
| | VolumetricFlaskApparatus | 容量瓶 |
| | TestTubeApparatus | 试管 |
| | GasJarApparatus | 集气瓶 |
| | AlcoholLampApparatus | 酒精灯 |
| | SeparatoryFunnelApparatus | 分液漏斗 |
| | EvaporatingDishApparatus | 蒸发皿 |
| | KippApparatus | 启普发生器 |
| **支撑连接** | IronSupportApparatus | 铁架台 |
| | TripodMeshApparatus | 三脚架+石棉网 |
| | ClayTriangleApparatus | 泥三角 |
| | WaterBathApparatus | 水浴锅 |
| | GlassTubingConnectionApparatus | 玻璃导管连接 |
| **干燥冷凝** | DryingTubeApparatus | 干燥管 |
| | CondenserApparatus | 冷凝管 |
| | BuchnerFunnelApparatus | 布氏漏斗 |
| **电化学仪表** | ElectrochemCellApparatus | 电化学池 |
| | SaltBridgeApparatus | 盐桥 |
| | IonMembraneApparatus | 离子交换膜 |
| | PhMeterApparatus | pH 计 |
| | ThermometerApparatus | 温度计 |
| | BalanceApparatus | 天平 |
| | FlowMeterApparatus | 流量计 |
| **化工流程设备** | CrusherEquipment | 粉碎机/研磨机 |
| | RoastingFurnaceEquipment | 焙烧炉 |
| | RotaryKilnEquipment | 回转窑 |
| | LeachingReactorEquipment | 浸出槽/反应釜 |
| | AbsorptionTowerEquipment | 吸收塔/洗涤塔 |
| | IndustrialElectrolyzerEquipment | 工业电解槽 |
| | CrystallizerEquipment | 结晶器 |
| | IonExchangeColumnEquipment | 离子交换柱 |

### Chart 组件（@/components/Chart，barrel import）

| 组件 | 用途 |
|------|------|
| BaseChart | 所有新图表的原子容器（坐标系/网格/刻度） |
| ChartCursor | 游标十字线 + 数据点 |
| ChartLine | 折线插件 |
| ChartArea | 曲线下方面积填充 |
| ChartTangent | 切线 + 切点 |

### Layout 组件（@/components/Layout）

| 组件 | 用途 |
|------|------|
| AnimationSvgCanvas | SVG 画布容器（containerRef + transform） |
| ThreePanel | 三栏响应式布局 |

### UI 组件（@/components/UI）

| 组件 | 用途 |
|------|------|
| LeftPanel / LeftPanelSection | 左屏控制台容器与分区 |
| ParamControl | 数值参数滑块（registry paramMeta 驱动） |
| ControlPanel | 声明式控件（registry controlMeta 驱动） |
| AnimationControls | 播放/暂停/重置/速度/进度条 |
| MiniChart | 小型内嵌实时时序图 |
| KatexFormula | KaTeX 公式渲染 |
| Button / SegmentedControl / ToggleSwitch | 基础控件 |

> 禁止手画：line+marker 替代矢量箭头、手写器材 SVG 替代组件、手写 toSvgX/toSvgY 替代 BaseChart、foreignObject 内嵌图表

---

## Step 6：import 路径规范

```ts
// 子目录 barrel（推荐）
import { VectorArrow, ChemistryVectorArrow } from '@/components/Chemistry'
import { AnimationSvgCanvas } from '@/components/Layout'
import { LeftPanel, ParamControl } from '@/components/UI'
import { BaseChart } from '@/components/Chart'
import { CHEMISTRY_COLORS, SCENE_COLORS, CANVAS_COLORS, withAlpha } from '@/theme'
import { CANVAS_PRESETS } from '@/theme'

// 禁止子路径导入
import { VectorArrow } from '@/components/Chemistry/VectorArrow'
import { withAlpha } from '@/theme/chemistry/colors'
```

---

## 执行前 Checklist

- [ ] **三屏**：主屏无教学文字；左屏参数走 paramMeta/模式走 controlMeta；右屏由框架渲染
- [ ] **布局**：preset 正确（full/splitV/splitH/splitHw/square）；化学装置+图表首选 splitHw；无 viewBox+vp.transform 双重缩放；坐标走 worldToDesign
- [ ] **组件**：矢量箭头用 VectorArrow/ChemistryVectorArrow；图表用 BaseChart 等；器材用现有组件（选用前核对组件视觉外观与适用语义）
- [ ] **颜色**：无 hex 硬编码；化学量用 CHEMISTRY_COLORS，器材用 SCENE_COLORS，网格/轴线用 CANVAS_COLORS；SVG 字号用 font(N)；画布区域无自写深色背景类名
- [ ] **时序图**：history 基于固定全量时间轴预计算；图表显式传入 xDomain；stopCondition 使用化学条件判断（非时间截断）；stopCondition 触发的状态在所有 reset 路径中同步清空
- [ ] **右屏公式**：单条 LaTeX 中 \text{} 内中文不超过 6 字；多条判断条件已拆分为多条独立短公式
- [ ] **Registry**：动画表已注册（defaultParams as const，controlsMode 正确）；化学量构建器已实现并注册；知识点已确认
- [ ] **化学逻辑**：涉及热化学/平衡移动/滴定/电极极性时，已逐字对照教材核对方向三要素（反应方向 - 吸/放热 - 浓度/压强/温度影响方向）
- [ ] **代码**：化学 hook 无副作用；barrel import；tsc --noEmit 通过
