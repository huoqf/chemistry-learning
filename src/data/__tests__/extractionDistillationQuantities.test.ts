/**
 * 萃取分液量面板守门测试（P0-4 回归锁）
 *
 * 原实现的两处硬伤：
 *   ① `solvent === 0 ? 85 : 65` 未覆盖 solvent = 2（乙醇），乙醇落进苯的 fallback，
 *      右屏照常显示「分配系数 K = 65」「单级萃取率 ≈ 96%」——而乙醇与水互溶、
 *      根本不存在两相界面，这两个数都是凭空捏造。
 *   ② 量面板用平衡式、右屏图表用 `0.10 − 0.092p` 经验拟合式，同一时刻数值互相打架。
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ChemistryQuantity } from '../chemistryQuantities'
import { buildExtractionDistillationQuantities } from '../quantities/experiment/extraction-distillation'
import { useExtractionDistillationChemistry } from '@/features/experiment/extraction-distillation/hooks/useExtractionDistillationChemistry'
import {
  IODINE_PARTITION_BENZENE,
  IODINE_PARTITION_CCL4,
  IODINE_WATER_INITIAL_CONC,
  IODINE_WATER_VOLUME_ML,
  extractionEquilibrium,
} from '@/chemistry'

const find = (list: ChemistryQuantity[], key: string) =>
  list.find((item) => item.key === key)

/** 达平衡时刻：振荡起于 2.0s、历时 3.2s，取 12s 确保已完全平衡 */
const EQUILIBRIUM_TIME = 12

describe('萃取量面板：溶剂分支正确性（P0-4 回归锁）', () => {
  it('乙醇（互溶反例）不得给出分配系数 K，也不得给出正萃取率', () => {
    const list = buildExtractionDistillationQuantities(
      { experimentMode: 0, solvent: 2, vSolvent: 20 },
      EQUILIBRIUM_TIME
    )

    // 不存在两相分配 → 不得出现 K、水相/有机相浓度
    expect(find(list, 'K')).toBeUndefined()
    expect(find(list, 'cAq')).toBeUndefined()
    expect(find(list, 'cOrg')).toBeUndefined()

    // 萃取率必须为 0 且显式标注「不适用」
    expect(find(list, 'E')?.value).toBe(0)
    expect(find(list, 'E')?.label).toContain('不适用')

    // 静置只有一相，碘被稀释为均一相
    expect(find(list, 'phaseCount')?.value).toBe(1)
    expect(find(list, 'cUniform')).toBeDefined()
  })

  it('CCl₄ / 苯：静置分两层，且各量与解析式一致', () => {
    const cases: Array<[number, number]> = [
      [0, IODINE_PARTITION_CCL4],
      [1, IODINE_PARTITION_BENZENE],
    ]
    for (const [solvent, k] of cases) {
      const list = buildExtractionDistillationQuantities(
        { experimentMode: 0, solvent, vSolvent: 20 },
        EQUILIBRIUM_TIME
      )
      const expected = extractionEquilibrium(
        IODINE_WATER_INITIAL_CONC,
        IODINE_WATER_VOLUME_ML,
        20,
        k
      )
      expect(find(list, 'phaseCount')?.value).toBe(2)
      expect(find(list, 'K')?.value).toBe(k)
      expect(find(list, 'cAq')?.value).toBeCloseTo(expected.aqueous, 4)
      expect(find(list, 'cOrg')?.value).toBeCloseTo(expected.organic, 4)
      expect(find(list, 'E')?.value).toBeCloseTo(expected.rate * 100, 1)
    }
  })

  it('量面板与右屏图表（hook）在达平衡后给出相同的两相浓度', () => {
    for (const solvent of [0, 1]) {
      const params = { experimentMode: 0, solvent, vSolvent: 30 }
      const list = buildExtractionDistillationQuantities(params, EQUILIBRIUM_TIME)
      const { result } = renderHook(() =>
        useExtractionDistillationChemistry({ ...params, time: EQUILIBRIUM_TIME })
      )
      const history = result.current.chartHistory
      const last = history[history.length - 1]
      expect(last.val1).toBeCloseTo(find(list, 'cAq')?.value ?? NaN, 4)
      expect(last.val2).toBeCloseTo(find(list, 'cOrg')?.value ?? NaN, 4)
    }
  })

  it('乙醇模式下图表不含独立有机相（c(org) 恒为 0）', () => {
    const { result } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 0,
        solvent: 2,
        vSolvent: 20,
        time: EQUILIBRIUM_TIME,
      })
    )
    for (const point of result.current.chartHistory) {
      expect(point.val2).toBe(0)
      // 均一相浓度恒为稀释后的值，且始终低于初始碘水浓度
      expect(point.val1).toBeLessThan(IODINE_WATER_INITIAL_CONC)
      expect(point.val1).toBeGreaterThan(0)
    }
  })

  it('容器规格变化时相数判定不随体积漂移', () => {
    for (const vSolvent of [10, 30, 50]) {
      const ccl4 = buildExtractionDistillationQuantities(
        { experimentMode: 0, solvent: 0, vSolvent },
        EQUILIBRIUM_TIME
      )
      const ethanol = buildExtractionDistillationQuantities(
        { experimentMode: 0, solvent: 2, vSolvent },
        EQUILIBRIUM_TIME
      )
      expect(find(ccl4, 'phaseCount')?.value).toBe(2)
      expect(find(ethanol, 'phaseCount')?.value).toBe(1)
    }
  })
})
