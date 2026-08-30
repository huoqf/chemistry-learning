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
    <g transform={`translate(${x}, ${y})`} id="crusher-equipment">
      {/* 1. 顶部进料漏斗 (Trapezoidal Hopper with flange) */}
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
      {/* 漏斗上法兰边 */}
      <line
        x1={(w - topW) / 2 - 2}
        y1={0}
        x2={(w + topW) / 2 + 2}
        y2={0}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 漏斗内斜面高光 */}
      <line
        x1={(w - topW) / 2 + 3}
        y1={2}
        x2={(w - botW) / 2 + 2}
        y2={funnelH - 2}
        stroke={SCENE_COLORS.materials.metalSheen}
        strokeWidth={1}
        opacity={0.5}
      />

      {/* 2. 粉碎机主体机身 */}
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

      {/* 3. 内部双辊机械粉碎轮 (Dual Crushing Rollers) */}
      {!isTiny && (
        <g id="crushing-rollers">
          {/* 左辊 */}
          <g
            style={{
              transformOrigin: `${cx - 14}px ${cy}px`,
              animation: isRunning ? 'spin 2.5s linear infinite' : 'none',
            }}
          >
            <circle cx={cx - 14} cy={cy} r={12} fill={SCENE_COLORS.materials.iron} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />
            <line x1={cx - 26} y1={cy} x2={cx - 2} y2={cy} stroke={SCENE_COLORS.materials.metalSheen} strokeWidth={1.5} />
            <line x1={cx - 14} y1={cy - 12} x2={cx - 14} y2={cy + 12} stroke={SCENE_COLORS.materials.metalSheen} strokeWidth={1.5} />
          </g>

          {/* 右辊 (反向旋转啮合) */}
          <g
            style={{
              transformOrigin: `${cx + 14}px ${cy}px`,
              animation: isRunning ? 'spin 2.5s linear infinite reverse' : 'none',
            }}
          >
            <circle cx={cx + 14} cy={cy} r={12} fill={SCENE_COLORS.materials.iron} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />
            <line x1={cx + 2} y1={cy} x2={cx + 26} y2={cy} stroke={SCENE_COLORS.materials.metalSheen} strokeWidth={1.5} />
            <line x1={cx + 14} y1={cy - 12} x2={cx + 14} y2={cy + 12} stroke={SCENE_COLORS.materials.metalSheen} strokeWidth={1.5} />
          </g>

          {/* 运行中粉碎矿石颗粒碎屑 */}
          {isRunning && (
            <g fill={SCENE_COLORS.materials.iron}>
              <circle cx={cx} cy={cy - 8} r={2.5} />
              <circle cx={cx - 2} cy={cy + 6} r={1.5} />
              <circle cx={cx + 2} cy={cy + 10} r={1.2} />
            </g>
          )}
        </g>
      )}

      {/* 4. 底部出料导槽 */}
      <rect
        x={cx - botW * 0.25}
        y={funnelH + bodyH}
        width={botW * 0.5}
        height={h - (funnelH + bodyH)}
        fill={SCENE_COLORS.materials.iron}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={1}
      />

      {/* 5. 设备名称文本 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={h - 3}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill="white"
          fontWeight="bold"
        >
          {title}
        </text>
      )}
    </g>
  )
}
