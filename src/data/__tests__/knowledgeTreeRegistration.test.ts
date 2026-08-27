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
      // 解耦：验证列表中包含「实验室制氯气」公式，不绑定位置索引
      const formulaNames = formulasList.map((f: { name: string }) => f.name)
      expect(
        formulaNames.some((n: string) => n.includes('实验室制氯气')),
        `reaction=2 的公式列表中应包含「实验室制氯气方程式」，实际：${formulaNames.join('、')}`
      ).toBe(true)
    }

    if (typeof config?.gaokaoPoints === 'function') {
      const points = config.gaokaoPoints({ reaction: 2 })
      expect(points.length).toBeGreaterThan(0)
      // 解耦：验证要点中包含「阿伏加德罗常数 NA 陷阱」，不绑定位置索引
      const pointTexts = points.map((p: { text: string }) => p.text)
      expect(
        pointTexts.some((t: string) => t.includes('阿伏加德罗常数 NA 陷阱')),
        `reaction=2 的高考要点中应包含「NA 陷阱」，实际：${pointTexts.join('；')}`
      ).toBe(true)
    }

    const node = knowledgeIndex['redox-electron-transfer']
    expect(node).toBeDefined()
    expect(node.animationIds).toContain('anim-redox-electron-transfer')
  })
})
