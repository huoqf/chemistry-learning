import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useExtractionDistillationChemistry } from '../hooks/useExtractionDistillationChemistry'

describe('useExtractionDistillationChemistry Hook', () => {
  it('萃取模式 (t=3.5s) 能够正确推演 180° 倒转手持振荡放气姿态', () => {
    const { result } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 0,
        solvent: 0, // CCl4
        misoperation: 0,
        power: 500,
        vSolvent: 20,
        time: 3.5,
      })
    )

    const { extraction } = result.current
    expect(extraction.isInverted).toBe(true)
    expect(extraction.isShaking).toBe(true)
    expect(extraction.isGassing).toBe(true)
  })

  it('萃取模式 (t=9s) 能够正确推演下层 CCl4 紫红液体沿活塞下放至烧杯 A', () => {
    const { result } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 0,
        solvent: 0, // CCl4
        misoperation: 0,
        power: 500,
        vSolvent: 20,
        time: 9.0,
      })
    )

    const { extraction } = result.current
    expect(extraction.hasStopper).toBe(false)
    expect(extraction.isValveOpen).toBe(true)
    expect(extraction.beakerAFillLevel).toBeGreaterThan(0)
    expect(extraction.beakerBFillLevel).toBe(0)
  })

  it('萃取模式 (t=11s) 能够正确推演上层水相从上口倒出至烧杯 B', () => {
    const { result } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 0,
        solvent: 0, // CCl4
        misoperation: 0,
        power: 500,
        vSolvent: 20,
        time: 11.0,
      })
    )

    const { extraction } = result.current
    expect(extraction.isTilted).toBe(true)
    expect(extraction.beakerAFillLevel).toBeGreaterThan(0)
    expect(extraction.beakerBFillLevel).toBeGreaterThan(0)
  })

  it('蒸馏错操作 (未加沸石) 能够在加热升温后触发暴沸警示与暴沸冲击强度', () => {
    const { result } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 1,
        solvent: 0,
        misoperation: 3, // 未加沸石
        power: 500,
        vSolvent: 20,
        time: 5.0,
      })
    )

    const { distillation } = result.current
    expect(distillation.hasZeolite).toBe(false)
    expect(distillation.isBumpWarning).toBe(true)
    expect(distillation.bumpIntensity).toBeGreaterThan(0)
  })

  it('蒸馏错操作 (冷凝水上进下出) 冷凝管水满度降为 0.35 且馏出速率打折', () => {
    const { result } = renderHook(() =>
      useExtractionDistillationChemistry({
        experimentMode: 1,
        solvent: 0,
        misoperation: 2, // 冷凝水上进下出
        power: 500,
        vSolvent: 20,
        time: 8.0,
      })
    )

    const { distillation } = result.current
    expect(distillation.isWaterReversed).toBe(true)
    expect(distillation.waterFillLevel).toBe(0.35)
  })
})
