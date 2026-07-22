import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ControlMeta } from '@/data/types'
import { ControlPanel } from '../ControlPanel'

function renderControlPanel(controls: ControlMeta[], params: Record<string, number> = {}) {
  const updateParam = vi.fn()
  const setParams = vi.fn()
  const resetAnimation = vi.fn()
  const restartAnimation = vi.fn()

  render(
    <ControlPanel
      controls={controls}
      params={params}
      updateParam={updateParam}
      setParams={setParams}
      resetAnimation={resetAnimation}
      restartAnimation={restartAnimation}
    />,
  )

  return { updateParam, setParams, resetAnimation, restartAnimation }
}

describe('ControlPanel', () => {
  it('渲染 segmented 控件并在 resetOnChange 时重置动画', () => {
    const { updateParam, resetAnimation } = renderControlPanel([
      {
        type: 'segmented',
        key: 'reactionType',
        label: '反应类型',
        options: [
          { value: 0, label: '可逆' },
          { value: 1, label: '不可逆' },
        ],
        resetOnChange: true,
      },
    ], { reactionType: 0 })

    fireEvent.click(screen.getByRole('radio', { name: '不可逆' }))
    expect(updateParam).toHaveBeenCalledWith('reactionType', 1)
    expect(resetAnimation).toHaveBeenCalledTimes(1)
  })

  it('根据 showIf 条件显示提示控件', () => {
    renderControlPanel([
      {
        type: 'tip',
        group: '教学提示',
        showIf: 'reactionType',
        showIfValue: 1,
        title: '提示',
        content: '不可逆反应达到完全转化',
      },
    ], { reactionType: 1 })

    expect(screen.getByText('提示')).toBeTruthy()
    expect(screen.getByText('不可逆反应达到完全转化')).toBeTruthy()
  })

  it('preset 控件批量写入参数', () => {
    const { setParams, resetAnimation } = renderControlPanel([
      {
        type: 'preset',
        label: '标准条件',
        params: { temperature: 298, pressure: 1.0 },
        description: '25°C / 1atm',
      },
    ], { temperature: 300, pressure: 2.0 })

    fireEvent.click(screen.getByRole('button', { name: /标准条件/ }))
    expect(setParams).toHaveBeenCalledWith({ temperature: 298, pressure: 1.0 })
    expect(resetAnimation).toHaveBeenCalledTimes(1)
  })
})
