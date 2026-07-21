# Canvas/SVG/图表动态布局与渲染规范

> 优先级：低于 02_UI_RULES.md
> 最后更新：2026-07-19

---

## 1. SVG vs Canvas 选择标准

| 场景 | 推荐技术 | 原因 |
|------|----------|------|
| 静态分子结构图、化学键图解 | SVG | 标注清晰、可交互、易维护 |
| 低频交互图解 | SVG | DOM 可访问性好 |
| 高频粒子、实时反应模拟 | Canvas | 性能更稳定 |
| 同屏大量分子或复杂场景 | PixiJS | 后期扩展 |
| 数据图表 | SVG 或 Canvas | 取决于数据量和交互复杂度 |

**SVG 规范补充**：SVG 中的颜色、线宽、箭头、文字样式必须引用 @/theme 和 canvasStyle.ts。

---

## 2. 主屏页面布局规范（铁律）

### 2.1 禁止硬编码像素布局

主屏动画页面的 SVG 布局**禁止**使用硬编码像素值。

### 2.2 新页面唯一标准路径：useAnimationViewport + AnimationSvgCanvas

> **铁律**：所有新建动画组件必须使用此路径，无例外。

#### 核心工具

| 工具 | 路径 | 职责 |
|------|------|------|
| useAnimationViewport | src/hooks/useAnimationViewport.ts | 复合 Hook |
| AnimationSvgCanvas | src/components/Layout/AnimationSvgCanvas.tsx | 标准 SVG 容器 |

#### 场景 1：SVG 独占中屏（无 overlay）

```tsx
import { useAnimationViewport } from '@/hooks'
import { AnimationSvgCanvas } from '@/components/Layout'
import { CANVAS_PRESETS } from '@/theme'

export default function MyAnimation() {
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  return (
    <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
      <ChemistryScene font={canvasSize.font} />
    </AnimationSvgCanvas>
  )
}
```

#### 场景 2：SVG + HTML overlay 浮层

```tsx
const { containerRef, canvasSize, vp } = useAnimationViewport({
  preset: CANVAS_PRESETS.full,
  overlayRight: Math.round(Math.max(280, canvasSize.width * 0.38)),
})

return (
  <div className="w-full h-full relative">
    <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
      <ChemistryScene font={canvasSize.font} />
    </AnimationSvgCanvas>
    <div className="absolute right-0 top-0 bottom-0 w-[280px]">
      <ChartPanel />
    </div>
  </div>
)
```

#### 场景 3：图表与 SVG 分区并列

```tsx
const { containerRef, canvasSize, vp } = useAnimationViewport({ preset: CANVAS_PRESETS.splitV })

return (
  <div className="w-full h-full flex flex-col">
    <div className="h-[310px] shrink-0">
      <BaseChart ... />
    </div>
    <div className="flex-1 min-h-0">
      <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
        <ChemistryScene font={canvasSize.font} />
      </AnimationSvgCanvas>
    </div>
  </div>
)
```

### 2.3 验收标准

| 检查项 | 标准 |
|--------|------|
| SVG 标签 | 无 viewBox，使用 className="w-full h-full block" |
| viewBox 值 | 严禁在未传 overlay 参数时与 vp.transform 同时使用 |
| 布局坐标 | 使用比例常量计算，禁止散落无语义像素值 |
| 物理比例尺 | 使用 useSceneScale 计算，禁止硬编码 |
| 字体大小 | SVG 内使用 fontSize={font(N)}，禁止裸值 |
| 响应式 | 调整窗口时，布局比例保持不变 |

---

## 3. 动态布局原则

### 3.1 尺寸计算来源（允许的）

| 类型 | 来源 | 示例 |
|------|------|------|
| 语义化比例 | canvasStyle.ts 或 feature 配置 | chartWidthRatio = 0.28 |
| 主题 token | @/theme | lineWidth.primary |
| 容器尺寸测量 | 运行时容器测量 | canvasRef.current.clientWidth |
| 化学坐标范围 | 化学计算值 + 坐标转换 | 缩放比例基于化学范围自动计算 |

---

## 4. 坐标系统分层

| 坐标类型 | 来源 | 用途 |
|----------|------|------|
| 化学坐标 | chemistry/ 计算 | 浓度、速率、pH 等化学量 |
| 设计坐标 | worldToDesign() | SVG 场景渲染 |
| 容器像素 | vp.transform 自动映射 | 最终屏幕显示 |

---

## 5. canvasStyle.ts 职责边界

### 5.1 应该包含

- 线宽 token、箭头样式、标注字体大小、网格样式、图表 inset 比例

### 5.2 不应该包含

- 具体化学计算、专属业务参数、页面布局宽度、DOM 结构

---

## 6. 化学图表规范

### 6.1 图表组件体系

| 组件 | 职责 | 使用场景 |
|------|------|---------|
| BaseChart | 原子层容器 | 所有新图表 |
| ChartCursor | 十字竖线 + 数据点 | 需要游标的图表 |
| ChartArea | 曲线下方面积填充 | 积分语义 |
| ChartTangent | 切线 + 切点 | 速率/斜率展示 |

**铁律**：新增图表必须使用 BaseChart，禁止手写 toSvgX/toSvgY 坐标变换。

### 6.2 常见化学图表类型

| 图表类型 | 化学意义 | 推荐技术 |
|----------|----------|----------|
| c-t 图 | 浓度-时间曲线 | BaseChart |
| v-t 图 | 速率-时间曲线 | BaseChart |
| pH-t 图 | 滴定曲线 | BaseChart |
| E-反应进度图 | 能量图 | BaseChart + ChartArea |

---

## 7. 信息密度与降级策略

| 层级 | 内容 | 降级策略 |
|------|------|----------|
| 必要层 | 物体、主轨迹、坐标轴 | 最后隐藏 |
| 重要层 | 主矢量、核心标注 | 空间不足时先隐藏分量 |
| 辅助层 | 网格、参考线 | 默认可选 |
| 分析层 | 历史轨迹、额外解释 | 默认隐藏 |
