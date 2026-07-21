import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface BalanceApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 天平类型：'pan' 托盘天平 (左右盘+游码) | 'digital' 电子天平 */
  variant?: 'pan' | 'digital'
  /** 当前称量质量/读数 (g) */
  weight?: number
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * BalanceApparatus — 托盘天平 / 电子天平组件
 *
 * 适用高中化学场景：
 * - 溶液配制称量 NaOH/NaCl 固体 (托盘天平精确到 0.1g，高考重点：左物右码、烧杯称量腐蚀性药品)
 *
 * 颜色：`SCENE_COLORS.titrationAndMeasurement.balance`
 */
export function BalanceApparatus({
  x,
  y,
  variant = 'pan',
  weight = 5.8,
  font = (n) => n,
}: BalanceApparatusProps) {
  const isDigital = variant === 'digital'

  return (
    <g transform={`translate(${x}, ${y})`}>
      {isDigital ? (
        /* 1. 电子天平 */
        <g>
          {/* 天平秤盘 */}
          <rect x={15} y={5} width={70} height={10} rx={2} fill={SCENE_COLORS.materials.metal} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={STROKE.reference} />
          {/* 天平机身 */}
          <rect x={0} y={15} width={100} height={50} rx={4} fill={SCENE_COLORS.titrationAndMeasurement.balance} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={STROKE.objectLine} />
          {/* 电子显示屏 */}
          <rect x={20} y={25} width={60} height={22} rx={2} fill={SCENE_COLORS.materials.rubber} />
          <text x={50} y={41} textAnchor="middle" fontSize={font(FONT.small)} fill={SCENE_COLORS.labels.chemicalFormula} fontFamily="monospace" fontWeight="bold">
            {`${weight.toFixed(2)} g`}
          </text>
        </g>
      ) : (
        /* 2. 托盘天平 */
        <g>
          {/* 底座 */}
          <rect x={10} y={45} width={80} height={15} rx={2} fill={SCENE_COLORS.titrationAndMeasurement.balance} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={STROKE.objectLine} />
          {/* 支柱 */}
          <rect x={47} y={10} width={6} height={35} fill={SCENE_COLORS.materials.iron} />
          {/* 横梁 */}
          <line x1={15} y1={15} x2={85} y2={15} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={STROKE.objectLine} />
          {/* 左右托盘 */}
          <ellipse cx={20} cy={28} rx={14} ry={4} fill={SCENE_COLORS.materials.metal} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={STROKE.reference} />
          <ellipse cx={80} cy={28} rx={14} ry={4} fill={SCENE_COLORS.materials.metal} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={STROKE.reference} />
          {/* 读数文本 */}
          <text x={50} y={56} textAnchor="middle" fontSize={font(FONT.annotation)} fill="white" fontWeight="bold">
            {`${weight.toFixed(1)} g`}
          </text>
        </g>
      )}
    </g>
  )
}
