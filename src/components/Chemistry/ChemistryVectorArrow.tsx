import type { Vector2 } from '../../chemistry/Vector2'
import { worldToDesign } from '../../scene/SceneScale'
import type { SceneScale } from '../../scene/SceneScale'
import type { VectorType } from '../../theme/chemistry/vectorStyle'
import { VectorArrow } from './VectorArrow'

/**
 * 化学矢量箭头组件
 *
 * 为需要物理正确标注的力、速度、反应速率等矢量设计。
 * 仅接受物理坐标 origin，内部自动转换为设计坐标后渲染。
 * 禁止视觉捷径：不接受 pixelLength，长度必须通过 sceneScale.refMagnitudes 归一化。
 */
interface ChemistryVectorArrowProps {
  /** 矢量起点（物理坐标，米，y↑正方向） */
  origin: Vector2
  /** 矢量值（物理坐标，y↑正方向） */
  vector: Vector2
  /** 矢量类型 */
  type: VectorType
  /** 场景缩放参数 */
  sceneScale: SceneScale
  /** 自定义颜色 */
  color?: string
  /** 自定义线宽 */
  strokeWidth?: number
  /** 自定义参考量级 */
  refMagnitude?: number
  /** 矢量标签 */
  label?: string
  /** 虚线箭头 */
  dashed?: boolean
  /** 发光阴影 */
  glow?: boolean
  /** 字体缩放函数 */
  font?: (base: number) => number
}

export function ChemistryVectorArrow({
  origin,
  vector,
  type,
  sceneScale,
  color,
  strokeWidth,
  refMagnitude,
  label,
  dashed,
  glow,
  font,
}: ChemistryVectorArrowProps) {
  const originDesign = worldToDesign(origin.x, origin.y, sceneScale)

  return (
    <VectorArrow
      originDesign={{ x: originDesign.px, y: originDesign.py }}
      vector={vector}
      type={type}
      sceneScale={sceneScale}
      color={color}
      strokeWidth={strokeWidth}
      refMagnitude={refMagnitude}
      label={label}
      dashed={dashed}
      glow={glow}
      font={font}
    />
  )
}
