import { describe, it, expect } from 'vitest'
import { VALENCE_MATRIX_DATA } from '../valence-matrix'
import { matchesSubstance } from '../../components/Chemistry/valence-matrix/utils'

describe('40 种元素价类矩阵全量转化路径单射精准匹配测试', () => {
  it('全量转化路径起点与终点物质必须 100% 精确单射匹配到唯一 items 物质节点', () => {
    const issues: string[] = []
    let exactMatchCount = 0
    let totalTransformations = 0

    for (const [symbol, config] of Object.entries(VALENCE_MATRIX_DATA)) {
      totalTransformations += config.transformations.length

      for (const t of config.transformations) {
        const fromMatched = config.items.filter(i => matchesSubstance(t.fromSubstance, i.substance))
        const toMatched = config.items.filter(i => matchesSubstance(t.toSubstance, i.substance))

        if (fromMatched.length === 0) {
          issues.push(`[${symbol}] 转化 ${t.id} fromSubstance "${t.fromSubstance}" 未能匹配到任何 items 物质`)
        } else if (fromMatched.length > 1) {
          issues.push(`[${symbol}] ⚠️ 转化 ${t.id} fromSubstance "${t.fromSubstance}" 产生多重匹配: [${fromMatched.map(i => i.substance).join(', ')}]`)
        } else {
          exactMatchCount++
        }

        if (toMatched.length === 0) {
          issues.push(`[${symbol}] 转化 ${t.id} toSubstance "${t.toSubstance}" 未能匹配到任何 items 物质`)
        } else if (toMatched.length > 1) {
          issues.push(`[${symbol}] ⚠️ 转化 ${t.id} toSubstance "${t.toSubstance}" 产生多重匹配: [${toMatched.map(i => i.substance).join(', ')}]`)
        } else {
          exactMatchCount++
        }
      }
    }

    expect(issues, `转化路径匹配存在异常:\n${issues.join('\n')}`).toEqual([])
    expect(exactMatchCount).toBe(totalTransformations * 2)
  })
})
