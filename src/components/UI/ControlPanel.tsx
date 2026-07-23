import { Plus, Minus } from 'lucide-react'
import React, { useCallback, useMemo } from 'react'
import { useRadioGroup } from '@/hooks/useRadioGroup'
import type { ControlMeta, ControlCondition } from '@/data/types'
import { OptionButton } from './OptionButton'
import { Button } from './Button'
import { SegmentedControl } from './SegmentedControl'
import { Slider } from './Slider'
import { TipCard } from './TipCard'
import { KatexFormula } from './KatexFormula'
import { ToggleSwitch } from './ToggleSwitch'
import { LeftPanelSection } from './LeftPanel'

interface ControlPanelProps {
  controls: ControlMeta[]
  params: Record<string, number>
  defaultParams?: Record<string, number>
  updateParam: (key: string, value: number) => void
  setParams: (params: Record<string, number>) => void
  resetAnimation: () => void
  restartAnimation: () => void
  setDirection?: (d: 1 | -1) => void
  toggleVectors?: () => void
  toggleTimeSlices?: () => void
  toggleDualObjects?: () => void
  storeStates?: Record<string, boolean>
  disabled?: boolean
}

function isControlVisible(control: ControlMeta, params: Record<string, number>) {
  if (control.showIf) {
    if (control.showIfValue != null) {
      if (params[control.showIf] !== control.showIfValue) return false
    } else if (!params[control.showIf]) {
      return false
    }
  }
  if (control.hideIf && control.hideIfValue != null) {
    if (params[control.hideIf] === control.hideIfValue) return false
  }
  return true
}

function defaultGroup(control: ControlMeta) {
  if (control.group) return control.group
  switch (control.type) {
    case 'segmented':
    case 'modeGrid':
      return '模型选择'
    case 'toggle':
      return '显示辅助'
    case 'preset':
      return '快捷预设'
    case 'tip':
      return '教学提示'
    case 'action':
      return '操作'
    case 'storeToggle':
      return '显示辅助'
    case 'step':
    default:
      return '核心参数'
  }
}

const ModeGridControl: React.FC<{
  control: Extract<ControlMeta, { type: 'modeGrid' }>
  params: Record<string, number>
  updateParam: (key: string, value: number) => void
  resetAnimation: () => void
  applySideEffect: (control: ControlCondition, value?: number) => void
  disabled?: boolean
}> = ({ control, params, updateParam, resetAnimation, applySideEffect, disabled }) => {
  const modeValue = Math.round(params[control.key] ?? control.modes[0]?.value ?? 0)
  const modeKeys = control.modes.map((m) => String(m.value))
  const cols = control.cols ?? 2
  const { getItemProps, registerRef } = useRadioGroup({
    value: String(modeValue),
    keys: modeKeys,
    direction: 'grid',
    columns: cols,
    onChange: (key) => {
      const val = Number(key)
      if (val === modeValue) return
      updateParam(control.key, val)
      if (control.resetOnChange) resetAnimation()
      applySideEffect(control, val)
    },
  })
  const setRef = useCallback(
    (key: string) => (el: HTMLButtonElement | null) => {
      registerRef(key, el)
    },
    [registerRef],
  )
  const currentMode = control.modes.find((m) => m.value === modeValue)

  return (
    <div className="space-y-2">
      {control.label && (
        <span className="mb-1 block text-xs font-semibold text-neutral-600">{control.label}</span>
      )}
      <div
        role="radiogroup"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '0.375rem' }}
      >
        {control.modes.map((mode) => {
          const radioProps = getItemProps(String(mode.value))
          return (
            <OptionButton
              key={mode.value}
              variant="mode"
              label={
                <span className="inline-flex items-center gap-1">
                  <span>{mode.value + 1}.</span>
                  {mode.label}
                </span>
              }
              selected={mode.value === modeValue}
              disabled={disabled}
              radioTabIndex={radioProps.tabIndex}
              radioOnKeyDown={radioProps.onKeyDown}
              buttonRef={setRef(String(mode.value))}
              onClick={() => {
                if (mode.value === modeValue) return
                updateParam(control.key, mode.value)
                if (control.resetOnChange) resetAnimation()
                applySideEffect(control, mode.value)
              }}
            />
          )
        })}
      </div>
      {currentMode?.description && (
        <p className="text-[11px] leading-snug text-neutral-500">{currentMode.description}</p>
      )}
    </div>
  )
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  controls,
  params,
  defaultParams = {},
  updateParam,
  setParams,
  resetAnimation,
  restartAnimation,
  setDirection,
  toggleVectors,
  toggleTimeSlices,
  toggleDualObjects,
  storeStates,
  disabled = false,
}) => {
  const groups = useMemo(() => {
    const visibleControls = controls.filter((control) => isControlVisible(control, params))
    const grouped: Array<{ label: string; controls: ControlMeta[] }> = []
    const indexByGroup = new Map<string, number>()

    visibleControls.forEach((control) => {
      const group = defaultGroup(control)
      const existingIndex = indexByGroup.get(group)
      if (existingIndex == null) {
        indexByGroup.set(group, grouped.length)
        grouped.push({ label: group, controls: [control] })
      } else {
        grouped[existingIndex].controls.push(control)
      }
    })

    return grouped
  }, [controls, params])

  if (groups.length === 0) return null

  const handleValueChange = (control: Extract<ControlMeta, { type: 'number' | 'segmented' }>, value: number) => {
    const changed = params[control.key] !== value
    updateParam(control.key, value)
    if (changed && control.resetOnChange) resetAnimation()
    applySideEffect(control, value)
  }

  const handleToggleChange = (control: Extract<ControlMeta, { type: 'toggle' }>, checked: boolean) => {
    const trueValue = control.trueValue ?? 1
    const falseValue = control.falseValue ?? 0
    const nextValue = checked ? trueValue : falseValue
    const changed = params[control.key] !== nextValue
    updateParam(control.key, nextValue)
    if (changed && control.resetOnChange) resetAnimation()
    applySideEffect(control, nextValue)
  }

  const applySideEffect = (control: ControlCondition, value?: number) => {
    const raw = control.onChangeSideEffect
    if (!raw) return
    const side = typeof raw === 'function' ? raw(value ?? 0, params) : raw
    if (!side) return
    if (side.resetParams) {
      side.resetParams.forEach((k) => {
        if (defaultParams[k] != null) updateParam(k, defaultParams[k])
      })
    }
    if (side.setParams) {
      Object.entries(side.setParams).forEach(([k, v]) => updateParam(k, v))
    }
  }

  const handlePresetApply = (control: Extract<ControlMeta, { type: 'preset' }>) => {
    const resolved = typeof control.params === 'function' ? control.params(params) : control.params
    setParams({ ...params, ...resolved })
    if (control.restartOnApply) restartAnimation()
    else if (control.resetOnApply !== false) resetAnimation()
  }

  const renderControl = (control: ControlMeta, index: number) => {
    switch (control.type) {
      case 'number': {
        const value = params[control.key] ?? control.min
        return (
          <div key={`${control.type}-${control.key}-${index}`}>
            <Slider
              label={control.label}
              value={value}
              min={control.min}
              max={control.max}
              step={control.step ?? 0.1}
              unit={control.unit ?? ''}
              description={control.description}
              marks={control.marks}
              showInput={control.showInput}
              onChange={(nextValue) => handleValueChange(control, nextValue)}
              disabled={disabled}
            />
          </div>
        )
      }
      case 'segmented':
        return (
          <SegmentedControl
            key={`${control.type}-${control.key}-${index}`}
            label={control.label}
            options={control.options}
            value={params[control.key] ?? control.options[0]?.value ?? 0}
            onChange={(nextValue) => handleValueChange(control, Number(nextValue))}
            disabled={disabled}
          />
        )
      case 'toggle':
        return (
          <div key={`${control.type}-${control.key}-${index}`} className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-neutral-600 select-none">{control.label}</span>
            <ToggleSwitch
              checked={(params[control.key] ?? control.falseValue ?? 0) === (control.trueValue ?? 1)}
              onChange={(checked) => handleToggleChange(control, checked)}
              disabled={disabled}
            />
          </div>
        )
      case 'preset':
        return (
          <OptionButton
            key={`${control.type}-${control.label}-${index}`}
            label={control.label}
            variant="preset"
            description={control.description}
            onClick={() => handlePresetApply(control)}
            disabled={disabled}
          />
        )
      case 'tip': {
        const resolvedContent = typeof control.content === 'function' ? control.content(params) : control.content
        // 按 $...$ 拆分，文本段纯渲染，公式段走 KaTeX
        const parts = resolvedContent.split(/(\$[^$]+\$)/g)
        return (
          <TipCard key={`${control.type}-${index}`} variant={control.variant ?? 'info'}>
            {control.title && <span className="font-semibold block mb-1">{control.title}</span>}
            <span>
              {parts.map((part, i) =>
                part.startsWith('$') && part.endsWith('$')
                  ? <KatexFormula key={i} formula={part.slice(1, -1)} />
                  : <span key={i}>{part}</span>
              )}
            </span>
          </TipCard>
        )
      }
      case 'action':
        return (
          <Button
            key={`${control.type}-${control.label}-${index}`}
            variant={control.variant ?? 'secondary'}
            onClick={() => {
              if (control.setParams) {
                Object.entries(control.setParams).forEach(([k, v]) => updateParam(k, v))
              }
              switch (control.action) {
                case 'launch':
                case 'restart':
                  restartAnimation()
                  break
                case 'reset':
                  resetAnimation()
                  break
                case 'setDirection':
                  setDirection?.(control.directionValue ?? 1)
                  break
                case 'setDirectionAndRestart':
                  setDirection?.(control.directionValue ?? 1)
                  restartAnimation()
                  break
                case 'resetAndRestart':
                  resetAnimation()
                  setDirection?.(control.directionValue ?? -1)
                  restartAnimation()
                  break
              }
            }}
            disabled={disabled}
          >
            {control.label}
          </Button>
        )
      case 'storeToggle': {
        const storeHandlers: Record<string, (() => void) | undefined> = {
          toggleVectors,
          toggleTimeSlices,
          toggleDualObjects,
        }
        const handler = storeHandlers[control.storeKey]
        return (
          <div key={`${control.type}-${control.storeKey}-${index}`} className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-neutral-600 select-none">{control.label}</span>
            <ToggleSwitch
              checked={storeStates?.[control.stateKey] ?? false}
              onChange={() => handler?.()}
              disabled={disabled || !handler}
            />
          </div>
        )
      }
      case 'modeGrid':
        return (
          <ModeGridControl
            key={`${control.type}-${control.key}-${index}`}
            control={control}
            params={params}
            updateParam={updateParam}
            resetAnimation={resetAnimation}
            applySideEffect={applySideEffect}
            disabled={disabled}
          />
        )
      case 'step': {
        const currentValue = params[control.paramKey] ?? 0
        const nextValue = currentValue + control.step
        const isAtMax = control.max != null && currentValue >= control.max
        const isAtMin = control.min != null && currentValue <= control.min
        const isDisabled = disabled || (control.step > 0 && isAtMax) || (control.step < 0 && isAtMin)
        return (
          <div key={`${control.type}-${control.paramKey}-${index}`} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600 select-none">
                {control.label}
                {control.hint && <span className="text-neutral-400 font-normal ml-1">({control.hint})</span>}
              </span>
              <span className="text-xs text-neutral-500 tabular-nums">
                {currentValue}{control.unit ? ` ${control.unit}` : ''}
              </span>
            </div>
            <button
              onClick={() => {
                updateParam(control.paramKey, nextValue)
                if (control.resetTime !== false) resetAnimation()
              }}
              disabled={isDisabled}
              className={[
                'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                isDisabled
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100 active:bg-primary-200 active:scale-[0.98]',
              ].join(' ')}
            >
              {control.step > 0 ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              {control.step > 0 ? '增加' : '减少'}
              {control.unit ? ` (${Math.abs(control.step)} ${control.unit})` : ''}
            </button>
          </div>
        )
      }
      default:
        return null
    }
  }

  const renderControls = (controls: ControlMeta[]) => {
    const result: React.ReactNode[] = []
    let i = 0
    while (i < controls.length) {
      // 连续 action 或 preset 控件并排渲染
      if (controls[i].type === 'action' || controls[i].type === 'preset') {
        const row: ControlMeta[] = []
        const startIdx = i
        while (i < controls.length && controls[i].type === controls[startIdx].type) {
          row.push(controls[i])
          i++
        }
        result.push(
          <div key={`${controls[startIdx].type}-row-${startIdx}`} className="grid grid-cols-2 gap-2">
            {row.map((c, j) => renderControl(c, j))}
          </div>
        )
      } else {
        result.push(renderControl(controls[i], i))
        i++
      }
    }
    return result
  }

  return (
    <>
      {groups.map((group) => (
        <LeftPanelSection
          key={group.label}
          title={group.controls.length > 1 ? group.label : undefined}
          bodyClassName="flex flex-col gap-3"
        >
          {renderControls(group.controls)}
        </LeftPanelSection>
      ))}
    </>
  )
}
