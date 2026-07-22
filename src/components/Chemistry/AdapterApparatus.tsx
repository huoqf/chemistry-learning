import { SCENE_COLORS, withAlpha, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface AdapterApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 50） */
  width?: number
  /** 器材高度（设计单位，默认 60） */
  height?: number
  /** 弯角倾斜度（默认 45°） */
  angle?: number
  /** 是否在出口处显示顺流滴出的液滴 */
  showDrop?: boolean
  /** 液滴颜色 */
  dropColor?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * AdapterApparatus — 蒸馏接液管/牛角管组件
 *
 * 适用高中化学场景：
 * - 蒸馏与分馏实验（牛角管连接冷凝管出口与接收锥形瓶，防止蒸气散逸与液体溅出）
 *
 * 颜色：`SCENE_COLORS.separationAndPurification.adapter`
 * 坐标：设计坐标，左上角 (x, y) 定位
 *
 * @example
 * ```tsx
 * <AdapterApparatus x={260} y={180} width={50} height={60} showDrop={true} font={font} />
 * ```
 */
export function AdapterApparatus({
  x,
  y,
  width = 50,
  height = 60,
  angle: _angle = 45,
  showDrop = false,
  dropColor = SCENE_COLORS.reagent.solution,
  font: _font = (n) => n,
}: AdapterApparatusProps) {
  const w = width
  const h = height
  const tubeW = Math.max(8, w * 0.25)

  // 弯角牛角管 Path: 上端较宽接冷凝管，中段斜向弯折，下端斜向嘴部
  const adapterPath = `
    M 0 0
    L ${tubeW * 1.4} 0
    L ${w} ${h - 10}
    L ${w - tubeW} ${h}
    L ${tubeW * 0.4} ${h * 0.4}
    L 0 ${tubeW}
    Z
  `

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 玻璃主体框 */}
      <path
        d={adapterPath}
        fill={withAlpha(SCENE_COLORS.separationAndPurification.adapter, 0.4)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
        strokeLinejoin="round"
      />

      {/* 玻璃高光反光 */}
      <path
        d={`M ${tubeW * 0.8} 4 L ${w - tubeW * 0.3} ${h - 12}`}
        fill="none"
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectThin}
        opacity={0.6}
        strokeLinecap="round"
      />

      {/* 出口下滴液滴 */}
      {showDrop && (
        <circle
          cx={w - tubeW * 0.5}
          cy={h + 6}
          r={3}
          fill={dropColor}
          opacity={0.9}
        />
      )}
    </g>
  )
}
