import type { ChemistryQuantity } from '../../chemistryQuantities'

export function buildElectrochemicalApplicationQuantities(
  params: Record<string, number>,
  time: number
): ChemistryQuantity[] {
  const current = params.current ?? 1.5 // 电流 A
  const c0 = params.c0 ?? 1.0 // 初始浓度 mol/L
  const mode = params.mode ?? 0 // 0: 盐桥原电池, 1: 膜电解池, 2: 串联池
  const membraneType = params.membraneType ?? 0 // 0: 阳离子膜, 1: 阴离子膜, 2: 质子膜

  // 法拉第常数 F ≈ 96485 C/mol
  const F = 96485
  const ne = parseFloat(((current * time * 50) / F).toFixed(4))

  let anodeMassDelta = 0
  let cathodeMassDelta = 0
  let pH = 7.0
  let anodeLabel = '阳(负)极质量变化 Δm'
  let cathodeLabel = '阴(正)极质量变化 Δm'

  if (mode === 0) {
    // 盐桥原电池 (Zn - Cu)
    anodeLabel = '池1负极 (Zn) 消耗 Δm'
    cathodeLabel = '池1正极 (Cu) 析出 Δm'
    anodeMassDelta = -parseFloat((ne * 0.5 * 65.38).toFixed(3))
    cathodeMassDelta = parseFloat((ne * 0.5 * 63.55).toFixed(3))
    pH = 7.0
  } else if (mode === 1) {
    // 膜电解池
    anodeLabel = membraneType === 0 ? '阳极 Cl₂ 释放量' : '阳极 O₂ 释放量'
    cathodeLabel = '阴极 H₂ 释放量'
    anodeMassDelta = parseFloat((ne * (membraneType === 0 ? 0.5 * 70.9 : 0.25 * 32)).toFixed(3))
    cathodeMassDelta = parseFloat((ne * 0.5 * 2.016).toFixed(3))

    if (membraneType === 0) {
      const cOH = Math.min(14, 1.0e-7 + ne * 0.5 * c0)
      pH = parseFloat((14 + Math.log10(Math.max(1e-7, cOH))).toFixed(2))
    } else if (membraneType === 1) {
      const cH = Math.min(14, 1.0e-7 + ne * 1.0 * c0)
      pH = parseFloat((Math.max(1.0, 7.0 - Math.log10(1 + cH * 10))).toFixed(2))
    } else {
      pH = 7.0
    }
  } else {
    // 串联池 (池1 Zn-Cu 原电池 驱动 池2 Cu-Zn 电解池)
    anodeLabel = '池1负极 (Zn) 溶解量'
    cathodeLabel = '池2阴极 (Cu) 镀层量'
    anodeMassDelta = -parseFloat((ne * 0.5 * 65.38).toFixed(3))
    cathodeMassDelta = parseFloat((ne * 0.5 * 63.55).toFixed(3))
    pH = 7.0
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
      label: anodeLabel,
      value: anodeMassDelta,
      unit: 'g',
      colorKey: 'electrodePotential',
      precision: 3,
    },
    {
      key: 'cathodeMassDelta',
      label: cathodeLabel,
      value: cathodeMassDelta,
      unit: 'g',
      colorKey: 'electrodePotential',
      precision: 3,
    },
    {
      key: 'current',
      label: '电路电流 I',
      value: current,
      unit: 'A',
      colorKey: 'current',
      precision: 1,
    },
    {
      key: 'pH',
      label: '溶液 pH',
      value: pH,
      unit: '',
      colorKey: 'ph',
      precision: 2,
    },
  ]
}

export const electrochemicalFormulas: Array<{
  name: string
  latex: string
  condition?: string
  note?: string
  level?: 'core' | 'important' | 'derived' | 'supplementary'
}> = [
  {
    name: '法拉第电解定律',
    latex: 'n(e^-) = \\frac{I \\cdot t}{F}',
    level: 'core',
    condition: 'F = 96485\\text{ C/mol}',
  },
  {
    name: 'Zn-Cu原电池负极反应',
    latex: '\\text{Zn} - 2e^- = \\text{Zn}^{2+}',
    level: 'core',
    condition: '负极发生氧化反应',
  },
  {
    name: 'Zn-Cu原电池正极反应',
    latex: '\\text{Cu}^{2+} + 2e^- = \\text{Cu}',
    level: 'core',
    condition: '正极发生还原反应',
  },
  {
    name: '阳离子膜电解总反应',
    latex: '2\\text{NaCl} + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{通电}} 2\\text{NaOH} + \\text{H}_2\\uparrow + \\text{Cl}_2\\uparrow',
    level: 'important',
    condition: '阳膜仅允许阳离子 Na⁺ 通过',
  },
  {
    name: '阴离子膜阳极水氧化反应',
    latex: '2\\text{H}_2\\text{O} - 4e^- = \\text{O}_2\\uparrow + 4\\text{H}^+',
    level: 'important',
    condition: '阴膜阻止阳离子，Cl⁻/SO₄²⁻ 穿膜',
  },
  {
    name: '串联电路电子守恒',
    latex: 'n(\\text{Zn})_{\\text{消耗}} = n(\\text{Cu})_{\\text{析出}} = \\frac{1}{2}n(e^-)',
    level: 'core',
    condition: '串联电路各电极转移电子数相等',
  },
]

export const electrochemicalExamPoints: Array<{
  text: string
  importance: 'gaokao' | 'hard' | 'core' | 'basic' | 'extend'
}> = [
  {
    text: '【电子与离子移动规律】“电子不下水，离子不上天”：外电路靠电子定向移动，内电路（溶液/盐桥）靠阴阳离子定向迁移。',
    importance: 'gaokao',
  },
  {
    text: '【电极名称判别】原电池看活泼性（负极氧化、正极还原）；电解池看外电源（阳极接正极氧化、阴极接负极还原）。',
    importance: 'gaokao',
  },
  {
    text: '【离子交换膜功能】阳离子膜允许 Na⁺/H⁺ 通过；阴离子膜允许 Cl⁻/SO₄²⁻ 通过；质子膜仅允许 H⁺ 通过。交换膜可用于高纯制备与分离。',
    importance: 'hard',
  },
  {
    text: '【串联多池计算】多池串联中，各池各电极上转移的电子物质的量 n(e⁻) 恒定相等，利用电子守恒一键连立求增重与气体生成量。',
    importance: 'gaokao',
  },
]
