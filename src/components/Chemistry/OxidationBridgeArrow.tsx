import { CHEMISTRY_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface OxidationBridgeArrowProps {
  /** 起点设计坐标 [x, y] (如被氧化/还原元素的元素符号上方) */
  startPos: [number, number]
  /** 终点设计坐标 [x, y] */
  endPos: [number, number]
  /** 转移电子文本 (如 "2 × e⁻" 或 "失 2e⁻, 化合价升高 2") */
  label: string
  /** 双线桥弯曲弧度高度（默认 30） */
  arcHeight?: number
  /** 桥线类型：'double' 双线桥 (向上/向下拱起) | 'single' 单线桥 (直指线) */
  variant?: 'double' | 'single'
  /** 颜色覆盖（默认 CHEMISTRY_COLORS.reactionRate 橙红色） */
  color?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * OxidationBridgeArrow — 氧化还原反应双线桥/单线桥箭头组件
 *
 * 适用高中化学场景：
 * - 氧化还原反应化合价升降与得失电子标注
 * - 高考配平与电子转移统计推导
 *
 * 颜色：`CHEMISTRY_COLORS.reactionRate` / 自定义
 *
 * @example
 * ```tsx
 * <OxidationBridgeArrow
 *   startPos={[100, 80]}
 *   endPos={[220, 80]}
 *   label="失 2e⁻，化合价升高"
 *   arcHeight={35}
 *   variant="double"
 *   font={font}
 * />
 * ```
 */
export function OxidationBridgeArrow({
  startPos,
  endPos,
  label,
  arcHeight = 35,
  variant = 'double',
  color = CHEMISTRY_COLORS.reactionRate,
  font = (n) => n,
}: OxidationBridgeArrowProps) {
  const [x1, y1] = startPos
  const [x2, y2] = endPos

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2 - arcHeight

  // 弧线 SVG Path
  const pathD =
    variant === 'double'
      ? `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`
      : `M ${x1} ${y1} L ${x2} ${y2}`

  const markerId = `ox-arrow-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}`

  return (
    <g className="oxidation-bridge-arrow">
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill={color} />
        </marker>
      </defs>

      {/* 桥线主体 */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={STROKE.objectLine}
        markerEnd={`url(#${markerId})`}
        strokeDasharray={variant === 'single' ? '4 2' : 'none'}
      />

      {/* 电子转移说明文字 */}
      <text
        x={midX}
        y={midY - 6}
        textAnchor="middle"
        fill={color}
        fontSize={font(FONT.annotation)}
        fontWeight="bold"
      >
        {label}
      </text>
    </g>
  )
}
