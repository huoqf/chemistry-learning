import { describe, it, expect } from 'vitest'
import { gaokaoModels, type GaokaoModelCategory } from '../gaokaoModels'
import { getModelQuizData, modelQuizMap } from '../quiz'
import { getKnowledgeNode } from '../knowledgeTree'

const GAOKAO_TOOL_PAGE_SRC =
  Object.values(
    import.meta.glob<string>('../../pages/GaokaoToolPage.tsx', {
      query: '?raw',
      import: 'default',
      eager: true,
    })
  )[0] ?? ''

describe('Gaokao Models & Quiz Data 整合审计测试', () => {
  it('全部已声明的高考专属交互工具覆盖 3 类模块并与题库注册表 100% 对齐', () => {
    expect(gaokaoModels.length).toBeGreaterThanOrEqual(18)

    const modelIds = gaokaoModels.map(m => m.id)
    expect(new Set(modelIds).size).toBe(modelIds.length)

    const memoryMatrix = gaokaoModels.filter(m => m.category === 'memory-matrix')
    const masterModels = gaokaoModels.filter(m => m.category === 'master-model')
    const experimentChains = gaokaoModels.filter(m => m.category === 'experiment-chain')

    expect(memoryMatrix.length).toBeGreaterThanOrEqual(5)
    expect(masterModels.length).toBeGreaterThanOrEqual(10)
    expect(experimentChains.length).toBeGreaterThanOrEqual(3)

    // 题库注册表与 gaokaoModels 互相完备对齐
    for (const id of modelIds) {
      expect(modelQuizMap[id], `母题 ${id} 缺少题库注册`).toBeDefined()
    }
  })

  it('所有高考母题 category 字段必须是合法枚举值', () => {
    const validCategories: GaokaoModelCategory[] = ['master-model', 'memory-matrix', 'experiment-chain']
    gaokaoModels.forEach(model => {
      expect(
        validCategories,
        `母题 ${model.id} 的 category="${model.category}" 不在合法枚举中`
      ).toContain(model.category)
    })
    const memoryMatrix = gaokaoModels.filter(m => m.category === 'memory-matrix')
    expect(memoryMatrix.length).toBeGreaterThanOrEqual(5)
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

  it('获取高考母题手算步骤与情境变式数据必须契合规范', () => {
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

  it('母题 relatedKnowledgeIds 无重复且核心高频教材节点全量完成双向绑定', () => {
    gaokaoModels.forEach(model => {
      expect(
        new Set(model.relatedKnowledgeIds).size,
        `母题 ${model.id} 的 relatedKnowledgeIds 存在重复节点`
      ).toBe(model.relatedKnowledgeIds.length)
    })

    const coreKnowledgeIds = [
      'ion-identification',
      'ion-coexistence',
      'salt-hydrolysis',
      'chemical-equilibrium',
      'organic-synthesis',
      'titration',
      'primary-cell',
      'electrolysis',
      'hess-law',
      'vsepr',
      'unit-cell-calculation',
      'avogadro-constant',
      'gas-preparation',
      'precipitation-equilibrium',
    ]

    coreKnowledgeIds.forEach(kid => {
      const node = getKnowledgeNode(kid)
      expect(node, `核心教材节点 ${kid} 缺失`).toBeDefined()
      expect(
        node?.relatedModelIds?.length ?? 0,
        `核心教材节点 ${kid} 未反向关联任何高考母题`
      ).toBeGreaterThan(0)
    })
  })

  it('GaokaoToolPage 必须对 18 大高考母题逐一显式注册路由分发分支', () => {
    expect(GAOKAO_TOOL_PAGE_SRC.length).toBeGreaterThan(200)
    gaokaoModels.forEach(model => {
      expect(
        GAOKAO_TOOL_PAGE_SRC,
        `GaokaoToolPage.tsx 缺少母题 ${model.id} 的 case 路由分支`
      ).toContain(`case '${model.id}':`)
    })
  })
})
