import { CHEMISTRY_COLORS } from './colors'

export type VectorType =
  | 'reactionRate' | 'rateForward' | 'rateReverse'
  | 'electron' | 'ion' | 'currentDirection'
  | 'heatFlow' | 'equilibriumShift'

export const VECTOR_VISUAL_WEIGHT: Record<VectorType, number> = {
  reactionRate: 0.9,
  rateForward: 0.8,
  rateReverse: 0.8,
  electron: 0.7,
  ion: 0.6,
  currentDirection: 0.6,
  heatFlow: 0.7,
  equilibriumShift: 0.5,
}

export const VECTOR_COLORS: Record<VectorType, string> = {
  reactionRate:       CHEMISTRY_COLORS.reactionRate,
  rateForward:        CHEMISTRY_COLORS.rateForward,
  rateReverse:        CHEMISTRY_COLORS.rateReverse,
  electron:           CHEMISTRY_COLORS.electron,
  ion:                CHEMISTRY_COLORS.ion,
  currentDirection:   CHEMISTRY_COLORS.current,
  heatFlow:           CHEMISTRY_COLORS.heatRelease,
  equilibriumShift:   CHEMISTRY_COLORS.equilibriumShift,
}

export const MARKER_TIERS = {
  small: { width: 6, height: 4, headLength: 6 },
  medium: { width: 8, height: 5, headLength: 8 },
  large: { width: 10, height: 6, headLength: 10 },
} as const

export type MarkerTier = keyof typeof MARKER_TIERS

export function selectMarkerTier(length: number): MarkerTier {
  if (length < 40) return 'small';
  if (length < 120) return 'medium';
  return 'large';
}
