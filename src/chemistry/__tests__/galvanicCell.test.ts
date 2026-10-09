/**
 * 原电池模型单元测试（@/chemistry/galvanicCell）
 *
 * 守门目标 —— P1-6 / P1-7 回归锁：
 *   · P1-7「单槽 Zn-稀 H₂SO₄」的 E° 是 0.76 V（正极析氢），
 *     与丹尼尔电池的 1.10 V（正极镀铜）是两个不同的数，
 *     原实现在两处都把单槽写成 1.10 V。
 *   · P1-6 氢氧燃料电池在碱性/酸性介质下关键离子（OH⁻ / H⁺）的净变化都为 0，
 *     浓度只受生成水稀释，两种介质必须给出同一个结果；
 *     原实现碱性写死 1.0、酸性按伪系数 ne×0.1 下降。
 */

import { describe, it, expect } from 'vitest'
import { ELECTROLYTE_INITIAL_CONC } from '../electrochemical'
import {
  CELL_EMF_DANIELL,
  CELL_EMF_HYDROGEN_OXYGEN,
  CELL_EMF_LEAD_ACID,
  CELL_EMF_SINGLE_ZN_H2SO4,
  GALVANIC_CELL,
  galvanicCellState,
} from '../galvanicCell'

const NE_SAMPLE = 0.0077732 // I = 1.5 A、t = 10 s 时的 n(e⁻)

describe('标准电动势常量', () => {
  it('单槽 Zn-稀H₂SO₄ 为 0.76 V，丹尼尔电池为 1.10 V，两者不可混用', () => {
    expect(CELL_EMF_SINGLE_ZN_H2SO4).toBe(0.76)
    expect(CELL_EMF_DANIELL).toBe(1.1)
    expect(CELL_EMF_SINGLE_ZN_H2SO4).not.toBe(CELL_EMF_DANIELL)
    // 差值应恰为 Cu²⁺/Cu 与 H⁺/H₂ 的标准电极电势差 0.34 V
    expect(CELL_EMF_DANIELL - CELL_EMF_SINGLE_ZN_H2SO4).toBeCloseTo(0.34, 10)
  })

  it('氢氧燃料电池 1.23 V、铅蓄电池 2.04 V', () => {
    expect(CELL_EMF_HYDROGEN_OXYGEN).toBe(1.23)
    expect(CELL_EMF_LEAD_ACID).toBe(2.04)
  })
})

describe('cellType = 0 单槽 Zn | 稀 H₂SO₄ | Cu', () => {
  it('输出电压为 0.76 V（不是丹尼尔电池的 1.10 V）', () => {
    const state = galvanicCellState(GALVANIC_CELL.singleCellZnH2SO4, NE_SAMPLE)
    expect(state.voltage).toBe(0.76)
  })

  it('Cu 作惰性电极不参与反应，正极质量变化为 0', () => {
    const state = galvanicCellState(GALVANIC_CELL.singleCellZnH2SO4, NE_SAMPLE)
    expect(state.cathodeMassDelta).toBe(0)
    expect(state.anodeMassDelta).toBeLessThan(0)
  })

  it('每 2 mol e⁻ 溶解 65.38 g Zn', () => {
    const state = galvanicCellState(GALVANIC_CELL.singleCellZnH2SO4, 2)
    expect(state.anodeMassDelta).toBeCloseTo(-65.38, 6)
  })
})

describe('cellType = 1 丹尼尔电池', () => {
  it('输出电压 1.10 V，两极质量变化遵循 65.38 : 63.55', () => {
    const state = galvanicCellState(GALVANIC_CELL.daniell, NE_SAMPLE)
    expect(state.voltage).toBe(1.1)
    expect(Math.abs(state.anodeMassDelta) / 65.38).toBeCloseTo(state.cathodeMassDelta / 63.55, 10)
  })
})

describe('cellType = 2 氢氧燃料电池', () => {
  it('两极质量均不改变，输出电压 1.23 V', () => {
    const state = galvanicCellState(GALVANIC_CELL.hydrogenOxygen, NE_SAMPLE)
    expect(state.anodeMassDelta).toBe(0)
    expect(state.cathodeMassDelta).toBe(0)
    expect(state.voltage).toBe(1.23)
  })

  it('关键离子浓度只被生成水稀释，始终略低于初值且不崩到很低', () => {
    const state = galvanicCellState(GALVANIC_CELL.hydrogenOxygen, NE_SAMPLE)
    expect(state.concentration).toBeLessThan(ELECTROLYTE_INITIAL_CONC)
    // 每 4 mol e⁻ 只生成 2 mol H₂O，稀释效应在万分之一量级
    expect(state.concentration).toBeGreaterThan(ELECTROLYTE_INITIAL_CONC * 0.999)
  })

  it('n(e⁻) = 0 时浓度回到初值', () => {
    const state = galvanicCellState(GALVANIC_CELL.hydrogenOxygen, 0)
    expect(state.concentration).toBeCloseTo(ELECTROLYTE_INITIAL_CONC, 12)
  })
})

describe('cellType = 3 铅蓄电池放电', () => {
  it('两极均生成 PbSO₄ 而增重，增重比 96.1 : 64.1', () => {
    const state = galvanicCellState(GALVANIC_CELL.leadAcid, NE_SAMPLE)
    expect(state.anodeMassDelta).toBeGreaterThan(0)
    expect(state.cathodeMassDelta).toBeGreaterThan(0)
    expect(state.anodeMassDelta / state.cathodeMassDelta).toBeCloseTo(96.1 / 64.1, 10)
    expect(state.voltage).toBe(2.04)
  })

  it('每 2 mol e⁻ 消耗 2 mol H₂SO₄（取小 n(e⁻) 以避开浓度下限钳制）', () => {
    const state = galvanicCellState(GALVANIC_CELL.leadAcid, 0.2)
    expect(state.concentration).toBeCloseTo(ELECTROLYTE_INITIAL_CONC - 0.2, 10)
  })
})

describe('浓度护栏', () => {
  it('消耗型模型的浓度不会跌破各自下限', () => {
    const huge = 1e6
    expect(galvanicCellState(GALVANIC_CELL.singleCellZnH2SO4, huge).concentration).toBe(0.05)
    expect(galvanicCellState(GALVANIC_CELL.daniell, huge).concentration).toBe(0.05)
    expect(galvanicCellState(GALVANIC_CELL.leadAcid, huge).concentration).toBe(0.1)
  })

  it('所有模型在任何 n(e⁻) 下都不产生 NaN / Infinity', () => {
    for (const cellType of [0, 1, 2, 3]) {
      for (const ne of [0, 0.001, 0.0155, 1e3]) {
        const state = galvanicCellState(cellType, ne)
        expect(Number.isFinite(state.voltage)).toBe(true)
        expect(Number.isFinite(state.concentration)).toBe(true)
        expect(Number.isFinite(state.anodeMassDelta)).toBe(true)
        expect(Number.isFinite(state.cathodeMassDelta)).toBe(true)
      }
    }
  })
})
