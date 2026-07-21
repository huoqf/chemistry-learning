import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useChiralChemistry } from '../hooks/useChiralChemistry'
import { CHIRAL_PRESETS } from '../data/chiralData'

describe('useChiralChemistry 手性化学推导 Hook 测试', () => {
  it('预设数据集合合法性测试', () => {
    expect(CHIRAL_PRESETS.length).toBeGreaterThanOrEqual(7)
    
    // 乳酸
    const lactic = CHIRAL_PRESETS[0]
    expect(lactic.id).toBe('lactic-acid')
    expect(lactic.isChiral).toBe(true)
    expect(lactic.chiralCount).toBe(1)
    expect(lactic.substituents?.length).toBe(4)

    // 2-丙醇 (非手性)
    const propanol = CHIRAL_PRESETS[4]
    expect(propanol.id).toBe('propan-2-ol')
    expect(propanol.isChiral).toBe(false)
    expect(propanol.chiralCount).toBe(0)
  })

  it('镜像坐标变换函数运算正确性', () => {
    const { result } = renderHook(() =>
      useChiralChemistry({ presetIdx: 0, showMirror: true, mirrorOverlapRatio: 0 })
    )

    const origCentral = result.current.molecule.atoms[0].pos
    const mirrorCentral = result.current.mirroredMolecule.atoms[0].pos

    // mirrorOffset = 3.5 * (1 - 0) = 3.5
    // x' = -origX + 3.5 = 3.5
    expect(mirrorCentral[0]).toBeCloseTo(-origCentral[0] + 3.5)
    expect(mirrorCentral[1]).toBeCloseTo(origCentral[1])
    expect(mirrorCentral[2]).toBeCloseTo(origCentral[2])
  })

  it('镜像重叠度判定逻辑正确性', () => {
    // 未重合阶段
    const { result: r1 } = renderHook(() =>
      useChiralChemistry({ presetIdx: 0, mirrorOverlapRatio: 0 })
    )
    expect(r1.current.overlapStatus.isTesting).toBe(false)

    // 重合阶段 - 手性分子 (乳酸)
    const { result: rLactic } = renderHook(() =>
      useChiralChemistry({ presetIdx: 0, mirrorOverlapRatio: 1 })
    )
    expect(rLactic.current.overlapStatus.isTesting).toBe(true)
    expect(rLactic.current.overlapStatus.canOverlap).toBe(false)

    // 重合阶段 - 非手性分子 (2-丙醇)
    const { result: rProp } = renderHook(() =>
      useChiralChemistry({ presetIdx: 4, mirrorOverlapRatio: 1 })
    )
    expect(rProp.current.overlapStatus.isTesting).toBe(true)
    expect(rProp.current.overlapStatus.canOverlap).toBe(true)
  })
})
