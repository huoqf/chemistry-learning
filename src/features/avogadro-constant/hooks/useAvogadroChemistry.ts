import { useMemo } from 'react'
import type { AvogadroParams, AvogadroResult } from '../types'
import {
  calculateStateVolumeTrap,
  calculateStructureBondsTrap,
} from './avogadroStateStructureCalculations'
import {
  calculateElectrolyteHydrolysisTrap,
  calculateRedoxElectronTrap,
  calculate5StepMatrix,
} from './avogadroReactionCalculations'

export {
  calculateStateVolumeTrap,
  calculateStructureBondsTrap,
  calculateElectrolyteHydrolysisTrap,
  calculateRedoxElectronTrap,
  calculate5StepMatrix,
}

/**
 * 阿伏加德罗常数 (N_A) 高考必考陷阱诊断与微粒统计 Hook
 * 零 JSX / 纯化学热力学/结构/氧化还原/水解代数逻辑
 */
export function useAvogadroChemistry(params: AvogadroParams): AvogadroResult {
  return useMemo(() => {
    const {
      trapCategory,
      stateItem,
      structureItem,
      electrolyteItem,
      redoxItem,
      amountValue,
      amountUnit,
      temperatureCondition,
      solutionVolume,
      solutionConcentration,
    } = params

    // 默认基础环境：标准状况 V_m = 22.4 L/mol，常温 V_m ≈ 24.5 L/mol
    const vm = temperatureCondition === 'standard' ? 22.4 : 24.5

    // 1. 标况状态与气体摩尔体积陷阱
    if (trapCategory === 'state-volume') {
      return calculateStateVolumeTrap(stateItem, amountValue, amountUnit, temperatureCondition, vm)
    }

    // 2. 结构化学与化学键/中子数统计陷阱
    if (trapCategory === 'structure-bonds') {
      return calculateStructureBondsTrap(structureItem, amountValue, amountUnit)
    }

    // 3. 弱电解质电离与盐类水解微粒数变动陷阱
    if (trapCategory === 'electrolyte-hydrolysis') {
      return calculateElectrolyteHydrolysisTrap(electrolyteItem, solutionVolume, solutionConcentration)
    }

    // 4. 氧化还原反应电子转移数 (n_e) 陷阱
    if (trapCategory === 'redox-electron') {
      return calculateRedoxElectronTrap(redoxItem, amountValue, amountUnit)
    }

    // 5. 五步秒杀盲盒矩阵模式
    return calculate5StepMatrix(params, vm)
  }, [params])
}
