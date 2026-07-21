import { useMemo } from 'react'
import { VSEPR_PRESETS, type VseprMolecule } from '../data/vseprData'

export interface UseVseprChemistryOptions {
  presetIdx: number
}

export const VSEPR_PRESET_KEYS = [
  // 1. 直线形 (2对)
  'co2',
  'no2_plus',
  // 2. 平面三角形 (3对)
  'bf3',
  'so3',
  'co3_2minus',
  'no3_minus',
  'so2',
  'no2_minus',
  // 3. 正四面体 (4对)
  'ch4',
  'nh4_plus',
  'so4_2minus',
  'nh3',
  'h3o_plus',
  'so3_2minus',
  'h2o',
  // 4. 三角双锥 (5对)
  'pcl5',
  'sf4',
  'clf3',
  'xef2',
  // 5. 正八面体 (6对)
  'sf6',
  'xef4',
] as const

export function useVseprChemistry({ presetIdx }: UseVseprChemistryOptions) {
  const molecule = useMemo<VseprMolecule>(() => {
    const safeIdx = Math.min(Math.max(0, Math.floor(presetIdx)), VSEPR_PRESET_KEYS.length - 1)
    const key = VSEPR_PRESET_KEYS[safeIdx] || 'co2'
    return VSEPR_PRESETS[key] || VSEPR_PRESETS.co2
  }, [presetIdx])

  const calculationDetails = useMemo(() => {
    const a = molecule.centralValence
    const m = molecule.ligandCount
    const y = molecule.ligandValence
    const x = molecule.charge
    const n = molecule.lonePairCount
    const total = molecule.totalPairs

    const chargeTerm = x > 0 ? ` - (+${x})` : x < 0 ? ` - (${x})` : ''
    const ligTerm = `${m} × ${y}`

    return {
      formulaExpr: `${molecule.name} (${molecule.formula})`,
      centralValenceExpr: `中心原子 ${molecule.centralElement} 最外层价电子数 a = ${a}`,
      ligandValenceExpr: `配体 ${molecule.ligandElement} (结合电子数 y = ${y})`,
      chargeExpr: x !== 0 ? `电荷数 x = ${x > 0 ? `+${x}` : x}` : '中性分子 (x = 0)',
      lonePairFormula: `n = (a - x - m × y) / 2 = (${a}${chargeTerm} - ${ligTerm}) / 2 = ${n}`,
      totalPairsFormula: `m + n = ${m} + ${n} = ${total}`,
    }
  }, [molecule])

  return {
    molecule,
    calculationDetails,
  }
}
