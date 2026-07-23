import { describe, it, expect } from 'vitest'
import { get3DModelForIsomer } from '../isomer3dTransform'
import type { IsomerNode } from '@/components/Chemistry'

describe('isomer3dTransform', () => {
  it('应能够精准处理邻甲酚 (cresol-o) 的 3D 苯环与 1,2- 邻位取代基解包', () => {
    const cresolO: IsomerNode = {
      id: 'cresol-o',
      name: '邻甲酚',
      formula: 'C₇H₈O',
      equivalentHCount: 4,
      nodes: [
        { id: 'c1', label: 'C₆H₄', x: 190, y: 240 },
        { id: 'o1', label: 'OH', x: 110, y: 170, isBranch: true },
        { id: 'c2', label: 'CH₃', x: 270, y: 170, isBranch: true },
      ],
      bonds: [
        { fromId: 'c1', toId: 'o1' },
        { fromId: 'c1', toId: 'c2' },
      ],
    }

    const model = get3DModelForIsomer(cresolO)

    const cAtoms = model.atoms.filter((a) => a.element === 'C')
    const hAtoms = model.atoms.filter((a) => a.element === 'H')
    const oAtoms = model.atoms.filter((a) => a.element === 'O')

    expect(cAtoms).toHaveLength(7)
    expect(hAtoms).toHaveLength(8)
    expect(oAtoms).toHaveLength(1)
    expect(model.bonds.length).toBeGreaterThanOrEqual(10)
  })

  it('应能够精准处理对甲酚 (cresol-p) 的 1,4- 对位 3D 解包', () => {
    const cresolP: IsomerNode = {
      id: 'cresol-p',
      name: '对甲酚',
      formula: 'C₇H₈O',
      equivalentHCount: 4,
      nodes: [
        { id: 'c1', label: 'C₆H₄', x: 190, y: 240 },
        { id: 'o1', label: 'OH', x: 90, y: 240 },
        { id: 'c2', label: 'CH₃', x: 290, y: 240 },
      ],
      bonds: [
        { fromId: 'c1', toId: 'o1' },
        { fromId: 'c1', toId: 'c2' },
      ],
    }

    const model = get3DModelForIsomer(cresolP)

    expect(model.atoms.filter((a) => a.element === 'C')).toHaveLength(7)
    expect(model.atoms.filter((a) => a.element === 'H')).toHaveLength(8)
    expect(model.atoms.filter((a) => a.element === 'O')).toHaveLength(1)
  })

  it('应能够处理苯甲醇 (benzyl-alcohol) 与 苯甲醚 (anisole)', () => {
    const benzylAlcohol: IsomerNode = {
      id: 'benzyl-alcohol',
      name: '苯甲醇',
      formula: 'C₇H₈O',
      equivalentHCount: 5,
      nodes: [
        { id: 'c1', label: 'C₆H₅', x: 100, y: 240 },
        { id: 'c2', label: 'CH₂', x: 210, y: 240 },
        { id: 'o1', label: 'OH', x: 310, y: 240 },
      ],
      bonds: [
        { fromId: 'c1', toId: 'c2' },
        { fromId: 'c2', toId: 'o1' },
      ],
    }

    const model1 = get3DModelForIsomer(benzylAlcohol)
    expect(model1.atoms.filter((a) => a.element === 'C')).toHaveLength(7)
    expect(model1.atoms.filter((a) => a.element === 'H')).toHaveLength(8)
    expect(model1.atoms.filter((a) => a.element === 'O')).toHaveLength(1)

    const anisole: IsomerNode = {
      id: 'anisole',
      name: '苯甲醚',
      formula: 'C₇H₈O',
      equivalentHCount: 4,
      nodes: [
        { id: 'c1', label: 'C₆H₅', x: 100, y: 240 },
        { id: 'o1', label: 'O', x: 210, y: 240 },
        { id: 'c2', label: 'CH₃', x: 310, y: 240 },
      ],
      bonds: [
        { fromId: 'c1', toId: 'o1' },
        { fromId: 'o1', toId: 'c2' },
      ],
    }

    const model2 = get3DModelForIsomer(anisole)
    expect(model2.atoms.filter((a) => a.element === 'C')).toHaveLength(7)
    expect(model2.atoms.filter((a) => a.element === 'H')).toHaveLength(8)
    expect(model2.atoms.filter((a) => a.element === 'O')).toHaveLength(1)
  })

  it('应能够解包复杂官能团 COOH (丙酸) 与 COO (乙酸甲酯)', () => {
    const propionicAcid: IsomerNode = {
      id: 'propionic-acid',
      name: '丙酸',
      formula: 'C₃H₆O₂',
      equivalentHCount: 3,
      nodes: [
        { id: 'c1', label: 'CH₃', x: 90, y: 240 },
        { id: 'c2', label: 'CH₂', x: 190, y: 240 },
        { id: 'c3', label: 'COOH', x: 300, y: 240 },
      ],
      bonds: [
        { fromId: 'c1', toId: 'c2' },
        { fromId: 'c2', toId: 'c3' },
      ],
    }

    const model = get3DModelForIsomer(propionicAcid)

    expect(model.atoms.filter((a) => a.element === 'C')).toHaveLength(3)
    expect(model.atoms.filter((a) => a.element === 'O')).toHaveLength(2)
    expect(model.atoms.filter((a) => a.element === 'H')).toHaveLength(6)
  })

  it('应能够处理闭环结构 (环丁烷 cyclobutane)', () => {
    const cyclobutane: IsomerNode = {
      id: 'cyclobutane',
      name: '环丁烷',
      formula: 'C₄H₈',
      equivalentHCount: 1,
      nodes: [
        { id: 'c1', label: 'CH₂', x: 140, y: 170 },
        { id: 'c2', label: 'CH₂', x: 260, y: 170 },
        { id: 'c3', label: 'CH₂', x: 260, y: 290 },
        { id: 'c4', label: 'CH₂', x: 140, y: 290 },
      ],
      bonds: [
        { fromId: 'c1', toId: 'c2' },
        { fromId: 'c2', toId: 'c3' },
        { fromId: 'c3', toId: 'c4' },
        { fromId: 'c4', toId: 'c1' },
      ],
    }

    const model = get3DModelForIsomer(cyclobutane)
    expect(model.atoms.filter((a) => a.element === 'C')).toHaveLength(4)
    expect(model.atoms.filter((a) => a.element === 'H')).toHaveLength(8)
    // 包含 4 条闭环 C-C 键和 8 条 C-H 键
    expect(model.bonds.length).toBe(12)
  })
})
