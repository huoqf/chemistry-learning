import React, { useState } from 'react'
import { ChevronDown, Award, AlertTriangle, AlertCircle, Info, BookOpen, FlaskConical } from 'lucide-react'
import { KatexFormula } from './KatexFormula'
import { colors } from '@/theme'
import { useTimedPulse } from '@/hooks/useTimedPulse'

// ─── 类型定义 ──────────────────────────────────────────────

interface ChemistryQuantity {
  label: string
  symbol?: string
  value: number | string
  unit: string
  color?: string
  highlight?: 'positive' | 'negative' | 'zero' | 'extreme' | 'equilibrium'
}

interface Formula {
  name: string
  latex: string
  condition?: string
  note?: string
  level?: 'core' | 'important' | 'derived' | 'supplementary'
}

interface GaokaoPoint {
  text: string
  importance: 'gaokao' | 'hard' | 'core' | 'basic' | 'extend'
}

interface WarningItem {
  text: string
  level: 'info' | 'warning' | 'danger'
}

interface ChemistryPanelProps {
  quantities: ChemistryQuantity[]
  formulas?: Formula[]
  gaokaoPoints?: GaokaoPoint[]
  warnings?: WarningItem[]
  mnemonic?: string
  isEquilibrium?: boolean
  equilibriumInfo?: string
  title?: string
}

// ─── 常量样式 ──────────────────────────────────────────────

const HIGHLIGHT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  positive: {
    bg: colors.success[50],
    text: colors.success[700],
    border: colors.success[200],
  },
  negative: {
    bg: colors.danger[50],
    text: colors.danger[700],
    border: colors.danger[200],
  },
  zero: {
    bg: colors.neutral[100],
    text: colors.neutral[600],
    border: colors.neutral[200],
  },
  extreme: {
    bg: colors.accent[50],
    text: colors.accent[700],
    border: colors.accent[200],
  },
  equilibrium: {
    bg: colors.accent[50],
    text: colors.accent[600],
    border: colors.accent[200],
  },
}

const FORMULA_LEVEL_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  core: {
    bg: colors.primary[50],
    border: colors.primary[200],
    label: '核心',
  },
  important: {
    bg: colors.accent[50],
    border: colors.accent[200],
    label: '重点',
  },
  derived: {
    bg: colors.neutral[100],
    border: colors.neutral[200],
    label: '导出',
  },
  supplementary: {
    bg: colors.neutral[50],
    border: colors.neutral[100],
    label: '补充',
  },
}

const GAOKAO_LEVEL_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  gaokao: {
    bg: colors.accent[50],
    text: colors.accent[700],
    border: colors.accent[200],
    label: '高考',
  },
  hard: {
    bg: colors.danger[50],
    text: colors.danger[700],
    border: colors.danger[200],
    label: '难点',
  },
  core: {
    bg: colors.primary[50],
    text: colors.primary[700],
    border: colors.primary[200],
    label: '核心',
  },
  basic: {
    bg: colors.success[50],
    text: colors.success[700],
    border: colors.success[200],
    label: '基础',
  },
  extend: {
    bg: colors.neutral[100],
    text: colors.neutral[600],
    border: colors.neutral[200],
    label: '拓展',
  },
}

const WARNING_LEVEL_STYLES: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  info: {
    bg: colors.primary[50],
    text: colors.primary[700],
    border: colors.primary[200],
    icon: <Info className="w-4 h-4 shrink-0" />,
  },
  warning: {
    bg: colors.warning[50],
    text: colors.warning[700],
    border: colors.warning[200],
    icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
  },
  danger: {
    bg: colors.danger[50],
    text: colors.danger[700],
    border: colors.danger[200],
    icon: <AlertCircle className="w-4 h-4 shrink-0" />,
  },
}

const EQUILIBRIUM_REASON: Record<string, string> = {
  equilibrium: '已达化学平衡',
  complete: '反应完全',
  none: '',
}

// ─── 子组件 ──────────────────────────────────────────────

function QuantityItem({ q }: { q: ChemistryQuantity }) {
  const hlStyle = q.highlight ? HIGHLIGHT_STYLES[q.highlight] : undefined
  const displayValue = typeof q.value === 'number' ? q.value.toFixed(2) : q.value

  return (
    <div
      className="flex items-baseline justify-between px-3 py-1.5 rounded-md text-sm"
      style={{
        backgroundColor: hlStyle?.bg ?? 'transparent',
        borderLeft: hlStyle ? `3px solid ${hlStyle.border}` : undefined,
      }}
    >
      <span className="flex items-baseline gap-1" style={{ color: hlStyle?.text ?? colors.neutral[700] }}>
        {q.symbol && <span className="font-mono font-semibold">{q.symbol}</span>}
        <span>{q.label}</span>
      </span>
      <span className="font-mono font-bold tabular-nums" style={{ color: q.color ?? hlStyle?.text ?? colors.neutral[800] }}>
        {displayValue}
        <span className="font-normal ml-0.5 text-xs" style={{ color: colors.neutral[500] }}>{q.unit}</span>
      </span>
    </div>
  )
}

function EquilibriumBanner({ isEquilibrium, equilibriumInfo }: { isEquilibrium?: boolean; equilibriumInfo?: string }) {
  const pulse = useTimedPulse(!!isEquilibrium, 3000)

  if (!isEquilibrium) return null

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
      style={{
        backgroundColor: colors.accent[50],
        border: `1px solid ${colors.accent[200]}`,
        color: colors.accent[700],
        animation: pulse ? 'pulse 1.5s ease-in-out' : undefined,
      }}
    >
      <span>⚖️</span>
      <span>系统提示：{equilibriumInfo ?? EQUILIBRIUM_REASON.equilibrium}</span>
    </div>
  )
}

function FormulaSection({ formulas }: { formulas: Formula[] }) {
  const [expanded, setExpanded] = useState(true)

  if (formulas.length === 0) return null

  return (
    <div>
      <button
        className="flex items-center gap-2 w-full text-sm font-semibold py-1.5"
        style={{ color: colors.neutral[800] }}
        onClick={() => setExpanded(!expanded)}
      >
        <FlaskConical className="w-4 h-4" style={{ color: colors.primary[500] }} />
        <span>公式区</span>
        <ChevronDown
          className="w-4 h-4 ml-auto transition-transform"
          style={{ transform: expanded ? 'rotate(180deg)' : undefined, color: colors.neutral[400] }}
        />
      </button>
      {expanded && (
        <div className="space-y-2 pl-1">
          {formulas.map((f, i) => {
            const level = f.level ?? 'important'
            const style = FORMULA_LEVEL_STYLES[level] ?? FORMULA_LEVEL_STYLES.important
            return (
              <div
                key={i}
                className="rounded-md px-2 py-2"
                style={{ backgroundColor: style.bg, borderLeft: `3px solid ${style.border}` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: style.border, color: colors.neutral.white }}
                  >
                    {style.label}
                  </span>
                  <span className="text-sm font-medium" style={{ color: colors.neutral[700] }}>{f.name}</span>
                </div>
                <KatexFormula formula={f.latex} mode="block" className="!my-1 !bg-transparent !px-0 !py-0" />
                {f.condition && (
                  <div className="text-xs mt-1" style={{ color: colors.neutral[500] }}>
                    条件：{f.condition.includes('\\') ? (
                      <KatexFormula formula={f.condition} mode="inline" className="!bg-transparent !px-0 !py-0" />
                    ) : (
                      f.condition
                    )}
                  </div>
                )}
                {f.note && (
                  <div className="text-xs mt-0.5" style={{ color: colors.neutral[500] }}>
                    备注：{f.note}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GaokaoSection({ points }: { points: GaokaoPoint[] }) {
  const [expanded, setExpanded] = useState(true)

  if (points.length === 0) return null

  return (
    <div>
      <button
        className="flex items-center gap-2 w-full text-sm font-semibold py-1.5"
        style={{ color: colors.neutral[800] }}
        onClick={() => setExpanded(!expanded)}
      >
        <Award className="w-4 h-4" style={{ color: colors.accent[500] }} />
        <span>高考要点</span>
        <ChevronDown
          className="w-4 h-4 ml-auto transition-transform"
          style={{ transform: expanded ? 'rotate(180deg)' : undefined, color: colors.neutral[400] }}
        />
      </button>
      {expanded && (
        <div className="space-y-1.5 pl-1">
          {points.map((p, i) => {
            const style = GAOKAO_LEVEL_STYLES[p.importance] ?? GAOKAO_LEVEL_STYLES.basic
            return (
              <div
                key={i}
                className="flex items-start gap-2 px-3 py-2 rounded-md text-sm"
                style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
              >
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0 mt-0.5"
                  style={{ backgroundColor: style.border, color: colors.neutral.white }}
                >
                  {style.label}
                </span>
                <span style={{ color: style.text }}>{p.text}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function WarningSection({ warnings }: { warnings: WarningItem[] }) {
  const [expanded, setExpanded] = useState(true)

  if (warnings.length === 0) return null

  return (
    <div>
      <button
        className="flex items-center gap-2 w-full text-sm font-semibold py-1.5"
        style={{ color: colors.neutral[800] }}
        onClick={() => setExpanded(!expanded)}
      >
        <AlertTriangle className="w-4 h-4" style={{ color: colors.warning[500] }} />
        <span>易错警示</span>
        <ChevronDown
          className="w-4 h-4 ml-auto transition-transform"
          style={{ transform: expanded ? 'rotate(180deg)' : undefined, color: colors.neutral[400] }}
        />
      </button>
      {expanded && (
        <div className="space-y-1.5 pl-1">
          {warnings.map((w, i) => {
            const style = WARNING_LEVEL_STYLES[w.level] ?? WARNING_LEVEL_STYLES.info
            return (
              <div
                key={i}
                className="flex items-start gap-2 px-3 py-2 rounded-md text-sm"
                style={{ backgroundColor: style.bg, border: `1px solid ${style.border}`, color: style.text }}
              >
                {style.icon}
                <span>{w.text}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MnemonicSection({ mnemonic }: { mnemonic?: string }) {
  if (!mnemonic) return null

  return (
    <div
      className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
      style={{ backgroundColor: colors.success[50], border: `1px solid ${colors.success[200]}` }}
    >
      <BookOpen className="w-4 h-4 shrink-0 mt-0.5" style={{ color: colors.success[600] }} />
      <div>
        <div className="font-semibold mb-1" style={{ color: colors.success[700] }}>记忆口诀</div>
        <div style={{ color: colors.success[800] }}>{mnemonic}</div>
      </div>
    </div>
  )
}

// ─── 主组件 ──────────────────────────────────────────────

export const ChemistryPanel: React.FC<ChemistryPanelProps> = ({
  quantities,
  formulas = [],
  gaokaoPoints = [],
  warnings = [],
  mnemonic,
  isEquilibrium,
  equilibriumInfo,
  title,
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题 */}
      {title && (
        <div
          className="shrink-0 px-3 py-2 text-sm font-bold"
          style={{ color: colors.primary[700], borderBottom: `1px solid ${colors.neutral[200]}` }}
        >
          {title}
        </div>
      )}

      {/* 可滚动内容 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-3">
        {/* 化学量区 */}
        {quantities.length > 0 && (
          <div className="space-y-1">
            {quantities.map((q, i) => (
              <QuantityItem key={i} q={q} />
            ))}
          </div>
        )}

        {/* 平衡态指示 */}
        <EquilibriumBanner isEquilibrium={isEquilibrium} equilibriumInfo={equilibriumInfo} />

        {/* 公式区 */}
        <FormulaSection formulas={formulas} />

        {/* 易错警示 */}
        <WarningSection warnings={warnings} />

        {/* 高考要点 */}
        <GaokaoSection points={gaokaoPoints} />

        {/* 记忆口诀 */}
        <MnemonicSection mnemonic={mnemonic} />
      </div>
    </div>
  )
}
