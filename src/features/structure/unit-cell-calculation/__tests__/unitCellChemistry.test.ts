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

    const { result: co2 } = renderHook(() =>
      useUnitCellChemistry({ crystalTypeId: 'co2', edgeLength: 558 }),
    )
    expect(co2.current.zValue).toBe(4)
    expect(co2.current.coordNumber).toBe(12)
  })
})
