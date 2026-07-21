import { describe, it, expect } from 'vitest'
import { knowledgeTree, getKnowledgeNode } from '../knowledgeTree'

describe('knowledgeTree 高考化学知识树审计测试', () => {
  it('知识树包含所有 5 大核心模块', () => {
    const modules = new Set(knowledgeTree.map(n => n.module))
    expect(modules.has('无机化学')).toBe(true)
    expect(modules.has('反应原理')).toBe(true)
    expect(modules.has('物质结构')).toBe(true)
    expect(modules.has('有机化学')).toBe(true)
    expect(modules.has('化学实验')).toBe(true)
  })

  it('包含新增的高考高频知识节点', () => {
    expect(getKnowledgeNode('avogadro-constant')).toBeDefined()
    expect(getKnowledgeNode('colloid')).toBeDefined()
    expect(getKnowledgeNode('manganese-chromium')).toBeDefined()
    expect(getKnowledgeNode('kp-calculation')).toBeDefined()
    expect(getKnowledgeNode('chemical-conservation')).toBeDefined()
    expect(getKnowledgeNode('coordination-bond')).toBeDefined()
    expect(getKnowledgeNode('unit-cell-calculation')).toBeDefined()
    expect(getKnowledgeNode('chirality')).toBeDefined()
    expect(getKnowledgeNode('organic-spectroscopy')).toBeDefined()
    expect(getKnowledgeNode('extraction-distillation')).toBeDefined()
    expect(getKnowledgeNode('recrystallization')).toBeDefined()
  })

  it('所有节点 ID 唯一，且 prerequisites 均有效存在', () => {
    const ids = new Set<string>()
    knowledgeTree.forEach(node => {
      expect(ids.has(node.id)).toBe(false)
      ids.add(node.id)
    })

    knowledgeTree.forEach(node => {
      node.prerequisites.forEach(prereqId => {
        expect(getKnowledgeNode(prereqId)).toBeDefined()
      })
    })
  })

  it('注册表加载后，晶胞计算知识节点成功关联动画 ID', async () => {
    const { loadExtendedRegistry } = await import('../animationRegistry')
    await loadExtendedRegistry()

    const node = getKnowledgeNode('unit-cell-calculation')
    expect(node).toBeDefined()
    expect(node?.animationIds).toContain('anim-unit-cell-calculation')
  })
})
