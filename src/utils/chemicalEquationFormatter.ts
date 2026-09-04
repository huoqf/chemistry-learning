/**
 * 高中化学教材标准化学方程式智能分行与排版工具
 *
 * 排版规范遵循人教版、苏教版高中化学教材及新高考试卷排版惯例：
 * 1. 【原子性保护】：绝不在化学分子式内部（如 Fe₂(SO₄)₃、[Ag(NH₃)₂]⁺）或状态标注之间断行；
 * 2. 【第一折行点】：反应连接符（箭头 \xrightarrow、等号 =、可逆号 \rightleftharpoons）；
 * 3. 【第二折行点】：生成物或反应物项间加号（+），续行首字符为“+”并适度缩进；
 * 4. 【对齐规范】：采用 LaTeX \begin{aligned} 统一左对齐与次行 \quad 科学缩进。
 */

// 常见反应连接符识别正则
const ARROW_PATTERN = /(\\xrightarrow(?:\[.*?\])?\{.*?\}|\\xlongequal(?:\[.*?\])?\{.*?\}|\\rightleftharpoons|\\longrightarrow|\\rightarrow|\\to|=)/

/**
 * 拆分顶级加号（忽略在花括号 {}、圆括号 ()、方括号 [] 内的加号）
 */
export function splitTopLevelPlus(expr: string): string[] {
  const parts: string[] = []
  let current = ''
  let braceDepth = 0
  let parenDepth = 0
  let bracketDepth = 0

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i]
    if (char === '{') braceDepth++
    else if (char === '}') braceDepth = Math.max(0, braceDepth - 1)
    else if (char === '(') parenDepth++
    else if (char === ')') parenDepth = Math.max(0, parenDepth - 1)
    else if (char === '[') bracketDepth++
    else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1)

    // 只有在最外层且遇到未转义的加号时进行拆分
    if (char === '+' && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
      // 避免将离子符号（如 Fe^{3+}）误拆：如果前面是 ^ 则不是反应项加号
      const prevChar = i > 0 ? expr[i - 1] : ''
      if (prevChar !== '^') {
        parts.push(current.trim())
        current = ''
        continue
      }
    }
    current += char
  }
  if (current.trim()) {
    parts.push(current.trim())
  }
  return parts.length > 0 ? parts : [expr]
}

/**
 * 估算 LaTeX 片段的视觉显示宽度（字符加权估算）
 */
export function estimateVisualWidth(latex: string): number {
  if (!latex) return 0
  // 去除无占位的宏
  const simplified = latex
    .replace(/\\text\{([^}]*)\}/g, '$1$1') // 中文按 2 字符计
    .replace(/\\xrightarrow(?:\[.*?\])?\{(.*?)\}/g, '----($1)')
    .replace(/\\(uparrow|downarrow|Delta|circ|rightleftharpoons)/g, '__')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}\^_]/g, '')
  return simplified.length
}

/**
 * 将化学方程式根据高中化学教材规范格式化为适合窄屏/卡片显示的 LaTeX 代码
 * @param rawEquation 单行或多行原始化学方程式
 * @param maxLineWidth 单行最大字符权重阈值（默认 24）
 */
export function formatChemicalEquation(rawEquation: string, maxLineWidth = 24): string {
  if (!rawEquation) return ''
  const trimmed = rawEquation.trim()

  // 如果已经包含手写 aligned 结构，先保留
  if (trimmed.startsWith('\\begin{aligned}') && trimmed.endsWith('\\end{aligned}')) {
    return trimmed
  }

  // 纯物理公式（如 n = V / Vm），如果很短直接单行
  if (estimateVisualWidth(trimmed) <= maxLineWidth) {
    return trimmed
  }

  // 查找反应连接符
  const arrowMatch = trimmed.match(ARROW_PATTERN)
  if (!arrowMatch || arrowMatch.index === undefined) {
    // 无法拆分连接符的长公式，按顶级加号拆分
    const terms = splitTopLevelPlus(trimmed)
    if (terms.length <= 1) return trimmed

    const lines: string[] = []
    let currentLine = terms[0]
    for (let i = 1; i < terms.length; i++) {
      const term = terms[i]
      if (estimateVisualWidth(currentLine + ' + ' + term) > maxLineWidth) {
        lines.push(currentLine)
        currentLine = '+ ' + term
      } else {
        currentLine += ' + ' + term
      }
    }
    lines.push(currentLine)

    return `\\begin{aligned}\n& ${lines.join(' \\\\\n& \\quad ')}\n\\end{aligned}`
  }

  const connectorIndex = arrowMatch.index
  const connector = arrowMatch[0]
  const reactants = trimmed.slice(0, connectorIndex).trim()
  const products = trimmed.slice(connectorIndex + connector.length).trim()

  // 检查反应物和生成物长度
  const reactantWidth = estimateVisualWidth(reactants)
  const connectorWidth = estimateVisualWidth(connector)
  const productWidth = estimateVisualWidth(products)

  // 1. 如果单行完全放得下，保持单行
  if (reactantWidth + connectorWidth + productWidth <= maxLineWidth) {
    return trimmed
  }

  // 2. 需要折行：首行放反应物，次行放连接符与生成物
  const lines: string[] = []

  // 反应物处理（如果反应物自身就很长，按加号拆）
  if (reactantWidth > maxLineWidth) {
    const reactantTerms = splitTopLevelPlus(reactants)
    if (reactantTerms.length > 1) {
      let rLine = reactantTerms[0]
      for (let i = 1; i < reactantTerms.length; i++) {
        if (estimateVisualWidth(rLine + ' + ' + reactantTerms[i]) > maxLineWidth) {
          lines.push(rLine)
          rLine = '+ ' + reactantTerms[i]
        } else {
          rLine += ' + ' + reactantTerms[i]
        }
      }
      lines.push(rLine)
    } else {
      lines.push(reactants)
    }
  } else {
    lines.push(reactants)
  }

  // 生成物处理
  const productTerms = splitTopLevelPlus(products)
  // 第一项通常紧随连接符：connector + ' ' + firstProduct
  if (productTerms.length <= 1) {
    lines.push(`${connector} ${products}`)
  } else {
    // 检查 connector + 全部生成物 是否能放在第二行
    if (connectorWidth + productWidth <= maxLineWidth) {
      lines.push(`${connector} ${products}`)
    } else {
      // 生成物较长，将生成物拆分折行
      let pLine = `${connector} ${productTerms[0]}`
      for (let i = 1; i < productTerms.length; i++) {
        const nextTerm = productTerms[i]
        // 尝试合并到当前生成物行
        if (estimateVisualWidth(pLine + ' + ' + nextTerm) <= maxLineWidth) {
          pLine += ' + ' + nextTerm
        } else {
          lines.push(pLine)
          pLine = `+ ${nextTerm}`
        }
      }
      lines.push(pLine)
    }
  }

  // 构造规范对齐的 LaTeX
  if (lines.length <= 1) return trimmed

  const formattedLines = lines.map((line, idx) => {
    if (idx === 0) return `& ${line}`
    // 次行（连接符开头）：稍微缩进
    if (line.startsWith(connector)) {
      return `& \\quad ${line}`
    }
    // 续行（加号开头）：双重缩进，教材标准排版
    if (line.startsWith('+')) {
      return `& \\qquad ${line}`
    }
    return `& \\quad ${line}`
  })

  return `\\begin{aligned}\n${formattedLines.join(' \\\\\n')}\n\\end{aligned}`
}
