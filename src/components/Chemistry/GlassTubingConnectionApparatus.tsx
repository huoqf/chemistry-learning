import { SCENE_COLORS, FONT, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export interface GlassTubingConnectionApparatusProps {
  /** 器材起点 x（设计坐标） */
  x: number
  /** 器材起点 y（设计坐标） */
  y: number
  /** 导管终点相对 x（默认 100） */
  endX?: number
  /** 导管终点相对 y（默认 0） */
  endY?: number
  /** 中间拐点高度 offset (L型/Z型导管，默认 30) */
  midY?: number
  /** 导管管径宽度（默认 8） */
  tubeWidth?: number
  /** 导管类型：'straight' 直管 | 'L-shape' L型管 | 'Z-shape' Z型管 | 'bridge' 顶桥高程管 | 'low-bridge' 瓶间低空弯管 | 'horizontal-socket' 90°横向插口管 */
  tubeType?: 'straight' | 'L-shape' | 'Z-shape' | 'bridge' | 'low-bridge' | 'horizontal-socket'
  /** 是否在起点/终点增加橡皮塞套接扣 */
  hasStopperJoint?: boolean
  /** 气体名称/说明 */
  label?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * GlassTubingConnectionApparatus — 规范双壁透明玻璃导管与连接组件
 *
 * 特性：
 * - 告别单线粗线条，升级为双壁玻璃管径厚度与透明质感
 * - 支持直线、L型折角、Z型转折与 Bridge 顶桥连线
 * - 导出静态 `getGlassTubingPorts` 锚点
 */
export function GlassTubingConnectionApparatus({
  x,
  y,
  endX = 100,
  endY = 0,
  midY = 30,
  tubeWidth = 8,
  tubeType = 'L-shape',
  hasStopperJoint = false,
  label,
  font = (n) => n,
}: GlassTubingConnectionApparatusProps) {
  const tw = tubeWidth

  // 解析 midY：若传入绝对 Y 坐标 (如 > 100)，转换为相对于 x,y 的 relative Y 偏置
  const relMidY = midY > 100 ? midY - y : midY

  const getPathD = () => {
    if (tubeType === 'straight') {
      return `M 0 0 L ${endX} ${endY}`
    } else if (tubeType === 'L-shape') {
      return `M 0 0 L 0 ${relMidY} L ${endX} ${relMidY} L ${endX} ${endY}`
    } else if (tubeType === 'bridge') {
      // 顶桥路由：起点向上升至 relMidY ➔ 水平平移至 endX ➔ 垂直下降至 endY
      return `M 0 0 L 0 ${relMidY} L ${endX} ${relMidY} L ${endX} ${endY}`
    } else if (tubeType === 'low-bridge') {
      // 瓶间低空拱桥弯管：仅高出瓶塞 25px 拱线连接，极具实验室真实感
      const archY = Math.min(0, endY) - 25
      return `M 0 0 L 0 ${archY} Q 0 ${archY} 10 ${archY} L ${endX - 10} ${archY} Q ${endX} ${archY} ${endX} ${archY + 10} L ${endX} ${endY}`
    } else if (tubeType === 'horizontal-socket') {
      // 90° 横向对头插口管：降落至目标端点同高度后，水平平平推进插入横向管口
      return `M 0 0 L 0 ${relMidY} L ${endX - 8} ${relMidY} L ${endX} ${endY}`
    } else {
      // Z-shape：从起点走向 relMidY 折弯或中间节点
      return `M 0 0 L ${endX * 0.5} 0 L ${endX * 0.5} ${relMidY} L ${endX} ${relMidY} L ${endX} ${endY}`
    }
  }

  const pathD = getPathD()

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 外壁玻璃轮廓线 */}
      <path
        d={pathD}
        fill="none"
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={tw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. 内部透明气体/空腔填充 */}
      <path
        d={pathD}
        fill="none"
        stroke={withAlpha(SCENE_COLORS.materials.glass, 0.85)}
        strokeWidth={Math.max(2, tw - 3)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. 橡皮塞套接卡口 (可选) */}
      {hasStopperJoint && (
        <g>
          <rect
            x={-5}
            y={-6}
            width={10}
            height={12}
            rx={2}
            fill={SCENE_COLORS.stopper.rubberStopper}
            stroke={SCENE_COLORS.stopper.rubberStopperBorder}
            strokeWidth={1}
          />
          <rect
            x={endX - 5}
            y={endY - 6}
            width={10}
            height={12}
            rx={2}
            fill={SCENE_COLORS.stopper.rubberStopper}
            stroke={SCENE_COLORS.stopper.rubberStopperBorder}
            strokeWidth={1}
          />
        </g>
      )}

      {/* 4. 气体标识说明 */}
      {label && (
        <text
          x={endX * 0.5}
          y={midY - 8}
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
