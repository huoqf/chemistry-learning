import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useUnitCellChemistry } from '../hooks/useUnitCellChemistry'

describe('useUnitCellChemistry 晶胞计算单元测试', () => {
  it('正确计算 NaCl 晶胞的均占数、质量与密度', () => {
    const { result } = renderHook(() =>
      useUnitCellChemistry({
        crystalTypeId: 'nacl',
        edgeLength: 564,
        molarMass: 58.44,
      }),
    )

    const res = result.current
    expect(res.zValue).toBe(4)
    expect(res.cornerContribution).toBe(1) // 8 * 1/8
    expect(res.faceContribution).toBe(3) // 6 * 1/2
    expect(res.bodyContribution).toBe(1) // 1 * 1
    expect(res.edgeContribution).toBe(3) // 12 * 1/4

    // 理论密度大约在 2.16 ~ 2.17 g/cm³
    expect(res.densityGcm3).toBeGreaterThan(2.10)
    expect(res.densityGcm3).toBeLessThan(2.25)
  })

  it('正确计算 CsCl 晶胞的均占数', () => {
    const { result } = renderHook(() =>
      useUnitCellChemistry({
        crystalTypeId: 'cscl',
        edgeLength: 412,
        molarMass: 168.36,
      }),
    )

    const res = result.current
    expect(res.zValue).toBe(1)
    expect(res.cornerContribution).toBe(1)
    expect(res.bodyContribution).toBe(1)
  })

  it('正确计算 Cu (FCC) 晶胞', () => {
    const { result } = renderHook(() =>
      useUnitCellChemistry({
        crystalTypeId: 'fcc-cu',
        edgeLength: 361,
        molarMass: 63.55,
      }),
    )

    const res = result.current
    expect(res.zValue).toBe(4)
    expect(res.coordNumber).toBe(12)
    // 铜的理论密度约为 8.9 g/cm³
    expect(res.densityGcm3).toBeGreaterThan(8.5)
    expect(res.densityGcm3).toBeLessThan(9.5)
  })

  it('当边长增大时，晶胞体积增大，密度降低', () => {
    const { result: r1 } = renderHook(() =>
      useUnitCellChemistry({ crystalTypeId: 'nacl', edgeLength: 500 }),
    )
    const { result: r2 } = renderHook(() =>
      useUnitCellChemistry({ crystalTypeId: 'nacl', edgeLength: 600 }),
    )

    expect(r2.current.vCellCm3).toBeGreaterThan(r1.current.vCellCm3)
    expect(r2.current.densityGcm3).toBeLessThan(r1.current.densityGcm3)
  })

  it('正确计算新增晶体 CaF2、Mg-HCP 和 CO2 的均占数', () => {
    const { result: caf2 } = renderHook(() =>
      useUnitCellChemistry({ crystalTypeId: 'caf2', edgeLength: 546 }),
    )
    expect(caf2.current.zValue).toBe(4)
    expect(caf2.current.coordNumber).toBe(8)

    const { result: mg } = renderHook(() =>
      useUnitCellChemistry({ crystalTypeId: 'hcp-mg', edgeLength: 321 }),
    )
    expect(mg.current.zValue).toBe(2)
    expect(mg.current.coordNumber).toBe(12)
    expect(mg.current.cornerContribution).toBeCloseTo(1, 5) // 4*(1/6) + 4*(1/12) = 1
    expect(mg.current.bodyContribution).toBe(1) // 1 * 1

    // 验证 120° 顶角 (1/6) 与 60° 顶角 (1/12) 精确均摊
    const corner120 = mg.current.crystalData.atoms.find((a) => a.id === 'mg-corner-120-0')
    expect(corner120?.sharingRatio).toBeCloseTo(1 / 6, 5)
    const corner60 = mg.current.crystalData.atoms.find((a) => a.id === 'mg-corner-60-0')
    expect(corner60?.sharingRatio).toBeCloseTo(1 / 12, 5)

    // Mg 理论密度约 1.73 g/cm³
    expect(mg.current.densityGcm3).toBeGreaterThan(1.68)
    expect(mg.current.densityGcm3).toBeLessThan(1.78)

    const { result: co2 } = renderHook(() =>
      useUnitCellChemistry({ crystalTypeId: 'co2', edgeLength: 558 }),
    )
    expect(co2.current.zValue).toBe(4)
    expect(co2.current.coordNumber).toBe(12)
  })
})

import {
  getUnitCellFormulas,
  getUnitCellExamPoints,
  buildUnitCellQuantities,
} from '@/data/quantities/structure/unitCellCalculation'

describe('getUnitCellFormulas 与 getUnitCellExamPoints 动态生成测试', () => {
  it('根据 crystalType 动态生成对应的公式与高考考点', () => {
    // 0: NaCl
    const naclFormulas = getUnitCellFormulas({ crystalType: 0 })
    expect(naclFormulas[0].name).toContain('NaCl')

    // 2: Cu
    const cuFormulas = getUnitCellFormulas({ crystalType: 2 })
    expect(cuFormulas[1].latex).toContain('\\sqrt{2}a = 4r')

    // 3: Fe
    const feFormulas = getUnitCellFormulas({ crystalType: 3 })
    expect(feFormulas[1].latex).toContain('\\sqrt{3}a = 4r')

    // 5: CaF2
    const caf2Quantities = buildUnitCellQuantities({ crystalType: 5 })
    const zValue = caf2Quantities.find((q) => q.key === 'zValue')
    expect(zValue?.value).toBe(4)

    // 6: Mg HCP
    const mgFormulas = getUnitCellFormulas({ crystalType: 6 })
    expect(mgFormulas[0].latex).toContain('\\frac{\\sqrt{3}}{2} a^2 c')
    const mgExamPoints = getUnitCellExamPoints({ crystalType: 6 })
    expect(mgExamPoints[0].text).toContain('六方平行六面体均摊考法')
    expect(mgExamPoints[1].text).toContain('六方晶胞体积陷阱')

    // 7: CO2
    const co2ExamPoints = getUnitCellExamPoints({ crystalType: 7 })
    expect(co2ExamPoints[1].text).toContain('干冰 CO₂ 分子晶体')
  })
})
