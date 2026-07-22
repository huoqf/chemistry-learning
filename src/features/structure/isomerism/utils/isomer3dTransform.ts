import type { IsomerNode } from '@/components/Chemistry'
import { SCENE_COLORS, ATOM_COLORS } from '@/theme'

export interface Atom3D {
  id: string
  element: 'C' | 'H' | 'O'
  position: [number, number, number]
  color: string
  radius: number
}

export interface Bond3D {
  id: string
  start: [number, number, number]
  end: [number, number, number]
  color?: string
}

export interface Isomer3DModel {
  atoms: Atom3D[]
  bonds: Bond3D[]
}

/**
 * 将 2D 异构体结构转化为 3D 球棍分子模型数据 (全量防空安全护航)
 */
export function get3DModelForIsomer(isomer?: IsomerNode | null): Isomer3DModel {
  if (!isomer || !isomer.nodes || !Array.isArray(isomer.nodes)) {
    return { atoms: [], bonds: [] }
  }

  const atoms: Atom3D[] = []
  const bonds: Bond3D[] = []

  const node3dMap = new Map<string, [number, number, number]>()

  // 计算中心点
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  isomer.nodes.forEach(n => {
    if (n.x < minX) minX = n.x
    if (n.x > maxX) maxX = n.x
    if (n.y < minY) minY = n.y
    if (n.y > maxY) maxY = n.y
  })
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  // 映射碳主链/主要原子 (自动辨识 C 还是 O 元素)
  isomer.nodes.forEach((n, idx) => {
    const x3d = (n.x - cx) * 0.018
    const y3d = -(n.y - cy) * 0.018
    const z3d = (idx % 2 === 0 ? 0.35 : -0.35) + (n.isBranch ? 0.6 : 0)

    const pos: [number, number, number] = [x3d, y3d, z3d]
    node3dMap.set(n.id, pos)

    const isOxygenNode = n.label === 'O' || n.label === 'OH' || n.label.startsWith('O-')
    const element: 'C' | 'O' = isOxygenNode ? 'O' : 'C'
    const color = isOxygenNode ? ATOM_COLORS.O : ATOM_COLORS.C
    const radius = isOxygenNode ? 0.28 : 0.32

    atoms.push({
      id: `${element.toLowerCase()}-${n.id}`,
      element,
      position: pos,
      color,
      radius,
    })
  })

  // 映射 C-C / C=C 键 (支持单键与 C=C 平行双键柱体)
  if (Array.isArray(isomer.bonds)) {
    isomer.bonds.forEach((b, idx) => {
      const p1 = node3dMap.get(b.fromId)
      const p2 = node3dMap.get(b.toId)
      if (p1 && p2) {
        if (b.type === 'double') {
          // 计算两点在 3D XY 平面上的垂直切向量，生成平行的双圆柱键
          const dx = p2[0] - p1[0]
          const dy = p2[1] - p1[1]
          const len = Math.sqrt(dx * dx + dy * dy) || 1
          const offsetX = (-dy / len) * 0.07
          const offsetY = (dx / len) * 0.07

          bonds.push({
            id: `bond-cc-${idx}-a`,
            start: [p1[0] + offsetX, p1[1] + offsetY, p1[2]],
            end: [p2[0] + offsetX, p2[1] + offsetY, p2[2]],
            color: SCENE_COLORS.materials.metal,
          })
          bonds.push({
            id: `bond-cc-${idx}-b`,
            start: [p1[0] - offsetX, p1[1] - offsetY, p1[2]],
            end: [p2[0] - offsetX, p2[1] - offsetY, p2[2]],
            color: SCENE_COLORS.materials.metal,
          })
        } else {
          bonds.push({
            id: `bond-cc-${idx}`,
            start: p1,
            end: p2,
            color: SCENE_COLORS.materials.metal,
          })
        }
      }
    })
  }

  // 映射 H 原子外接
  isomer.nodes.forEach((n) => {
    const cPos = node3dMap.get(n.id)
    if (!cPos) return

    let hCount = 0
    if (n.label.includes('H₃')) hCount = 3
    else if (n.label.includes('H₂')) hCount = 2
    else if (n.label.includes('H')) hCount = 1

    const hAngles = [
      [0.6, 0.5, 0.4],
      [-0.6, -0.5, 0.4],
      [0, 0.6, -0.5],
      [0.5, -0.6, -0.3],
    ]

    for (let i = 0; i < hCount; i++) {
      const offset = hAngles[i % hAngles.length]
      const hPos: [number, number, number] = [
        cPos[0] + offset[0],
        cPos[1] + offset[1],
        cPos[2] + offset[2],
      ]

      atoms.push({
        id: `h-${n.id}-${i}`,
        element: 'H',
        position: hPos,
        color: ATOM_COLORS.H,
        radius: 0.2,
      })

      bonds.push({
        id: `bond-ch-${n.id}-${i}`,
        start: cPos,
        end: hPos,
        color: SCENE_COLORS.materials.metal,
      })
    }
  })

  return { atoms, bonds }
}
