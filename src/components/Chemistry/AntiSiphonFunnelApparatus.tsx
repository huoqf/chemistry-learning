import { SCENE_COLORS, STROKE, FONT, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export interface AntiSiphonFunnelPorts {
  /** 倒置漏斗顶部连接导管口 */
  topConnectPort: { x: number; y: number; direction?: 'up' }
  /** 倒置漏斗大口底部接触面 */
  bottomPort: { x: number; y: number; direction?: 'down' }
}

/**
 * 静态计算防倒吸倒置漏斗组件的关键连接锚点 (Design Space)
 */
export function getAntiSiphonFunnelPorts(
  x: number,
  y: number,
  width = 80,
  height = 100
): AntiSiphonFunnelPorts {
  return {
    topConnectPort: { x: x + width * 0.5, y, direction: 'up' },
    bottomPort: { x: x + width * 0.5, y: y + height, direction: 'down' },
  }
}

export interface AntiSiphonFunnelApparatusProps {
  /** 器材左上角 x */
  x: number
  /** 器材左上角 y */
  y: number
  /** 宽度 (漏斗下口宽度，默认 80) */
  width?: number
  /** 高度 (默认 100) */
  height?: number
  /** 吸收液填充高度比例 (默认 0.3) */
  liquidLevel?: number
  /** 吸收液颜色 */
  liquidColor?: string
  /** 气体吸收与气泡动态标志 */
  isAbsorbing?: boolean
  /** 倒置漏斗大口浸入/相切液面深度 (默认 2px) */
  touchDepth?: number
  /** 说明文字 */
  label?: string
  /** 字体缩放 */
  font?: FontScaler
}

/**
 * AntiSiphonFunnelApparatus — 高考防倒吸倒置漏斗吸收组件 (含吸收烧杯)
 *
 * 适用于：
 * - 极易溶气体 (NH3, HCl 等) 的防倒吸尾气吸收
 * - 包含完整外围玻璃烧杯轮廓与液面刻度
 * - 漏斗边缘刚好触及或微浸入液面 (相切/切入 1~4px)，水极易吸收 NH₃ 破除真空防倒吸
 * - 导出静态 `getAntiSiphonFunnelPorts`
 */
export function AntiSiphonFunnelApparatus({
  x,
  y,
  width = 80,
  height = 100,
  liquidLevel = 0.3,
  liquidColor = withAlpha(SCENE_COLORS.reagent.acid, 0.45),
  isAbsorbing = true,
  label,
  font = (n) => n,
}: AntiSiphonFunnelApparatusProps) {
  const w = width
  const h = height
  // 利用 liquidLevel 动态微调触及深度 (1~4px)
  const touchDepth = Math.max(1, Math.min(4, liquidLevel * 10))

  // 漏斗结构细分
  const stemW = 10
  const stemH = h * 0.35
  const stemLeft = (w - stemW) / 2

  // 吸收烧杯结构常量
  const beakerW = w + 30     // 110px
  const beakerH = 65         // 65px
  const beakerLeft = -15     // 烧杯左边缘
  const beakerTopY = h - 25  // 烧杯上沿：液面落于 y = h - touchDepth，与倒置漏斗下口精确相切

  return (
    <g transform={`translate(${x}, ${y})`} id="anti-siphon-funnel-group">
      {/* ── 1. 外围吸收烧杯玻璃主体 (杯口在 y = h - 25) ── */}
      <rect
        x={beakerLeft}
        y={beakerTopY}
        width={beakerW}
        height={beakerH}
        rx={4}
        fill={withAlpha(SCENE_COLORS.container.beaker, 0.3)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 烧杯嘴 Lip 倾倒口 */}
      <path
        d={`M ${beakerLeft - 3} ${beakerTopY} L ${beakerLeft} ${beakerTopY + 4}`}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 烧杯内吸收溶液 (液面恰好与倒置漏斗大口下沿 y=h 相切/微浸入 touchDepth) */}
      <rect
        x={beakerLeft + 2}
        y={h - touchDepth}
        width={beakerW - 4}
        height={beakerH - (h - touchDepth - beakerTopY) - 2}
        fill={liquidColor}
        opacity={0.8}
        rx={2}
      />

      {/* 烧杯刻度线 */}
      <line x1={beakerLeft + 6} y1={beakerTopY + 18} x2={beakerLeft + 14} y2={beakerTopY + 18} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={1} />
      <line x1={beakerLeft + 6} y1={beakerTopY + 30} x2={beakerLeft + 18} y2={beakerTopY + 30} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={1} />
      <line x1={beakerLeft + 6} y1={beakerTopY + 42} x2={beakerLeft + 14} y2={beakerTopY + 42} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={1} />

      {/* ── 2. 细玻璃柄 ── */}
      <rect
        x={stemLeft}
        y={0}
        width={stemW}
        height={stemH}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.5)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* ── 3. 倒置漏斗主体 (大口朝下) ── */}
      <polygon
        points={`
          ${stemLeft},${stemH}
          ${stemLeft + stemW},${stemH}
          ${w},${h}
          0,${h}
        `}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.4)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
        strokeLinejoin="round"
      />

      {/* 漏斗大口下边沿相切液面 */}
      <line
        x1={0}
        y1={h}
        x2={w}
        y2={h}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* ── 4. 吸收过程倒吸缓冲与液面上升/破除真空气泡 ── */}
      {isAbsorbing && (
        <g>
          {/* 漏斗内部上升缓冲液面 */}
          <polygon
            points={`
              ${stemLeft + 2},${stemH + 15}
              ${stemLeft + stemW - 2},${stemH + 15}
              ${w - 12},${h}
              12,${h}
            `}
            fill={liquidColor}
            opacity={0.4}
          />
          {/* 破除真空的吸收气泡 */}
          <circle cx={w * 0.3} cy={h - 10} r={3} fill="none" stroke="#38BDF8" strokeWidth={1} />
          <circle cx={w * 0.5} cy={h - 22} r={4} fill="none" stroke="#38BDF8" strokeWidth={1.2} />
          <circle cx={w * 0.7} cy={h - 12} r={2.5} fill="none" stroke="#38BDF8" strokeWidth={1} />
        </g>
      )}

      {/* 标注提示 */}
      {label && (
        <text
          x={w * 0.5}
          y={beakerTopY + beakerH + 16}
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
