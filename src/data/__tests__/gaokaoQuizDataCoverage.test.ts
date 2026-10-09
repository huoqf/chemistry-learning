import { describe, it, expect } from 'vitest'
import { gaokaoModels } from '../gaokaoModels'
import { modelQuizMap, getModelQuizData } from '../quiz'

describe('高考母题与记忆矩阵题库数据全景覆盖度测试', () => {
  it('18 大高考母题与记忆矩阵必须 100% 拥有对应的题库数据', () => {
    gaokaoModels.forEach((model) => {
      const quiz = getModelQuizData(model.id)
      expect(
        quiz,
        `母题或记忆工具 [${model.id} - ${model.title}] 缺少注册的题库数据`
      ).toBeDefined()

      if (quiz) {
        // 至少包含 1 个踩分步骤或规范答题说明
        expect(quiz.scoringSteps.length).toBeGreaterThan(0)
        // 至少包含 1 道高质量高考真题或变式题
        expect(quiz.variantQuizzes.length).toBeGreaterThan(0)

        // 验证每道变式题的数据规范
        quiz.variantQuizzes.forEach((v) => {
          expect(v.title).toBeTruthy()
          expect(v.questionText).toBeTruthy()
          expect(v.options.length).toBeGreaterThanOrEqual(2)
          expect(v.options.some((o) => o.isCorrect)).toBe(true)
          expect(v.detailedExplanation).toBeTruthy()
        })
      }
    })
  })

  it('所有已注册在 modelQuizMap 中的 modelId 必须在 gaokaoModels 中声明', () => {
    const declaredIds = gaokaoModels.map((m) => m.id)
    Object.keys(modelQuizMap).forEach((registeredId) => {
      expect(declaredIds).toContain(registeredId)
    })
  })
})

describe('实验二 沉淀 pH 口径一致性守门（P1-I1 / §5.4 NaF）', () => {
  const industrialText = () => JSON.stringify(getModelQuizData('model-industrial-flow'))

  it('Mn²⁺ / Fe²⁺ / Mg²⁺ 沉淀 pH 必须与 Ksp 计算同源，不得残留 8.4 / 9.4 / 7.7 等孤立旧值', () => {
    const text = industrialText()
    expect(text).toBeTruthy()

    // 旧的三口径与孤立值必须彻底清除（8.14 是 Mn²⁺ 开始沉淀的精确计算值，8.1 是其一位小数取值）
    expect(text).not.toContain('8.4')
    expect(text).not.toContain('9.4')
    expect(text).not.toContain('7.7')

    // 统一到与 hook(Ksp) 计算一致的口径
    expect(text).toContain('8.14 ≈ 8.1')            // Mn²⁺：计算 8.14 → 区间取值 8.1
    expect(text).toContain('Fe²⁺ 完全沉淀需 pH ≥ 8.95') // Fe²⁺：与右屏同用"完全沉淀"口径
    expect(text).toContain('Mg²⁺ 开始沉淀 pH 为 8.9')   // Mg²⁺：c≈0.1 mol/L 下的开始沉淀点
  })

  it('NaF 除 Ca²⁺/Mg²⁺ 必须提示过量 F⁻ 残留会引入新杂质', () => {
    const text = industrialText()
    expect(text).toContain('过量 F⁻ 会残留于溶液成为新杂质')
    expect(text).toContain('F⁻ 须控制用量，过量残留会引入新杂质')
  })
})
