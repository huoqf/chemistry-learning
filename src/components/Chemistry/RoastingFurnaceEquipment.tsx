import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface RoastingFurnaceEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度（设计单位，默认 120） */
  width?: number
  /** 设备高度（设计单位，默认 160） */
  height?: number
  /** 运行状态：'idle' 待机 | 'running' 运行 | 'heating' 高温焙烧中 */
  status?: 'idle' | 'running' | 'heating'
  /** 炉体标题名称 */
  title?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * RoastingFurnaceEquipment — 焙烧炉 / 煅烧炉组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 黄铁矿高温焙烧制 SO₂（4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂）
 * - 菱镁矿/石灰石煅烧分解（MgCO₃ → MgO + CO₂↑）
 * - 铝矾土焙烧脱水与烧结
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.roastingFurnace` (砖红色)
 *
 * @example
 * ```tsx
 * <RoastingFurnaceEquipment
 *   x={200} y={80} width={120} height={160}
 *   status="heating" title="焙烧炉" font={font}
 * />
 * ```
 */
export function RoastingFurnaceEquipment({
  x,
  y,
  width = 120,
  height = 160,
  status = 'heating',
  title = '焙烧炉',
  font = (n) => n,
}: RoastingFurnaceEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 45
  const isHeating = status === 'heating'

  const chimneyW = w * 0.22
  const chimneyH = h * 0.2
  const chimneyX = (w - chimneyW) / 2

  const furnaceY = chimneyH
  const furnaceH = h - chimneyH

  const chamberW = w * 0.75
  const chamberH = furnaceH * 0.55
  const chamberX = (w - chamberW) / 2
  const chamberY = furnaceY + furnaceH * 0.25

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 顶部烟囱 (排废气 SO₂ / CO₂ 等) */}
      <rect
        x={chimneyX}
        y={0}
        width={chimneyW}
        height={chimneyH}
        fill={SCENE_COLORS.materials.iron}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 炉体主框架（耐火砖红） */}
      <rect
        x={0}
        y={furnaceY}
        width={w}
        height={furnaceH}
        rx={6}
        fill={SCENE_COLORS.industrialEquipment.roastingFurnace}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 内部炉膛（高温燃烧室） */}
      <rect
        x={chamberX}
        y={chamberY}
        width={chamberW}
        height={chamberH}
        rx={4}
        fill={isHeating ? SCENE_COLORS.heatingAndSupport.flame : SCENE_COLORS.materials.iron}
        opacity={isHeating ? 0.9 : 0.8}
      />

      {/* 高温火焰效果 (若加热状态) */}
      {isHeating && !isTiny && (
        <path
          d={`
            M ${chamberX + 8} ${chamberY + chamberH}
            Q ${chamberX + chamberW * 0.25} ${chamberY + 5}, ${chamberX + chamberW * 0.5} ${chamberY + chamberH * 0.4}
            Q ${chamberX + chamberW * 0.75} ${chamberY + 5}, ${chamberX + chamberW - 8} ${chamberY + chamberH}
            Z
          `}
          fill={SCENE_COLORS.heatingAndSupport.flameCore}
          opacity={0.8}
        />
      )}

      {/* 进料/出料口指示纹路 */}
      {!isTiny && (
        <g stroke={SCENE_COLORS.materials.wood} strokeWidth={STROKE.reference} opacity={0.6}>
          <line x1={4} y1={furnaceY + 15} x2={16} y2={furnaceY + 15} />
          <line x1={w - 16} y1={furnaceY + furnaceH - 15} x2={w - 4} y2={furnaceY + furnaceH - 15} />
        </g>
      )}

      {/* 标注 */}
      {title && !isTiny && (
        <text
          x={w * 0.5}
          y={furnaceY + 20}
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
