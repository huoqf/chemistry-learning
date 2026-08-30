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

  // 倒液嘴与翻边卷唇
  const spoutW = Math.max(3, w * 0.09)
  const spoutH = Math.max(3, h * 0.07)
  const rimH = Math.max(2, h * 0.035)

  const innerW = w - wallT * 2
  const maxLiquidH = h - spoutH - wallT - rimH

  const liquidH = maxLiquidH * Math.min(1, Math.max(0, fillLevel))
  const pptH = maxLiquidH * Math.min(1, Math.max(0, precipitateLevel))
  const liquidY = h - wallT - liquidH

  // 烧杯主体路径（倒液嘴+直筒+圆弧厚底）
  const bodyPath = `
    M 0 ${spoutH}
    L ${-spoutW} 0
    L ${spoutW * 0.4} 0
    L ${w} 0
    L ${w} ${h - wallT * 2.5}
    Q ${w} ${h} ${w - wallT * 2.5} ${h}
    L ${wallT * 2.5} ${h}
    Q 0 ${h} 0 ${h - wallT * 2.5}
    Z
  `

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 烧杯玻璃主体背景 */}
      <path
        d={bodyPath}
        fill={withAlpha(SCENE_COLORS.container.beaker, 0.35)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
        strokeLinejoin="round"
      />

      {/* 2. 上沿加厚翻边卷唇 (Beaded Rim) */}
      <line
        x1={-spoutW}
        y1={0}
        x2={w + 1}
        y2={0}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine + 0.5}
        strokeLinecap="round"
      />

      {/* 3. 溶液填充与表面张力凹液面 (Meniscus curve) */}
      {fillLevel > 0 && (
        <g clipPath={`url(#beaker-clip-${x}-${y})`}>
          <rect
            x={wallT}
            y={liquidY}
            width={innerW}
            height={liquidH}
            fill={fillColor}
            opacity={0.82}
          />
          {/* 凹液面弧线 */}
          <path
            d={`M ${wallT} ${liquidY} Q ${w * 0.5} ${liquidY + 2.5} ${w - wallT} ${liquidY}`}
            fill="none"
            stroke={fillColor}
            strokeWidth={STROKE.reference}
            opacity={0.9}
          />
        </g>
      )}

      {/* 4. 底部沉淀物填充与颗粒质感 */}
      {precipitateLevel > 0 && (
        <g clipPath={`url(#beaker-clip-${x}-${y})`}>
          <rect
            x={wallT}
            y={h - wallT - pptH}
            width={innerW}
            height={pptH}
            fill={precipitateColor}
            opacity={0.92}
          />
          {/* 沉淀表面微颗粒纹理 */}
          {!isTiny && (
            <g fill={withAlpha(SCENE_COLORS.labels.coefficient, 0.25)}>
              <circle cx={w * 0.3} cy={h - wallT - pptH * 0.6} r={1.5} />
              <circle cx={w * 0.5} cy={h - wallT - pptH * 0.3} r={2} />
              <circle cx={w * 0.7} cy={h - wallT - pptH * 0.7} r={1.5} />
              <circle cx={w * 0.4} cy={h - wallT - pptH * 0.2} r={1.2} />
              <circle cx={w * 0.65} cy={h - wallT - pptH * 0.4} r={1.8} />
            </g>
          )}
        </g>
      )}

      {/* 5. 玻璃高光反光弧线 (右侧纵向高光弧 + 底部反光) */}
      {!isTiny && (
        <g opacity={0.65}>
          {/* 右侧内壁纵向高光 */}
          <line
            x1={w - wallT - 2}
            y1={spoutH + 4}
            x2={w - wallT - 2}
            y2={h - wallT * 3}
            stroke={SCENE_COLORS.materials.glassHighlight}
            strokeWidth={STROKE.objectThin}
            strokeLinecap="round"
          />
          {/* 底部加厚弧线反光 */}
          <path
            d={`M ${wallT * 3} ${h - wallT * 1.5} Q ${w * 0.5} ${h - wallT * 0.5} ${w - wallT * 3} ${h - wallT * 1.5}`}
            fill="none"
            stroke={SCENE_COLORS.materials.glassHighlight}
            strokeWidth={1}
            opacity={0.5}
          />
        </g>
      )}

      {/* 剪裁模版 */}
      <defs>
        <clipPath id={`beaker-clip-${x}-${y}`}>
          <path d={bodyPath} />
        </clipPath>
      </defs>

      {/* 6. 刻度线（非微缩模式） */}
      {!isTiny && (
        <g opacity={0.75}>
          {[0.25, 0.5, 0.75].map((ratio, idx) => {
            const lineY = h - wallT - maxLiquidH * ratio
            const isMajor = idx === 1
            const tickLength = isMajor ? w * 0.22 : w * 0.14
            return (
              <g key={ratio}>
                <line
                  x1={wallT}
                  y1={lineY}
                  x2={wallT + tickLength}
                  y2={lineY}
                  stroke={SCENE_COLORS.container.beakerBorder}
                  strokeWidth={STROKE.reference}
                />
              </g>
            )
          })}
        </g>
      )}

      {/* 7. 烧杯标签文本 */}
      {label && !isTiny && (
        <text
          x={w * 0.5}
          y={h * 0.45}
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
