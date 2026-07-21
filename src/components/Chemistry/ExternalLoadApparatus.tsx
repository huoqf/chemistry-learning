import { SCENE_COLORS, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export type LoadType = 'bulb' | 'ammeter' | 'motor' | 0 | 1 | 2

export interface ExternalLoadApparatusProps {
  /** 负载中心点 cx 坐标 */
  cx: number
  /** 负载中心点 cy 坐标 */
  cy: number
  /** 负载类型：0/bulb (灯泡), 1/ammeter (电流表), 2/motor (电动机) */
  loadType: LoadType
  /** 当前外电路电流 (A)，驱动偏转或旋转速度 */
  current?: number
  /** 动画时间 t，用于驱动电动机旋转 */
  time?: number
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * ExternalLoadApparatus — 外电路负载器材组件
 *
 * 适用高考化学场景：
 * - 原电池电路（检测电流输出、闭合回路）
 *
 * 功能特色：
 * - 支持 3 种常见高考物理/化学负载：小灯泡 (带发光光晕)、电流表 (带指针偏转)、电动机 (动态旋转)
 * - 结合 `CHEMISTRY_COLORS` 与 `withAlpha` 动效美化
 */
export function ExternalLoadApparatus({
  cx,
  cy,
  loadType,
  current = 1.0,
  time = 0,
  font = (n) => n,
}: ExternalLoadApparatusProps) {
  // 规范化 loadType
  const typeIndex = typeof loadType === 'number' ? loadType : loadType === 'bulb' ? 0 : loadType === 'ammeter' ? 1 : 2

  if (typeIndex === 0) {
    // 💡 小灯泡
    const glow = Math.min(1, 0.3 + current * 0.3)
    return (
      <g transform={`translate(${cx}, ${cy})`}>
        {/* 外发光光晕 */}
        <circle r={18} fill={withAlpha('#F59E0B', glow * 0.45)} />
        <circle r={12} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={2} fill="#FFFBEB" />
        {/* 灯丝 M 造型 */}
        <path d="M -5 -3 L 0 5 L 5 -3" stroke="#F59E0B" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <text
          y={25}
          fontSize={font(10)}
          fill={CHEMISTRY_COLORS.reactionRate}
          textAnchor="middle"
          fontWeight="bold"
        >
          {current > 0 ? '小灯泡 (发光)' : '小灯泡 (熄灭)'}
        </text>
      </g>
    )
  } else if (typeIndex === 1) {
    // ⚡ 电流表 / 检流计
    const angle = Math.min(48, Math.max(-48, current * 16))
    return (
      <g transform={`translate(${cx}, ${cy})`}>
        {/* 表盘底座 */}
        <circle r={15} fill="#F8FAFC" stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={2} />
        {/* A 刻度字符 */}
        <text y={-3} fontSize={font(9)} fill="#0F172A" textAnchor="middle" fontWeight="bold">
          A
        </text>
        {/* 红色偏转指针 */}
        <line
          x1={0}
          y1={7}
          x2={9 * Math.sin((angle * Math.PI) / 180)}
          y2={-7 * Math.cos((angle * Math.PI) / 180)}
          stroke="#EF4444"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text y={25} fontSize={font(10)} fill={CHEMISTRY_COLORS.current} textAnchor="middle" fontWeight="bold">
          {`${current.toFixed(1)} A`}
        </text>
      </g>
    )
  } else {
    // ⚙️ 微型电动机
    const rot = (time * 360 * Math.max(0.2, current)) % 360
    return (
      <g transform={`translate(${cx}, ${cy})`}>
        <circle r={15} fill="#F1F5F9" stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={2} />
        {/* 旋转风扇扇叶 */}
        <g transform={`rotate(${rot})`}>
          <line x1={-9} y1={0} x2={9} y2={0} stroke="#3B82F6" strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={-9} x2={0} y2={9} stroke="#3B82F6" strokeWidth={3} strokeLinecap="round" />
        </g>
        <text y={25} fontSize={font(10)} fill="#2563EB" textAnchor="middle" fontWeight="bold">
          M (旋转)
        </text>
      </g>
    )
  }
}
