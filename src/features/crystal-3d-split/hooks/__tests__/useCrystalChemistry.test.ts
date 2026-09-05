import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCrystalChemistry } from '../useCrystalChemistry'
import { CRYSTAL_DATA_MAP } from '../../data/crystalData'
import { modelCrystal3dSplit } from '@/data/quiz/model-crystal-3d-split'

describe('母题三：3D晶胞均摊与密度计算严谨性测试', () => {
  it('六方平行六面体晶胞 (Mg) 顶角空间几何均摊份额严谨符合立体几何', () => {
    const mgData = CRYSTAL_DATA_MAP['hcp-mg']
    const { result } = renderHook(() => useCrystalChemistry(mgData, 'algebraic'))

    const mgDetail = result.current.elementDetails.find((d) => d.element === 'Mg')
    expect(mgDetail).toBeDefined()
    expect(mgDetail?.cornerCount).toBe(8)
    expect(mgDetail?.internalCount).toBe(1)
    // 4 × 1/12 + 4 × 1/6 + 1 = 2
    expect(mgDetail?.netCount).toBe(2)
    expect(mgDetail?.cornerDetailFormula).toBe('4×1/12 + 4×1/6')
    expect(result.current.totalZ).toBe(2)
    expect(result.current.densityAlgebraicLatex).toContain('a^2 c')
  })

  it('立方晶系 (CaTiO3 钙钛矿) 均摊净数与化学式吻合', () => {
    const data = CRYSTAL_DATA_MAP['catio3']
    const { result } = renderHook(() => useCrystalChemistry(data, 'algebraic'))

    const ti = result.current.elementDetails.find((d) => d.element === 'Ti⁴⁺')
    const ca = result.current.elementDetails.find((d) => d.element === 'Ca²⁺')
    const o = result.current.elementDetails.find((d) => d.element === 'O²⁻')

    expect(ti?.netCount).toBe(1) // 8 * 1/8
    expect(ca?.netCount).toBe(1) // 1
    expect(o?.netCount).toBe(3) // 12 * 1/4
    expect(result.current.totalZ).toBe(1)
    expect(result.current.densityAlgebraicLatex).toContain('a^3 \\cdot 10^{-30}')
  })

  it('闪锌矿 (ZnS) 晶胞均摊与 50% 四面体空隙填充计算吻合', () => {
    const data = CRYSTAL_DATA_MAP['zns']
    const { result } = renderHook(() => useCrystalChemistry(data, 'numerical'))

    const s = result.current.elementDetails.find((d) => d.element === 'S²⁻')
    const zn = result.current.elementDetails.find((d) => d.element === 'Zn²⁺')

    expect(s?.cornerCount).toBe(8)
    expect(s?.faceCount).toBe(6)
    expect(s?.netCount).toBe(4) // 8 * 1/8 + 6 * 1/2 = 4
    expect(zn?.internalCount).toBe(4)
    expect(zn?.netCount).toBe(4) // 4 * 1 = 4
    expect(result.current.totalZ).toBe(4)
    expect(result.current.formulaRatioStr).toBe('Zn₄S₄ ➔ 4 ZnS')
    expect(result.current.densityNumericalLatex).toContain('10^{-10}')
  })

  it('母题三所有变式题已清除错配的滴定装置图配置', () => {
    for (const quiz of modelCrystal3dSplit.variantQuizzes) {
      expect(quiz.diagramType).toBeUndefined()
      expect(quiz.diagramConfig).toBeUndefined()
    }
  })
})
