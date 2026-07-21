import { SCENE_COLORS, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface EvaporatingDishApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 90） */
  width?: number
  /** 器材高度（设计单位，默认 45） */
  height?: number
  /** 内部残余液体比例 0~1 */
  fillLevel?: number
  /** 是否出现析出的晶体颗粒 */
  hasCrystals?: boolean
  /** 晶体颜色 */
  crystalColor?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * EvaporatingDishApparatus — 蒸发皿组件
 *
 * 适用高中化学场景：
 * - 蒸发浓缩、冷却结晶、结晶水合物失水
 *
 * 颜色：`SCENE_COLORS.separationAndPurification.evaporatingDish`
 *
 * @example
 * ```tsx
 * <EvaporatingDishApparatus x={100} y={150} width={90} height={45} hasCrystals={true} font={font} />
 * ```
 */
export function EvaporatingDishApparatus({
  x,
  y,
  width = 90,
  height = 45,
  fillLevel = 0.3,
  hasCrystals = false,
  crystalColor = '#FFFFFF',
}: EvaporatingDishApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  // 浅弧盘 Path
  const dishPath = `
    M 0 5
    Q ${w * 0.5} ${h * 1.5} ${w} 5
    Q ${w * 0.5} ${h * 1.1} 0 5
    Z
  `

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 瓷质蒸发皿盘体 */}
      <path
        d={dishPath}
        fill={SCENE_COLORS.separationAndPurification.evaporatingDish}
        stroke={SCENE_COLORS.materials.wood}
        strokeWidth={STROKE.objectLine}
      />

      {/* 残余溶液 */}
      {fillLevel > 0 && (
        <ellipse
          cx={w * 0.5}
          cy={h * 0.6}
          rx={w * 0.35 * fillLevel}
          ry={h * 0.2 * fillLevel}
          fill={SCENE_COLORS.reagent.solution}
          opacity={0.8}
        />
      )}

      {/* 析出的结晶颗粒 */}
      {hasCrystals && !isTiny && (
        <g fill={crystalColor} opacity={0.9}>
          <circle cx={w * 0.45} cy={h * 0.6} r={2} />
          <circle cx={w * 0.52} cy={h * 0.65} r={2.5} />
          <circle cx={w * 0.38} cy={h * 0.62} r={2} />
          <circle cx={w * 0.58} cy={h * 0.58} r={2} />
        </g>
      )}
    </g>
  )
}
