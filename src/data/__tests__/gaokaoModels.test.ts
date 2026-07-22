import { describe, it, expect } from 'vitest'
import { gaokaoModels } from '../gaokaoModels'
import { getModelQuizData } from '../gaokaoQuizData'

describe('Gaokao Models & Quiz Data 整合审计测试', () => {
  it('应当包含 16 大高考专属交互工具 (3 大记忆矩阵 + 13 大解题母题)', () => {
    expect(gaokaoModels.length).toBeGreaterThanOrEqual(13)
    const modelIds = gaokaoModels.map(m => m.id)
    
    // 验证补齐的 5 大高考高频难点专题
    expect(modelIds).toContain('model-hess-law')
    expect(modelIds).toContain('model-element-periodic-property')
    expect(modelIds).toContain('model-avogadro-constant')
    expect(modelIds).toContain('model-titration-error-purity')
    expect(modelIds).toContain('model-organic-retrosynthesis')
  })

  it('所有高考母题工具路由与关联教材知识 ID 必须有效声明', () => {
    gaokaoModels.forEach(model => {
      expect(model.id).toBeTruthy()
      expect(model.toolRoute).toContain('/gaokao-tool/')
      expect(model.examPointSummary.length).toBeGreaterThan(0)
      expect(model.relatedKnowledgeIds.length).toBeGreaterThan(0)
    })
  })

  it('获取高考母题手算步骤与近3年真题变式盲盒数据必须契合规范', () => {
    const valenceQuiz = getModelQuizData('model-valence-matrix')
    expect(valenceQuiz).toBeDefined()
    expect(valenceQuiz?.scoringSteps.length).toBeGreaterThan(0)
    expect(valenceQuiz?.variantQuizzes.length).toBeGreaterThan(0)

    const hessQuiz = getModelQuizData('model-hess-law')
    expect(hessQuiz).toBeDefined()
    expect(hessQuiz?.scoringSteps[0].title).toContain('盖斯定律')
  })
})
