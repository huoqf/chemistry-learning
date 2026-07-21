import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface PhMeterApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 展示模式：'meter' 数字 pH 计 | 'strip' pH 试纸与比色卡 */
  variant?: 'meter' | 'strip'
  /** 当前 pH 读数 (0~14) */
  phValue?: number
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * PhMeterApparatus — pH计 / pH试纸与比色卡组件
 *
 * 适用高中化学场景：
 * - 滴定过程 pH 变化检测、溶液酸碱度测量
 * - 比色卡读数对比 (pH 试纸检验：变红为酸，变蓝为碱)
 */
export function PhMeterApparatus({
  x,
  y,
  variant = 'meter',
  phValue = 7.0,
  font = (n) => n,
}: PhMeterApparatusProps) {
  const isMeter = variant === 'meter'

  return (
    <g transform={`translate(${x}, ${y})`}>
      {isMeter ? (
        /* 1. 数字 pH 计与探头 */
        <g>
          {/* 探头玻璃线 */}
          <line x1={40} y1={40} x2={40} y2={110} stroke={SCENE_COLORS.tube.glass} strokeWidth={STROKE.objectLine} />
          <circle cx={40} cy={110} r={4} fill={SCENE_COLORS.container.beaker} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={STROKE.reference} />
          {/* 数显仪表盘 */}
          <rect x={0} y={0} width={80} height={40} rx={4} fill={SCENE_COLORS.materials.rubber} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={STROKE.objectLine} />
          <text x={40} y={26} textAnchor="middle" fontSize={font(FONT.label)} fill={SCENE_COLORS.titrationAndMeasurement.buretteAcidBorder} fontFamily="monospace" fontWeight="bold">
            {`pH: ${phValue.toFixed(2)}`}
          </text>
        </g>
      ) : (
        /* 2. pH 试纸比色卡 */
        <g>
          <rect x={0} y={0} width={100} height={35} rx={3} fill={SCENE_COLORS.separationAndPurification.evaporatingDish} stroke={SCENE_COLORS.materials.wood} strokeWidth={STROKE.reference} />
          {/* 标准比色卡 (色阶 1~14 对应 SCENE_COLORS 试剂与管道色系) */}
          {[
            SCENE_COLORS.reagent.acid,
            SCENE_COLORS.industrialPipeline.steamPipe,
            SCENE_COLORS.heatingAndSupport.flame,
            SCENE_COLORS.separationAndPurification.evaporatingDish,
            SCENE_COLORS.reagent.salt,
            SCENE_COLORS.industrialPipeline.liquidPipe,
            SCENE_COLORS.reagent.base,
            SCENE_COLORS.labels.chemicalFormula,
            SCENE_COLORS.reagent.indicator,
          ].map((color, idx) => (
            <rect key={idx} x={5 + idx * 10} y={5} width={8} height={15} fill={color} />
          ))}
          <text x={50} y={30} textAnchor="middle" fontSize={font(FONT.annotation)} fill={SCENE_COLORS.labels.coefficient}>
            {`测得 pH ≈ ${Math.round(phValue)}`}
          </text>
        </g>
      )}
    </g>
  )
}
