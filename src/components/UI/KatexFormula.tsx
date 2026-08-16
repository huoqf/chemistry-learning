import React, { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface KatexFormulaProps {
  formula: string
  mode?: 'inline' | 'block'
  className?: string
}

export const KatexFormula: React.FC<KatexFormulaProps> = ({
  formula,
  mode = 'inline',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !formula) return

    try {
      katex.render(formula, el, {
        throwOnError: false,
        displayMode: mode === 'block',
      })

      if (mode === 'block' && el) {
        const katexEls = el.querySelectorAll<HTMLElement>('.katex, .katex-html, .katex-display > .katex')
        katexEls.forEach((kEl) => {
          if (kEl && kEl.style) {
            kEl.style.whiteSpace = 'normal'
            kEl.style.wordWrap = 'break-word'
            kEl.style.overflowWrap = 'break-word'
          }
        })
        const baseEls = el.querySelectorAll<HTMLElement>('.katex-display, .katex')
        baseEls.forEach((bEl) => {
          if (bEl && bEl.style) {
            bEl.style.maxWidth = '100%'
          }
        })
      }
    } catch {
      if (containerRef.current) {
        containerRef.current.textContent = formula
      }
    }
  }, [formula, mode])

  const isBlock = mode === 'block'

  const baseClass = isBlock
    ? 'my-2 px-1 py-1.5 bg-primary-50 rounded-sm w-full max-w-full overflow-x-auto overflow-y-hidden text-center'
    : 'inline-block align-middle mx-1 my-0.5 max-w-full overflow-x-auto overflow-y-hidden'

  return (
    <div
      ref={containerRef}
      className={`${baseClass} ${className}`}
      style={isBlock ? { overflowWrap: 'break-word', wordWrap: 'break-word' } : undefined}
    />
  )
}
