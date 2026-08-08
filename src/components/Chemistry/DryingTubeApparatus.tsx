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
  /**
   * 支撑竖杆高度（px，默认 85）
   * 由布局引擎传入，确保竖杆能精确延伸到桌面而不悬空或出头
   */
  holderHeight?: number
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
  holderHeight,
  font = (n) => n,
}: DryingTubeApparatusProps) {
  const w = width
  const h = height
  const isTiny = w < 45
  // 球形干燥管支撑竖杆实际高度：优先使用 holderHeight prop，否则备用默认值
  const resolvedHolderH = holderHeight ?? (variant === 'spherical' ? 85 : 40)

  return (
    <g transform={`translate(${x}, ${y})`}>
      {variant === 'spherical' ? (
        /* 1. 球形干燥管 (横置: 遵循高考“大口进、小口出”原则，左大右小) */
        <g transform={`translate(0, ${h * 0.5})`}>
          {/* 左侧大口粗进气管 (大口进) */}
          <rect
            x={0}
            y={-8}
            width={w * 0.35}
            height={16}
            rx={2}
            fill={withAlpha(SCENE_COLORS.reactionAndGas.dryingTube, 0.4)}
            stroke={SCENE_COLORS.container.beakerBorder}
            strokeWidth={STROKE.objectLine}
          />
          {/* 中间膨大球/粗管 */}
          <circle
            cx={w * 0.55}
            cy={0}
            r={h * 0.4}
            fill={withAlpha(SCENE_COLORS.reactionAndGas.dryingTube, 0.4)}
            stroke={SCENE_COLORS.container.beakerBorder}
            strokeWidth={STROKE.objectLine}
          />
          {/* 内部固体干燥剂 */}
          <circle
            cx={w * 0.55}
            cy={0}
            r={h * 0.32}
            fill={desiccantColor}
            opacity={0.85}
          />
          {/* 右侧小口细出气管 (小口出) */}
          <rect
            x={w * 0.75}
            y={-4}
            width={w * 0.25}
            height={8}
            fill={withAlpha(SCENE_COLORS.reactionAndGas.dryingTube, 0.4)}
            stroke={SCENE_COLORS.container.beakerBorder}
            strokeWidth={STROKE.reference}
          />
          {/* 脱脂棉 (左右两侧塞脱脂棉防粉末被气体吹飞) */}
          <ellipse cx={w * 0.3} cy={0} rx={3} ry={6} fill={SCENE_COLORS.materials.asbestos} />
          <ellipse cx={w * 0.78} cy={0} rx={3} ry={3.5} fill={SCENE_COLORS.materials.asbestos} />
        </g>
      ) : (
        /* 2. U型管 (高保真标准高中化学画法：双壁玻璃管、双孔橡皮塞、脱脂棉与干燥颗粒) */
        <g id="u-shape-drying-tube">
          {/* 几何常量：左右管中心与外径 */}
          {(() => {
            const cx1 = w * 0.25
            const cx2 = w * 0.75
            const tubeR = 12 // 管半径 12px (外径 24px)
            const innerR = 9  // 内壁半径 9px (壁厚 3px)
            const bendCenterY = h - 22

            return (
              <g>
                {/* U 型管半透明玻璃壁内腔 */}
                <path
                  d={`
                    M ${cx1 - tubeR} 0
                    L ${cx1 - tubeR} ${bendCenterY}
                    A ${tubeR + 10} ${tubeR + 10} 0 0 0 ${cx2 + tubeR} ${bendCenterY}
                    L ${cx2 + tubeR} 0
                    L ${cx2 + innerR} 0
                    L ${cx2 + innerR} ${bendCenterY}
                    A ${innerR} ${innerR} 0 0 1 ${cx1 - innerR} ${bendCenterY}
                    L ${cx1 - innerR} 0
                    Z
                  `}
                  fill={withAlpha(SCENE_COLORS.container.gasJar, 0.45)}
                  stroke={SCENE_COLORS.container.beakerBorder}
                  strokeWidth={STROKE.reference}
                />

                {/* U型管下半部装填的固体干燥剂 */}
                <path
                  d={`
                    M ${cx1 - innerR + 1} ${h * 0.4}
                    L ${cx1 - innerR + 1} ${bendCenterY}
                    A ${innerR - 1} ${innerR - 1} 0 0 0 ${cx2 + innerR - 1} ${bendCenterY}
                    L ${cx2 + innerR - 1} ${h * 0.4}
                    Z
                  `}
                  fill={desiccantColor}
                  opacity={0.8}
                />

                {/* 固体干燥剂颗粒散落纹理 (如 CaCl₂ 粒) */}
                <circle cx={cx1 - 3} cy={h * 0.55} r={2} fill="#FFFFFF" opacity={0.6} />
                <circle cx={cx1 + 4} cy={h * 0.65} r={2.5} fill="#FFFFFF" opacity={0.5} />
                <circle cx={cx2 - 4} cy={h * 0.6} r={2} fill="#FFFFFF" opacity={0.6} />
                <circle cx={cx2 + 3} cy={h * 0.7} r={2.5} fill="#FFFFFF" opacity={0.5} />
                <circle cx={w * 0.5} cy={bendCenterY + 6} r={3} fill="#FFFFFF" opacity={0.5} />

                {/* 脱脂棉 (左右两管内固定固体防吹飞) */}
                <ellipse cx={cx1} cy={h * 0.38} rx={innerR - 1} ry={4} fill={SCENE_COLORS.materials.asbestos} />
                <ellipse cx={cx2} cy={h * 0.38} rx={innerR - 1} ry={4} fill={SCENE_COLORS.materials.asbestos} />

                {/* 左右管口单孔橡胶塞 */}
                <rect
                  x={cx1 - tubeR + 1}
                  y={-8}
                  width={tubeR * 2 - 2}
                  height={10}
                  fill={SCENE_COLORS.materials.rubber}
                  rx={1}
                />
                <rect
                  x={cx2 - tubeR + 1}
                  y={-8}
                  width={tubeR * 2 - 2}
                  height={10}
                  fill={SCENE_COLORS.materials.rubber}
                  rx={1}
                />

                {/* 左穿管 (玻璃外壁 6px / 高光 3px) */}
                <line
                  x1={cx1}
                  y1={-15}
                  x2={cx1}
                  y2={h * 0.32}
                  stroke={SCENE_COLORS.materials.glassBorder}
                  strokeWidth={6}
                  strokeLinecap="square"
                />
                <line
                  x1={cx1}
                  y1={-15}
                  x2={cx1}
                  y2={h * 0.32}
                  stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
                  strokeWidth={3}
                  strokeLinecap="square"
                />

                {/* 右穿管 (玻璃外壁 6px / 高光 3px) */}
                <line
                  x1={cx2}
                  y1={-15}
                  x2={cx2}
                  y2={h * 0.32}
                  stroke={SCENE_COLORS.materials.glassBorder}
                  strokeWidth={6}
                  strokeLinecap="square"
                />
                <line
                  x1={cx2}
                  y1={-15}
                  x2={cx2}
                  y2={h * 0.32}
                  stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
                  strokeWidth={3}
                  strokeLinecap="square"
                />
              </g>
            )
          })()}
        </g>
      )}

      {/* 干燥剂标注 */}
      {desiccantName && !isTiny && (
        <text
          x={w * 0.5}
          y={variant === 'spherical' ? h * 0.5 + 4 : h * 0.55}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {desiccantName}
        </text>
      )}

      {/* 干燥管物理托架支撑 (解决半空悬浮常识 Bug) */}
      <g id="drying-tube-holder">
        {/* 竖杆：从球形中心（或U型底部）延伸到桌面 */}
        <rect
          x={w * 0.5 - 2}
          y={variant === 'spherical' ? h * 0.5 + h * 0.4 : h - 10}
          width={4}
          height={resolvedHolderH}
          fill="#475569"
          rx={1}
        />
        {/* U形托架卸 */}
        <path
          d={`M ${w * 0.5 - 14} ${variant === 'spherical' ? h * 0.5 + 8 : h - 8} Q ${w * 0.5} ${variant === 'spherical' ? h * 0.5 + 20 : h + 4} ${w * 0.5 + 14} ${variant === 'spherical' ? h * 0.5 + 8 : h - 8}`}
          fill="none"
          stroke="#334155"
          strokeWidth={3}
        />
      </g>
    </g>
  )
}

export interface DryingTubePorts {
  inletPort: { x: number; y: number; direction?: 'left' | 'up' }
  outletPort: { x: number; y: number; direction?: 'right' | 'up' }
}

export function getDryingTubePorts(
  x: number,
  y: number,
  width: number = 110,
  height: number = 60,
  variant: 'spherical' | 'U-shape' = 'spherical'
): DryingTubePorts {
  if (variant === 'spherical') {
    return {
      inletPort: { x, y: y + height * 0.5, direction: 'left' },
      outletPort: { x: x + width, y: y + height * 0.5, direction: 'right' },
    }
  } else {
    return {
      inletPort: { x: x + width * 0.25, y: y - 15, direction: 'up' },
      outletPort: { x: x + width * 0.75, y: y - 15, direction: 'up' },
    }
  }
}

