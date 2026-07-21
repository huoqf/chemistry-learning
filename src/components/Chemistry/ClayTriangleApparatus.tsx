import { SCENE_COLORS, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface ClayTriangleApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 80） */
  width?: number
  /** 器材高度（设计单位，默认 70） */
  height?: number
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * ClayTriangleApparatus — 泥三角组件
 *
 * 适用高中化学场景：
 * - 高温灼烧坩埚（如石灰石分解、海带灰化）时的支撑
 *
 * 颜色：`SCENE_COLORS.separationAndPurification.clayTriangle`
 *
 * @example
 * ```tsx
 * <ClayTriangleApparatus x={100} y={150} width={80} height={70} font={font} />
 * ```
 */
export function ClayTriangleApparatus({
  x,
  y,
  width = 80,
  height = 70,
}: ClayTriangleApparatusProps) {
  const w = width
  const h = height

  const cx = w * 0.5
  const topY = 10
  const botY = h - 10
  const leftX = 10
  const rightX = w - 10

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 延伸铁丝 */}
      <line x1={0} y1={0} x2={leftX} y2={topY} stroke={SCENE_COLORS.materials.iron} strokeWidth={STROKE.objectLine} />
      <line x1={w} y1={0} x2={rightX} y2={topY} stroke={SCENE_COLORS.materials.iron} strokeWidth={STROKE.objectLine} />
      <line x1={cx} y1={h} x2={cx} y2={botY} stroke={SCENE_COLORS.materials.iron} strokeWidth={STROKE.objectLine} />

      {/* 瓷质管（三边） */}
      <line
        x1={leftX} y1={topY} x2={rightX} y2={topY}
        stroke={SCENE_COLORS.separationAndPurification.clayTriangle}
        strokeWidth={STROKE.objectLine * 2.5}
        strokeLinecap="round"
      />
      <line
        x1={rightX} y1={topY} x2={cx} y2={botY}
        stroke={SCENE_COLORS.separationAndPurification.clayTriangle}
        strokeWidth={STROKE.objectLine * 2.5}
        strokeLinecap="round"
      />
      <line
        x1={cx} y1={botY} x2={leftX} y2={topY}
        stroke={SCENE_COLORS.separationAndPurification.clayTriangle}
        strokeWidth={STROKE.objectLine * 2.5}
        strokeLinecap="round"
      />
    </g>
  )
}
