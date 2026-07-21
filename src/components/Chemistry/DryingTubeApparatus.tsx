import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface DryingTubeApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 110） */
  width?: number
  /** 器材高度（设计单位，默认 60） */
  height?: number
  /** 干燥管类型：'spherical' 球形干燥管 | 'U-shape' U型管 */
  variant?: 'spherical' | 'U-shape'
  /** 内部装填的干燥剂试剂名（如 "碱石灰" / "无水 CaCl₂"） */
  desiccantName?: string
  /** 干燥剂颜色 */
  desiccantColor?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * DryingTubeApparatus — 干燥管组件 (球形/U型管)
 *
 * 适用高中化学场景：
 * - 气体干燥与除杂 (碱石灰吸收 CO₂/H₂O；CaCl₂ 干燥)
 * - 防空气中水蒸气/CO₂ 进入发生装置
 *
 * 颜色：`SCENE_COLORS.reactionAndGas.dryingTube`
 */
export function DryingTubeApparatus({
  x,
  y,
  width = 110,
  height = 60,
  variant = 'spherical',
  desiccantName = '碱石灰',
  desiccantColor = SCENE_COLORS.reagent.precipitate,
  font = (n) => n,
}: DryingTubeApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 45

  return (
    <g transform={`translate(${x}, ${y})`}>
      {variant === 'spherical' ? (
        /* 1. 球形干燥管 (横置) */
        <g transform={`translate(0, ${h * 0.5})`}>
          {/* 左侧细进气管 */}
          <rect
            x={0}
            y={-4}
            width={w * 0.25}
            height={8}
            fill={withAlpha(SCENE_COLORS.reactionAndGas.dryingTube, 0.4)}
            stroke={SCENE_COLORS.container.beakerBorder}
            strokeWidth={STROKE.reference}
          />
          {/* 中间膨大球/粗管 */}
          <circle
            cx={w * 0.45}
            cy={0}
            r={h * 0.4}
            fill={withAlpha(SCENE_COLORS.reactionAndGas.dryingTube, 0.4)}
            stroke={SCENE_COLORS.container.beakerBorder}
            strokeWidth={STROKE.objectLine}
          />
          {/* 内部固体干燥剂 */}
          <circle
            cx={w * 0.45}
            cy={0}
            r={h * 0.32}
            fill={desiccantColor}
            opacity={0.85}
          />
          {/* 右侧粗出口管与脱脂棉塞 */}
          <rect
            x={w * 0.65}
            y={-8}
            width={w * 0.35}
            height={16}
            rx={2}
            fill={withAlpha(SCENE_COLORS.reactionAndGas.dryingTube, 0.4)}
            stroke={SCENE_COLORS.container.beakerBorder}
            strokeWidth={STROKE.objectLine}
          />
          {/* 脱脂棉 */}
          <ellipse cx={w * 0.68} cy={0} rx={3} ry={6} fill={SCENE_COLORS.materials.asbestos} />
        </g>
      ) : (
        /* 2. U型管 (竖置) */
        <g>
          <path
            d={`
              M ${w * 0.2} 0
              L ${w * 0.2} ${h - 20}
              A 20 20 0 0 0 ${w * 0.8} ${h - 20}
              L ${w * 0.8} 0
            `}
            fill="none"
            stroke={SCENE_COLORS.container.beakerBorder}
            strokeWidth={STROKE.objectLine * 3}
          />
          {/* U型管内部干燥剂 */}
          <path
            d={`
              M ${w * 0.2} ${h * 0.4}
              L ${w * 0.2} ${h - 20}
              A 20 20 0 0 0 ${w * 0.8} ${h - 20}
              L ${w * 0.8} ${h * 0.4}
            `}
            fill="none"
            stroke={desiccantColor}
            strokeWidth={STROKE.objectLine * 2}
          />
        </g>
      )}

      {/* 干燥剂标注 */}
      {desiccantName && !isTiny && (
        <text
          x={w * 0.45}
          y={variant === 'spherical' ? h * 0.5 + 4 : h * 0.5}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {desiccantName}
        </text>
      )}
    </g>
  )
}
