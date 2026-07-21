import { CHEMISTRY_COLORS } from '@/theme'
import type { FontScaler } from '@/theme'

export interface ElectrodeReactionBadgeProps {
  /** 面板中心基准点 x 坐标 */
  x: number
  /** 面板顶部基准点 y 坐标 */
  y: number
  /** 负极/阳极标题 */
  anodeTitle: string
  /** 负极/阳极反应式 */
  anodeEquation: string
  /** 负极/阳极变化 (如 "Δm = -0.65 g") */
  anodeDelta?: string
  /** 正极/阴极标题 */
  cathodeTitle: string
  /** 正极/阴极反应式 */
  cathodeEquation: string
  /** 正极/阴极变化 (如 "Δm = +0.64 g") */
  cathodeDelta?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * ElectrodeReactionBadge — 电极反应与质量/体积变化信息卡片
 *
 * 适用高考化学场景：
 * - 原电池/电解池底部两极反应式、电子转移与电极质量/气体变化直观标注
 *
 * 视觉特征：
 * - 左右双卡片结构，结合 `CHEMISTRY_COLORS.anode` 与 `CHEMISTRY_COLORS.cathode` 颜色对比高亮
 */
export function ElectrodeReactionBadge({
  x,
  y,
  anodeTitle,
  anodeEquation,
  anodeDelta,
  cathodeTitle,
  cathodeEquation,
  cathodeDelta,
  font = (n) => n,
}: ElectrodeReactionBadgeProps) {
  const cardW = 110
  const cardH = 56
  const gap = 10

  return (
    <g transform={`translate(${x}, ${y})`} className="electrode-reaction-badge">
      {/* ── 1. 负极 / 阳极卡片 (左) ── */}
      <g transform={`translate(${-cardW - gap / 2}, 0)`}>
        <rect
          x={0}
          y={0}
          width={cardW}
          height={cardH}
          rx={6}
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1}
        />
        {/* 左侧颜色指示条 */}
        <rect
          x={0}
          y={0}
          width={4}
          height={cardH}
          rx={2}
          fill={CHEMISTRY_COLORS.anode}
        />
        <text
          fontSize={font(10)}
          fill="#1E293B"
          fontWeight="bold"
          x={10}
          y={17}
        >
          {anodeTitle}
        </text>
        <text
          fontSize={font(9)}
          fill={CHEMISTRY_COLORS.anode}
          fontWeight="bold"
          x={10}
          y={33}
        >
          {anodeEquation}
        </text>
        {anodeDelta && (
          <text fontSize={font(9)} fill="#64748B" x={10} y={47}>
            {anodeDelta}
          </text>
        )}
      </g>

      {/* ── 2. 正极 / 阴极卡片 (右) ── */}
      <g transform={`translate(${gap / 2}, 0)`}>
        <rect
          x={0}
          y={0}
          width={cardW}
          height={cardH}
          rx={6}
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1}
        />
        {/* 右侧颜色指示条 */}
        <rect
          x={0}
          y={0}
          width={4}
          height={cardH}
          rx={2}
          fill={CHEMISTRY_COLORS.cathode}
        />
        <text
          fontSize={font(10)}
          fill="#1E293B"
          fontWeight="bold"
          x={10}
          y={17}
        >
          {cathodeTitle}
        </text>
        <text
          fontSize={font(9)}
          fill={CHEMISTRY_COLORS.cathode}
          fontWeight="bold"
          x={10}
          y={33}
        >
          {cathodeEquation}
        </text>
        {cathodeDelta && (
          <text fontSize={font(9)} fill="#64748B" x={10} y={47}>
            {cathodeDelta}
          </text>
        )}
      </g>
    </g>
  )
}
