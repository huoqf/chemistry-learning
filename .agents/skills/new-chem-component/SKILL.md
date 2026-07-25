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

现有组件（`@/components/Chemistry` barrel 导出，完整列表见 AGENTS.md 铁律 4）：

| 分类 | 已有组件（节选） |
|------|---------|
| **矢量/粒子** | ChemistryVectorArrow, VectorArrow, ParticleEmitter, BubbleEmitter, IonMigration |
| **高中实验器材** | BeakerApparatus, ErlenmeyerFlaskApparatus, BuretteApparatus, VolumetricFlaskApparatus, TestTubeApparatus, GasJarApparatus, AlcoholLampApparatus, SeparatoryFunnelApparatus, EvaporatingDishApparatus, KippApparatus |
| **支撑连接** | IronSupportApparatus, TripodMeshApparatus, ClayTriangleApparatus, WaterBathApparatus, GlassTubingConnectionApparatus |
| **干燥冷凝** | DryingTubeApparatus, CondenserApparatus, BuchnerFunnelApparatus |
| **电化学仪表** | ElectrochemCellApparatus, SaltBridgeApparatus, IonMembraneApparatus, PhMeterApparatus, ThermometerApparatus, BalanceApparatus, FlowMeterApparatus |
| **化工流程设备** | CrusherEquipment, RoastingFurnaceEquipment, RotaryKilnEquipment, LeachingReactorEquipment, AbsorptionTowerEquipment, IndustrialElectrolyzerEquipment, CrystallizerEquipment, IonExchangeColumnEquipment |

**规则**：先确认无现成组件或无法满足需求，方可新建。

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
├── XxxApparatus.tsx        ← 实验器材（高中实验）
├── XxxEquipment.tsx        ← 工业设备（高考化工流程）
└── index.ts                ← barrel 导出（新组件必须在此注册）
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
// 颜色 Token 见 AGENTS.md 铁律 4B（器材用 SCENE_COLORS，禁用 CHEMISTRY_COLORS/CHART_COLORS）
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
 * 极小尺寸自适应：当 width < 40 时自动隐去刻度等微小细节。
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
import { SCENE_COLORS, STROKE, FONT } from '@/theme'
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
- 进料口：顶部或左侧矩形开口；出料口：底部或右侧矩形开口
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
- 进料端：高端（左），漏斗形加料口；出料端：低端（右），收料罩
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
- 进液口：顶部左侧，`industrialPipeline.liquidPipe`（蓝色管道）；出液口：底部右侧

**吸收塔 / 洗涤塔（Absorption Tower）**
- 主体：高竖矩形（高:宽 ≈ 2.5:1），`industrialEquipment.absorptionTower`（水洗蓝）
- 进气口：底部居中或左下角，箭头向上；出气口：顶部居中，箭头向上
- 内部填料（可选）：蜂格纹，`withAlpha(CANVAS_COLORS.grid, 0.3)`

### 3C：管道与流向绘制

```tsx
// 管道折线（L形 / Z形）
<path
  d={`M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`}
  fill="none"
  stroke={SCENE_COLORS.industrialPipeline.liquidPipe}
  strokeWidth={STROKE.objectLine}
/>
// 管道颜色语义（SCENE_COLORS.industrialPipeline.*）：
// gasPipe=黄色（气体），liquidPipe=蓝色（液体），slurryPipe=棕色（矿浆），steamPipe=红色（蒸汽）
```

---

## Step 4：SVG 绘制与多尺寸自适应规范

### 4A：坐标系

```tsx
// 统一：左上角 (0,0) 局部坐标，外部 translate 定位
<g transform={`translate(${x}, ${y})`}>
  {/* 内部所有坐标相对于左上角，严禁在内部再写死的 translate 固定像素 */}
</g>
```

### 4B：多尺寸自适应设计

器材可能在独立动画（width=300）或流程图（width=30）中使用，必须完美适应：

1. **相对比例绘制**：内部子元素基于 `width`/`height` 相对计算，禁止硬编码内部 `px`
2. **极小尺寸保底**：关键线条使用 `Math.max(minVal, width * ratio)` 防止微缩消失
3. **次要细节简化**：定义 `const isTiny = width < 40`，微缩时自动隐藏精细刻度

### 4C：线宽（来自 `@/theme`）

```tsx
strokeWidth={STROKE.objectLine}   // 2    — 器材外轮廓
strokeWidth={STROKE.objectThin}   // 1.5  — 薄壁玻璃
strokeWidth={STROKE.reference}    // 1    — 内部结构线/刻度
```

---

## Step 5：动画规范

```tsx
// ✅ CSS animation（不使用裸 requestAnimationFrame，见 AGENTS.md 铁律 1）
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
```

---

## Step 6：barrel 注册（新建公共组件必须完成）

```ts
// src/components/Chemistry/index.ts 追加：
export { XxxApparatus } from './XxxApparatus'
export type { XxxApparatusProps } from './XxxApparatus'

export { XxxEquipment } from './XxxEquipment'
export type { XxxEquipmentProps } from './XxxEquipment'
```

---

## Step 7：JSDoc 规范（必须含以下字段）

```tsx
/**
 * RoastingFurnaceEquipment — 焙烧炉（高考化工流程）
 *
 * 适用高考化工场景：
 * - 硫铁矿焙烧制 SO₂（FeS₂ + O₂ → Fe₂O₃ + SO₂）
 * - 铝矾土焙烧脱水
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.roastingFurnace`（砖红色）
 * 坐标：设计坐标，左上角 (x, y) 定位
 * 动画：status='heating' 时炉膛显示火焰效果
 *
 * @param x - 左上角 x（设计坐标）
 * @param y - 左上角 y（设计坐标）
 * @param width - 宽度（设计单位，默认 120）
 * @param height - 高度（设计单位，默认 160）
 * @param status - 运行状态（'idle' | 'running' | 'heating'）
 * @param font - 字体缩放函数（由 canvasSize.font 传入）
 */
```

---

## 执行 Checklist

- [ ] **查现有组件**：`@/components/Chemistry` 中无相似组件（见 AGENTS.md 铁律 4）
- [ ] **命名**：实验器材 `XxxApparatus`；工业设备 `XxxEquipment`；场景 `XxxScene`
- [ ] **坐标系**：左上角 `(0,0)` 局部坐标 + 外部 `translate(x,y)` 定位
- [ ] **颜色**：器材只用 `SCENE_COLORS`，禁用 `CHEMISTRY_COLORS`/`CHART_COLORS`（见 AGENTS.md 铁律 4B）
- [ ] **多尺寸自适应**：内部几何基于 `width`/`height` 相对比例；`Math.max` 保底；微缩模式自动简化
- [ ] **线宽**：`STROKE.objectLine`（轮廓）/ `STROKE.objectThin`（薄壁）/ `STROKE.reference`（内部）
- [ ] **字号**：所有 `fontSize` 经 `font(FONT.xxx)` 包裹（见 AGENTS.md 铁律 7）
- [ ] **Props**：必须有 `x / y / width / height / font`；器材有 `fillLevel / fillColor`；工业设备有 `status`
- [ ] **JSDoc**：含适用场景 + 颜色说明 + 坐标说明 + `@example`
- [ ] **barrel 注册**：`src/components/Chemistry/index.ts` 已追加导出
- [ ] **无副作用**：不得访问 Store / 不得有 useEffect / 不得调用 requestAnimationFrame
