import type { ChemistryQuantity } from '../../chemistryQuantities'
import { CRYSTAL_DATABASE } from '../../../features/structure/unit-cell-calculation/data/unitCellData'

const CRYSTAL_TYPE_KEYS = ['nacl', 'cscl', 'fcc-cu', 'bcc-fe', 'diamond']
const NA = 6.02214076e23

export function buildUnitCellQuantities(
  params: Record<string, number>,
): ChemistryQuantity[] {
  const rawType = params.crystalType ?? 0
  const typeIdx = typeof rawType === 'number' ? Math.min(Math.max(0, Math.floor(rawType)), 4) : 0
  const crystalTypeId = CRYSTAL_TYPE_KEYS[typeIdx] || 'nacl'
  const crystalData = CRYSTAL_DATABASE[crystalTypeId] || CRYSTAL_DATABASE.nacl
  const edgeLength = params.edgeLength ?? crystalData.defaultA
  const molarMass = params.molarMass ?? crystalData.molarMass

  const zValue = crystalData.zValue
  const mCell = (zValue * molarMass) / NA
  const vCell = Math.pow(edgeLength * 1e-10, 3)
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

export const unitCellFormulas = [
  {
    name: '晶胞密度计算核心公式',
    latex: '\\rho = \\frac{N \\cdot M}{N_A \\cdot V_{\\text{cell}}} = \\frac{N \\cdot M}{N_A \\cdot a^3 \\cdot 10^{-30}}',
    level: 'core' as const,
    condition: '边长 a 单位为 pm 时 (1 pm = 10⁻¹⁰ cm)',
  },
  {
    name: '均摊法计算公式',
    latex: 'N = N_{\\text{顶}} \\times \\frac{1}{8} + N_{\\text{棱}} \\times \\frac{1}{4} + N_{\\text{面}} \\times \\frac{1}{2} + N_{\\text{体}} \\times 1',
    level: 'core' as const,
    condition: '立方晶胞通用',
  },
  {
    name: '空间利用率公式',
    latex: '\\eta = \\frac{V_{\\text{原子}}} {V_{\\text{晶胞}}} \\times 100\\%',
    level: 'important' as const,
  },
]

export const unitCellExamPoints = [
  {
    text: '【单位换算陷阱】高考计算晶胞密度时，若边长以 pm 为单位，必须先乘以 10⁻¹⁰ 转换为 cm！体积为 (a × 10⁻¹⁰)³ cm³ = a³ × 10⁻³⁰ cm³。',
    importance: 'gaokao' as const,
  },
  {
    text: '【均摊法法则】顶点原子由 8 个晶胞共享(1/8)；棱心原子由 4 个晶胞共享(1/4)；面心原子由 2 个晶胞共享(1/2)；体心原子独占(1)。',
    importance: 'gaokao' as const,
  },
  {
    text: '【典型晶胞均占数 N】NaCl 晶胞 N=4；CsCl 晶胞 N=1；Cu (FCC) 晶胞 N=4；α-Fe (BCC) 晶胞 N=2；金刚石 C 晶胞 N=8。',
    importance: 'hard' as const,
  },
]
