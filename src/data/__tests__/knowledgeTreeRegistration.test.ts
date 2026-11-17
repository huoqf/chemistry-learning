import { describe, it, expect } from 'vitest'
import { loadExtendedRegistry, getAnimationConfigAsync } from '../animationRegistry'
import { knowledgeIndex } from '../knowledgeTree'

import { reactionPrincipleAnimations } from '../registries/reaction-principle'
import { structureAnimations } from '../registries/structure'
import { inorganicAnimations } from '../registries/inorganic'
import { experimentAnimations } from '../registries/experiment'

const ALL_ANIM_IDS = Object.keys({
  ...reactionPrincipleAnimations,
  ...structureAnimations,
  ...inorganicAnimations,
  ...experimentAnimations,
})

describe('KnowledgeTree & Registry Integration Test', () => {
  it('全部 12 个注册动画均与知识树双向关联且 formulas / gaokaoPoints 正常生成', async () => {
    await loadExtendedRegistry()
    expect(ALL_ANIM_IDS.length).toBeGreaterThanOrEqual(12)

    for (const animId of ALL_ANIM_IDS) {
      const config = await getAnimationConfigAsync(animId)
      expect(config, `未加载到 ${animId}`).toBeDefined()
      const node = knowledgeIndex[config!.knowledgeId]
      expect(node, `${animId} 的 knowledgeId=${config!.knowledgeId} 未在知识树中找到`).toBeDefined()
      expect(node.animationIds, `知识节点 ${node.id} 未反向关联 ${animId}`).toContain(animId)

      const defaults = (config!.defaultParams || {}) as Record<string, number>
      const formulasList =
        typeof config!.formulas === 'function' ? config!.formulas(defaults) : config!.formulas
      const pointsList =
        typeof config!.gaokaoPoints === 'function' ? config!.gaokaoPoints(defaults) : config!.gaokaoPoints
      expect(formulasList?.length ?? 0, `${animId} formulas 为空`).toBeGreaterThan(0)
      expect(pointsList?.length ?? 0, `${animId} gaokaoPoints 为空`).toBeGreaterThan(0)
    }
  })

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
