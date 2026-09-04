import { describe, it, expect } from 'vitest'
import {
  MECHANISM_GROUPS,
  MECHANISM_ITEMS_FLAT,
  findMechanismItem,
} from '../data/mechanismGridData'

describe('新高考 4 大互斥维度九宫格数据完整性测试', () => {
  it('应包含恰好 4 大互斥维度专题', () => {
    expect(MECHANISM_GROUPS).toHaveLength(4)
    const dimensionIds = MECHANISM_GROUPS.map((g) => g.id)
    expect(dimensionIds).toEqual([
      'double-hydrolysis',
      'redox-hidden',
      'precipitate-trap',
      'gas-weak-acid',
    ])
  })

  it('每个专题应包含 6~8 个核心母题芯片，全集共 28 组', () => {
    for (const group of MECHANISM_GROUPS) {
      expect(group.items.length).toBeGreaterThanOrEqual(6)
      expect(group.items.length).toBeLessThanOrEqual(8)
    }
    expect(MECHANISM_ITEMS_FLAT).toHaveLength(28)
  })

  it('所有核心母题芯片字段应完备合规', () => {
    for (const item of MECHANISM_ITEMS_FLAT) {
      expect(item.id).toBeTruthy()
      expect(item.cationId).toBeTruthy()
      expect(item.anionId).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.productSummary).toBeTruthy()
      expect(item.phenomenon).toBeTruthy()
      expect(item.equation).toBeTruthy()
      expect(item.mechanismReason).toBeTruthy()
      expect(item.examTrap).toBeTruthy()
      expect(['必考', '高频', '易错', '压轴']).toContain(item.tag)
    }
  })

  it('findMechanismItem 应能准确双向查找到指定离子对', () => {
    const foamItem = findMechanismItem('Al3+', 'HCO3-')
    expect(foamItem).toBeDefined()
    expect(foamItem?.productSummary).toContain('Al(OH)₃↓ + CO₂↑')

    // 反向查找
    const reverseItem = findMechanismItem('HCO3-', 'Al3+')
    expect(reverseItem).toEqual(foamItem)

    // 隐蔽氧化还原
    const redoxItem = findMechanismItem('Fe2+', 'NO3-')
    expect(redoxItem).toBeDefined()
    expect(redoxItem?.title).toContain('NO₃⁻(H⁺)')

    // 歧化
    const disproportionationItem = findMechanismItem('H+', 'S2O32-')
    expect(disproportionationItem).toBeDefined()
    expect(disproportionationItem?.productSummary).toContain('S↓')
  })
})
