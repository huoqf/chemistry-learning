import { describe, it, expect } from 'vitest'
import { loadExtendedRegistry, getAnimationConfigAsync } from '../animationRegistry'
import { knowledgeIndex } from '../knowledgeTree'

describe('KnowledgeTree & Registry Integration Test', () => {
  it('should correctly register and resolve anim-redox-electron-transfer in knowledgeTree with formulas and examPoints', async () => {
    await loadExtendedRegistry()

    const config = await getAnimationConfigAsync('anim-redox-electron-transfer')
    expect(config).toBeDefined()
    expect(config?.knowledgeId).toBe('redox-electron-transfer')

    // 校验右侧屏公式与高考要点
    expect(typeof config?.formulas).toBe('function')
    expect(typeof config?.gaokaoPoints).toBe('function')

    if (typeof config?.formulas === 'function') {
      const formulasList = config.formulas({ reaction: 2 }) // MnO2 + 4HCl
      expect(formulasList.length).toBeGreaterThan(0)
      expect(formulasList[0].name).toContain('实验室制氯气方程式')
    }

    if (typeof config?.gaokaoPoints === 'function') {
      const points = config.gaokaoPoints({ reaction: 2 })
      expect(points.length).toBeGreaterThan(0)
      expect(points[0].text).toContain('阿伏加德罗常数 NA 陷阱')
    }

    const node = knowledgeIndex['redox-electron-transfer']
    expect(node).toBeDefined()
    expect(node.animationIds).toContain('anim-redox-electron-transfer')
  })
})
