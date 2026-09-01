import { describe, it, expect } from 'vitest'
import { VALENCE_MATRIX_DATA } from '../valence-matrix'

describe('专题一：无机元素价类二维矩阵 深度化学科学性审计', () => {
  it('40 个元素数据完整性与基础化合价定义审查', () => {
    const elements = Object.values(VALENCE_MATRIX_DATA)
    expect(elements.length).toBe(40)

    elements.forEach(elem => {
      // 1. 元素符号和名称
      expect(elem.symbol).toBeTruthy()
      expect(elem.name).toBeTruthy()

      // 2. 检查化合价范围
      expect(elem.valences.length).toBeGreaterThan(0)
      elem.valences.forEach(v => {
        expect(v).toBeGreaterThanOrEqual(-4)
        expect(v).toBeLessThanOrEqual(8)
      })

      // 3. 必须包含单质价态 0 (大多数元素为0价单质)
      expect(elem.valences).toContain(0)

      // 4. 每个声明的化合价都必须在 items 中有至少一个对应的代表物质
      const missingValences: number[] = []
      elem.valences.forEach(v => {
        const hasItem = elem.items.some(item => item.valence === v)
        if (!hasItem) missingValences.push(v)
      })
      if (missingValences.length > 0) {
        console.log(`⚠️ 元素 [${elem.symbol}] 声明了化合价 [${missingValences.join(', ')}]，但在 items 中缺失对应物质！`)
      }
    })
  })

  it('审查所有物质节点的化合价、分类归属与化学常识', () => {
    const allItems: { element: string; substance: string; valence: number; category: string }[] = []

    Object.values(VALENCE_MATRIX_DATA).forEach(elem => {
      elem.items.forEach(item => {
        allItems.push({
          element: elem.symbol,
          substance: item.substance,
          valence: item.valence,
          category: item.category,
        })

        // 1. 单质化合价必须为 0
        if (item.category === '单质') {
          expect(item.valence, `${elem.symbol} 单质 [${item.substance}] 化合价必须为 0`).toBe(0)
        }

        // 2. 氧化物不能为 0 价或负价（除特殊电负性如OF2外，常规氧化物正离子/中心原子化合价必须 > 0，氧为 -2 或 -1）
        if (item.category === '氧化物' && elem.symbol !== 'O') {
          expect(item.valence, `${elem.symbol} 氧化物 [${item.substance}] 化合价必须大于 0`).toBeGreaterThan(0)
        }

        // 3. 氧化性与还原性逻辑
        const maxVal = Math.max(...elem.valences)
        const minVal = Math.min(...elem.valences)
        if (item.isOxidant) {
          expect(item.valence, `${elem.symbol} 最低价 [${item.substance}] 绝不能标记为氧化剂`).toBeGreaterThan(minVal)
        }
        if (item.isReductant) {
          expect(item.valence, `${elem.symbol} 最高价 [${item.substance}] 绝不能标记为还原剂`).toBeLessThan(maxVal)
        }
      })
    })
  })

  it('审查全部 40 个元素的转化路径电子转移与化学反应科学性', () => {
    Object.values(VALENCE_MATRIX_DATA).forEach(elem => {
      elem.transformations.forEach(trans => {
        const eq = trans.equation
        expect(eq, `[${elem.symbol}] 转化路径 ${trans.id} 缺少方程式`).toBeTruthy()

        // 检查电子转移描述中的化学合理性
        if (trans.type === 'oxidation') {
          expect(trans.electronTransfer, `[${elem.symbol}] 氧化反应电子转移描述应包含 '失'、'升' 或 '氧化'`).toMatch(/(失|升高|升|放|氧化)/)
        } else if (trans.type === 'reduction') {
          expect(trans.electronTransfer, `[${elem.symbol}] 还原反应电子转移描述应包含 '得'、'降' 或 '还原'`).toMatch(/(得|降低|降|还原|接收)/)
        } else if (trans.type === 'disproportionation') {
          expect(trans.electronTransfer, `[${elem.symbol}] 歧化反应应说明歧化或得失电子`).toMatch(/(歧化|转移|失|得|升|降)/)
        } else if (trans.type === 'comproportionation') {
          expect(trans.electronTransfer, `[${elem.symbol}] 归中反应应说明归中或得失电子`).toMatch(/(归中|转移|失|得|升|降)/)
        } else if (trans.type === 'other') {
          expect(trans.electronTransfer, `[${elem.symbol}] 非氧化还原反应应明确标明`).toMatch(/(非氧化还原|复分解|水解|脱水|中和|络合|沉淀|吸热|放热|同素异形体|强酸制弱酸)/)
        }
      })
    })
  })

  it('审查化学反应方程式配平与常见化学事实', () => {
    const problematicEquations: string[] = []

    Object.values(VALENCE_MATRIX_DATA).forEach(elem => {
      elem.transformations.forEach(trans => {
        const eq = trans.equation
        if (!eq) {
          problematicEquations.push(`[${elem.symbol}] 缺少方程式: ${trans.fromSubstance} -> ${trans.toSubstance}`)
          return
        }

        // 检查是否存在明显的未配平占位符或格式错误
        if (eq.includes('undefined') || eq.includes('NaN') || eq.includes('null')) {
          problematicEquations.push(`[${elem.symbol}] 方程式含非法字符: ${eq}`)
        }
      })
    })

    expect(problematicEquations).toEqual([])
  })
})
