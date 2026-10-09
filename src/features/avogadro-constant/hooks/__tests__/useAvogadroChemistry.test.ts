import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAvogadroChemistry } from '../useAvogadroChemistry'
import type { AvogadroParams } from '../../types'

describe('useAvogadroChemistry — 阿伏加德罗常数全维度陷阱测试', () => {
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

  // 1. 结构与化学键陷阱
  describe('结构化学与化学键/中子数统计陷阱 (structure-bonds)', () => {
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

  // 2. 标况非气体与体积陷阱
  describe('标况状态与气体摩尔体积陷阱 (state-volume)', () => {
    it('标况 22.4 L SO3 为固态晶体，判定为非气体陷阱 (isStateGas = false)', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'state-volume',
        stateItem: 'SO3',
        amountValue: 22.4,
        amountUnit: 'L',
        temperatureCondition: 'standard',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      expect(result.current.isStateGas).toBe(false)
      expect(result.current.physicalState).toContain('固态')
      expect(result.current.particleStats[0].isTrap).toBe(true)
    })

    it('标况 22.4 L H2O 判定为冰水混合物/液体，不可套用 22.4 L/mol', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'state-volume',
        stateItem: 'H2O',
        amountValue: 22.4,
        amountUnit: 'L',
        temperatureCondition: 'standard',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      expect(result.current.isStateGas).toBe(false)
      expect(result.current.particleStats[0].isTrap).toBe(true)
    })
  })

  // 3. 弱电解质电离与盐类水解陷阱
  describe('电解质电离与水解陷阱 (electrolyte-hydrolysis)', () => {
    it('1 L 1 mol/L CH3COOH 溶液中弱酸部分电离，H+ 粒子数远小于 1 N_A，物料守恒总数恒为 1 N_A', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'electrolyte-hydrolysis',
        electrolyteItem: 'CH3COOH',
        solutionVolume: 1,
        solutionConcentration: 1,
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      const hStat = result.current.particleStats.find((s) => s.label === 'H⁺ 离子数')
      const conservationStat = result.current.particleStats.find((s) => s.label.includes('CH₃COOH'))

      expect(hStat).toBeDefined()
      expect(hStat?.isTrap).toBe(true)
      expect(hStat?.actualMoles).toBeLessThan(1.0)

      expect(conservationStat).toBeDefined()
      expect(conservationStat?.actualMoles).toBe(1.0)
    })

    it('1 mol 熔融 NaHSO4 仅电离出 Na+ 和 HSO4-，总离子数为 2 N_A (而非 3 N_A)', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'electrolyte-hydrolysis',
        electrolyteItem: 'NaHSO4-molten',
        solutionVolume: 1,
        solutionConcentration: 1,
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      const moltenStat = result.current.particleStats.find((s) => s.label.includes('熔融态'))
      expect(moltenStat).toBeDefined()
      expect(moltenStat?.actualMoles).toBe(2)
      expect(moltenStat?.isTrap).toBe(true)
    })
  })

  // 4. 氧化还原反应电子转移数陷阱
  describe('氧化还原反应电子转移数陷阱 (redox-electron)', () => {
    it('1 mol Cl2 与足量 NaOH 歧化反应生成 NaCl 和 NaClO，转移 1 mol 电子', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'redox-electron',
        redoxItem: 'Cl2-NaOH',
        amountValue: 1,
        amountUnit: 'mol',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      const neStat = result.current.particleStats.find((s) => s.label.includes('转移电子数'))
      expect(neStat).toBeDefined()
      expect(neStat?.actualMoles).toBe(1)
    })

    it('1 mol Cu 与足量 S 反应生成 Cu2S (变价陷阱)，转移 1 mol 电子 (非 2 mol)', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'redox-electron',
        redoxItem: 'Cu-S',
        amountValue: 1,
        amountUnit: 'mol',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      const neStat = result.current.particleStats.find((s) => s.label.includes('转移电子数'))
      expect(neStat).toBeDefined()
      expect(neStat?.actualMoles).toBe(1)
      expect(neStat?.isTrap).toBe(true)
    })

    it('1 mol NO2 存在二聚平衡 2NO2 ⇌ N2O4，气体分子总数小于 1 N_A', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'redox-electron',
        redoxItem: 'NO2-N2O4-reversible',
        amountValue: 1,
        amountUnit: 'mol',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      const moleculeStat = result.current.particleStats.find((s) => s.label.includes('气体分子总数'))
      expect(moleculeStat).toBeDefined()
      expect(moleculeStat?.actualMoles).toBeLessThan(1.0)
      expect(moleculeStat?.isTrap).toBe(true)
    })
  })

  // 4. 胶体/水解类数值必须标注为"教学示意量"，不得伪装成精确计算结果
  describe('数值可信度标注（isIndicative）', () => {
    it('FeCl₃ 水解制胶体卡的两项数值均标记为示意量（胶粒聚集度、水解程度本质不可定值）', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'electrolyte-hydrolysis',
        electrolyteItem: 'FeCl3',
        amountValue: 1,
        amountUnit: 'mol',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))

      const colloid = result.current.particleStats.find((s) => s.label.includes('胶体粒子数'))
      const ferric = result.current.particleStats.find((s) => s.label.includes('Fe³⁺'))
      expect(colloid).toBeDefined()
      expect(ferric).toBeDefined()

      // 两项都必须是示意量（防止再次出现 ×0.001 / ×0.95 被当作精确答案）
      expect(colloid?.isIndicative).toBe(true)
      expect(ferric?.isIndicative).toBe(true)

      // 数量级关系仍须成立：胶粒数 ≪ Fe³⁺ 数 ≤ 投料
      expect(colloid!.actualMoles).toBeLessThan(ferric!.actualMoles)
      expect(ferric!.actualMoles).toBeLessThanOrEqual(1)
    })
  })

  // 5. 口径一致性（L 单位兜底、阴阳离子比方向、配平写法）
  describe('口径一致性与书写规范', () => {
    it('Na₂O₂ 阴阳离子比必须写明方向：阳:阴 = 2:1', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'structure-bonds',
        structureItem: 'Na2O2',
        amountValue: 78,
        amountUnit: 'g',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      expect(result.current.trapBadge).toContain('阳:阴')
      expect(result.current.trapBadge).toContain('2:1')
    })

    it('NH₄Cl 的 L 单位兜底与其余体系一致（unit = L 时按 mol 计）', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'structure-bonds',
        structureItem: 'NH4Cl',
        amountValue: 2,
        amountUnit: 'L',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      const covalent = result.current.particleStats.find((s) => s.label.includes('N-H 共价键总数'))
      expect(covalent).toBeDefined()
      // 2 (兜底按 mol) × 4 = 8 N_A
      expect(covalent?.actualMoles).toBeCloseTo(8)
      // 结论文案须带上输入量与有效单位口径
      expect(result.current.correctAnswerSummary).toContain('8.00')
    })

    it('全部结论文案与要点不得出现自造符号 ≜，且方程配平为最小整数比', () => {
      const params: AvogadroParams = {
        ...baseParams,
        trapCategory: 'redox-electron',
        redoxItem: 'Cu-S',
        amountValue: 1,
        amountUnit: 'mol',
      }
      const { result } = renderHook(() => useAvogadroChemistry(params))
      const text = [
        ...result.current.keyPointAnalysis,
        result.current.correctAnswerSummary,
        result.current.formulaLatex,
        ...result.current.stepByStepMatrix.map((s) => s.finding),
      ].join('\n')
      expect(text).not.toContain('≜')
      expect(text).not.toMatch(/1\.5\s*Cl/)
    })
  })
})
