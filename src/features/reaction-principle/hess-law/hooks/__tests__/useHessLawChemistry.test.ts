/**
 * 盖斯定律线性叠加与微观键能计算单元测试
 *
 * 覆盖：
 *   1. 盖斯定律代数方程式线性组合 (C 不完全燃烧制 CO、高炉消碳、水蒸气液化生成热)
 *   2. 微观化学键能计算 (HCl 形成、合成氨、晶体硅燃烧 2 mol Si-Si 键、白磷 P4 正四面体 6 mol P-P 键)
 *   3. 反应活化能与反应热关系 (Ea(逆) - Ea(正) = -ΔH、催化剂降低决速步能垒)
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useHessLawChemistry } from '../useHessLawChemistry'
import type { HessLawParams } from '../../types'

describe('useHessLawChemistry — 盖斯定律与键能计算测试', () => {
  const defaultParams: HessLawParams = {
    mode: 'hess-overlay',
    hessGroupIndex: 0,
    k1: 1,
    k2: -0.5,
    bondMoleculeIndex: 0,
    hasCatalyst: 1,
    temperature: 298,
  }

  // ──────────────────────────────────────────────
  // 1. 盖斯定律线性叠加
  // ──────────────────────────────────────────────
  describe('盖斯定律热化学方程式线性叠加', () => {
    it('CO 生成热推导: ① - 0.5×② 准确得到 ΔH = -110.5 kJ/mol', () => {
      const { result } = renderHook(() =>
        useHessLawChemistry({ ...defaultParams, hessGroupIndex: 0, k1: 1, k2: -0.5 })
      )

      expect(result.current.currentHessGroup.targetFormula).toContain('CO(g)')
      expect(result.current.hessCalculated.totalDeltaH).toBeCloseTo(-110.5, 1)
      expect(result.current.hessCalculated.isMatchTarget).toBe(true)
    })

    it('高炉消碳重整: ① + ② 准确得到 ΔH = +172.5 kJ/mol', () => {
      const { result } = renderHook(() =>
        useHessLawChemistry({ ...defaultParams, hessGroupIndex: 1, k1: 1, k2: 1 })
      )

      expect(result.current.currentHessGroup.targetDeltaH).toBe(172.5)
      expect(result.current.hessCalculated.totalDeltaH).toBeCloseTo(172.5, 1)
      expect(result.current.hessCalculated.isMatchTarget).toBe(true)
    })

    it('系数设定错误时 isMatchTarget 为 false', () => {
      const { result } = renderHook(() =>
        useHessLawChemistry({ ...defaultParams, hessGroupIndex: 0, k1: 1, k2: 1 })
      )

      expect(result.current.hessCalculated.isMatchTarget).toBe(false)
    })
  })

  // ──────────────────────────────────────────────
  // 2. 键能与反应热计算 (ΔH = 反应物总键能 - 生成物总键能)
  // ──────────────────────────────────────────────
  describe('微观键能计算与立体微观陷阱', () => {
    it('HCl 形成反应: ΔH = (436 + 243) - 2×431 = -183 kJ/mol', () => {
      const { result } = renderHook(() =>
        useHessLawChemistry({ ...defaultParams, bondMoleculeIndex: 0 })
      )

      expect(result.current.currentBondPreset.id).toBe('h2-cl2-hcl')
      expect(result.current.bondCalculated.deltaH).toBe(-183)
    })

    it('合成氨反应: 1 mol N≡N (946) + 3 mol H-H (436×3) - 6 mol N-H (391×6) = -92 kJ/mol', () => {
      const { result } = renderHook(() =>
        useHessLawChemistry({ ...defaultParams, bondMoleculeIndex: 1 })
      )

      expect(result.current.currentBondPreset.id).toBe('n2-h2-nh3')
      expect(result.current.bondCalculated.deltaH).toBe(-92)
    })

    it('晶体硅燃烧 (高考陷阱): 1 mol Si 晶体含 2 mol Si-Si 键，1 mol SiO2 含 4 mol Si-O 键', () => {
      const { result } = renderHook(() =>
        useHessLawChemistry({ ...defaultParams, bondMoleculeIndex: 2 })
      )

      expect(result.current.currentBondPreset.id).toBe('silicon-combustion')
      const siSiBond = result.current.currentBondPreset.reactantBonds.find((b) => b.name.includes('Si-Si'))
      expect(siSiBond?.count).toBe(2)
      const siOBond = result.current.currentBondPreset.productBonds.find((b) => b.name.includes('Si-O'))
      expect(siOBond?.count).toBe(4)
      expect(result.current.bondCalculated.deltaH).toBe(-898)
    })

    it('白磷燃烧 (正四面体陷阱): 1 mol P4 含 6 mol P-P 键，1 mol P4O10 含 12 mol P-O 键与 4 mol P=O 键', () => {
      const { result } = renderHook(() =>
        useHessLawChemistry({ ...defaultParams, bondMoleculeIndex: 3 })
      )

      expect(result.current.currentBondPreset.id).toBe('p4-combustion')
      const ppBond = result.current.currentBondPreset.reactantBonds.find((b) => b.name.includes('P-P'))
      expect(ppBond?.count).toBe(6)
      expect(result.current.bondCalculated.deltaH).toBe(-2982)
    })
  })

  // ──────────────────────────────────────────────
  // 3. 反应历程与活化能
  // ──────────────────────────────────────────────
  describe('反应历程与催化活化能', () => {
    it('放热反应 ΔH = 60 - 150 = -90 kJ/mol, 正逆活化能差与 ΔH 守恒', () => {
      const { result } = renderHook(() => useHessLawChemistry(defaultParams))
      const { deltaH, eaForwardUncat, eaReverseUncat } = result.current.energyProfile

      expect(deltaH).toBe(-90)
      expect(eaReverseUncat - eaForwardUncat).toBe(-deltaH)
    })

    it('催化剂分步反应决速步活化能 maxCatEa < 无催化活化能，且多步历程精确自洽', () => {
      const { result } = renderHook(() => useHessLawChemistry(defaultParams))
      const {
        reactantEnergy,
        productEnergy,
        deltaH,
        uncatalyzedPeak,
        eaForwardUncat,
        catalyzedPeak1,
        catalyzedPeak2,
        intermediateEnergy,
        eaForwardCatStep1,
        eaForwardCatStep2,
        maxCatEa,
        apparentCatEa,
      } = result.current.energyProfile

      // 无催化活化能与能垒
      expect(uncatalyzedPeak - reactantEnergy).toBe(eaForwardUncat)
      expect(eaForwardUncat).toBe(90)

      // 催化步骤 1: 150 -> 190 (Ea1 = 40)
      expect(catalyzedPeak1 - reactantEnergy).toBe(eaForwardCatStep1)
      expect(eaForwardCatStep1).toBe(40)

      // 活性中间体: 160 (吸热活化中间体)
      expect(intermediateEnergy).toBe(160)
      expect(intermediateEnergy).toBeGreaterThan(reactantEnergy)

      // 催化步骤 2 (决速步): 160 -> 215 (Ea2 = 55)
      expect(catalyzedPeak2 - intermediateEnergy).toBe(eaForwardCatStep2)
      expect(eaForwardCatStep2).toBe(55)

      // 决速步活化能最大: Ea2 > Ea1
      expect(eaForwardCatStep2).toBeGreaterThan(eaForwardCatStep1)
      expect(maxCatEa).toBe(eaForwardCatStep2)
      expect(maxCatEa).toBeLessThan(eaForwardUncat)

      // TS2 既是活化能最大步，也是催化路径视觉最高峰 (215 > 190)
      expect(catalyzedPeak2).toBeGreaterThan(catalyzedPeak1)

      // 表观活化能 = 最高过渡态 - 反应物基准 = 215 - 150 = 65 kJ/mol
      // 注意与"决速步能垒 55（相对中间体 160）"参照基准不同，二者不可混用
      expect(apparentCatEa).toBe(catalyzedPeak2 - reactantEnergy)
      expect(apparentCatEa).toBe(65)
      expect(apparentCatEa).toBeGreaterThan(eaForwardCatStep2)
      expect(apparentCatEa).toBeLessThan(eaForwardUncat)

      // 催化剂不改变反应热 ΔH
      expect(productEnergy - reactantEnergy).toBe(deltaH)
      expect(deltaH).toBe(-90)
    })
  })
})
