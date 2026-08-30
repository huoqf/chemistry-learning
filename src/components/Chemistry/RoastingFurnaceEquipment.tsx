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
    <g transform={`translate(${x}, ${y})`} id="roasting-furnace">
      {/* 1. 顶部排废气烟囱 (SO₂ / CO₂) 带加固法兰圈 */}
      <rect
        x={chimneyX}
        y={0}
        width={chimneyW}
        height={chimneyH}
        fill={SCENE_COLORS.materials.iron}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 烟囱顶部防雨帽法兰 */}
      <rect
        x={chimneyX - 3}
        y={0}
        width={chimneyW + 6}
        height={4}
        rx={1}
        fill={SCENE_COLORS.materials.metalBorder}
      />

      {/* 2. 炉体主框架（耐火砖红） */}
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

      {/* 耐火砖接缝纹理 (Brick lines) */}
      {!isTiny && (
        <g stroke={SCENE_COLORS.materials.wood} strokeWidth={0.8} opacity={0.4}>
          <line x1={4} y1={furnaceY + furnaceH * 0.2} x2={w - 4} y2={furnaceY + furnaceH * 0.2} />
          <line x1={4} y1={furnaceY + furnaceH * 0.4} x2={w - 4} y2={furnaceY + furnaceH * 0.4} />
          <line x1={4} y1={furnaceY + furnaceH * 0.6} x2={w - 4} y2={furnaceY + furnaceH * 0.6} />
          <line x1={4} y1={furnaceY + furnaceH * 0.8} x2={w - 4} y2={furnaceY + furnaceH * 0.8} />
        </g>
      )}

      {/* 3. 内部炉膛（高温燃烧室） */}
      <rect
        x={chamberX}
        y={chamberY}
        width={chamberW}
        height={chamberH}
        rx={4}
        fill={isHeating ? SCENE_COLORS.heatingAndSupport.flame : SCENE_COLORS.materials.iron}
        opacity={isHeating ? 0.92 : 0.8}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={1}
      />

      {/* 4. 高温火焰与流化态沸腾效果 */}
      {isHeating && !isTiny && (
        <g>
          <path
            d={`
              M ${chamberX + 8} ${chamberY + chamberH}
              Q ${chamberX + chamberW * 0.25} ${chamberY + 5}, ${chamberX + chamberW * 0.5} ${chamberY + chamberH * 0.35}
              Q ${chamberX + chamberW * 0.75} ${chamberY + 5}, ${chamberX + chamberW - 8} ${chamberY + chamberH}
              Z
            `}
            fill={SCENE_COLORS.heatingAndSupport.flameCore}
            opacity={0.88}
          />
          {/* 炽热矿粉沸腾颗粒 */}
          <circle cx={chamberX + chamberW * 0.3} cy={chamberY + chamberH * 0.6} r={2} fill={SCENE_COLORS.reagentCharacteristic.kmno4} opacity={0.8} />
          <circle cx={chamberX + chamberW * 0.7} cy={chamberY + chamberH * 0.5} r={2.5} fill={SCENE_COLORS.reagentCharacteristic.kmno4} opacity={0.8} />
          <circle cx={chamberX + chamberW * 0.5} cy={chamberY + chamberH * 0.7} r={2} fill={SCENE_COLORS.reagentCharacteristic.kmno4} opacity={0.8} />
        </g>
      )}

      {/* 5. 进出料口法兰漏斗 */}
      {!isTiny && (
        <g id="in-out-ports">
          {/* 左侧进料口漏斗 */}
          <polygon
            points={`-6,${furnaceY + 12} 0,${furnaceY + 16} 0,${furnaceY + 28} -6,${furnaceY + 32}`}
            fill={SCENE_COLORS.materials.iron}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={1}
          />
          {/* 右下出渣口 */}
          <polygon
            points={`${w},${furnaceY + furnaceH - 28} ${w + 6},${furnaceY + furnaceH - 24} ${w + 6},${furnaceY + furnaceH - 12} ${w},${furnaceY + furnaceH - 16}`}
            fill={SCENE_COLORS.materials.iron}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={1}
          />
        </g>
      )}

      {/* 6. 观察视镜 (Sight Glass) */}
      {!isTiny && (
        <circle
          cx={w * 0.5}
          cy={chamberY + chamberH + 12}
          r={5}
          fill={SCENE_COLORS.materials.glass}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={1.5}
        />
      )}

      {/* 7. 标注 */}
      {title && !isTiny && (
        <text
          x={w * 0.5}
          y={furnaceY + 18}
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
