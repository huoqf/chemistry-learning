import React from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface OrganicChemEquationProps {
  equation?: string
  className?: string
  /** 是否突出显示核心重点方程式 */
  highlight?: boolean
  /** 反应类型或标题标签（如：完全碱性水解、特征氧化显色） */
  label?: string
}

interface StepItem {
  cleanFormula: string
  phenomenonBadge?: string
}

/**
 * 提取末尾括号中的现象/状态汉字（如：(产生无色气泡)、(砖红色沉淀)、(紫色褪去)）为独立徽章
 */
function parseEquationSteps(raw: string): StepItem[] {
  if (!raw) return []

  const rawSteps = raw
    .split(/[;；]/)
    .map((s) => s.trim())
    .filter(Boolean)

  return rawSteps.map((stepStr) => {
    const match = stepStr.match(/\s*[（(]([\u4e00-\u9fa5a-zA-Z0-9_、，+\-\s]+)[)）]\s*$/)
    if (match) {
      const phenomenonBadge = match[1].trim()
      const cleanFormula = stepStr.slice(0, match.index).trim()
      return { cleanFormula, phenomenonBadge }
    }
    return { cleanFormula: stepStr }
  })
}

/**
 * 估算方程式在屏幕上的实际视觉字符宽度
 */
function estimateVisualLength(latex: string): number {
  return latex
    .replace(/\\xrightarrow(?:\[.*?\])?\{(.*?)\}/g, '---$1---')
    .replace(/\\(rightleftharpoons|longrightarrow|rightarrow)/g, '-->')
    .replace(/\\(downarrow|uparrow|Delta)/g, '__')
    .replace(/\\text\{([^}]*)\}/g, '$1$1')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}\^_]/g, '')
    .trim().length
}

/**
 * 针对有机化学长方程式进行符合高中教材与高考书写习惯的折行处理：
 * 1. 较短反应式（视觉宽度 <= 22）：单行完整呈现，绝不截断；
 * 2. 较长反应式：优先在反应连接符（\rightarrow, \xrightarrow, \rightleftharpoons）处换行；
 * 3. 反应物居首行，连接符与首个生成物居次行；若生成物项极长，在顶级加号处折行并二次缩进；
 * 4. 绝不切碎单个完整基团（如 CH3COO-C6H4-COOH）。
 */
function formatLatexForWrap(formula: string): string {
  if (formula.includes('\\begin{aligned}') || formula.includes('\\\\')) {
    return formula
  }

  const visualLength = estimateVisualLength(formula)
  if (visualLength <= 22) {
    return formula
  }

  // 反应连接符正则（按优先级排序）
  const reactionSymbols = [
    { raw: '\\xrightarrow{\\Delta}', tex: '\\xrightarrow{\\Delta}' },
    { raw: '\\xrightarrow{\\text{浓}H_2SO_4,\\Delta}', tex: '\\xrightarrow{\\text{浓}H_2SO_4,\\Delta}' },
    { raw: '\\rightleftharpoons', tex: '\\rightleftharpoons' },
    { raw: '\\longrightarrow', tex: '\\longrightarrow' },
    { raw: '\\rightarrow', tex: '\\rightarrow' },
    { raw: '=', tex: '=' },
  ]

  for (const item of reactionSymbols) {
    const idx = formula.indexOf(item.raw)
    if (idx !== -1) {
      const lhs = formula.substring(0, idx).trim()
      const rhs = formula.substring(idx + item.raw.length).trim()

      // 拆分生成物项
      const plusParts = rhs.split(/\s+\+\s+/)
      if (plusParts.length > 1 && estimateVisualLength(`${item.tex} ${rhs}`) > 22) {
        // 生成物拆行：第一项跟在箭头后，后续项双重缩进
        const firstProduct = plusParts[0].trim()
        const restProducts = plusParts.slice(1).map((p) => `+ ${p.trim()}`).join(' \\\\\n& \\qquad ')
        return `\\begin{aligned}\n& ${lhs} \\\\\n& \\quad ${item.tex} ${firstProduct} \\\\\n& \\qquad ${restProducts}\n\\end{aligned}`
      }

      return `\\begin{aligned}\n& ${lhs} \\\\\n& \\quad ${item.tex} ${rhs}\n\\end{aligned}`
    }
  }

  return formula
}

/**
 * 单个方程式 KaTeX 节点（采用 displayMode: false 配合 aligned，100% 杜绝水平滚动条）
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
        displayMode: false,
      })
    } catch {
      el.textContent = formula
    }
  }, [formula])

  return (
    <span
      ref={containerRef}
      className="inline-block align-middle select-text text-xs sm:text-[13px] leading-relaxed max-w-full"
    />
  )
}

/**
 * 有机化学方程式自适应排版组件
 */
export const OrganicChemEquation: React.FC<OrganicChemEquationProps> = ({
  equation,
  className = '',
  highlight = false,
  label,
}) => {
  if (!equation) return null

  const steps = parseEquationSteps(equation)

  return (
    <div className={`w-full max-w-full space-y-1.5 overflow-hidden select-text ${className}`}>
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-1 p-2 rounded-lg border transition-colors ${
            highlight
              ? 'bg-indigo-50/70 border-indigo-200/80 text-indigo-950'
              : 'bg-white border-slate-200/80 text-slate-900 shadow-2xs'
          }`}
        >
          {/* 标签栏（分步序号/名称/现象Badge） */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              {steps.length > 1 && (
                <span className="text-xs font-bold text-indigo-600">
                  {idx === 0 ? '①' : idx === 1 ? '②' : `(${idx + 1})`}
                </span>
              )}
              {label && (
                <span className="text-[11px] font-semibold text-slate-500">
                  {label}
                </span>
              )}
            </div>

            {step.phenomenonBadge && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                {step.phenomenonBadge}
              </span>
            )}
          </div>

          {/* 渲染区域：无水平滚动条，自动科学换行 */}
          <div className="overflow-hidden max-w-full break-words py-0.5">
            <SingleStepKatex formula={step.cleanFormula} />
          </div>
        </div>
      ))}
    </div>
  )
}
