import type { ChemistryQuantity } from '../../chemistryQuantities'

interface IsomerSummary {
  name: string
  eqH: number
  ratio: string
  bp: number
  iupac: string
}

interface IsomerGroupSummary {
  name: string
  totalIsomers: number
  isomers: IsomerSummary[]
  formulaLatex: string
}

const ISOMER_DATA_SUMMARY: IsomerGroupSummary[] = [
  {
    name: '戊烷 (C₅H₁₂)',
    totalIsomers: 3,
    isomers: [
      { name: '正戊烷', eqH: 3, ratio: '6 : 4 : 2 (3:2:1)', bp: 36.1, iupac: '戊烷' },
      { name: '异戊烷', eqH: 4, ratio: '6 : 1 : 2 : 3', bp: 27.8, iupac: '2-甲基丁烷' },
      { name: '新戊烷', eqH: 1, ratio: '12 (全等组)', bp: 9.5, iupac: '2,2-二甲基丙烷' },
    ],
    formulaLatex: 'C_n H_{2n+2}',
  },
  {
    name: '丁醇 & 丁醚 (C₄H₁₀O)',
    totalIsomers: 7,
    isomers: [
      { name: '1-丁醇', eqH: 5, ratio: '1-OH (伯醇)', bp: 117.7, iupac: '丁-1-醇' },
      { name: '2-丁醇', eqH: 5, ratio: '手性碳原子 (仲醇)', bp: 99.5, iupac: '丁-2-醇' },
      { name: '异丁醇', eqH: 4, ratio: '2-甲基丙-1-醇 (伯醇)', bp: 108.0, iupac: '2-甲基丙-1-醇' },
      { name: '叔丁醇', eqH: 2, ratio: '2-甲基丙-2-醇 (9:1)', bp: 82.5, iupac: '2-甲基丙-2-醇' },
      { name: '二乙醚', eqH: 2, ratio: '对称醚 (CH₃CH₂OCH₂CH₃)', bp: 34.6, iupac: '乙氧基乙烷' },
      { name: '甲基丙基醚', eqH: 4, ratio: '不对称醚 (CH₃OCH₂CH₂CH₃)', bp: 38.8, iupac: '1-甲氧基丙烷' },
      { name: '甲基异丙基醚', eqH: 3, ratio: '支链醚 (CH₃OCH(CH₃)₂)', bp: 31.0, iupac: '2-甲氧基丙烷' },
    ],
    formulaLatex: 'C_n H_{2n+2} O',
  },
  {
    name: '羧酸 & 酯 (C₃H₆O₂)',
    totalIsomers: 4,
    isomers: [
      { name: '丙酸', eqH: 3, ratio: 'CH₃CH₂COOH (弱酸)', bp: 141.2, iupac: '丙酸' },
      { name: '甲酸乙酯', eqH: 3, ratio: 'HCOOCH₂CH₃ (能银镜)', bp: 54.0, iupac: '甲酸乙酯' },
      { name: '乙酸甲酯', eqH: 2, ratio: 'CH₃COOCH₃ (酯类)', bp: 56.9, iupac: '乙酸甲酯' },
      { name: '2-羟基丙醛', eqH: 4, ratio: 'HOCH₂CH₂CHO (羟基醛)', bp: 120.0, iupac: '3-羟基丙醛' },
    ],
    formulaLatex: 'C_n H_{2n} O_2',
  },
  {
    name: '芳香族 C₇H₈O (酚/醇/醚)',
    totalIsomers: 5,
    isomers: [
      { name: '邻甲酚', eqH: 5, ratio: '邻位酚羟基 (FeCl₃紫)', bp: 191.0, iupac: '2-甲基苯酚' },
      { name: '间甲酚', eqH: 5, ratio: '间位酚羟基 (FeCl₃紫)', bp: 202.0, iupac: '3-甲基苯酚' },
      { name: '对甲酚', eqH: 3, ratio: '对称位酚羟基 (FeCl₃紫)', bp: 201.9, iupac: '4-甲基苯酚' },
      { name: '苯甲醇', eqH: 4, ratio: '芳香醇 (C₆H₅CH₂OH)', bp: 205.0, iupac: '苯甲醇' },
      { name: '苯甲醚', eqH: 3, ratio: '芳香醚 (C₆H₅OCH₃)', bp: 154.0, iupac: '甲氧基苯' },
    ],
    formulaLatex: 'C_n H_{2n-6} O',
  },
  {
    name: '丁烯 & 环烷 (C₄H₈)',
    totalIsomers: 5,
    isomers: [
      { name: '1-丁烯', eqH: 4, ratio: 'CH₂=CH-CH₂-CH₃', bp: -6.3, iupac: '丁-1-烯' },
      { name: '顺-2-丁烯', eqH: 2, ratio: '顺式立体异构', bp: 3.7, iupac: '(Z)-丁-2-烯' },
      { name: '反-2-丁烯', eqH: 2, ratio: '反式立体异构', bp: 0.9, iupac: '(E)-丁-2-烯' },
      { name: '异丁烯', eqH: 2, ratio: 'CH₂=C(CH₃)₂', bp: -6.9, iupac: '2-甲基丙-1-烯' },
      { name: '环丁烷', eqH: 1, ratio: '对称环状饱和烃', bp: 12.5, iupac: '环丁烷' },
    ],
    formulaLatex: 'C_n H_{2n}',
  },
]

export function buildIsomerismQuantities(params: Record<string, number>): ChemistryQuantity[] {
  const isomerType = params.isomerType ?? 0
  const selectedIndex = params.selectedIndex ?? 0
  const group = ISOMER_DATA_SUMMARY[isomerType] || ISOMER_DATA_SUMMARY[0]
  const idx = Math.min(selectedIndex, group.isomers.length - 1)
  const currentIsomer = group.isomers[idx] || group.isomers[0]

  return [
    {
      key: 'formula',
      label: '分子体系',
      value: group.totalIsomers,
      unit: group.name,
      colorKey: 'concentration',
      precision: 0,
    },
    {
      key: 'isomerCount',
      label: '构造异构体数',
      value: group.totalIsomers,
      unit: '种',
      colorKey: 'temperature',
      precision: 0,
    },
    {
      key: 'equivalentH',
      label: '等效氢种类',
      value: currentIsomer.eqH,
      unit: '种',
      colorKey: 'reactionRate',
      precision: 0,
    },
    {
      key: 'boilingPoint',
      label: '沸点/预测沸点',
      value: currentIsomer.bp,
      unit: '°C',
      colorKey: 'equilibriumConstant',
      precision: 1,
    },
  ]
}

export const isomerismFormulas = [
  {
    name: '高考基团秒杀法则',
    latex: '-\\text{C}_3\\text{H}_7 (2\\text{种}) \\quad -\\text{C}_4\\text{H}_9 (4\\text{种}) \\quad -\\text{C}_5\\text{H}_{11} (8\\text{种})',
    level: 'core' as const,
    condition: '丙基2种、丁基4种、戊基8种；极速推导一取代物与衍生物',
  },
  {
    name: '一取代物与基团同构等效律',
    latex: '\\text{一取代物种类} = \\text{连接基团的同分异构体数目}',
    level: 'core' as const,
    condition: '如 C₄H₉-Cl、C₄H₉-OH、C₄H₉-CHO、R-COOH 均为 4 种',
  },
  {
    name: '官能团类别异构通式',
    latex: '\\text{醇/醚: } C_n H_{2n+2} O \\quad \\text{酸/酯: } C_n H_{2n} O_2',
    level: 'core' as const,
    condition: '相同分子式由于官能团不同产生的构造异构',
  },
  {
    name: 'IUPAC 系统命名原则',
    latex: '\\text{主链最长} + \\text{支链位次最小}',
    level: 'core' as const,
    condition: '选取最长碳链为主链，从靠近支链一端编号使取代基位次最小',
  },
]

export const isomerismExamPoints = [
  {
    text: '【同分异构体书写口诀】主链由长到短、支链由整到散、位置由中心到边缘、排布对称防重复。书写时遵循“有序思维”避免遗漏或重复。',
    importance: 'gaokao' as const,
  },
  {
    text: '【等效氢判断法】同一碳原子上的氢等效；同一碳原子所连甲基上的氢等效；镜像对称位置上的氢等效。等效氢种类数 = 一取代物种类数 = 核磁共振氢谱峰组数。',
    importance: 'gaokao' as const,
  },
  {
    text: '【烷烃沸点规律】碳原子数相同时，支链越多分子间作用力越弱，沸点越低（新戊烷 < 异戊烷 < 正戊烷）；碳原子数越多，沸点越高。',
    importance: 'gaokao' as const,
  },
  {
    text: '【芳香族 C₇H₈O 异构】C₇H₈O 共有 5 种异构体：3 种酚（邻/间/对甲酚，能与 FeCl₃ 显紫色）、1 种芳香醇（苯甲醇）、1 种芳香醚（苯甲醚）。高考极高频！',
    importance: 'hard' as const,
  },
]

