import { describe, it, expect } from 'vitest'
import { VALENCE_MATRIX_DATA } from '../valence-matrix'

// 简单的化学式原子与电荷解析器
function parseFormula(formula: string): { atoms: Record<string, number>; charge: number } {
  // 1. 过滤状态、颜色标记、气体沉淀符号、状态 (s)/(l)/(g)/(aq) 及任意包含中文注释的括号
  let clean = formula
    .replace(/[↓↑]/g, '')
    .replace(/（[^）]+）/g, '')
    .replace(/\([^)]*[\u4e00-\u9fa5]+[^)]*\)/g, '')
    .replace(/\b\((s|l|g|aq)\)/gi, '')
    .trim()

  // 若整个化学式被单个括号包裹（例如 "(CaSO4·2H2O)"），剥离外层括号
  if (clean.startsWith('(') && clean.endsWith(')') && !clean.slice(1, -1).includes('(') && !clean.slice(1, -1).includes(')')) {
    clean = clean.slice(1, -1).trim()
  }

  // 2. 将下标数字优先归一化为标准阿拉伯数字
  const subMap: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  }
  clean = clean.replace(/[₀-₉]/g, m => subMap[m] || m)

  // 3. 解析结晶水或加合物点乘 · (如 CoCl₂·6H₂O, MgCl₂·6H₂O, CaSO₄·2H₂O)
  if (clean.includes('·')) {
    const dotParts = clean.split('·')
    const mainFormula = dotParts[0].trim()
    const main = parseFormula(mainFormula)
    const adductStr = dotParts.slice(1).join('·').trim()
    const adductMatch = adductStr.match(/^([0-9]*)(.*)$/)
    const adductCoeff = adductMatch && adductMatch[1] ? parseInt(adductMatch[1], 10) : 1
    const adductFormula = adductMatch && adductMatch[2] ? adductMatch[2] : adductStr
    const adduct = parseFormula(adductFormula)
    const combinedAtoms: Record<string, number> = {}
    for (const [elem, count] of Object.entries(main.atoms)) {
      combinedAtoms[elem] = count
    }
    for (const [elem, count] of Object.entries(adduct.atoms)) {
      combinedAtoms[elem] = (combinedAtoms[elem] || 0) + count * adductCoeff
    }
    return { atoms: combinedAtoms, charge: main.charge + adduct.charge }
  }

  // 3. 解析电荷：先精准检测 Unicode 上标电荷（如 ⁺, ⁻, ²⁺, ³⁻ 等）
  let charge = 0
  const supChargeMatch = clean.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/)
  if (supChargeMatch) {
    const digitMap: Record<string, number> = {
      '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4,
      '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9,
    }
    const supDigits = supChargeMatch[1]
    const sign = supChargeMatch[2] === '⁺' ? 1 : -1
    let num = 1
    if (supDigits.length > 0) {
      num = 0
      for (const ch of supDigits) {
        num = num * 10 + (digitMap[ch] ?? 0)
      }
    }
    charge = sign * num
    clean = clean.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/, '')
  } else {
    // 检测普通 ASCII 电荷（必须跟在元素/右括号之后）
    const asciiChargeMatch = clean.match(/([0-9]*)([+-])$/)
    if (asciiChargeMatch) {
      const num = asciiChargeMatch[1] ? parseInt(asciiChargeMatch[1], 10) : 1
      charge = asciiChargeMatch[2] === '+' ? num : -num
      clean = clean.replace(/([0-9]*)([+-])$/, '')
    }
  }



  // 5. 解析配位化合物或带括号基团，递归展开 (Group)count 或 [Group]count
  const expandBrackets = (str: string): string => {
    let prev = str
    while (true) {
      const next = prev.replace(/[([]([A-Za-z0-9]+)[)\]]([0-9]*)/g, (_: string, group: string, countStr: string) => {
        const count = countStr ? parseInt(countStr, 10) : 1
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
  // 分解以 + 连接的各项，并兼容处理 - 电子项（如 Pb + SO4^2- - 2e-）
  const parts = sideStr.split(/\s*\+\s*/)
  const totalAtoms: Record<string, number> = {}
  let totalCharge = 0

  for (let part of parts) {
    part = part.trim()
    if (!part) continue

    // 预处理整体带括号的水合物，如 2(CaSO₄·2H₂O) -> 剥离括号，保留系数 2CaSO₄·2H₂O
    let processedPart = part.replace(/([0-9]+)\(([A-Za-z0-9₀-₉]+·[0-9₀-₉]*H[₂2]O)\)/g, (_, cStr, hydrateStr) => {
      return `${cStr}${hydrateStr}`
    })

    // 检查是否存在内部减去电子项，如 "Pb + SO₄²⁻ - 2e⁻" 或 "Ni(OH)₂ - e⁻"
    let subParts = [processedPart]
    if (processedPart.includes(' - ')) {
      subParts = processedPart.split(' - ')
    }

    for (let idx = 0; idx < subParts.length; idx++) {
      let sub = subParts[idx].trim()
      if (!sub) continue
      const isSubtracted = idx > 0

      // 过滤电化学半反应中的电子项，如 "2e⁻" 或 "e⁻"
      if (/^[0-9]*\s*e[⁻-]?$/.test(sub)) {
        const eMatch = sub.match(/^([0-9]*)\s*e/)
        const eCount = eMatch && eMatch[1] ? parseInt(eMatch[1], 10) : 1
        // 电子本身带-1价。如果是 - 2e⁻，则相当于 - (-2) = +2 电荷；如果是 + 2e⁻，相当于 + (-2) = -2 电荷
        totalCharge += isSubtracted ? eCount : -eCount
        continue
      }

      // 匹配前导化学计量数
      let coeff = 1
      let formula = sub
      const coeffMatch = sub.match(/^([0-9]+)\s*(.*)$/)
      if (coeffMatch && coeffMatch[2]) {
        coeff = parseInt(coeffMatch[1], 10)
        formula = coeffMatch[2]
      }

      const { atoms, charge } = parseFormula(formula)
      const multiplier = (isSubtracted ? -1 : 1) * coeff
      totalCharge += charge * multiplier
      for (const [elem, count] of Object.entries(atoms)) {
        totalAtoms[elem] = (totalAtoms[elem] || 0) + count * multiplier
      }
    }
  }

  return { atoms: totalAtoms, charge: totalCharge }
}

describe('方程式配平与化学守恒扫描', () => {
  it('扫描所有 40 个元素的全部方程式并验证原子与电荷守恒', () => {
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

    const balanceIssues: string[] = []

    for (const { source, eq } of allEqs) {
      // 过滤定性检验现象描述、有机示性/结构通式、热化学焓变式
      if (
        eq.includes('品红') ||
        eq.includes('酚酞') ||
        eq.includes('褪色') ||
        eq.includes('ΔH') ||
        eq.includes('(x+2)') ||
        eq.includes('R-CH') ||
        eq.includes('CH₂=CH₂') ||
        eq.includes('DMG')
      ) {
        continue
      }

      // 分离反应物与生成物
      // 优先匹配被包含在 =...= 或 ⇌...⇌ 之间的条件符号
      const sepMatch = eq.match(/(=[^=]*=|=|⇌[^⇌]*⇌|⇌|→)/)
      if (!sepMatch) continue

      const sep = sepMatch[0]
      const [leftRaw, rightRaw] = eq.split(sep)
      if (!leftRaw || !rightRaw) continue

      // 清理反应条件或非核心注释文本
      const leftStr = leftRaw
        .replace(/\([^)]*电极反应[^)]*\)/g, '')
        .replace(/\([^)]*高温高压[^)]*\)/g, '')
        .trim()
      const rightStr = rightRaw
        .replace(/\([^)]*电极反应[^)]*\)/g, '')
        .replace(/\([^)]*归中[^)]*\)/g, '')
        .replace(/\([^)]*充电还原[^)]*\)/g, '')
        .replace(/\([^)]*负极反应[^)]*\)/g, '')
        .replace(/\([^)]*正极反应[^)]*\)/g, '')
        .replace(/\([^)]*高温高压[^)]*\)/g, '')
        .trim()

      try {
        const left = parseSide(leftStr)
        const right = parseSide(rightStr)

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
        balanceIssues.push(`${source}: "${eq}" -> 解析异常: ${(err as Error).message}`)
      }
    }

    if (balanceIssues.length > 0) {
      console.error(`发现 ${balanceIssues.length} 条待核实配平/解析项:`)
      balanceIssues.forEach(iss => console.error('  ⚠️', iss))
    }

    // 真正断言守恒
    expect(balanceIssues).toEqual([])
  })
})


