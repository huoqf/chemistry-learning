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
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: mode === 'block',
        })
        // 允许公式在窄容器中自动换行，避免横向滚动条
        if (mode === 'block') {
          const katexEls = containerRef.current.querySelectorAll<HTMLElement>('.katex, .katex-html, .katex-display > .katex')
          katexEls.forEach((el) => {
            el.style.whiteSpace = 'normal'
            el.style.wordWrap = 'break-word'
            el.style.overflowWrap = 'break-word'
          })
          const baseEls = containerRef.current.querySelectorAll<HTMLElement>('.katex-display, .katex')
          baseEls.forEach((el) => {
            el.style.maxWidth = '100%'
          })
        }
      } catch {
        containerRef.current.textContent = formula
      }
    }
  }, [formula, mode])

  const isBlock = mode === 'block'

  const baseClass = isBlock
    ? 'my-2 px-1 py-2 bg-primary-50 rounded-sm max-w-full'
    : 'inline-block align-middle mx-1 my-0.5'

  return (
    <div
      ref={containerRef}
      className={`${baseClass} ${className}`}
      style={isBlock ? { overflowWrap: 'break-word', wordWrap: 'break-word' } : undefined}
    />
  )
}
