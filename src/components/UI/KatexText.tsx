import React from 'react'
import { KatexFormula } from './KatexFormula'

interface KatexTextProps {
  text: string
  className?: string
}

/**
 * KatexText — 智能文本与 $...$ 包裹的 LaTeX 公式混合渲染组件
 *
 * 自动解析文本中由 $...$ 包裹的 LaTeX 公式，并高保真渲染为行内 KatexFormula。
 */
export const KatexText: React.FC<KatexTextProps> = ({ text, className = '' }) => {
  if (!text) return null
  if (!text.includes('$')) {
    return <span className={className}>{text}</span>
  }

  const parts = text.split(/(\$[^\$]+\$)/g)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const formula = part.slice(1, -1)
          return <KatexFormula key={index} formula={formula} mode="inline" className="!my-0 !mx-0.5" />
        }
        return <React.Fragment key={index}>{part}</React.Fragment>
      })}
    </span>
  )
}
