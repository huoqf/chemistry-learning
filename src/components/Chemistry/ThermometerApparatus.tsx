import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface ThermometerApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材高度（设计单位，默认 180） */
  height?: number
  /** 温度读数 (如 25 ~ 100℃) */
  tempValue?: number
  /** 最高量程 (默认 100) */
  maxTemp?: number
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * ThermometerApparatus — 实验温度计组件
 *
 * 适用高中化学场景与考点：
 * - 蒸馏测蒸气温度（水银球位于蒸馏烧瓶支管口处）
 * - 水浴控温（55~60℃ 硝基苯制备）
 *
 * 颜色：`SCENE_COLORS.tube.glass` / `volumetricFlaskMark`
 */
export function ThermometerApparatus({
  x,
  y,
  height = 180,
  tempValue = 60,
  maxTemp = 100,
  font = (n) => n,
}: ThermometerApparatusProps) {
  const h = height

  const bulbR = 7
  const tubeW = 8
  const tubeLeft = -tubeW * 0.5

  const effTemp = Math.min(maxTemp, Math.max(0, tempValue))
  const liquidH = (h - bulbR * 2 - 20) * (effTemp / maxTemp)
  const mercuryColor = SCENE_COLORS.titrationAndMeasurement.volumetricFlaskMark

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 玻璃管外壁 */}
      <rect
        x={tubeLeft}
        y={0}
        width={tubeW}
        height={h - bulbR}
        rx={3}
        fill={SCENE_COLORS.tube.glass}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectThin}
      />

      {/* 底部感温玻璃泡 */}
      <circle
        cx={0}
        cy={h - bulbR}
        r={bulbR}
        fill={mercuryColor}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 红色温度液柱 */}
      <line
        x1={0}
        y1={h - bulbR}
        x2={0}
        y2={h - bulbR - liquidH}
        stroke={mercuryColor}
        strokeWidth={STROKE.objectLine}
        strokeLinecap="round"
      />

      {/* 温度数字标注 */}
      <text
        x={tubeW + 4}
        y={h - bulbR - liquidH + 4}
        fontSize={font(FONT.annotation)}
        fill={mercuryColor}
        fontWeight="bold"
      >
        {`${Math.round(tempValue)}℃`}
      </text>
    </g>
  )
}
