import { describe, it, expect } from 'vitest'
import { VALENCE_MATRIX_DATA } from '../valence-matrix'
import { modelValenceMatrix } from '../quiz/model-valence-matrix'
import { matchesSubstance } from '../../components/Chemistry/valence-matrix/utils'

describe('Valence Matrix Data Integrity & Chemical Scientificity (新高考 40 全周期元素体系)', () => {
  it('should contain all 40 inorganic elements covering Gaokao periodic table requirements', () => {
    const keys = Object.keys(VALENCE_MATRIX_DATA)
    expect(keys).toHaveLength(40)

    // 14 大主族典型非金属
    expect(keys).toEqual(
      expect.arrayContaining(['H', 'B', 'C', 'Si', 'N', 'P', 'As', 'O', 'S', 'Se', 'F', 'Cl', 'Br', 'I'])
    )
    // 14 大主族典型金属与两性金属
    expect(keys).toEqual(
      expect.arrayContaining(['Li', 'Be', 'Na', 'Mg', 'Al', 'K', 'Ca', 'Ga', 'Ge', 'Sn', 'Sb', 'Ba', 'Pb', 'Bi'])
    )
    // 12 大过渡与工业流程核心金属
    expect(keys).toEqual(
      expect.arrayContaining(['Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Mo', 'Ag', 'W'])
    )
  })

  it('should classify elements into 3 well-defined groups correctly', () => {
    const nonMetals = Object.values(VALENCE_MATRIX_DATA).filter(e => e.elementCategory === 'non-metal')
    const mainGroupMetals = Object.values(VALENCE_MATRIX_DATA).filter(e => e.elementCategory === 'main-group-metal')
    const transitionMetals = Object.values(VALENCE_MATRIX_DATA).filter(e => e.elementCategory === 'transition-metal')

    expect(nonMetals).toHaveLength(14)
    expect(mainGroupMetals).toHaveLength(14)
    expect(transitionMetals).toHaveLength(12)
  })

  it('should ensure element IDs match dictionary keys and metadata is well-formed', () => {
    Object.entries(VALENCE_MATRIX_DATA).forEach(([key, config]) => {
      expect(config.id).toBe(key)
      expect(config.symbol).toBe(key)
      expect(config.name).toContain(key)
      expect(config.atomColor).toBeTruthy()
      expect(config.badgeText).toBeTruthy()
      expect(config.isCoreGaokao).toBe(true)
      expect(config.valences.length).toBeGreaterThan(0)
      expect(config.categories.length).toBeGreaterThan(0)
      expect(config.items.length).toBeGreaterThan(0)
      expect(config.examTips.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('should strictly validate all substance nodes for chemical validity and valence/category alignment', () => {
    Object.values(VALENCE_MATRIX_DATA).forEach(config => {
      const maxValence = Math.max(...config.valences)
      const minValence = Math.min(...config.valences)

      config.items.forEach(item => {
        // 1. 价态与类别必须属于元素已声明范围
        expect(
          config.valences,
          `元素 [${config.id}] 的物质 [${item.substance}] 价态 ${item.valence} 未在 valences 中声明`
        ).toContain(item.valence)

        expect(
          config.categories,
          `元素 [${config.id}] 的物质 [${item.substance}] 类别 ${item.category} 未在 categories 中声明`
        ).toContain(item.category)

        // 2. 字段完整性
        expect(item.substance, `元素 [${config.id}] 存在空名称物质`).toBeTruthy()
        expect(item.colorText, `元素 [${config.id}] 物质 [${item.substance}] 缺少 colorText`).toBeTruthy()
        expect(item.testReaction, `元素 [${config.id}] 物质 [${item.substance}] 缺少 testReaction`).toBeTruthy()
        expect(item.equation, `元素 [${config.id}] 物质 [${item.substance}] 缺少 equation`).toBeTruthy()
        expect(item.roleDescription, `元素 [${config.id}] 物质 [${item.substance}] 缺少 roleDescription`).toBeTruthy()
        expect(item.rgbColor, `元素 [${config.id}] 物质 [${item.substance}] 缺少 rgbColor`).toBeTruthy()

        // 3. 氧化还原逻辑校验：最高价不能标注为强还原剂，最低价不能标注为强氧化剂
        if (item.isReductant) {
          expect(
            item.valence,
            `[化学科学性错误] 元素 [${config.id}] 的最高价态物质 [${item.substance}] (化合价 ${item.valence}) 不能标记为 isReductant: true`
          ).toBeLessThan(maxValence)
        }

        if (item.isOxidant) {
          expect(
            item.valence,
            `[化学科学性错误] 元素 [${config.id}] 的最低价态物质 [${item.substance}] (化合价 ${item.valence}) 不能标记为 isOxidant: true`
          ).toBeGreaterThan(minValence)
        }
      })
    })
  })

  it('should validate all transformation paths with valid chemical equations and electron transfer notes', () => {
    Object.values(VALENCE_MATRIX_DATA).forEach(config => {
      config.transformations.forEach(trans => {
        // 使用高精度 matchesSubstance 验证源物质与目标物质存在性
        const fromExists = config.items.some(item => matchesSubstance(trans.fromSubstance, item.substance))
        const toExists = config.items.some(item => matchesSubstance(trans.toSubstance, item.substance))

        expect(
          fromExists,
          `[${config.id}] 转化路径起点 [${trans.fromSubstance}] 未能精准匹配到任何 items 物质`
        ).toBe(true)

        expect(
          toExists,
          `[${config.id}] 转化路径终点 [${trans.toSubstance}] 未能精准匹配到任何 items 物质`
        ).toBe(true)

        // 方程式与电子转移
        expect(trans.equation).toMatch(/(=|⇌|→)/)
        expect(trans.electronTransfer.length).toBeGreaterThan(0)
        expect(['oxidation', 'reduction', 'disproportionation', 'comproportionation', 'other']).toContain(trans.type)
      })
    })
  })

  it('should ensure all examTips follow the standard high-yield Gaokao bracket pattern', () => {
    Object.values(VALENCE_MATRIX_DATA).forEach(config => {
      config.examTips.forEach(tip => {
        expect(tip).toMatch(/^【.+】/)
        expect(tip.length).toBeGreaterThan(15)
      })
    })
  })

  it('should validate quiz questions and scoring steps in modelValenceMatrix', () => {
    expect(modelValenceMatrix.scoringSteps.length).toBeGreaterThan(5)
    modelValenceMatrix.scoringSteps.forEach(step => {
      expect(step.id).toBeTruthy()
      expect(step.title).toMatch(/^【.+】/)
      expect(step.questionText).toBeTruthy()
      expect(step.correctAnswer.length).toBeGreaterThan(0)
      expect(step.explanation).toBeTruthy()
    })

    expect(modelValenceMatrix.variantQuizzes.length).toBeGreaterThan(3)
    modelValenceMatrix.variantQuizzes.forEach(quiz => {
      expect(quiz.id).toBeTruthy()
      expect(quiz.title).toBeTruthy()
      expect(quiz.questionText).toBeTruthy()
      expect(quiz.options.length).toBe(4)
      expect(quiz.options.filter(o => o.isCorrect)).toHaveLength(1)
      expect(quiz.detailedExplanation).toBeTruthy()
    })
  })
})
