import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAvogadroChemistry } from '../useAvogadroChemistry'
import type { AvogadroParams } from '../../types'

describe('useAvogadroChemistry', () => {
  const baseParams: AvogadroParams = {
    trapCategory: 'structure-bonds',
    stateItem: 'SO3',
    structureItem: 'SiO2',
    electrolyteItem: 'CH3COOH',
    redoxItem: 'Cl2-NaOH',
    amountValue: 1,
    amountUnit: 'mol',
    temperatureCondition: 'standard',
    solutionVolume: 1,
    solutionConcentration: 1,
    matrixStepIndex: 0,
  }

  it('正确计算 60 g SiO2 的 Si-O 共价键数 (4 N_A)', () => {
    const params: AvogadroParams = {
      ...baseParams,
      structureItem: 'SiO2',
      amountValue: 60,
      amountUnit: 'g',
    }
    const { result } = renderHook(() => useAvogadroChemistry(params))
    const bondStat = result.current.particleStats.find((s) => s.label === 'Si-O 共价键数')
    expect(bondStat).toBeDefined()
    expect(bondStat?.actualMoles).toBeCloseTo(4)
  })

  it('正确计算 78 g Na2O2 的阴离子数 (1 N_A) 和 O-O 键数', () => {
    const params: AvogadroParams = {
      ...baseParams,
      structureItem: 'Na2O2',
      amountValue: 78,
      amountUnit: 'g',
    }
    const { result } = renderHook(() => useAvogadroChemistry(params))
    const anionStat = result.current.particleStats.find((s) => s.label.includes('阴离子数'))
    expect(anionStat).toBeDefined()
    expect(anionStat?.actualMoles).toBeCloseTo(1)
  })

  it('正确计算 20 g D2O 的中子数 (10 N_A) 及对比陷阱值', () => {
    const params: AvogadroParams = {
      ...baseParams,
      structureItem: 'D2O',
      amountValue: 20,
      amountUnit: 'g',
    }
    const { result } = renderHook(() => useAvogadroChemistry(params))
    const neutronStat = result.current.particleStats.find((s) => s.label === '中子数')
    expect(neutronStat).toBeDefined()
    expect(neutronStat?.actualMoles).toBeCloseTo(10)
    // 20 g D2O 相当于 1 mol，理论对比误算中子数 (按 18 g/mol H2O, 8中子) 应为 (20/18)*8
    expect(neutronStat?.theoreticalMoles).toBeCloseTo((20 / 18) * 8)
  })

  it('正确计算 22 g T2O 的中子数 (12 N_A)', () => {
    const params: AvogadroParams = {
      ...baseParams,
      structureItem: 'T2O',
      amountValue: 22,
      amountUnit: 'g',
    }
    const { result } = renderHook(() => useAvogadroChemistry(params))
    const neutronStat = result.current.particleStats.find((s) => s.label === '中子数')
    expect(neutronStat).toBeDefined()
    expect(neutronStat?.actualMoles).toBeCloseTo(12)
    expect(neutronStat?.theoreticalMoles).toBeCloseTo((22 / 18) * 8)
  })
})
