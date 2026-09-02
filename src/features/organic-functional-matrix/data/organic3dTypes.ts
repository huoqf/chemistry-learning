import { ATOM_COLORS, SCENE_COLORS } from '@/theme'

export interface Atom3DData {
  id: string
  symbol: string
  elementName: string
  position: [number, number, number]
  color: string
  radius: number
  hybridization?: string
  isFunctionalGroup?: boolean
  isChiral?: boolean
}

export interface Bond3DData {
  id: string
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  order?: 1 | 2 | 3
}

export interface StereoisomerVariant {
  id: string
  label: string
  formula: string
  differenceHint: string
  targetMoleculeId: string
}

export interface Organic3DMolecule {
  id: string
  name: string
  formula: string
  categoryName: string
  relatedGroupId?: string
  description: string
  /** 针对“结构表达式相近或相同，但 3D 空间球棍实质不同”的高考易混空间剖析 */
  spatialContrastNote?: string
  /** 支持同界面快速切换对比的立体异构 / 易混构型列表 */
  variants?: StereoisomerVariant[]
  geometryFeatures: {
    hybridization: string
    coplanarInfo: string
    collinearInfo?: string
    reactionSite: string
  }
  keyPoints: string[]
  relatedKnowledgeNode?: {
    id: string
    name: string
    routeHash: string
  }
  atoms: Atom3DData[]
  bonds: Bond3DData[]
}

// 辅助快速生成双键与三键的偏移量
export function createMultiBonds(
  start: [number, number, number],
  end: [number, number, number],
  order: 1 | 2 | 3,
  prefix: string,
  color = SCENE_COLORS.materials.metal
): Bond3DData[] {
  if (order === 1) {
    return [{ id: `${prefix}-single`, start, end, color, order: 1 }]
  }

  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const dz = end[2] - start[2]
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1

  let perpX = -dy / len
  let perpY = dx / len
  let perpZ = 0
  if (Math.abs(perpX) < 1e-4 && Math.abs(perpY) < 1e-4) {
    perpX = 1
    perpY = 0
  }

  if (order === 2) {
    const offset = 0.07
    return [
      {
        id: `${prefix}-d1`,
        start: [start[0] + perpX * offset, start[1] + perpY * offset, start[2] + perpZ * offset],
        end: [end[0] + perpX * offset, end[1] + perpY * offset, end[2] + perpZ * offset],
        color,
        order: 2,
      },
      {
        id: `${prefix}-d2`,
        start: [start[0] - perpX * offset, start[1] - perpY * offset, start[2] - perpZ * offset],
        end: [end[0] - perpX * offset, end[1] - perpY * offset, end[2] - perpZ * offset],
        color,
        order: 2,
      },
    ]
  }

  // 三键 order === 3
  const offset = 0.1
  return [
    { id: `${prefix}-t-mid`, start, end, color, order: 3 },
    {
      id: `${prefix}-t-up`,
      start: [start[0] + perpX * offset, start[1] + perpY * offset, start[2] + perpZ * offset],
      end: [end[0] + perpX * offset, end[1] + perpY * offset, end[2] + perpZ * offset],
      color,
      order: 3,
    },
    {
      id: `${prefix}-t-down`,
      start: [start[0] - perpX * offset, start[1] - perpY * offset, start[2] - perpZ * offset],
      end: [end[0] - perpX * offset, end[1] - perpY * offset, end[2] - perpZ * offset],
      color,
      order: 3,
    },
  ]
}

// 辅助构建苯环六元环 (正六边形，支持自动生成未取代碳上的共面氢原子)
export function createBenzeneRing(
  center: [number, number, number] = [0, 0, 0],
  radius = 1.35,
  idPrefix = 'ring',
  occupiedIndices: number[] = []
) {
  const ringCPositions: [number, number, number][] = []
  const atoms: Atom3DData[] = []
  const bonds: Bond3DData[] = []

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3
    const pos: [number, number, number] = [
      center[0] + radius * Math.cos(angle),
      center[1] + radius * Math.sin(angle),
      center[2],
    ]
    ringCPositions.push(pos)
    atoms.push({
      id: `${idPrefix}-c-${i}`,
      symbol: 'C',
      elementName: '碳 (sp²)',
      position: pos,
      color: ATOM_COLORS.C,
      radius: 0.32,
      hybridization: 'sp²',
    })
  }

  // 苯环骨架 C-C 键
  for (let i = 0; i < 6; i++) {
    const nextIdx = (i + 1) % 6
    const p1 = ringCPositions[i]
    const p2 = ringCPositions[nextIdx]
    const isDouble = i % 2 === 0
    if (isDouble) {
      bonds.push(...createMultiBonds(p1, p2, 2, `${idPrefix}-bond-${i}`))
    } else {
      bonds.push({
        id: `${idPrefix}-bond-${i}`,
        start: p1,
        end: p2,
        color: SCENE_COLORS.materials.metal,
        order: 1,
      })
    }
  }

  // 自动为未被基团占用的苯环顶点生成严格共面的 C-H 键与氢原子
  const occupiedSet = new Set(occupiedIndices)
  const hRadiusDist = radius + 0.95
  for (let i = 0; i < 6; i++) {
    if (occupiedSet.has(i)) continue
    const angle = (i * Math.PI) / 3
    const hPos: [number, number, number] = [
      Number((center[0] + hRadiusDist * Math.cos(angle)).toFixed(3)),
      Number((center[1] + hRadiusDist * Math.sin(angle)).toFixed(3)),
      center[2],
    ]
    const cPos = ringCPositions[i]
    atoms.push({
      id: `${idPrefix}-h-${i}`,
      symbol: 'H',
      elementName: '苯环氢',
      position: hPos,
      color: ATOM_COLORS.H,
      radius: 0.22,
    })
    bonds.push({
      id: `${idPrefix}-ch-bond-${i}`,
      start: cPos,
      end: hPos,
      order: 1,
    })
  }

  return { ringCPositions, atoms, bonds }
}

// 辅助构建 sp³ 甲基 (-CH₃) 的 3 个空间四面体氢原子与 C-H 键
export function createMethylGroup(
  cPos: [number, number, number],
  bondDir: [number, number, number],
  idPrefix: string
): { atoms: Atom3DData[]; bonds: Bond3DData[] } {
  const atoms: Atom3DData[] = []
  const bonds: Bond3DData[] = []

  // 归一化父键指向甲基碳的方向向量
  const len = Math.hypot(bondDir[0], bondDir[1], bondDir[2]) || 1
  const u: [number, number, number] = [bondDir[0] / len, bondDir[1] / len, bondDir[2] / len]

  // 构建正交基
  let perpX = -u[1]
  let perpY = u[0]
  let perpZ = 0
  if (Math.abs(perpX) < 1e-4 && Math.abs(perpY) < 1e-4) {
    perpX = 1
    perpY = 0
    perpZ = 0
  } else {
    const pLen = Math.hypot(perpX, perpY, perpZ) || 1
    perpX /= pLen
    perpY /= pLen
  }
  const v1: [number, number, number] = [perpX, perpY, perpZ]
  const v2: [number, number, number] = [
    u[1] * v1[2] - u[2] * v1[1],
    u[2] * v1[0] - u[0] * v1[2],
    u[0] * v1[1] - u[1] * v1[0],
  ]

  const bondLen = 0.92
  const forward = 0.35 * bondLen
  const radius = 0.9 * bondLen

  for (let k = 0; k < 3; k++) {
    const angle = (k * 2 * Math.PI) / 3
    const hPos: [number, number, number] = [
      Number((cPos[0] + forward * u[0] + radius * (Math.cos(angle) * v1[0] + Math.sin(angle) * v2[0])).toFixed(3)),
      Number((cPos[1] + forward * u[1] + radius * (Math.cos(angle) * v1[1] + Math.sin(angle) * v2[1])).toFixed(3)),
      Number((cPos[2] + forward * u[2] + radius * (Math.cos(angle) * v1[2] + Math.sin(angle) * v2[2])).toFixed(3)),
    ]
    atoms.push({
      id: `${idPrefix}-h-${k + 1}`,
      symbol: 'H',
      elementName: '甲基氢',
      position: hPos,
      color: ATOM_COLORS.H,
      radius: 0.22,
    })
    bonds.push({
      id: `${idPrefix}-ch-${k + 1}`,
      start: cPos,
      end: hPos,
      order: 1,
    })
  }

  return { atoms, bonds }
}

// 辅助构建 sp³ 亚甲基 (-CH₂-) 的 2 个空间四面体氢原子与 C-H 键
export function createMethyleneGroup(
  cPos: [number, number, number],
  prevPos: [number, number, number],
  nextPos: [number, number, number],
  idPrefix: string
): { atoms: Atom3DData[]; bonds: Bond3DData[] } {
  const atoms: Atom3DData[] = []
  const bonds: Bond3DData[] = []

  const d1: [number, number, number] = [prevPos[0] - cPos[0], prevPos[1] - cPos[1], prevPos[2] - cPos[2]]
  const d2: [number, number, number] = [nextPos[0] - cPos[0], nextPos[1] - cPos[1], nextPos[2] - cPos[2]]
  const l1 = Math.hypot(d1[0], d1[1], d1[2]) || 1
  const l2 = Math.hypot(d2[0], d2[1], d2[2]) || 1

  const u1: [number, number, number] = [d1[0] / l1, d1[1] / l1, d1[2] / l1]
  const u2: [number, number, number] = [d2[0] / l2, d2[1] / l2, d2[2] / l2]

  // 反向角平分线
  let bisect: [number, number, number] = [-(u1[0] + u2[0]), -(u1[1] + u2[1]), -(u1[2] + u2[2])]
  const bLen = Math.hypot(bisect[0], bisect[1], bisect[2]) || 1
  bisect = [bisect[0] / bLen, bisect[1] / bLen, bisect[2] / bLen]

  // 法向量
  let normal: [number, number, number] = [
    u1[1] * u2[2] - u1[2] * u2[1],
    u1[2] * u2[0] - u1[0] * u2[2],
    u1[0] * u2[1] - u1[1] * u2[0],
  ]
  let nLen = Math.hypot(normal[0], normal[1], normal[2])
  if (nLen < 1e-4) {
    normal = [0, 0, 1]
  } else {
    normal = [normal[0] / nLen, normal[1] / nLen, normal[2] / nLen]
  }

  const h1Pos: [number, number, number] = [
    Number((cPos[0] + 0.35 * bisect[0] + 0.85 * normal[0]).toFixed(3)),
    Number((cPos[1] + 0.35 * bisect[1] + 0.85 * normal[1]).toFixed(3)),
    Number((cPos[2] + 0.35 * bisect[2] + 0.85 * normal[2]).toFixed(3)),
  ]
  const h2Pos: [number, number, number] = [
    Number((cPos[0] + 0.35 * bisect[0] - 0.85 * normal[0]).toFixed(3)),
    Number((cPos[1] + 0.35 * bisect[1] - 0.85 * normal[1]).toFixed(3)),
    Number((cPos[2] + 0.35 * bisect[2] - 0.85 * normal[2]).toFixed(3)),
  ]

  atoms.push(
    { id: `${idPrefix}-h-1`, symbol: 'H', elementName: '亚甲基氢', position: h1Pos, color: ATOM_COLORS.H, radius: 0.22 },
    { id: `${idPrefix}-h-2`, symbol: 'H', elementName: '亚甲基氢', position: h2Pos, color: ATOM_COLORS.H, radius: 0.22 }
  )
  bonds.push(
    { id: `${idPrefix}-ch-1`, start: cPos, end: h1Pos, order: 1 },
    { id: `${idPrefix}-ch-2`, start: cPos, end: h2Pos, order: 1 }
  )

  return { atoms, bonds }
}
