import { SCENE_COLORS, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface IronSupportApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 100） */
  width?: number
  /** 器材高度（设计单位，默认 240） */
  height?: number
  /** 是否带有铁夹 */
  hasClamp?: boolean
  /** 铁夹高度比例 0~1 (0 在顶部，1 在底部) */
  clampPos?: number
  /** 是否带有铁圈 */
  hasRing?: boolean
  /** 铁圈高度比例 0~1 */
  ringPos?: number
  /** 铁圈半径 */
  ringRadius?: number
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * IronSupportApparatus — 铁架台组件
 *
 * 适用高中化学场景：
 * - 支撑烧杯加热（铁圈+石棉网）、固定试管/滴定管（铁夹）
 *
 * 颜色：`SCENE_COLORS.heatingAndSupport.ironSupport`
 *
 * @example
 * ```tsx
 * <IronSupportApparatus
 *   x={50} y={50} width={100} height={240}
 *   hasClamp={true} clampPos={0.4} hasRing={true} ringPos={0.7}
 *   font={font}
 * />
 * ```
 */
export function IronSupportApparatus({
  x,
  y,
  width = 100,
  height = 240,
  hasClamp = true,
  clampPos = 0.35,
  hasRing = false,
  ringPos = 0.65,
  ringRadius = 35,
}: IronSupportApparatusProps) {
  const w = width
  const h = height

  const baseH = 14
  const baseW = w * 0.9
  const baseLeft = (w - baseW) / 2

  const poleW = 6
  const poleLeft = baseLeft + baseW * 0.2

  const clampY = 10 + (h - baseH - 20) * clampPos
  const ringY = 10 + (h - baseH - 20) * ringPos

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 铁架台底座 */}
      <rect
        x={baseLeft}
        y={h - baseH}
        width={baseW}
        height={baseH}
        rx={2}
        fill={SCENE_COLORS.heatingAndSupport.ironSupport}
        stroke={SCENE_COLORS.materials.iron}
        strokeWidth={STROKE.objectLine}
      />

      {/* 竖立铁杆 */}
      <rect
        x={poleLeft}
        y={4}
        width={poleW}
        height={h - baseH - 4}
        rx={1}
        fill={SCENE_COLORS.heatingAndSupport.ironSupport}
        stroke={SCENE_COLORS.materials.iron}
        strokeWidth={STROKE.reference}
      />

      {/* 铁夹 (Clamp) */}
      {hasClamp && (
        <g transform={`translate(${poleLeft + poleW / 2}, ${clampY})`}>
          {/* 紧固螺丝 */}
          <rect
            x={-6}
            y={-6}
            width={12}
            height={12}
            rx={2}
            fill={SCENE_COLORS.heatingAndSupport.ironRing}
          />
          {/* 延伸横杆 */}
          <line
            x1={0}
            y1={0}
            x2={w * 0.45}
            y2={0}
            stroke={SCENE_COLORS.heatingAndSupport.ironRing}
            strokeWidth={STROKE.objectLine}
          />
          {/* 夹爪 */}
          <path
            d={`
              M ${w * 0.45} -10
              C ${w * 0.55} -10, ${w * 0.55} 10, ${w * 0.45} 10
            `}
            fill="none"
            stroke={SCENE_COLORS.heatingAndSupport.ironRing}
            strokeWidth={STROKE.objectLine}
          />
        </g>
      )}

      {/* 铁圈 (Ring) */}
      {hasRing && (
        <g transform={`translate(${poleLeft + poleW / 2}, ${ringY})`}>
          {/* 紧固螺丝 */}
          <rect
            x={-5}
            y={-5}
            width={10}
            height={10}
            rx={2}
            fill={SCENE_COLORS.heatingAndSupport.ironRing}
          />
          {/* 横杆 */}
          <line
            x1={0}
            y1={0}
            x2={w * 0.3}
            y2={0}
            stroke={SCENE_COLORS.heatingAndSupport.ironRing}
            strokeWidth={STROKE.objectLine}
          />
          {/* 铁圈环 */}
          <ellipse
            cx={w * 0.3 + ringRadius * 0.6}
            cy={0}
            rx={ringRadius * 0.6}
            ry={ringRadius * 0.25}
            fill="none"
            stroke={SCENE_COLORS.heatingAndSupport.ironRing}
            strokeWidth={STROKE.objectLine}
          />
        </g>
      )}
    </g>
  )
}
