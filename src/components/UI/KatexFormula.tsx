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

    } catch {
      if (containerRef.current) {
        containerRef.current.textContent = formula
      }
    }
  }, [formula, mode])

  const isBlock = mode === 'block'

  const baseClass = isBlock
    ? 'katex-wrap my-1 px-1 py-0.5 rounded-sm w-full max-w-full text-left text-sm select-text'
    : 'katex-wrap inline-block align-middle mx-1 my-0.5 max-w-full text-sm select-text'

  return (
    <div
      ref={containerRef}
      className={`${baseClass} ${className}`}
    />
  )
}
