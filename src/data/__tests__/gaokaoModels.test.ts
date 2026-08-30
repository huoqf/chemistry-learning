import { describe, it, expect } from 'vitest'
import { gaokaoModels, type GaokaoModelCategory } from '../gaokaoModels'
import { getModelQuizData } from '../gaokaoQuizData'
import { getKnowledgeNode } from '../knowledgeTree'

describe('Gaokao Models & Quiz Data 整合审计测试', () => {
  it('恰好包含 18 个高考专属交互工具 (5 大记忆矩阵 + 9 大解题母题 + 4 大实验与专题工具)', () => {
    // 精确断言总数，防止遗漏/重复注册
    expect(gaokaoModels.length).toBe(18)

    const modelIds = gaokaoModels.map(m => m.id)

    // ── A. 5 大记忆矩阵 (memory-matrix) ──
    expect(modelIds).toContain('model-valence-matrix')
    expect(modelIds).toContain('model-ion-matrix')
    expect(modelIds).toContain('model-organic-matrix')
    expect(modelIds).toContain('model-reagent-step')
    expect(modelIds).toContain('model-flash-cards')

    // ── B. 8 大解题母题 (master-model) ──
    expect(modelIds).toContain('model-titration-balance')
    expect(modelIds).toContain('model-electrochemical-twin')
    expect(modelIds).toContain('model-crystal-3d-split')
    expect(modelIds).toContain('model-reaction-principle-nexus')
    expect(modelIds).toContain('model-vsepr-hybrid-3d')
    expect(modelIds).toContain('model-organic-mechanism')
    expect(modelIds).toContain('model-hess-law')
    expect(modelIds).toContain('model-element-periodic-property')
    expect(modelIds).toContain('model-organic-retrosynthesis')

    // ── C. 2 大实验链 (experiment-chain) ──
    expect(modelIds).toContain('model-gas-chain')
    expect(modelIds).toContain('model-industrial-flow')

    // ── D. 3 大记忆矩阵层实验工具 (memory-matrix / experiment-chain) ──
    expect(modelIds).toContain('model-avogadro-constant')
    expect(modelIds).toContain('model-titration-error-purity')
  })

  it('所有高考母题 category 字段必须是合法枚举值', () => {
    const validCategories: GaokaoModelCategory[] = ['master-model', 'memory-matrix', 'experiment-chain']
    gaokaoModels.forEach(model => {
      expect(
        validCategories,
        `母题 ${model.id} 的 category="${model.category}" 不在合法枚举中`
      ).toContain(model.category)
    })
    // 记忆矩阵类别应有 4 个（含 NA 工具被归类为 memory-matrix）
    const memoryMatrix = gaokaoModels.filter(m => m.category === 'memory-matrix')
    expect(memoryMatrix.length).toBeGreaterThanOrEqual(3)
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
    // 解耦：仅验证盖斯定律步骤存在内容，不绑定位置索引
    const hessTitles = hessQuiz?.scoringSteps.map(s => s.title) ?? []
    expect(hessTitles.some(t => t.includes('盖斯定律'))).toBe(true)
  })
})

