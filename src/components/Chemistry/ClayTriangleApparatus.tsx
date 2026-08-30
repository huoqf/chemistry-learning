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
    <g transform={`translate(${x}, ${y})`} id="clay-triangle">
      {/* 1. 穿出外部的支撑铁丝 (向下延伸架于三脚架铁圈上) */}
      <line x1={0} y1={0} x2={leftX} y2={topY} stroke={SCENE_COLORS.materials.iron} strokeWidth={STROKE.objectLine} strokeLinecap="round" />
      <line x1={w} y1={0} x2={rightX} y2={topY} stroke={SCENE_COLORS.materials.iron} strokeWidth={STROKE.objectLine} strokeLinecap="round" />
      <line x1={cx} y1={h} x2={cx} y2={botY} stroke={SCENE_COLORS.materials.iron} strokeWidth={STROKE.objectLine} strokeLinecap="round" />

      {/* 2. 内部贯穿铁丝芯 (微露于管口) */}
      <line x1={leftX} y1={topY} x2={rightX} y2={topY} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />
      <line x1={rightX} y1={topY} x2={cx} y2={botY} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />
      <line x1={cx} y1={botY} x2={leftX} y2={topY} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />

      {/* 3. 三根耐火瓷管 (厚壁瓷管带微高光，上边、右斜边、左斜边) */}
      {/* 顶横管 */}
      <line
        x1={leftX + 4} y1={topY} x2={rightX - 4} y2={topY}
        stroke={SCENE_COLORS.separationAndPurification.clayTriangle}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <line
        x1={leftX + 6} y1={topY - 1} x2={rightX - 6} y2={topY - 1}
        stroke={SCENE_COLORS.materials.glassHighlight}
        strokeWidth={1.2}
        opacity={0.7}
      />

      {/* 右斜管 */}
      <line
        x1={rightX - 2} y1={topY + 3} x2={cx + 3} y2={botY - 3}
        stroke={SCENE_COLORS.separationAndPurification.clayTriangle}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <line
        x1={rightX - 4} y1={topY + 2} x2={cx + 1} y2={botY - 4}
        stroke={SCENE_COLORS.materials.glassHighlight}
        strokeWidth={1.2}
        opacity={0.7}
      />

      {/* 左斜管 */}
      <line
        x1={cx - 3} y1={botY - 3} x2={leftX + 2} y2={topY + 3}
        stroke={SCENE_COLORS.separationAndPurification.clayTriangle}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <line
        x1={cx - 1} y1={botY - 4} x2={leftX + 4} y2={topY + 2}
        stroke={SCENE_COLORS.materials.glassHighlight}
        strokeWidth={1.2}
        opacity={0.7}
      />

      {/* 4. 三个顶角铁丝交错扭结 (Wire Knots) */}
      <circle cx={leftX} cy={topY} r={2.5} fill={SCENE_COLORS.materials.iron} />
      <circle cx={rightX} cy={topY} r={2.5} fill={SCENE_COLORS.materials.iron} />
      <circle cx={cx} cy={botY} r={2.5} fill={SCENE_COLORS.materials.iron} />
    </g>
  )
}
