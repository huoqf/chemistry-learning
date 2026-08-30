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
    <g transform={`translate(${x}, ${y})`} id="leaching-reactor">
      {/* 1. 顶部搅拌电机与减速箱 (Motor & Gearbox) */}
      <g id="top-motor">
        <rect
          x={cx - w * 0.12}
          y={0}
          width={w * 0.24}
          height={bodyY * 0.65}
          rx={2}
          fill={SCENE_COLORS.materials.iron}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={1}
        />
        {/* 减速箱连接底盘法兰 */}
        <rect
          x={cx - w * 0.18}
          y={bodyY * 0.65}
          width={w * 0.36}
          height={bodyY * 0.35}
          fill={SCENE_COLORS.materials.metalBorder}
        />
      </g>

      {/* 2. 槽体外壳（带圆弧底与保温夹套） */}
      <rect
        x={0}
        y={bodyY}
        width={w}
        height={bodyH}
        rx={8}
        fill={SCENE_COLORS.industrialEquipment.leachingReactor}
        stroke={SCENE_COLORS.industrialEquipment.leachingReactorBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 夹套外壁高光 */}
      <line
        x1={3}
        y1={bodyY + 6}
        x2={3}
        y2={h - 10}
        stroke={SCENE_COLORS.materials.metalSheen}
        strokeWidth={1}
        opacity={0.4}
      />

      {/* 3. 槽内浸出液/矿浆 (带凹液面与沉淀悬浮) */}
      {fillLevel > 0 && (
        <g clipPath={`url(#leaching-clip-${x}-${y})`}>
          <rect
            x={wallT}
            y={h - wallT - liquidH}
            width={innerW}
            height={liquidH}
            fill={fillColor}
            opacity={0.85}
          />
          {/* 液面微波纹 */}
          <line
            x1={wallT}
            y1={h - wallT - liquidH}
            x2={w - wallT}
            y2={h - wallT - liquidH}
            stroke={fillColor}
            strokeWidth={STROKE.reference}
          />
        </g>
      )}

      {/* 剪裁模板 */}
      <defs>
        <clipPath id={`leaching-clip-${x}-${y}`}>
          <rect x={0} y={bodyY} width={w} height={bodyH} rx={8} />
        </clipPath>
      </defs>

      {/* 4. 搅拌轴与双层斜桨叶 (Agitator Impellers) */}
      <g opacity={0.95}>
        {/* 竖轴 */}
        <line
          x1={cx}
          y1={bodyY}
          x2={cx}
          y2={h - bodyH * 0.15}
          stroke={SCENE_COLORS.materials.iron}
          strokeWidth={STROKE.objectLine + 0.5}
        />
        {/* 上层桨叶 */}
        <g
          style={{
            transformOrigin: `${cx}px ${h - bodyH * 0.45}px`,
            animation: isRunning ? 'spin 1.8s linear infinite' : 'none',
          }}
        >
          <line x1={cx - w * 0.22} y1={h - bodyH * 0.45 - 2} x2={cx + w * 0.22} y2={h - bodyH * 0.45 + 2} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={2.5} strokeLinecap="round" />
        </g>
        {/* 下层底层推流桨叶 */}
        <g
          style={{
            transformOrigin: `${cx}px ${h - bodyH * 0.2}px`,
            animation: isRunning ? 'spin 1.8s linear infinite' : 'none',
          }}
        >
          <line x1={cx - w * 0.28} y1={h - bodyH * 0.2 - 3} x2={cx + w * 0.28} y2={h - bodyH * 0.2 + 3} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={3} strokeLinecap="round" />
        </g>
      </g>

      {/* 5. 管道法兰接头 (顶部进酸管 / 底部出矿浆管) */}
      {!isTiny && (
        <g id="reactor-flanges">
          {/* 顶部进酸口法兰 */}
          <rect x={w * 0.12} y={bodyY - 7} width={12} height={7} rx={1} fill={SCENE_COLORS.industrialPipeline.liquidPipe} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={0.8} />
          {/* 底部排矿浆口法兰 */}
          <rect x={w - 18} y={h - 18} width={18} height={9} rx={1} fill={SCENE_COLORS.industrialPipeline.slurryPipe} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={0.8} />
        </g>
      )}

      {/* 6. 观察视镜 (Sight Glass) */}
      {!isTiny && (
        <circle
          cx={w * 0.8}
          cy={bodyY + 24}
          r={5.5}
          fill={SCENE_COLORS.materials.glass}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={1.5}
        />
      )}

      {/* 7. 标题 */}
      {title && !isTiny && (
        <text
          x={cx}
          y={bodyY + 18}
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
