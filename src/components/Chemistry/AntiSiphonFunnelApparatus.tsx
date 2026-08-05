import { SCENE_COLORS, STROKE, FONT, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export interface AntiSiphonFunnelPorts {
  /** 倒置漏斗顶部连接导管口 */
  topConnectPort: { x: number; y: number }
  /** 倒置漏斗大口底部接触面 */
  bottomPort: { x: number; y: number }
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
    topConnectPort: { x: x + width * 0.5, y: y - 10 },
    bottomPort: { x: x + width * 0.5, y: y + height },
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
  /** 说明文字 */
  label?: string
  /** 字体缩放 */
  font?: FontScaler
}

/**
 * AntiSiphonFunnelApparatus — 高考防倒吸倒置漏斗吸收组件
 *
 * 适用于：
 * - 极易溶气体 (NH3, HCl 等) 的防倒吸尾气吸收
 * - 漏斗边缘刚好触及或微浸入液面，实现防倒吸缓冲原理
 * - 导出静态 `getAntiSiphonFunnelPorts`
 */
export function AntiSiphonFunnelApparatus({
  x,
  y,
  width = 80,
  height = 100,
  liquidLevel = 0.3,
  liquidColor = withAlpha(SCENE_COLORS.reagent.acid, 0.5),
  isAbsorbing = true,
  label = '倒置漏斗防倒吸',
  font = (n) => n,
}: AntiSiphonFunnelApparatusProps) {
  const w = width
  const h = height

  // 漏斗结构细分
  const stemW = 10
  const stemH = h * 0.35

  const stemLeft = (w - stemW) / 2

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 烧杯/吸收容器液面 */}
      <rect
        x={-15}
        y={h * (1 - liquidLevel)}
        width={w + 30}
        height={h * liquidLevel + 10}
        fill={liquidColor}
        opacity={0.7}
        rx={3}
      />

      {/* 2. 细玻璃柄 */}
      <rect
        x={stemLeft}
        y={0}
        width={stemW}
        height={stemH}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.5)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 3. 倒置漏斗主体 (大口朝下) */}
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

      {/* 4. 漏斗大口下边沿微接触液面 */}
      <line
        x1={0}
        y1={h}
        x2={w}
        y2={h}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 5. 吸收过程倒吸缓冲气泡与液面微升 */}
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
          {/* 微小吸收气泡 */}
          <circle cx={w * 0.3} cy={h - 10} r={3} fill="none" stroke="#38BDF8" strokeWidth={1} />
          <circle cx={w * 0.5} cy={h - 22} r={4} fill="none" stroke="#38BDF8" strokeWidth={1.2} />
          <circle cx={w * 0.7} cy={h - 12} r={2.5} fill="none" stroke="#38BDF8" strokeWidth={1} />
        </g>
      )}

      {/* 标注提示 */}
      {label && (
        <text
          x={w * 0.5}
          y={h + 20}
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
