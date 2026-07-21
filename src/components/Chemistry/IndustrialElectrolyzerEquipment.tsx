import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface IndustrialElectrolyzerEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度（设计单位，默认 140） */
  width?: number
  /** 设备高度（设计单位，默认 150） */
  height?: number
  /** 运行状态：'idle' | 'running' */
  status?: 'idle' | 'running'
  /** 离子膜类型 ('阳离子交换膜') */
  membraneLabel?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * IndustrialElectrolyzerEquipment — 工业离子膜电解槽组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 氯碱工业（立式阳离子交换膜电解槽：阳极精制食盐水产生 Cl₂，阴极产生 H₂ 与浓 NaOH）
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.electrolyticCell`
 */
export function IndustrialElectrolyzerEquipment({
  x,
  y,
  width = 140,
  height = 150,
  font = (n) => n,
}: IndustrialElectrolyzerEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 50

  const cx = w * 0.5

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 槽体外壳 */}
      <rect
        x={0}
        y={20}
        width={w}
        height={h - 20}
        rx={6}
        fill={SCENE_COLORS.industrialEquipment.electrolyticCell}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 阳极室与阴极室区域 */}
      <rect x={4} y={24} width={cx - 6} height={h - 28} fill={withAlpha(SCENE_COLORS.reagent.acid, 0.4)} rx={2} />
      <rect x={cx + 2} y={24} width={cx - 6} height={h - 28} fill={withAlpha(SCENE_COLORS.reagent.base, 0.4)} rx={2} />

      {/* 中央立式离子交换膜 */}
      <line x1={cx} y1={24} x2={cx} y2={h - 4} stroke={SCENE_COLORS.industrialEquipment.absorptionTower} strokeWidth={STROKE.objectLine * 1.5} strokeDasharray="4 2" />

      {/* 顶部 Cl₂ / H₂ 气体排出口 */}
      {!isTiny && (
        <g stroke={SCENE_COLORS.industrialPipeline.gasPipe} strokeWidth={STROKE.objectThin}>
          <line x1={w * 0.25} y1={0} x2={w * 0.25} y2={20} />
          <line x1={w * 0.75} y1={0} x2={w * 0.75} y2={20} />
        </g>
      )}

      {/* 气体标注 */}
      {!isTiny && (
        <g fontSize={font(FONT.annotation)} fill="white" fontWeight="bold">
          <text x={w * 0.25} y={15} textAnchor="middle">Cl₂↑</text>
          <text x={w * 0.75} y={15} textAnchor="middle">H₂↑</text>
        </g>
      )}
    </g>
  )
}
