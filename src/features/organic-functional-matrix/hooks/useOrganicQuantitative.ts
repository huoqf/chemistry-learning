import { useMemo } from 'react'
import { FUNCTIONAL_GROUPS } from '../constants'
import type { TotalConsumptionResult } from '../types'

/**
 * useOrganicQuantitative — 计算任意官能团组合与高考核心试剂反应的摩尔消耗比与来源拆解
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
    let precipitateAg = 0
    let precipitateCu2O = 0

    const breakdowns: TotalConsumptionResult['breakdowns'] = {
      Na: [],
      NaOH: [],
      NaHCO3: [],
      Na2CO3: [],
      Br2: [],
      H2: [],
    }

    Object.entries(groupCounts).forEach(([groupId, count]) => {
      if (count <= 0) return
      const group = FUNCTIONAL_GROUPS.find((g) => g.id === groupId)
      if (!group) return

      // Na
      if (group.consumptions.Na > 0) {
        const mol = group.consumptions.Na * count
        totalNa += mol
        breakdowns.Na.push({
          groupId: group.id,
          groupName: group.name,
          groupFormula: group.formula,
          count,
          molPerGroup: group.consumptions.Na,
          totalMol: mol,
          reason: groupId === 'carboxyl-cooh' ? '羧基活泼氢置换' : '羟基活泼氢置换',
        })
      }

      // NaOH
      if (group.consumptions.NaOH > 0) {
        const mol = group.consumptions.NaOH * count
        totalNaOH += mol
        let reason = '酸碱中和'
        if (groupId === 'phenol-ester') {
          reason = '酚酯水解（1 羧酸盐 + 1 酚钠，消耗 2 NaOH）'
        } else if (groupId === 'ester-coor') {
          reason = '普通酯水解（1 羧酸盐 + 1 醇）'
        } else if (groupId === 'halo-halogen') {
          reason = '卤代烃水解（生成醇和 NaX）'
        } else if (groupId === 'peptide-amide') {
          reason = '酰胺键碱性水解'
        }
        breakdowns.NaOH.push({
          groupId: group.id,
          groupName: group.name,
          groupFormula: group.formula,
          count,
          molPerGroup: group.consumptions.NaOH,
          totalMol: mol,
          reason,
        })
      }

      // NaHCO3
      if (group.consumptions.NaHCO3 > 0) {
        const mol = group.consumptions.NaHCO3 * count
        totalNaHCO3 += mol
        breakdowns.NaHCO3.push({
          groupId: group.id,
          groupName: group.name,
          groupFormula: group.formula,
          count,
          molPerGroup: group.consumptions.NaHCO3,
          totalMol: mol,
          reason: '强酸制弱酸，释放 CO₂ 气体',
        })
      }

      // Na2CO3
      if (group.consumptions.Na2CO3 > 0) {
        const mol = group.consumptions.Na2CO3 * count
        totalNa2CO3 += mol
        breakdowns.Na2CO3.push({
          groupId: group.id,
          groupName: group.name,
          groupFormula: group.formula,
          count,
          molPerGroup: group.consumptions.Na2CO3,
          totalMol: mol,
          reason: groupId === 'phenol-oh' ? '酚羟基弱酸性转化为 NaHCO₃（不出气）' : '羧酸反应生成 CO₂',
        })
      }

      // Br2
      if (group.consumptions.Br2 > 0) {
        const mol = group.consumptions.Br2 * count
        totalBr2 += mol
        breakdowns.Br2.push({
          groupId: group.id,
          groupName: group.name,
          groupFormula: group.formula,
          count,
          molPerGroup: group.consumptions.Br2,
          totalMol: mol,
          reason: groupId === 'phenol-oh' ? '苯酚邻对位 3 处取代反应' : groupId === 'aldehyde-cho' ? '醛基被溴水氧化为羧基' : '碳碳不饱和键加成反应',
        })
      }

      // H2
      if (group.consumptions.H2 > 0) {
        const mol = group.consumptions.H2 * count
        totalH2 += mol
        breakdowns.H2.push({
          groupId: group.id,
          groupName: group.name,
          groupFormula: group.formula,
          count,
          molPerGroup: group.consumptions.H2,
          totalMol: mol,
          reason:
            groupId === 'aldehyde-cho'
              ? '醛基加氢还原为伯醇'
              : groupId === 'ketone-co'
                ? '酮羰基加氢还原为仲醇'
                : '碳碳不饱和键催化加氢',
        })
      }

      // 气体生成计算
      if (groupId === 'alcohol-oh' || groupId === 'phenol-oh' || groupId === 'carboxyl-cooh') {
        gasH2 += 0.5 * count
      }
      if (groupId === 'carboxyl-cooh') {
        gasCO2 += 1.0 * count
      }

      // 沉淀与特殊反应产物
      if (groupId === 'aldehyde-cho') {
        precipitateAg += 2.0 * count
        precipitateCu2O += 1.0 * count
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
      precipitateAg,
      precipitateCu2O,
      breakdowns,
    }
  }, [groupCounts])
}

