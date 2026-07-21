---
name: new-chem-component
description: 新建化学器材组件 / 新建实验装置SVG组件 / 实现化工设备组件 / 添加Beaker烧杯 / 添加Flask锥形瓶 / 添加RoastingFurnace焙烧炉 / 添加Crusher粉碎机 / 添加Grinder研磨机 / 添加Kiln煅烧炉 / 添加回转窑 / 新建器材Scene组件 / 重构器材手写SVG
---

# 化学器材组件 Skill

> 在写第一行代码前，必须逐项过完本 Skill。所有「禁止」一旦出现即视为任务无效。
>
> 适用范围：
> - 高中化学实验器材（烧杯、锥形瓶、滴定管、坩埚、蒸馏装置等）
> - 高考化工流程工业设备（粉碎机、焙烧炉、煅烧炉、回转窑、浸出槽、合成塔等）
> - 任何放入 `src/components/Chemistry/` 下的可复用 SVG 场景组件

---

## Step 0：决策前审计（新建前必读）

### 0A：先查现有组件，禁止重复手写

现有组件（`@/components/Chemistry` barrel 导出）：

> **铁律**：`@/components/Chemistry` barrel 导出 44+ 组件，新建前必须逐类排查。

| 分类 | 已有组件 |
|------|---------|
| **矢量标注** | ChemistryVectorArrow, VectorArrow, VectorDefs |
| **粒子特效** | ParticleEmitter, ParticleTrajectory, BubbleEmitter, IonMigration |
| **数据可视化** | QuantityBars |
| **交互** | DragHandle |
| **高中实验器材** | BeakerApparatus（烧杯）, ErlenmeyerFlaskApparatus（锥形瓶）, BuretteApparatus（滴定管）, VolumetricFlaskApparatus（容量瓶）, TestTubeApparatus（试管）, GasJarApparatus（集气瓶）, AlcoholLampApparatus（酒精灯）, SeparatoryFunnelApparatus（分液漏斗）, EvaporatingDishApparatus（蒸发皿）, KippApparatus（启普发生器） |
| **支撑连接** | IronSupportApparatus（铁架台）, TripodMeshApparatus（三脚架+石棉网）, ClayTriangleApparatus（泥三角）, WaterBathApparatus（水浴锅）, GlassTubingConnectionApparatus（玻璃导管连接） |
| **干燥冷凝** | DryingTubeApparatus（干燥管）, CondenserApparatus（冷凝管）, BuchnerFunnelApparatus（布氏漏斗） |
| **电化学仪表** | ElectrochemCellApparatus（电化学池）, SaltBridgeApparatus（盐桥）, IonMembraneApparatus（离子交换膜）, PhMeterApparatus（pH计）, ThermometerApparatus（温度计）, BalanceApparatus（天平）, FlowMeterApparatus（流量计） |
| **化工流程设备** | CrusherEquipment（粉碎机）, RoastingFurnaceEquipment（焙烧炉）, RotaryKilnEquipment（回转窑）, LeachingReactorEquipment（浸出槽）, AbsorptionTowerEquipment（吸收塔）, IndustrialElectrolyzerEquipment（工业电解槽）, CrystallizerEquipment（结晶器）, IonExchangeColumnEquipment（离子交换柱） |

**规则**：先确认无现成组件或无法满足需求，方可新建。不得手写等效实现替代以上组件。

### 0B：组件类型判断

| 情况 | 处置 |
|------|------|
| 纯 SVG 绘制的静态/参数化器材 | 新建 `XxxApparatus.tsx` 或 `XxxEquipment.tsx` |
| 已有类似器材，仅外观不同 | 在现有组件上加 `variant` prop，不新建文件 |
| 工业化工设备（高考化工流程） | 新建 `XxxEquipment.tsx`，放入 Chemistry 公共库 |
| 仅在一个动画页面内使用的一次性形状 | 放在 `features/<domain>/<topic>/components/` 下，不进公共库 |

---

## Step 1：文件结构与命名规范

### 公共组件（多个页面共用）

```
src/components/Chemistry/
├── XxxApparatus.tsx        <- 实验器材（高中实验）
├── XxxEquipment.tsx        <- 工业设备（高考化工流程）
└── index.ts                <- barrel 导出（新组件必须在此注册）
```

### 页面专属组件

```
src/features/<domain>/<topic>/components/
└── XxxScene.tsx            <- 组合多个器材的场景组件
```

### 命名约定

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 高中实验器材 | `<名称>Apparatus` | `BeakerApparatus` `BuretteApparatus` |
| 高考化工设备 | `<名称>Equipment` | `RoastingFurnaceEquipment` `CrusherEquipment` |
| 场景（多器材组合） | `<Topic>Scene` | `TitrationScene` `LeachingScene` |

---

## Step 2：组件骨架

### 实验器材骨架

```tsx
// src/components/Chemistry/XxxApparatus.tsx
import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface XxxApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 80） */
  width?: number
  /** 器材高度（设计单位，默认 120） */
  height?: number
  /** 内部液体填充比例 0~1（默认 0 空器材） */
  fillLevel?: number
  /** 内部液体颜色（默认 SCENE_COLORS.reagent.solution） */
  fillColor?: string
  /** 字体缩放函数，由 useAnimationViewport 提供 */
  font?: FontScaler
}

/**
 * XxxApparatus — XXX 器材组件
 *
 * 坐标系：设计坐标，左上角 (x, y) 定位。
 * 外部使用 worldToDesign() 将化学坐标转换后传入。
 * 极小尺寸自适应：当 width < 40 时自动隐去刻度等微小细节，避免画面杂乱。
 *
 * @example
 * ```tsx
 * <XxxApparatus x={140} y={200} width={80} fillLevel={0.6}
 *   fillColor={SCENE_COLORS.reagent.acid} font={font} />
 * ```
 */
export function XxxApparatus({
  x,
  y,
  width = 80,
  height = 120,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  font = (n) => n,
}: XxxApparatusProps) {
  const w = width
  const h = height
  const wallT = Math.max(2, w * 0.04) // 壁厚保底，防止极小时看不清
  const innerH = h * fillLevel
  const isTiny = w < 40 // 微缩模式判定

  return (
    <g transform={`translate(${x}, ${y})`}>
      {fillLevel > 0 && (
        <rect
          x={wallT} y={h - innerH}
          width={w - wallT * 2} height={innerH}
          fill={fillColor} opacity={0.7}
        />
      )}
      <rect
        x={0} y={0} width={w} height={h}
        fill={SCENE_COLORS.container.beaker}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
        rx={Math.max(1, w * 0.03)}
      />
      {/* 刻度线：仅非微缩模式显示 */}
      {!isTiny && (
        <line
          x1={wallT} y1={h * 0.5} x2={wallT + w * 0.15} y2={h * 0.5}
          stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={STROKE.reference}
        />
      )}
      {/* TODO: 补充器材特有细节 */}
    </g>
  )
}
```

### 工业化工设备骨架

```tsx
// src/components/Chemistry/XxxEquipment.tsx
import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface XxxEquipmentProps {
  x: number
  y: number
  width?: number
  height?: number
  /** 运行状态 'idle' | 'running' | 'heating' */
  status?: 'idle' | 'running' | 'heating'
  /** 进料量比例 0~1 */
  inputLevel?: number
  /** 字体缩放函数 */
  font?: FontScaler
  /** 是否显示流向箭头 */
  showFlow?: boolean
}

/**
 * XxxEquipment — XXX 化工设备（高考化工流程）
 *
 * @example
 * ```tsx
 * <XxxEquipment x={200} y={100} width={120} height={160}
 *   status="heating" font={font} />
 * ```
 */
export function XxxEquipment({
  x, y, width = 100, height = 80,
  status = 'idle',
  font = (n) => n,
}: XxxEquipmentProps) {
  const isRunning = status === 'running' || status === 'heating'
  const bodyColor = isRunning
    ? SCENE_COLORS.industrialEquipment.roastingFurnace
    : SCENE_COLORS.materials.metal

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width} height={height}
        fill={bodyColor}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
        rx={6}
      />
      <text
        x={width / 2} y={height / 2 + 5}
        textAnchor="middle"
        fontSize={font(FONT.small)}
        fill="white" fontWeight="bold"
      >
        XXX
      </text>
      {/* TODO: 补充设备特有结构 */}
    </g>
  )
}
```

---

## Step 3：各类设备绘制规范

### 3A：高中实验常见器材

| 器材 | 关键几何特征 | SCENE_COLORS 键 |
|------|------------|----------------|
| 烧杯 Beaker | 直筒+倒梯形底，有出液嘴 | `container.beaker` |
| 锥形瓶 ErlenFlask | 圆底三角锥体+细颈 | `container.flask` |
| 试管 TestTube | 细圆筒+圆弧底，有时有管塞 | `container.testTube` |
| 坩埚 Crucible | 小圆锥形瓷器，底部厚 | `separationAndPurification.crucible` |
| 蒸发皿 EvaporatingDish | 浅圆盘形，有把手 | `separationAndPurification.evaporatingDish` |
| 酒精灯 AlcoholLamp | 圆柱底座+灯芯+火焰 | `heatingAndSupport.alcoholLamp` |
| 圆底烧瓶 RoundFlask | 球形瓶身+细颈 | `reactionAndGas.roundBottomFlask` |
| 冷凝管 Condenser | 双层管，内外套管 | `separationAndPurification.condenser` |
| 启普发生器 KippApparatus | 三球形联通结构 | `reactionAndGas.kippApparatus` |

### 3B：高考化工设备绘制规范

**粉碎机 / 研磨机（Crusher / Grinder）**
- 外框：梯形，顶宽 > 底宽（进料口大、出料口小），`materials.metal`
- 进料口：顶部漏斗开口，`materials.iron`
- 出料口：底部小矩形
- 内部：交叉锤头或齿状折线（表示粉碎机构）
- 运行时可加旋转动画（内部齿轮形状）
- 标注：设备名 "粉碎机" 或 "球磨机"

```tsx
// CrusherEquipment 几何参考
// 外框 trapezoid：顶宽 topW = width*0.9，底宽 botW = width*0.6
// points: cx-topW/2,0  cx+topW/2,0  cx+botW/2,height  cx-botW/2,height
// 内部锤头：<rect width=20 height=6 rx=2 transform="rotate(30, cx, cy)" />
```

**焙烧炉 / 煅烧炉（Roasting Furnace / Calciner）**
- 主体：竖向高矩形，`industrialEquipment.roastingFurnace`（砖红色）
- 炉膛：内部偏深色矩形区域，宽 80%，高 60%
- 烟囱/排气口：顶部居中细矩形（高 height*0.3，宽 width*0.2），深灰色
- 进料口：顶部或左侧矩形开口
- 出料口：底部或右侧矩形开口
- 加热状态：炉膛内 `heatingAndSupport.flame`（橙色）渐变区域
- 进出料管：用 `industrialPipeline.slurryPipe`

```tsx
// RoastingFurnaceEquipment 结构参考
// 炉体：<rect> fill=roastingFurnace
// 炉膛：<rect x=width*0.1 y=height*0.2 width=width*0.8 height=height*0.6> 偏深色
// 烟囱：<rect x=width*0.4 y=-height*0.25 width=width*0.2 height=height*0.25> 深灰
// 加热时：<rect y=height*0.5 height=height*0.3> fill=flame（橙色渐变）
```

**回转窑（Rotary Kiln）**
- 整体：倾斜的长圆筒（侧视为长矩形，两端为椭圆截面）
- 倾角：约 3-5° 向出料端下倾（`transform="rotate(-4)"`）
- 支撑：底部两个圆形支撑轮（两个 `<circle>`）
- 进料端：高端（左），漏斗形加料口
- 出料端：低端（右），收料罩
- 颜色：`industrialEquipment.roastingFurnace`（深砖红），`materials.metal`
- 运行动画：筒身绕中轴缓慢旋转（CSS `animation: spin 6s linear infinite`）

```tsx
// RotaryKilnEquipment 结构参考
// <g transform={`rotate(-4, ${cx}, ${cy})`}>
//   <rect x={cx-length/2} y={cy-r} width={length} height={r*2} /> // 筒身
//   <ellipse cx={cx-length/2} cy={cy} rx={r*0.4} ry={r} />         // 左截面
//   <ellipse cx={cx+length/2} cy={cy} rx={r*0.4} ry={r} />         // 右截面
// </g>
// 支撑轮：<circle cx={cx-length/4} cy={cy+r+10} r={15} />
//         <circle cx={cx+length/4} cy={cy+r+10} r={15} />
```

**浸出槽 / 反应釜（Leaching Reactor）**
- 主体：大矩形槽，`industrialEquipment.leachingReactor`（工业灰），有圆角
- 搅拌器：中央竖轴线 + 横叶片，运行时旋转动画
- 进液口：顶部左侧，`industrialPipeline.liquidPipe`（蓝色管道）
- 出液口：底部右侧
- 液位线：可选，用 `CANVAS_COLORS.reference` 虚线表示

**吸收塔 / 洗涤塔（Absorption Tower）**
- 主体：高竖矩形（高:宽 ≈ 2.5:1），`industrialEquipment.absorptionTower`（水洗蓝）
- 进气口：底部居中或左下角，箭头向上
- 出气口：顶部居中，箭头向上
- 进液口：顶部喷淋，`liquidPipe`
- 出液口：底部，`liquidPipe`
- 内部填料（可选）：蜂格纹，`withAlpha(CANVAS_COLORS.grid, 0.3)`

**板框压滤机（Filter Press）**
- 主体：多块竖向矩形（3-5 块）并排，`industrialEquipment.filterPress`（深灰）
- 间隔：块间留 2-3px 细缝（白色）
- 进料管：左侧水平管道
- 滤液出口：底部多个小管道

### 3C：管道与流向绘制

```tsx
// 管道折线（L形 / Z形）
<path
  d={`M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`}
  fill="none"
  stroke={SCENE_COLORS.industrialPipeline.liquidPipe}
  strokeWidth={STROKE.objectLine}
/>

// 管道标注
<text
  fontSize={font(FONT.small)}
  fill={SCENE_COLORS.labels.chemicalFormula}
>
  {'H₂SO₄ 溶液'}
</text>

// 管道颜色语义
// gasPipe   = 黄色  （气体管道）
// liquidPipe= 蓝色  （液体管道）
// slurryPipe= 棕色  （矿浆/悬浮液）
// steamPipe = 红色  （蒸汽管道）
```

---

## Step 4：Token 统一来源与颜色选用规则

所有 Token（颜色、线宽、圆角、阴影、动效缓动）必须 100% 从统一入口 `'@/theme'` 导入，绝对禁止子路径（如 `@/theme/chemistry`）混用，绝对禁止组件内硬编码！

### 颜色 Token 职责三分表（严禁混用）

| 场景需求 | 对应 Token 导出 | Token 来源文件 | 正确使用示例 | 严禁误用 |
|---------|---------------|--------------|------------|---------|
| **实验器材外观** | `SCENE_COLORS.*` | `sceneColors.ts` | `SCENE_COLORS.container.beaker` / `materials.glass` | 用 `colors.primary` 或 `CHART_COLORS.primary` |
| **数据图表配色** | `CHART_COLORS.*`<br>`PH_CHART_COLORS`<br>`RATE_CHART_COLORS` | `chartColors.ts` | `PH_CHART_COLORS.phCurve` / `RATE_CHART_COLORS.rateForward` | 用 `SCENE_COLORS.container.beaker` 代表图表线 |
| **UI 控件与面板** | `colors.*` | `colors.ts` | `colors.primary` / `colors.neutral[100]` | 在 SVG 器材内部用 `colors.primary` |
| **化学物理量** | `CHEMISTRY_COLORS.*` | `chemistry/colors.ts` | `CHEMISTRY_COLORS.concentration` (矢量箭号) | 作为器材材质填充色 |

```ts
// ✅ 器材组件内只允许从统一入口 `@/theme` 导入所有 Token
import {
  SCENE_COLORS,
  withAlpha,
  CANVAS_COLORS,
  STROKE,
  FONT,
  radius,
  shadow,
  duration,
  easing,
} from '@/theme'
import type { FontScaler } from '@/theme'

// 材质色与器材结构色
fill={SCENE_COLORS.materials.glass}
stroke={SCENE_COLORS.materials.glassBorder}
fill={SCENE_COLORS.materials.metal}
fill={SCENE_COLORS.container.beaker}
stroke={SCENE_COLORS.container.beakerBorder}

// 工业设备色与管道色
fill={SCENE_COLORS.industrialEquipment.roastingFurnace}
stroke={SCENE_COLORS.industrialPipeline.gasPipe}

// 试剂/液体内容物与加热效果
fill={SCENE_COLORS.reagent.solution}
fill={SCENE_COLORS.heatingAndSupport.flame}

// 半透明（玻璃/液体）
fill={withAlpha(SCENE_COLORS.container.beaker, 0.8)}

// ❌ 禁止
fill="#E0F2FE"                          // 硬编码 hex 颜色
fill={colors.neutral[100]}              // UI 语义色用于 Canvas 器材
fill={CHART_COLORS.primary}             // 图表色用于 Canvas 器材
import { ... } from '@/theme/chemistry' // 禁止任何子路径导入
```

---

## Step 5：SVG 绘制与多尺寸自适应规范

### 5A：坐标系与几何定位

```tsx
// 统一：左上角 (0,0) 局部坐标，外部 translate 定位
<g transform={`translate(${x}, ${y})`}>
  {/* 内部所有坐标相对于左上角，严禁在内部再写死的 translate 固定像素 */}
</g>
```

### 5B：多尺寸自适应设计（极小微缩 vs 独立大图）

器材组件可能会在独立动画中作为主体展示（例如 `width=300, height=450`），也可能在复杂工业流程图中作为微型节点展示（例如 `width=30, height=45`）。组件必须能够完美适应不同尺寸：

1. **相对比例绘制**：内部所有子元素坐标与宽高必须基于 `width` 和 `height` 相对计算（例如 `x={width * 0.1}`, `height={height * 0.6}`），禁止硬编码内部子元素 `px`。
2. **极小尺寸线宽/圆角保底**：关键线条和壁厚使用 `Math.max(minVal, width * ratio)` 进行保底（例如 `wallT = Math.max(2, width * 0.04)`），防止在微缩时线条太细消失。
3. **次要细节按需简化**：定义 `const isTiny = width < 40`。在微缩模式下自动隐藏精细刻度线、内部繁复线条或气泡细节，仅保留主体轮廓和液面，保证流程图清晰可读。

### 5C：线宽

```tsx
import { STROKE } from '@/theme'
strokeWidth={STROKE.objectLine}   // 2    — 器材外轮廓
strokeWidth={STROKE.objectThin}   // 1.5  — 薄壁玻璃
strokeWidth={STROKE.reference}    // 1    — 内部结构线/刻度
```

### 5D：字号（必须 font() 包裹）

```tsx
import { FONT } from '@/theme'
import type { FontScaler } from '@/theme'

// font 作为 prop 传入（默认 identityFontScaler）
font?: FontScaler

// 使用
<text fontSize={font(FONT.label)}       />   // 标签 14px
<text fontSize={font(FONT.small)}       />   // 次要 11px
<text fontSize={font(FONT.axis)}        />   // 刻度 13px
<text fontSize={font(FONT.annotation)}  />   // 注释 12px

// ❌ 禁止
<text fontSize={14} />
<text fontSize={FONT.label} />   // 未经 font() 包裹
```

### 5E：圆角建议

```tsx
import { radius } from '@/theme'
rx={radius.xs}   // 玻璃器皿（轻微圆角，2px）
rx={radius.sm}   // 工业设备金属体（中等圆角，4px）
rx={Math.max(1, width * 0.03)} // 随尺寸自适应圆角
rx={0}           // 完全直角（铁架台、框架）
```

---

## Step 6：动画规范

```tsx
// ✅ CSS animation（不使用裸 requestAnimationFrame）
// 回转窑/搅拌器旋转
<g style={{
  transformOrigin: `${cx}px ${cy}px`,
  animation: isRunning ? 'spin 4s linear infinite' : 'none'
}}>
  ...
</g>

// ✅ 液面高度变化：prop 驱动 + CSS transition
<rect
  x={wallT} y={height * (1 - fillLevel)}
  width={w - wallT * 2} height={height * fillLevel}
  style={{ transition: 'y 0.3s ease, height 0.3s ease' }}
/>

// ❌ 禁止在组件内直接调用 requestAnimationFrame
// ❌ 禁止在组件内 import useAnimationStore（无副作用原则）
```

---

## Step 7：barrel 注册（新建公共组件必须完成）

```ts
// src/components/Chemistry/index.ts 追加：

// 实验器材（按器材类型分组注释）
export { BeakerApparatus } from './BeakerApparatus'
export type { BeakerApparatusProps } from './BeakerApparatus'

// 工业化工设备
export { RoastingFurnaceEquipment } from './RoastingFurnaceEquipment'
export type { RoastingFurnaceEquipmentProps } from './RoastingFurnaceEquipment'
export { CrusherEquipment } from './CrusherEquipment'
export type { CrusherEquipmentProps } from './CrusherEquipment'
export { RotaryKilnEquipment } from './RotaryKilnEquipment'
export type { RotaryKilnEquipmentProps } from './RotaryKilnEquipment'
```

---

## Step 8：JSDoc 规范（必须含以下字段）

```tsx
/**
 * RoastingFurnaceEquipment — 焙烧炉（高考化工流程）
 *
 * 适用高考化工场景：
 * - 硫铁矿焙烧制 SO₂（FeS₂ + O₂ → Fe₂O₃ + SO₂）
 * - 铝矾土焙烧脱水
 * - 石灰石分解（CaCO₃ → CaO + CO₂）
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.roastingFurnace`（砖红色）
 * 坐标：设计坐标，左上角 (x, y) 定位，禁止传入像素坐标
 * 动画：status='heating' 时炉膛显示火焰效果
 *
 * @param x - 左上角 x（设计坐标）
 * @param y - 左上角 y（设计坐标）
 * @param width - 宽度（设计单位，默认 120）
 * @param height - 高度（设计单位，默认 160）
 * @param status - 运行状态（'idle' | 'running' | 'heating'）
 * @param font - 字体缩放函数（由 canvasSize.font 传入）
 *
 * @example
 * ```tsx
 * <RoastingFurnaceEquipment
 *   x={200} y={100}
 *   width={120} height={160}
 *   status="heating"
 *   font={font}
 * />
 * ```
 */
```

---

## 执行 Checklist

- [ ] **查现有组件**：`@/components/Chemistry` 中无相似组件，或现有组件不满足需求
- [ ] **命名**：实验器材 `XxxApparatus`；工业设备 `XxxEquipment`；场景 `XxxScene`
- [ ] **坐标系**：左上角 `(0,0)` 局部坐标 + 外部 `translate(x,y)` 定位，禁止内部写死绝对定位
- [ ] **Token 唯一来源**：颜色/线宽/圆角/阴影/动效一律从 `@/theme` 统一导入，禁止子路径混用，禁止 hex/硬编码
- [ ] **多尺寸自适应**：内部几何图形基于 `width`/`height` 相对比例绘制；极小尺寸有 `Math.max` 保底，微缩模式（如 `w < 40`）自动隐藏精细刻度
- [ ] **线宽**：`STROKE.objectLine`（轮廓）/ `STROKE.objectThin`（薄壁）/ `STROKE.reference`（内部）
- [ ] **字号**：所有 `fontSize` 经 `font(FONT.xxx)` 包裹，`font` 作为 prop 传入
- [ ] **Props**：必须有 `x / y / width / height / font`；器材有 `fillLevel / fillColor`；工业设备有 `status`
- [ ] **JSDoc**：含适用场景 + 颜色说明 + 坐标说明 + `@example`
    - [ ] **barrel 注册**：`src/components/Chemistry/index.ts` 已追加导出组件与 `XxxProps`
- [ ] **无副作用**：不得访问 Store / 不得有 useEffect / 不得调用 requestAnimationFrame
- [ ] **无 CHEMISTRY_COLORS**：器材组件不使用化学量颜色，只用 `SCENE_COLORS`
