import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface RotaryKilnEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度/长度（设计单位，默认 160） */
  width?: number
  /** 设备高度（设计单位，默认 80） */
  height?: number
  /** 运行状态：'idle' 待机 | 'running' 旋转热解中 */
  status?: 'idle' | 'running'
  /** 标注标题 */
  title?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * RotaryKilnEquipment — 回转窑组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 水泥工业、钛白粉生产、水泥窑协同处置、钛铁矿高温还原/分解
 * - 高考常见特征：微倾斜旋转长筒体，物料从高端加，逆流热气从低端进
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.roastingFurnace`
 * 倾角：-4° 倾斜下下沉
 *
 * @example
 * ```tsx
 * <RotaryKilnEquipment
 *   x={250} y={150} width={160} height={80}
 *   status="running" title="回转窑" font={font}
 * />
 * ```
 */
export function RotaryKilnEquipment({
  x,
  y,
  width = 160,
  height = 80,
  title = '回转窑',
  font = (n) => n,
}: RotaryKilnEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 50

  const kilnLen = w * 0.75
  const kilnRadius = h * 0.22
  const cx = w * 0.5
  const cy = h * 0.45

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 底部支撑滚轮 Base Supports */}
      <circle
        cx={cx - kilnLen * 0.3}
        cy={cy + kilnRadius + 10}
        r={Math.max(6, h * 0.1)}
        fill={SCENE_COLORS.materials.metalBorder}
      />
      <circle
        cx={cx + kilnLen * 0.3}
        cy={cy + kilnRadius + 10}
        r={Math.max(6, h * 0.1)}
        fill={SCENE_COLORS.materials.metalBorder}
      />

      {/* 倾斜筒身 group (倾角 -4°) */}
      <g transform={`rotate(-4, ${cx}, ${cy})`}>
        {/* 筒身主体 */}
        <rect
          x={cx - kilnLen * 0.5}
          y={cy - kilnRadius}
          width={kilnLen}
          height={kilnRadius * 2}
          rx={3}
          fill={SCENE_COLORS.industrialEquipment.roastingFurnace}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.objectLine}
        />

        {/* 筒身旋转大齿轮/轮带 (运行指示) */}
        {!isTiny && (
          <g>
            <rect
              x={cx - kilnLen * 0.1}
              y={cy - kilnRadius - 3}
              width={kilnLen * 0.2}
              height={kilnRadius * 2 + 6}
              rx={2}
              fill={SCENE_COLORS.materials.iron}
              stroke={SCENE_COLORS.materials.metalBorder}
              strokeWidth={STROKE.reference}
            />
          </g>
        )}

        {/* 左端进料罩 */}
        <path
          d={`
            M ${cx - kilnLen * 0.5 - 12} ${cy - kilnRadius - 8}
            L ${cx - kilnLen * 0.5} ${cy - kilnRadius}
            L ${cx - kilnLen * 0.5} ${cy + kilnRadius}
            L ${cx - kilnLen * 0.5 - 12} ${cy + kilnRadius + 8}
            Z
          `}
          fill={SCENE_COLORS.materials.metal}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.objectThin}
        />

        {/* 右端出料/热风罩 */}
        <path
          d={`
            M ${cx + kilnLen * 0.5 + 12} ${cy - kilnRadius - 8}
            L ${cx + kilnLen * 0.5} ${cy - kilnRadius}
            L ${cx + kilnLen * 0.5} ${cy + kilnRadius}
            L ${cx + kilnLen * 0.5 + 12} ${cy + kilnRadius + 8}
            Z
          `}
          fill={SCENE_COLORS.materials.metal}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.objectThin}
        />
      </g>

      {/* 标题 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={cy + 4}
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
