import { useMemo } from 'react'
import { FUNCTIONAL_GROUPS } from '../constants'
import type { TotalConsumptionResult } from '../types'

/**
 * useOrganicQuantitative — 计算任意官能团组合与高考核心试剂反应的摩尔消耗比
 *
 * @param groupCounts 官能团 ID -> 数量的键值对
 */
export function useOrganicQuantitative(
  groupCounts: Record<string, number>
): TotalConsumptionResult {
  return useMemo(() => {
    let totalNa = 0
    let totalNaOH = 0
    let totalNaHCO3 = 0
    let totalNa2CO3 = 0
    let totalBr2 = 0
    let totalH2 = 0
    let gasH2 = 0
    let gasCO2 = 0

    Object.entries(groupCounts).forEach(([groupId, count]) => {
      if (count <= 0) return
      const group = FUNCTIONAL_GROUPS.find((g) => g.id === groupId)
      if (!group) return

      totalNa += group.consumptions.Na * count
      totalNaOH += group.consumptions.NaOH * count
      totalNaHCO3 += group.consumptions.NaHCO3 * count
      totalNa2CO3 += group.consumptions.Na2CO3 * count
      totalBr2 += group.consumptions.Br2 * count
      totalH2 += group.consumptions.H2 * count

      // 气体生成计算
      // 1 mol -OH (醇/酚) 或 -COOH 与 Na 反应生成 0.5 mol H2
      if (groupId === 'alcohol-oh' || groupId === 'phenol-oh' || groupId === 'carboxyl-cooh') {
        gasH2 += 0.5 * count
      }
      // 1 mol -COOH 与 NaHCO3 反应生成 1 mol CO2
      if (groupId === 'carboxyl-cooh') {
        gasCO2 += 1.0 * count
      }
    })

    return {
      Na: totalNa,
      NaOH: totalNaOH,
      NaHCO3: totalNaHCO3,
      Na2CO3: totalNa2CO3,
      Br2: totalBr2,
      H2: totalH2,
      gasH2,
      gasCO2,
    }
  }, [groupCounts])
}
