import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TitrationControls } from '../TitrationControls'

describe('TitrationControls 化学专属滴定演练控制组件', () => {
  it('正确渲染滴加试剂名称与当前体积/滴数', () => {
    render(
      <TitrationControls
        volume={2.5}
        reagentName="1.0 mol/L NaOH 滴加试剂"
        isPlaying={false}
        onPlayPause={vi.fn()}
        onSingleDrop={vi.fn()}
        onBulkAdd={vi.fn()}
        onReset={vi.fn()}
        onVolumeChange={vi.fn()}
      />
    )

    expect(screen.getByText(/1.0 mol\/L NaOH 滴加试剂/)).toBeInTheDocument()
    expect(screen.getByText(/V = 2.50 mL \(50 滴\)/)).toBeInTheDocument()
  })

  it('点击自动滴下按钮触发 onPlayPause 回调', () => {
    const handlePlayPause = vi.fn()
    render(
      <TitrationControls
        volume={0}
        isPlaying={false}
        onPlayPause={handlePlayPause}
        onSingleDrop={vi.fn()}
        onBulkAdd={vi.fn()}
        onReset={vi.fn()}
        onVolumeChange={vi.fn()}
      />
    )

    const playBtn = screen.getByTitle('连续自动滴加')
    fireEvent.click(playBtn)
    expect(handlePlayPause).toHaveBeenCalledTimes(1)
  })

  it('点击 +1 滴微量按钮触发 onSingleDrop 回调', () => {
    const handleSingleDrop = vi.fn()
    render(
      <TitrationControls
        volume={1.0}
        isPlaying={false}
        onPlayPause={vi.fn()}
        onSingleDrop={handleSingleDrop}
        onBulkAdd={vi.fn()}
        onReset={vi.fn()}
        onVolumeChange={vi.fn()}
      />
    )

    const singleDropBtn = screen.getByTitle('微量挤压胶头滴管（+0.05 mL / 1 滴）')
    fireEvent.click(singleDropBtn)
    expect(handleSingleDrop).toHaveBeenCalledTimes(1)
  })

  it('点击 +1.0 mL 按钮触发 onBulkAdd 回调', () => {
    const handleBulkAdd = vi.fn()
    render(
      <TitrationControls
        volume={1.0}
        isPlaying={false}
        onPlayPause={vi.fn()}
        onSingleDrop={vi.fn()}
        onBulkAdd={handleBulkAdd}
        onReset={vi.fn()}
        onVolumeChange={vi.fn()}
      />
    )

    const bulkBtn = screen.getByTitle('定量倾倒/滴定 (+1.0 mL)')
    fireEvent.click(bulkBtn)
    expect(handleBulkAdd).toHaveBeenCalledTimes(1)
  })

  it('正确响应特征节点快跳点击', () => {
    const handleJump = vi.fn()
    const steps = [
      { title: '沉淀最大：3.0 mL', volume: 3.0 },
      { title: '沉淀溶解：4.0 mL', volume: 4.0 },
    ]

    render(
      <TitrationControls
        volume={0}
        isPlaying={false}
        onPlayPause={vi.fn()}
        onSingleDrop={vi.fn()}
        onBulkAdd={vi.fn()}
        onReset={vi.fn()}
        onVolumeChange={vi.fn()}
        steps={steps}
        onJumpToStep={handleJump}
      />
    )

    const stepBtn = screen.getByTitle('跳转至 沉淀最大：3.0 mL')
    fireEvent.click(stepBtn)
    expect(handleJump).toHaveBeenCalledWith(3.0)
  })
})
