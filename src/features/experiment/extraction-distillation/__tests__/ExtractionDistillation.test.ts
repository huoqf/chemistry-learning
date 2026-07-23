import { describe, it, expect } from 'vitest'
import { useExtractionDistillationChemistry } from '../hooks/useExtractionDistillationChemistry'
import { renderHook } from '@testing-library/react'

describe('useExtractionDistillationChemistry', () => {
  it('应当正确推演萃取分液模式下的相分离、放液与颜色变化', () => {
    const { result } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 0,
        solvent: 0, // CCl4
        misoperation: 0,
        power: 500,
        vSolvent: 20,
        time: 9, // 9s 进入拔塞放液阶段
      })
    )

    expect(result.current.experimentMode).toBe(0)
    expect(result.current.extraction.isValveOpen).toBe(true)
    expect(result.current.extraction.waterLayerLabel).toContain('水相')
    expect(result.current.extraction.orgLayerLabel).toContain('CCl₄')
    expect(result.current.extraction.beakerAFillLevel).toBeGreaterThan(0)
  })

  it('应当正确推演蒸馏分馏规范与错操作偏误', () => {
    // 1. 标准规范
    const { result: normalRes } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 1,
        solvent: 0,
        misoperation: 0, // 规范
        power: 500,
        vSolvent: 20,
        time: 10,
      })
    )
    expect(normalRes.current.experimentMode).toBe(1)
    expect(normalRes.current.distillation.currentTemp).toBe(76.8)
    expect(normalRes.current.distillation.thermometerOffsetY).toBe(0)

    // 2. 错操作 1：温度计深入液面（测得温度偏高 86.5°C）
    const { result: wrongRes } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 1,
        solvent: 0,
        misoperation: 1, // 温度计低
        power: 500,
        vSolvent: 20,
        time: 10,
      })
    )
    expect(wrongRes.current.distillation.currentTemp).toBe(86.5)
    expect(wrongRes.current.distillation.thermometerOffsetY).toBe(32)
  })
})
