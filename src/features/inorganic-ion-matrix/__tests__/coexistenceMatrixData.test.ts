import { describe, it, expect } from 'vitest'
import {
  MATRIX_CATIONS,
  MATRIX_ANIONS,
  getIonPairCell,
  COEXISTENCE_RULE_CARDS,
  CONFLICT_CATEGORY_CONFIG,
} from '../data/coexistenceMatrixData'

describe('coexistenceMatrixData 离子共存互斥数据矩阵测试', () => {
  it('应包含完整的高中全集阳离子(14种)与阴离子(18种)，矩阵总数应为 252 个交叉单元格', () => {
    expect(MATRIX_CATIONS.length).toBe(14)
    expect(MATRIX_ANIONS.length).toBe(18)

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

    expect(cellCount).toBe(252)
  })

  it('应精确识别高考经典彻底双水解组合 (Al3+ + HCO3-, Fe3+ + CO32-, NH4+ + AlO2- 等)', () => {
    const alHco3 = getIonPairCell('Al3+', 'HCO3-')
    expect(alHco3.status).toBe('conflict')
    expect(alHco3.category).toBe('double-hydrolysis')
    expect(alHco3.equation).toContain('Al(OH)_3')

    const fe3Co3 = getIonPairCell('Fe3+', 'CO32-')
    expect(fe3Co3.status).toBe('conflict')
    expect(fe3Co3.category).toBe('double-hydrolysis')

    const nh4Alo2 = getIonPairCell('NH4+', 'AlO2-')
    expect(nh4Alo2.status).toBe('conflict')
    expect(nh4Alo2.category).toBe('double-hydrolysis')
  })

  it('应精确识别隐蔽氧化还原与酸性介质陷阱 (Fe2+ + NO3-, Fe3+ + I-, MnO4- + Fe2+, H+ + S2O32- 等)', () => {
    const fe2No3 = getIonPairCell('Fe2+', 'NO3-')
    expect(fe2No3.status).toBe('conflict')
    expect(fe2No3.category).toBe('acid-medium-trap')

    const fe3I = getIonPairCell('Fe3+', 'I-')
    expect(fe3I.status).toBe('conflict')
    expect(fe3I.category).toBe('redox')

    const fe2Mno4 = getIonPairCell('Fe2+', 'MnO4-')
    expect(fe2Mno4.status).toBe('conflict')
    expect(fe2Mno4.category).toBe('redox')

    const hS2o3 = getIonPairCell('H+', 'S2O32-')
    expect(hS2o3.status).toBe('conflict')
    expect(hS2o3.category).toBe('redox')
  })

  it('应精确识别典型不溶沉淀 (Ba2+ + SO42-, Ag+ + Cl-, Ca2+ + F-, Zn2+ + S2- 等)', () => {
    const baSo4 = getIonPairCell('Ba2+', 'SO42-')
    expect(baSo4.status).toBe('conflict')
    expect(baSo4.category).toBe('precipitate')

    const agCl = getIonPairCell('Ag+', 'Cl-')
    expect(agCl.status).toBe('conflict')
    expect(agCl.category).toBe('precipitate')

    const caF = getIonPairCell('Ca2+', 'F-')
    expect(caF.status).toBe('conflict')
    expect(caF.category).toBe('precipitate')

    const znS = getIonPairCell('Zn2+', 'S2-')
    expect(znS.status).toBe('conflict')
    expect(znS.category).toBe('precipitate')
  })

  it('全共存离子 (如 Na+ / K+ 与各类常见阴离子) 应判定为稳定共存', () => {
    MATRIX_ANIONS.forEach((a) => {
      const cellNa = getIonPairCell('Na+', a.id)
      expect(cellNa.status).toBe('coexist')
      expect(cellNa.category).toBe('none')

      const cellK = getIonPairCell('K+', a.id)
      expect(cellK.status).toBe('coexist')
      expect(cellK.category).toBe('none')
    })
  })

  it('四大高考口诀卡与分类配置应完整', () => {
    expect(COEXISTENCE_RULE_CARDS.length).toBe(4)
    expect(Object.keys(CONFLICT_CATEGORY_CONFIG).length).toBe(6)
  })
})
