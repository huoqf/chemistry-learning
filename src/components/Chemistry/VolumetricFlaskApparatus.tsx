import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface VolumetricFlaskApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 70） */
  width?: number
  /** 器材高度（设计单位，默认 130） */
  height?: number
  /** 内部液体填充比例 0~1（1 刚好到达红刻度线） */
  fillLevel?: number
  /** 内部液体颜色 */
  fillColor?: string
  /** 是否带有磨砂瓶塞 */
  hasStopper?: boolean
  /** 容量规格标识（如 "250mL" / "100mL"） */
  specification?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * VolumetricFlaskApparatus — 容量瓶组件
 *
 * 适用高中化学场景与高考考点：
 * - 配制一定物质的量浓度的溶液（考点：视线与凹液面最低处相切、定容、摇匀）
 *
 * 质感：支持凹液面弯月面效果与右侧玻璃高光线条
 */
export function VolumetricFlaskApparatus({
  x,
  y,
  width = 70,
  height = 130,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  hasStopper = true,
  specification = '250mL',
  font = (n) => n,
}: VolumetricFlaskApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const neckW = w * 0.22
  const neckH = h * 0.45
  const neckLeft = (w - neckW) / 2
  const neckRight = neckLeft + neckW

  // 容量瓶刻度线高度 (位于颈部约 60% 位置)
  const markY = neckH * 0.6

  const bodyR = w * 0.48
  const bodyCY = h - bodyR

  // 外轮廓 Path
  const flaskPath = `
    M ${neckLeft} 0
    L ${neckRight} 0
    L ${neckRight} ${neckH}
    A ${bodyR} ${bodyR} 0 1 1 ${neckLeft} ${neckH}
    Z
  `

  // 高光 Path
  const highlightPath = `
    M ${neckRight - 2} 8
    L ${neckRight - 2} ${neckH}
    A ${bodyR * 0.9} ${bodyR * 0.9} 0 0 1 ${w - 6} ${bodyCY}
  `

  const getLiquidY = () => {
    if (fillLevel <= 0) return h
    return h - (h - markY) * Math.min(1.1, Math.max(0, fillLevel))
  }

  const liquidY = getLiquidY()

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 容量瓶玻璃主体背景 */}
      <path
        d={flaskPath}
        fill={withAlpha(SCENE_COLORS.titrationAndMeasurement.volumetricFlask, 0.4)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
        strokeLinejoin="round"
      />

      {/* 玻璃高光反光光弧 (WOW 质感) */}
      {!isTiny && (
        <path
          d={highlightPath}
          fill="none"
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={STROKE.objectThin}
          opacity={0.65}
          strokeLinecap="round"
        />
      )}

      {/* 液体填充与凹液面 */}
      {fillLevel > 0 && (
        <g clipPath={`url(#flask-clip-${x}-${y})`}>
          <rect
            x={0}
            y={liquidY}
            width={w}
            height={h - liquidY}
            fill={fillColor}
            opacity={0.8}
          />
          {/* 液体凹液面 (Meniscus curve) */}
          <path
            d={`
              M ${liquidY < neckH ? neckLeft : 2} ${liquidY}
              Q ${w * 0.5} ${liquidY + 3} ${liquidY < neckH ? neckRight : w - 2} ${liquidY}
            `}
            fill="none"
            stroke={fillColor}
            strokeWidth={STROKE.reference}
          />
        </g>
      )}

      <defs>
        <clipPath id={`flask-clip-${x}-${y}`}>
          <path d={flaskPath} />
        </clipPath>
      </defs>

      {/* 红色容量瓶标线 (高考核心考点：平视此线定容) */}
      <line
        x1={neckLeft - 3}
        y1={markY}
        x2={neckRight + 3}
        y2={markY}
        stroke={SCENE_COLORS.titrationAndMeasurement.volumetricFlaskMark}
        strokeWidth={STROKE.objectLine}
      />

      {/* 磨砂瓶塞 */}
      {hasStopper && (
        <polygon
          points={`
            ${neckLeft - 2}, -${h * 0.08}
            ${neckRight + 2}, -${h * 0.08}
            ${neckRight + 1}, 2
            ${neckLeft - 1}, 2
          `}
          fill={SCENE_COLORS.materials.glass}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={STROKE.reference}
        />
      )}

      {/* 容量规格标注 */}
      {specification && !isTiny && (
        <text
          x={w * 0.5}
          y={bodyCY + 4}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="500"
          opacity={0.75}
        >
          {specification}
        </text>
      )}
    </g>
  )
}
