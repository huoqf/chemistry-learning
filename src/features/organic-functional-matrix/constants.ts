import type { FunctionalGroupItem, GaokaoClueItem, PresetMoleculeDetail } from './types'

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

export const PRESET_MOLECULES: PresetMoleculeDetail[] = [
  {
    id: 'aspirin',
    title: '阿司匹林母题',
    chemicalName: '乙酰水杨酸 (C₉H₈O₄)',
    subtitle: '1 酚酯 + 1 羧基 ➔ 消耗 3 NaOH',
    structureFormula: 'o-(CH₃COO)-C₆H₄-COOH',
    counts: { 'phenol-ester': 1, 'carboxyl-cooh': 1 },
    focusGroupId: 'phenol-ester',
    breakdownSummary: '1 mol 阿司匹林水解消耗 3 mol NaOH、1 mol NaHCO₃、1 mol Na',
    examAnalysis:
      '高考头号母题：水解时酚酯键断开，生成 1 mol 乙酸和 1 mol 水杨酸（邻羟基苯甲酸）。水杨酸分子中同时含有 1 个 -COOH 和 1 个酚 -OH。因此水解产物总计含 2 个羧酸基团与 1 个酚羟基，3 处均呈酸性，故总计消耗 3 mol NaOH！',
    keyEquations: [
      'CH_3COO-C_6H_4-COOH + 3NaOH \\xrightarrow{\\Delta} CH_3COONa + NaO-C_6H_4-COONa + 2H_2O',
      'CH_3COO-C_6H_4-COOH + NaHCO_3 \\rightarrow CH_3COO-C_6H_4-COONa + CO_2\\uparrow + H_2O',
    ],
    examTraps:
      '易错点：① 水解前加入 FeCl₃ 不显紫色（酚羟基被乙酰化保护）；② 碱性水解后必须先加酸酸化，再滴入 FeCl₃ 才会显特异紫色；③ 与 NaHCO₃ 反应仅放出 1 mol CO₂。',
  },
  {
    id: 'ester-vs-phenol-ester',
    title: '普通酯 vs 酚酯',
    chemicalName: '双酯水解对比体系',
    subtitle: '1 普通醇酯 + 1 酚酯 ➔ 消耗 3 NaOH',
    structureFormula: 'R-COO-R\' 与 R-COO-Ar',
    counts: { 'ester-coor': 1, 'phenol-ester': 1 },
    focusGroupId: 'phenol-ester',
    breakdownSummary: '普通酯消耗 1 NaOH，酚酯消耗 2 NaOH，体系共消耗 3 mol NaOH',
    examAnalysis:
      '双酯水解对比是高考区分度极高的大题考点。普通醇酯水解生成的醇（R-OH）呈中性不与 NaOH 反应（消耗 1 NaOH）；而酚酯水解生成的酚（Ar-OH）具有弱酸性，必须与 NaOH 中和生成酚钠（消耗 2 NaOH）。',
    keyEquations: [
      'R-COOR\' + NaOH \\xrightarrow{\\Delta} R-COONa + R\'-OH',
      'R-COO-Ar + 2NaOH \\xrightarrow{\\Delta} R-COONa + Ar-ONa + H_2O',
    ],
    examTraps:
      '判别口诀：“水解看屁股”——看氧原子后面连的是烷基（醇酯耗 1 碱）还是苯环（酚酯耗 2 碱）。',
  },
  {
    id: 'alcohol-vs-phenol',
    title: '醇 vs 酚 对比',
    chemicalName: '羟基酸性梯度对比体系',
    subtitle: '1 醇-OH + 1 酚-OH ➔ 耗 2 Na / 1 NaOH',
    structureFormula: 'R-OH 与 Ar-OH',
    counts: { 'alcohol-oh': 1, 'phenol-oh': 1 },
    focusGroupId: 'phenol-oh',
    breakdownSummary: '与 Na 反应放 1 mol H₂；与 NaOH 反应仅酚反应耗 1 mol NaOH',
    examAnalysis:
      '醇羟基与酚羟基都含有极性 -O-H 键，均能被强还原剂金属钠置换放出氢气（2 个 -OH 共耗 2 Na 放 1 mol H₂）。但由于苯环对羟基的 p-π 共轭吸电子效应，使酚羟基氧氢键极性大大增强，具备弱酸性，能与 NaOH/Na₂CO₃ 反应；而醇羟基完全不具备酸性，遇 NaOH / 碳酸盐中立不反应。',
    keyEquations: [
      'R-OH + C_6H_5OH + 2Na \\rightarrow R-ONa + C_6H_5ONa + H_2\\uparrow',
      'C_6H_5OH + NaOH \\rightarrow C_6H_5ONa + H_2O',
      'C_6H_5OH + Na_2CO_3 \\rightarrow C_6H_5ONa + NaHCO_3',
    ],
    examTraps:
      '高考金牌考点：向苯酚钠溶液中通入 CO₂，无论过量还是少量，产物永远是 NaHCO₃ 与苯酚，绝对不可能生成 Na₂CO₃！',
  },
  {
    id: 'methyl-salicylate',
    title: '水杨酸甲酯',
    chemicalName: '邻羟基苯甲酸甲酯 (冬青油)',
    subtitle: '1 酚-OH + 1 醇酯 ➔ 消耗 2 NaOH / 1 Na',
    structureFormula: 'o-(OH)-C₆H₄-COOCH₃',
    counts: { 'phenol-oh': 1, 'ester-coor': 1 },
    focusGroupId: 'phenol-oh',
    breakdownSummary: '消耗 2 mol NaOH（酚中和 1 + 酯水解 1），消耗 1 mol Na 放 0.5 H₂',
    examAnalysis:
      '水杨酸甲酯分子内保留了游离的酚羟基，因此无需水解即可直接与 FeCl₃ 溶液发生特异紫色显色反应；与浓溴水反应在酚羟基邻对位发生溴代；水解时消耗 2 mol NaOH（酚羟基 1 mol + 甲酯水解 1 mol）。',
    keyEquations: [
      'o-(OH)-C_6H_4-COOCH_3 + 2NaOH \\xrightarrow{\\Delta} o-(ONa)-C_6H_4-COONa + CH_3OH + H_2O',
    ],
    examTraps:
      '对比阿司匹林：水杨酸甲酯直接加 FeCl₃ 显紫色（含游离酚-OH）；而阿司匹林直接加 FeCl₃ 不显紫色（酚羟基已被酯化）。',
  },
  {
    id: 'salicylaldehyde',
    title: '水杨醛分子',
    chemicalName: '邻羟基苯甲醛',
    subtitle: '1 酚-OH + 1 醛基 ➔ 银镜 + 显色 + 耗 3 浓溴水',
    structureFormula: 'o-(OH)-C₆H₄-CHO',
    counts: { 'aldehyde-cho': 1, 'phenol-oh': 1 },
    focusGroupId: 'aldehyde-cho',
    breakdownSummary: '生成 2 mol Ag 银镜；消耗 3 mol 浓溴水（2 溴代取代 + 1 醛基氧化）',
    examAnalysis:
      '集酚类与醛类特异性于一身的高考明星分子。醛基部分可发生银镜反应产生 2 mol Ag 或生成 1 mol Cu₂O 沉淀；与浓溴水反应时，苯环邻对位发生 2 处取代，醛基被溴水氧化消耗 1 mol Br₂，总计消耗 3 mol Br₂。',
    keyEquations: [
      'o-(OH)-C_6H_4-CHO + 2[Ag(NH_3)_2]OH \\xrightarrow{\\Delta} o-(OH)-C_6H_4-COONH_4 + 2Ag\\downarrow + 3NH_3 + H_2O',
    ],
    examTraps:
      '定量计算陷阱：计算与浓溴水反应时，切勿漏掉醛基被溴水氧化的 1 mol Br₂！',
  },
  {
    id: 'comprehensive',
    title: '多官能团综合',
    chemicalName: '多官能团复合模型分子',
    subtitle: '1 双键 + 1 羧基 + 1 醇-OH ➔ 综合检验',
    structureFormula: 'CH₂=CH-CH(OH)-COOH',
    counts: { 'alkene-c=c': 1, 'carboxyl-cooh': 1, 'alcohol-oh': 1 },
    focusGroupId: 'carboxyl-cooh',
    breakdownSummary: '消耗 2 mol Na（放 1 H₂），消耗 1 mol NaHCO₃（放 1 CO₂），消耗 1 Br₂ 加成',
    examAnalysis:
      '常用于考察多官能团间的独立性与相互影响：双键专一性与 Br₂ / H₂ 加成；羧基专一性与 NaHCO₃ 反应冒气泡；醇羟基与羧基共同与 Na 反应放出氢气。',
    keyEquations: [
      'R-COOH + NaHCO_3 \\rightarrow R-COONa + CO_2\\uparrow + H_2O',
      'CH_2=CH-R + Br_2 \\rightarrow CH_2Br-CHBr-R',
    ],
    examTraps:
      '酸性鉴别金标准：遇到 NaHCO₃ 放出气体的只有羧基，醇羟基和双键均不产生干扰。',
  },
]

export const GAOKAO_CLUES: GaokaoClueItem[] = [
  {
    id: 'clue-co2',
    clueText: '与 NaHCO₃ 溶液反应剧烈产生大量气泡 (CO₂)',
    deductionTarget: '分子中必含【羧基 -COOH】',
    matchedGroupId: 'carboxyl-cooh',
    principle: '在常见含氧官能团中，只有羧基酸性强于 H₂CO₃，酚羟基与醇羟基均无法使 NaHCO₃ 放气。',
  },
  {
    id: 'clue-phenol-ester',
    clueText: '1 mol 该物质水解消耗 2 mol NaOH',
    deductionTarget: '分子中含【酚酯基 -COO-Ar】',
    matchedGroupId: 'phenol-ester',
    principle: '酚酯水解生成 1 mol 羧酸盐 + 1 mol 酚钠，产生两个酸性位点，故消耗 2 mol NaOH。',
  },
  {
    id: 'clue-fecl3',
    clueText: '滴加 FeCl₃ 溶液显特异性紫色 / 遇浓溴水生成白色沉淀',
    deductionTarget: '分子中含【酚羟基 酚 -OH】',
    matchedGroupId: 'phenol-oh',
    principle: '酚与 Fe³⁺ 配位显紫色；与浓溴水在酚羟基的邻对位发生多元取代生成三溴苯酚沉淀。',
  },
  {
    id: 'clue-silver-mirror',
    clueText: '与银氨溶液水浴加热出现光亮银镜 / 遇新制 Cu(OH)₂ 加热出砖红沉淀',
    deductionTarget: '分子中含【醛基 -CHO】',
    matchedGroupId: 'aldehyde-cho',
    principle: '1 mol -CHO 发生银镜反应生成 2 mol Ag，或与 2 mol Cu(OH)₂ 反应生成 1 mol Cu₂O 沉淀。',
  },
  {
    id: 'clue-na-only',
    clueText: '能与金属 Na 反应放 H₂，但完全不与 NaOH 溶液反应',
    deductionTarget: '分子中含【醇羟基 醇 -OH】',
    matchedGroupId: 'alcohol-oh',
    principle: '醇羟基具有微弱极性活泼氢可置换 Na，但无酸性，绝不与强碱中和。',
  },
  {
    id: 'clue-bromine-color',
    clueText: '能使溴水或酸性高锰酸钾紫红色褪去',
    deductionTarget: '分子中含【碳碳双键 C=C】或【碳碳三键 C≡C】',
    matchedGroupId: 'alkene-c=c',
    principle: '不饱和键发生加成反应使溴水褪色，或被酸性高锰酸钾强氧化剂氧化而褪色。',
  },
]

