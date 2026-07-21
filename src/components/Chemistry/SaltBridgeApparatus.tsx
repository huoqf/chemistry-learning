import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface SaltBridgeApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材跨度宽度（设计单位，默认 100） */
  width?: number
  /** 器材高度（设计单位，默认 70） */
  height?: number
  /** 盐桥内填充物名称 (如 "KCl-琼脂") */
  label?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * SaltBridgeApparatus — U型盐桥组件
 *
 * 适用高中化学场景：
 * - 双池原电池中消除界面电势、导通内电路 (K⁺ 移向正极，Cl⁻ 移向负极)
 *
 * 颜色：`SCENE_COLORS.separationAndPurification.evaporatingDish`
 */
export function SaltBridgeApparatus({
  x,
  y,
  width = 100,
  height = 70,
  label = 'KCl 盐桥',
  font = (n) => n,
}: SaltBridgeApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const legW = 14
  const topH = 14

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 倒 U 型盐桥主体 */}
      <path
        d={`
          M 0 ${h}
          L 0 ${topH}
          Q 0 0 ${topH} 0
          L ${w - topH} 0
          Q ${w} 0 ${w} ${topH}
          L ${w} ${h}
          L ${w - legW} ${h}
          L ${w - legW} ${topH + 4}
          L ${legW} ${topH + 4}
          L ${legW} ${h}
          Z
        `}
        fill={SCENE_COLORS.separationAndPurification.evaporatingDish}
        opacity={0.85}
        stroke={SCENE_COLORS.tube.glass}
        strokeWidth={STROKE.objectLine}
      />

      {/* 盐桥名称 */}
      {label && !isTiny && (
        <text
          x={w * 0.5}
          y={topH * 0.7}
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
