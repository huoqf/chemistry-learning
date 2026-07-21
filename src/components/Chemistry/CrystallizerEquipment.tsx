import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface CrystallizerEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度（设计单位，默认 110） */
  width?: number
  /** 设备高度（设计单位，默认 130） */
  height?: number
  /** 运行状态：'idle' | 'running' */
  status?: 'idle' | 'running'
  /** 析出晶体颜色 */
  crystalColor?: string
  /** 设备名称 */
  title?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * CrystallizerEquipment — 结晶釜 / 重结晶槽组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 蒸发浓缩、冷却结晶、重结晶提纯（如 "蒸发浓缩至表面出现晶膜，冷却结晶，过滤洗涤"）
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.crystallizer` (青绿)
 *
 * @example
 * ```tsx
 * <CrystallizerEquipment x={100} y={100} title="结晶釜" font={font} />
 * ```
 */
export function CrystallizerEquipment({
  x,
  y,
  width = 110,
  height = 130,
  crystalColor = '#FFFFFF',
  title = '结晶釜',
  font = (n) => n,
}: CrystallizerEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const cx = w * 0.5

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 冷却水外夹套 */}
      <rect
        x={0}
        y={10}
        width={w}
        height={h - 10}
        rx={6}
        fill={SCENE_COLORS.industrialEquipment.crystallizer}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 内部结晶室与母液 */}
      <rect
        x={8}
        y={20}
        width={w - 16}
        height={h - 30}
        rx={4}
        fill={withAlpha(SCENE_COLORS.reagent.solution, 0.6)}
      />

      {/* 底部析出的晶体层 */}
      {!isTiny && (
        <g fill={crystalColor} opacity={0.9}>
          <circle cx={cx - 15} cy={h - 22} r={3} />
          <circle cx={cx} cy={h - 20} r={4} />
          <circle cx={cx + 15} cy={h - 24} r={3.5} />
        </g>
      )}

      {/* 设备标题 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={36}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill="white"
          fontWeight="bold"
        >
          {title}
        </text>
      )}
    </g>
  )
}
