import React from 'react'
import { CANVAS_COLORS, CANVAS_STYLE } from '@/theme'
import type { ChargeSign } from './types'

export interface ParticleTrajectoryProps {
  historyPoints?: { x: number; y: number }[]
  predictedPoints?: { x: number; y: number }[]
  tailPoints?: { x: number; y: number }[]
  isFocus?: boolean
  chargeSign?: ChargeSign
  showTail?: boolean
  customBaseColor?: string
}

/**
 * 粒子轨迹统一渲染组件（SVG）
 */
export const ParticleTrajectory: React.FC<ParticleTrajectoryProps> = ({
  historyPoints = [],
  predictedPoints = [],
  tailPoints = [],
  isFocus = true,
  chargeSign = '+',
  showTail = true,
  customBaseColor,
}) => {
  if (historyPoints.length === 0 && predictedPoints.length === 0) return null

  let baseColor = customBaseColor ?? CANVAS_COLORS.labelText
  if (chargeSign === '+') {
    baseColor = CANVAS_COLORS.alertRed
  } else if (chargeSign === '-') {
    baseColor = CANVAS_COLORS.objectStroke
  }

  const historyD = historyPoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    '',
  )

  const predictedD = predictedPoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    '',
  )

  const tailD =
    showTail && tailPoints.length > 1
      ? tailPoints.reduce(
          (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
          '',
        )
      : null

  const currentPt =
    historyPoints.length > 0
      ? historyPoints[historyPoints.length - 1]
      : predictedPoints[0]

  const radius = isFocus
    ? CANVAS_STYLE.object.pointMassRadius
    : CANVAS_STYLE.object.pointMassRadius * 0.7

  return (
    <g className="chemistry-particle-system">
      {predictedD && (
        <path
          d={predictedD}
          fill="none"
          stroke={baseColor}
          strokeWidth={CANVAS_STYLE.stroke.trackHistory}
          strokeDasharray={CANVAS_STYLE.dash.predictedTrajectory.join(' ')}
          opacity={isFocus ? CANVAS_STYLE.opacity.trackHistory * 0.5 : CANVAS_STYLE.opacity.unfocusedTrackHistory * 0.5}
        />
      )}

      {historyD && (
        <path
          d={historyD}
          fill="none"
          stroke={baseColor}
          strokeWidth={CANVAS_STYLE.stroke.trackHistory}
          strokeDasharray={CANVAS_STYLE.dash.trajectory.join(' ')}
          opacity={isFocus ? CANVAS_STYLE.opacity.trackHistory : CANVAS_STYLE.opacity.unfocusedTrackHistory}
        />
      )}

      {tailD && (
        <path
          d={tailD}
          fill="none"
          stroke={baseColor}
          strokeWidth={CANVAS_STYLE.stroke.tailLineWidth}
          opacity={isFocus ? 0.6 : 0.25}
          strokeLinecap="round"
        />
      )}

      {currentPt && (
        <circle
          cx={currentPt.x}
          cy={currentPt.y}
          r={radius}
          fill={baseColor}
          stroke={CANVAS_COLORS.white}
          strokeWidth={isFocus ? 1.5 : 1}
        />
      )}
    </g>
  )
}
