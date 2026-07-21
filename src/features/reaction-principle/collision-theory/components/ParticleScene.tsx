/**
 * 粒子碰撞微观场景 SVG 渲染
 */

import { useMemo } from 'react'
import { CHEMISTRY_COLORS, CANVAS_COLORS } from '@/theme'
import type { Particle, CollisionStats } from '../hooks/useCollisionPhysics'

interface ParticleSceneProps {
  particles: Particle[]
  stats: CollisionStats
  width: number
  height: number
}

export function ParticleScene({ particles, stats, width, height }: ParticleSceneProps) {
  const activatedCount = useMemo(
    () => particles.filter((p) => p.isActivated).length,
    [particles]
  )

  return (
    <svg width={width} height={height} className="w-full h-full">
      {/* 背景容器 */}
      <rect
        x={0} y={0} width={width} height={height}
        fill={CANVAS_COLORS.objectFillNeutral}
        rx={8}
      />
      {/* 容器边框 */}
      <rect
        x={1} y={1} width={width - 2} height={height - 2}
        fill="none" stroke={CANVAS_COLORS.grid} strokeWidth={1.5}
        rx={8}
      />

      {/* 粒子 */}
      {particles.map((p) => (
        <g key={p.id}>
          {/* 闪光光环 */}
          {p.flashFrames > 0 && (
            <circle
              cx={p.x} cy={p.y}
              r={p.radius + 4}
              fill="none"
              stroke={CHEMISTRY_COLORS.activation}
              strokeWidth={2}
              opacity={p.flashFrames / 5}
            />
          )}
          {/* 粒子本体 */}
          <circle
            cx={p.x} cy={p.y}
            r={p.radius}
            fill={p.color}
            opacity={0.9}
          />
        </g>
      ))}

      {/* 统计覆盖层 */}
      <g transform={`translate(12, 12)`}>
        <rect
          x={0} y={0} width={180} height={90}
          fill="rgba(255,255,255,0.85)"
          rx={6}
          stroke={CANVAS_COLORS.grid}
          strokeWidth={0.5}
        />
        <text x={10} y={20} fontSize={12} fill={CANVAS_COLORS.labelText} fontWeight="bold">
          碰撞统计
        </text>
        <text x={10} y={38} fontSize={11} fill="#475569">
          总碰撞: {stats.totalCollisions.toFixed(1)}/s
        </text>
        <text x={10} y={54} fontSize={11} fill="#475569">
          有效碰撞: {stats.effectiveCollisions.toFixed(1)}/s
        </text>
        <text x={10} y={70} fontSize={11} fill="#475569">
          活化分子: {activatedCount}/{particles.length} ({(stats.activationFraction * 100).toFixed(1)}%)
        </text>
      </g>

      {/* 图例 */}
      <g transform={`translate(${width - 110}, 12)`}>
        <rect
          x={0} y={0} width={98} height={50}
          fill="rgba(255,255,255,0.85)"
          rx={6}
          stroke={CANVAS_COLORS.grid}
          strokeWidth={0.5}
        />
        <circle cx={14} cy={18} r={5} fill="#3b82f6" />
        <text x={26} y={22} fontSize={10} fill="#475569">普通分子</text>
        <circle cx={14} cy={36} r={5} fill="#ef4444" />
        <text x={26} y={40} fontSize={10} fill="#475569">活化分子</text>
      </g>
    </svg>
  )
}
