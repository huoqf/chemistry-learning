import React from 'react'
import { useUniqueSvgId } from '@/hooks'
import { CHEMISTRY_COLORS, colors } from '@/theme'

interface ParticleEmitterProps {
  x: number
  y: number
  active?: boolean
  chargeSign?: number
  width?: number
  height?: number
}

/**
 * 通用粒子发射源组件
 */
export const ParticleEmitter: React.FC<ParticleEmitterProps> = ({
  x,
  y,
  active = false,
  chargeSign = 1,
  width = 65,
  height = 36,
}) => {
  const gradId = useUniqueSvgId()
  const indicatorColor = chargeSign > 0
    ? CHEMISTRY_COLORS.anode
    : (chargeSign < 0 ? CHEMISTRY_COLORS.cathode : colors.neutral[400])

  const defaultWidth = 65
  const defaultHeight = 36
  const scaleX = width / defaultWidth
  const scaleY = height / defaultHeight
  const scale = Math.min(scaleX, scaleY)

  return (
    <g className="select-none" transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`emitter-body-${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.neutral[600]} />
          <stop offset="20%" stopColor={colors.neutral[400]} />
          <stop offset="40%" stopColor={colors.neutral[200]} />
          <stop offset="60%" stopColor={colors.neutral[300]} />
          <stop offset="80%" stopColor={colors.neutral[500]} />
          <stop offset="100%" stopColor={colors.neutral[700]} />
        </linearGradient>
        <filter id={`glow-${gradId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect
        x={-65} y={-8} width={15} height={16} rx={1}
        fill={colors.neutral[700]}
        stroke={colors.neutral[800]}
        strokeWidth={1}
      />
      <line
        x1={-65} y1={0} x2={0} y2={0}
        stroke={colors.neutral[500]}
        strokeWidth={4}
        strokeDasharray="4,4"
        opacity="0.3"
      />
      <rect
        x={-55} y={-18} width={35} height={36} rx={4}
        fill={`url(#emitter-body-${gradId})`}
        stroke={colors.neutral[700]}
        strokeWidth={1.5}
      />
      <path
        d={`M -20 -10 L -5 -7 A 3 3 0 0 1 0 -4 L 0 4 A 3 3 0 0 1 -5 7 L -20 10 Z`}
        fill={`url(#emitter-body-${gradId})`}
        stroke={colors.neutral[700]}
        strokeWidth={1.2}
      />
      <rect
        x={-4} y={-6} width={4} height={12} rx={1}
        fill={indicatorColor}
        opacity={active ? 1 : 0.65}
        filter={active ? `url(#glow-${gradId})` : undefined}
      />
      <circle
        cx={-38} cy={0}
        r={active ? 3.5 : 2.5}
        fill={active ? colors.success[500] : colors.danger[500]}
        filter={active ? `url(#glow-${gradId})` : undefined}
      />
      <ellipse cx={0} cy={0} rx={1} ry={5} fill={colors.neutral[900]} />
    </g>
  )
}
