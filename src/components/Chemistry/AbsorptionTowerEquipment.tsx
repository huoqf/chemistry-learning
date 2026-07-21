import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface AbsorptionTowerEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度（设计单位，默认 80） */
  width?: number
  /** 设备高度（设计单位，默认 200） */
  height?: number
  /** 运行状态：'idle' | 'running' 吸收运行中 */
  status?: 'idle' | 'running'
  /** 塔体标题，如 "吸收塔" / "尾气处理塔" */
  title?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * AbsorptionTowerEquipment — 吸收塔 / 洗涤塔组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 尾气吸收与净化（例如：NaOH 溶液吸收 Cl₂/SO₂，水吸收 NH₃/HCl）
 * - 高考经典机理：气液逆流接触（废气由底部进入向上，吸收液由顶部喷淋向下，增大接触面积）
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.absorptionTower` (水洗蓝)
 *
 * @example
 * ```tsx
 * <AbsorptionTowerEquipment
 *   x={300} y={50} width={80} height={200}
 *   status="running" title="吸收塔" font={font}
 * />
 * ```
 */
export function AbsorptionTowerEquipment({
  x,
  y,
  width = 80,
  height = 200,
  status = 'running',
  title = '吸收塔',
  font = (n) => n,
}: AbsorptionTowerEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 35
  const isRunning = status === 'running'

  const headH = h * 0.08
  const towerH = h - headH * 2
  const cx = w * 0.5

  // 填料层位置 (中间区域)
  const packingY = headH + towerH * 0.3
  const packingH = towerH * 0.4

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 顶部椭圆封头 */}
      <path
        d={`
          M 0 ${headH}
          Q ${cx} 0 ${w} ${headH}
          Z
        `}
        fill={SCENE_COLORS.industrialEquipment.absorptionTower}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 竖立圆筒塔身 */}
      <rect
        x={0}
        y={headH}
        width={w}
        height={towerH}
        fill={withAlpha(SCENE_COLORS.industrialEquipment.absorptionTower, 0.85)}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 底部椭圆封头 */}
      <path
        d={`
          M 0 ${h - headH}
          Q ${cx} ${h} ${w} ${h - headH}
          Z
        `}
        fill={SCENE_COLORS.industrialEquipment.absorptionTower}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 内部填料网格层 Packing Layer */}
      {!isTiny && (
        <g opacity={0.6}>
          <rect
            x={2}
            y={packingY}
            width={w - 4}
            height={packingH}
            fill={withAlpha(SCENE_COLORS.materials.asbestos, 0.3)}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.reference}
            strokeDasharray="4 2"
          />
        </g>
      )}

      {/* 顶部喷淋管装置 */}
      {!isTiny && (
        <g opacity={0.8}>
          <line
            x1={cx - w * 0.3}
            y1={headH + 15}
            x2={cx + w * 0.3}
            y2={headH + 15}
            stroke={SCENE_COLORS.industrialPipeline.liquidPipe}
            strokeWidth={STROKE.objectThin}
          />
          {/* 喷淋液滴指示 */}
          {isRunning && (
            <g opacity={0.7} fill={SCENE_COLORS.industrialPipeline.liquidPipe}>
              <circle cx={cx - w * 0.2} cy={headH + 24} r={1.5} />
              <circle cx={cx} cy={headH + 22} r={1.5} />
              <circle cx={cx + w * 0.2} cy={headH + 25} r={1.5} />
            </g>
          )}
        </g>
      )}

      {/* 底部气流指示箭头 */}
      {!isTiny && (
        <path
          d={`
            M ${cx} ${h - headH - 10}
            L ${cx} ${h - headH - 25}
            M ${cx - 4} ${h - headH - 19}
            L ${cx} ${h - headH - 25}
            L ${cx + 4} ${h - headH - 19}
          `}
          stroke={SCENE_COLORS.industrialPipeline.gasPipe}
          strokeWidth={STROKE.objectThin}
          fill="none"
        />
      )}

      {/* 设备标题 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={headH + towerH * 0.2}
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
