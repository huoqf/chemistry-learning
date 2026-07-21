import { useMemo } from 'react'
import { BaseChart } from './BaseChart'
import { RelationChartContent } from './RelationChartContent'
import type { ChartSeriesVariant, ChartReferenceVariant } from '@/theme'

/**
 * 通用关系图 (Y = f(X))。
 *
 * 与 *-TimeChart 系列的区别：
 * - 时间图：`points` 随 currentTime 动态增长 → 需要 `domainPoints` 解耦绘制 vs 定标
 * - 关系图：`points` 一开始就是整段静态曲线 → 直接用 `points` 定标即稳定，无需 domainPoints
 *
 * 典型用途：F-r、E-r、Ep-r、1/u-1/v、v-r、T-r、F-V 等任意 Y=f(X) 函数图像
 *
 * 设计要点：
 * - `cursorX`：当前 X 值，自动在 points 中线性插值出 y 并画十字标 + 圆点
 * - `markers`：特殊点 / 参考线（y 省略时画整条 vertical 虚线）
 * - `additionalSeries`：多曲线（同坐标系），与 VelocityTimeChart 的 API 完全对齐
 * - `showZeroLine`：当 Y 可正可负时显示零基准虚线
 *
 * ⚠️ **使用前提（重要）**：
 * `RelationChart` 假设 `points` 表示**整条完整曲线**，与坐标轴定标用的是同一份数据。
 * 这适用于：物理函数图像（一次性算出整段曲线静态展示）、对比图等场景。
 *
 * **不适用于「随时间逐步揭示」场景**。如果调用方按某个进度变量截断 `points`，
 * 自动 `yDomain` 会随之扩张，重现 `VelocityTimeChart` 早期那种「曲线被时间拉斜」
 * 的视觉错觉（见 commit bbd1108）。
 *
 * 此类需求的两种解法：
 *   1. 推荐：调用方传完整 `points`，自己控制可见部分（如用 SVG `<clipPath>` 或
 *      过滤渲染），坐标轴定标与可见性解耦。
 *   2. 后续如需求强烈，可仿照 *-TimeChart 加 `domainPoints` 字段，
 *      让定标使用完整轨迹、绘制使用截断轨迹。
 */

export interface RelationDataSeries {
  /** 数据点序列（物理坐标） */
  points: { x: number; y: number }[]
  /** 系列标签（图例显示） */
  label?: string
  /** 曲线颜色变体 */
  series?: ChartSeriesVariant
  /** 自定义颜色（覆盖 series 映射） */
  color?: string
  /** 线宽，默认 2 */
  strokeWidth?: number
  /** 虚线模式，例如 [4, 4] */
  strokeDasharray?: number[]
}

export interface RelationMarker {
  /**
   * 标记类型：
   * - `'vertical'`（默认）：以 `x` 定位的垂直参考线 / 单点
   * - `'horizontal'`：以 `y` 定位的水平参考线 / 单点
   * - `'point'`：必须同时给 `x` 和 `y`，画一个标记点（不画十字线）
   *
   * 等价规则：当 axis 未给出时，按 `x` / `y` 是否齐全自动推断：
   * - 只给 `x` → `vertical`
   * - 只给 `y` → `horizontal`
   * - 同时给 `x` 和 `y` → `point`
   */
  axis?: 'vertical' | 'horizontal' | 'point'
  /** X 坐标（vertical / point 用） */
  x?: number
  /** Y 坐标（horizontal / point 用） */
  y?: number
  /** 标签文本 */
  label?: string
  /** 颜色，默认 equilibrium 色 */
  color?: string
}

export interface RelationChartProps {
  /** 主曲线数据点（物理坐标） */
  points: { x: number; y: number }[]
  /** 额外曲线（同坐标系叠加） */
  additionalSeries?: RelationDataSeries[]
  /** X 轴范围；不传则基于所有 series 自动计算 */
  xDomain?: [number, number]
  /** Y 轴范围；不传则基于所有 series 自动计算（含 0 基准 + 15% padding） */
  yDomain?: [number, number]
  /** X 轴标签 */
  xLabel: string
  /** Y 轴标签 */
  yLabel: string
  /** 标题 */
  title?: string
  /**
   * 当前 X 值；传入时自动在 points 中线性插值 y、画十字标 + 圆点 +（可选）数值标注。
   * 不传则不画游标。
   */
  cursorX?: number
  /** 游标标签格式化函数；返回 null 则只画圆点不画文本 */
  cursorLabel?: (x: number, y: number) => string | null
  /** 游标线颜色变体 */
  cursorVariant?: ChartReferenceVariant
  /** 是否显示 Y=0 虚线（当 yDomain 跨越 0 时建议开启） */
  showZeroLine?: boolean
  /** 是否显示网格 */
  showGrid?: boolean
  /** 特殊点 / 参考线标记 */
  markers?: RelationMarker[]
  /** 主曲线颜色变体 */
  series?: ChartSeriesVariant
  /** 主曲线自定义颜色（覆盖 series） */
  color?: string
  /** 主曲线线宽，默认 2 */
  strokeWidth?: number
  /** 主曲线的图例标签；若不传，则当 series 为 'primary' 时默认显示 '主' */
  mainLabel?: string
  /** 绘制在曲线下方的插件层（如面积填充） */
  underlay?: React.ReactNode
  /** 绘制在曲线上方的插件层（如微元切割、教学注释） */
  children?: React.ReactNode
  /**
   * 图表容器设计基准尺寸（透传给 BaseChart 的 initialSize）。
   * 当图表嵌入 foreignObject 等小容器时，传入实际容器尺寸可避免 useCanvasSize
   * 用默认 700×400 基准导致 scale 过小、字体被 clamp 到 7px。
   * 不传则用 BaseChart 默认值。
   */
  initialSize?: { width: number; height: number }
  /**
   * 固定尺寸模式：直接指定图表像素宽高，跳过 DOM 测量。
   * 用于嵌入主 SVG（无需 foreignObject）等场景。
   */
  fixedSize?: { width: number; height: number }
  /** 图表变体（standard / mini），透传给 BaseChart */
  variant?: 'standard' | 'mini'
  /** 额外 className */
  className?: string
}

export function RelationChart({
  points,
  additionalSeries,
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  title,
  cursorX,
  cursorLabel = (_x, y) => y.toFixed(2),
  cursorVariant = 'highlight',
  showZeroLine,
  showGrid = true,
  markers,
  series = 'primary',
  color,
  strokeWidth,
  mainLabel,
  underlay,
  children,
  initialSize,
  fixedSize,
  variant,
  className = '',
}: RelationChartProps) {
  const computedXDomain = useMemo((): [number, number] => {
    if (xDomain) return xDomain
    const xs: number[] = points.map((p) => p.x)
    additionalSeries?.forEach((s) => s.points.forEach((p) => xs.push(p.x)))
    if (xs.length === 0) return [0, 1]
    const lo = Math.min(...xs)
    const hi = Math.max(...xs)
    const pad = (hi - lo) * 0.02 || 0.5
    return [lo - pad, hi + pad]
  }, [points, additionalSeries, xDomain])

  const computedYDomain = useMemo((): [number, number] => {
    if (yDomain) return yDomain
    const ys: number[] = points.map((p) => p.y)
    additionalSeries?.forEach((s) => s.points.forEach((p) => ys.push(p.y)))
    if (ys.length === 0) return [-1, 1]
    const lo = Math.min(0, ...ys)
    const hi = Math.max(0, ...ys)
    const pad = (hi - lo) * 0.15 || 1
    return [lo - pad, hi + pad]
  }, [points, additionalSeries, yDomain])

  // 自动判断是否需要零线：Y 跨越 0 时默认开启
  const effectiveZeroLine = showZeroLine ?? (computedYDomain[0] < 0 && computedYDomain[1] > 0)

  return (
    <BaseChart
      xDomain={computedXDomain}
      yDomain={computedYDomain}
      xLabel={xLabel}
      yLabel={yLabel}
      title={title}
      variant={variant}
      fixedSize={fixedSize}
      yBaseline={effectiveZeroLine ? 0 : undefined}
      showGrid={showGrid}
      initialSize={initialSize}
      className={className}
    >
      <RelationChartContent
        points={points}
        additionalSeries={additionalSeries}
        cursorX={cursorX}
        cursorLabel={cursorLabel}
        cursorVariant={cursorVariant}
        markers={markers}
        series={series}
        color={color}
        strokeWidth={strokeWidth}
        mainLabel={mainLabel}
        underlay={underlay}
      >
        {children}
      </RelationChartContent>
    </BaseChart>
  )
}
