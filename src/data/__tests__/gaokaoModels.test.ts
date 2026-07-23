import { describe, it, expect } from 'vitest'
import { gaokaoModels } from '../gaokaoModels'
import { getModelQuizData } from '../gaokaoQuizData'
import { getKnowledgeNode } from '../knowledgeTree'

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

  it('所有高考母题关联的教材知识点 ID 必须在知识树中 100% 存在且可双向检索', () => {
    gaokaoModels.forEach(model => {
      model.relatedKnowledgeIds.forEach(kid => {
        const knode = getKnowledgeNode(kid)
        expect(knode, `母题 ${model.id} 关联的知识节点 ${kid} 不存在于知识树中`).toBeDefined()
        expect(knode?.relatedModelIds, `知识节点 ${kid} 未反向绑定母题 ${model.id}`).toContain(model.id)
      })
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

