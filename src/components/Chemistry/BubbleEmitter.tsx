import { SCENE_COLORS, STROKE } from '@/theme'

export interface BubbleEmitterProps {
  /** 发生源起点 x（设计坐标） */
  x: number
  /** 发生源起点 y（设计坐标） */
  y: number
  /** 气泡覆盖高度 */
  height?: number
  /** 气泡覆盖宽度 */
  width?: number
  /** 气泡颜色 */
  bubbleColor?: string
  /** 气泡数量 */
  count?: number
}

/**
 * BubbleEmitter — 气泡发生指示组件
 *
 * 适用高中化学场景：
 * - 锌粒+稀硫酸制氢、碳酸钙+盐酸、电解水阳极阴极冒气泡
 */
export function BubbleEmitter({
  x,
  y,
  height = 60,
  width = 30,
  bubbleColor = SCENE_COLORS.tube.glass,
  count = 6,
}: BubbleEmitterProps) {
  // 生成气泡相对坐标
  const bubbles = Array.from({ length: count }).map((_, i) => {
    const ratio = (i + 1) / (count + 1)
    const bx = (Math.sin(i * 1.5) * width) / 3
    const by = -height * ratio
    const r = 1.5 + (i % 3)
    return { bx, by, r }
  })

  return (
    <g transform={`translate(${x}, ${y})`}>
      {bubbles.map((b, idx) => (
        <circle
          key={idx}
          cx={b.bx}
          cy={b.by}
          r={b.r}
          fill={bubbleColor}
          stroke={SCENE_COLORS.industrialPipeline.liquidPipe}
          strokeWidth={STROKE.reference}
          opacity={0.8}
        />
      ))}
    </g>
  )
}
