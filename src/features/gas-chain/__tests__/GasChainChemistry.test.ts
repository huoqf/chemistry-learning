import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGasChainChemistry } from '../hooks/useGasChainChemistry'
import { GAS_MATRIX_ITEMS } from '../data/gasMatrixItems'
import { COLLECTION_DECISION_RULES } from '../data/gasDecisionModels'
import type { GasChainParams } from '../types'

describe('GasChainChemistry — 实验一 气体制备装置链化学核查测试', () => {
  // 1. NH3 体系测试
  describe('NH₃ 制备与防倒吸体系', () => {
    const defaultParams: GasChainParams = {
      viewMode: 0,
      systemId: 'nh3-prep',
      targetGas: 'NH₃',
      generator: 'testtube-heat',
      washingSteps: [
        { id: 's1', device: 'dry-tube', reagent: 'soda-lime', role: 'dry' },
      ],
      collection: 'downward-air',
      tailGas: 'inverted-funnel',
      flowRate: 50,
      temp: 110,
      heating: true,
      collectTubeMode: 'correct-short-in',
      funnelDepth: 'tangent',
    }

    it('默认 NH3 制备与防倒吸相切时为 100% 规范无误状态', () => {
      const { result } = renderHook(() => useGasChainChemistry(defaultParams))
      expect(result.current.hasDangerAlert).toBe(false)
      expect(result.current.gasPurity).toBe(100)
      expect(result.current.issues.some((i) => i.id === 'perfect-chain')).toBe(true)
    })

    it('显式切换向下排空气法为长进短出时，触发 collect-nh3-longin-wrong 错误告警', () => {
      const params: GasChainParams = {
        ...defaultParams,
        collectTubeMode: 'wrong-long-in',
      }
      const { result } = renderHook(() => useGasChainChemistry(params))
      const longInIssue = result.current.issues.find((i) => i.id === 'collect-nh3-longin-wrong')
      expect(longInIssue).toBeDefined()
      expect(longInIssue?.level).toBe('danger')
      expect(longInIssue?.title).toContain('长进短出')
    })

    it('显式切换防倒吸漏斗为探底下沉时，触发 funnel-deep-siphon-danger 倒吸警报', () => {
      const params: GasChainParams = {
        ...defaultParams,
        funnelDepth: 'deep',
      }
      const { result } = renderHook(() => useGasChainChemistry(params))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.dangerType).toBe('siphon')
      const deepIssue = result.current.issues.find((i) => i.id === 'funnel-deep-siphon-danger')
      expect(deepIssue).toBeDefined()
      expect(deepIssue?.level).toBe('danger')
    })

    it('干燥 NH₃ 误用浓硫酸或无水 CaCl₂ 触发阻断与化学警告', () => {
      const h2so4Params: GasChainParams = {
        ...defaultParams,
        washingSteps: [{ id: 's1', device: 'acid-bottle', reagent: 'conc-h2so4', role: 'dry' }],
      }
      const { result: h2so4Res } = renderHook(() => useGasChainChemistry(h2so4Params))
      expect(h2so4Res.current.hasDangerAlert).toBe(true)
      expect(h2so4Res.current.issues.some((i) => i.id === 'dryer-nh3-acid')).toBe(true)

      const cacl2Params: GasChainParams = {
        ...defaultParams,
        washingSteps: [{ id: 's1', device: 'dry-tube', reagent: 'cacl2', role: 'dry' }],
      }
      const { result: cacl2Res } = renderHook(() => useGasChainChemistry(cacl2Params))
      expect(cacl2Res.current.hasDangerAlert).toBe(true)
      expect(cacl2Res.current.issues.some((i) => i.id === 'dryer-nh3-cacl2')).toBe(true)
    })
  })

  // 2. Cl2 体系测试
  describe('Cl₂ 强氧化性体系', () => {
    const cl2Params: GasChainParams = {
      viewMode: 0,
      systemId: 'cl2-prep',
      targetGas: 'Cl₂',
      generator: 'flask-heat',
      washingSteps: [
        { id: 's1', device: 'wash-bottle', reagent: 'sat-nacl', role: 'purify' },
        { id: 's2', device: 'acid-bottle', reagent: 'conc-h2so4', role: 'dry' },
      ],
      collection: 'upward-air',
      tailGas: 'naoh-absorber',
      flowRate: 50,
      temp: 90,
      heating: true,
    }

    it('默认 Cl2 预设为规范满分状态', () => {
      const { result } = renderHook(() => useGasChainChemistry(cl2Params))
      expect(result.current.hasDangerAlert).toBe(false)
      expect(result.current.gasPurity).toBe(100)
    })

    it('洗气瓶管路接反（短进长出）触发喷溅警报', () => {
      const reversedParams: GasChainParams = {
        ...cl2Params,
        washingSteps: [
          { id: 's1', device: 'wash-bottle', reagent: 'sat-nacl', role: 'purify', reversed: true },
          { id: 's2', device: 'acid-bottle', reagent: 'conc-h2so4', role: 'dry' },
        ],
      }
      const { result } = renderHook(() => useGasChainChemistry(reversedParams))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.dangerType).toBe('splashing')
      expect(result.current.issues.some((i) => i.id === 'wash-reverse')).toBe(true)
    })

    it('Cl2 制备误用启普发生器触发化学逻辑错误', () => {
      const kippParams: GasChainParams = {
        ...cl2Params,
        generator: 'kipp',
      }
      const { result } = renderHook(() => useGasChainChemistry(kippParams))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.issues.some((i) => i.id === 'generator-cl2-kipp-wrong')).toBe(true)
    })
  })

  // 3. C2H4 体系测试
  describe('C₂H₄ 有机除杂体系', () => {
    const c2h4Params: GasChainParams = {
      viewMode: 0,
      systemId: 'c2h4-prep',
      targetGas: 'C₂H₄',
      generator: 'flask-heat',
      washingSteps: [
        { id: 's1', device: 'wash-bottle', reagent: 'naoh', role: 'purify' },
      ],
      collection: 'water-displacement',
      tailGas: 'none',
      flowRate: 50,
      temp: 170,
      heating: true,
    }

    it('默认 C2H4 预设为规范状态，纯度 100%', () => {
      const { result } = renderHook(() => useGasChainChemistry(c2h4Params))
      expect(result.current.hasDangerAlert).toBe(false)
      expect(result.current.gasPurity).toBe(100)
    })

    it('C2H4 误用酸性高锰酸钾洗气触发切断双键警告', () => {
      const kmno4Params: GasChainParams = {
        ...c2h4Params,
        washingSteps: [
          { id: 's1', device: 'wash-bottle', reagent: 'kmno4', role: 'purify' },
        ],
      }
      const { result } = renderHook(() => useGasChainChemistry(kmno4Params))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.issues.some((i) => i.id === 'c2h4-kmno4-wrong')).toBe(true)
    })

    it('C2H4 误用浓硫酸干燥触发氧化加成破坏警告', () => {
      const h2so4Params: GasChainParams = {
        ...c2h4Params,
        washingSteps: [
          { id: 's1', device: 'wash-bottle', reagent: 'naoh', role: 'purify' },
          { id: 's2', device: 'acid-bottle', reagent: 'conc-h2so4', role: 'dry' },
        ],
      }
      const { result } = renderHook(() => useGasChainChemistry(h2so4Params))
      expect(result.current.hasDangerAlert).toBe(true)
      // 乙烯遇浓硫酸为化学副反应破坏，非管道结晶堵塞
      expect(result.current.dangerType).not.toBe('clogging')
      expect(result.current.issues.some((i) => i.id === 'dryer-c2h4-h2so4-wrong')).toBe(true)
    })

    it('Cl2 误用排纯水法收集触发排饱和食盐水考点警示', () => {
      const cl2WaterParams: GasChainParams = {
        viewMode: 0,
        systemId: 'cl2-prep',
        targetGas: 'Cl₂',
        generator: 'flask-heat',
        washingSteps: [],
        collection: 'water-displacement',
        tailGas: 'naoh-absorber',
        flowRate: 50,
        temp: 25,
        heating: true,
      }
      const { result } = renderHook(() => useGasChainChemistry(cl2WaterParams))
      expect(result.current.issues.some((i) => i.id === 'collect-cl2-water-warning')).toBe(true)
      const cl2Issue = result.current.issues.find((i) => i.id === 'collect-cl2-water-warning')
      expect(cl2Issue?.description).toContain('排饱和食盐水法')
    })

    it('NH3 向上排空气法触发密度小于空气警告，且不产生管道堵塞', () => {
      const nh3UpParams: GasChainParams = {
        viewMode: 0,
        systemId: 'nh3-prep',
        targetGas: 'NH₃',
        generator: 'testtube-heat',
        washingSteps: [],
        collection: 'upward-air',
        tailGas: 'inverted-funnel',
        flowRate: 50,
        temp: 25,
        heating: true,
      }
      const { result } = renderHook(() => useGasChainChemistry(nh3UpParams))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.dangerType).not.toBe('clogging')
      expect(result.current.issues.some((i) => i.id === 'collect-nh3-upward-wrong')).toBe(true)
    })
  })

  // 4. NO / NO2 体系测试
  describe('NO / NO₂ 收集对比体系', () => {
    it('NO 用排空气法收集触发氧化为红棕色警报', () => {
      const noAirParams: GasChainParams = {
        viewMode: 0,
        systemId: 'no-no2-chain',
        targetGas: 'NO',
        generator: 'flask-noheat',
        washingSteps: [],
        collection: 'upward-air',
        tailGas: 'naoh-absorber',
        flowRate: 50,
        temp: 25,
        heating: false,
      }
      const { result } = renderHook(() => useGasChainChemistry(noAirParams))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.issues.some((i) => i.id === 'no-air-collect-wrong')).toBe(true)
      // 纯 NO 直接通入 NaOH 也应有警示
      expect(result.current.issues.some((i) => i.id === 'no-naoh-invalid')).toBe(true)
    })

    it('NO₂ 误用排水集气法触发与水反应警报', () => {
      const no2WaterParams: GasChainParams = {
        viewMode: 0,
        systemId: 'no-no2-chain',
        targetGas: 'NO₂',
        generator: 'flask-noheat',
        washingSteps: [],
        collection: 'water-displacement',
        tailGas: 'naoh-absorber',
        flowRate: 50,
        temp: 25,
        heating: false,
      }
      const { result } = renderHook(() => useGasChainChemistry(no2WaterParams))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.issues.some((i) => i.id === 'no2-water-collect-wrong')).toBe(true)
    })
  })

  // 5. CO₂ / C₂H₂ / SO₂ 核心净化试剂诊断测试
  describe('CO₂ / C₂H₂ / SO₂ 净化除杂试剂诊断', () => {
    it('CO₂ 误用 NaOH 溶液洗气触发完全吸收警报', () => {
      const params: GasChainParams = {
        viewMode: 0,
        systemId: 'custom',
        targetGas: 'CO₂',
        generator: 'kipp',
        washingSteps: [{ id: 's1', device: 'wash-bottle', reagent: 'naoh', role: 'purify' }],
        collection: 'upward-air',
        tailGas: 'none',
        flowRate: 50,
        temp: 25,
        heating: false,
      }
      const { result } = renderHook(() => useGasChainChemistry(params))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.issues.some((i) => i.id === 'co2-naoh-wrong')).toBe(true)
    })

    it('CO₂ 误用水洗气触发溶解损失警告', () => {
      const params: GasChainParams = {
        viewMode: 0,
        systemId: 'custom',
        targetGas: 'CO₂',
        generator: 'kipp',
        washingSteps: [{ id: 's1', device: 'wash-bottle', reagent: 'water', role: 'purify' }],
        collection: 'upward-air',
        tailGas: 'none',
        flowRate: 50,
        temp: 25,
        heating: false,
      }
      const { result } = renderHook(() => useGasChainChemistry(params))
      expect(result.current.issues.some((i) => i.id === 'co2-water-warning')).toBe(true)
    })

    it('C₂H₂ 误用 NaOH 洗气触发无法沉淀除硫警告', () => {
      const params: GasChainParams = {
        viewMode: 0,
        systemId: 'custom',
        targetGas: 'C₂H₂',
        generator: 'flask-noheat',
        washingSteps: [{ id: 's1', device: 'wash-bottle', reagent: 'naoh', role: 'purify' }],
        collection: 'water-displacement',
        tailGas: 'combustion',
        flowRate: 50,
        temp: 25,
        heating: false,
      }
      const { result } = renderHook(() => useGasChainChemistry(params))
      expect(result.current.issues.some((i) => i.id === 'c2h2-naoh-warning')).toBe(true)
    })

    it('SO₂ 误用 NaOH 洗气触发完全吸收警报', () => {
      const params: GasChainParams = {
        viewMode: 0,
        systemId: 'so2-chain',
        targetGas: 'SO₂',
        generator: 'flask-noheat',
        washingSteps: [{ id: 's1', device: 'wash-bottle', reagent: 'naoh', role: 'purify' }],
        collection: 'upward-air',
        tailGas: 'inverted-funnel',
        flowRate: 50,
        temp: 25,
        heating: false,
      }
      const { result } = renderHook(() => useGasChainChemistry(params))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.issues.some((i) => i.id === 'so2-naoh-wrong')).toBe(true)
    })
  })

  // ── 复审问题回归守卫（P1-G1 / P1-G2 / P1-G3 与两项 P2） ──
  describe('数据一致性与错误分类回归守卫', () => {
    const c2h4Params: GasChainParams = {
      viewMode: 0,
      systemId: 'c2h4-prep',
      targetGas: 'C₂H₄',
      generator: 'testtube-heat',
      washingSteps: [{ id: 's1', device: 'wash-bottle', reagent: 'naoh', role: 'purify' }],
      collection: 'water-displacement',
      tailGas: 'none',
      flowRate: 50,
      temp: 25,
      heating: false,
    }

    it('G1：乙烯遇浓硫酸属"目标气体被化学破坏"，不得归类为 clogging，也不得断流', () => {
      const params: GasChainParams = {
        ...c2h4Params,
        washingSteps: [{ id: 's1', device: 'dry-tube', reagent: 'conc-h2so4', role: 'dry' }],
      }
      const { result } = renderHook(() => useGasChainChemistry(params))

      // 必须仍然报警（危险确实存在），且被归入 danger 级 → hasDangerAlert 为真
      expect(result.current.issues.some((i) => i.id === 'dryer-c2h4-h2so4-wrong')).toBe(true)
      expect(result.current.hasDangerAlert).toBe(true)
      // 但机理是化学破坏（加成/碳化），不是物理堵塞；更不能把气路判成 0 流量。
      // dangerType 描述"气路物理失效模式"，浓硫酸破坏乙烯属化学层面，不得落入 clogging；
      // 气路本身未被堵塞，flowRateOut 必须保持 > 0（流出物只是不再是乙烯）。
      expect(result.current.dangerType).not.toBe('clogging')
      expect(result.current.flowRateOut).toBeGreaterThan(0)
    })

    it('G2：Cl₂ 溶解性必须为"能溶于水 (1:2)"，且排水法白名单覆盖 CO/CH₄/C₂H₂', () => {
      const cl2 = GAS_MATRIX_ITEMS.find((g) => g.formula === 'Cl₂')
      expect(cl2).toBeDefined()
      expect(cl2!.collectionReason).toContain('1:2')
      expect(cl2!.collectionReason).not.toContain('微溶于水')

      const waterDisplacement = COLLECTION_DECISION_RULES.find((m) => m.method.includes('排水'))
      expect(waterDisplacement).toBeDefined()
      for (const gas of ['CO', 'CH₄', 'C₂H₂']) {
        expect(
          waterDisplacement!.typicalGases.some((t) => t.includes(gas)),
          `排水法白名单漏了 ${gas}`
        ).toBe(true)
      }
    })

    it('G3：SO₂ 净化文案不得出现杂质清单以外的 HCl', () => {
      const so2 = GAS_MATRIX_ITEMS.find((g) => g.formula === 'SO₂')
      expect(so2).toBeDefined()
      expect(so2!.purifyReagent).not.toContain('HCl')
      // 净化目标必须落在杂质清单内（SO₃ / 水蒸气）
      expect(so2!.purifyReagent).toContain('SO₃')
    })

    it('P2：C₂H₂ 除 PH₃ 必须给出化学依据（Cu₃P₂ 难溶沉淀方程式）', () => {
      const c2h2 = GAS_MATRIX_ITEMS.find((g) => g.formula === 'C₂H₂')
      expect(c2h2).toBeDefined()
      expect(c2h2!.purifyPrinciple).toContain('PH₃')
      expect(c2h2!.purifyPrinciple).toContain('Cu₃P₂')
      expect(c2h2!.purifyPrinciple).toContain('NaOH')
    })

    it('P2：Cl₂ 净化说明必须点明"抑制 Cl₂ 与水反应"的平衡依据', () => {
      const cl2 = GAS_MATRIX_ITEMS.find((g) => g.formula === 'Cl₂')
      expect(cl2!.purifyPrinciple).toContain('同离子效应')
      expect(cl2!.purifyPrinciple).toContain('Cl₂ + H₂O')
    })
  })
})
