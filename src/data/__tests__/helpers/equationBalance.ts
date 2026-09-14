/**
 * src/data/__tests__/helpers/equationBalance.ts
 *
 * 化学方程式原子/电荷守恒扫描器（可复用）。
 *
 * 由原 equationsBalanceScan.test.ts 内联实现抽取而来，并补上：
 *   1. LaTeX → Unicode 归一化（项目内两套写法并存）；
 *   2. 多段链式守恒校验（`A ⇌ B → C` 逐段核对，而非只拆第一段）；
 *   3. 结构双键识别（`CH₂=CH₂` / `R₂C=O` 中的 `=` 不算反应符）。
 *
 * 覆盖数据源：价类二维图、离子共存矩阵、官能团矩阵、气体链、题库、易错卡。
 * 本模块只做“归一化 + 解析 + 比对”，不做断言；断言与显式豁免名单由各测试文件声明。
 */

export interface ParsedSide {
  atoms: Record<string, number>
  charge: number
}

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
}

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻',
}

function toSubscript(s: string): string {
  return s.replace(/[0-9]/g, d => SUBSCRIPT_MAP[d] ?? d)
}

function toSuperscript(s: string): string {
  return s.replace(/[0-9+-]/g, c => SUPERSCRIPT_MAP[c] ?? c)
}

/**
 * 将项目内广泛使用的 LaTeX 方程式方言归一化为 Unicode 化学式。
 * 仅处理“与守恒判定相关”的语法（下标、上标电荷、沉淀/气体符号、反应箭头、
 * 括号内的补充方程式、尾部的 ΔH 标注），不处理 \frac 等纯数学排版
 * （此类条目应由调用方显式豁免）。
 */
export function normalizeLatexEquation(text: string): string {
  let s = text
    .replace(/\$\$?/g, '')
    .replace(/\\(?:text|mathrm|mathbf|operatorname|ce)\{([^{}]*)\}/g, '$1')
    .replace(/\\xrightarrow(?:\[[^\]]*\])?\{[^{}]*\}/g, '→')
    .replace(/\\xleftarrow(?:\[[^\]]*\])?\{[^{}]*\}/g, '←')
    .replace(/\\longrightarrow|\\rightarrow|\\to\b/g, '→')
    .replace(/\\rightleftharpoons|\\leftrightharpoons|\\rightleftarrows/g, '⇌')
    .replace(/\\downarrow/g, '↓')
    .replace(/\\uparrow/g, '↑')
    .replace(/\\cdot/g, '·')
    .replace(/\\(?:Delta|delta)/g, 'Δ')
    .replace(/\\left|\\right/g, '')
    .replace(/\\[a-zA-Z]*quad|\\[a-zA-Z]*qquad|\\,|\\;|\\!|\\ /g, ' ')

  s = s
    .replace(/_\{([^{}]*)\}/g, (_: string, g: string) => toSubscript(g))
    .replace(/_([0-9])/g, (_: string, d: string) => toSubscript(d))
    .replace(/\^\{([^{}]*)\}/g, (_: string, g: string) => toSuperscript(g))
    .replace(/\^([0-9+-])/g, (_: string, c: string) => toSuperscript(c))

  // 括号内的补充方程式（如 "(SiO₂ + 4HF = SiF₄↑ + 2H₂O)"）另行单独处理，先整体剥离
  s = s.replace(/\([^()]*[=⇌→][^()]*\)/g, ' ')
  // 尾部的 ΔH 方向标注（如 "  Δ H < 0 (加压平衡右移)"）不属于方程式本体
  s = s.replace(/Δ\s*H\s*[<>][\s\S]*$/, '')
  // 未闭合的括号（叙述被切分时常见，如 "O₂↑ (增重 Δm 等同于 CO"）：连同其后内容整体剥离，
  // 否则括号内的元素符号（CO 里的 C、O）会被误计入守恒比对。
  s = s.replace(/[（(][^（）()]*$/, ' ')
  // 起始处游离的右括号（上一条的对偶情形）
  s = s.replace(/^[^（）()]*[）)]/, ' ')

  return s
}

/**
 * 将一条可能包含多条方程式的文本，归一化后切分为若干独立的方程式。
 * 切分依据：
 *   - `;` / `；` / 换行
 *   - `|` 或 `:` / `：`（"方案名: 方程式" 或 "方案A | 方案B" 的编号/并列写法）
 *   - `或`（并列备选方案）
 *   - 逗号，但**仅限不在反应条件内部**的逗号（本项目把条件写在 `=MnO₂=` / `⇌V₂O₅,450℃⇌` 内，
 *     条件里自带的逗号不能被当成方程式的分隔符，否则条件会被劈成两半并制造误报）。
 *
 * 注：切分产生的片段若无反应箭头，会被 scanEquations 的 looksLikeEquation 过滤，
 * 因此“多切一刀”不会引入误报，只是让夹带叙述的片段被正确剥离出去。
 */
export function splitEquations(text: string): string[] {
  const normalized = normalizeLatexEquation(text)
  const out: string[] = []
  for (const seg of normalized.split(/[;；\n|]/)) {
    for (const alt of seg.split(/\s*或\s*(?=[\s\S]*[=⇌→])/)) {
      for (const colonPart of alt.split(/\s*[:：]\s*/)) {
        for (const part of splitTopLevelCommas(colonPart)) {
          const t = part.trim()
          if (t) out.push(t)
        }
      }
    }
  }
  return out
}

/** 按逗号切分，但跳过落在“反应条件内部”的逗号（条件由 findSeparators 的合并结果标出） */
function splitTopLevelCommas(text: string): string[] {
  const conditionSpans = findSeparators(text).filter(s => s.length > 1)

  const parts: string[] = []
  const re = /,\s*(?=[^,]*[=⇌→])/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const commaIndex = m.index
    const insideCondition = conditionSpans.some(
      s => commaIndex > s.index && commaIndex < s.index + s.length
    )
    if (insideCondition) continue
    parts.push(text.slice(last, commaIndex))
    last = commaIndex + m[0].length
  }
  parts.push(text.slice(last))
  return parts
}

/** 解析单个化学式（含下标、上标电荷、结晶水、括号基团、配位结构） */
export function parseFormula(formula: string): ParsedSide {
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

  // 4. 解析电荷：先精准检测 Unicode 上标电荷（如 ⁺, ⁻, ²⁺, ³⁻ 等）
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

/** 解析方程式一侧（以 + 连接的若干项，兼容 - 2e⁻ 电子项） */
export function parseSide(sideStr: string): ParsedSide {
  const parts = sideStr.split(/\s*\+\s*/)
  const totalAtoms: Record<string, number> = {}
  let totalCharge = 0

  for (let part of parts) {
    part = part.trim()
    if (!part) continue

    // 预处理整体带括号的水合物，如 2(CaSO₄·2H₂O) -> 剥离括号，保留系数 2CaSO₄·2H₂O
    const processedPart = part.replace(/([0-9]+)\(([A-Za-z0-9₀-₉]+·[0-9₀-₉]*H[₂2]O)\)/g, (_, cStr, hydrateStr) => {
      return `${cStr}${hydrateStr}`
    })

    // 检查是否存在内部减去电子项，如 "Pb + SO₄²⁻ - 2e⁻" 或 "Ni(OH)₂ - e⁻"
    let subParts = [processedPart]
    if (processedPart.includes(' - ')) {
      subParts = processedPart.split(' - ')
    }

    for (let idx = 0; idx < subParts.length; idx++) {
      const sub = subParts[idx].trim()
      if (!sub) continue
      const isSubtracted = idx > 0

      // 过滤电化学半反应中的电子项，如 "2e⁻" 或 "e⁻"
      if (/^[0-9]*\s*e[⁻-]?$/.test(sub)) {
        const eMatch = sub.match(/^([0-9]*)\s*e/)
        const eCount = eMatch && eMatch[1] ? parseInt(eMatch[1], 10) : 1
        // 电子本身带 -1 价。如果是 - 2e⁻，则相当于 - (-2) = +2 电荷
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

export interface EquationEntry {
  /** 出处标识，用于报错定位 */
  source: string
  /** 单条方程式文本（可含多条，由 splitEquations 切分） */
  equation: string
}

export interface BalanceIssue {
  source: string
  equation: string
  detail: string
}

/**
 * 判断归一化后的文本是否“看起来像一条可配平的化学方程式”。
 * 用于在叙述性文本（现象、解析、物理量关系式）中筛选候选式，避免误报。
 */
export function looksLikeEquation(text: string): boolean {
  if (!text) return false
  if (!/[=⇌→]/.test(text)) return false
  // 必须出现元素符号 + 下标数字（如 H₂O / CO2 / Fe3+）或方括号配离子
  return /[A-Z][a-z]?[₀-₉0-9]/.test(text) || /[[(][A-Z][a-z]?/.test(text)
}

const FORMULA_CHAR = /[A-Za-z0-9₀-₉)\]]/

/**
 * 找出方程式中的所有“反应分隔符”位置。
 * - `→` 与 `⇌` 一律视为反应符；
 * - `=` 只有在**不是**结构双键（紧邻两侧都是化学式字符，如 CH₂=CH₂、R₂C=O）时才视为反应符；
 * - 本项目把**反应条件写在分隔符对内**（`2H₂O₂ =MnO₂= 2H₂O + O₂↑`、`2SO₂ + O₂ ⇌V₂O₅,450℃⇌ 2SO₃`、
 *   `TiCl₄ + 2Mg =800℃,Ar= Ti + 2MgCl₂`）：相邻两个**同类型**分隔符之间若只夹着条件文本，
 *   合并为一个分隔符（条件不属于任何一段，直接跨过）。
 */
export function findSeparators(eq: string): Array<{ index: number; length: number; token: string }> {
  const raw: Array<{ index: number; length: number; token: string }> = []

  const arrowRe = /→|⇌/g
  let m: RegExpExecArray | null
  while ((m = arrowRe.exec(eq)) !== null) {
    raw.push({ index: m.index, length: m[0].length, token: m[0] })
  }

  const eqRe = /=/g
  while ((m = eqRe.exec(eq)) !== null) {
    const before = eq[m.index - 1]
    const after = eq[m.index + 1]
    const isStructuralBond =
      before !== undefined &&
      after !== undefined &&
      FORMULA_CHAR.test(before) &&
      /[A-Za-z[(]/.test(after)
    if (!isStructuralBond) {
      raw.push({ index: m.index, length: 1, token: '=' })
    }
  }

  raw.sort((a, b) => a.index - b.index)

  // 合并 “=条件=” / “⇌条件⇌”：同类型且中间不含其它分隔符、条件足够短且不含括号
  const MAX_CONDITION_LEN = 14
  const merged: Array<{ index: number; length: number; token: string }> = []
  for (const sep of raw) {
    const prev = merged[merged.length - 1]
    if (prev && sep.token === prev.token && (sep.token === '=' || sep.token === '⇌')) {
      const gap = eq.slice(prev.index + prev.length, sep.index)
      const looksLikeCondition = gap.length <= MAX_CONDITION_LEN && !/[=⇌→()（）]/.test(gap)
      if (looksLikeCondition) {
        // 把条件段吞掉：延长前一个分隔符，使其跨越两个分隔符之间的全部内容
        prev.length = sep.index + sep.length - prev.index
        continue
      }
    }
    merged.push({ ...sep })
  }

  return merged
}

/**
 * 扫描一组方程式，返回不守恒（原子数或电荷不平衡）的条目。
 *
 * 对链式写法（`A ⇌ B → C`）逐段核对相邻两段是否守恒；
 * 纯条件片段（如 `(高温)`）解析后为空，自动跳过不参与比对。
 *
 * @param entries   待扫描条目
 * @param whitelist 显式豁免判定函数：返回 true 表示该条不在守恒校验范围
 *                  （如定性描述、有机通式、守恒表达式、物理量关系式）。
 *                  豁免必须显式声明，不允许静默跳过。
 */
export function scanEquations(
  entries: EquationEntry[],
  whitelist: (equation: string) => boolean = () => false
): BalanceIssue[] {
  const issues: BalanceIssue[] = []

  for (const { source, equation } of entries) {
    const subEquations = splitEquations(equation)

    for (const eq of subEquations) {
      if (!eq) continue
      if (!looksLikeEquation(eq)) continue
      if (whitelist(eq)) continue

      const seps = findSeparators(eq)
      if (seps.length === 0) continue

      // 依据分隔符切分为若干段，并统计每段的原子/电荷
      const rawSegments: string[] = []
      let cursor = 0
      for (const sep of seps) {
        rawSegments.push(eq.slice(cursor, sep.index))
        cursor = sep.index + sep.length
      }
      rawSegments.push(eq.slice(cursor))

      const segments = rawSegments
        .map(raw => raw.replace(/\([^)]*电极反应[^)]*\)/g, '').replace(/\([^)]*高温高压[^)]*\)/g, '').trim())
        .filter(t => t.length > 0)
        .map(text => ({ text, parsed: parseSide(text) }))
        .filter(seg => Object.keys(seg.parsed.atoms).length > 0)

      if (segments.length < 2) continue

      for (let i = 0; i + 1 < segments.length; i++) {
        const left = segments[i].parsed
        const right = segments[i + 1].parsed

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
          const stepLabel = segments.length > 2 ? `第${i + 1}段: ${segments[i].text} -> ${segments[i + 1].text} ` : ''
          issues.push({
            source,
            equation: eq,
            detail: `${stepLabel}差异: ${diffs.join(', ')}`,
          })
        }
      }
    }
  }

  return issues
}

/**
 * 从任意嵌套数据结构中，按字段名白名单收集候选方程式文本。
 * 用于让新数据源无需改动扫描器即可纳入覆盖。
 */
export function collectEquations(
  node: unknown,
  path: string,
  fieldNames: ReadonlySet<string>,
  out: EquationEntry[] = [],
  seen = new Set<unknown>()
): EquationEntry[] {
  if (node === null || typeof node !== 'object') return out
  if (seen.has(node)) return out
  seen.add(node)

  if (Array.isArray(node)) {
    node.forEach((v, i) => collectEquations(v, `${path}[${i}]`, fieldNames, out, seen))
    return out
  }

  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (typeof value === 'string' && fieldNames.has(key)) {
      out.push({ source: `${path}.${key}`, equation: value })
    } else if (
      Array.isArray(value) &&
      fieldNames.has(key) &&
      value.length > 0 &&
      value.every(v => typeof v === 'string')
    ) {
      ;(value as string[]).forEach((v, i) => out.push({ source: `${path}.${key}[${i}]`, equation: v }))
    } else {
      collectEquations(value, `${path}.${key}`, fieldNames, out, seen)
    }
  }

  return out
}
