import type { ChemistryQuantity } from '../../chemistryQuantities'
import { CRYSTAL_DATABASE } from '../../../features/structure/unit-cell-calculation/data/unitCellData'

const CRYSTAL_TYPE_KEYS = [
  'nacl',
  'cscl',
  'fcc-cu',
  'bcc-fe',
  'diamond',
  'caf2',
  'hcp-mg',
  'co2',
]
const NA = 6.02214076e23

function parseCrystalTypeId(params: Record<string, any>): string {
  const rawType = params.crystalType ?? params.crystalTypeId ?? 0
  if (typeof rawType === 'number') {
    const typeIdx = Math.min(Math.max(0, Math.floor(rawType)), CRYSTAL_TYPE_KEYS.length - 1)
    return CRYSTAL_TYPE_KEYS[typeIdx] || 'nacl'
  }
  if (typeof rawType === 'string' && CRYSTAL_TYPE_KEYS.includes(rawType)) {
    return rawType
  }
  return 'nacl'
}

export function buildUnitCellQuantities(
  params: Record<string, number>,
): ChemistryQuantity[] {
  const crystalTypeId = parseCrystalTypeId(params)
  const crystalData = CRYSTAL_DATABASE[crystalTypeId] || CRYSTAL_DATABASE.nacl
  const edgeLength = params.edgeLength ?? crystalData.defaultA
  const molarMass = params.molarMass ?? crystalData.molarMass

  const zValue = crystalData.zValue
  const mCell = (zValue * molarMass) / NA
  const isHexagonal = crystalTypeId === 'hcp-mg'
  const cHp = isHexagonal ? Math.sqrt(8 / 3) * edgeLength : edgeLength
  const vCell = isHexagonal
    ? (Math.sqrt(3) / 2) * Math.pow(edgeLength * 1e-10, 2) * (cHp * 1e-10)
    : Math.pow(edgeLength * 1e-10, 3)
  const density = vCell > 0 ? mCell / vCell : 0

  return [
    {
      key: 'zValue',
      label: '晶胞均占原子/分子数 N',
      value: zValue,
      unit: '',
      colorKey: 'concentration',
      precision: 0,
    },
    {
      key: 'edgeLength',
      label: '晶胞边长 a',
      value: edgeLength,
      unit: 'pm',
      colorKey: 'temperature',
      precision: 1,
    },
    {
      key: 'molarMass',
      label: '摩尔质量 M',
      value: molarMass,
      unit: 'g/mol',
      colorKey: 'equilibriumConstant',
      precision: 2,
    },
    {
      key: 'density',
      label: '理论密度 ρ',
      value: parseFloat(density.toFixed(3)),
      unit: 'g/cm³',
      colorKey: 'reactionRate',
      precision: 3,
    },
    {
      key: 'mCell',
      label: '晶胞质量 m_cell',
      value: parseFloat((mCell * 1e22).toFixed(3)),
      unit: '×10⁻²² g',
      colorKey: 'concentration',
      precision: 3,
    },
    {
      key: 'packingEfficiency',
      label: '空间利用率 η',
      value: crystalData.packingEfficiency,
      unit: '%',
      colorKey: 'equilibriumConstant',
      precision: 1,
    },
  ]
}

export function getUnitCellFormulas(params: Record<string, number>) {
  const crystalTypeId = parseCrystalTypeId(params)

  switch (crystalTypeId) {
    case 'nacl':
      return [
        {
          name: 'NaCl 晶胞密度代入公式 (Z=4)',
          latex: '\\rho = \\frac{4 \\times 58.44}{N_A \\times a^3 \\times 10^{-30}}',
          level: 'core' as const,
          condition: 'Na⁺: 12×1/4+1=4; Cl⁻: 8×1/8+6×1/2=4',
        },
        {
          name: 'NaCl 离子间距与边长关系',
          latex: 'd(\\text{Na}^+\\text{-Cl}^-) = \\frac{1}{2}a',
          level: 'important' as const,
          condition: '最近邻 Na⁺ 与 Cl⁻ 距离为边长的一半',
        },
        {
          name: '配位数 (CN)',
          latex: 'CN(\\text{Na}^+) = 6,\\quad CN(\\text{Cl}^-) = 6',
          level: 'important' as const,
          condition: '八面体配位 (6:6 型离子晶体)',
        },
      ]
    case 'cscl':
      return [
        {
          name: 'CsCl 晶胞密度代入公式 (Z=1)',
          latex: '\\rho = \\frac{1 \\times 168.36}{N_A \\times a^3 \\times 10^{-30}}',
          level: 'core' as const,
          condition: 'Cs⁺: 体心 1×1=1; Cl⁻: 顶点 8×1/8=1',
        },
        {
          name: 'CsCl 离子间距与体对角线关系',
          latex: 'd(\\text{Cs}^+\\text{-Cl}^-) = \\frac{\\sqrt{3}}{2}a',
          level: 'important' as const,
          condition: '最近邻 Cs⁺ 与 Cl⁻ 在体对角线处接触',
        },
        {
          name: '配位数 (CN)',
          latex: 'CN(\\text{Cs}^+) = 8,\\quad CN(\\text{Cl}^-) = 8',
          level: 'important' as const,
          condition: '立方体配位 (8:8 型离子晶体)',
        },
      ]
    case 'fcc-cu':
      return [
        {
          name: 'Cu 面心立方 (FCC) 密度公式 (Z=4)',
          latex: '\\rho = \\frac{4 \\times M(\\text{Cu})}{N_A \\times a^3 \\times 10^{-30}}',
          level: 'core' as const,
          condition: 'Cu: 顶点 8×1/8 + 面心 6×1/2 = 4',
        },
        {
          name: 'FCC 几何半径与边长关系',
          latex: '\\sqrt{2}a = 4r \\implies r = \\frac{\\sqrt{2}}{4}a',
          level: 'important' as const,
          condition: '原子在面对角线处紧密相切',
        },
        {
          name: '空间利用率与配位数',
          latex: '\\eta = \\frac{4 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\pi\\sqrt{2}}{6} \\approx 74\\%, \\quad CN = 12',
          level: 'important' as const,
        },
      ]
    case 'bcc-fe':
      return [
        {
          name: 'α-Fe 体心立方 (BCC) 密度公式 (Z=2)',
          latex: '\\rho = \\frac{2 \\times M(\\text{Fe})}{N_A \\times a^3 \\times 10^{-30}}',
          level: 'core' as const,
          condition: 'Fe: 顶点 8×1/8 + 体心 1 = 2',
        },
        {
          name: 'BCC 几何半径与边长关系',
          latex: '\\sqrt{3}a = 4r \\implies r = \\frac{\\sqrt{3}}{4}a',
          level: 'important' as const,
          condition: '原子在体对角线处紧密相切',
        },
        {
          name: '空间利用率与配位数',
          latex: '\\eta = \\frac{2 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\pi\\sqrt{3}}{8} \\approx 68\\%, \\quad CN = 8',
          level: 'important' as const,
        },
      ]
    case 'diamond':
      return [
        {
          name: '金刚石 (C) 晶胞密度代入公式 (Z=8)',
          latex: '\\rho = \\frac{8 \\times 12.01}{N_A \\times a^3 \\times 10^{-30}}',
          level: 'core' as const,
          condition: 'C: 8顶点×1/8 + 6面心×1/2 + 4四面体空隙×1 = 8',
        },
        {
          name: 'C-C 键长与晶胞边长几何关系',
          latex: 'l(\\text{C-C}) = \\frac{\\sqrt{3}}{4}a = 2r',
          level: 'important' as const,
          condition: '内部四面体 C 与顶点/面心 C 相连',
        },
        {
          name: '空间利用率与配位数',
          latex: '\\eta = \\frac{8 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\pi\\sqrt{3}}{16} \\approx 34\\%, \\quad CN = 4',
          level: 'important' as const,
        },
      ]
    case 'caf2':
      return [
        {
          name: 'CaF₂ 萤石晶胞密度公式 (Z=4)',
          latex: '\\rho = \\frac{4 \\times M(\\text{CaF}_2)}{N_A \\times a^3 \\times 10^{-30}}',
          level: 'core' as const,
          condition: 'Ca²⁺: 8×1/8+6×1/2=4; F⁻: 8×1=8',
        },
        {
          name: 'Ca-F 键长与体对角线关系',
          latex: 'd(\\text{Ca}^{2+}\\text{-F}^-) = \\frac{\\sqrt{3}}{4}a',
          level: 'important' as const,
          condition: 'F⁻ 位于 8 个内部小立方体中心',
        },
        {
          name: '配位数 (CN)',
          latex: 'CN(\\text{Ca}^{2+}) = 8,\\quad CN(\\text{F}^-) = 4',
          level: 'important' as const,
          condition: 'Ca²⁺ 为 8 配位立方体，F⁻ 为 4 配位四面体',
        },
      ]
    case 'hcp-mg':
      return [
        {
          name: 'Mg 六方最密堆积 (HCP) 密度公式',
          latex: '\\rho = \\frac{N \\cdot M}{N_A \\cdot V_{\\text{cell}}} = \\frac{2 \\times M(\\text{Mg})}{N_A \\times \\frac{\\sqrt{3}}{2} a^2 c \\times 10^{-30}}',
          level: 'core' as const,
          condition: '平行六面体晶胞 Z=2, V_{\\text{cell}} = \\frac{\\sqrt{3}}{2}a^2c \\text{ (底面 } 60^\\circ/120^\\circ \\text{ 菱形, 高 } c)',
        },
        {
          name: '理想 HCP 轴比 c/a 关系',
          latex: 'c = \\sqrt{\\frac{8}{3}}a \\approx 1.633a',
          level: 'important' as const,
          condition: '球体最密堆积几何充要条件 (a 为底面菱形边长, c 为高)',
        },
        {
          name: '空间利用率与配位数',
          latex: '\\eta = \\frac{2 \\times \\frac{4}{3}\\pi r^3}{\\frac{\\sqrt{3}}{2}a^2c} = \\frac{\\pi\\sqrt{2}}{6} \\approx 74\\%, \\quad CN = 12',
          level: 'important' as const,
          condition: 'ABAB... 最密堆积排列 (a = 2r)',
        },
      ]
    case 'co2':
      return [
        {
          name: '干冰 (CO₂) 分子晶体密度公式 (Z=4)',
          latex: '\\rho = \\frac{4 \\times M(\\text{CO}_2)}{N_A \\times a^3 \\times 10^{-30}}',
          level: 'core' as const,
          condition: 'CO₂ 分子: 顶点 8×1/8 + 面心 6×1/2 = 4',
        },
        {
          name: 'CO₂ 分子间距与配位数',
          latex: 'd(\\text{CO}_2\\text{-CO}_2) = \\frac{\\sqrt{2}}{2}a,\\quad CN = 12',
          level: 'important' as const,
          condition: '每个 CO₂ 分子与周围 12 个等距 CO₂ 分子紧邻',
        },
        {
          name: '分子有效范德华空间利用率',
          latex: '\\eta = \\frac{4 \\times \\frac{4}{3}\\pi r_{\\text{vdW}}^3}{a^3} \\approx 65.50\\%',
          level: 'important' as const,
          condition: '基于分子有效范德华半径 r_vdW ≈ 189 pm 计算 (区别于单原子 FCC 理论极限 74%)',
        },
      ]
    default:
      return [
        {
          name: '晶胞密度通用计算公式',
          latex: '\\rho = \\frac{N \\cdot M}{N_A \\cdot V_{\\text{cell}}}',
          level: 'core' as const,
          condition: '立方晶胞 V=a³×10⁻³⁰ cm³；六方晶胞 V=(√3/2)a²c×10⁻³⁰ cm³',
        },
      ]
  }
}

export function getUnitCellExamPoints(params: Record<string, number>) {
  const crystalTypeId = parseCrystalTypeId(params)

  const basePoint = {
    text: '【单位换算陷阱】高考计算晶胞密度时，若边长以 pm 为单位，必须先乘以 10⁻¹⁰ 转换为 cm！体积为 a³ × 10⁻³⁰ cm³。',
    importance: 'gaokao' as const,
  }

  switch (crystalTypeId) {
    case 'nacl':
      return [
        basePoint,
        {
          text: '【NaCl 配位与均摊】Cl⁻ 占据顶点(8×1/8)与面心(6×1/2)，Na⁺ 占据体心(1×1)与棱心(12×1/4)。单个晶胞含 4 个 Na⁺ 和 4 个 Cl⁻。配位数 6:6。',
          importance: 'core' as const,
        },
        {
          text: '【最近距离考法】最近邻的 Na⁺ 与 Cl⁻ 距离等于 a/2；最近邻的同种离子（如 Na⁺ 与 Na⁺）距离等于 (√2/2)a。',
          importance: 'hard' as const,
        },
      ]
    case 'cscl':
      return [
        basePoint,
        {
          text: '【CsCl 配位与均摊】Cl⁻ 占据 8 个顶点(8×1/8=1)，Cs⁺ 占据体心(1×1=1)。单个晶胞含 1 个 CsCl。配位数 8:8。',
          importance: 'core' as const,
        },
        {
          text: '【最近距离考法】最近邻的 Cs⁺ 与 Cl⁻ 距离等于体对角线的一半，即 (√3/2)a。',
          importance: 'hard' as const,
        },
      ]
    case 'fcc-cu':
      return [
        basePoint,
        {
          text: '【Cu 面心立方 (FCC)】顶点(8×1/8) + 面心(6×1/2)，均占原子数 N=4。空间利用率 74%，配位数 12 (A1 型最密堆积，ABCABC... 堆积)。',
          importance: 'gaokao' as const,
        },
        {
          text: '【半径与边长】面对角线 √2 a = 4r，因此原子半径 r = (√2/4)a。',
          importance: 'hard' as const,
        },
      ]
    case 'bcc-fe':
      return [
        basePoint,
        {
          text: '【Fe 体心立方 (BCC)】顶点(8×1/8) + 体心(1×1)，均占原子数 N=2。空间利用率 68%，配位数 8 (A2 型堆积)。',
          importance: 'gaokao' as const,
        },
        {
          text: '【半径与边长】体对角线 √3 a = 4r，因此原子半径 r = (√3/4)a。',
          importance: 'hard' as const,
        },
      ]
    case 'diamond':
      return [
        basePoint,
        {
          text: '【金刚石 C 均摊】8顶点(1) + 6面心(3) + 4内部四面体空隙(4)，单个晶胞含 8 个 C 原子。配位数 4 (正四面体构型)。',
          importance: 'gaokao' as const,
        },
        {
          text: '【C-C 键长与半径】C-C 键长等于体对角线的 1/4，即 l = (√3/4)a，原子半径 r = (√3/8)a。空间利用率仅 34%。',
          importance: 'hard' as const,
        },
      ]
    case 'caf2':
      return [
        basePoint,
        {
          text: '【CaF₂ 萤石结构】Ca²⁺ 占顶点与面心(N=4)，F⁻ 占 8 个内部四面体空隙(N=8)。晶胞包含 4 个 CaF₂ 单元。',
          importance: 'gaokao' as const,
        },
        {
          text: '【异质配位数】Ca²⁺ 配位数为 8 (立方体)，F⁻ 配位数为 4 (正四面体)。配位数之比 8:4 与化学式化学计量比 1:2 成反比。',
          importance: 'hard' as const,
        },
      ]
    case 'hcp-mg':
      return [
        {
          text: '【六方平行六面体均摊考法】六方晶胞顶角切勿机械套用 1/8！4 个 120° 顶角由 6 个晶胞共享(占 1/6)，4 个 60° 顶角由 12 个晶胞共享(占 1/12)。顶点总贡献 = 4×(1/6) + 4×(1/12) = 1，结合体内 1 个原子，晶胞均占 N=2。',
          importance: 'gaokao' as const,
        },
        {
          text: '【六方晶胞体积陷阱】Mg 属于六方最密堆积 (HCP)，平行六面体晶胞底面为 60°/120° 菱形，高为 c。晶胞体积 V = (√3/2)a²c × 10⁻³⁰ cm³（理想 c/a = √(8/3) ≈ 1.633），高考推导表达式切勿错误写成立方体 a³！',
          importance: 'core' as const,
        },
        {
          text: '【理想高宽比与配位数】理想六方最密堆积高宽比 c/a = √(8/3) ≈ 1.633，配位数为 12，空间利用率 74%。',
          importance: 'hard' as const,
        },
      ]
    case 'co2':
      return [
        basePoint,
        {
          text: '【干冰 CO₂ 分子晶体】顶点(8×1/8) + 面心(6×1/2)，晶胞含 4 个 CO₂ 分子 (Z=4)。晶格节点上为 O=C=O 直线型分子，分子间靠范德华力结合（无化学键连接杆）。',
          importance: 'gaokao' as const,
        },
        {
          text: '【分子晶体配位数】每个 CO₂ 分子周围紧邻且等距的 CO₂ 分子数为 12 (同面 4 个 + 上下层各 4 个)。',
          importance: 'hard' as const,
        },
        {
          text: '【利用率与 74% 的辨析】干冰晶胞虽为面心立方点阵，但节点为 O=C=O 三原子分子而非单原子硬球。基于分子有效范德华半径 (r_vdW ≈ 189 pm) 计算的空间利用率为 65.50%，切勿误填单原子 FCC 最密堆积的理论极限 74%！',
          importance: 'hard' as const,
        },
      ]
    default:
      return [basePoint]
  }
}

export const unitCellFormulas = getUnitCellFormulas
export const unitCellExamPoints = getUnitCellExamPoints

