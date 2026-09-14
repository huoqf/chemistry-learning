import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIndustrialFlowChemistry } from '../hooks/useIndustrialFlowChemistry'
import type { IndustrialFlowParams, IndustrialFlowSystemId } from '../types'
import { scanEquations, type EquationEntry } from '@/data/__tests__/helpers/equationBalance'
import { isBalanceWhitelisted } from '@/data/__tests__/helpers/balanceWhitelist'

/**
 * 母题七：无机工艺流程的方程式守恒扫描（审查项 G7）。
 *
 * 原 `equationsBalanceScan.test.ts` 只扫描价类二维图，工艺流程全部 8 个体系、
 * 4 个工序的 `coreReaction` 以及调 pH 试剂的 `reaction` 均无守恒校验。
 * 本文件把共享扫描器接入该模块——它能抓住“按体系分支时误用了另一体系的方程式”
 * 这类错误（例如 ni-co-li 工序二曾套用 Fe²⁺ 氧化的默认分支）。
 */

const SYSTEM_IDS: IndustrialFlowSystemId[] = [
  'fe-al-mn',
  'fe-cu-zn',
  'ti-fe',
  'ni-co-li',
  'mg-ca',
  'al-fe-si',
  'li-fe-p',
  'cu-fe',
]

const STEPS = [1, 2, 3, 4]

function buildParams(systemId: IndustrialFlowSystemId, activeStep: number): IndustrialFlowParams {
  return {
    viewMode: 0,
    systemId,
    activeStep,
    pH: 5.0,
    leachTemp: 60,
    crushSize: 'fine',
    oxidantAmount: 'sufficient',
    reagent: 'MnO',
    crystallizeMethod: 'cooling',
    washSolvent: 'water',
  }
}

describe('母题七：无机工艺流程方程式守恒扫描', () => {
  it('全部 8 个体系 × 4 个工序的 coreReaction 必须满足原子与电荷守恒', () => {
    const entries: EquationEntry[] = []

    for (const systemId of SYSTEM_IDS) {
      for (const activeStep of STEPS) {
        const { result } = renderHook(() => useIndustrialFlowChemistry(buildParams(systemId, activeStep)))
        const info = result.current.activeStepInfo
        if (info?.coreReaction) {
          entries.push({ source: `[${systemId}] step${activeStep}.coreReaction`, equation: info.coreReaction })
        }
      }
    }

    expect(entries.length, '未采集到任何 coreReaction，探测路径已失效').toBeGreaterThan(20)

    const issues = scanEquations(entries, isBalanceWhitelisted)
    expect(issues.map(i => `${i.source}: "${i.equation}" -> ${i.detail}`)).toEqual([])
  })

  it('调 pH 试剂的机理方程式（reaction）必须满足原子与电荷守恒', () => {
    const entries: EquationEntry[] = []

    for (const systemId of SYSTEM_IDS) {
      const { result } = renderHook(() => useIndustrialFlowChemistry(buildParams(systemId, 3)))
      result.current.reagentEvaluations.forEach(ev => {
        if (ev.reaction) {
          entries.push({ source: `[${systemId}] reagent(${ev.reagent}).reaction`, equation: ev.reaction })
        }
      })
    }

    const issues = scanEquations(entries, isBalanceWhitelisted)
    expect(issues.map(i => `${i.source}: "${i.equation}" -> ${i.detail}`)).toEqual([])
  })
})
