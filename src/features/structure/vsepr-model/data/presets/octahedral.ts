/**
 * 价电子对数 = 6 (sp³d²杂化, 正八面体)
 */

import type { VseprMolecule } from '../types'
import { GEOMETRY_VERTICES, POLY_EDGES, normalize } from '../geometry'

export const OCTAHEDRAL_MOLECULES: Record<string, VseprMolecule> = {
  sf6: {
    id: 'sf6',
    name: '六氟化硫',
    formula: 'SF₆',
    centralElement: 'S',
    ligandElement: 'F',
    charge: 0,
    centralValence: 6,
    ligandCount: 6,
    ligandValence: 1,
    lonePairCount: 0,
    totalPairs: 6,
    electronGeometry: '正八面体',
    molecularGeometry: '正八面体',
    hybridization: 'sp³d²',
    bondAngleText: '90°',
    description: 'SF₆ 6个 S-F 键完美高度对称指向正八面体 6 个顶点，键角均为 90°',
    centralColor: '#eab308',
    ligandColor: '#06b6d4',
    ligands: [
      { pos: GEOMETRY_VERTICES.octahedral[0], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[1], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[2], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[3], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[4], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[5], label: 'F' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.octahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.octahedral[0], p2: GEOMETRY_VERTICES.octahedral[2], angleText: '90°' },
      { p1: GEOMETRY_VERTICES.octahedral[2], p2: GEOMETRY_VERTICES.octahedral[4], angleText: '90°' },
    ],
  },

  xef4: {
    id: 'xef4',
    name: '四氟化氙',
    formula: 'XeF₄',
    centralElement: 'Xe',
    ligandElement: 'F',
    charge: 0,
    centralValence: 8,
    ligandCount: 4,
    ligandValence: 1,
    lonePairCount: 2,
    totalPairs: 6,
    electronGeometry: '正八面体',
    molecularGeometry: '平面正方形',
    hybridization: 'sp³d²',
    bondAngleText: '90°',
    description: 'XeF₄ 2对孤电子对相互排斥处于八面体对位(上下轴向)，4个F形成平面正方形',
    centralColor: '#a855f7',
    ligandColor: '#06b6d4',
    ligands: [
      { pos: GEOMETRY_VERTICES.octahedral[2], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[3], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[4], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[5], label: 'F' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.octahedral[0], 1.6 * 0.9), label: 'Lone Pair 1' },
      { pos: normalize(GEOMETRY_VERTICES.octahedral[1], 1.6 * 0.9), label: 'Lone Pair 2' },
    ],
    polyEdges: POLY_EDGES.octahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.octahedral[2], p2: GEOMETRY_VERTICES.octahedral[4], angleText: '90°' },
    ],
  },
}
