import React from 'react'

interface ChemicalFormulaProps {
  formula: string
  className?: string
}

/**
 * 化学式渲染组件 — 将 Unicode 下标/上标字符转换为语义化 HTML <sub>/<sup> 标签。
 *
 * 解析规则：
 * - Unicode 下标 ₀-₉ → <sub>N</sub>，连续下标合并为一个 <sub>
 * - Unicode 上标 ⁰-⁹⁺⁻ → <sup>内容</sup>，连续上标合并为一个 <sup>
 * - 其他字符原样输出
 *
 * 示例：
 *   "Fe₂O₃"   → Fe<sub>2</sub>O<sub>3</sub>
 *   "Cr₂O₇²⁻" → Cr<sub>2</sub>O<sub>7</sub><sup>2-</sup>
 *   "Cu²⁺"    → Cu<sup>2+</sup>
 *   "Na[Al(OH)₄]" → Na[Al(OH)<sub>4</sub>]
 */

const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
}

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-',
}

function isSubscript(ch: string): boolean {
  return ch in SUBSCRIPT_MAP
}

function isSuperscript(ch: string): boolean {
  return ch in SUPERSCRIPT_MAP
}

function parseFormula(formula: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < formula.length) {
    const ch = formula[i]

    if (isSubscript(ch)) {
      let sub = ''
      while (i < formula.length && isSubscript(formula[i])) {
        sub += SUBSCRIPT_MAP[formula[i]]
        i++
      }
      nodes.push(<sub key={`sub-${i}`}>{sub}</sub>)
    } else if (isSuperscript(ch)) {
      let sup = ''
      while (i < formula.length && isSuperscript(formula[i])) {
        sup += SUPERSCRIPT_MAP[formula[i]]
        i++
      }
      nodes.push(<sup key={`sup-${i}`}>{sup}</sup>)
    } else {
      nodes.push(ch)
      i++
    }
  }

  return nodes
}

export const ChemicalFormula: React.FC<ChemicalFormulaProps> = ({ formula, className = '' }) => {
  if (!formula) return null
  return <span className={className}>{parseFormula(formula)}</span>
}
