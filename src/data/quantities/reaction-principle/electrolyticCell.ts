import type { ChemistryQuantity } from '../../chemistryQuantities'

export function buildElectrolyticCellQuantities(
  params: Record<string, number>,
  time: number
): ChemistryQuantity[] {
  const current = params.current ?? 1.5 // A
  const cellType = params.cellType ?? 0 // 0:CuCl2, 1:CuSO4, 2:NaCl, 3:Cu精炼, 4:Al2O3
  const anodeMaterial = params.anodeMaterial ?? 0 // 0: 惰性(石墨), 1: 活性(铜)

  const F = 96485
  // 缩放放大，以便 0~10s 内能观察到质量与浓度显著变化
  const ne = parseFloat(((current * time * 50) / F).toFixed(4))

  let anodeMassDelta = 0
  let cathodeMassDelta = 0
  let gasVolumeAnode = 0
  let gasVolumeCathode = 0
  let cellpH = 7.0

  if (cellType === 0) {
    // 0: CuCl2 (惰性)
    anodeMassDelta = 0
    cathodeMassDelta = parseFloat((ne * 0.5 * 63.55).toFixed(3))
    gasVolumeAnode = parseFloat((ne * 0.5 * 22.4).toFixed(3))
    gasVolumeCathode = 0
    cellpH = 7.0
  } else if (cellType === 1) {
    // 1: CuSO4
    if (anodeMaterial === 0) {
      // 惰性 C: 阳极放氧
      anodeMassDelta = 0
      gasVolumeAnode = parseFloat((ne * 0.25 * 22.4).toFixed(3))
      cathodeMassDelta = parseFloat((ne * 0.5 * 63.55).toFixed(3))
      cellpH = Math.max(1.0, parseFloat((7.0 - ne * 2.5).toFixed(2)))
    } else {
      // 活性 Cu 电极
      anodeMassDelta = -parseFloat((ne * 0.5 * 63.55).toFixed(3))
      cathodeMassDelta = parseFloat((ne * 0.5 * 63.55).toFixed(3))
      gasVolumeAnode = 0
      gasVolumeCathode = 0
      cellpH = 7.0
    }
  } else if (cellType === 2) {
    // 2: 饱和食盐水 (氯碱)
    anodeMassDelta = 0
    cathodeMassDelta = 0
    gasVolumeAnode = parseFloat((ne * 0.5 * 22.4).toFixed(3))
    gasVolumeCathode = parseFloat((ne * 0.5 * 22.4).toFixed(3))
    cellpH = Math.min(13.8, parseFloat((7.0 + ne * 3.0).toFixed(2)))
  } else if (cellType === 3) {
    // 3: 粗铜精炼
    anodeMassDelta = -parseFloat((ne * 0.5 * 63.55 * 1.05).toFixed(3))
    cathodeMassDelta = parseFloat((ne * 0.5 * 63.55).toFixed(3))
    gasVolumeAnode = 0
    gasVolumeCathode = 0
    cellpH = 4.5
  } else {
    // 4: 熔融 Al2O3
    anodeMassDelta = -parseFloat((ne * 0.25 * 12.0).toFixed(3))
    cathodeMassDelta = parseFloat((ne * (1 / 3) * 27.0).toFixed(3))
    gasVolumeAnode = parseFloat((ne * 0.25 * 22.4).toFixed(3))
    gasVolumeCathode = 0
    cellpH = 7.0
  }

  return [
    {
      key: 'ne',
      label: '转移电子数 n(e⁻)',
      value: ne,
      unit: 'mol',
      colorKey: 'electronFlow',
      precision: 4,
    },
    {
      key: 'anodeMassDelta',
      label: '阳极质量变化 Δm(阳)',
      value: anodeMassDelta,
      unit: 'g',
      colorKey: 'anode',
      precision: 3,
    },
    {
      key: 'cathodeMassDelta',
      label: '阴极质量变化 Δm(阴)',
      value: cathodeMassDelta,
      unit: 'g',
      colorKey: 'cathode',
      precision: 3,
    },
    {
      key: 'gasVolumeAnode',
      label: '阳极气体体积 V(阳)',
      value: gasVolumeAnode,
      unit: 'L',
      colorKey: 'concentration',
      precision: 3,
    },
    {
      key: 'gasVolumeCathode',
      label: '阴极气体体积 V(阴)',
      value: gasVolumeCathode,
      unit: 'L',
      colorKey: 'concentration',
      precision: 3,
    },
    {
      key: 'cellpH',
      label: '溶液 pH 动态值',
      value: cellpH,
      unit: '',
      colorKey: 'pH',
      precision: 2,
    },
  ]
}

export const electrolyticCellFormulas: Array<{
  name: string
  latex: string
  condition?: string
  note?: string
  level?: 'core' | 'important' | 'derived' | 'supplementary'
}> = [
  {
    name: '电解池核心原理',
    latex: '\\text{电源(+)} \\rightarrow \\text{阳极(氧化)} \\mid \\text{阴极(还原)} \\leftarrow \\text{电源(-)}',
    level: 'core',
    condition: '电能转化为化学能',
  },
  {
    name: '惰性电极放电顺序(阳极失电子)',
    latex: '\\text{S}^{2-} > \\text{I}^- > \\text{Br}^- > \\text{Cl}^- > \\text{OH}^- > \\text{含氧酸根}',
    level: 'core',
    condition: '惰性石墨/铂电极',
  },
  {
    name: '阴极得电子放电顺序',
    latex: '\\text{Ag}^+ > \\text{Fe}^{3+} > \\text{Cu}^{2+} > \\text{H}^+(\\text{酸}) > \\text{Fe}^{2+} > \\text{H}^+(\\text{水}) > \\text{Na}^+',
    level: 'core',
    condition: '水溶液中阳离子',
  },
  {
    name: '电解 CuCl₂ 总反应',
    latex: '\\text{CuCl}_2 \\xrightarrow{\\text{电解}} \\text{Cu} + \\text{Cl}_2\\uparrow',
    level: 'core',
    condition: '电解质溶质被电解',
  },
  {
    name: '电解 CuSO₄ 总反应(放氧生酸)',
    latex: '2\\text{CuSO}_4 + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{Cu} + \\text{O}_2\\uparrow + 2\\text{H}_2\\text{SO}_4',
    level: 'core',
    condition: '复原需加入 CuO',
  },
  {
    name: '氯碱工业总反应(放氢生碱)',
    latex: '2\\text{NaCl} + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{NaOH} + \\text{H}_2\\uparrow + \\text{Cl}_2\\uparrow',
    level: 'core',
    condition: '阳离子交换膜阳极区',
  },
  {
    name: '粗铜精炼阳极反应',
    latex: '\\text{Cu(粗)} - 2e^- = \\text{Cu}^{2+} \\quad (\\text{杂质Zn,Fe溶解,Au,Ag沉降})',
    level: 'important',
    condition: '阳极泥形成',
  },
  {
    name: '熔融 Al₂O₃ 电解炼铝',
    latex: '2\\text{Al}_2\\text{O}_3(\\text{熔融}) \\xrightarrow[\\text{冰晶石}]{\\text{电解}} 4\\text{Al} + 3\\text{O}_2\\uparrow',
    level: 'important',
    condition: '高温熔融电解',
  },
]

export const electrolyticCellExamPoints: Array<{
  text: string
  importance: 'gaokao' | 'hard' | 'core' | 'basic' | 'extend'
}> = [
  {
    text: '【电极命名与反应特征】阳极接电源正极失电子发生氧化反应；阴极接电源负极得电子发生还原反应。',
    importance: 'gaokao',
  },
  {
    text: '【内电路离子定向移动口诀】“阳朝阴，阴朝阳”：阳离子向阴极移动，阴离子向阳极移动。',
    importance: 'gaokao',
  },
  {
    text: '【活性电极陷阱】当阳极材料为 Cu、Ag、Fe 等活性电极时，电极本身先失电子溶解，溶液中阴离子不放电。',
    importance: 'gaokao',
  },
  {
    text: '【电解溶液复原原则】“出什么加什么”：电解 CuSO₄ 析出 Cu 和 O₂，需加入 CuO (或 CuCO₃) 复原，不可加 Cu(OH)₂。',
    importance: 'gaokao',
  },
  {
    text: '【离子交换膜作用】氯碱工业使用阳离子交换膜，只允许 Na⁺ 穿过，阻止 Cl⁻ 和 OH⁻ 混合，确保生成高纯度 NaOH 并防止 Cl₂ 与 H₂ 爆炸。',
    importance: 'hard',
  },
]
