import type { ChemistryQuantity } from '../../chemistryQuantities'
import { transferredElectronMoles, galvanicCellState } from '@/chemistry'

export function buildPrimaryCellQuantities(
  params: Record<string, number>,
  time: number
): ChemistryQuantity[] {
  const current = params.current ?? 1.5 // A
  const cellType = params.cellType ?? 0 // 0:单槽, 1:双槽盐桥, 2:氢氧燃料, 3:铅蓄电池
  // 注意：电解质类型（碱性/酸性）只影响中屏的离子标注与电极方程式，
  // 不影响量面板任何数值 —— 燃料电池两种介质下关键离子浓度同样几乎不变（见 @/chemistry/galvanicCell）。

  // 缩放放大，以便 0~10s 内能观察到质量与浓度显著变化
  const neRaw = transferredElectronMoles(current, time)
  const ne = parseFloat(neRaw.toFixed(4))

  // 与中右屏图表共用同一模型（@/chemistry/galvanicCell），禁止两处各写一份
  const state = galvanicCellState(cellType, neRaw)
  const anodeMassDelta = parseFloat(state.anodeMassDelta.toFixed(3))
  const cathodeMassDelta = parseFloat(state.cathodeMassDelta.toFixed(3))
  const voltage = state.voltage
  const mainIonConcentration = parseFloat(state.concentration.toFixed(3))

  return [
    {
      key: 'ne',
      label: '转移电子量 n(e⁻)',
      value: ne,
      unit: 'mol',
      colorKey: 'electronFlow',
      precision: 4,
    },
    {
      key: 'anodeMassDelta',
      label: '负极质量变化 Δm(负)',
      value: anodeMassDelta,
      unit: 'g',
      colorKey: 'electrodePotential',
      precision: 3,
    },
    {
      key: 'cathodeMassDelta',
      label: '正极质量变化 Δm(正)',
      value: cathodeMassDelta,
      unit: 'g',
      colorKey: 'electrodePotential',
      precision: 3,
    },
    {
      key: 'voltage',
      label: '输出电压 U',
      value: voltage,
      unit: 'V',
      colorKey: 'current',
      precision: 2,
    },
    {
      key: 'mainIonConcentration',
      // 燃料电池的关键物种是 OH⁻ / H⁺ 这类离子，而非「反应物」
      label: cellType === 2 ? '关键离子浓度 c(OH⁻/H⁺)' : '关键反应物浓度',
      value: mainIonConcentration,
      unit: 'mol/L',
      colorKey: 'concentration',
      precision: 3,
    },
  ]
}

export const primaryCellFormulas: Array<{
  name: string
  latex: string
  condition?: string
  note?: string
  level?: 'core' | 'important' | 'derived' | 'supplementary'
}> = [
  {
    name: '原电池基本工作原理',
    latex: '\\text{失电子(氧化)} \\xrightarrow{\\text{负极}} e^- \\xrightarrow{\\text{外电路}} \\text{正极(还原)}',
    level: 'core',
    condition: '化学能转化为电能',
  },
  {
    name: '经典Zn-Cu电池负极反应',
    latex: '\\text{Zn} - 2e^- = \\text{Zn}^{2+}',
    level: 'core',
    condition: '负极失电子氧化',
  },
  {
    name: '经典Zn-Cu电池正极反应',
    latex: '\\text{Cu}^{2+} + 2e^- = \\text{Cu}',
    level: 'core',
    condition: '正极得电子还原',
  },
  {
    name: '氢氧燃料电池(碱性)负极',
    latex: '2\\text{H}_2 + 4\\text{OH}^- - 4e^- = 4\\text{H}_2\\text{O}',
    level: 'important',
    condition: 'KOH介质环境',
  },
  {
    name: '氢氧燃料电池(碱性)正极',
    latex: '\\text{O}_2 + 2\\text{H}_2\\text{O} + 4e^- = 4\\text{OH}^-',
    level: 'important',
    condition: 'OH⁻向负极迁移',
  },
  {
    name: '铅蓄电池放电负极反应',
    latex: '\\text{Pb} + \\text{SO}_4^{2-} - 2e^- = \\text{PbSO}_4\\downarrow',
    level: 'important',
    condition: '负极增重96g/mol',
  },
  {
    name: '铅蓄电池放电正极反应',
    latex: '\\text{PbO}_2 + 4\\text{H}^+ + \\text{SO}_4^{2-} + 2e^- = \\text{PbSO}_4\\downarrow + 2\\text{H}_2\\text{O}',
    level: 'important',
    condition: '正极增重64g/mol',
  },
]

export const primaryCellExamPoints: Array<{
  text: string
  importance: 'gaokao' | 'hard' | 'core' | 'basic' | 'extend'
}> = [
  {
    text: '【电极判定与电子流向】负极失电子发生氧化反应，外电路电子流出；正极得电子发生还原反应，外电路电子流入。',
    importance: 'gaokao',
  },
  {
    text: '【内电路离子迁移口诀】“阳正阴负”：溶液或盐桥中的阳离子移向正极，阴离子移向负极。',
    importance: 'gaokao',
  },
  {
    text: '【盐桥原电池优势】盐桥（如 KCl 琼脂）避免活泼金属电极与氧化性溶液直接接触，消除了界面电位并显著提升能量转换效率。',
    importance: 'hard',
  },
  {
    text: '【燃料电池方程式书写】根据电解质介质环境判断：酸性介质中不可出现 OH⁻；碱性介质中不可出现 H⁺。',
    importance: 'gaokao',
  },
  {
    text: '【铅蓄电池放电规律】放电时两极均生成 PbSO₄ 沉淀致两极质量均增加，同时消耗 H₂SO₄ 使溶液浓度减小、pH 升高。',
    importance: 'gaokao',
  },
]
