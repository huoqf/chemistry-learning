import { describe, it, expect } from 'vitest'
import { ANIMATION_PAGES, GAOKAO_TOOL_ANCHORS } from '../e2ePageCatalog'
import { gaokaoModels } from '../gaokaoModels'
import { reactionPrincipleAnimations } from '../registries/reaction-principle'
import { structureAnimations } from '../registries/structure'
import { inorganicAnimations } from '../registries/inorganic'
import { experimentAnimations } from '../registries/experiment'

/**
 * E2E 清单与真实注册表的**一致性**校验（审查项 G5）。
 *
 * `e2e/pages.spec.ts` 因为 Playwright 不解析 `@/` 别名，只能引用
 * `src/data/e2ePageCatalog.ts` 里的静态清单。本文件负责把这个“影子清单”
 * 钉死在真实注册表上：动画漏注册、标题改名、母题新增而锚点缺失，都会在此变红。
 */
describe('E2E 页面清单与注册表一致性', () => {
  const registryEntries = {
    ...reactionPrincipleAnimations,
    ...structureAnimations,
    ...inorganicAnimations,
    ...experimentAnimations,
  }

  it('动画清单必须与四大注册表逐条一致（id 与 title 都不能漂移）', () => {
    const registryIds = Object.keys(registryEntries).sort()
    const catalogIds = ANIMATION_PAGES.map(a => a.id).sort()

    expect(catalogIds, 'E2E 动画清单与注册表的 id 集合不一致').toEqual(registryIds)

    for (const entry of ANIMATION_PAGES) {
      expect(
        registryEntries[entry.id]?.title,
        `动画 ${entry.id} 的标题在 E2E 清单与注册表中不一致`
      ).toBe(entry.title)
    }
  })

  it('每个高考母题都必须有页面级考点锚点，且不得是“化学/高考”这类无区分度的词', () => {
    const missing = gaokaoModels.filter(m => !GAOKAO_TOOL_ANCHORS[m.id]).map(m => m.id)
    expect(missing, '存在没有配置 E2E 考点锚点的高考母题').toEqual([])

    const extra = Object.keys(GAOKAO_TOOL_ANCHORS).filter(id => !gaokaoModels.some(m => m.id === id))
    expect(extra, '存在已废弃的高考母题锚点').toEqual([])

    const vague = ['化学', '高考', '母题', '矩阵', '专题', '图谱']
    for (const [id, anchor] of Object.entries(GAOKAO_TOOL_ANCHORS)) {
      expect(anchor.trim().length, `母题 ${id} 的锚点为空`).toBeGreaterThan(1)
      expect(vague, `母题 ${id} 的锚点“${anchor}”缺乏区分度`).not.toContain(anchor)
    }
  })
})
