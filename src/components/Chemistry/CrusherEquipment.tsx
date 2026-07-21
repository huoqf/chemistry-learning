import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface CrusherEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度（设计单位，默认 100） */
  width?: number
  /** 设备高度（设计单位，默认 90） */
  height?: number
  /** 运行状态：'idle' 待机 | 'running' 运行中（粉碎/研磨中） */
  status?: 'idle' | 'running'
  /** 设备的具体名称，如 "粉碎机" / "球磨机" */
  title?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * CrusherEquipment — 粉碎机 / 球磨机组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 矿石原料预处理阶段（例如："将铝矾土/锂辉石/硫铁矿粉碎，增大接触面积，提高浸出率/焙烧速率"）
 *
 * 颜色：`SCENE_COLORS.materials.metal`
 * 动画：status='running' 时内部齿轮与锤头旋转
 *
 * @example
 * ```tsx
 * <CrusherEquipment
 *   x={100} y={100} width={100} height={90}
 *   status="running" title="粉碎机" font={font}
 * />
 * ```
 */
export function CrusherEquipment({
  x,
  y,
  width = 100,
  height = 90,
  status = 'idle',
  title = '粉碎机',
  font = (n) => n,
}: CrusherEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 40
  const isRunning = status === 'running'

  const topW = w * 0.9
  const botW = w * 0.6
  const funnelH = h * 0.25
  const bodyH = h * 0.6

  const cx = w * 0.5
  const cy = funnelH + bodyH * 0.5

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 顶部进料漏斗 */}
      <polygon
        points={`
          ${(w - topW) / 2}, 0
          ${(w + topW) / 2}, 0
          ${(w + botW) / 2}, ${funnelH}
          ${(w - botW) / 2}, ${funnelH}
        `}
        fill={SCENE_COLORS.materials.iron}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 粉碎机主体（倒梯形/矩形） */}
      <polygon
        points={`
          ${(w - botW) / 2}, ${funnelH}
          ${(w + botW) / 2}, ${funnelH}
          ${(w + botW * 0.8) / 2}, ${funnelH + bodyH}
          ${(w - botW * 0.8) / 2}, ${funnelH + bodyH}
        `}
        fill={SCENE_COLORS.materials.metal}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 内部旋转锤头/齿轮（运行状态） */}
      {!isTiny && (
        <g
          transform={`translate(${cx}, ${cy})`}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: isRunning ? 'spin 3s linear infinite' : 'none',
          }}
        >
          {/* 交叉锤头 */}
          <rect
            x={-w * 0.18}
            y={-w * 0.04}
            width={w * 0.36}
            height={w * 0.08}
            rx={2}
            fill={SCENE_COLORS.materials.iron}
          />
          <rect
            x={-w * 0.04}
            y={-w * 0.18}
            width={w * 0.08}
            height={w * 0.36}
            rx={2}
            fill={SCENE_COLORS.materials.iron}
          />
          <circle cx={0} cy={0} r={w * 0.06} fill={SCENE_COLORS.materials.metalBorder} />
        </g>
      )}

      {/* 底部出料口 */}
      <rect
        x={cx - botW * 0.25}
        y={funnelH + bodyH}
        width={botW * 0.5}
        height={h - (funnelH + bodyH)}
        fill={SCENE_COLORS.materials.iron}
      />

      {/* 设备名称文本 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={h - 4}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fill="white"
          fontWeight="bold"
        >
          {title}
        </text>
      )}
    </g>
  )
}
