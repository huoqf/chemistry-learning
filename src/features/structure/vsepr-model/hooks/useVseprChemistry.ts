import { useMemo } from 'react'
import { VSEPR_PRESETS, type VseprMolecule } from '../data/vseprData'

export interface UseVseprChemistryOptions {
  presetIdx: number
}

const PRESET_KEYS = [
  'co2',
  'bf3',
  'so2',
  'ch4',
  'nh3',
  'h2o',
  'pcl5',
  'sf4',
  'clf3',
  'xef2',
  'sf6',
  'xef4',
]

export function useVseprChemistry({ presetIdx }: UseVseprChemistryOptions) {
  const molecule = useMemo<VseprMolecule>(() => {
    const safeIdx = Math.min(Math.max(0, Math.floor(presetIdx)), PRESET_KEYS.length - 1)
    const key = PRESET_KEYS[safeIdx] || 'co2'
    return VSEPR_PRESETS[key] || VSEPR_PRESETS.co2
  }, [presetIdx])

  const calculationDetails = useMemo(() => {
    const a = molecule.centralValence
    const m = molecule.ligandCount
    const y = molecule.ligandValence
    const x = molecule.charge
    const n = molecule.lonePairCount
    const total = molecule.totalPairs

    return {
      formulaExpr: `${molecule.formula}`,
      centralValenceExpr: `中心原子 ${molecule.centralElement} 价电子数 a = ${a}`,
      ligandValenceExpr: `配体 ${molecule.ligandElement} (单电子数 y = ${y})`,
      chargeExpr: x !== 0 ? `电荷数 x = ${x > 0 ? `+${x}` : x}` : '中性分子 (x = 0)',
      lonePairFormula: `n = (a - x - m × y) / 2 = (${a} ${x !== 0 ? `- (${x})` : ''} - ${m} × ${y}) / 2 = ${n}`,
      totalPairsFormula: `m + n = ${m} + ${n} = ${total}`,
    }
  }, [molecule])

  return {
    molecule,
    calculationDetails,
  }
}
