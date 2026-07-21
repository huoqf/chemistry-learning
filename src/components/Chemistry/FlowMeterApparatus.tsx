import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface FlowMeterApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 仪表类型：'pressure' 压强表 | 'flow' 流量计 */
  meterType?: 'pressure' | 'flow'
  /** 测量读数 */
  value?: number
  /** 单位标识 (如 "MPa" / "L/min") */
  unit?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * FlowMeterApparatus — 流量计与压强表组件
 *
 * 适用高中化学场景：
 * - 工业合成氨、化学平衡移动（压强与气体流量检测）
 */
export function FlowMeterApparatus({
  x,
  y,
  value = 20,
  unit = 'MPa',
  font = (n) => n,
}: FlowMeterApparatusProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 圆形仪表盘 */}
      <circle cx={25} cy={25} r={22} fill={SCENE_COLORS.materials.asbestos} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={STROKE.objectLine} />
      {/* 仪表刻度线 */}
      <path d="M 12 30 A 16 16 0 1 1 38 30" fill="none" stroke={SCENE_COLORS.materials.iron} strokeWidth={STROKE.reference} strokeDasharray="2 2" />
      {/* 指针 */}
      <line x1={25} y1={25} x2={34} y2={14} stroke={SCENE_COLORS.titrationAndMeasurement.volumetricFlaskMark} strokeWidth={STROKE.objectThin} strokeLinecap="round" />
      <circle cx={25} cy={25} r={2.5} fill={SCENE_COLORS.titrationAndMeasurement.volumetricFlaskMark} />
      {/* 读数与单位 */}
      <text x={25} y={38} textAnchor="middle" fontSize={font(FONT.annotation)} fill={SCENE_COLORS.labels.chemicalFormula} fontWeight="bold">
        {`${value}${unit}`}
      </text>
    </g>
  )
}
