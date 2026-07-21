import { SCENE_COLORS, CHEMISTRY_COLORS } from '@/theme'

export interface ElectronFlowPathProps {
  /** 外电路导线 SVG Path 描述字符串 (如 "M 90 140 L 90 60 L 330 60 L 330 140") */
  pathD: string
  /** 当前外电路电流 (A)，自动调节电子流动周期速度 */
  current?: number
  /** 导线线上电子圆点数量，默认 6 */
  electronCount?: number
  /** 导线描边颜色，默认使用金属线色 */
  wireColor?: string
  /** 导线线宽，默认 2.5 */
  wireWidth?: number
}

/**
 * ElectronFlowPath — 外电路导线与电子定向流动动画组件
 *
 * 适用高考化学场景：
 * - 原电池外电路电子由负极流向正极
 * - 电解池外电路电子由电源负极流向阴极、阳极流向电源正极
 *
 * 视觉特征：
 * - 结合 SVG `<animateMotion>`，沿着导线路径连续分布并平滑流动
 * - 青色 `e⁻` 电子与高对比度白色边框
 */
export function ElectronFlowPath({
  pathD,
  current = 1.0,
  electronCount = 6,
  wireColor = SCENE_COLORS.materials.metalBorder,
  wireWidth = 2.5,
}: ElectronFlowPathProps) {
  // 电流越大，流动周期越短（速度越快）
  const dur = Math.max(0.4, 2.5 / (current || 1))

  return (
    <g className="electron-flow-path">
      {/* 1. 外电路金属导线 */}
      <path
        d={pathD}
        fill="none"
        stroke={wireColor}
        strokeWidth={wireWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. 沿导线路径移动的 e⁻ 电子粒点 */}
      {Array.from({ length: electronCount }).map((_, i) => (
        <circle
          key={i}
          r={3.5}
          fill={CHEMISTRY_COLORS.electron}
          stroke="#FFFFFF"
          strokeWidth={1}
          opacity={0.95}
        >
          <animateMotion
            path={pathD}
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`-${(i / electronCount) * dur}s`}
          />
        </circle>
      ))}
    </g>
  )
}
