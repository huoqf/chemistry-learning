import { ATOM_COLORS } from '@/theme'
import type { CellParams } from '@/components/Chemistry3D'

export interface AtomSpec {
  id: string
  element: string
  fracPos: [number, number, number]
  radius: number
  color: string
  label: string
  sharingRatio: number
  locationType: 'corner' | 'face' | 'edge' | 'body' | 'tetrahedral'
}

export interface BondSpec {
  fromIndex: number
  toIndex: number
  color?: string
}

export interface CrystalTypeData {
  id: string
  name: string
  formula: string
  cellParams: CellParams
  defaultA: number // pm
  molarMass: number // g/mol
  zValue: number // 晶胞均占分子数 N
  coordNumber: number // 配位数
  packingEfficiency: number // 空间利用率 (%)
  atoms: AtomSpec[]
  bonds: BondSpec[]
  description: string
}

/** 生成 8 个顶点的分数坐标 */
function getCornerFracs(): Array<[number, number, number]> {
  return [
    [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
    [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
  ]
}

/** 生成 6 个面心的分数坐标 */
function getFaceFracs(): Array<[number, number, number]> {
  return [
    [0.5, 0.5, 0], [0.5, 0.5, 1],
    [0.5, 0, 0.5], [0.5, 1, 0.5],
    [0, 0.5, 0.5], [1, 0.5, 0.5],
  ]
}

/** 生成 12 个棱心的分数坐标 */
function getEdgeFracs(): Array<[number, number, number]> {
  return [
    [0.5, 0, 0], [0.5, 1, 0], [0.5, 0, 1], [0.5, 1, 1],
    [0, 0.5, 0], [1, 0.5, 0], [0, 0.5, 1], [1, 0.5, 1],
    [0, 0, 0.5], [1, 0, 0.5], [0, 1, 0.5], [1, 1, 0.5],
  ]
}

/** NaCl 晶胞数据构建 */
function createNaClData(): CrystalTypeData {
  const atoms: AtomSpec[] = []
  
  // Cl⁻ 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `cl-corner-${i}`,
      element: 'Cl⁻',
      fracPos: pos,
      radius: 0.22,
      color: ATOM_COLORS.Cl,
      label: '顶点 Cl⁻ (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Cl⁻ 占 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `cl-face-${i}`,
      element: 'Cl⁻',
      fracPos: pos,
      radius: 0.22,
      color: ATOM_COLORS.Cl,
      label: '面心 Cl⁻ (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // Na⁺ 占 1 体心 (1 x 1 = 1)
  atoms.push({
    id: 'na-body-0',
    element: 'Na⁺',
    fracPos: [0.5, 0.5, 0.5],
    radius: 0.18,
    color: ATOM_COLORS.Na,
    label: '体心 Na⁺ (贡献 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // Na⁺ 占 12 棱心 (12 x 1/4 = 3)
  getEdgeFracs().forEach((pos, i) => {
    atoms.push({
      id: `na-edge-${i}`,
      element: 'Na⁺',
      fracPos: pos,
      radius: 0.18,
      color: ATOM_COLORS.Na,
      label: '棱心 Na⁺ (贡献 1/4)',
      sharingRatio: 0.25,
      locationType: 'edge',
    })
  })

  // 近邻配位键 (体心 Na⁺ 到 6 个面心 Cl⁻)
  const bonds: BondSpec[] = [
    { fromIndex: 14, toIndex: 8 },
    { fromIndex: 14, toIndex: 9 },
    { fromIndex: 14, toIndex: 10 },
    { fromIndex: 14, toIndex: 11 },
    { fromIndex: 14, toIndex: 12 },
    { fromIndex: 14, toIndex: 13 },
  ]

  return {
    id: 'nacl',
    name: 'NaCl (氯化钠晶体)',
    formula: 'NaCl',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 564,
    molarMass: 58.44,
    zValue: 4,
    coordNumber: 6,
    packingEfficiency: 66.8,
    atoms,
    bonds,
    description: '面心立方结构：Cl⁻ 占据顶点与面心，Na⁺ 占据体心与棱心，N(Na⁺)=4, N(Cl⁻)=4',
  }
}

/** CsCl 晶胞数据构建 */
function createCsClData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Cl⁻ 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `cl-corner-${i}`,
      element: 'Cl⁻',
      fracPos: pos,
      radius: 0.24,
      color: ATOM_COLORS.Cl,
      label: '顶点 Cl⁻ (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Cs⁺ 占 1 体心 (1 x 1 = 1)，使用 ATOM_COLORS.K (钾/铯深紫系 Token)
  atoms.push({
    id: 'cs-body-0',
    element: 'Cs⁺',
    fracPos: [0.5, 0.5, 0.5],
    radius: 0.26,
    color: ATOM_COLORS.K,
    label: '体心 Cs⁺ (贡献 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // 配位连线 (体心 Cs⁺ 到 8 个顶点 Cl⁻)
  const bonds: BondSpec[] = []
  for (let i = 0; i < 8; i++) {
    bonds.push({ fromIndex: 8, toIndex: i })
  }

  return {
    id: 'cscl',
    name: 'CsCl (氯化铯晶体)',
    formula: 'CsCl',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 412,
    molarMass: 168.36,
    zValue: 1,
    coordNumber: 8,
    packingEfficiency: 68.0,
    atoms,
    bonds,
    description: '简单立方结构：Cl⁻ 占据 8 个顶点，Cs⁺ 占据体心，N(Cs⁺)=1, N(Cl⁻)=1',
  }
}

/** Cu (FCC) 晶胞数据构建 */
function createCuData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Cu 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `cu-corner-${i}`,
      element: 'Cu',
      fracPos: pos,
      radius: 0.21,
      color: ATOM_COLORS.Cu,
      label: '顶点 Cu (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Cu 占 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `cu-face-${i}`,
      element: 'Cu',
      fracPos: pos,
      radius: 0.21,
      color: ATOM_COLORS.Cu,
      label: '面心 Cu (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // 面心到相邻顶点的配位连线 (每个面心连接 4 个同面顶点，共 6×4=24)
  // 顶点 indices 0-7, 面心 indices 8-13
  const bonds: BondSpec[] = []
  const faceCornerMap: Array<[number, number, number, number, number]> = [
    [8, 0, 1, 2, 3],   // 底面 z=0
    [9, 4, 5, 6, 7],   // 顶面 z=1
    [10, 0, 1, 5, 4],  // 前面 y=0
    [11, 3, 2, 6, 7],  // 后面 y=1
    [12, 0, 3, 7, 4],  // 左面 x=0
    [13, 1, 2, 6, 5],  // 右面 x=1
  ]
  faceCornerMap.forEach(([face, c0, c1, c2, c3]) => {
    bonds.push({ fromIndex: face, toIndex: c0 })
    bonds.push({ fromIndex: face, toIndex: c1 })
    bonds.push({ fromIndex: face, toIndex: c2 })
    bonds.push({ fromIndex: face, toIndex: c3 })
  })

  return {
    id: 'fcc-cu',
    name: 'Cu (面心立方最密堆积 FCC)',
    formula: 'Cu',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 361,
    molarMass: 63.55,
    zValue: 4,
    coordNumber: 12,
    packingEfficiency: 74.0,
    atoms,
    bonds,
    description: '面心立方最密堆积：8顶点(1/8) + 6面心(1/2)，均占原子数 N=4，配位数 12',
  }
}

/** Fe (BCC) 晶胞数据构建 */
function createFeData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Fe 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `fe-corner-${i}`,
      element: 'Fe',
      fracPos: pos,
      radius: 0.22,
      color: ATOM_COLORS.Fe,
      label: '顶点 Fe (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Fe 占 1 体心 (1 x 1 = 1)
  atoms.push({
    id: 'fe-body-0',
    element: 'Fe',
    fracPos: [0.5, 0.5, 0.5],
    radius: 0.22,
    color: ATOM_COLORS.Fe,
    label: '体心 Fe (贡献 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // 体心到 8 顶点的连线
  const bonds: BondSpec[] = []
  for (let i = 0; i < 8; i++) {
    bonds.push({ fromIndex: 8, toIndex: i })
  }

  return {
    id: 'bcc-fe',
    name: 'α-Fe (体心立方堆积 BCC)',
    formula: 'Fe',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 286.6,
    molarMass: 55.85,
    zValue: 2,
    coordNumber: 8,
    packingEfficiency: 68.0,
    atoms,
    bonds,
    description: '体心立方堆积：8顶点(1/8) + 1体心(1)，均占原子数 N=2，配位数 8',
  }
}

/** 金刚石 (Diamond) 晶胞数据构建 */
function createDiamondData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // C 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `c-corner-${i}`,
      element: 'C',
      fracPos: pos,
      radius: 0.17,
      color: ATOM_COLORS.C,
      label: '顶点 C (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // C 占 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `c-face-${i}`,
      element: 'C',
      fracPos: pos,
      radius: 0.17,
      color: ATOM_COLORS.C,
      label: '面心 C (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // C 占 4 内部四面体空隙 (4 x 1 = 4)
  const tetraFracs: Array<[number, number, number]> = [
    [0.25, 0.25, 0.25],
    [0.75, 0.75, 0.25],
    [0.75, 0.25, 0.75],
    [0.25, 0.75, 0.75],
  ]
  tetraFracs.forEach((pos, i) => {
    atoms.push({
      id: `c-tetra-${i}`,
      element: 'C',
      fracPos: pos,
      radius: 0.17,
      color: ATOM_COLORS.C,
      label: '内部 C (贡献 1)',
      sharingRatio: 1,
      locationType: 'tetrahedral',
    })
  })

  // 4 个四面体 C 各连接 1 个顶点 + 3 个面心 (共 16 条共价键)
  // 顶点 indices 0-7, 面心 indices 8-13, 四面体 indices 14-17
  const bonds: BondSpec[] = [
    // C(0.25,0.25,0.25) [14] → 顶点(0,0,0)[0], 面心 z=0[8], y=0[10], x=0[12]
    { fromIndex: 14, toIndex: 0 },
    { fromIndex: 14, toIndex: 8 },
    { fromIndex: 14, toIndex: 10 },
    { fromIndex: 14, toIndex: 12 },
    // C(0.75,0.75,0.25) [15] → 顶点(1,1,0)[2], 面心 z=0[8], y=1[11], x=1[13]
    { fromIndex: 15, toIndex: 2 },
    { fromIndex: 15, toIndex: 8 },
    { fromIndex: 15, toIndex: 11 },
    { fromIndex: 15, toIndex: 13 },
    // C(0.75,0.25,0.75) [16] → 顶点(1,0,1)[5], 面心 y=0[10], z=1[9], x=1[13]
    { fromIndex: 16, toIndex: 5 },
    { fromIndex: 16, toIndex: 9 },
    { fromIndex: 16, toIndex: 10 },
    { fromIndex: 16, toIndex: 13 },
    // C(0.25,0.75,0.75) [17] → 顶点(0,1,1)[7], 面心 x=0[12], z=1[9], y=1[11]
    { fromIndex: 17, toIndex: 7 },
    { fromIndex: 17, toIndex: 9 },
    { fromIndex: 17, toIndex: 11 },
    { fromIndex: 17, toIndex: 12 },
  ]

  return {
    id: 'diamond',
    name: 'C (金刚石结构)',
    formula: 'C',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 356.7,
    molarMass: 12.01,
    zValue: 8,
    coordNumber: 4,
    packingEfficiency: 34.0,
    atoms,
    bonds,
    description: '金刚石结构：8顶点(1) + 6面心(3) + 4内部四面体空隙(4)，均占原子数 N=8，配位数 4',
  }
}

/** CaF₂ (萤石结构) 晶胞数据构建 */
function createCaF2Data(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Ca²⁺ 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `ca-corner-${i}`,
      element: 'Ca²⁺',
      fracPos: pos,
      radius: 0.23,
      color: ATOM_COLORS.Ca,
      label: '顶点 Ca²⁺ (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Ca²⁺ 占 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `ca-face-${i}`,
      element: 'Ca²⁺',
      fracPos: pos,
      radius: 0.23,
      color: ATOM_COLORS.Ca,
      label: '面心 Ca²⁺ (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // F⁻ 占 8 个内部四面体空隙 (8 x 1 = 8)
  const fFracs: Array<[number, number, number]> = [
    [0.25, 0.25, 0.25], [0.75, 0.25, 0.25],
    [0.25, 0.75, 0.25], [0.75, 0.75, 0.25],
    [0.25, 0.25, 0.75], [0.75, 0.25, 0.75],
    [0.25, 0.75, 0.75], [0.75, 0.75, 0.75],
  ]
  fFracs.forEach((pos, i) => {
    atoms.push({
      id: `f-tetra-${i}`,
      element: 'F⁻',
      fracPos: pos,
      radius: 0.16,
      color: ATOM_COLORS.F,
      label: '内部 F⁻ (贡献 1)',
      sharingRatio: 1,
      locationType: 'tetrahedral',
    })
  })

  // 8 个 F⁻ 各自连接周围 4 个 Ca²⁺
  const bonds: BondSpec[] = [
    { fromIndex: 14, toIndex: 0 }, { fromIndex: 14, toIndex: 8 }, { fromIndex: 14, toIndex: 10 }, { fromIndex: 14, toIndex: 12 },
    { fromIndex: 15, toIndex: 1 }, { fromIndex: 15, toIndex: 8 }, { fromIndex: 15, toIndex: 10 }, { fromIndex: 15, toIndex: 13 },
    { fromIndex: 16, toIndex: 3 }, { fromIndex: 16, toIndex: 8 }, { fromIndex: 16, toIndex: 11 }, { fromIndex: 16, toIndex: 12 },
    { fromIndex: 17, toIndex: 2 }, { fromIndex: 17, toIndex: 8 }, { fromIndex: 17, toIndex: 11 }, { fromIndex: 17, toIndex: 13 },
    { fromIndex: 18, toIndex: 4 }, { fromIndex: 18, toIndex: 9 }, { fromIndex: 18, toIndex: 10 }, { fromIndex: 18, toIndex: 12 },
    { fromIndex: 19, toIndex: 5 }, { fromIndex: 19, toIndex: 9 }, { fromIndex: 19, toIndex: 10 }, { fromIndex: 19, toIndex: 13 },
    { fromIndex: 20, toIndex: 7 }, { fromIndex: 20, toIndex: 9 }, { fromIndex: 20, toIndex: 11 }, { fromIndex: 20, toIndex: 12 },
    { fromIndex: 21, toIndex: 6 }, { fromIndex: 21, toIndex: 9 }, { fromIndex: 21, toIndex: 11 }, { fromIndex: 21, toIndex: 13 },
  ]

  return {
    id: 'caf2',
    name: 'CaF₂ (萤石结构)',
    formula: 'CaF₂',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 546,
    molarMass: 78.08,
    zValue: 4,
    coordNumber: 8,
    packingEfficiency: 65.0,
    atoms,
    bonds,
    description: '萤石结构：Ca²⁺ 占顶点与面心(N=4)，F⁻ 占8个内部小立方体/四面体空隙(N=8)，配位数 8:4',
  }
}

/** Mg (六方最密堆积 HCP) 晶胞数据构建 */
function createHcpMgData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Mg 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `mg-corner-${i}`,
      element: 'Mg',
      fracPos: pos,
      radius: 0.22,
      color: ATOM_COLORS.Mg,
      label: '顶点 Mg (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Mg 占 1 内部 (1 x 1 = 1)
  atoms.push({
    id: 'mg-body-0',
    element: 'Mg',
    fracPos: [0.333, 0.667, 0.5],
    radius: 0.22,
    color: ATOM_COLORS.Mg,
    label: '内部 Mg (贡献 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // 内部 Mg [index 8] 到周边 6 个顶点的连线
  const bonds: BondSpec[] = [
    { fromIndex: 8, toIndex: 0 },
    { fromIndex: 8, toIndex: 1 },
    { fromIndex: 8, toIndex: 3 },
    { fromIndex: 8, toIndex: 4 },
    { fromIndex: 8, toIndex: 5 },
    { fromIndex: 8, toIndex: 7 },
  ]

  return {
    id: 'hcp-mg',
    name: 'Mg (六方最密堆积 HCP)',
    formula: 'Mg',
    cellParams: { a: 1, b: 1, c: 1.633, alpha: 90, beta: 90, gamma: 120 },
    defaultA: 321,
    molarMass: 24.31,
    zValue: 2,
    coordNumber: 12,
    packingEfficiency: 74.0,
    atoms,
    bonds,
    description: '六方最密堆积：平行六面体晶胞 8 顶点(1) + 1 内部(1)，均占原子数 N=2，配位数 12',
  }
}

/** CO₂ (干冰分子晶体) 晶胞数据构建 */
function createCO2Data(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // CO₂ 分子在 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `co2-corner-${i}`,
      element: 'CO₂',
      fracPos: pos,
      radius: 0.23,
      color: ATOM_COLORS.O,
      label: '顶点 CO₂ 分子 (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // CO₂ 分子在 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `co2-face-${i}`,
      element: 'CO₂',
      fracPos: pos,
      radius: 0.23,
      color: ATOM_COLORS.O,
      label: '面心 CO₂ 分子 (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // 面心到 4 个同面顶点的连线 (模拟分子间作用力网格)
  const bonds: BondSpec[] = []
  const faceCornerMap: Array<[number, number, number, number, number]> = [
    [8, 0, 1, 2, 3],
    [9, 4, 5, 6, 7],
    [10, 0, 1, 5, 4],
    [11, 3, 2, 6, 7],
    [12, 0, 3, 7, 4],
    [13, 1, 2, 6, 5],
  ]
  faceCornerMap.forEach(([face, c0, c1, c2, c3]) => {
    bonds.push({ fromIndex: face, toIndex: c0 })
    bonds.push({ fromIndex: face, toIndex: c1 })
    bonds.push({ fromIndex: face, toIndex: c2 })
    bonds.push({ fromIndex: face, toIndex: c3 })
  })

  return {
    id: 'co2',
    name: 'CO₂ (干冰分子晶体)',
    formula: 'CO₂',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 558,
    molarMass: 44.01,
    zValue: 4,
    coordNumber: 12,
    packingEfficiency: 65.5,
    atoms,
    bonds,
    description: '分子晶体面心立方：8顶点(1) + 6面心(3)，均占 CO₂ 分子数 N=4，配位数 12',
  }
}

export const CRYSTAL_DATABASE: Record<string, CrystalTypeData> = {
  nacl: createNaClData(),
  cscl: createCsClData(),
  'fcc-cu': createCuData(),
  'bcc-fe': createFeData(),
  diamond: createDiamondData(),
  caf2: createCaF2Data(),
  'hcp-mg': createHcpMgData(),
  co2: createCO2Data(),
}
