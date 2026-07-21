import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface CondenserApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材长度/宽度（设计单位，默认 200） */
  width?: number
  /** 器材高度（设计单位，默认 60） */
  height?: number
  /** 冷凝管类型：'straight' 直形 (蒸馏) | 'spherical' 球形 (回流) */
  condenserType?: 'straight' | 'spherical'
  /** 倾斜角度 (如倾斜 15° 用于蒸馏) */
  tiltAngle?: number
  /** 是否通入冷却水 (显示下进上出水流指示) */
  hasWater?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * CondenserApparatus — 冷凝管组件 (直形/球形)
 *
 * 适用高中化学场景：
 * - 石油分馏、蒸馏水制备（直形冷凝管，斜放，冷却水“下进上出”）
 * - 乙酸乙酯制备、硝基苯制备（球形冷凝管，竖直回流）
 *
 * 颜色：`SCENE_COLORS.separationAndPurification.condenser`
 *
 * @example
 * ```tsx
 * <CondenserApparatus x={100} y={100} width={200} tiltAngle={15} hasWater={true} font={font} />
 * ```
 */
export function CondenserApparatus({
  x,
  y,
  width = 200,
  height = 60,
  condenserType = 'straight',
  tiltAngle = 0,
  hasWater = true,
  font = (n) => n,
}: CondenserApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 50

  const outerH = h * 0.5
  const innerH = h * 0.2
  const outerY = (h - outerH) / 2

  return (
    <g transform={`translate(${x}, ${y}) rotate(${tiltAngle}, 0, ${h * 0.5})`}>
      {/* 1. 外套管 (夹层通冷却水) */}
      <rect
        x={w * 0.15}
        y={outerY}
        width={w * 0.7}
        height={outerH}
        rx={3}
        fill={hasWater ? withAlpha(SCENE_COLORS.separationAndPurification.condenser, 0.4) : 'none'}
        stroke={SCENE_COLORS.separationAndPurification.condenserInner}
        strokeWidth={STROKE.objectLine}
      />

      {/* 2. 内部管心 (蒸气通道) */}
      {condenserType === 'straight' ? (
        /* 直形内管 */
        <rect
          x={0}
          y={(h - innerH) / 2}
          width={w}
          height={innerH}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.3)}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={STROKE.reference}
        />
      ) : (
        /* 球形内管 (多个连珠球) */
        <g>
          <line
            x1={0}
            y1={h * 0.5}
            x2={w}
            y2={h * 0.5}
            stroke={SCENE_COLORS.container.beakerBorder}
            strokeWidth={STROKE.reference}
          />
          {[0.3, 0.45, 0.6, 0.75].map((r) => (
            <circle
              key={r}
              cx={w * r}
              cy={h * 0.5}
              r={outerH * 0.35}
              fill={withAlpha(SCENE_COLORS.materials.glass, 0.4)}
              stroke={SCENE_COLORS.container.beakerBorder}
              strokeWidth={STROKE.reference}
            />
          ))}
        </g>
      )}

      {/* 3. 冷却水进出口支管 (高考必考：下进上出) */}
      {!isTiny && (
        <g stroke={SCENE_COLORS.industrialPipeline.liquidPipe} strokeWidth={STROKE.objectThin}>
          {/* 右下：进水口 (靠近冷凝管出口处，即“下进”) */}
          <line x1={w * 0.75} y1={outerY + outerH} x2={w * 0.75} y2={outerY + outerH + 12} />
          {/* 左上：出水口 (靠近蒸气入口处，即“上出”) */}
          <line x1={w * 0.25} y1={outerY} x2={w * 0.25} y2={outerY - 12} />
        </g>
      )}

      {/* 进出水文字说明 */}
      {!isTiny && hasWater && (
        <g fontSize={font(FONT.annotation)} fill={SCENE_COLORS.industrialPipeline.liquidPipe}>
          <text x={w * 0.75 + 4} y={outerY + outerH + 12}>水进</text>
          <text x={w * 0.25 + 4} y={outerY - 12}>水出</text>
        </g>
      )}
    </g>
  )
}
