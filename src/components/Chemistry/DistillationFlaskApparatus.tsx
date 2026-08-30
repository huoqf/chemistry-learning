import { SCENE_COLORS, withAlpha, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'

export interface DistillationFlaskApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 90） */
  width?: number
  /** 器材高度（设计单位，默认 140） */
  height?: number
  /** 内部液体填充比例 0~1（默认 0 空烧瓶） */
  fillLevel?: number
  /** 内部液体颜色 */
  fillColor?: string
  /** 是否带有橡皮塞/磨砂塞 */
  hasStopper?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
  /** 标签或容量提示文本 */
  label?: string
}

/**
 * DistillationFlaskApparatus — 具支蒸馏烧瓶组件
 *
 * 适用高中化学场景与高考考点：
 * - 液体蒸馏与石油分馏实验（高考必考：温度计水银球必须置于具支蒸馏烧瓶支管口处！）
 * - 蒸气侧管引出连接直形冷凝管
 *
 * 颜色：`SCENE_COLORS.separationAndPurification.distillationFlask`
 * 坐标：设计坐标，左上角 (x, y) 定位
 *
 * @example
 * ```tsx
 * <DistillationFlaskApparatus
 *   x={100} y={150} width={90} height={140}
 *   fillLevel={0.4} fillColor={SCENE_COLORS.reagent.solution}
 *   font={font}
 * />
 * ```
 */
export function DistillationFlaskApparatus({
  x,
  y,
  width = 90,
  height = 140,
  fillLevel = 0,
  fillColor = SCENE_COLORS.reagent.solution,
  hasStopper = true,
  font: _font = (n) => n,
  label: _label,
}: DistillationFlaskApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 40

  const neckW = w * 0.28
  const neckH = h * 0.4
  const neckLeft = (w - neckW) / 2
  const neckRight = neckLeft + neckW

  const bulbR = w * 0.42

  // 侧边支管口 (高度在细颈上部 30% 处，高频考点)
  const sideTubeY = neckH * 0.35
  const sideTubeW = w * 0.35
  const sideTubeH = 10

  // 烧瓶主体 SVG Path (结合颈部、侧支管与圆底球形)
  const bodyPath = `
    M ${neckLeft} 0
    L ${neckRight} 0
    L ${neckRight} ${sideTubeY}
    L ${neckRight + sideTubeW} ${sideTubeY + 4}
    L ${neckRight + sideTubeW} ${sideTubeY + sideTubeH + 4}
    L ${neckRight} ${sideTubeY + sideTubeH}
    L ${neckRight} ${neckH}
    A ${bulbR} ${bulbR} 0 1 1 ${neckLeft} ${neckH}
    Z
  `

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 玻璃主体背景 */}
      <path
        d={bodyPath}
        fill={withAlpha(SCENE_COLORS.separationAndPurification.distillationFlask, 0.35)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
        strokeLinejoin="round"
      />

      {/* 内部液体 (球体底部剪裁填充) */}
      {fillLevel > 0 && (
        <g clipPath={`url(#flask-clip-${x}-${y})`}>
          <rect
            x={0}
            y={h - (bulbR * 2 + 10) * fillLevel}
            width={w + sideTubeW}
            height={h}
            fill={fillColor}
            opacity={0.8}
          />
        </g>
      )}

      <defs>
        <clipPath id={`flask-clip-${x}-${y}`}>
          <path d={bodyPath} />
        </clipPath>
      </defs>

      {/* 玻璃高光反光弧线 */}
      {!isTiny && (
        <path
          d={`M ${w * 0.25} ${neckH + bulbR * 0.3} A ${bulbR * 0.8} ${bulbR * 0.8} 0 0 0 ${w * 0.25} ${neckH + bulbR * 1.5}`}
          fill="none"
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={STROKE.objectThin}
          opacity={0.6}
          strokeLinecap="round"
        />
      )}

      {/* 顶部橡皮塞/磨砂塞 */}
      {hasStopper && (
        <polygon
          points={`
            ${neckLeft - 2}, -10
            ${neckRight + 2}, -10
            ${neckRight}, 2
            ${neckLeft}, 2
          `}
          fill={SCENE_COLORS.materials.rubber}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.reference}
        />
      )}

      {/* 支管口极微引导标注线 */}
      {!isTiny && (
        <line
          x1={neckRight + sideTubeW - 2}
          y1={sideTubeY + sideTubeH / 2 + 4}
          x2={neckRight + sideTubeW + 6}
          y2={sideTubeY + sideTubeH / 2 + 4}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={STROKE.reference}
          strokeDasharray="2 2"
        />
      )}
    </g>
  )
}
