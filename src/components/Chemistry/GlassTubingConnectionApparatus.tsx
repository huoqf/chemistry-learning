import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface GlassTubingConnectionApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 导管终点 x（相对坐标或绝对设计坐标，默认 100） */
  endX?: number
  /** 导管终点 y（相对坐标，默认 0） */
  endY?: number
  /** 中间拐点高度 offset (L型/Z型导管) */
  midY?: number
  /** 导管类型：'straight' 直管 | 'L-shape' L型管 | 'Z-shape' Z型管 */
  tubeType?: 'straight' | 'L-shape' | 'Z-shape'
  /** 气体名称/说明 */
  label?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * GlassTubingConnectionApparatus — 玻璃导管与连接组件
 *
 * 适用高中化学场景：
 * - 连接发生装置、洗气瓶、集气瓶间的气体导管
 *
 * 颜色：`SCENE_COLORS.tube.glass`
 *
 * @example
 * ```tsx
 * <GlassTubingConnectionApparatus x={100} y={100} endX={180} endY={60} tubeType="L-shape" font={font} />
 * ```
 */
export function GlassTubingConnectionApparatus({
  x,
  y,
  endX = 100,
  endY = 0,
  midY = 30,
  tubeType = 'L-shape',
  label,
  font = (n) => n,
}: GlassTubingConnectionApparatusProps) {
  const getPathD = () => {
    if (tubeType === 'straight') {
      return `M 0 0 L ${endX} ${endY}`
    } else if (tubeType === 'L-shape') {
      return `M 0 0 L 0 ${midY} L ${endX} ${midY} L ${endX} ${endY}`
    } else {
      return `M 0 0 L ${endX * 0.5} 0 L ${endX * 0.5} ${endY} L ${endX} ${endY}`
    }
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 玻璃导管 */}
      <path
        d={getPathD()}
        fill="none"
        stroke={SCENE_COLORS.tube.glass}
        strokeWidth={STROKE.objectLine}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 气体标识 */}
      {label && (
        <text
          x={endX * 0.5}
          y={midY - 6}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  )
}
