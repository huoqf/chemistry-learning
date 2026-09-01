import { describe, it } from 'vitest'
import { VALENCE_MATRIX_DATA } from '../valence-matrix'

// 简单的化学式原子与电荷解析器
function normalizeChemicalText(text: string): string {
  const map: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    '⁺': '+', '⁻': '-',
  }
  return text.replace(/[₀-₉⁰-⁹⁺⁻]/g, m => map[m] || m)
}

function parseFormula(formula: string): { atoms: Record<string, number>; charge: number } {
  // 先统一归一化 Unicode 下标与上标
  let clean = normalizeChemicalText(formula)
    .replace(/[↓↑]/g, '')
    .replace(/（[^）]+）/g, '')
    .replace(/\([^)]+\)/g, (m) => {
      if (/^(\(浓\)|\(稀\)|\(胶体\)|\(沉淀\)|\(砷镜\)|\(血红色\)|\(白色\)|\(黄色\)|\(无色\)|\(蓝绿色\)|\(粉红\)|\(蓝\)|\(鲜黄色\)|\(棕黑\)|s|l|g|aq)$/.test(m.replace(/[\(\)]/g, ''))) {
        return ''
      }
      return m
    })
    .trim()

  // 解析电荷
  let charge = 0
  const chargeMatch = clean.match(/([0-9]*)([+-])$/)
  if (chargeMatch) {
    const num = chargeMatch[1] ? parseInt(chargeMatch[1], 10) : 1
    charge = chargeMatch[2] === '+' ? num : -num
    clean = clean.replace(/([0-9]*)([+-])$/, '')
  }

  // 解析配位化合物或带括号基团，这里用标准正则递归展开
  const expandBrackets = (str: string): string => {
    let prev = str
    while (true) {
      const next = prev.replace(/[\(\[]([A-Za-z0-9]+)[\)\]]([0-9]*)/g, (_: string, group: string, countStr: string) => {
        const count = countStr ? parseInt(countStr, 10) : 1
        // 将 group 里的每个原子计数乘以 count
        return group.replace(/([A-Z][a-z]?)([0-9]*)/g, (__: string, elem: string, cStr: string) => {
          const c = cStr ? parseInt(cStr, 10) : 1
          return `${elem}${c * count}`
        })
      })
      if (next === prev) break
      prev = next
    }
    return prev
  }

  clean = expandBrackets(clean)

  const atoms: Record<string, number> = {}
  const atomRegex = /([A-Z][a-z]?)([0-9]*)/g
  let match: RegExpExecArray | null
  while ((match = atomRegex.exec(clean)) !== null) {
    const elem = match[1]
    const count = match[2] ? parseInt(match[2], 10) : 1
    atoms[elem] = (atoms[elem] || 0) + count
  }

  return { atoms, charge }
}

function parseSide(sideStr: string): { atoms: Record<string, number>; charge: number } {
  const parts = sideStr.split(/\s*\+\s*/)
  const totalAtoms: Record<string, number> = {}
  let totalCharge = 0

  for (let part of parts) {
    part = part.trim()
    if (!part) continue

    // 匹配化学计量数
    const coeffMatch = part.match(/^([0-9]+)\s*(.*)$/)
    let coeff = 1
    let formula = part
    if (coeffMatch) {
      coeff = parseInt(coeffMatch[1], 10)
      formula = coeffMatch[2]
    }

    const { atoms, charge } = parseFormula(formula)
    totalCharge += charge * coeff
    for (const [elem, count] of Object.entries(atoms)) {
      totalAtoms[elem] = (totalAtoms[elem] || 0) + count * coeff
    }
  }

  return { atoms: totalAtoms, charge: totalCharge }
}

describe('方程式配平与化学守恒扫描', () => {
  it('扫描所有 40 个元素的全部方程式并报告守恒异常', () => {
    const allEqs: { source: string; eq: string }[] = []

    Object.values(VALENCE_MATRIX_DATA).forEach(elem => {
      elem.items.forEach(item => {
        if (item.equation) {
          item.equation.split(/;|\n/).forEach(subEq => {
            const trimmed = subEq.trim()
            if (trimmed) allEqs.push({ source: `[${elem.symbol}] item: ${item.substance}`, eq: trimmed })
          })
        }
      })
      elem.transformations.forEach(trans => {
        if (trans.equation) {
          trans.equation.split(/;|\n/).forEach(subEq => {
            const trimmed = subEq.trim()
            if (trimmed) allEqs.push({ source: `[${elem.symbol}] trans: ${trans.id} (${trans.fromSubstance}->${trans.toSubstance})`, eq: trimmed })
          })
        }
      })
    })

    console.log(`共收集到 ${allEqs.length} 条待检验化学方程式`)

    const balanceIssues: string[] = []

    for (const { source, eq } of allEqs) {
      // 提取左右两边
      // 支持 =△=, =光照=, =点燃=, =电解=, =, ⇌, →
      const sepMatch = eq.match(/(=[^=]*=|=|⇌|→)/)
      if (!sepMatch) continue

      const sep = sepMatch[0]
      const [leftStr, rightStr] = eq.split(sep)
      if (!leftStr || !rightStr) continue

      try {
        const left = parseSide(leftStr)
        const right = parseSide(rightStr)

        // 比较原子
        const allElems = new Set([...Object.keys(left.atoms), ...Object.keys(right.atoms)])
        const diffs: string[] = []
        for (const el of allElems) {
          const lCount = left.atoms[el] || 0
          const rCount = right.atoms[el] || 0
          if (lCount !== rCount) {
            diffs.push(`${el}(左${lCount}!=右${rCount})`)
          }
        }

        if (left.charge !== right.charge) {
          diffs.push(`电荷(左${left.charge}!=右${right.charge})`)
        }

        if (diffs.length > 0) {
          balanceIssues.push(`${source}: "${eq}" -> 差异: ${diffs.join(', ')}`)
        }
      } catch (err) {
        // 复杂格式忽略
      }
    }

    console.log(`发现配平差异数: ${balanceIssues.length}`)
    balanceIssues.forEach(iss => console.log('  ⚠️', iss))
  })
})
