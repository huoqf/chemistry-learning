import type { FunctionalGroupItem } from './types'

export const FUNCTIONAL_GROUPS: FunctionalGroupItem[] = [
  {
    id: 'alkene-c=c',
    name: '碳碳双键 (C=C)',
    formula: '-C=C-',
    structureSvg: 'C=C',
    category: 'hydrocarbon-derivative',
    testReagents: ['溴水 (或 溴的 CCl₄ 溶液)', '酸性 KMnO₄ 溶液'],
    testPhenomenon: '溴水橙红色褪去；酸性 KMnO₄ 紫红色褪去',
    testEquation: 'CH_2=CH_2 + Br_2 \\rightarrow CH_2Br-CH_2Br',
    consumptions: {
      Na: 0,
      NaOH: 0,
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 1, // 1:1 加成
      H2: 1, // 1:1 加氢还原
    },
    notes: '与 Br₂ 是 1:1 加成；与酸性 KMnO₄ 反应时，末端 =CH₂ 氧化为 CO₂，=CHR 氧化为 -COOH，=CR₂ 氧化为酮。',
  },
  {
    id: 'alkyne-c#c',
    name: '碳碳三键 (C≡C)',
    formula: '-C\\equiv C-',
    structureSvg: 'C#C',
    category: 'hydrocarbon-derivative',
    testReagents: ['溴水', '酸性 KMnO₄ 溶液'],
    testPhenomenon: '溴水褪色；酸性 KMnO₄ 紫红色褪去',
    testEquation: 'CH\\equiv CH + 2Br_2 \\rightarrow CHBr_2-CHBr_2',
    consumptions: {
      Na: 0,
      NaOH: 0,
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 2, // 1:2 加成
      H2: 2, // 1:2 加氢还原
    },
    notes: '1 mol 碳碳三键可与 2 mol Br₂ 或 2 mol H₂ 发生完全加成反应。',
  },
  {
    id: 'alcohol-oh',
    name: '醇羟基 (醇 -OH)',
    formula: '-OH (醇)',
    structureSvg: '-OH',
    category: 'oxygen-containing',
    testReagents: ['金属钠 (Na)', '重铬酸钾 / 酸性高锰酸钾'],
    testPhenomenon: '投入金属钠有无色气泡 (H₂) 缓慢产生；酸性重铬酸钾由橙变绿',
    testEquation: '2R-OH + 2Na \\rightarrow 2R-ONa + H_2\\uparrow',
    consumptions: {
      Na: 1, // 1 mol -OH 消耗 1 mol Na，产生 0.5 mol H2
      NaOH: 0, // 醇不与 NaOH 反应！
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 0,
      H2: 0,
    },
    notes: '高考必考陷阱：醇羟基只与 Na 反应（产生 H₂），绝对不与 NaOH、Na₂CO₃、NaHCO₃ 反应！',
  },
  {
    id: 'phenol-oh',
    name: '酚羟基 (酚 -OH)',
    formula: '-OH (酚)',
    structureSvg: 'Ar-OH',
    category: 'oxygen-containing',
    testReagents: ['FeCl₃ 溶液', '浓溴水'],
    testPhenomenon: '滴加 FeCl₃ 溶液显紫色；滴加浓溴水产生三溴苯酚白色沉淀',
    testEquation: 'C_6H_5OH + 3Br_2 \\rightarrow C_6H_2Br_3OH\\downarrow + 3HBr',
    consumptions: {
      Na: 1, // 1 mol 酚-OH 消耗 1 mol Na
      NaOH: 1, // 1 mol 酚-OH 消耗 1 mol NaOH (弱酸性中和)
      NaHCO3: 0, // 酚不与 NaHCO3 反应！
      Na2CO3: 0.5, // 1 mol 酚-OH 消耗 0.5 mol Na2CO3 (转化为 NaHCO3，不产生 CO2)
      Br2: 3, // 苯酚与浓溴水邻对位 3 处发生取代反应 (消耗 3 mol Br2)
      H2: 0, // 酚羟基本身不加氢，苯环加 3 mol H2
    },
    notes: '酸性：R-COOH > H₂CO₃ > C₆H₅OH > HCO₃⁻ > R-OH。因此酚羟基与 NaOH、Na₂CO₃ 反应，但不与 NaHCO₃ 反应且不释放 CO₂ 气体！',
  },
  {
    id: 'aldehyde-cho',
    name: '醛基 (-CHO)',
    formula: '-CHO',
    structureSvg: '-CH=O',
    category: 'oxygen-containing',
    testReagents: ['银氨溶液 (水浴加热)', '新制 Cu(OH)₂ 悬浊液 (加热煮沸)'],
    testPhenomenon: '产生光亮银镜；生成砖红色 Cu₂O 沉淀',
    testEquation: 'R-CHO + 2[Ag(NH_3)_2]OH \\xrightarrow{\\Delta} R-COONH_4 + 2Ag\\downarrow + 3NH_3 + H_2O',
    consumptions: {
      Na: 0,
      NaOH: 0,
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 1, // 醛基被溴水氧化 (1 mol -CHO 消耗 1 mol Br2: R-CHO + Br2 + H2O -> R-COOH + 2HBr)
      H2: 1, // 1 mol -CHO 加氢还原为醇 (消耗 1 mol H2)
    },
    notes: '1 mol 醛基还原产生 2 mol Ag (甲醛 HCHO 相当于含 2 个醛基，1 mol HCHO 产生 4 mol Ag)；1 mol 醛基消耗 2 mol Cu(OH)₂ 产生 1 mol Cu₂O 沉淀。',
  },
  {
    id: 'carboxyl-cooh',
    name: '羧基 (-COOH)',
    formula: '-COOH',
    structureSvg: '-C(=O)OH',
    category: 'oxygen-containing',
    testReagents: ['紫色石蕊试液 / pH试纸', 'NaHCO₃ 溶液'],
    testPhenomenon: '使石蕊变红；与 NaHCO₃ 溶液反应剧烈产生大量气泡 (CO₂)',
    testEquation: 'R-COOH + NaHCO_3 \\rightarrow R-COONa + CO_2\\uparrow + H_2O',
    consumptions: {
      Na: 1, // 产生 0.5 mol H2
      NaOH: 1, // 酸碱中和 1:1
      NaHCO3: 1, // 产生 1 mol CO2
      Na2CO3: 0.5, // 1 mol -COOH 消耗 0.5 mol Na2CO3 产生 0.5 mol CO2 (或 2R-COOH + Na2CO3 -> 2R-COONa + CO2 + H2O)
      Br2: 0,
      H2: 0, // 羧基中的羰基受羟基共轭影响极其稳定，通常催化加氢不发生还原
    },
    notes: '高考快速鉴别羧基与其他弱酸性基团的黄金试剂：NaHCO₃ 溶液（仅 -COOH 能产生 CO₂ 气体，酚羟基不反应）。',
  },
  {
    id: 'ester-coor',
    name: '普通酯基 (-COOR)',
    formula: '-COOR',
    structureSvg: '-C(=O)O-R',
    category: 'oxygen-containing',
    testReagents: ['NaOH 溶液 (加热水解)'],
    testPhenomenon: '加热后原有分层现象消失，气味发生改变',
    testEquation: 'R-COOR\' + NaOH \\xrightarrow{\\Delta} R-COONa + R\'-OH',
    consumptions: {
      Na: 0,
      NaOH: 1, // 1 mol 普通酯基水解消耗 1 mol NaOH
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 0,
      H2: 0,
    },
    notes: '普通醇酯水解消耗 1 mol NaOH；生成 1 mol 羧酸盐与 1 mol 醇。',
  },
  {
    id: 'phenol-ester',
    name: '酚酯基 (-COO-Ar)',
    formula: '-COO-C_6H_5',
    structureSvg: '-C(=O)O-Ar',
    category: 'oxygen-containing',
    testReagents: ['NaOH 溶液 (加热水解)'],
    testPhenomenon: '加热水解，产物加 FeCl₃ 显紫色',
    testEquation: 'R-COO-C_6H_5 + 2NaOH \\xrightarrow{\\Delta} R-COONa + C_6H_5ONa + H_2O',
    consumptions: {
      Na: 0,
      NaOH: 2, // 高考超高频：1 mol 酚酯水解生成 1 mol 羧酸盐 + 1 mol 酚钠，共消耗 2 mol NaOH！
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 0,
      H2: 0,
    },
    notes: '高考特级陷阱：酚酯水解生成羧酸与酚，两者均具备酸性，因此 1 mol 酚酯必须消耗 2 mol NaOH！',
  },
  {
    id: 'halo-halogen',
    name: '卤素原子 (-X, 卤代烃)',
    formula: '-X (Cl, Br, I)',
    structureSvg: '-X',
    category: 'hydrocarbon-derivative',
    testReagents: ['NaOH 溶液加热水解 + 稀 HNO₃ 酸化 + AgNO₃ 溶液'],
    testPhenomenon: '生成 AgX 白色/淡黄色/黄色沉淀',
    testEquation: 'R-X + NaOH \\xrightarrow{H_2O, \\Delta} R-OH + NaX',
    consumptions: {
      Na: 0,
      NaOH: 1, // 1 mol 卤代烃水解消耗 1 mol NaOH (若为卤代苯水解生成酚钠则消耗 2 mol NaOH)
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 0,
      H2: 0,
    },
    notes: '水解反应条件：NaOH 水溶液、加热；消去反应条件：NaOH 醇溶液、加热。检验卤素前必须先加稀 HNO₃ 酸化！',
  },
  {
    id: 'peptide-amide',
    name: '肽键 / 酰胺键 (-CONH-)',
    formula: '-CONH-',
    structureSvg: '-C(=O)NH-',
    category: 'nitrogen-containing',
    testReagents: ['双缩脲试剂 (碱性 CuSO₄ 溶液)'],
    testPhenomenon: '呈现特异性紫玫瑰色配位络合物',
    testEquation: 'R-CONH-R\' + NaOH \\xrightarrow{\\Delta} R-COONa + R\'-NH_2',
    consumptions: {
      Na: 0,
      NaOH: 1, // 1 mol 酰胺键水解消耗 1 mol NaOH (或酸性水解消耗 1 mol HCl)
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 0,
      H2: 0,
    },
    notes: '蛋白质遇强酸、强碱、重金属盐、加热发生变性（不可逆）；遇饱和轻金属盐发生盐析（可逆）。',
  },
]
