import { useMemo } from 'react'
import { HYBRID_MODELS, PRESET_KEYS, type HybridModelData } from '../data/hybridData'

interface UseHybridChemistryOptions {
  presetIdx: number
}

export function useHybridChemistry({ presetIdx }: UseHybridChemistryOptions) {
  const model = useMemo<HybridModelData>(() => {
    const safeIdx = Math.min(Math.max(0, Math.floor(presetIdx)), PRESET_KEYS.length - 1)
    const key = PRESET_KEYS[safeIdx] || 'ch4'
    return HYBRID_MODELS[key] || HYBRID_MODELS.ch4
  }, [presetIdx])

  return {
    model,
  }
}
