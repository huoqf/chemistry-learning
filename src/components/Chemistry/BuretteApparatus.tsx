import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface BuretteApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 30） */
  width?: number
  /** 器材高度（设计单位，默认 240） */
  height?: number
  /** 滴定管类型：'acid' 酸式 (玻璃活塞) | 'base' 碱式 (橡皮管+玻璃珠) */
  variant?: 'acid' | 'base'
  /** 内部液体填充比例 0~1（0 为空管，1 为满管，对应刻度 0 在上方） */
  fillLevel?: number
  /** 内部液体颜色 */
  fillColor?: string
  /** 活塞/阀门是否打开 */
  isOpen?: boolean
  /** 是否在下口显示滴落的液滴 */
  showDrop?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * BuretteApparatus — 滴定管组件（酸式/碱式）
 *
 * 适用高中化学场景：
 * - 中和滴定实验（高考必考点：酸式装酸性/氧化性试剂，碱式装碱性试剂）
 *
 * 颜色：`SCENE_COLORS.titrationAndMeasurement.buretteAcid`
 * 坐标：设计坐标，左上角 (x, y) 定位
 *
 * @example
 * ```tsx
 * <BuretteApparatus
 *   x={200} y={50} height={260}
 *   variant="acid" fillLevel={0.7} isOpen={true} showDrop={true}
 *   font={font}
 * />
 * ```
 */
export function BuretteApparatus({
  x,
  y,
  width = 30,
  height = 240,
  variant = 'acid',
  fillLevel = 0.8,
  fillColor = SCENE_COLORS.reagent.acid,
  isOpen = false,
  showDrop = false,
  font = (n) => n,
}: BuretteApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 24

  const tubeW = w * 0.4
  const tubeLeft = (w - tubeW) / 2
  const tubeRight = tubeLeft + tubeW

  // 阀门位置 (距离底部 15% 处)
  const valveY = h * 0.82
  const mainTubeH = valveY - 10

  const liquidH = mainTubeH * Math.min(1, Math.max(0, fillLevel))
  const liquidTopY = mainTubeH - liquidH

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 滴定管上口喇叭口 */}
      <polygon
        points={`
          ${tubeLeft - 3}, 0
          ${tubeRight + 3}, 0
          ${tubeRight}, 8
          ${tubeLeft}, 8
        `}
        fill={SCENE_COLORS.titrationAndMeasurement.buretteAcid}
        stroke={SCENE_COLORS.titrationAndMeasurement.buretteAcidBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 主管身玻璃框 */}
      <rect
        x={tubeLeft}
        y={8}
        width={tubeW}
        height={mainTubeH}
        fill={withAlpha(SCENE_COLORS.titrationAndMeasurement.buretteAcid, 0.3)}
        stroke={SCENE_COLORS.titrationAndMeasurement.buretteAcidBorder}
        strokeWidth={STROKE.objectThin}
      />

      {/* 液体 */}
      {fillLevel > 0 && (
        <rect
          x={tubeLeft + 1}
          y={8 + liquidTopY}
          width={tubeW - 2}
          height={liquidH}
          fill={fillColor}
          opacity={0.85}
        />
      )}

      {/* 刻度线（非微缩模式） */}
      {!isTiny && (
        <g opacity={0.7}>
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, idx) => {
            const lineY = 12 + mainTubeH * 0.9 * ratio
            const isMajor = idx % 2 === 0
            const tickLength = isMajor ? tubeW * 0.6 : tubeW * 0.35
            return (
              <g key={ratio}>
                <line
                  x1={tubeLeft}
                  y1={lineY}
                  x2={tubeLeft + tickLength}
                  y2={lineY}
                  stroke={SCENE_COLORS.titrationAndMeasurement.buretteAcidBorder}
                  strokeWidth={STROKE.reference}
                />
                {isMajor && (
                  <text
                    x={tubeLeft - 2}
                    y={lineY + 3}
                    textAnchor="end"
                    fontSize={font(FONT.annotation)}
                    fill={SCENE_COLORS.labels.coefficient}
                    opacity={0.7}
                  >
                    {idx * 10}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      )}

      {/* 底部阀门 / 活塞结构 */}
      {variant === 'acid' ? (
        /* 酸式：玻璃活塞 */
        <g transform={`translate(${w * 0.5}, ${valveY})`}>
          <rect
            x={-tubeW * 0.8}
            y={-6}
            width={tubeW * 1.6}
            height={12}
            rx={2}
            fill={SCENE_COLORS.titrationAndMeasurement.buretteAcid}
            stroke={SCENE_COLORS.titrationAndMeasurement.buretteAcidBorder}
            strokeWidth={STROKE.reference}
          />
          {/* 旋转手柄 */}
          <line
            x1={0}
            y1={isOpen ? -10 : 0}
            x2={0}
            y2={isOpen ? 10 : 10}
            stroke={SCENE_COLORS.titrationAndMeasurement.buretteAcidBorder}
            strokeWidth={STROKE.objectLine}
          />
        </g>
      ) : (
        /* 碱式：橡胶管 + 玻璃珠 */
        <g transform={`translate(${w * 0.5}, ${valveY})`}>
          <rect
            x={-tubeW * 0.5}
            y={-8}
            width={tubeW}
            height={16}
            rx={2}
            fill={SCENE_COLORS.titrationAndMeasurement.buretteBaseRubber}
          />
          {/* 玻璃珠 */}
          <circle
            cx={0}
            cy={0}
            r={tubeW * 0.3}
            fill={SCENE_COLORS.materials.glass}
            stroke={SCENE_COLORS.materials.glassBorder}
            strokeWidth={STROKE.reference}
          />
        </g>
      )}

      {/* 尖嘴下管 */}
      <polygon
        points={`
          ${tubeLeft + 1}, ${valveY + 8}
          ${tubeRight - 1}, ${valveY + 8}
          ${w * 0.5 + 1.5}, ${h}
          ${w * 0.5 - 1.5}, ${h}
        `}
        fill={withAlpha(SCENE_COLORS.titrationAndMeasurement.buretteAcid, 0.5)}
        stroke={SCENE_COLORS.titrationAndMeasurement.buretteAcidBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 液滴 */}
      {showDrop && (
        <circle
          cx={w * 0.5}
          cy={h + 6}
          r={Math.max(2, w * 0.1)}
          fill={fillColor}
          opacity={0.9}
        />
      )}
    </g>
  )
}
