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
 * 将 2D 异构体结构转化为 3D 球棍分子模型数据 (支持全系 24 种同分异构体无缝 3D 同步)
 */
export function get3DModelForIsomer(isomer?: IsomerNode | null): Isomer3DModel {
  if (!isomer || !isomer.nodes || !Array.isArray(isomer.nodes)) {
    return { atoms: [], bonds: [] }
  }

  // 判断是否包含芳香环 (苯环节点 C6H4 / C6H5)
  const aromaticNode = isomer.nodes.find(
    (n) => n.label.includes('C₆H₄') || n.label.includes('C₆H₅')
  )

  if (aromaticNode) {
    return generateAromatic3DModel(isomer)
  }

  return generateStandard3DModel(isomer)
}

/**
 * 针对芳香族化合物 (邻/间/对甲酚、苯甲醇、苯甲醚) 生成精准 3D 苯环与取代基立体模型
 */
function generateAromatic3DModel(isomer: IsomerNode): Isomer3DModel {
  const atoms: Atom3D[] = []
  const bonds: Bond3D[] = []

  // 1. 在 3D 原点中心构建正六边形苯环 (半径 R=1.35 3D 单位)
  const R = 1.35
  const ringCPositions: [number, number, number][] = []

  // 6 个苯环碳顶点 (C0 ~ C5，0 在正右方，逆时针 60° 递增)
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3
    const pos: [number, number, number] = [R * Math.cos(angle), R * Math.sin(angle), 0]
    ringCPositions.push(pos)

    atoms.push({
      id: `ring-c-${i}`,
      element: 'C',
      position: pos,
      color: ATOM_COLORS.C,
      radius: 0.32,
    })
  }

  // 构建 6 条苯环封闭化学键 (交替单双键模拟离域 π 键)
  for (let i = 0; i < 6; i++) {
    const nextIdx = (i + 1) % 6
    const p1 = ringCPositions[i]
    const p2 = ringCPositions[nextIdx]

    if (i % 2 === 0) {
      // 双键
      const dx = p2[0] - p1[0]
      const dy = p2[1] - p1[1]
      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const offsetX = (-dy / len) * 0.06
      const offsetY = (dx / len) * 0.06

      bonds.push({
        id: `ring-bond-${i}-a`,
        start: [p1[0] + offsetX, p1[1] + offsetY, 0],
        end: [p2[0] + offsetX, p2[1] + offsetY, 0],
        color: SCENE_COLORS.materials.metal,
      })
      bonds.push({
        id: `ring-bond-${i}-b`,
        start: [p1[0] - offsetX, p1[1] - offsetY, 0],
        end: [p2[0] - offsetX, p2[1] - offsetY, 0],
        color: SCENE_COLORS.materials.metal,
      })
    } else {
      // 单键
      bonds.push({
        id: `ring-bond-${i}`,
        start: p1,
        end: p2,
        color: SCENE_COLORS.materials.metal,
      })
    }
  }

  // 区分具体的芳香族异构体类型
  // ringOccupied 记录 6 个碳顶点哪个已接取代基，未接的自动补充苯环 H
  const ringOccupied = [false, false, false, false, false, false]

  const isOrtho = isomer.id === 'cresol-o'
  const isMeta = isomer.id === 'cresol-m'
  const isPara = isomer.id === 'cresol-p'
  const isBenzylAlcohol = isomer.id === 'benzyl-alcohol'
  const isAnisole = isomer.id === 'anisole'

  if (isOrtho) {
    // 邻甲酚: C0 接 OH, C1 接 CH3 (邻位 60°)
    ringOccupied[0] = true
    ringOccupied[1] = true
    addBranchGroup(ringCPositions[0], (0 * Math.PI) / 3, 'OH', 'sub-oh', atoms, bonds)
    addBranchGroup(ringCPositions[1], (1 * Math.PI) / 3, 'CH3', 'sub-ch3', atoms, bonds)
  } else if (isMeta) {
    // 间甲酚: C0 接 OH, C2 接 CH3 (间位 120°)
    ringOccupied[0] = true
    ringOccupied[2] = true
    addBranchGroup(ringCPositions[0], (0 * Math.PI) / 3, 'OH', 'sub-oh', atoms, bonds)
    addBranchGroup(ringCPositions[2], (2 * Math.PI) / 3, 'CH3', 'sub-ch3', atoms, bonds)
  } else if (isPara) {
    // 对甲酚: C0 接 OH, C3 接 CH3 (对位 180°)
    ringOccupied[0] = true
    ringOccupied[3] = true
    addBranchGroup(ringCPositions[0], (0 * Math.PI) / 3, 'OH', 'sub-oh', atoms, bonds)
    addBranchGroup(ringCPositions[3], (3 * Math.PI) / 3, 'CH3', 'sub-ch3', atoms, bonds)
  } else if (isBenzylAlcohol) {
    // 苯甲醇: C0 接 CH2, CH2 再接 OH
    ringOccupied[0] = true
    const c0Pos = ringCPositions[0]
    const angle = 0
    const dist1 = 1.1
    const ch2Pos: [number, number, number] = [
      c0Pos[0] + dist1 * Math.cos(angle),
      c0Pos[1] + dist1 * Math.sin(angle),
      0.2,
    ]
    atoms.push({
      id: 'sub-ch2',
      element: 'C',
      position: ch2Pos,
      color: ATOM_COLORS.C,
      radius: 0.32,
    })
    bonds.push({
      id: 'bond-ring-ch2',
      start: c0Pos,
      end: ch2Pos,
      color: SCENE_COLORS.materials.metal,
    })
    // CH2 加 2 个 H
    addHydrogensToC(ch2Pos, 2, 'sub-ch2', atoms, bonds)

    // CH2 接 OH
    const dist2 = 1.0
    const ohPos: [number, number, number] = [
      ch2Pos[0] + dist2 * Math.cos(angle + 0.5),
      ch2Pos[1] + dist2 * Math.sin(angle + 0.5),
      -0.2,
    ]
    atoms.push({
      id: 'sub-oh-o',
      element: 'O',
      position: ohPos,
      color: ATOM_COLORS.O,
      radius: 0.28,
    })
    bonds.push({
      id: 'bond-ch2-oh',
      start: ch2Pos,
      end: ohPos,
      color: SCENE_COLORS.materials.metal,
    })
    // OH 加 H
    const hPos: [number, number, number] = [
      ohPos[0] + 0.7 * Math.cos(angle + 1.2),
      ohPos[1] + 0.7 * Math.sin(angle + 1.2),
      0,
    ]
    atoms.push({
      id: 'sub-oh-h',
      element: 'H',
      position: hPos,
      color: ATOM_COLORS.H,
      radius: 0.2,
    })
    bonds.push({
      id: 'bond-o-h',
      start: ohPos,
      end: hPos,
      color: SCENE_COLORS.materials.metal,
    })
  } else if (isAnisole) {
    // 苯甲醚: C0 接 O, O 再接 CH3
    ringOccupied[0] = true
    const c0Pos = ringCPositions[0]
    const angle = 0
    const dist1 = 1.0
    const oPos: [number, number, number] = [
      c0Pos[0] + dist1 * Math.cos(angle),
      c0Pos[1] + dist1 * Math.sin(angle),
      0,
    ]
    atoms.push({
      id: 'sub-o',
      element: 'O',
      position: oPos,
      color: ATOM_COLORS.O,
      radius: 0.28,
    })
    bonds.push({
      id: 'bond-ring-o',
      start: c0Pos,
      end: oPos,
      color: SCENE_COLORS.materials.metal,
    })

    const dist2 = 1.1
    const ch3Pos: [number, number, number] = [
      oPos[0] + dist2 * Math.cos(angle + 0.6),
      oPos[1] + dist2 * Math.sin(angle + 0.6),
      0.3,
    ]
    atoms.push({
      id: 'sub-ch3',
      element: 'C',
      position: ch3Pos,
      color: ATOM_COLORS.C,
      radius: 0.32,
    })
    bonds.push({
      id: 'bond-o-ch3',
      start: oPos,
      end: ch3Pos,
      color: SCENE_COLORS.materials.metal,
    })
    // CH3 加 3 个 H
    addHydrogensToC(ch3Pos, 3, 'sub-ch3', atoms, bonds)
  } else {
    // 默认防空单取代处理
    ringOccupied[0] = true
    addBranchGroup(ringCPositions[0], 0, 'OH', 'sub-oh', atoms, bonds)
  }

  // 补充苯环未被取代顶点外延的 H 原子
  const hDist = 0.85
  for (let i = 0; i < 6; i++) {
    if (!ringOccupied[i]) {
      const angle = (i * Math.PI) / 3
      const cPos = ringCPositions[i]
      const hPos: [number, number, number] = [
        cPos[0] + hDist * Math.cos(angle),
        cPos[1] + hDist * Math.sin(angle),
        0,
      ]

      atoms.push({
        id: `ring-h-${i}`,
        element: 'H',
        position: hPos,
        color: ATOM_COLORS.H,
        radius: 0.2,
      })

      bonds.push({
        id: `bond-ring-h-${i}`,
        start: cPos,
        end: hPos,
        color: SCENE_COLORS.materials.metal,
      })
    }
  }

  return { atoms, bonds }
}

/**
 * 通用同分异构体 3D 建模算法 (支持全系常规脂肪烃、醇醚、酸酯、烯烃与环烷烃)
 */
function generateStandard3DModel(isomer: IsomerNode): Isomer3DModel {
  const atoms: Atom3D[] = []
  const bonds: Bond3D[] = []
  const node3dMap = new Map<string, [number, number, number]>()

  // 1. 计算 2D 质心
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  isomer.nodes.forEach((n) => {
    if (n.x < minX) minX = n.x
    if (n.x > maxX) maxX = n.x
    if (n.y < minY) minY = n.y
    if (n.y > maxY) maxY = n.y
  })
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  // 2. 映射主要节点 (C / O / COOH / COO / CHO 等)
  isomer.nodes.forEach((n, idx) => {
    const x3d = (n.x - cx) * 0.018
    const y3d = -(n.y - cy) * 0.018
    // 给非平面的碳链加上微小的 Z 轴锯齿感，但保持 2D 图形大致形状
    const isRing = isomer.id === 'cyclobutane'
    const z3d = isRing ? 0 : (idx % 2 === 0 ? 0.35 : -0.35) + (n.isBranch ? 0.5 : 0)

    const pos: [number, number, number] = [x3d, y3d, z3d]
    node3dMap.set(n.id, pos)

    const label = n.label
    const isOxygen = label === 'O' || label === 'OH' || label.startsWith('O-')

    if (label === 'COOH' || label === 'COO' || label === 'HCOO' || label === 'CHO') {
      // 组合官能团复合拆解
      unpackComplexGroup(n.id, label, pos, atoms, bonds)
    } else {
      // 标准单节点 C 或 O
      const element: 'C' | 'O' = isOxygen ? 'O' : 'C'
      const color = isOxygen ? ATOM_COLORS.O : ATOM_COLORS.C
      const radius = isOxygen ? 0.28 : 0.32

      atoms.push({
        id: `node-${n.id}`,
        element,
        position: pos,
        color,
        radius,
      })

      // 如果为 OH，自动补充羟基氢 H
      if (label === 'OH') {
        const hPos: [number, number, number] = [pos[0] + 0.6, pos[1] + 0.4, pos[2] + 0.2]
        atoms.push({
          id: `h-oh-${n.id}`,
          element: 'H',
          position: hPos,
          color: ATOM_COLORS.H,
          radius: 0.2,
        })
        bonds.push({
          id: `bond-o-h-${n.id}`,
          start: pos,
          end: hPos,
          color: SCENE_COLORS.materials.metal,
        })
      }
    }
  })

  // 3. 构建节点间的 C-C / C=C / C-O 主骨架化学键
  if (Array.isArray(isomer.bonds)) {
    isomer.bonds.forEach((b, idx) => {
      const p1 = node3dMap.get(b.fromId)
      const p2 = node3dMap.get(b.toId)
      if (p1 && p2) {
        if (b.type === 'double') {
          const dx = p2[0] - p1[0]
          const dy = p2[1] - p1[1]
          const len = Math.sqrt(dx * dx + dy * dy) || 1
          const offsetX = (-dy / len) * 0.07
          const offsetY = (dx / len) * 0.07

          bonds.push({
            id: `bond-double-${idx}-a`,
            start: [p1[0] + offsetX, p1[1] + offsetY, p1[2]],
            end: [p2[0] + offsetX, p2[1] + offsetY, p2[2]],
            color: SCENE_COLORS.materials.metal,
          })
          bonds.push({
            id: `bond-double-${idx}-b`,
            start: [p1[0] - offsetX, p1[1] - offsetY, p1[2]],
            end: [p2[0] - offsetX, p2[1] - offsetY, p2[2]],
            color: SCENE_COLORS.materials.metal,
          })
        } else {
          bonds.push({
            id: `bond-single-${idx}`,
            start: p1,
            end: p2,
            color: SCENE_COLORS.materials.metal,
          })
        }
      }
    })
  }

  // 4. 为常规碳节点 (CH3, CH2, CH) 精准自动补充 C-H 键与 H 原子球
  isomer.nodes.forEach((n) => {
    const cPos = node3dMap.get(n.id)
    if (!cPos) return

    const label = n.label
    // 跳过已由解包函数独立处理的复杂节点
    if (label === 'COOH' || label === 'COO' || label === 'HCOO' || label === 'CHO' || label === 'OH' || label === 'O') {
      return
    }

    let hCount = 0
    if (label.includes('H₃')) hCount = 3
    else if (label.includes('H₂')) hCount = 2
    else if (label.includes('H')) hCount = 1

    addHydrogensToC(cPos, hCount, n.id, atoms, bonds)
  })

  return { atoms, bonds }
}

/**
 * 辅助函数：在指定位置为 C 原子连接支团 (如 OH 或 CH3)
 */
function addBranchGroup(
  cPos: [number, number, number],
  angle: number,
  groupType: 'OH' | 'CH3',
  idPrefix: string,
  atoms: Atom3D[],
  bonds: Bond3D[]
) {
  const dist = 1.05
  const gPos: [number, number, number] = [
    cPos[0] + dist * Math.cos(angle),
    cPos[1] + dist * Math.sin(angle),
    0.1,
  ]

  if (groupType === 'OH') {
    // OH 羟基
    atoms.push({
      id: `${idPrefix}-o`,
      element: 'O',
      position: gPos,
      color: ATOM_COLORS.O,
      radius: 0.28,
    })
    bonds.push({
      id: `bond-${idPrefix}`,
      start: cPos,
      end: gPos,
      color: SCENE_COLORS.materials.metal,
    })
    // H 原子
    const hPos: [number, number, number] = [
      gPos[0] + 0.65 * Math.cos(angle + 0.8),
      gPos[1] + 0.65 * Math.sin(angle + 0.8),
      -0.2,
    ]
    atoms.push({
      id: `${idPrefix}-h`,
      element: 'H',
      position: hPos,
      color: ATOM_COLORS.H,
      radius: 0.2,
    })
    bonds.push({
      id: `bond-${idPrefix}-h`,
      start: gPos,
      end: hPos,
      color: SCENE_COLORS.materials.metal,
    })
  } else {
    // CH3 甲基
    atoms.push({
      id: `${idPrefix}-c`,
      element: 'C',
      position: gPos,
      color: ATOM_COLORS.C,
      radius: 0.32,
    })
    bonds.push({
      id: `bond-${idPrefix}`,
      start: cPos,
      end: gPos,
      color: SCENE_COLORS.materials.metal,
    })
    addHydrogensToC(gPos, 3, idPrefix, atoms, bonds)
  }
}

/**
 * 辅助函数：解包复杂组合官能团 (COOH / COO / HCOO / CHO)
 */
function unpackComplexGroup(
  nodeId: string,
  label: string,
  cPos: [number, number, number],
  atoms: Atom3D[],
  bonds: Bond3D[]
) {
  // 1. 中心 C 原子
  atoms.push({
    id: `node-${nodeId}-c`,
    element: 'C',
    position: cPos,
    color: ATOM_COLORS.C,
    radius: 0.32,
  })

  if (label === 'COOH') {
    // 羧基: =O 和 -OH
    const oDoublePos: [number, number, number] = [cPos[0] + 0.4, cPos[1] + 0.9, cPos[2] + 0.2]
    const oSinglePos: [number, number, number] = [cPos[0] + 0.9, cPos[1] - 0.4, cPos[2] - 0.2]
    const hPos: [number, number, number] = [oSinglePos[0] + 0.6, oSinglePos[1] - 0.2, oSinglePos[2] + 0.1]

    atoms.push({ id: `complex-${nodeId}-o1`, element: 'O', position: oDoublePos, color: ATOM_COLORS.O, radius: 0.28 })
    atoms.push({ id: `complex-${nodeId}-o2`, element: 'O', position: oSinglePos, color: ATOM_COLORS.O, radius: 0.28 })
    atoms.push({ id: `complex-${nodeId}-h`, element: 'H', position: hPos, color: ATOM_COLORS.H, radius: 0.2 })

    // 双键 =O
    bonds.push({ id: `complex-bond-${nodeId}-d1`, start: [cPos[0] + 0.05, cPos[1], cPos[2]], end: [oDoublePos[0] + 0.05, oDoublePos[1], oDoublePos[2]], color: SCENE_COLORS.materials.metal })
    bonds.push({ id: `complex-bond-${nodeId}-d2`, start: [cPos[0] - 0.05, cPos[1], cPos[2]], end: [oDoublePos[0] - 0.05, oDoublePos[1], oDoublePos[2]], color: SCENE_COLORS.materials.metal })
    // 单键 -OH
    bonds.push({ id: `complex-bond-${nodeId}-s1`, start: cPos, end: oSinglePos, color: SCENE_COLORS.materials.metal })
    bonds.push({ id: `complex-bond-${nodeId}-s2`, start: oSinglePos, end: hPos, color: SCENE_COLORS.materials.metal })
  } else if (label === 'COO' || label === 'HCOO') {
    // 酯基: =O 和 -O-
    const oDoublePos: [number, number, number] = [cPos[0] + 0.3, cPos[1] + 0.9, cPos[2] + 0.2]
    atoms.push({ id: `complex-${nodeId}-o1`, element: 'O', position: oDoublePos, color: ATOM_COLORS.O, radius: 0.28 })
    bonds.push({ id: `complex-bond-${nodeId}-d1`, start: [cPos[0] + 0.05, cPos[1], cPos[2]], end: [oDoublePos[0] + 0.05, oDoublePos[1], oDoublePos[2]], color: SCENE_COLORS.materials.metal })
    bonds.push({ id: `complex-bond-${nodeId}-d2`, start: [cPos[0] - 0.05, cPos[1], cPos[2]], end: [oDoublePos[0] - 0.05, oDoublePos[1], oDoublePos[2]], color: SCENE_COLORS.materials.metal })

    if (label === 'HCOO') {
      const hPos: [number, number, number] = [cPos[0] - 0.8, cPos[1] - 0.3, cPos[2]]
      atoms.push({ id: `complex-${nodeId}-h`, element: 'H', position: hPos, color: ATOM_COLORS.H, radius: 0.2 })
      bonds.push({ id: `complex-bond-${nodeId}-h`, start: cPos, end: hPos, color: SCENE_COLORS.materials.metal })
    }
  } else if (label === 'CHO') {
    // 醛基: =O 和 -H
    const oDoublePos: [number, number, number] = [cPos[0] + 0.4, cPos[1] + 0.9, cPos[2] + 0.2]
    const hPos: [number, number, number] = [cPos[0] + 0.8, cPos[1] - 0.4, cPos[2] - 0.2]

    atoms.push({ id: `complex-${nodeId}-o1`, element: 'O', position: oDoublePos, color: ATOM_COLORS.O, radius: 0.28 })
    atoms.push({ id: `complex-${nodeId}-h`, element: 'H', position: hPos, color: ATOM_COLORS.H, radius: 0.2 })

    bonds.push({ id: `complex-bond-${nodeId}-d1`, start: [cPos[0] + 0.05, cPos[1], cPos[2]], end: [oDoublePos[0] + 0.05, oDoublePos[1], oDoublePos[2]], color: SCENE_COLORS.materials.metal })
    bonds.push({ id: `complex-bond-${nodeId}-d2`, start: [cPos[0] - 0.05, cPos[1], cPos[2]], end: [oDoublePos[0] - 0.05, oDoublePos[1], oDoublePos[2]], color: SCENE_COLORS.materials.metal })
    bonds.push({ id: `complex-bond-${nodeId}-h`, start: cPos, end: hPos, color: SCENE_COLORS.materials.metal })
  }
}

/**
 * 辅助函数：根据 H 原子数量生成呈三维张角的 H 原子并连线
 */
function addHydrogensToC(
  cPos: [number, number, number],
  hCount: number,
  idPrefix: string,
  atoms: Atom3D[],
  bonds: Bond3D[]
) {
  if (hCount <= 0) return

  const hAngles = [
    [0.65, 0.55, 0.45],
    [-0.65, -0.55, 0.45],
    [0.0, 0.65, -0.55],
    [0.55, -0.65, -0.35],
  ]

  for (let i = 0; i < hCount; i++) {
    const offset = hAngles[i % hAngles.length]
    const hPos: [number, number, number] = [
      cPos[0] + offset[0],
      cPos[1] + offset[1],
      cPos[2] + offset[2],
    ]

    atoms.push({
      id: `h-${idPrefix}-${i}`,
      element: 'H',
      position: hPos,
      color: ATOM_COLORS.H,
      radius: 0.2,
    })

    bonds.push({
      id: `bond-ch-${idPrefix}-${i}`,
      start: cPos,
      end: hPos,
      color: SCENE_COLORS.materials.metal,
    })
  }
}
