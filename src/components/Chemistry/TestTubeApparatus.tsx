import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface TestTubeApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 30） */
  width?: number
  /** 器材高度（设计单位，默认 120） */
  height?: number
  /** 试管倾斜角度（度数，0 为垂直，例如 45 为右倾斜） */
  tiltAngle?: number
  /** 内部液体填充比例 0~1 */
  fillLevel?: number
  /** 内部液体颜色 */
  fillColor?: string
  /** 底部沉淀填充比例 0~1 */
  precipitateLevel?: number
  /** 底部沉淀颜色 */
  precipitateColor?: string
  /** 是否带有橡皮塞 */
  hasStopper?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
  /** 试管编号/标注 */
  label?: string
}

/**
 * TestTubeApparatus — 试管组件
 *
 * 适用高中化学场景：
 * - 离子检验、沉淀反应、试管加热（斜持45°）、气体收集
 *
 * 颜色：`SCENE_COLORS.container.testTube`
 *
 * @example
 * ```tsx
 * <TestTubeApparatus
 *   x={150} y={120} width={30} height={120}
 *   tiltAngle={45} fillLevel={0.4} fillColor={SCENE_COLORS.reagent.solution}
 *   font={font}
 * />
 * ```
 */
export function TestTubeApparatus({
  x,
  y,
  width = 30,
  height = 120,
  tiltAngle = 0,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  precipitateLevel = 0,
  precipitateColor = SCENE_COLORS.reagent.precipitate,
  hasStopper = false,
  font = (n) => n,
  label,
}: TestTubeApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 24

  const wallT = Math.max(1.5, w * 0.05)
  const bottomR = w * 0.5
  const innerW = w - wallT * 2
  const tubeBodyH = h - bottomR

  const maxLiquidH = h - wallT - 8
  const liquidH = maxLiquidH * Math.min(1, Math.max(0, fillLevel))
  const pptH = maxLiquidH * Math.min(1, Math.max(0, precipitateLevel))

  // 试管外轮廓 Path (带底部圆弧)
  const tubePath = `
    M 0 0
    L ${w} 0
    L ${w} ${tubeBodyH}
    A ${bottomR} ${bottomR} 0 0 1 0 ${tubeBodyH}
    Z
  `

  return (
    <g transform={`translate(${x}, ${y}) rotate(${tiltAngle}, ${w * 0.5}, 0)`}>
      {/* 试管口翻边 */}
      <rect
        x={-2}
        y={-3}
        width={w + 4}
        height={4}
        rx={1}
        fill={SCENE_COLORS.container.testTube}
        stroke={SCENE_COLORS.container.testTubeBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 试管玻璃主体 */}
      <path
        d={tubePath}
        fill={withAlpha(SCENE_COLORS.container.testTube, 0.35)}
        stroke={SCENE_COLORS.container.testTubeBorder}
        strokeWidth={STROKE.objectThin}
      />

      {/* 液体填充 */}
      {fillLevel > 0 && (
        <g clipPath={`url(#testtube-clip-${x}-${y})`}>
          <rect
            x={wallT}
            y={h - liquidH}
            width={innerW}
            height={liquidH}
            fill={fillColor}
            opacity={0.85}
          />
        </g>
      )}

      {/* 沉淀填充 */}
      {precipitateLevel > 0 && (
        <g clipPath={`url(#testtube-clip-${x}-${y})`}>
          <rect
            x={wallT}
            y={h - pptH}
            width={innerW}
            height={pptH}
            fill={precipitateColor}
            opacity={0.9}
          />
        </g>
      )}

      {/* ClipPath 裁剪模板 */}
      <defs>
        <clipPath id={`testtube-clip-${x}-${y}`}>
          <path d={tubePath} />
        </clipPath>
      </defs>

      {/* 橡皮塞 */}
      {hasStopper && (
        <polygon
          points={`
            -1, -12
            ${w + 1}, -12
            ${w - 1}, 2
            1, 2
          `}
          fill={SCENE_COLORS.materials.rubber}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.reference}
        />
      )}

      {/* 试管编号/标注 */}
      {label && !isTiny && (
        <text
          x={w * 0.5}
          y={h * 0.4}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill={SCENE_COLORS.labels.coefficient}
          opacity={0.6}
        >
          {label}
        </text>
      )}
    </g>
  )
}
