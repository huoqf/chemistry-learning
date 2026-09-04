/**
 * src/features/electrochemical-twin/__tests__/electrochemicalTruthAuditor.test.ts
 *
 * 母题二：原电池 vs 电解池双对比解题工具
 * 高中化学学科真理性与新高考命题合规性自动化守门测试套件
 *
 * 核心守门规则：
 * 1. 经典双池电极反应式严格遵守原子守恒、电荷守恒与高中教材规范；
 * 2. 全钒液流二次电池充放电极性反转逻辑（放电负极=充电阴极，放电正极=充电阳极）；
 * 3. 质子交换膜与离子交换膜穿透方向（“阳往正阴、阴往负阳”）化学真理性；
 * 4. 法拉第电解定律定量计算：n(e⁻) = It/F = 2n(Cu) = 4n(O₂) = 2n(Cl₂)；
 * 5. 右屏化学量与知识点与左屏选项 100% 动态隔离，彻底杜绝跨模式不相干内容残留。
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useElectrochemicalTwin } from '../hooks/useElectrochemicalTwin'
import type { ElectrochemicalParams } from '../types'

describe('母题二：原电池 vs 电解池 高中化学学科真理与新高考合规守门审计', () => {
  // 基础参数模板
  const createParams = (overrides?: Partial<ElectrochemicalParams>): ElectrochemicalParams => ({
    mode: 0,
    batteryState: 0,
    membraneType: 1,
    currentAmp: 2.0,
    timeSec: 96.485, // 巧妙设定 t 使 Q = 2 * 96.485 = 192.97 C，刚好对应 n(e⁻) = 0.002 mol
    electrolyteConc: 1.0,
    showElectrons: 1,
    showIons: 1,
    showMembraneFlow: 1,
    ...overrides,
  })

  describe('1. 模式 0（经典双池基准）高中教材吻合度审计', () => {
    it('铜锌原电池：负极失电子氧化，正极得电子还原，电荷守恒且反应式配平无误', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 0 })))
      const details = result.current.cellDetails

      // 负极审计
      expect(details.leftElectrode.poleType).toBe('negative')
      expect(details.leftElectrode.reactionFormula).toContain('\\text{Zn} - 2e^-')
      expect(details.leftElectrode.phenomenon).toContain('锌片逐渐溶解')

      // 正极审计
      expect(details.rightElectrode.poleType).toBe('positive')
      expect(details.rightElectrode.reactionFormula).toContain('\\text{Cu}^{2+} + 2e^-')
      expect(details.rightElectrode.phenomenon).toContain('析出红色固体')

      // 盐桥微粒流动审计
      expect(details.membraneFunction).toContain('K⁺ 移向正极')
      expect(details.membraneFunction).toContain('Cl⁻ 移向负极')
    })

    it('外接硫酸铜电解池：阳极碳棒氧化析出氧气，阴极铜棒还原析出铜，化学计量比严格正确', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 0 })))
      const details = result.current.cellDetails

      expect(details.secondaryLeftElectrode?.poleType).toBe('anode')
      expect(details.secondaryLeftElectrode?.reactionFormula).toContain('2\\text{H}_2\\text{O} - 4e^- \\rightarrow \\text{O}_2')
      expect(details.secondaryRightElectrode?.poleType).toBe('cathode')
      expect(details.secondaryRightElectrode?.reactionFormula).toContain('\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}')
    })
  })

  describe('2. 模式 1（全钒液流二次电池）新高考充放电反转铁律审计', () => {
    it('放电模式（原电池）：负极 V²⁺ 氧化为 V³⁺，正极 VO₂⁺ 还原为 VO²⁺，质子向正极区移动', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 1, batteryState: 0 })))
      const details = result.current.cellDetails

      expect(details.cellType).toBe('galvanic')
      // 负极 V²⁺ - e⁻ = V³⁺
      expect(details.leftElectrode.reactionFormula).toContain('\\text{V}^{2+} - e^-')
      // 正极 VO₂⁺ + 2H⁺ + e⁻ = VO²⁺ + H₂O (严格配平电荷与氧原子)
      expect(details.rightElectrode.reactionFormula).toContain('\\text{VO}_2^+ + 2\\text{H}^+ + e^-')
      // 质子向正极移动
      expect(details.membraneFunction).toContain('向正极')
    })

    it('充电模式（电解池）：阴极 V³⁺ 还原为 V²⁺，阳极 VO²⁺ 氧化为 VO₂⁺，质子向阴极区移动', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 1, batteryState: 1 })))
      const details = result.current.cellDetails

      expect(details.cellType).toBe('electrolytic')
      // 阴极接电源负极：V³⁺ + e⁻ = V²⁺
      expect(details.leftElectrode.reactionFormula).toContain('\\text{V}^{3+} + e^-')
      // 阳极接电源正极：VO²⁺ + H₂O - e⁻ = VO₂⁺ + 2H⁺
      expect(details.rightElectrode.reactionFormula).toContain('\\text{VO}^{2+} + \\text{H}_2\\text{O} - e^-')
      // 质子向阴极移动
      expect(details.membraneFunction).toContain('向阴极')
    })

    it('同屏二次电池反转对照完整性：无论主状态为何，同时导出相反状态电极以支撑双态对比', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 1, batteryState: 0 })))
      const details = result.current.cellDetails

      expect(details.secondaryLeftElectrode).toBeDefined()
      expect(details.secondaryRightElectrode).toBeDefined()
      expect(details.secondaryOverallReaction).toContain('\\xrightarrow{\\text{充电}}')
    })
  })

  describe('3. 模式 2（工业离子交换膜与双极膜）膜选择透过性审计', () => {
    it('氯碱工业电解饱和食盐水：阳极析出 Cl₂，阴极析出 H₂ 并富集 NaOH，产气比严格为 1:1', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 2, membraneType: 1 })))
      const quant = result.current.quantResult
      const details = result.current.cellDetails

      expect(details.leftElectrode.reactionFormula).toContain('2\\text{Cl}^- - 2e^-')
      expect(details.rightElectrode.reactionFormula).toContain('2\\text{H}_2\\text{O} + 2e^-')

      // 两极产气体摩尔比 1:1，标准状况体积严格相等
      expect(quant.gasVolumeLeft).toBeGreaterThan(0)
      expect(quant.gasVolumeRight).toBeGreaterThan(0)
      expect(quant.gasVolumeLeft).toBe(quant.gasVolumeRight)
    })

    it('双极膜 (BPM) 模式：subtitle 与功能必须准确交代催化水分子解离', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 2, membraneType: 3 })))
      const details = result.current.cellDetails

      expect(details.subtitle).toContain('双极膜 BPM')
      expect(details.subtitle).toContain('H_2O')
      expect(details.subtitle).toContain('H^+')
    })
  })

  describe('4. 模式 3（法拉第电解定律）物理量与电子守恒严密计算审计', () => {
    it('法拉第定律：n(e⁻) = (I * t) / F，且转移电子摩尔数与铜沉积量、产氧量满足严谨系数关系', () => {
      // I = 2.0 A, t = 96.485 s => Q = 192.97 C => n(e⁻) = 192.97 / 96485 = 0.002 mol
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 3, currentAmp: 2.0, timeSec: 96.485 })))
      const quant = result.current.quantResult

      expect(quant.molesElectron).toBeCloseTo(0.002, 5)

      // 阴极析出 Cu: Cu²⁺ + 2e⁻ = Cu => n(Cu) = n(e⁻) / 2 = 0.001 mol
      // 质量增重 Δm(Cu) = 0.001 * 63.55 = 0.06355 ≈ 0.064 g
      expect(quant.molesProductRight).toBeCloseTo(0.001, 5)
      expect(quant.massChangeRight).toBeCloseTo(0.064, 3)

      // 阳极析出 O₂: 4OH⁻ - 4e⁻ = 2H₂O + O₂↑ => n(O₂) = n(e⁻) / 4 = 0.0005 mol
      // 标况气量 V(O₂) = 0.0005 * 22.4 = 0.0112 L
      expect(quant.molesProductLeft).toBeCloseTo(0.0005, 5)
      expect(quant.gasVolumeLeft).toBeCloseTo(0.011, 3)
    })
  })

  describe('5. 右屏化学量与模式的纯净隔离审计', () => {
    it('全钒液流电池 (模式 1) 下，电极质量变化严格为 0，无固相沉淀干扰', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 1 })))
      const quant = result.current.quantResult

      expect(quant.massChangeLeft).toBe(0)
      expect(quant.massChangeRight).toBe(0)
      expect(quant.gasVolumeLeft).toBe(0)
      expect(quant.gasVolumeRight).toBe(0)
    })

    it('工业氯碱电解 (模式 2) 下，电极质量变化严格为 0，仅产气与溶液富集', () => {
      const { result } = renderHook(() => useElectrochemicalTwin(createParams({ mode: 2 })))
      const quant = result.current.quantResult

      expect(quant.massChangeLeft).toBe(0)
      expect(quant.massChangeRight).toBe(0)
    })
  })
})
