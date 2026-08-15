import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGasChainChemistry } from '../hooks/useGasChainChemistry'
import type { GasChainParams } from '../types'

describe('GasChainChemistry — 母题六 气体制备装置链化学核查测试', () => {
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

    it('C2H4 误用浓硫酸干燥触发氧化加成警告与阻断', () => {
      const h2so4Params: GasChainParams = {
        ...c2h4Params,
        washingSteps: [
          { id: 's1', device: 'wash-bottle', reagent: 'naoh', role: 'purify' },
          { id: 's2', device: 'acid-bottle', reagent: 'conc-h2so4', role: 'dry' },
        ],
      }
      const { result } = renderHook(() => useGasChainChemistry(h2so4Params))
      expect(result.current.hasDangerAlert).toBe(true)
      expect(result.current.dangerType).toBe('clogging')
      expect(result.current.issues.some((i) => i.id === 'dryer-c2h4-h2so4-wrong')).toBe(true)
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
})
