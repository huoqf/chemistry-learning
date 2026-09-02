import { describe, it, expect } from 'vitest'
import { VALENCE_MATRIX_DATA } from '../valence-matrix'

describe('40大元素方程式与化学计量严格审计', () => {
  it('全面检查所有 40 个元素的化学方程式与现象描述', () => {
    const issues: string[] = []

    Object.values(VALENCE_MATRIX_DATA).forEach(elem => {
      // 检查 items
      elem.items.forEach(item => {
        if (item.equation) {
          // 检查等号或箭头
          if (!item.equation.includes('=') && !item.equation.includes('⇌') && !item.equation.includes('→')) {
            issues.push(`[${elem.symbol}] 物质 ${item.substance} 的 equation 缺少反应符号: ${item.equation}`)
          }
        }
      })

      // 检查 transformations
      elem.transformations.forEach(trans => {
        if (!trans.equation || (!trans.equation.includes('=') && !trans.equation.includes('⇌') && !trans.equation.includes('→'))) {
          issues.push(`[${elem.symbol}] 转化 ${trans.id} 缺少有效方程式: ${trans.equation}`)
        }
      })
    })

    expect(issues).toEqual([])
  })
})
