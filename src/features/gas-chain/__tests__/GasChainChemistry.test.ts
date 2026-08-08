import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGasChainChemistry } from '../hooks/useGasChainChemistry'
import type { GasChainParams } from '../types'

describe('GasChainChemistry — 母题六 NH3 收集与防倒吸测试', () => {
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
})
