import { describe, it, expect } from 'vitest'
import { ION_DATA, COEXISTENCE_CONFLICTS } from '../constants'

describe('无机离子特征检验与共存排斥矩阵数据审计', () => {
  it('应包含 16 种新高考核心阴阳离子 (8 阳离子 + 8 阴离子)', () => {
    expect(ION_DATA.length).toBe(16)

    const cations = ION_DATA.filter((i) => i.type === 'cation')
    const anions = ION_DATA.filter((i) => i.type === 'anion')

    expect(cations.length).toBe(8)
    expect(anions.length).toBe(8)

    const cationIds = cations.map((i) => i.id)
    expect(cationIds).toEqual(
      expect.arrayContaining(['Fe3+', 'Fe2+', 'Cu2+', 'Al3+', 'NH4+', 'Ba2+', 'Ag+', 'Mg2+'])
    )

    const anionIds = anions.map((i) => i.id)
    expect(anionIds).toEqual(
      expect.arrayContaining(['SO42-', 'Cl-', 'Br-', 'I-', 'CO32-', 'SO32-', 'S2-', 'NO3-'])
    )
  })

  it('每种离子的特效试剂、现象、方程式与高考标准答题句式必须完整且规范', () => {
    ION_DATA.forEach((ion) => {
      expect(ion.name).toBeTruthy()
      expect(ion.formula).toBeTruthy()
      expect(ion.colorInSolution).toBeTruthy()
      expect(ion.colorRgb).toBeTruthy()
      expect(ion.testReagent).toBeTruthy()
      expect(ion.testPhenomenon).toBeTruthy()
      expect(ion.testEquation).toBeTruthy()
      expect(ion.interference).toBeTruthy()
      expect(ion.standardProcedure.length).toBeGreaterThan(15) // 规范答题必须详尽
    })
  })

  it('共存互斥规则库必须覆盖生成沉淀、氧化还原、剧烈双水解等 5 大维度', () => {
    const types = COEXISTENCE_CONFLICTS.map((c) => c.type)
    expect(types).toContain('precipitate')
    expect(types).toContain('redox')
    expect(types).toContain('double-hydrolysis')
    expect(types).toContain('weak-electrolyte')

    // 经典互斥测试
    const alCo3 = COEXISTENCE_CONFLICTS.find(
      (c) =>
        (c.ionA === 'Al3+' && c.ionB === 'CO32-') || (c.ionA === 'CO32-' && c.ionB === 'Al3+')
    )
    expect(alCo3).toBeDefined()
    expect(alCo3?.type).toBe('double-hydrolysis')

    const fe3I = COEXISTENCE_CONFLICTS.find(
      (c) => (c.ionA === 'Fe3+' && c.ionB === 'I-') || (c.ionA === 'I-' && c.ionB === 'Fe3+')
    )
    expect(fe3I).toBeDefined()
    expect(fe3I?.type).toBe('redox')
  })
})
