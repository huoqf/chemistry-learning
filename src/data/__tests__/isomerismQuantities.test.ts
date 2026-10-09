/**
 * 同分异构体量面板守门测试（P0-5 回归锁）
 *
 * 原实现把 C₄H₈ 的 totalIsomers 直接填成 6（= 5 种构造异构体 + 顺/反-2-丁烯带来的
 * 1 个立体异构个体），却用「构造异构体数」这个 label 输出，
 * 等于把顺反异构算进了构造异构——直接与教材口径冲突。
 */

import { describe, it, expect } from 'vitest'
import type { ChemistryQuantity } from '../chemistryQuantities'
import { buildIsomerismQuantities } from '../quantities/structure/isomerism'

const find = (list: ChemistryQuantity[], key: string) =>
  list.find((item) => item.key === key)

describe('构造异构体数 vs 含立体异构总数（P0-5 回归锁）', () => {
  it('C₄H₈：构造异构体数为 5，含立体异构总数为 6', () => {
    const list = buildIsomerismQuantities({ isomerType: 4, selectedIndex: 0 })
    expect(find(list, 'isomerCount')?.value).toBe(5)
    expect(find(list, 'totalIsomerCount')?.value).toBe(6)
    expect(find(list, 'isomerCount')?.label).toBe('构造异构体数')
  })

  it('其余四个体系不含立体异构，两值相等', () => {
    const cases: Array<[number, number]> = [
      [0, 3], // 戊烷 C₅H₁₂
      [1, 7], // 丁醇 & 丁醚 C₄H₁₀O
      [2, 6], // C₃H₆O₂ 官能团异构
      [3, 5], // 芳香族 C₇H₈O
    ]
    for (const [isomerType, count] of cases) {
      const list = buildIsomerismQuantities({ isomerType, selectedIndex: 0 })
      expect(find(list, 'isomerCount')?.value).toBe(count)
      expect(find(list, 'totalIsomerCount')?.value).toBe(count)
    }
  })

  it('总量恒不小于构造异构体数（立体异构只会增加个体数，不会减少）', () => {
    for (const isomerType of [0, 1, 2, 3, 4]) {
      const list = buildIsomerismQuantities({ isomerType, selectedIndex: 0 })
      const constitutional = find(list, 'isomerCount')?.value as number
      const total = find(list, 'totalIsomerCount')?.value as number
      expect(total).toBeGreaterThanOrEqual(constitutional)
    }
  })

  it('顺/反-2-丁烯带来的额外个体恰为 1（即 2-丁烯的两种立体异构共用同一构造）', () => {
    const list = buildIsomerismQuantities({ isomerType: 4, selectedIndex: 1 })
    const constitutional = find(list, 'isomerCount')?.value as number
    const total = find(list, 'totalIsomerCount')?.value as number
    expect(total - constitutional).toBe(1)
    // 顺-2-丁烯只有 2 种等效氢（两个 CH₃ 等价、两个 =CH 等价）
    expect(find(list, 'equivalentH')?.value).toBe(2)
  })

  it('量面板不再用「分子体系」行重复占用异构体计数位（原 label 与实际语义不符）', () => {
    const list = buildIsomerismQuantities({ isomerType: 4, selectedIndex: 0 })
    expect(find(list, 'formula')).toBeUndefined()
  })
})
