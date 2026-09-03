import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { VSEPR_MOLECULE_LIST, VSEPR_MOLECULE_MAP } from '../data/vseprData'
import { useVseprChemistry } from '../hooks/useVseprChemistry'

describe('母题五 VSEPR 与杂化轨道化学正确性与新高考真题对齐测试', () => {
  it('应当包含完整 17 种高考必考分子与离子', () => {
    expect(VSEPR_MOLECULE_LIST.length).toBe(17)
    expect(VSEPR_MOLECULE_MAP.so3).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.h3o_plus).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.no3_minus).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.so4_2minus).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.so3_2minus).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.xef2).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.xef4).toBeDefined()
  })

  it('CO2 (直线形, sp) 键角为 180° 且计算步骤准确', () => {
    const co2 = VSEPR_MOLECULE_MAP.co2
    const { result } = renderHook(() => useVseprChemistry(co2))

    expect(result.current.vseprFormulaText).toContain('2 + \\frac{4 - 2 \\times 2}{2} = 2')
    expect(co2.vseprGeometryName).toBe('直线形')
    expect(co2.molecularGeometryName).toBe('直线形')
    expect(co2.actualAngle).toBe(180)
  })

  it('经典硫系微粒四剑客 (SO2 / SO3 / SO3²⁻ / SO4²⁻) 构型与杂化辨析准确', () => {
    const so2 = VSEPR_MOLECULE_MAP.so2
    const so3 = VSEPR_MOLECULE_MAP.so3
    const so3_2minus = VSEPR_MOLECULE_MAP.so3_2minus
    const so4_2minus = VSEPR_MOLECULE_MAP.so4_2minus

    // SO2: sp2, V形, 1对孤对
    expect(so2.hybridization).toBe('sp2')
    expect(so2.lonePairs).toBe(1)
    expect(so2.molecularGeometryName).toBe('V形 (折线形)')

    // SO3: sp2, 平面三角形, 0对孤对
    expect(so3.hybridization).toBe('sp2')
    expect(so3.lonePairs).toBe(0)
    expect(so3.molecularGeometryName).toBe('平面三角形')

    // SO3 2-: sp3, 三角锥形, 1对孤对
    expect(so3_2minus.hybridization).toBe('sp3')
    expect(so3_2minus.lonePairs).toBe(1)
    expect(so3_2minus.molecularGeometryName).toBe('三角锥形')

    // SO4 2-: sp3, 正四面体形, 0对孤对
    expect(so4_2minus.hybridization).toBe('sp3')
    expect(so4_2minus.lonePairs).toBe(0)
    expect(so4_2minus.molecularGeometryName).toBe('正四面体形')
  })

  it('真题变式 5 稀有气体化合物 (XeF2 / XeF4) 构型与孤对推导严谨', () => {
    const xef2 = VSEPR_MOLECULE_MAP.xef2
    const xef4 = VSEPR_MOLECULE_MAP.xef4

    const { result: rXef2 } = renderHook(() => useVseprChemistry(xef2))
    const { result: rXef4 } = renderHook(() => useVseprChemistry(xef4))

    // XeF2: 5对电子 (sp3d), 3对赤道孤对, 直线形 (180°)
    expect(xef2.vseprPairs).toBe(5)
    expect(xef2.lonePairs).toBe(3)
    expect(xef2.hybridization).toBe('sp3d')
    expect(xef2.molecularGeometryName).toBe('直线形')
    expect(xef2.actualAngle).toBe(180)
    expect(rXef2.current.vseprCalculationSteps).toContain('孤电子对数 n = (8 - 2×1) / 2 = 3')

    // XeF4: 6对电子 (sp3d2), 2对轴向孤对, 平面正方形 (90°)
    expect(xef4.vseprPairs).toBe(6)
    expect(xef4.lonePairs).toBe(2)
    expect(xef4.hybridization).toBe('sp3d2')
    expect(xef4.molecularGeometryName).toBe('平面正方形')
    expect(xef4.actualAngle).toBe(90)
    expect(rXef4.current.vseprCalculationSteps).toContain('孤电子对数 n = (8 - 4×1) / 2 = 2')
  })

  it('阴离子 CO3²⁻ 与 NO₃⁻ 等电子体推导与电荷修正正确', () => {
    const co3 = VSEPR_MOLECULE_MAP.co3_2minus
    const no3 = VSEPR_MOLECULE_MAP.no3_minus

    const { result: rCo3 } = renderHook(() => useVseprChemistry(co3))
    const { result: rNo3 } = renderHook(() => useVseprChemistry(no3))

    expect(co3.lonePairs).toBe(0)
    expect(co3.vseprPairs).toBe(3)
    expect(co3.hybridization).toBe('sp2')
    expect(rCo3.current.vseprCalculationSteps).toContain('(4 + 2 - 3×2) / 2 = 0')

    expect(no3.lonePairs).toBe(0)
    expect(no3.vseprPairs).toBe(3)
    expect(no3.hybridization).toBe('sp2')
    expect(rNo3.current.vseprCalculationSteps).toContain('(5 + 1 - 3×2) / 2 = 0')
  })

  it('阳离子 NH4+ 与 H3O+ 杂化相同 (sp3) 但空间构型不同', () => {
    const nh4 = VSEPR_MOLECULE_MAP.nh4_plus
    const h3o = VSEPR_MOLECULE_MAP.h3o_plus

    const { result: rNh4 } = renderHook(() => useVseprChemistry(nh4))
    const { result: rH3o } = renderHook(() => useVseprChemistry(h3o))

    expect(nh4.vseprPairs).toBe(4)
    expect(nh4.lonePairs).toBe(0)
    expect(nh4.molecularGeometryName).toBe('正四面体形')
    expect(rNh4.current.vseprCalculationSteps).toContain('(5 - 1 - 4×1) / 2 = 0')

    expect(h3o.vseprPairs).toBe(4)
    expect(h3o.lonePairs).toBe(1)
    expect(h3o.molecularGeometryName).toBe('三角锥形')
    expect(rH3o.current.vseprCalculationSteps).toContain('(6 - 1 - 3×1) / 2 = 1')
  })

  it('CH4(109.5°) > NH3(107.3°) > H2O(104.5°) 键角递减规律严谨', () => {
    const ch4 = VSEPR_MOLECULE_MAP.ch4
    const nh3 = VSEPR_MOLECULE_MAP.nh3
    const h2o = VSEPR_MOLECULE_MAP.h2o

    expect(ch4.actualAngle).toBe(109.5)
    expect(nh3.actualAngle).toBe(107.3)
    expect(h2o.actualAngle).toBe(104.5)
    expect(h2o.molecularGeometryName).toBe('V形 (折线形)')

    expect(ch4.actualAngle).toBeGreaterThan(nh3.actualAngle)
    expect(nh3.actualAngle).toBeGreaterThan(h2o.actualAngle)
  })
})
