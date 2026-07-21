import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface WaterBathApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 120） */
  width?: number
  /** 器材高度（设计单位，默认 90） */
  height?: number
  /** 内部水位/油位比例 0~1 */
  fillLevel?: number
  /** 浴液类型：'water' 水浴 | 'oil' 油浴 */
  bathType?: 'water' | 'oil'
  /** 目标设定温度 (如 "60℃" / "100℃") */
  tempLabel?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * WaterBathApparatus — 水浴/油浴锅组件
 *
 * 适用高中化学场景：
 * - 硝基苯制备 (55~60℃ 水浴)、酚醛树脂制备 (沸水浴)、乙酸乙酯水解
 *
 * 颜色：`SCENE_COLORS.heatingAndSupport.waterBath`
 *
 * @example
 * ```tsx
 * <WaterBathApparatus x={100} y={150} bathType="water" tempLabel="60℃" font={font} />
 * ```
 */
export function WaterBathApparatus({
  x,
  y,
  width = 120,
  height = 90,
  fillLevel = 0.7,
  bathType = 'water',
  tempLabel = '60℃',
  font = (n) => n,
}: WaterBathApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const liquidColor = bathType === 'water' ? '#BAE6FD' : '#FDE68A'
  const wallT = Math.max(2, w * 0.04)
  const innerW = w - wallT * 2
  const innerH = (h - 16) * Math.min(1, Math.max(0, fillLevel))

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 水浴槽顶边圈 */}
      <rect
        x={0}
        y={0}
        width={w}
        height={10}
        rx={2}
        fill={SCENE_COLORS.heatingAndSupport.waterBath}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 槽体主体 */}
      <rect
        x={wallT * 0.5}
        y={8}
        width={w - wallT}
        height={h - 8}
        rx={4}
        fill={SCENE_COLORS.heatingAndSupport.waterBath}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 内部浴液 (水/油) */}
      <rect
        x={wallT * 1.5}
        y={h - wallT - innerH}
        width={innerW - wallT}
        height={innerH}
        fill={liquidColor}
        opacity={0.8}
        rx={2}
      />

      {/* 温度显示 */}
      {tempLabel && !isTiny && (
        <text
          x={w * 0.5}
          y={h - 12}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill="white"
          fontWeight="bold"
        >
          {tempLabel}
        </text>
      )}
    </g>
  )
}
