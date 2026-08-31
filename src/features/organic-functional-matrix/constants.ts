import type {
  FunctionalGroupItem,
  GaokaoClueItem,
  PresetMoleculeDetail,
  ProtectionGroupItem,
  PolymerizationMatrixItem,
} from './types'

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
    qualitativeFeatures: {
      silverOrFehling: '不反应',
      kmno4: '紫红色褪去 (氧化断键)',
      gasOutput: '无气体',
      reactionTypes: ['加成反应', '加氢还原', '氧化反应', '加聚反应'],
    },
    spectroscopy: {
      ir: '1620~1680 cm⁻¹ (C=C 伸缩振动)；3010~3090 cm⁻¹ (=C-H 伸缩振动)',
      hnmr: '烯氢 =C-H 化学位移 δ = 4.5~6.5 ppm；相邻氢存在顺/反偶合裂分 (J_trans > J_cis)',
    },
    notes: '与 Br₂ 是 1:1 加成；与酸性 KMnO₄ 反应时，末端 =CH₂ 氧化为 CO₂，=CHR 氧化为 -COOH，=CR₂ 氧化为酮。',
  },
  {
    id: 'alkyne-c#c',
    name: '碳碳三键 (C≡C)',
    formula: '-C\\equiv C-',
    structureSvg: 'C#C',
    category: 'hydrocarbon-derivative',
    testReagents: ['溴水', '酸性 KMnO₄ 溶液', '硝酸银氨溶液 (末端炔)'],
    testPhenomenon: '溴水褪色；酸性 KMnO₄ 紫红色褪去；末端炔生成黄色/灰色炔银沉淀',
    testEquation: 'CH\\equiv CH + 2Br_2 \\rightarrow CHBr_2-CHBr_2',
    consumptions: {
      Na: 0,
      NaOH: 0,
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 2, // 1:2 加成
      H2: 2, // 1:2 加氢还原
    },
    qualitativeFeatures: {
      silverOrFehling: '末端炔可形成炔银沉淀 (R-C≡CAg↓)',
      kmno4: '紫红色褪去 (氧化断键生成酸或 CO₂)',
      gasOutput: '无气体',
      reactionTypes: ['分步加成', '加氢还原', '氧化断键'],
    },
    spectroscopy: {
      ir: '2100~2260 cm⁻¹ (C≡C 伸缩振动，对称内炔信号较弱)；约 3300 cm⁻¹ (≡C-H 尖锐特征峰)',
      hnmr: '末端炔氢 ≡C-H 化学位移 δ = 1.8~3.1 ppm (受各向异性磁屏蔽影响)',
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
    qualitativeFeatures: {
      silverOrFehling: '不反应',
      kmno4: '伯醇/仲醇氧化褪色 (叔醇不反应)',
      gasOutput: '放 0.5 mol H₂',
      reactionTypes: ['置换反应', '催化氧化', '酯化反应', '分子内消去/分子间取代脱水'],
    },
    spectroscopy: {
      ir: '3200~3600 cm⁻¹ (强且宽的 O-H 缔合氢键伸缩振动)；1050~1150 cm⁻¹ (C-O 伸缩振动)',
      hnmr: '醇羟基氢 -OH 位移 δ = 0.5~5.0 ppm (常呈单峰，加 D₂O 发生活泼氢交换消失)',
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
      Na2CO3: 1, // 1 mol 酚-OH 消耗 1 mol Na2CO3 (反应生成 1 mol 酚钠 + 1 mol NaHCO3，不产生 CO2 气体)
      Br2: 3, // 苯酚与浓溴水邻对位 3 处发生取代反应 (消耗 3 mol Br2)
      H2: 0, // 酚羟基本身不加氢，苯环加 3 mol H2
    },
    qualitativeFeatures: {
      silverOrFehling: '不反应',
      kmno4: '易被空气/KMnO₄ 氧化显粉红/棕色',
      gasOutput: '与 Na 放 0.5 H₂；与 Na₂CO₃ 不出气',
      reactionTypes: ['弱酸中和', '邻对位取代 (耗3Br₂)', '显色反应', '偶联反应'],
    },
    spectroscopy: {
      ir: '3200~3500 cm⁻¹ (酚 O-H 伸缩振动)；1200~1250 cm⁻¹ (Ar-O 伸缩)；1450~1600 cm⁻¹ (苯环骨架振动)',
      hnmr: '酚羟基氢 Ar-OH 化学位移偏低场 δ = 4.0~7.5 ppm；苯环氢在 δ = 6.5~8.0 ppm',
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
    qualitativeFeatures: {
      silverOrFehling: '生成 2 mol Ag / 1 mol Cu₂O (甲醛 1 mol 产生 4 Ag)',
      kmno4: '紫红色迅速褪色 (氧化为羧基)',
      gasOutput: '无气体',
      reactionTypes: ['银镜反应', '斐林反应', '溴水氧化', '加氢还原'],
    },
    spectroscopy: {
      ir: '1720~1740 cm⁻¹ (强尖锐 C=O 伸缩振动)；2720 cm⁻¹ 与 2820 cm⁻¹ (费米共振双特征重峰，鉴别醛的关键)',
      hnmr: '醛基氢 -CHO 极度低场 δ = 9.5~10.5 ppm (极特征尖锐单峰)',
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
      Na2CO3: 0.5, // 1 mol -COOH 消耗 0.5 mol Na2CO3 产生 0.5 mol CO2
      Br2: 0,
      H2: 0, // 羧基中的羰基受羟基共轭影响极其稳定，通常催化加氢不发生还原
    },
    qualitativeFeatures: {
      silverOrFehling: '甲酸 HCOOH 可银镜 (含醛基)',
      kmno4: '一般不反应 (甲酸/草酸除外)',
      gasOutput: '遇 Na 放 0.5 H₂；遇 NaHCO₃ 放 1 CO₂',
      reactionTypes: ['酸碱中和', '脱水酯化', '放气反应', '缩聚脱水'],
    },
    spectroscopy: {
      ir: '2500~3300 cm⁻¹ (超宽二聚体 O-H 伸缩包络峰，常覆盖 C-H)；1710 cm⁻¹ (强 C=O 伸缩振动)',
      hnmr: '羧酸活泼氢 -COOH 处于极低场 δ = 10.5~12.5 ppm (宽单峰，加 D₂O 消失)',
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
    qualitativeFeatures: {
      silverOrFehling: '甲酸酯 HCOOR 可银镜',
      kmno4: '不反应',
      gasOutput: '无气体',
      reactionTypes: ['碱性水解 (耗1NaOH)', '酸性水解 (可逆)'],
    },
    spectroscopy: {
      ir: '1735~1750 cm⁻¹ (强 C=O 伸缩)；1150~1250 cm⁻¹ (强 C-O 伸缩)',
      hnmr: '酯基邻位氢 -CO-O-CH₂- 位移处于较弱低场 δ = 3.6~4.3 ppm',
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
    qualitativeFeatures: {
      silverOrFehling: '甲酸酚酯可银镜',
      kmno4: '水解前不反应，水解后产物酚可氧化',
      gasOutput: '无气体',
      reactionTypes: ['双重消耗碱性水解 (耗2NaOH)'],
    },
    spectroscopy: {
      ir: '1760~1780 cm⁻¹ (酚酯 C=O 比普通酯向高波数移动)；1180~1220 cm⁻¹ (Ar-O 振动)',
      hnmr: '水解前不显酚羟基活泼氢峰；苯环邻位质子受酯氧去屏蔽影响微移',
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
    qualitativeFeatures: {
      silverOrFehling: '水解酸化后加 AgNO₃ 出 AgX 沉淀',
      kmno4: '不反应',
      gasOutput: '无气体',
      reactionTypes: ['水溶液水解 (耗1NaOH)', '醇溶液消去'],
    },
    spectroscopy: {
      ir: 'C-Cl 约 600~800 cm⁻¹；C-Br 约 500~600 cm⁻¹ (指纹区)',
      hnmr: '卤素连结碳上的质子 -CH₂-X 化学位移处于中场 δ = 3.0~4.0 ppm',
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
    qualitativeFeatures: {
      silverOrFehling: '双缩脲反应显紫玫瑰色',
      kmno4: '不反应',
      gasOutput: '无气体',
      reactionTypes: ['碱性水解 (耗1NaOH)', '酸性水解 (耗1HCl)', '缩聚形成'],
    },
    spectroscopy: {
      ir: '酰胺Ⅰ带约 1650~1680 cm⁻¹ (C=O 伸缩)；酰胺Ⅱ带约 1530~1550 cm⁻¹ (N-H 弯曲)；3300 cm⁻¹ (N-H 伸缩)',
      hnmr: '酰胺质子 -CONH- 处于低场 δ = 5.5~8.5 ppm (宽峰，受四极矩弛豫及交换影响)',
    },
    notes: '蛋白质遇强酸、强碱、重金属盐、加热发生变性（不可逆）；遇饱和轻金属盐发生盐析（可逆）。',
  },
  {
    id: 'ketone-co',
    name: '酮羰基 (>C=O)',
    formula: '>C=O',
    structureSvg: '-C(=O)-',
    category: 'oxygen-containing',
    testReagents: ['催化加氢 (H₂ / Ni, 加热)'],
    testPhenomenon: '与 H₂ 催化加氢生成仲醇；完全不与银氨/新制Cu(OH)₂反应',
    testEquation: 'R-CO-R\' + H_2 \\xrightarrow{Ni, \\Delta} R-CH(OH)-R\'',
    consumptions: {
      Na: 0,
      NaOH: 0,
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 0,
      H2: 1, // 1 mol 酮羰基催化加氢消耗 1 mol H2
    },
    qualitativeFeatures: {
      silverOrFehling: '不发生银镜/斐林反应 (关键鉴别)',
      kmno4: '通常不被酸性 KMnO₄ 氧化',
      gasOutput: '无气体',
      reactionTypes: ['加氢还原为仲醇 (耗1H₂)', '亲核加成'],
    },
    spectroscopy: {
      ir: '1715 cm⁻¹ 强而尖锐的 C=O 伸缩振动；不具备 2720/2820 cm⁻¹ 醛费米共振双峰',
      hnmr: '酮羰基邻位甲基 -CO-CH₃ 化学位移特征单峰 δ = 2.1~2.3 ppm',
    },
    notes: '高考经典对比：酮羰基能加氢还原（耗 1 H₂），但无还原性（不能银镜/斐林反应）；而羧基与酯基中的羰基受共轭稳定通常不与 H₂ 加成！',
  },
  {
    id: 'amino-nh2',
    name: '氨基 (-NH₂)',
    formula: '-NH_2',
    structureSvg: '-NH_2',
    category: 'nitrogen-containing',
    testReagents: ['稀盐酸 / 湿润红色石蕊试纸', '亚硝酸 (重氮化)'],
    testPhenomenon: '与无机酸成盐，水溶液使湿润红色石蕊试纸变蓝',
    testEquation: 'R-NH_2 + HCl \\rightarrow R-NH_3^+Cl^-',
    consumptions: {
      Na: 0,
      NaOH: 0, // 氨基呈碱性，不与 NaOH 反应！
      NaHCO3: 0,
      Na2CO3: 0,
      Br2: 0,
      H2: 0,
    },
    qualitativeFeatures: {
      silverOrFehling: '不反应',
      kmno4: '易被强氧化剂氧化',
      gasOutput: '无气体',
      reactionTypes: ['弱碱成盐 (耗1HCl)', '酰胺化脱水', '亲核取代'],
    },
    spectroscopy: {
      ir: '3300~3500 cm⁻¹ 双峰 (伯胺 -NH₂ 对称与不对称伸缩振动)；1600 cm⁻¹ (N-H 弯曲振动)',
      hnmr: '氨基质子 -NH₂ 化学位移处于中低场 δ = 1.0~5.0 ppm (加 D₂O 交换消失)',
    },
    notes: '氨基酸两性原理：氨基具有碱性（与强酸 1:1 成盐），羧基具有酸性（与强碱 1:1 中和）。',
  },
]

export const PROTECTION_GROUPS: ProtectionGroupItem[] = [
  {
    id: 'phenol-benzyl-protect',
    name: '酚羟基的苄基化保护 (Bn-保护)',
    targetGroup: '酚羟基 (Ar-OH)',
    protectionReagent: '苄溴 (BnBr) + K₂CO₃ 弱碱',
    protectionEquation: 'Ar-OH + C_6H_5CH_2Br \\xrightarrow{K_2CO_3} Ar-O-CH_2C_6H_5 + HBr',
    deprotectionCondition: 'H₂ / Pd-C 催化氢解还原',
    deprotectionEquation: 'Ar-O-CH_2C_6H_5 + H_2 \\xrightarrow{Pd-C} Ar-OH + C_6H_5CH_3',
    examSignificance:
      '高考头号保护策略：防止酚羟基在后续的强氧化（如 KMnO₄）或格氏试剂/强碱性条件下发生副反应，合成后温和脱除。',
  },
  {
    id: 'amino-acetyl-protect',
    name: '氨基的乙酰化保护 (Ac-保护)',
    targetGroup: '芳香胺基 (Ar-NH₂)',
    protectionReagent: '乙酸酐 (Ac₂O) 或 乙酰氯',
    protectionEquation: 'Ar-NH_2 + (CH_3CO)_2O \\rightarrow Ar-NHCOCH_3 + CH_3COOH',
    deprotectionCondition: 'NaOH 溶液或稀盐酸加热水解',
    deprotectionEquation: 'Ar-NHCOCH_3 + NaOH \\xrightarrow{\\Delta} Ar-NH_2 + CH_3COONa',
    examSignificance:
      '苯胺硝化/卤代核心母题：苯胺直接硝化易被氧化破坏且生成多取代产物，通过乙酰化降低邻对位活化能力，定向对位取代后再水解脱保护。',
  },
  {
    id: 'carbonyl-acetal-protect',
    name: '醛/酮羰基的缩醛/缩酮保护',
    targetGroup: '醛/酮羰基 (>C=O / -CHO)',
    protectionReagent: '乙二醇 (HO-CH₂CH₂-OH) + 干燥酸催化',
    protectionEquation: 'R_2C=O + HO-CH_2CH_2-OH \\xrightarrow{H^+} R_2C\\langle_O^O\\rangle + H_2O',
    deprotectionCondition: '稀酸水溶液加热水解 (H₃O⁺ / Δ)',
    deprotectionEquation: 'R_2C\\langle_O^O\\rangle + H_2O \\xrightarrow{H^+, \\Delta} R_2C=O + HO-CH_2CH_2-OH',
    examSignificance:
      '防止羰基在格氏反应、LiAlH₄ 强还原其他羧酸酯基或强碱性烷基化过程中被优先加成破坏。',
  },
  {
    id: 'carboxyl-ester-protect',
    name: '羧基的甲酯/乙酯化保护',
    targetGroup: '羧基 (-COOH)',
    protectionReagent: '甲醇 (CH₃OH) + 浓硫酸催化加热',
    protectionEquation: 'R-COOH + CH_3OH \\xrightarrow{浓H_2SO_4, \\Delta} R-COOCH_3 + H_2O',
    deprotectionCondition: '稀 NaOH 加热水解后酸酸化',
    deprotectionEquation: 'R-COOCH_3 + NaOH \\xrightarrow{\\Delta} R-COONa + CH_3OH \\xrightarrow{H^+} R-COOH',
    examSignificance:
      '掩盖活泼酸性质子，防止羧基与有机金属试剂（如格氏试剂 RMgX）剧烈反应释放烷烃。',
  },
]

export const POLYMERIZATION_MODELS: PolymerizationMatrixItem[] = [
  {
    id: 'poly-pet',
    polymerName: '聚对苯二甲酸乙二醇酯 (PET, 涤纶)',
    category: 'condensation',
    monomers: [
      { name: '对苯二甲酸', formula: 'HOOC-C₆H₄-COOH', groups: ['二元羧酸 (-COOH × 2)'] },
      { name: '乙二醇', formula: 'HO-CH₂CH₂-OH', groups: ['二元醇 (-OH × 2)'] },
    ],
    reactionEquation: 'n HOOC-C_6H_4-COOH + n HO-CH_2CH_2-OH \\xrightarrow{催化剂, \\Delta} H-[O-CH_2CH_2O-OC-C_6H_4-CO]_n-OH + (2n-1) H_2O',
    smallMoleculeOutput: '生成 (2n - 1) mol H₂O',
    examPoints: '端基分析：两端分别保留 1 个 -OH 与 1 个 -COOH，脱去水分子摩尔数为 (2n - 1)。',
  },
  {
    id: 'poly-nylon-66',
    polymerName: '聚己二酰己二胺 (尼龙-66, 锦纶-66)',
    category: 'condensation',
    monomers: [
      { name: '己二酸', formula: 'HOOC-(CH₂)₄-COOH', groups: ['二元羧酸 (-COOH × 2)'] },
      { name: '己二胺', formula: 'H₂N-(CH₂)₆-NH₂', groups: ['二元伯胺 (-NH₂ × 2)'] },
    ],
    reactionEquation: 'n HOOC-(CH_2)_4-COOH + n H_2N-(CH_2)_6-NH_2 \\xrightarrow{\\Delta} H-[NH-(CH_2)_6-NHCO-(CH_2)_4-CO]_n-OH + (2n-1) H_2O',
    smallMoleculeOutput: '生成 (2n - 1) mol H₂O',
    examPoints: '形成肽键/酰胺键，主链含 6+6=12 碳链节，具有强极性与氢键作用。',
  },
  {
    id: 'poly-pla',
    polymerName: '聚乳酸 (PLA, 可生物降解材料)',
    category: 'condensation',
    monomers: [
      { name: '乳酸 (2-羟基丙酸)', formula: 'CH₃-CH(OH)-COOH', groups: ['羟基酸 (-OH + -COOH)'] },
    ],
    reactionEquation: 'n CH_3CH(OH)COOH \\xrightarrow{催化剂, \\Delta} H-[O-CH(CH_3)-CO]_n-OH + (n-1) H_2O',
    smallMoleculeOutput: '单体自缩聚生成 (n - 1) mol H₂O',
    examPoints: '单一单体羟基与羧基自缩聚脱去 (n - 1) 水，或两分子乳酸脱 2 水生成交酯再开环聚合。',
  },
  {
    id: 'poly-pe',
    polymerName: '聚乙烯 / 聚丙烯 / 聚苯乙烯 (烯烃加聚)',
    category: 'addition',
    monomers: [
      { name: '乙烯 / 单取代烯烃', formula: 'CH₂=CH-R', groups: ['碳碳双键 (C=C)'] },
    ],
    reactionEquation: 'n CH_2=CH-R \\xrightarrow{引发剂} -[CH_2-CH(R)]-_n-',
    smallMoleculeOutput: '0 (无小分子脱除)',
    examPoints: '加聚反应原子利用率 100%，生成物摩尔质量等于单体摩尔质量 × n。',
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
    id: 'formic-phenyl-ester',
    title: '甲酸苯酯母题',
    chemicalName: '甲酸苯酯 (HCOO-C₆H₅)',
    subtitle: '甲酸酯 + 酚酯 ➔ 银镜 + 耗 2 NaOH',
    structureFormula: 'HCOO-C₆H₅',
    counts: { 'phenol-ester': 1, 'aldehyde-cho': 1 },
    focusGroupId: 'phenol-ester',
    breakdownSummary: '发生银镜反应出 2 Ag；水解消耗 2 mol NaOH（生成甲酸钠 + 苯酚钠）',
    examAnalysis:
      '新高考超高频双重特性母题：分子中含有甲酸酯基（表现醛基性质，发生银镜反应出 2 mol Ag），同时属于酚酯，水解生成 1 mol 甲酸钠与 1 mol 苯酚钠，共消耗 2 mol NaOH；水解后的甲酸钠依然能发生银镜反应！',
    keyEquations: [
      'HCOO-C_6H_5 + 2[Ag(NH_3)_2]OH \\xrightarrow{\\Delta} NH_4O-COO-C_6H_5 + 2Ag\\downarrow + 3NH_3 + H_2O',
      'HCOO-C_6H_5 + 2NaOH \\xrightarrow{\\Delta} HCOONa + C_6H_5ONa + H_2O',
    ],
    examTraps:
      '高考特级推断题眼：“1 mol 酯水解消耗 2 mol NaOH，且水解产物均能发生银镜反应” ➔ 必为甲酸酚酯类异构体！',
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
    deductionTarget: '分子中含【醛基 -CHO 或甲酸酯基】',
    matchedGroupId: 'aldehyde-cho',
    principle: '1 mol -CHO 发生银镜反应生成 2 mol Ag，或与 2 mol Cu(OH)₂ 反应生成 1 mol Cu₂O 沉淀。',
  },
  {
    id: 'clue-ketone-vs-aldehyde',
    clueText: '能与 H₂ 加成还原为醇，但完全不能发生银镜反应，不被溴水氧化',
    deductionTarget: '分子中含【酮羰基 >C=O】',
    matchedGroupId: 'ketone-co',
    principle: '酮羰基可加氢还原为仲醇（耗 1 H₂），但无还原性，不发生银镜/斐林反应，与醛基鉴别极高频。',
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
  {
    id: 'clue-amino-base',
    clueText: '能与稀盐酸成盐，具有弱碱性，能与羧基发生缩合脱水',
    deductionTarget: '分子中含【氨基 -NH₂】',
    matchedGroupId: 'amino-nh2',
    principle: '氨基氮原子具有孤对电子，呈弱碱性，可与强酸 1:1 成盐；与羧酸发生酰胺化缩合生成肽键。',
  },
  {
    id: 'clue-ir-carbonyl',
    clueText: '红外光谱在 1700~1750 cm⁻¹ 处有强烈尖锐吸收峰，无 2500~3300 cm⁻¹ 宽包络峰',
    deductionTarget: '分子中含【羰基 (醛/酮/酯) 且非羧基】',
    matchedGroupId: 'ketone-co',
    principle: '1700~1750 cm⁻¹ 对应 C=O 双键极性伸缩振动；羧基特有的极宽氢键缔合峰缺席。',
  },
  {
    id: 'clue-nmr-chiral',
    clueText: '¹H-NMR 显示 4 组峰且面积比为 1:1:1:3，分子具有手性',
    deductionTarget: '含有【手性碳原子 *C】的非对称取代结构 (如乳酸或 2-氯丙酸)',
    matchedGroupId: 'carboxyl-cooh',
    principle: '手性碳原子连接 4 个不同基团，分子不存在对称面与对称中心，各质子化学环境均不相同。',
  },
]
