import { SCENE_COLORS, STROKE, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export interface SafetyBottlePorts {
  /** 进气管顶端（左侧管，不伸入液面） */
  inletPort: { x: number; y: number; direction?: 'up' }
  /** 出气管顶端（右侧管，不伸入液面） */
  outletPort: { x: number; y: number; direction?: 'up' }
}

/**
 * 静态计算安全瓶关键连接锚点（Design Space）
 * 安全瓶 = 广口集气瓶形 + 双孔橡皮塞 + 两管均不伸入液面
 */
export function getSafetyBottlePorts(
  x: number,
  y: number,
  width = 80,
): SafetyBottlePorts {
  const lipW = width * 0.7
  const lipLeft = (width - lipW) / 2
  return {
    inletPort:  { x: x + lipLeft + lipW * 0.3, y: y - 14, direction: 'up' },
    outletPort: { x: x + lipLeft + lipW * 0.7, y: y - 14, direction: 'up' },
  }
}

export interface SafetyBottleApparatusProps {
  /** 器材左上角 x */
  x: number
  /** 器材左上角 y */
  y: number
  /** 器材宽度（默认 80） */
  width?: number
  /** 器材高度（默认 120） */
  height?: number
  /** 液体填充比例 0~1（默认 0，安全瓶通常为空瓶） */
  fillLevel?: number
  /** 液体颜色 */
  fillColor?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * SafetyBottleApparatus — 高考安全瓶（防倒吸缓冲瓶）
 *
 * 化学规范：
 * - 外观为广口集气瓶（方形底，矮胖形）
 * - 双孔橡皮塞，左短进气管 / 右短出气管，两管均**不伸入**液面
 * - 工作原理：液体倒吸时先进入空瓶缓冲，不直接到达发生装置
 *
 * 区别于倒置漏斗（AntiSiphonFunnelApparatus）：
 * - 漏斗大口接触液面；安全瓶两管口悬空，均不接触液面
 */
export function SafetyBottleApparatus({
  x,
  y,
  width = 80,
  height = 120,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  font: _font = (n) => n,
}: SafetyBottleApparatusProps) {
  const w = width
  const h = height

  const lipW = w * 0.7
  const lipLeft = (w - lipW) / 2

  const wallT = Math.max(2, w * 0.04)
  const innerW = w - wallT * 2
  const bodyTopY = 14

  const liquidH = (h - bodyTopY - wallT) * Math.min(1, Math.max(0, fillLevel))
  const tubeShortH = 8 // 两管均只伸入塞下 8px，不接触液面

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 瓶口唇边 */}
      <rect
        x={lipLeft}
        y={4}
        width={lipW}
        height={10}
        rx={2}
        fill={SCENE_COLORS.container.gasJar}
        stroke={SCENE_COLORS.container.gasJarBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 双孔橡皮塞 */}
      <rect
        x={lipLeft + 2}
        y={2}
        width={lipW - 4}
        height={12}
        fill={SCENE_COLORS.materials.rubber}
        rx={1}
      />

      {/* 瓶身（广口集气瓶形，偏矮胖） */}
      <rect
        x={0}
        y={bodyTopY}
        width={w}
        height={h - bodyTopY}
        rx={Math.max(2, w * 0.03)}
        fill={withAlpha(SCENE_COLORS.container.gasJar, 0.35)}
        stroke={SCENE_COLORS.container.gasJarBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 液体（如有） */}
      {fillLevel > 0 && (
        <rect
          x={wallT}
          y={h - wallT - liquidH}
          width={innerW}
          height={liquidH}
          fill={fillColor}
          opacity={0.7}
          rx={1}
        />
      )}

      {/* 左侧短进气管（不伸入液面） */}
      <line
        x1={lipLeft + lipW * 0.3}
        y1={-14}
        x2={lipLeft + lipW * 0.3}
        y2={bodyTopY + tubeShortH}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={6}
        strokeLinecap="square"
      />
      <line
        x1={lipLeft + lipW * 0.3}
        y1={-14}
        x2={lipLeft + lipW * 0.3}
        y2={bodyTopY + tubeShortH}
        stroke={withAlpha(SCENE_COLORS.materials.glass, 0.85)}
        strokeWidth={3}
        strokeLinecap="square"
      />

      {/* 右侧短出气管（不伸入液面） */}
      <line
        x1={lipLeft + lipW * 0.7}
        y1={-14}
        x2={lipLeft + lipW * 0.7}
        y2={bodyTopY + tubeShortH}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={6}
        strokeLinecap="square"
      />
      <line
        x1={lipLeft + lipW * 0.7}
        y1={-14}
        x2={lipLeft + lipW * 0.7}
        y2={bodyTopY + tubeShortH}
        stroke={withAlpha(SCENE_COLORS.materials.glass, 0.85)}
        strokeWidth={3}
        strokeLinecap="square"
      />

      {/* 侧壁反光高光 */}
      <line
        x1={wallT + 3}
        y1={bodyTopY + 6}
        x2={wallT + 3}
        y2={h - 10}
        stroke={withAlpha(SCENE_COLORS.materials.glass, 0.35)}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={w - wallT - 3}
        y1={bodyTopY + 6}
        x2={w - wallT - 3}
        y2={h - 10}
        stroke={withAlpha(SCENE_COLORS.materials.glass, 0.35)}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* 标识文字 */}
      <text
        x={w * 0.5}
        y={bodyTopY + (h - bodyTopY) * 0.5}
        textAnchor="middle"
        fontSize={10}
        fill={SCENE_COLORS.labels.stateSymbol}
        opacity={0.55}
      >
        安全瓶
      </text>
    </g>
  )
}
