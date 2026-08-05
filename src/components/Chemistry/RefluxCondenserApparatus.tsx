import { SCENE_COLORS, STROKE, FONT, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export interface RefluxCondenserPorts {
  /** 下部连接反应瓶口 (蒸气进入) */
  bottomNeckPort: { x: number; y: number }
  /** 上部开口/安全通气口 */
  topNeckPort: { x: number; y: number }
  /** 下部冷却水进水口 (下进) */
  waterInletPort: { x: number; y: number }
  /** 上部冷却水出水口 (上出) */
  waterOutletPort: { x: number; y: number }
  /** 铁架台夹持点 */
  clampPoint: { x: number; y: number }
}

/**
 * 静态计算球形回流冷凝管组件的关键连接锚点 (Design Space)
 */
export function getRefluxCondenserPorts(
  x: number,
  y: number,
  width = 50,
  height = 180
): RefluxCondenserPorts {
  return {
    bottomNeckPort: { x: x + width * 0.5, y: y + height },
    topNeckPort: { x: x + width * 0.5, y: y },
    waterInletPort: { x: x + width, y: y + height - 30 },
    waterOutletPort: { x: x + width, y: y + 30 },
    clampPoint: { x: x + width * 0.5, y: y + height * 0.5 },
  }
}

export interface RefluxCondenserApparatusProps {
  /** 器材左上角 x */
  x: number
  /** 器材左上角 y */
  y: number
  /** 宽度 (默认 50) */
  width?: number
  /** 高度 (默认 180) */
  height?: number
  /** 球形泡个数 (默认 4) */
  bulbCount?: number
  /** 是否通水冷凝 */
  hasWater?: boolean
  /** 说明文字 */
  label?: string
  /** 字体缩放 */
  font?: FontScaler
}

/**
 * RefluxCondenserApparatus — 高考标准球形回流冷凝管组件
 *
 * 适用于：
 * - 有机化学实验中反应物/产物的蒸气回流（如乙酸乙酯制备、溴苯/硝基苯合成）
 * - 内部带有多个球形冷凝泡，极大增加蒸气冷凝面积
 * - 导出静态 `getRefluxCondenserPorts`
 */
export function RefluxCondenserApparatus({
  x,
  y,
  width = 50,
  height = 180,
  bulbCount = 4,
  hasWater = true,
  label = '球形回流冷凝管',
  font = (n) => n,
}: RefluxCondenserApparatusProps) {
  const w = width
  const h = height

  // 几何细分
  const outerW = w * 0.7
  const outerLeft = (w - outerW) / 2
  const innerR = 10

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 外套水腔 (带透明水填充) */}
      <rect
        x={outerLeft}
        y={20}
        width={outerW}
        height={h - 40}
        rx={outerW * 0.5}
        fill={hasWater ? withAlpha(SCENE_COLORS.separationAndPurification.condenser, 0.45) : 'none'}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 2. 内部球形冷凝泡串 */}
      <g transform={`translate(${w * 0.5}, 30)`}>
        {Array.from({ length: bulbCount }).map((_, idx) => {
          const bulbY = idx * ((h - 60) / (bulbCount - 1 || 1))
          return (
            <circle
              key={idx}
              cx={0}
              cy={bulbY}
              r={innerR}
              fill={withAlpha(SCENE_COLORS.materials.glass, 0.3)}
              stroke={SCENE_COLORS.separationAndPurification.condenserInner}
              strokeWidth={1.5}
            />
          )
        })}
      </g>

      {/* 3. 冷却水进出水接头 (下进上出) */}
      {/* 下进水接头 */}
      <rect
        x={outerLeft + outerW}
        y={h - 35}
        width={10}
        height={8}
        fill={SCENE_COLORS.materials.glass}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={1}
      />
      {/* 上出水接头 */}
      <rect
        x={outerLeft + outerW}
        y={25}
        width={10}
        height={8}
        fill={SCENE_COLORS.materials.glass}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={1}
      />

      {/* 4. 上下接口磨砂玻璃嘴 */}
      {/* 上嘴 */}
      <rect
        x={w * 0.5 - 6}
        y={0}
        width={12}
        height={20}
        fill={SCENE_COLORS.materials.glass}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 下嘴 */}
      <rect
        x={w * 0.5 - 6}
        y={h - 20}
        width={12}
        height={20}
        fill={SCENE_COLORS.materials.glass}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 标注提示 */}
      {label && (
        <text
          x={w * 0.5}
          y={h + 16}
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
