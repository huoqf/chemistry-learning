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

// 辅助构建苯环六元环 (正六边形)
export function createBenzeneRing(
  center: [number, number, number] = [0, 0, 0],
  radius = 1.35,
  idPrefix = 'ring'
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

  return { ringCPositions, atoms, bonds }
}
