import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useReagentChemistry } from '../hooks/useReagentChemistry'

describe('useReagentChemistry 高考试剂滴加演练逻辑测试', () => {
  it('应当默认加载 Fe2+ 遇碱及空气氧化场景', () => {
    const { result } = renderHook(() => useReagentChemistry())

    expect(result.current.sceneId).toBe('fe-air-ox')
    expect(result.current.currentScene.title).toContain('Fe²⁺')
    expect(result.current.progress).toBe(0)
    expect(result.current.currentStep.precipitateText).toBe('无沉淀')
  })

  it('进度推进时沉淀填充比例应当相应增加且变色', () => {
    const { result } = renderHook(() => useReagentChemistry())

    act(() => {
      result.current.setProgress(0.35)
    })

    expect(result.current.currentStep.precipitateText).toContain('白色沉淀 Fe(OH)₂')
    expect(result.current.interpolatedPptLevel).toBeGreaterThan(0)

    act(() => {
      result.current.setProgress(1.0)
    })

    expect(result.current.currentStep.precipitateText).toContain('红褐色沉淀')
  })

  it('开启隔绝空气开关时，Fe(OH)₂ 不应当被氧化为红褐色沉淀', () => {
    const { result } = renderHook(() => useReagentChemistry())

    act(() => {
      result.current.setIsAirIsolated(true)
      result.current.setProgress(1.0)
    })

    expect(result.current.currentStep.title).toContain('隔绝空气实验')
    expect(result.current.currentStep.precipitateText).toContain('白色沉淀 Fe(OH)₂')
    expect(result.current.currentStep.precipitateColor).toBe('#F8FAFC')
  })

  it('切换至 Al3+ 场景并测试正滴与弱碱模式', () => {
    const { result } = renderHook(() => useReagentChemistry())

    act(() => {
      result.current.handleSceneChange('al-amphoteric')
    })

    expect(result.current.sceneId).toBe('al-amphoteric')
    expect(result.current.currentScene.steps.length).toBe(4)

    // 正滴 100% 时，氢氧化铝完全溶解
    act(() => {
      result.current.setProgress(1.0)
    })
    expect(result.current.currentStep.precipitateText).toContain('沉淀完全溶解')

    // 开启弱碱模式：过量氨水沉淀绝不溶解
    act(() => {
      result.current.setIsWeakBase(true)
      result.current.setProgress(1.0)
    })
    expect(result.current.currentStep.precipitateText).toContain('白色沉淀 Al(OH)₃')
  })

  it('测试银盐沉淀转化场景 AgCl -> AgI -> Ag2S', () => {
    const { result } = renderHook(() => useReagentChemistry())

    act(() => {
      result.current.handleSceneChange('ag-trans')
    })

    expect(result.current.sceneId).toBe('ag-trans')

    // 0.33 为 AgCl 白色
    act(() => {
      result.current.setProgress(0.33)
    })
    expect(result.current.currentStep.precipitateText).toContain('AgCl')

    // 0.66 为 AgI 黄色
    act(() => {
      result.current.setProgress(0.66)
    })
    expect(result.current.currentStep.precipitateText).toContain('AgI')

    // 1.0 为 Ag2S 黑色
    act(() => {
      result.current.setProgress(1.0)
    })
    expect(result.current.currentStep.precipitateText).toContain('Ag₂S')
  })

  it('应当生成有效的 MiniChart 图像数据点', () => {
    const { result } = renderHook(() => useReagentChemistry())

    expect(result.current.chartData.length).toBeGreaterThan(10)
    expect(result.current.chartData[0].x).toBe(0)
  })

  it('切换实验对比条件应安全联动自动重置进度', () => {
    const { result } = renderHook(() => useReagentChemistry({ initialSceneId: 'al-amphoteric' }))

    // 假设已滴加到 0.8
    act(() => {
      result.current.setProgress(0.8)
    })
    expect(result.current.progress).toBe(0.8)

    // 切换为反滴，进度必须重置为 0
    act(() => {
      result.current.handleAlModeChange('reverse-strong')
    })
    expect(result.current.progress).toBe(0)
    expect(result.current.isReverseTitration).toBe(true)

    // 切换防氧化模式，进度也必须重置为 0
    act(() => {
      result.current.setProgress(0.6)
      result.current.handleToggleAirIsolated()
    })
    expect(result.current.progress).toBe(0)
    expect(result.current.isAirIsolated).toBe(true)
  })
})
