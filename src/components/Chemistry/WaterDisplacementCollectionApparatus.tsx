import { SCENE_COLORS, STROKE, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'
import { GasJarApparatus } from './GasJarApparatus'
import { BubbleEmitter } from './BubbleEmitter'

export interface WaterDisplacementCollectionApparatusProps {
  /** 装置左上角 x */
  x: number
  /** 装置左上角 y */
  y: number
  /** 装置总宽度（默认 150） */
  width?: number
  /** 装置总高度（默认 150，含水槽+倒扣集气瓶） */
  height?: number
  /** 气体充盈颜色（收集的气体颜色） */
  gasColor?: string
  /** 气体充盈比例 0~1 */
  fillLevel?: number
  /** 是否有气体流动（控制气泡动画） */
  flowing?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * WaterDisplacementCollectionApparatus — 高考排水集气装置
 *
 * 化学规范：
 * - 水槽（大烧杯/槽）装水，导管从侧面弯入水槽底部，越过倒扣瓶口深入内部 5px 处
 * - 倒扣集气瓶：充满水后倒扣在水槽中，气体从底部进入置换水进行收集
 * - 单向封闭收集：无右侧导出管，符合物理闭合气室与高考手绘规范
 *
 * 用途：收集不溶于水且不与水反应的气体（O₂、H₂、NO、C₂H₄ 等）
 */
export function WaterDisplacementCollectionApparatus({
  x,
  y,
  width = 150,
  height = 150,
  gasColor = withAlpha(SCENE_COLORS.materials.glass, 0.15),
  fillLevel = 0.05,
  flowing = false,
  font: _font = (n) => n,
}: WaterDisplacementCollectionApparatusProps) {
  const w = width
  const h = height

  // 水槽：底部 80px 高
  const tankTopY = h - 80
  const tankH = 80

  // 倒扣集气瓶：宽 70，高 95，居中倒扣在水槽中
  const jarW = 70
  const jarH = 95
  const jarX = (w - jarW) / 2
  const jarY = tankTopY - jarH + 15 // 伸入水槽水面下约 15px

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 水槽 */}
      <rect
        x={0}
        y={tankTopY}
        width={w}
        height={tankH}
        rx={4}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.3)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 水槽内水体 */}
      <rect
        x={3}
        y={tankTopY + 10}
        width={w - 6}
        height={tankH - 12}
        fill={withAlpha(SCENE_COLORS.reagent.solution, 0.25)}
        rx={2}
      />

      {/* 倒扣集气瓶（inverted=true，充盈气体） */}
      <GasJarApparatus
        x={jarX}
        y={jarY}
        width={jarW}
        height={jarH}
        inverted={true}
        isGasCollection={true}
        fillLevel={fillLevel}
        fillColor={gasColor}
        font={_font}
      />

      {/* 进气弯管（左侧进入水槽，向右弯折，向上刚好越过倒扣集气瓶瓶口边缘伸入内部 5px 处） */}
      {/* 外壁 */}
      <path
        d={`M 25,10 L 25,${tankTopY + 20} L ${jarX + jarW * 0.5},${tankTopY + 20} L ${jarX + jarW * 0.5},${jarY + jarH - 5}`}
        fill="none"
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 内光 */}
      <path
        d={`M 25,10 L 25,${tankTopY + 20} L ${jarX + jarW * 0.5},${tankTopY + 20} L ${jarX + jarW * 0.5},${jarY + jarH - 5}`}
        fill="none"
        stroke={withAlpha(SCENE_COLORS.materials.glass, 0.85)}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 气泡（气体在倒扣瓶口内部向上冒出） */}
      {flowing && (
        <BubbleEmitter
          x={jarX + jarW * 0.5}
          y={jarY + jarH - 5}
          count={6}
        />
      )}

      {/* 水槽底部基准线（装置底边框强调） */}
      <line
        x1={0}
        y1={h}
        x2={w}
        y2={h}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.reference}
        opacity={0.4}
      />
    </g>
  )
}

