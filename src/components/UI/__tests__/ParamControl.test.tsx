import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ParamControl } from '../ParamControl'

describe('ParamControl', () => {
  it('按 step 格式化数值并在失焦时吸附到合法步长', () => {
    const onParamChange = vi.fn()

    const Harness = () => {
      const [value, setValue] = React.useState(0.2)
      return (
        <ParamControl
          params={[
            { key: 'concentration', label: '浓度 c', value, min: 0, max: 2, step: 0.05, unit: 'mol/L' },
          ]}
          onParamChange={(key, nextValue) => {
            onParamChange(key, nextValue)
            setValue(nextValue)
          }}
        />
      )
    }

    render(<Harness />)

    const input = screen.getByLabelText('浓度 c数值') as HTMLInputElement
    expect(input.value).toBe('0.20')

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '0.234' } })
    fireEvent.blur(input)

    expect(onParamChange).toHaveBeenCalledWith('concentration', 0.25)
    expect(input.value).toBe('0.25')
  })

  it('Escape 撤销当前输入且不提交参数变化', () => {
    const onParamChange = vi.fn()
    render(
      <ParamControl
        params={[
          { key: 'temperature', label: '温度 T', value: 298, min: 273, max: 373, step: 1, unit: 'K' },
        ]}
        onParamChange={onParamChange}
      />,
    )

    const input = screen.getByLabelText('温度 T数值') as HTMLInputElement
    expect(input.value).toBe('298')

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '350' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(onParamChange).not.toHaveBeenCalled()
    expect(input.value).toBe('298')
  })

  it('恢复默认按钮调用 onReset', () => {
    const onParamChange = vi.fn()
    const onReset = vi.fn()
    render(
      <ParamControl
        params={[
          { key: 'pressure', label: '压强 P', value: 1.0, min: 0.1, max: 10, step: 0.1, unit: 'atm' },
        ]}
        onParamChange={onParamChange}
        onReset={onReset}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '恢复默认参数' }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
