import React from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface IonChemEquationProps {
  equation?: string
  className?: string
  /** 是否突出显示（如重要必背方程式背景加深） */
  highlight?: boolean
}

interface StepItem {
  cleanFormula: string
  noteBadge?: string
}

/**
 * 清理并解析方程式字符串
 * 1. 拆分分号 `;` 分步反应
 * 2. 提取末尾括号中的现象/颜色汉字为独立 Badge
 */
function parseEquationSteps(raw: string): StepItem[] {
  if (!raw) return []

  // 按中文或英文分号切分多步反应
  const rawSteps = raw
    .split(/[;；]/)
    .map((s) => s.trim())
    .filter(Boolean)

  return rawSteps.map((stepStr) => {
    // 匹配末尾的中文/特征描述括号，如 (血红色)、(白色沉淀)、(不溶于稀硝酸的白色沉淀)
    const match = stepStr.match(/\s*[（(]([\u4e00-\u9fa5a-zA-Z0-9_、，\s]+)[)）]\s*$/)
    if (match) {
      const noteBadge = match[1].trim()
      const cleanFormula = stepStr.slice(0, match.index).trim()
      return { cleanFormula, noteBadge }
    }
    return { cleanFormula: stepStr }
  })
}

/**
 * 估算方程式在屏幕上的实际视觉字符数
 * 剔除 LaTeX 内部宏指令与格式标记，还原真实化学式的排版长度
 */
function estimateVisualLength(latex: string): number {
  return latex
    .replace(/\\(rightleftharpoons|longrightarrow|longleftrightarrow)/g, '⇌')
    .replace(/\\(rightarrow|leftarrow)/g, '→')
    .replace(/\\(downarrow|uparrow)/g, '↓')
    .replace(/\\cdot/g, '·')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}\^_]/g, '')
    .trim().length
}

/**
 * 针对高中化学长离子方程式进行符合高考书写习惯的折行处理
 * 高中化学习惯：
 * 1. 正常长度方程式（如 Fe³⁺ + 3SCN⁻ ⇌ Fe(SCN)₃ 等 95% 以上高中化学式）必须单行完整展现，严禁截断换行！
 * 2. 仅当视觉字符数超过单行极限（> 38）且左右两侧均较长时，才在反应符号处换行并等号对齐
 */
function formatLatexForWrap(formula: string): string {
  // 如果已经包含 aligned 环境或换行，直接返回
  if (formula.includes('\\begin{aligned}') || formula.includes('\\\\')) {
    return formula
  }

  // 视觉长度不超过 38 的常规化学式，单行完全能够完整显示，绝不折行
  const visualLength = estimateVisualLength(formula)
  if (visualLength <= 38) {
    return formula
  }

  // 反应符号正则（考虑 KaTeX 宏与普通等号）
  const reactionSymbols = [
    { raw: '\\rightleftharpoons', tex: '\\rightleftharpoons' },
    { raw: '\\longrightarrow', tex: '\\longrightarrow' },
    { raw: '\\rightarrow', tex: '\\rightarrow' },
    { raw: '=', tex: '=' },
  ]

  // 寻找主反应连接符
  for (const item of reactionSymbols) {
    const idx = formula.indexOf(item.raw)
    if (idx !== -1) {
      const lhs = formula.substring(0, idx).trim()
      const rhs = formula.substring(idx + item.raw.length).trim()
      const lhsVis = estimateVisualLength(lhs)
      const rhsVis = estimateVisualLength(rhs)

      // 仅当单侧确实过长（可能导致溢出）时才折行
      if (lhsVis > 18 || rhsVis > 20) {
        return `\\begin{aligned} & ${lhs} \\\\ & ${item.tex} ${rhs} \\end{aligned}`
      }
      break
    }
  }

  return formula
}

/**
 * 单个方程式 KaTeX 渲染节点
 */
const SingleStepKatex: React.FC<{ formula: string }> = ({ formula }) => {
  const containerRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el || !formula) return

    const latex = formatLatexForWrap(formula)
    try {
      katex.render(latex, el, {
        throwOnError: false,
        displayMode: false, // 行内模式配合 aligned，避免块级模式强加溢出滚动
      })
    } catch {
      el.textContent = formula
    }
  }, [formula])

  return (
    <span
      ref={containerRef}
      className="inline-block align-middle select-text text-sm leading-normal max-w-full"
    />
  )
}

/**
 * 高中化学方程式自适应渲染组件
 * - 规范分步展示（①、②）
 * - 现象/颜色分离展示，不挤占公式宽度
 * - 自动在反应等号处符合高中化学习惯折行
 * - 100% 杜绝水平滚动条，充分利用右屏宽度
 */
export const IonChemEquation: React.FC<IonChemEquationProps> = ({
  equation,
  className = '',
  highlight = false,
}) => {
  if (!equation) return null

  const steps = parseEquationSteps(equation)

  return (
    <div
      className={`w-full max-w-full space-y-1.5 overflow-hidden select-text ${className}`}
    >
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-1 p-2 rounded-lg border transition-colors ${
            highlight
              ? 'bg-indigo-50/80 border-indigo-200/90 text-indigo-950'
              : 'bg-white border-slate-200/90 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-start justify-between gap-1.5 flex-wrap">
            <div className="flex items-start gap-1 flex-1 min-w-0">
              {steps.length > 1 && (
                <span className="text-xs font-bold text-blue-700 mt-0.5 shrink-0">
                  {idx === 0 ? '①' : idx === 1 ? '②' : `(${idx + 1})`}
                </span>
              )}
              <div className="overflow-hidden max-w-full break-words">
                <SingleStepKatex formula={step.cleanFormula} />
              </div>
            </div>

            {step.noteBadge && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shrink-0 self-start">
                {step.noteBadge}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
