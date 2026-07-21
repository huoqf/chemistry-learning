import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface LeachingReactorEquipmentProps {
  /** 设备左上角 x（设计坐标） */
  x: number
  /** 设备左上角 y（设计坐标） */
  y: number
  /** 设备宽度（设计单位，默认 110） */
  width?: number
  /** 设备高度（设计单位，默认 130） */
  height?: number
  /** 运行状态：'idle' 待机 | 'running' 搅拌浸出中 */
  status?: 'idle' | 'running'
  /** 浸出槽内液体比例 0~1 */
  fillLevel?: number
  /** 浸出槽内矿浆/溶液颜色 */
  fillColor?: string
  /** 设备标题 */
  title?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * LeachingReactorEquipment — 浸出槽 / 反应釜组件（高考化工流程）
 *
 * 适用高考化工场景：
 * - 湿法冶金酸浸/碱浸（如 "加入 H₂SO₄ 浸出氧化锌矿" 或 "加 NaOH 碱浸除铝"）
 * - 反应釜（强力搅拌增溶/配合反应）
 *
 * 颜色：`SCENE_COLORS.industrialEquipment.leachingReactor`
 *
 * @example
 * ```tsx
 * <LeachingReactorEquipment
 *   x={150} y={100} width={110} height={130}
 *   status="running" fillLevel={0.65} title="浸出槽" font={font}
 * />
 * ```
 */
export function LeachingReactorEquipment({
  x,
  y,
  width = 110,
  height = 130,
  status = 'running',
  fillLevel = 0.6,
  fillColor = SCENE_COLORS.reagent.solution,
  title = '浸出槽',
  font = (n) => n,
}: LeachingReactorEquipmentProps) {
  const w = width
  const h = height
  const isTiny = w < 40
  const isRunning = status === 'running'

  const wallT = Math.max(2, w * 0.04)
  const innerW = w - wallT * 2
  const bodyH = h * 0.85
  const bodyY = h - bodyH

  const liquidH = (bodyH - wallT) * Math.min(1, Math.max(0, fillLevel))

  const cx = w * 0.5

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 顶部搅拌电机机座 */}
      <rect
        x={cx - w * 0.15}
        y={0}
        width={w * 0.3}
        height={bodyY}
        rx={2}
        fill={SCENE_COLORS.materials.iron}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={STROKE.reference}
      />

      {/* 槽体外壳（圆角矩形） */}
      <rect
        x={0}
        y={bodyY}
        width={w}
        height={bodyH}
        rx={6}
        fill={SCENE_COLORS.industrialEquipment.leachingReactor}
        stroke={SCENE_COLORS.industrialEquipment.leachingReactorBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 槽内浸出液/矿浆 */}
      {fillLevel > 0 && (
        <rect
          x={wallT}
          y={h - wallT - liquidH}
          width={innerW}
          height={liquidH}
          fill={fillColor}
          opacity={0.85}
          rx={2}
        />
      )}

      {/* 搅拌轴与桨叶 */}
      <g opacity={0.9}>
        {/* 竖轴 */}
        <line
          x1={cx}
          y1={bodyY}
          x2={cx}
          y2={h - bodyH * 0.25}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={STROKE.objectLine}
        />
        {/* 搅拌桨叶（运行状态下加 spin 动画） */}
        <g
          transform={`translate(${cx}, ${h - bodyH * 0.25})`}
          style={{
            transformOrigin: `${cx}px ${h - bodyH * 0.25}px`,
            animation: isRunning ? 'spin 2s linear infinite' : 'none',
          }}
        >
          <path
            d={`
              M -${w * 0.25} -4
              L ${w * 0.25} 4
              M -${w * 0.25} 4
              L ${w * 0.25} -4
            `}
            stroke={SCENE_COLORS.materials.iron}
            strokeWidth={STROKE.objectLine}
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* 管道链接口 (顶部进液/底部出液) */}
      {!isTiny && (
        <g fill={SCENE_COLORS.industrialPipeline.liquidPipe}>
          <rect x={w * 0.15} y={bodyY - 6} width={10} height={6} />
          <rect x={w - 16} y={h - 20} width={16} height={8} />
        </g>
      )}

      {/* 标题 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={bodyY + 20}
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
