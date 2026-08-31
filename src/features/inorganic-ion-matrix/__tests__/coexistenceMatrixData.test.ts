import { describe, it, expect } from 'vitest'
import {
  MATRIX_CATIONS,
  MATRIX_ANIONS,
  getIonPairCell,
  COEXISTENCE_RULE_CARDS,
  CONFLICT_CATEGORY_CONFIG,
} from '../data/coexistenceMatrixData'

describe('coexistenceMatrixData 离子共存互斥数据矩阵测试', () => {
  it('应包含完整的高频阳离子(11种)与阴离子(12种)，矩阵总数应为 132 个交叉单元格', () => {
    expect(MATRIX_CATIONS.length).toBe(11)
    expect(MATRIX_ANIONS.length).toBe(12)

    let cellCount = 0
    MATRIX_CATIONS.forEach((c) => {
      MATRIX_ANIONS.forEach((a) => {
        const cell = getIonPairCell(c.id, a.id)
        expect(cell).toBeDefined()
        expect(cell.cationId).toBe(c.id)
        expect(cell.anionId).toBe(a.id)
        expect(['coexist', 'conflict']).toContain(cell.status)
        cellCount++
      })
    })

    expect(cellCount).toBe(132)
  })

  it('应精确识别高考经典彻底双水解组合 (Al3+ + HCO3-, Fe3+ + CO32- 等)', () => {
    const alHco3 = getIonPairCell('Al3+', 'HCO3-')
    expect(alHco3.status).toBe('conflict')
    expect(alHco3.category).toBe('double-hydrolysis')
    expect(alHco3.equation).toContain('Al(OH)_3')

    const fe3Co3 = getIonPairCell('Fe3+', 'CO32-')
    expect(fe3Co3.status).toBe('conflict')
    expect(fe3Co3.category).toBe('double-hydrolysis')
  })

  it('应精确识别隐蔽氧化还原与酸性介质陷阱 (Fe2+ + NO3-, Fe3+ + I- 等)', () => {
    const fe2No3 = getIonPairCell('Fe2+', 'NO3-')
    expect(fe2No3.status).toBe('conflict')
    expect(fe2No3.category).toBe('acid-medium-trap')

    const fe3I = getIonPairCell('Fe3+', 'I-')
    expect(fe3I.status).toBe('conflict')
    expect(fe3I.category).toBe('redox')
  })

  it('应精确识别典型不溶沉淀 (Ba2+ + SO42-, Ag+ + Cl- 等)', () => {
    const baSo4 = getIonPairCell('Ba2+', 'SO42-')
    expect(baSo4.status).toBe('conflict')
    expect(baSo4.category).toBe('precipitate')

    const agCl = getIonPairCell('Ag+', 'Cl-')
    expect(agCl.status).toBe('conflict')
    expect(agCl.category).toBe('precipitate')
  })

  it('全共存离子 (如 Na+/K+ 与各类常见阴离子) 应判定为稳定共存', () => {
    MATRIX_ANIONS.forEach((a) => {
      const cell = getIonPairCell('Na+/K+', a.id)
      expect(cell.status).toBe('coexist')
      expect(cell.category).toBe('none')
    })
  })

  it('四大高考口诀卡与分类配置应完整', () => {
    expect(COEXISTENCE_RULE_CARDS.length).toBe(4)
    expect(Object.keys(CONFLICT_CATEGORY_CONFIG).length).toBe(6)
  })
})
