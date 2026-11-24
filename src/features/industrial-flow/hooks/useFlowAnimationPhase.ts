/**
 * src/features/industrial-flow/hooks/useFlowAnimationPhase.ts
 * 工艺流程方框图流向动画相位 Hook（遵循禁止组件直调 rAF 铁律）
 */
import { useState } from 'react'
import { useAnimationFrame } from '@/utils/animation'

export function useFlowAnimationPhase(playing: boolean): number {
  const [phase, setPhase] = useState(0)

  useAnimationFrame(
    (deltaTime) => {
      setPhase((prev) => (prev + deltaTime / 2400) % 1)
    },
    { playing },
  )

  return phase
}
