import { SCENE_COLORS, withAlpha, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface AlcoholLampApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 70） */
  width?: number
  /** 器材高度（设计单位，默认 80） */
  height?: number
  /** 是否点燃（默认 false） */
  lit?: boolean
  /** 是否盖上灯帽（盖上时自动熄灭） */
  capped?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * AlcoholLampApparatus — 酒精灯组件
 *
 * 适用高中化学场景与高考考点：
 * - 各种加热实验（考点：必须用外焰加热，熄灭用灯帽盖灭，绝对禁止用嘴吹）
 *
 * 颜色：`SCENE_COLORS.heatingAndSupport.alcoholLamp` / `flame`
 */
export function AlcoholLampApparatus({
  x,
  y,
  width = 70,
  height = 80,
  lit = false,
  capped = false,
}: AlcoholLampApparatusProps) {
  const w = width
  const h = height

  const isBurning = lit && !capped

  const baseH = h * 0.55
  const baseTopY = h - baseH
  const baseR = w * 0.45

  const neckW = w * 0.28
  const neckLeft = (w - neckW) / 2
  const neckH = h * 0.2

  const flameH = h * 0.38

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 三层火焰 (外焰、内焰、焰心) */}
      {isBurning && (
        <g transform={`translate(${w * 0.5}, 0)`}>
          {/* 外焰 (最高温，橙黄渐变) */}
          <path
            d={`
              M 0 -${flameH}
              C ${flameH * 0.6} -${flameH * 0.5}, ${flameH * 0.5} 0, 0 0
              C -${flameH * 0.5} 0, -${flameH * 0.6} -${flameH * 0.5}, 0 -${flameH}
              Z
            `}
            fill={SCENE_COLORS.heatingAndSupport.flame}
            opacity={0.9}
          />
          {/* 内焰 */}
          <path
            d={`
              M 0 -${flameH * 0.65}
              C ${flameH * 0.35} -${flameH * 0.35}, ${flameH * 0.3} 0, 0 0
              C -${flameH * 0.3} 0, -${flameH * 0.35} -${flameH * 0.35}, 0 -${flameH * 0.65}
              Z
            `}
            fill={SCENE_COLORS.heatingAndSupport.flameCore}
            opacity={0.85}
          />
          {/* 焰心 (最内侧高亮) */}
          <ellipse
            cx={0}
            cy={-(flameH * 0.2)}
            rx={flameH * 0.12}
            ry={flameH * 0.2}
            fill={SCENE_COLORS.materials.glass}
            opacity={0.95}
          />
        </g>
      )}

      {/* 2. 灯芯瓷套管与灯芯 */}
      {!capped && (
        <g>
          {/* 瓷套管 */}
          <rect
            x={neckLeft - 2}
            y={baseTopY - neckH}
            width={neckW + 4}
            height={neckH}
            rx={1}
            fill={SCENE_COLORS.materials.ceramic}
            stroke={SCENE_COLORS.materials.wood}
            strokeWidth={STROKE.reference}
          />
          {/* 灯芯 */}
          <line
            x1={w * 0.5}
            y1={baseTopY - neckH}
            x2={w * 0.5}
            y2={baseTopY - neckH - 6}
            stroke={SCENE_COLORS.materials.rubber}
            strokeWidth={STROKE.objectLine}
          />
        </g>
      )}

      {/* 3. 灯帽 (如果盖上) */}
      {capped && (
        <path
          d={`
            M ${neckLeft - 3} ${baseTopY}
            L ${neckLeft} ${baseTopY - neckH - 12}
            Q ${w * 0.5} ${baseTopY - neckH - 18} ${w - neckLeft} ${baseTopY - neckH - 12}
            L ${w - neckLeft + 3} ${baseTopY}
            Z
          `}
          fill={SCENE_COLORS.materials.glass}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={STROKE.objectThin}
        />
      )}

      {/* 4. 玻璃灯座背景 */}
      <path
        d={`
          M ${neckLeft} ${baseTopY}
          C ${w * 0.1} ${baseTopY}, 0 ${h - baseH * 0.5}, 0 ${h - 4}
          Q 0 ${h} 4 ${h}
          L ${w - 4} ${h}
          Q ${w} ${h} ${w} ${h - 4}
          C ${w} ${h - baseH * 0.5}, ${w * 0.9} ${baseTopY}, ${w - neckLeft} ${baseTopY}
          Z
        `}
        fill={withAlpha(SCENE_COLORS.container.beaker, 0.5)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 内部酒精填充 */}
      <ellipse
        cx={w * 0.5}
        cy={h - baseH * 0.4}
        rx={baseR * 0.8}
        ry={baseH * 0.3}
        fill={SCENE_COLORS.heatingAndSupport.alcoholLamp}
        opacity={0.35}
      />
    </g>
  )
}
