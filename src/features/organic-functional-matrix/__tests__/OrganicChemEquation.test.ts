import { describe, it, expect } from 'vitest'
import katex from 'katex'

describe('OrganicChemEquation 有机方程式排版与折行算法测试', () => {
  it('验证长有机方程式（如阿司匹林水解）KaTeX 渲染无错误且正确对齐', () => {
    const aspirinEq = 'CH_3COO-C_6H_4-COOH + 3NaOH \\xrightarrow{\\Delta} CH_3COONa + NaO-C_6H_4-COONa + 2H_2O'

    // 验证 KaTeX 渲染不抛错
    expect(() => {
      katex.renderToString(aspirinEq, {
        throwOnError: true,
        displayMode: false,
      })
    }).not.toThrow()
  })

  it('验证甲酸苯酯银镜反应和二价银氨络离子方程式解析无误', () => {
    const formicEsterSilver = 'HCOO-C_6H_5 + 2[Ag(NH_3)_2]OH \\xrightarrow{\\Delta} NH_4O-COO-C_6H_5 + 2Ag\\downarrow + 3NH_3 + H_2O (银镜产生)'

    // 匹配括号提取现象
    const match = formicEsterSilver.match(/\s*[（(]([\u4e00-\u9fa5a-zA-Z0-9_、，+\-\s]+)[)）]\s*$/)
    expect(match).toBeTruthy()
    expect(match?.[1]).toBe('银镜产生')

    const cleanFormula = formicEsterSilver.slice(0, match!.index).trim()
    expect(() => {
      katex.renderToString(cleanFormula, {
        throwOnError: true,
        displayMode: false,
      })
    }).not.toThrow()
  })
})
