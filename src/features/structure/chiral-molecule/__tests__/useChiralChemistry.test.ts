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

// ────────────────────────────────────────────────
// P2-12 回归锁：镜像面固定为 x = 0，画面结论必须与之一致
// ────────────────────────────────────────────────
describe('镜像重叠演示的视觉与结论一致性（P2-12）', () => {
  type Vec3 = [number, number, number]

  /** 判断某组原子在 x → −x 变换下是否仍是同一组原子（元素一致 + 位置成对） */
  function invariantUnderXMirror(atoms: { element: string; pos: Vec3 }[]): boolean {
    return atoms.every((a) => {
      const target: Vec3 = [-a.pos[0], a.pos[1], a.pos[2]]
      return atoms.some(
        (b) =>
          b.element === a.element &&
          Math.abs(b.pos[0] - target[0]) < 1e-6 &&
          Math.abs(b.pos[1] - target[1]) < 1e-6 &&
          Math.abs(b.pos[2] - target[2]) < 1e-6
      )
    })
  }

  it('非手性预设必须在 x → −x 下保持不变（否则 100% 重合时画面会错位交叉）', () => {
    const achiral = CHIRAL_PRESETS.filter((m) => !m.isChiral)
    expect(achiral.length).toBeGreaterThan(0)
    for (const mol of achiral) {
      expect(invariantUnderXMirror(mol.atoms), `${mol.id} 应关于 x=0 对称`).toBe(true)
    }
  })

  it('手性预设必须不满足 x → −x 不变（否则镜像能重合，非叠合性失效）', () => {
    const chiral = CHIRAL_PRESETS.filter((m) => m.isChiral)
    expect(chiral.length).toBeGreaterThan(0)
    for (const mol of chiral) {
      expect(invariantUnderXMirror(mol.atoms), `${mol.id} 不应关于 x=0 对称`).toBe(false)
    }
  })

  it('ratio = 1 时非手性分子的镜像原子与原原子位置逐一同位（真正重合）', () => {
    const propanolIdx = CHIRAL_PRESETS.findIndex((m) => m.id === 'propan-2-ol')
    const { result } = renderHook(() =>
      useChiralChemistry({ presetIdx: propanolIdx, mirrorOverlapRatio: 1 })
    )
    const { molecule, mirroredMolecule } = result.current
    expect(mirroredMolecule.atoms).toHaveLength(molecule.atoms.length)

    for (const atom of molecule.atoms) {
      const hit = mirroredMolecule.atoms.find(
        (m) =>
          m.element === atom.element &&
          Math.abs(m.pos[0] - atom.pos[0]) < 1e-6 &&
          Math.abs(m.pos[1] - atom.pos[1]) < 1e-6 &&
          Math.abs(m.pos[2] - atom.pos[2]) < 1e-6
      )
      expect(hit, `${atom.id} 的镜像应落在原位置上`).toBeDefined()
    }
  })

  it('ratio = 1 时手性分子的镜像必然存在错位原子', () => {
    const { result } = renderHook(() =>
      useChiralChemistry({ presetIdx: 0, mirrorOverlapRatio: 1 })
    )
    const { molecule, mirroredMolecule } = result.current
    const allMatched = molecule.atoms.every((atom) =>
      mirroredMolecule.atoms.some(
        (m) =>
          m.element === atom.element &&
          Math.abs(m.pos[0] - atom.pos[0]) < 1e-6 &&
          Math.abs(m.pos[1] - atom.pos[1]) < 1e-6 &&
          Math.abs(m.pos[2] - atom.pos[2]) < 1e-6
      )
    )
    expect(allMatched).toBe(false)
  })
})
