import { describe, it, expect } from 'vitest'
import { useVseprChemistry, VSEPR_PRESET_KEYS } from '../hooks/useVseprChemistry'
import { VSEPR_PRESETS } from '../data/vseprData'
import { renderHook } from '@testing-library/react'

describe('useVseprChemistry 预设与化学推导测试', () => {
  it('应当准确加载 21 种高考分子与离子预设', () => {
    expect(VSEPR_PRESET_KEYS.length).toBe(21)
    VSEPR_PRESET_KEYS.forEach((key) => {
      expect(VSEPR_PRESETS[key]).toBeDefined()
    })
  })

  it('阳离子 NH4+ 的 VSEPR 孤电子对与构型推导正确', () => {
    const nh4Idx = VSEPR_PRESET_KEYS.indexOf('nh4_plus')
    expect(nh4Idx).toBeGreaterThan(-1)

    const { result } = renderHook(() => useVseprChemistry({ presetIdx: nh4Idx }))
    const { molecule, calculationDetails } = result.current

    expect(molecule.formula).toBe('NH₄⁺')
    expect(molecule.charge).toBe(1)
    expect(molecule.lonePairCount).toBe(0)
    expect(molecule.totalPairs).toBe(4)
    expect(molecule.molecularGeometry).toBe('正四面体')
    expect(calculationDetails.lonePairFormula).toContain('(5 - (+1) - 4 × 1) / 2 = 0')
  })

  it('水合氢离子 H3O+ 的 VSEPR 孤电子对推导正确', () => {
    const h3oIdx = VSEPR_PRESET_KEYS.indexOf('h3o_plus')
    expect(h3oIdx).toBeGreaterThan(-1)

    const { result } = renderHook(() => useVseprChemistry({ presetIdx: h3oIdx }))
    const { molecule, calculationDetails } = result.current

    expect(molecule.formula).toBe('H₃O⁺')
    expect(molecule.lonePairCount).toBe(1)
    expect(molecule.totalPairs).toBe(4)
    expect(molecule.molecularGeometry).toBe('三角锥形')
    expect(calculationDetails.lonePairFormula).toContain('(6 - (+1) - 3 × 1) / 2 = 1')
  })

  it('阴离子 CO3 2- 的 VSEPR 孤电子对推导正确', () => {
    const co3Idx = VSEPR_PRESET_KEYS.indexOf('co3_2minus')
    expect(co3Idx).toBeGreaterThan(-1)

    const { result } = renderHook(() => useVseprChemistry({ presetIdx: co3Idx }))
    const { molecule, calculationDetails } = result.current

    expect(molecule.formula).toBe('CO₃²⁻')
    expect(molecule.lonePairCount).toBe(0)
    expect(molecule.totalPairs).toBe(3)
    expect(molecule.molecularGeometry).toBe('平面三角形')
    expect(calculationDetails.lonePairFormula).toContain('(4 - (-2) - 3 × 2) / 2 = 0')
  })

  it('SO3 分子与 SO2 分子的构型对比计算正确', () => {
    const so3Idx = VSEPR_PRESET_KEYS.indexOf('so3')
    const { result: resSo3 } = renderHook(() => useVseprChemistry({ presetIdx: so3Idx }))
    expect(resSo3.current.molecule.molecularGeometry).toBe('平面三角形')
    expect(resSo3.current.molecule.lonePairCount).toBe(0)

    const so2Idx = VSEPR_PRESET_KEYS.indexOf('so2')
    const { result: resSo2 } = renderHook(() => useVseprChemistry({ presetIdx: so2Idx }))
    expect(resSo2.current.molecule.molecularGeometry).toBe('V形 (折线形)')
    expect(resSo2.current.molecule.lonePairCount).toBe(1)
  })
})

import { getVseprFormulas, getVseprExamPoints } from '@/data/quantities/structure/vsepr'

describe('getVseprFormulas 与 getVseprExamPoints 动态生成测试', () => {
  it('根据 presetIdx 动态生成不同分子的 VSEPR 公式与考点', () => {
    // NH3
    const nh3Idx = VSEPR_PRESET_KEYS.indexOf('nh3')
    const nh3Formulas = getVseprFormulas({ presetIdx: nh3Idx })
    expect(nh3Formulas[0].name).toContain('氨气分子')
    expect(nh3Formulas[0].latex).toContain('n = \\frac{1}{2}')

    // CO2
    const co2Formulas = getVseprFormulas({ presetIdx: 0 })
    expect(co2Formulas[0].name).toContain('二氧化碳')

    // H2O考点
    const h2oIdx = VSEPR_PRESET_KEYS.indexOf('h2o')
    const h2oPoints = getVseprExamPoints({ presetIdx: h2oIdx })
    expect(h2oPoints[1].text).toContain('H₂O')
  })
})
