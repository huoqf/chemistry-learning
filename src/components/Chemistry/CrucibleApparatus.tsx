import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface CruciblePorts {
  /** 坩埚开口顶部中心 */
  topPort: { x: number; y: number }
  /** 坩埚底部中心 (接触泥三角) */
  bottomPort: { x: number; y: number }
}

/**
 * 静态计算瓷坩埚组件的关键连接锚点 (Design Space)
 */
export function getCruciblePorts(
  x: number,
  y: number,
  width = 60,
  height = 50
): CruciblePorts {
  return {
    topPort: { x: x + width * 0.5, y: y },
    bottomPort: { x: x + width * 0.5, y: y + height },
  }
}

export interface CrucibleApparatusProps {
  /** 器材左上角 x */
  x: number
  /** 器材左上角 y */
  y: number
  /** 宽度 (默认 60) */
  width?: number
  /** 高度 (默认 50) */
  height?: number
  /** 坩埚内固体/熔融物颜色 */
  sampleColor?: string
  /** 是否处于高温红热状态 (如 800℃+ 强热煅烧) */
  isGlowing?: boolean
  /** 是否加盖 */
  hasLid?: boolean
  /** 说明文字 */
  label?: string
  /** 字体缩放 */
  font?: FontScaler
}

/**
 * CrucibleApparatus — 高考瓷坩埚与熔融煅烧组件
 *
 * 适用于：
 * - 固体高温煅烧 (石灰石分解)、熔融固体 (如熔融 NaOH / Na2CO3)
 * - 结合 ClayTriangleApparatus (泥三角) 与三脚架使用
 * - 导出静态 `getCruciblePorts`
 */
export function CrucibleApparatus({
  x,
  y,
  width = 60,
  height = 50,
  sampleColor = SCENE_COLORS.reagent.salt,
  isGlowing = false,
  hasLid = false,
  label,
  font = (n) => n,
}: CrucibleApparatusProps) {
  const w = width
  const h = height

  // 瓷质颜色
  const porcelainColor = isGlowing
    ? SCENE_COLORS.porcelain.incandescentGlow
    : SCENE_COLORS.porcelain.porcelainWhite

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 高温灼热发光光晕 */}
      {isGlowing && (
        <ellipse
          cx={w * 0.5}
          cy={h * 0.5}
          rx={w * 0.75}
          ry={h * 0.75}
          fill={SCENE_COLORS.porcelain.incandescentGlow}
          opacity={0.3}
          filter="blur(4px)"
        />
      )}

      {/* 1. 坩埚主体外壳 (上大下小瓷台形) */}
      <path
        d={`
          M 4 8
          Q ${w * 0.5} 14, ${w - 4} 8
          L ${w * 0.78} ${h - 4}
          Q ${w * 0.5} ${h + 2}, ${w * 0.22} ${h - 4}
          Z
        `}
        fill={porcelainColor}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 2. 内部样品 / 熔融物 */}
      <ellipse
        cx={w * 0.5}
        cy={h * 0.6}
        rx={w * 0.28}
        ry={h * 0.18}
        fill={sampleColor}
      />

      {/* 3. 坩埚上沿边缘厚度 */ }
      <ellipse
        cx={w * 0.5}
        cy={8}
        rx={w * 0.48}
        ry={6}
        fill="none"
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 4. 坩埚盖子 (可选) */}
      {hasLid && (
        <g transform={`translate(0, -6)`}>
          <path
            d={`
              M 0 10
              Q ${w * 0.5} -2, ${w} 10
              Z
            `}
            fill={porcelainColor}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.objectLine}
          />
          {/* 盖纽 */}
          <circle
            cx={w * 0.5}
            cy={2}
            r={4}
            fill={SCENE_COLORS.materials.metalBorder}
          />
        </g>
      )}

      {/* 标注提示 */}
      {label && (
        <text
          x={w * 0.5}
          y={h + 16}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  )
}
