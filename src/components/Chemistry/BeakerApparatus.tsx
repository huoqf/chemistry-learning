import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface BeakerApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 80） */
  width?: number
  /** 器材高度（设计单位，默认 100） */
  height?: number
  /** 内部液体填充比例 0~1（默认 0 空烧杯） */
  fillLevel?: number
  /** 内部液体颜色（默认 SCENE_COLORS.reagent.solution） */
  fillColor?: string
  /** 底部沉淀填充比例 0~1（默认 0 无沉淀） */
  precipitateLevel?: number
  /** 底部沉淀颜色（默认 SCENE_COLORS.reagent.precipitate） */
  precipitateColor?: string
  /** 字体缩放函数，由 useAnimationViewport 提供 */
  font?: FontScaler
  /** 烧杯标签或容量提示文本（如 "250mL"） */
  label?: string
}

/**
 * BeakerApparatus — 烧杯组件
 *
 * 适用高中化学场景：
 * - 溶液配制、稀释、加热、沉淀反应
 *
 * 颜色：`SCENE_COLORS.container.beaker`
 * 坐标：设计坐标，左上角 (x, y) 定位
 * 极小尺寸自适应：当 width < 40 时自动隐去刻度标注
 *
 * @example
 * ```tsx
 * <BeakerApparatus
 *   x={100} y={150} width={80} height={100}
 *   fillLevel={0.6} fillColor={SCENE_COLORS.reagent.acid}
 *   font={font}
 * />
 * ```
 */
export function BeakerApparatus({
  x,
  y,
  width = 80,
  height = 100,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  precipitateLevel = 0,
  precipitateColor = SCENE_COLORS.reagent.precipitate,
  font = (n) => n,
  label,
}: BeakerApparatusProps) {
  const w = width
  const h = height
  const wallT = Math.max(2, w * 0.04)
  const isTiny = w < 40

  // 倒液嘴偏移
  const spoutW = Math.max(3, w * 0.08)
  const spoutH = Math.max(3, h * 0.06)

  const innerW = w - wallT * 2
  const maxLiquidH = h - spoutH - wallT

  const liquidH = maxLiquidH * Math.min(1, Math.max(0, fillLevel))
  const pptH = maxLiquidH * Math.min(1, Math.max(0, precipitateLevel))

  // 烧杯主体路径
  const bodyPath = `
    M 0 ${spoutH}
    L ${-spoutW} 0
    L ${spoutW * 0.5} 0
    L ${w} 0
    L ${w} ${h - wallT * 2}
    Q ${w} ${h} ${w - wallT * 2} ${h}
    L ${wallT * 2} ${h}
    Q 0 ${h} 0 ${h - wallT * 2}
    Z
  `

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 烧杯玻璃主体背景 */}
      <path
        d={bodyPath}
        fill={withAlpha(SCENE_COLORS.container.beaker, 0.4)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
        strokeLinejoin="round"
      />

      {/* 溶液填充 */}
      {fillLevel > 0 && (
        <rect
          x={wallT}
          y={h - wallT - liquidH}
          width={innerW}
          height={liquidH}
          fill={fillColor}
          opacity={0.8}
          rx={1}
        />
      )}

      {/* 沉淀物填充 */}
      {precipitateLevel > 0 && (
        <rect
          x={wallT}
          y={h - wallT - pptH}
          width={innerW}
          height={pptH}
          fill={precipitateColor}
          opacity={0.9}
          rx={1}
        />
      )}

      {/* 刻度线（非微缩模式） */}
      {!isTiny && (
        <g opacity={0.7}>
          {[0.25, 0.5, 0.75].map((ratio, idx) => {
            const lineY = h - wallT - maxLiquidH * ratio
            const isMajor = idx === 1
            const tickLength = isMajor ? w * 0.22 : w * 0.14
            return (
              <line
                key={ratio}
                x1={wallT}
                y1={lineY}
                x2={wallT + tickLength}
                y2={lineY}
                stroke={SCENE_COLORS.container.beakerBorder}
                strokeWidth={STROKE.reference}
              />
            )
          })}
        </g>
      )}

      {/* 烧杯标签文本 */}
      {label && !isTiny && (
        <text
          x={w * 0.5}
          y={h * 0.45}
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
