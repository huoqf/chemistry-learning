import React from 'react'

/**
 * 将文本中的 N_A / $N_A$ / $N_{\text{A}}$ 等占位符渲染为下标形式的 N_A。
 *
 * 支持匹配：
 * - (N_A)
 * - N_A
 * - $N_A$
 * - $N_{A}$
 * - $N_{\text{A}}$
 */
export function renderNaText(text: string): React.ReactNode {
  if (!text) return text
  const parts = text.split(/(\(N_A\)|N_A|\$N_A\$|\$N_\{A\}\$|\$N_\{\\text\{A\}\}\$)/g)
  if (parts.length === 1) return text

  return parts.map((part, index) => {
    if (part === '(N_A)') {
      return (
        <span key={index} className="inline-flex items-baseline">
          (<i>N</i><sub className="font-normal text-[0.85em]">A</sub>)
        </span>
      )
    }
    if (
      part === 'N_A' ||
      part === '$N_A$' ||
      part === '$N_{A}$' ||
      part === '$N_{\\text{A}}$'
    ) {
      return (
        <span key={index} className="inline-flex items-baseline ml-0.5">
          <i>N</i><sub className="font-normal text-[0.85em]">A</sub>
        </span>
      )
    }
    return part
  })
}
