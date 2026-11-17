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
        // 至少包含 1 道情境变式题
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

describe('实验二 沉淀 pH 口径一致性守门（Ksp 同源校验 & NaF 除杂）', () => {
  const industrialText = () => JSON.stringify(getModelQuizData('model-industrial-flow'))

  it('Mn²⁺ / Fe²⁺ / Mg²⁺ 沉淀 pH 与 Ksp 浓度前提同源且不得残留冲突旧描述', () => {
    const text = industrialText()
    expect(text).toBeTruthy()

    // 精确语义否定旧孤立数值，避免裸数字子串误伤正常温度/浓度（如 29.4℃、18.4 mol/L）
    expect(text).not.toMatch(/Mn²⁺[^。]*?(?:7\.7|8\.4)/)
    expect(text).not.toMatch(/Fe²⁺[^。]*?(?:7\.7|8\.4)/)
    expect(text).not.toMatch(/Mg²⁺[^。]*?9\.4/)

    // 统一到与 hook(Ksp) 计算一致的口径
    expect(text).toContain('8.14 ≈ 8.1')
    expect(text).toContain('Fe²⁺ 完全沉淀需 pH ≥ 8.95')
    expect(text).toContain('Mg²⁺ 开始沉淀 pH 为 8.9')
  })

  it('NaF 除 Ca²⁺/Mg²⁺ 必须提示过量 F⁻ 残留会引入新杂质', () => {
    const text = industrialText()
    expect(text).toMatch(/过量\s*F⁻.*新杂质|F⁻.*过量残留.*新杂质/)
  })
})
