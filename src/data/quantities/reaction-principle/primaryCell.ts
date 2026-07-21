import type { ChemistryQuantity } from '../../chemistryQuantities'

export function buildPrimaryCellQuantities(
  params: Record<string, number>,
  time: number
): ChemistryQuantity[] {
  const current = params.current ?? 1.5 // A
  const cellType = params.cellType ?? 0 // 0:单槽, 1:双槽盐桥, 2:氢氧燃料, 3:铅蓄电池
  const electrolyteType = params.electrolyteType ?? 0 // 0: 碱性, 1: 酸性 (燃料电池)

  const F = 96485
  // 缩放放大，以便 0~10s 内能观察到质量与浓度显著变化
  const ne = parseFloat(((current * time * 50) / F).toFixed(4))

  let anodeMassDelta = 0
  let cathodeMassDelta = 0
  let voltage = 1.10
  let mainIonConcentration = 1.0

  if (cellType === 0) {
    // 经典单槽 Zn-Cu / H2SO4
    // 负极 Zn - 2e- = Zn2+: M(Zn)=65.38
    anodeMassDelta = -parseFloat((ne * 0.5 * 65.38).toFixed(3))
    // 正极 2H+ + 2e- = H2: 气体逸出，Cu电极质量不变
    cathodeMassDelta = 0
    voltage = 1.10
    // H+ 浓度由 1.0 消耗下降
    mainIonConcentration = Math.max(0.05, parseFloat((1.0 - ne * 0.5).toFixed(3)))
  } else if (cellType === 1) {
    // 双槽盐桥 Zn-Cu / ZnSO4-CuSO4
    // 负极 Zn - 2e- = Zn2+: Zn片溶解
    anodeMassDelta = -parseFloat((ne * 0.5 * 65.38).toFixed(3))
    // 正极 Cu2+ + 2e- = Cu: Cu片析出增重 M(Cu)=63.55
    cathodeMassDelta = parseFloat((ne * 0.5 * 63.55).toFixed(3))
    voltage = 1.10
    // CuSO4 溶液中 Cu2+ 浓度下降
    mainIonConcentration = Math.max(0.05, parseFloat((1.0 - ne * 0.5).toFixed(3)))
  } else if (cellType === 2) {
    // 氢氧燃料电池 H2 - O2
    // 多孔 Pt 电极，电极质量不变
    anodeMassDelta = 0
    cathodeMassDelta = 0
    voltage = 1.23
    if (electrolyteType === 0) {
      // 碱性 KOH: OH- 消耗与再生成，总浓度保持稳定
      mainIonConcentration = 1.0
    } else {
      // 酸性 H2SO4: 生成水使溶液稀释，c(H+) 稍有下降
      mainIonConcentration = Math.max(0.1, parseFloat((1.0 - ne * 0.1).toFixed(3)))
    }
  } else {
    // 铅蓄电池放电 Pb + PbO2 + 2H2SO4 = 2PbSO4 + 2H2O
    // 负极 Pb -> PbSO4: 1 mol Pb (207.2g) 转为 1 mol PbSO4 (303.3g), 增重 96.1g
    anodeMassDelta = parseFloat((ne * 0.5 * 96.1).toFixed(3))
    // 正极 PbO2 -> PbSO4: 1 mol PbO2 (239.2g) 转为 1 mol PbSO4 (303.3g), 增重 64.1g
    cathodeMassDelta = parseFloat((ne * 0.5 * 64.1).toFixed(3))
    voltage = 2.04
    // H2SO4 消耗，c(H2SO4) 下降
    mainIonConcentration = Math.max(0.1, parseFloat((1.0 - ne * 1.0).toFixed(3)))
  }

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
      label: '关键反应物浓度',
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
