import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReagentStepLeftPanel } from '../components/ReagentStepLeftPanel'
import { REAGENT_SCENES } from '../data/reagentData'

describe('ReagentStepLeftPanel 左屏控制台', () => {
  it('正确渲染场景选项及铁律 3C 实验指引卡片', () => {
    const handleSceneChange = vi.fn()
    const handleToggleAirIsolated = vi.fn()
    const handleAlModeChange = vi.fn()

    render(
      <ReagentStepLeftPanel
        sceneId="al-amphoteric"
        currentScene={REAGENT_SCENES['al-amphoteric']}
        isAirIsolated={false}
        alMode="forward-strong"
        handleSceneChange={handleSceneChange}
        handleToggleAirIsolated={handleToggleAirIsolated}
        handleAlModeChange={handleAlModeChange}
      />
    )

    // 存在母题场景标题
    expect(screen.getByText('高考核心母题场景')).toBeTruthy()

    // 存在铝盐模式 SegmentedControl 按钮
    expect(screen.getByText('正滴强碱')).toBeTruthy()
    expect(screen.getByText('反滴强碱')).toBeTruthy()
    expect(screen.getByText('换用弱碱')).toBeTruthy()

    // 存在铁律 3C 核心设问与观察指引
    expect(screen.getByText('实验观察与核心设问')).toBeTruthy()
    expect(screen.getByText('高考核心设问')).toBeTruthy()
    expect(screen.getByText('现象观察指引')).toBeTruthy()

    // 点击切换反滴模式
    fireEvent.click(screen.getByText('反滴强碱'))
    expect(handleAlModeChange).toHaveBeenCalledWith('reverse-strong')
  })
})
