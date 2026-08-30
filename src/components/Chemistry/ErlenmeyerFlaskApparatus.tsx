import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface ErlenmeyerFlaskApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 80） */
  width?: number
  /** 器材高度（设计单位，默认 110） */
  height?: number
  /** 内部液体填充比例 0~1（默认 0 空瓶） */
  fillLevel?: number
  /** 内部液体颜色（默认 SCENE_COLORS.reagent.solution） */
  fillColor?: string
  /** 是否带有橡皮塞（默认 false） */
  hasStopper?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
  /** 标签文本（如 "250mL"） */
  label?: string
}

/**
 * ErlenmeyerFlaskApparatus — 锥形瓶组件
 *
 * 适用高中化学场景：
 * - 中和滴定（接收瓶）、气体制备、加热反应
 *
 * 颜色：`SCENE_COLORS.container.flask`
 * 坐标：设计坐标，左上角 (x, y) 定位
 *
 * @example
 * ```tsx
 * <ErlenmeyerFlaskApparatus
 *   x={200} y={150} width={80} height={110}
 *   fillLevel={0.4} fillColor={SCENE_COLORS.reagent.indicator}
 *   font={font}
 * />
 * ```
 */
export function ErlenmeyerFlaskApparatus({
  x,
  y,
  width = 80,
  height = 110,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  hasStopper = false,
  font = (n) => n,
  label,
}: ErlenmeyerFlaskApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const neckW = w * 0.35
  const neckH = h * 0.25
  const neckLeft = (w - neckW) / 2
  const neckRight = neckLeft + neckW

  const wallT = Math.max(2, w * 0.04)
  const bottomCornerR = Math.max(2, w * 0.06)

  // 外轮廓 Path
  const flaskPath = `
    M ${neckLeft} 0
    L ${neckRight} 0
    L ${neckRight} ${neckH}
    L ${w - bottomCornerR} ${h - bottomCornerR}
    Q ${w} ${h} ${w - bottomCornerR} ${h}
    L ${bottomCornerR} ${h}
    Q 0 ${h} ${bottomCornerR} ${h - bottomCornerR}
    L ${neckLeft} ${neckH}
    Z
  `

  const effFill = Math.min(1, Math.max(0, fillLevel))
  const bodyH = h - neckH - wallT
  const liquidTopY = h - wallT - bodyH * effFill
  const t = (liquidTopY - neckH) / bodyH
  const currentW = neckW + (w - neckW) * (1 - Math.max(0, t))
  const currentLeft = (w - currentW) / 2
  const currentRight = currentLeft + currentW

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 锥形瓶玻璃主体背景 */}
      <path
        d={flaskPath}
        fill={withAlpha(SCENE_COLORS.container.flask, 0.35)}
        stroke={SCENE_COLORS.container.flaskBorder}
        strokeWidth={STROKE.objectLine}
        strokeLinejoin="round"
      />

      {/* 2. 瓶口加厚翻边圆唇 (Beaded Neck Rim) */}
      <rect
        x={neckLeft - 2}
        y={-1}
        width={neckW + 4}
        height={3}
        rx={1}
        fill={SCENE_COLORS.container.flask}
        stroke={SCENE_COLORS.container.flaskBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 3. 液体填充与表面凹液面 */}
      {fillLevel > 0 && (
        <g clipPath={`url(#erlen-clip-${x}-${y})`}>
          <path
            d={`
              M ${currentLeft} ${liquidTopY}
              L ${currentRight} ${liquidTopY}
              L ${w - wallT - bottomCornerR} ${h - wallT - bottomCornerR}
              Q ${w - wallT} ${h - wallT} ${w - wallT - bottomCornerR} ${h - wallT}
              L ${wallT + bottomCornerR} ${h - wallT}
              Q ${wallT} ${h - wallT} ${wallT + bottomCornerR} ${h - wallT - bottomCornerR}
              Z
            `}
            fill={fillColor}
            opacity={0.82}
          />
          {/* 凹液面弧线 */}
          <path
            d={`M ${currentLeft} ${liquidTopY} Q ${w * 0.5} ${liquidTopY + 2.5} ${currentRight} ${liquidTopY}`}
            fill="none"
            stroke={fillColor}
            strokeWidth={STROKE.reference}
            opacity={0.9}
          />
        </g>
      )}

      {/* 4. 玻璃高光反光弧 (右侧倾斜高光) */}
      {!isTiny && (
        <g opacity={0.65}>
          <line
            x1={neckRight - 2}
            y1={4}
            x2={neckRight - 2}
            y2={neckH}
            stroke={SCENE_COLORS.materials.glassHighlight}
            strokeWidth={1}
            strokeLinecap="round"
          />
          <line
            x1={neckRight}
            y1={neckH + 4}
            x2={w - bottomCornerR - 3}
            y2={h - bottomCornerR - 6}
            stroke={SCENE_COLORS.materials.glassHighlight}
            strokeWidth={STROKE.objectThin}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 剪裁模板 */}
      <defs>
        <clipPath id={`erlen-clip-${x}-${y}`}>
          <path d={flaskPath} />
        </clipPath>
      </defs>

      {/* 5. 瓶口橡皮塞 */}
      {hasStopper && (
        <polygon
          points={`
            ${neckLeft - 1}, -${h * 0.08}
            ${neckRight + 1}, -${h * 0.08}
            ${neckRight}, 4
            ${neckLeft}, 4
          `}
          fill={SCENE_COLORS.materials.rubber}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.reference}
        />
      )}

      {/* 6. 刻度线（非微缩模式） */}
      {!isTiny && (
        <g opacity={0.65}>
          {[0.3, 0.5, 0.7].map((ratio) => {
            const lineY = h - (h - neckH) * ratio
            const tr = (lineY - neckH) / (h - neckH)
            const cW = neckW + (w - neckW) * (1 - Math.max(0, tr))
            const lineLeft = (w - cW) / 2 + wallT
            return (
              <line
                key={ratio}
                x1={lineLeft}
                y1={lineY}
                x2={lineLeft + cW * 0.25}
                y2={lineY}
                stroke={SCENE_COLORS.container.flaskBorder}
                strokeWidth={STROKE.reference}
              />
            )
          })}
        </g>
      )}

      {/* 7. 瓶身标注 */}
      {label && !isTiny && (
        <text
          x={w * 0.5}
          y={h * 0.65}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill={SCENE_COLORS.labels.coefficient}
          opacity={0.65}
          fontWeight="500"
        >
          {label}
        </text>
      )}
    </g>
  )
}
