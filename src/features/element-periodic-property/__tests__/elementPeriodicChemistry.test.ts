import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useElementPeriodicChemistry } from '../hooks/useElementPeriodicChemistry'
import type { ElementPeriodicParams, OrbitalElectron } from '../types'
import { PERIODIC_ELEMENTS } from '../data/periodicData'

/**
 * 母题八：元素位-构-性推断与电子排布 守门测试
 *
 * 覆盖要点：
 *   1. 电子总数守恒（基态 + 激发态，Z = 1~30 全覆盖）
 *   2. 激发态"最外层 ns → 同层空 np（满则 (n+1)s）"跃迁模型
 *   3. `excitationShell` 与壳层图、轨道方框图三方同源（消除"两图模型打架"）
 *   4. Cr / Cu 洪特特例
 *   5. 每层电子数不超过 2n² 上限
 */

const baseParams: ElementPeriodicParams = {
  exploreMode: 'orbital-config',
  selectedAtomicNumber: 6,
  stateType: 'ground',
  periodFilter: 2,
  isoGroupFilter: '10e',
  inferenceId: '',
}

const hookAt = (z: number, stateType: 'ground' | 'excited') =>
  renderHook(() =>
    useElementPeriodicChemistry({ ...baseParams, selectedAtomicNumber: z, stateType })
  ).result.current

const electronSum = (boxes: OrbitalElectron[]) =>
  boxes.reduce((acc, b) => acc + b.electrons.length, 0)

const shellSum = (boxes: OrbitalElectron[], l: 's' | 'p' | 'd') =>
  boxes.filter((b) => b.l === l).reduce((acc, b) => acc + b.electrons.length, 0)

const countOf = (boxes: OrbitalElectron[], label: string) =>
  boxes.find((b) => b.label === label)?.electrons.length ?? 0

const ALL_Z = Object.keys(PERIODIC_ELEMENTS)
  .map(Number)
  .sort((a, b) => a - b)

describe('母题八：元素位-构-性 电子排布化学正确性守门', () => {
  it('1. 基态与激发态下核外电子总数恒等于原子序数 Z（Z = 1~30 全覆盖）', () => {
    expect(ALL_Z.length).toBeGreaterThanOrEqual(30)
    for (const z of ALL_Z) {
      for (const stateType of ['ground', 'excited'] as const) {
        const { currentElement, orbitalBoxes } = hookAt(z, stateType)
        expect(currentElement.z).toBe(z)
        expect(electronSum(orbitalBoxes)).toBe(z)
      }
    }
  })

  it('2. 基态不产生跃迁：excitationShell 必须为 null', () => {
    for (const z of ALL_Z) {
      expect(hookAt(z, 'ground').excitationShell).toBeNull()
    }
  })

  it('3. 激发态跃迁层 excitationShell 恒等于最外层（壳层图与方框图共用同一层）', () => {
    for (const z of ALL_Z) {
      const { currentElement, excitationShell, orbitalBoxes } = hookAt(z, 'excited')
      expect(excitationShell).not.toBeNull()
      // 主量子数 n 与"电子层数"一致（K=1, L=2, M=3, N=4），
      // 故壳层图索引 excitationShell-1 必落在最后一层，B 图不会各高亮一层
      expect(excitationShell).toBe(currentElement.electronLayers.length)
      // 跃迁发生的层必须确实少了 1 个电子（该层 ns 轨道被取走 1 个）
      const srcBox = orbitalBoxes.find((b) => b.n === excitationShell && b.l === 's')
      expect(srcBox).toBeDefined()
      expect(srcBox!.electrons.length).toBeLessThan(2)
    }
  })

  it('4. C (Z=6) 激发态：2s 由 2 → 1，2p 由 2 → 3（同层 np 接收电子）', () => {
    const ground = hookAt(6, 'ground')
    const excited = hookAt(6, 'excited')
    expect(electronSum(ground.orbitalBoxes)).toBe(6)
    expect(countOf(ground.orbitalBoxes, '2s')).toBe(2)
    expect(shellSum(ground.orbitalBoxes, 'p')).toBe(2)

    expect(countOf(excited.orbitalBoxes, '2s')).toBe(1)
    expect(shellSum(excited.orbitalBoxes, 'p')).toBe(3)
    expect(excited.excitationShell).toBe(2)
  })

  it('5. Na (Z=11) 激发态：3s 由 1 → 0，3p 由 0 → 1', () => {
    const excited = hookAt(11, 'excited')
    expect(countOf(excited.orbitalBoxes, '3s')).toBe(0)
    expect(shellSum(excited.orbitalBoxes, 'p')).toBe(7) // 2p⁶ + 3p¹
    expect(excited.excitationShell).toBe(3)
  })

  it('6. Ar (Z=18) 激发态：3s 已满的同层 np 无空位，跃迁落到 4s', () => {
    const ground = hookAt(18, 'ground')
    // 反例核验：Ar 的 s 轨共 6 个电子、p 轨共 12 个电子 ⇒ "p 轨电子数 = s 轨电子数"并非普遍规律
    expect(shellSum(ground.orbitalBoxes, 's')).toBe(6)
    expect(shellSum(ground.orbitalBoxes, 'p')).toBe(12)

    const excited = hookAt(18, 'excited')
    expect(countOf(excited.orbitalBoxes, '3s')).toBe(1)
    expect(countOf(excited.orbitalBoxes, '4s')).toBe(1)
    expect(excited.excitationShell).toBe(3)
    expect(electronSum(excited.orbitalBoxes)).toBe(18)
  })

  it('7. Cr (Z=24) 与 Cu (Z=29) 洪特规则特例：4s 均为 1 个电子，3d 分别为 5 / 10', () => {
    const cr = hookAt(24, 'ground')
    expect(countOf(cr.orbitalBoxes, '4s')).toBe(1)
    expect(shellSum(cr.orbitalBoxes, 'd')).toBe(5)
    expect(cr.currentElement.isHundSpecial).toBe(true)

    const cu = hookAt(29, 'ground')
    expect(countOf(cu.orbitalBoxes, '4s')).toBe(1)
    expect(shellSum(cu.orbitalBoxes, 'd')).toBe(10)
    expect(cu.currentElement.isHundSpecial).toBe(true)
  })

  it('8. 每个电子层的电子数不超过 2n² 上限（Z = 1~30 全覆盖，含激发态）', () => {
    for (const z of ALL_Z) {
      for (const stateType of ['ground', 'excited'] as const) {
        const { orbitalBoxes } = hookAt(z, stateType)
        const byShell = new Map<number, number>()
        orbitalBoxes.forEach((b) => {
          byShell.set(b.n, (byShell.get(b.n) ?? 0) + b.electrons.length)
        })
        byShell.forEach((count, n) => {
          expect(count).toBeLessThanOrEqual(2 * n * n)
        })
      }
    }
  })
})
