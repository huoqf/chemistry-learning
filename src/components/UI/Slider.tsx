/* eslint-disable react-refresh/only-export-components */
import React, { type ReactNode, useRef, useState, useEffect } from 'react'
import type { FontScaler } from '@/theme'

// ── 精度工具 ──

/** 计算 step 的实际小数位数，支持科学计数法 */
const getStepDigits = (step: number): number => {
  if (!Number.isFinite(step) || step <= 0) return 1
  const text = step.toString()
  if (text.includes('e-')) {
    const [, exp] = text.split('e-')
    return Number.parseInt(exp, 10)
  }
  return text.includes('.') ? text.split('.')[1].length : 0
}

/** 按 step 精度格式化数值，最多保留 4 位小数 */
const formatByStep = (value: number, step: number): string => {
  const digits = Math.min(4, getStepDigits(step))
  return value.toFixed(digits)
}

// ── Marks 类型与冲突检测 ──

export type ParamMarkVariant = 'zero' | 'critical' | 'recommended'

export interface ParamMark {
  value: number
  label?: string
  variant?: ParamMarkVariant
  /** 是否为自动生成的标注（优先级最低，冲突时优先隐藏） */
  auto?: boolean
}

const MARK_CLASSES: Record<ParamMarkVariant, string> = {
  zero: 'bg-neutral-400/70 text-neutral-400',
  critical: 'bg-danger-500/80 text-danger-600',
  recommended: 'bg-primary-500/80 text-primary-600',
}

function getMarkPercentage(markValue: number, min: number, max: number) {
  if (max === min) return 0
  return Math.max(0, Math.min(100, ((markValue - min) / (max - min)) * 100))
}

/**
 * 标注优先级：auto(0) < zero(1) < 其他(2)
 * 数值越小越容易被隐藏（保护零点和用户显式标注）
 */
function markPriority(m: ParamMark): number {
  if (m.auto) return 0
  if (m.variant === 'zero') return 1
  return 2
}

/**
 * 基于像素间距的全局冲突检测
 * 轨道宽度推导：面板 320px - 左 label 40px - 右值 48px - gap 12px*2 = 208px → 取 220px 容错
 * MIN_GAP_PX = 28px ≈ 4 个字符宽度，防止标注文字重叠
 */
function detectMarkConflicts(
  marks: ParamMark[],
  min: number,
  max: number,
): Set<number> {
  const CONTAINER_WIDTH_PX = 220
  const MIN_GAP_PX = 28
  const minGapPercent = (MIN_GAP_PX / CONTAINER_WIDTH_PX) * 100

  const conflicts = new Set<number>()

  for (let i = 0; i < marks.length; i++) {
    for (let j = i + 1; j < marks.length; j++) {
      const gap = Math.abs(
        getMarkPercentage(marks[i].value, min, max) -
          getMarkPercentage(marks[j].value, min, max),
      )
      if (gap < minGapPercent) {
        const hideIdx =
          markPriority(marks[i]) <= markPriority(marks[j]) ? i : j
        conflicts.add(hideIdx)
      }
    }
  }

  return conflicts
}

function buildMarks(
  marks: ParamMark[],
  min: number,
  max: number,
  unit: string,
): {
  visible: ParamMark[]
  hidden: ParamMark[]
} {
  const filtered = marks
    .filter((m) => Number.isFinite(m.value) && m.value >= min && m.value <= max)
    .map((m) => ({ ...m }))

  // 自动添加零点
  const hasZero = min < 0 && max > 0
  const hasExplicitZero = filtered.some((m) => Math.abs(m.value) < 1e-9)
  if (hasZero && !hasExplicitZero) {
    filtered.push({
      value: 0,
      label: `0${unit}`,
      variant: 'zero',
      auto: true,
    })
  }

  // 全局冲突检测：优先隐藏 auto 标注，保护零点和用户显式标注
  const conflicts = detectMarkConflicts(filtered, min, max)
  const visible = filtered
    .filter((_, idx) => !conflicts.has(idx))
    .sort((a, b) => a.value - b.value)
  const hidden = filtered.filter((_, idx) => conflicts.has(idx))

  return { visible, hidden }
}

// ── Props ──

interface SliderProps {
  /** 当前值 */
  value: number
  /** 最小值 */
  min: number
  /** 最大值 */
  max: number
  /** 步长，默认 0.1 */
  step?: number
  /** 数值单位（显示在值后面） */
  unit?: string
  /** 滑块标签（显示在左上方） */
  label?: string | ReactNode
  /** 值变化回调 */
  onChange: (value: number) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 最小值标签（滑块下方左侧） */
  minLabel?: string
  /** 最大值标签（滑块下方右侧） */
  maxLabel?: string
  /** 中间值标签（滑块下方中间） */
  midLabel?: string
  /** 自定义值格式化函数，覆盖内置精度逻辑 */
  formatValue?: (v: number) => string
  /** 描述文本（灰色小字） */
  description?: string
  /** 填充锚点（填充从此值开始），默认 0。超出 [min, max] 时退化为最近边界 */
  fillAnchor?: number
  /** ARIA 标签，用于屏幕阅读器 */
  ariaLabel?: string
  /** ARIA 值文本，包含物理量名称和单位，例如 "电流，0.05 A" */
  ariaValueText?: string
  /** 字体缩放函数 */
  font?: FontScaler
  /** 滑块轨道标注点 */
  marks?: ParamMark[]
  /** 是否显示数字输入框 */
  showInput?: boolean
}

/**
 * Slider 滑块组件
 *
 * 通用数值范围选择控件，支持：
 * - step 感知的精度格式化（含科学计数法）
 * - 零点穿越填充（fillAnchor）
 * - 轨道标注（marks）与冲突自动避让
 * - 可选数字输入框（showInput）
 * - ARIA 无障碍属性
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 0.1,
  unit = '',
  label,
  onChange,
  disabled = false,
  minLabel,
  maxLabel,
  midLabel,
  formatValue,
  description,
  fillAnchor = 0,
  ariaLabel,
  ariaValueText,
  marks: rawMarks,
  showInput = false,
}) => {
  const safeStep = Number.isFinite(step) && step > 0 ? step : 0.1
  const percentage = ((value - min) / (max - min)) * 100

  // 精度格式化
  const displayValue = formatValue ? formatValue(value) : formatByStep(value, safeStep)

  // 零点穿越填充计算
  const anchor = Math.max(min, Math.min(max, fillAnchor))
  const anchorPct = ((anchor - min) / (max - min)) * 100
  const fillLeft = Math.min(percentage, anchorPct)
  const fillWidth = Math.abs(percentage - anchorPct)

  // Marks 冲突检测
  const { visible: visibleMarks, hidden: hiddenMarks } = rawMarks
    ? buildMarks(rawMarks, min, max, unit)
    : { visible: [], hidden: [] }

  // 数字输入框
  const inputRef = useRef<HTMLInputElement>(null)
  const [localValue, setLocalValue] = useState(displayValue)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setLocalValue(displayValue)
    }
  }, [displayValue, isEditing])

  const commitInput = () => {
    const num = Number.parseFloat(localValue)
    if (Number.isFinite(num)) {
      const clamped = Math.max(min, Math.min(max, num))
      const snapped = min + Math.round((clamped - min) / safeStep) * safeStep
      const digits = Math.min(6, getStepDigits(safeStep))
      onChange(Number(snapped.toFixed(digits)))
    } else {
      setLocalValue(displayValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitInput()
    }
    if (e.key === 'Escape') {
      setLocalValue(displayValue)
      setIsEditing(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className={['w-full', disabled && 'opacity-40 pointer-events-none'].filter(Boolean).join(' ')}>
      {(label || unit || showInput) && (
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="min-w-0">
            {label && <span className="text-sm font-medium text-neutral-700">{label}</span>}
          </div>
          {showInput ? (
            <input
              ref={inputRef}
              type="number"
              value={localValue}
              onFocus={() => setIsEditing(true)}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={commitInput}
              onKeyDown={handleKeyDown}
              min={min}
              max={max}
              step={safeStep}
              disabled={disabled}
              aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
              className="shrink-0 w-16 px-1.5 py-0.5 text-sm text-right font-mono bg-white border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ) : (
            <span className="shrink-0 text-sm font-mono text-neutral-600">
              {displayValue}
              {unit && <span className="ml-1 text-neutral-500">{unit}</span>}
            </span>
          )}
        </div>
      )}
      {description && (
        <div className="text-right text-ui-base text-neutral-400 -mt-1 mb-2">{description}</div>
      )}
      <div className="relative h-2 bg-neutral-200 rounded-full flex items-center">
        {visibleMarks.map((mark) => {
          const markVariant = mark.variant ?? 'recommended'
          return (
            <div
              key={`tick-${mark.value}-${mark.label ?? ''}`}
              className={['absolute top-1/2 -translate-y-1/2 w-px h-3.5 pointer-events-none z-[1]', MARK_CLASSES[markVariant].split(' ')[0]].join(' ')}
              style={{ left: `${getMarkPercentage(mark.value, min, max)}%` }}
              aria-hidden="true"
            />
          )
        })}
        <input
          type="range"
          min={min}
          max={max}
          step={safeStep}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="peer absolute -inset-y-2 left-0 w-full h-6 opacity-0 cursor-pointer z-10"
          aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={ariaValueText ?? `${displayValue}${unit ? ` ${unit}` : ''}`}
        />
        <div
          className="absolute top-0 h-full bg-primary-500 rounded-full pointer-events-none transition-all duration-fast ease-standard peer-hover:bg-primary-600"
          style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary-500 rounded-full shadow-sm pointer-events-none transition-all duration-fast ease-standard peer-hover:scale-115 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300 peer-focus-visible:ring-offset-1 peer-active:scale-95"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
      {/* 标注文字层 */}
      {visibleMarks.some((m) => m.label) && (
        <div className="relative h-4 text-[10px] font-semibold w-full mt-1">
          {visibleMarks
            .filter((m) => m.label)
            .map((mark) => {
              const markVariant = mark.variant ?? 'recommended'
              const [, textClass] = MARK_CLASSES[markVariant].split(' ')
              return (
                <span
                  key={`label-${mark.value}-${mark.label}`}
                  className={['absolute top-0 -translate-x-1/2 whitespace-nowrap', textClass].join(' ')}
                  style={{ left: `${getMarkPercentage(mark.value, min, max)}%` }}
                >
                  {mark.label}
                </span>
              )
            })}
        </div>
      )}
      {/* 隐藏标注提示 */}
      {hiddenMarks.length > 0 && (
        <span
          className="block text-center text-[8px] text-neutral-400 cursor-help mt-0.5"
          title={`隐藏标注: ${hiddenMarks.map((m) => m.label ?? m.value).join(', ')}`}
        >
          ({hiddenMarks.length} hidden)
        </span>
      )}
      {(minLabel || maxLabel) && (
        <div className="relative flex justify-between text-ui-base text-neutral-400 mt-0.5">
          <span>{minLabel}</span>
          {midLabel && (
            <span className="absolute left-1/2 -translate-x-1/2">{midLabel}</span>
          )}
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  )
}

// ── 导出精度工具供外部使用 ──
export { getStepDigits, formatByStep }
