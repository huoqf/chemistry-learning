import React, { useMemo } from 'react'
import { ChemicalFormula } from '@/components/UI'

interface ChemicalEquationViewProps {
  equation: string
  className?: string
}

/**
 * ChemicalEquationView — 符合高中化学排版习惯的化学方程式自动换行组件
 *
 * 核心排版规则：
 * 1. 项内不可分割：每个微粒/物质（如 2Fe²⁺、Cr₂O₇²⁻、[Al(OH)₄]⁻、Fe(OH)₃↓）保持 inline-block whitespace-nowrap，绝对不在分子式内部腰斩；
 * 2. 符号断行锚点：在反应连接符（+、=、➔、→、⇌、+ 等）处允许自然换行；
 * 3. 反应条件保护：条件（如 △、催化剂、光照）紧凑附着在反应箭头附近，不破坏主结构。
 */
export const ChemicalEquationView: React.FC<ChemicalEquationViewProps> = ({
  equation,
  className = '',
}) => {
  const parsedSegments = useMemo(() => {
    if (!equation) return []

    // 匹配化学方程中的运算符与微粒项
    // 运算符: +, =, ➔, →, ⇌, <==>, ＋
    // 兼容可能存在的条件标注如 △ 或 (浓)
    const tokens = equation.split(/(\s*[\+＋\=\➔\→\⇌]\s*)/g).filter(Boolean)

    return tokens.map((token, index) => {
      const trimmed = token.trim()
      const isOperator = /^[\+＋\=\➔\→\⇌]$/.test(trimmed)

      return {
        id: `${index}-${trimmed}`,
        isOperator,
        text: trimmed,
      }
    })
  }, [equation])

  if (!equation) return null

  return (
    <div className={`flex flex-wrap items-center gap-x-1 gap-y-1 text-slate-900 leading-normal select-text ${className}`}>
      {parsedSegments.map(seg => {
        if (seg.isOperator) {
          return (
            <span
              key={seg.id}
              className="inline-block px-0.5 text-slate-400 font-bold shrink-0 text-xs"
            >
              {seg.text === '=' ? '=' : seg.text}
            </span>
          )
        }
        return (
          <span
            key={seg.id}
            className="inline-block whitespace-nowrap font-medium"
          >
            <ChemicalFormula formula={seg.text} />
          </span>
        )
      })}
    </div>
  )
}
