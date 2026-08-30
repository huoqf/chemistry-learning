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
