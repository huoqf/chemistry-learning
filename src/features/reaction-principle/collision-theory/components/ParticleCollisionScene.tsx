/**
 * 微观粒子碰撞与空间取向示意 SVG 场景组件
 *
 * 部署于 splitHw 布局左侧 (280px width) 画布中
 */

import { CHEMISTRY_COLORS, CANVAS_COLORS, withAlpha } from '@/theme'
import type { Particle, CollisionStats } from '../hooks/useCollisionPhysics'

interface ParticleCollisionSceneProps {
  particles: Particle[]
  stats: CollisionStats
  width: number
  height: number
  fontScaler?: (size: number) => number
  checkOrientation?: boolean
}

export function ParticleCollisionScene({
  particles,
  stats,
  width,
  height,
  fontScaler = (s) => s,
  checkOrientation = true,
}: ParticleCollisionSceneProps) {
  return (
    <svg width={width} height={height} className="w-full h-full pointer-events-none select-none">
      {/* 容器网格边框 */}
      <rect
        x={1}
        y={1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        fill="none"
        stroke={CANVAS_COLORS.grid}
        strokeWidth={1}
        rx={6}
      />

      {/* 粒子及碰撞光环 */}
      {particles.map((p) => {
        // 渲染颜色：A2 (深红-红双原子), B2 (深蓝-蓝双原子), AB (紫色混合/生成物)
        let primaryColor: string = CHEMISTRY_COLORS.concentration
        let secondaryColor: string = CHEMISTRY_COLORS.reactionRate
        if (p.type === 'A2') {
          primaryColor = '#3B82F6' // 蓝
          secondaryColor = '#60A5FA'
        } else if (p.type === 'B2') {
          primaryColor = '#EF4444' // 红
          secondaryColor = '#F87171'
        } else {
          primaryColor = '#8B5CF6' // 紫 AB
          secondaryColor = '#A78BFA'
        }

        return (
          <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
            {/* 碰撞闪光光环 */}
            {p.flashFrames > 0 && (
              <circle
                r={p.radius + 6}
                fill="none"
                stroke={p.isActivated ? CHEMISTRY_COLORS.activation : CHEMISTRY_COLORS.pressure}
                strokeWidth={2}
                opacity={p.flashFrames / 8}
              />
            )}

            {/* 活化分子高能光晕 */}
            {p.isActivated && (
              <circle
                r={p.radius + 3}
                fill={withAlpha(CHEMISTRY_COLORS.activation, 0.35)}
              />
            )}

            {/* 双原子分子哑铃示意 / 单颗粒 */}
            <circle
              r={p.radius}
              fill={primaryColor}
              stroke="#FFFFFF"
              strokeWidth={1}
            />
            {p.type !== 'AB' && (
              <circle
                cx={p.radius * 0.5}
                cy={p.radius * 0.5}
                r={p.radius * 0.6}
                fill={secondaryColor}
              />
            )}
          </g>
        )
      })}

      {/* 顶部简明数值标注Overlay */}
      <g transform="translate(10, 10)">
        <rect
          x={0}
          y={0}
          width={Math.min(220, width - 20)}
          height={68}
          fill="rgba(255, 255, 255, 0.92)"
          rx={6}
          stroke={CANVAS_COLORS.grid}
          strokeWidth={0.8}
        />
        <text
          x={10}
          y={18}
          fontSize={fontScaler(12)}
          fill={CANVAS_COLORS.labelText}
          fontWeight="bold"
        >
          微观碰撞概况
        </text>
        <text x={10} y={35} fontSize={fontScaler(11)} fill={CANVAS_COLORS.labelTextLight}>
          碰撞频率: <tspan fontWeight="bold" fill={CHEMISTRY_COLORS.reactionRate}>{stats.totalCollisions.toFixed(1)}</tspan> 次/s
        </text>
        <text x={10} y={52} fontSize={fontScaler(11)} fill={CANVAS_COLORS.labelTextLight}>
          有效碰撞: <tspan fontWeight="bold" fill={CHEMISTRY_COLORS.activation}>{stats.effectiveCollisions.toFixed(1)}</tspan> 次/s
        </text>
      </g>

      {/* 图例（底部） */}
      <g transform={`translate(10, ${height - 52})`}>
        <rect
          x={0}
          y={0}
          width={Math.min(240, width - 20)}
          height={42}
          fill="rgba(255, 255, 255, 0.92)"
          rx={6}
          stroke={CANVAS_COLORS.grid}
          strokeWidth={0.8}
        />
        <circle cx={15} cy={14} r={4} fill="#3B82F6" />
        <text x={24} y={17} fontSize={fontScaler(10)} fill={CANVAS_COLORS.labelTextLight}>A₂</text>

        <circle cx={65} cy={14} r={4} fill="#EF4444" />
        <text x={74} y={17} fontSize={fontScaler(10)} fill={CANVAS_COLORS.labelTextLight}>B₂</text>

        <circle cx={115} cy={14} r={4} fill="#8B5CF6" />
        <text x={124} y={17} fontSize={fontScaler(10)} fill={CANVAS_COLORS.labelTextLight}>生成物 AB</text>

        <text x={10} y={34} fontSize={fontScaler(9.5)} fill={CANVAS_COLORS.labelTextLight}>
          {checkOrientation ? '已开启取向检查 (定向碰撞)' : '未开启取向检查'}
        </text>
      </g>
    </svg>
  )
}
