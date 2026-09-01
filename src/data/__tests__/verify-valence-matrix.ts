import { VALENCE_MATRIX_DATA } from '../valence-matrix'
import { matchesSubstance } from '../../components/Chemistry/valence-matrix/utils'

console.log('--- 40 种元素价类矩阵全量数据与逻辑自动化回归测试 ---')

let issues: string[] = []
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

console.log(`全量 40 元素转化路径匹配测试结果:`)
console.log(`总检验项: ${totalTransformations * 2}, 成功精准匹配: ${exactMatchCount}, 剩余异常: ${issues.length}`)
if (issues.length > 0) {
  issues.forEach(i => console.error('  ' + i))
  throw new Error(`回归测试未通过，存在 ${issues.length} 处匹配异常`)
} else {
  console.log('✅ 全量 40 元素化学转化路径 100% 验证通过！')
}
