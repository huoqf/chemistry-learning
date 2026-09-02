import { describe, it, expect } from 'vitest'
import {
  GAS_MATRIX_ITEMS,
  GAS_PRESET_CONFIGS,
  GENERATOR_APPARATUS_MODELS,
  PURIFICATION_RULES,
  DRYING_AGENT_MATRIX,
  DRYING_CROSS_MATRIX,
  KIPP_GENERATOR_RULES,
  COLLECTION_DECISION_RULES,
  TAIL_GAS_TREATMENT_MODELS,
  ANTI_SIPHON_MODELS,
  AIRTIGHTNESS_TEMPLATES,
} from '../data/gasChainMatrixData'

describe('gasChainMatrixData — 母题六气体制备全景大表数据完整性测试', () => {
  it('应包含完整的新高考 13 种核心气体', () => {
    expect(GAS_MATRIX_ITEMS.length).toBe(13)
    const formulas = GAS_MATRIX_ITEMS.map((g) => g.formula)
    const expected = ['Cl₂', 'NH₃', 'SO₂', 'NO₂', 'NO', 'C₂H₄', 'C₂H₂', 'CO₂', 'CO', 'O₂', 'H₂', 'HCl', 'H₂S']
    expected.forEach((f) => {
      expect(formulas).toContain(f)
    })
  })

  it('13 种气体均具备 100% 精准的装置链标准配置预设', () => {
    const expected = ['Cl₂', 'NH₃', 'SO₂', 'NO₂', 'NO', 'C₂H₄', 'C₂H₂', 'CO₂', 'CO', 'O₂', 'H₂', 'HCl', 'H₂S']
    expected.forEach((f) => {
      const config = GAS_PRESET_CONFIGS[f]
      expect(config).toBeDefined()
      expect(config?.targetGas).toBe(f)
      expect(config?.generator).toBeTruthy()
      expect(config?.collection).toBeTruthy()
      expect(config?.tailGas).toBeTruthy()
    })
  })

  it('四大干燥剂相容性、交叉对比矩阵及 8 大除杂模型数据完备', () => {
    expect(DRYING_AGENT_MATRIX.length).toBe(4)
    expect(DRYING_CROSS_MATRIX.length).toBeGreaterThanOrEqual(10)
    expect(PURIFICATION_RULES.length).toBe(8)
    DRYING_CROSS_MATRIX.forEach((row) => {
      expect(row.gas).toBeTruthy()
      expect(row.concH2SO4.status).toMatch(/ok|no/)
      expect(row.sodaLime.status).toMatch(/ok|no/)
      expect(row.cacl2.status).toMatch(/ok|no/)
      expect(row.p2o5.status).toMatch(/ok|no/)
    })
  })

  it('四大发生装置类型、收集决策、尾气处理四大体系与防倒吸安全图谱数据完备', () => {
    expect(GENERATOR_APPARATUS_MODELS.length).toBe(4)
    GENERATOR_APPARATUS_MODELS.forEach((m) => {
      expect(m.name).toBeTruthy()
      expect(m.apparatus).toBeTruthy()
      expect(m.suitableReactions.length).toBeGreaterThan(0)
      expect(m.keyOperations.length).toBeGreaterThan(0)
      expect(m.examTraps.length).toBeGreaterThan(0)
    })
    expect(COLLECTION_DECISION_RULES.length).toBe(4)
    expect(TAIL_GAS_TREATMENT_MODELS.length).toBe(4)
    TAIL_GAS_TREATMENT_MODELS.forEach((t) => {
      expect(t.method).toBeTruthy()
      expect(t.applicableGases).toBeTruthy()
      expect(t.absorberApparatus).toBeTruthy()
      expect(t.examTraps.length).toBeGreaterThan(0)
    })
    expect(KIPP_GENERATOR_RULES.principles.length).toBe(4)
    expect(KIPP_GENERATOR_RULES.items.length).toBeGreaterThanOrEqual(7)
    expect(ANTI_SIPHON_MODELS.length).toBe(6)
    expect(AIRTIGHTNESS_TEMPLATES.length).toBe(3)
  })
})
