/**
 * 价电子对数 = 2 (sp杂化, 直线形)
 */

import type { VseprMolecule } from '../types'
import { GEOMETRY_VERTICES, POLY_EDGES } from '../geometry'

export const LINEAR_MOLECULES: Record<string, VseprMolecule> = {
  co2: {
    id: 'co2',
    name: '二氧化碳',
    formula: 'CO₂',
    centralElement: 'C',
    ligandElement: 'O',
    charge: 0,
    centralValence: 4,
    ligandCount: 2,
    ligandValence: 2,
    lonePairCount: 0,
    totalPairs: 2,
    electronGeometry: '直线形',
    molecularGeometry: '直线形',
    hybridization: 'sp',
    bondAngleText: '180°',
    description: 'CO₂ 中心 C 原子无孤电子对 (n=0)，2个σ键呈 180° 直线分布',
    centralColor: '#475569',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.linear[0], label: 'O' },
      { pos: GEOMETRY_VERTICES.linear[1], label: 'O' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.linear,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.linear[0], p2: GEOMETRY_VERTICES.linear[1], angleText: '180°' },
    ],
  },

  no2_plus: {
    id: 'no2_plus',
    name: '硝酰阳离子',
    formula: 'NO₂⁺',
    centralElement: 'N',
    ligandElement: 'O',
    charge: 1,
    centralValence: 5,
    ligandCount: 2,
    ligandValence: 2,
    lonePairCount: 0,
    totalPairs: 2,
    electronGeometry: '直线形',
    molecularGeometry: '直线形',
    hybridization: 'sp',
    bondAngleText: '180°',
    description: 'NO₂⁺ 阳离子带 +1 电荷，n=(5-1-2×2)/2=0，呈现对称直线形',
    centralColor: '#3b82f6',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.linear[0], label: 'O' },
      { pos: GEOMETRY_VERTICES.linear[1], label: 'O' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.linear,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.linear[0], p2: GEOMETRY_VERTICES.linear[1], angleText: '180°' },
    ],
  },
}
