/**
 * src/features/gas-chain/data/gasDecisionModels.ts
 * 母题六：气体制备/净化/尾气处理装置链 - 专项实验决策模型体系
 *
 * 涵盖：
 * 1. 四大发生装置全景模型与高考操作要点 (GENERATOR_APPARATUS_MODELS)
 * 2. 8 大高考高频净化除杂洗气模型 (PURIFICATION_RULES)
 * 3. 四大常见干燥剂相容性与禁忌矩阵 (DRYING_AGENT_MATRIX)
 * 4. 干燥剂交叉对比矩阵 (DRYING_CROSS_MATRIX)
 * 5. 启普发生器适用条件与判定矩阵 (KIPP_GENERATOR_RULES)
 * 6. 收集方法选择决策树与物理化学判据 (COLLECTION_DECISION_RULES)
 * 7. 6 大防倒吸装置与结构原理 (ANTI_SIPHON_MODELS)
 * 8. 高考大题装置气密性检验三大规范答题模板 (AIRTIGHTNESS_TEMPLATES)
 * 9. 高考尾气处理与无害化转化四大方法体系 (TAIL_GAS_TREATMENT_MODELS)
 */

/**
 * 专项矩阵 1：四大发生装置类型全景模型与高考操作要点
 */
export interface GeneratorApparatusModel {
  id: string
  name: string
  apparatus: string
  suitableReactions: { gas: string; equation: string; condition: string }[]
  keyOperations: string[]
  examTraps: string[]
}

export const GENERATOR_APPARATUS_MODELS: GeneratorApparatusModel[] = [
  {
    id: 'solid-heat',
    name: '固 + 固 加热型发生装置',
    apparatus: '大试管、酒精灯、铁架台 (带铁夹)、带单孔导管橡皮塞',
    suitableReactions: [
      {
        gas: 'O₂ (氧气)',
        equation: '2KMnO_4 \\xrightarrow{\\Delta} K_2MnO_4 + MnO_2 + O_2\\uparrow',
        condition: '试管口塞一团棉花',
      },
      {
        gas: 'NH₃ (氨气)',
        equation: '2NH_4Cl + Ca(OH)_2 \\xrightarrow{\\Delta} CaCl_2 + 2NH_3\\uparrow + 2H_2O',
        condition: '试管口略向下倾斜',
      },
      {
        gas: 'CH₄ (甲烷)',
        equation: 'CH_3COONa + NaOH \\xrightarrow[\\Delta]{CaO} Na_2CO_3 + CH_4\\uparrow',
        condition: '无水醋酸钠与碱石灰混合',
      },
    ],
    keyOperations: [
      '试管口必须略向下倾斜：防止固体中的结晶水或反应生成的水在管口冷凝后倒流回热的试管底部导致炸裂',
      '铁夹应夹在距试管口约 1/3 处 (中上部)，药品平铺于试管底部增大受热面积',
      '加热时先使酒精灯在试管下方均匀移动预热，然后固定在药品部位集中加热',
      '实验结束停机铁律 (排水法)：必须“先将导管移出水面，后熄灭酒精灯”，防止冷水倒吸炸裂热试管',
    ],
    examTraps: [
      '高锰酸钾制 O₂ 试管口必须塞一团棉花，防止 KMnO₄ 粉末随气流进入导管甚至水槽',
      '制 NH₃ 严禁使用硝酸铵 (受热易爆炸)，严禁使用硫酸铵 (酸式盐熔融腐蚀玻璃且生成硫酸氢盐)',
    ],
  },
  {
    id: 'liquid-heat',
    name: '固 + 液 / 液 + 液 加热型发生装置',
    apparatus: '圆底烧瓶 / 蒸馏烧瓶、分液漏斗、酒精灯、石棉网 / 陶土网、铁架台、碎瓷片',
    suitableReactions: [
      {
        gas: 'Cl₂ (氯气)',
        equation: 'MnO_2 + 4HCl(浓) \\xrightarrow{\\Delta} MnCl_2 + Cl_2\\uparrow + 2H_2O',
        condition: '浓盐酸分批滴加，需加热',
      },
      {
        gas: 'C₂H₄ (乙烯)',
        equation: 'CH_3CH_2OH \\xrightarrow[170^\\circ C]{浓H_2SO_4} CH_2=CH_2\\uparrow + H_2O',
        condition: '温度计水银球插入反应液中',
      },
      {
        gas: 'CO (一氧化碳)',
        equation: 'HCOOH \\xrightarrow[浓H_2SO_4]{\\Delta} CO\\uparrow + H_2O',
        condition: '甲酸脱水，微热',
      },
      {
        gas: 'HCl (氯化氢)',
        equation: 'NaCl(固) + H_2SO_4(浓) \\xrightarrow{\\Delta} NaHSO_4 + HCl\\uparrow',
        condition: '微热制备',
      },
    ],
    keyOperations: [
      '圆底烧瓶底部必须垫石棉网/陶土网加热，使烧瓶底部均匀受热，严禁直接火焰灼烧',
      '烧瓶内必须预先加入几粒碎瓷片 (或沸石) 以防液体剧烈暴沸；若忘记加，必须冷却后补加，严禁沸腾时直接投入',
      '分液漏斗滴液前先拔下上口玻璃塞 (或使塞上凹槽对准小孔)，使漏斗内外大气相通以顺利滴下',
      '烧瓶内盛装液体体积一般占容积的 1/3 ~ 1/2，最高不超过 2/3',
    ],
    examTraps: [
      '温度计水银球位置：制乙烯水银球必须浸入反应液中并迅速升温至 170℃；石油蒸馏水银球则位于支管口下沿',
      '浓硫酸与乙醇混合：先加乙醇后沿器壁缓慢注入浓硫酸并不断搅拌，切勿颠倒',
    ],
  },
  {
    id: 'liquid-noheat',
    name: '固 + 液 常温型发生装置 (简易可控型)',
    apparatus: '锥形瓶 / 广口瓶 / 平底烧瓶、分液漏斗 / 长颈漏斗 / 注射器',
    suitableReactions: [
      {
        gas: 'O₂ (双氧水催化)',
        equation: '2H_2O_2 \\xrightarrow{MnO_2} 2H_2O + O_2\\uparrow',
        condition: '常温迅速分解',
      },
      {
        gas: 'NO₂ / NO (氮氧化物)',
        equation: 'Cu + 4HNO_3(浓) = Cu(NO_3)_2 + 2NO_2\\uparrow + 2H_2O',
        condition: '常温剧烈反应',
      },
      {
        gas: 'SO₂ (二氧化硫)',
        equation: 'Na_2SO_3 + H_2SO_4(70\\%) = Na_2SO_4 + SO_2\\uparrow + H_2O',
        condition: '分液漏斗逐滴滴加',
      },
      {
        gas: 'C₂H₂ (乙炔)',
        equation: 'CaC_2 + 2H_2O \\rightarrow Ca(OH)_2 + C_2H_2\\uparrow',
        condition: '分液漏斗滴加饱和食盐水',
      },
    ],
    keyOperations: [
      '使用长颈漏斗时，下端管口必须伸入液面以下形成“液封”，防止生成的气体从漏斗口逸出',
      '使用分液漏斗无需管口插入液面以下，可通过调节活塞随时控制滴加速率和气流速度',
      '放热剧烈反应 (如电石制乙炔) 必须使用分液漏斗逐滴加入饱和食盐水以减缓剧烈反应',
    ],
    examTraps: [
      '不能使用长颈漏斗代替分液漏斗制备反应剧烈或有毒有害气体',
      '电石制乙炔严禁使用启普发生器：反应剧烈放热易炸裂，且产物 Ca(OH)₂ 为糊状物会堵塞筛孔',
    ],
  },
  {
    id: 'kipp-type',
    name: '启普发生器及 6 大简易变形装置 (随开随用、随关随停)',
    apparatus: '启普发生器标准器 / 破底试管+烧杯 / 具支试管+多孔隔板 / U型管+隔板 / 干燥管+试管',
    suitableReactions: [
      {
        gas: 'H₂ (氢气)',
        equation: 'Zn + H_2SO_4(稀) = ZnSO_4 + H_2\\uparrow',
        condition: '锌粒 (块状) + 稀硫酸',
      },
      {
        gas: 'CO₂ (二氧化碳)',
        equation: 'CaCO_3 + 2HCl = CaCl_2 + CO_2\\uparrow + H_2O',
        condition: '大理石 (块状) + 稀盐酸',
      },
      {
        gas: 'H₂S (硫化氢)',
        equation: 'FeS + 2HCl = FeCl_2 + H_2S\\uparrow',
        condition: '硫化亚铁 (块状) + 稀盐酸',
      },
    ],
    keyOperations: [
      '工作原理：打开活塞，酸液进入与固体接触反应；关闭活塞，气体压强增大将酸液压回球形漏斗，固液脱离反应停止',
      '四大约束铁律：① 块状固体 + 液体；② 常温反应 (不加热)；③ 气体难溶/微溶；④ 无糊状产物且不剧烈放热',
      '6 大简易装置核心：利用多孔隔板支撑块状固体，通过调节导管上的止水夹改变内部气压实现固液分离',
    ],
    examTraps: [
      '粉末状固体 (如 Na₂CO₃ 粉末、MnO₂ 粉末) 绝不能用于启普发生器，会直接漏入酸液槽无法固液分离',
      '不能用浓硫酸/稀硫酸与碳酸钙制 CO₂：生成微溶的 CaSO₄ 附着在大理石表面阻碍反应继续进行',
    ],
  },
]

/**
 * 专项矩阵 2：8 大高考高频净化除杂洗气模型
 */
export interface PurifyRuleItem {
  targetGas: string
  impurity: string
  reagent: string
  principleEquation: string
  mechanism: string
}

export const PURIFICATION_RULES: PurifyRuleItem[] = [
  {
    targetGas: 'Cl₂ (氯气)',
    impurity: 'HCl 挥发酸雾',
    reagent: '饱和食盐水',
    principleEquation: 'HCl + H_2O = H^+ + Cl^-',
    mechanism: '饱和食盐水中高浓度 Cl⁻ 强烈抑制 Cl₂ 与水反应 (同离子效应)，同时极易溶解 HCl。',
  },
  {
    targetGas: 'CO₂ (二氧化碳)',
    impurity: 'HCl 挥发酸雾',
    reagent: '饱和 NaHCO₃ 溶液',
    principleEquation: 'NaHCO_3 + HCl = NaCl + CO_2\\uparrow + H_2O',
    mechanism: 'NaHCO₃ 与强酸 HCl 反应生成 CO₂，不仅不损失目标气体，反而增产 CO₂；严禁用 Na₂CO₃。',
  },
  {
    targetGas: 'SO₂ (二氧化硫)',
    impurity: 'HCl / SO₃ 酸雾',
    reagent: '饱和 NaHSO₃ 溶液',
    principleEquation: 'NaHSO_3 + HCl = NaCl + SO_2\\uparrow + H_2O',
    mechanism: 'NaHSO₃ 抑制 SO₂ 溶解并与更强的强酸反应生成 SO₂；严禁用 Na₂SO₃。',
  },
  {
    targetGas: 'C₂H₄ (乙烯)',
    impurity: 'SO₂ 与 CO₂',
    reagent: '浓 NaOH 溶液',
    principleEquation: '2NaOH + SO_2 = Na_2SO_3 + H_2O',
    mechanism: 'NaOH 彻底吸收浓硫酸碳化产生的还原性 SO₂，防止 SO₂ 使溴水或 KMnO₄ 褪色干扰检验。',
  },
  {
    targetGas: 'C₂H₂ (乙炔)',
    impurity: 'H₂S 与 PH₃ (恶臭)',
    reagent: '饱和 CuSO₄ 溶液',
    principleEquation: 'CuSO_4 + H_2S = CuS\\downarrow + H_2SO_4',
    mechanism: 'CuSO₄ 与剧毒恶臭的 H₂S 反应生成难溶黑色 CuS 沉淀，彻底消除干扰。',
  },
  {
    targetGas: 'H₂S (硫化氢)',
    impurity: 'HCl 挥发酸雾',
    reagent: '饱和 NaHS 溶液',
    principleEquation: 'NaHS + HCl = NaCl + H_2S\\uparrow',
    mechanism: 'NaHS 与 HCl 反应生成 H₂S 并抑制 H₂S 溶解。',
  },
  {
    targetGas: 'NO (一氧化氮)',
    impurity: 'NO₂ 气体',
    reagent: '蒸馏水',
    principleEquation: '3NO_2 + H_2O = 2HNO_3 + NO\\uparrow',
    mechanism: '利用 NO₂ 与水反应转化为 NO 的特性去除红棕色 NO₂。',
  },
  {
    targetGas: 'CO (一氧化碳)',
    impurity: 'CO₂ 气体',
    reagent: '浓 NaOH 溶液',
    principleEquation: '2NaOH + CO_2 = Na_2CO_3 + H_2O',
    mechanism: '碱液吸收酸性氧化物 CO₂，留下中性难溶的 CO。',
  },
]

/**
 * 专项矩阵 3：四大常见干燥剂相容性与禁忌矩阵
 */
export interface DryingAgentRule {
  name: string
  nature: 'acidic' | 'basic' | 'neutral'
  natureLabel: string
  apparatus: string
  suitableGases: string[]
  forbiddenGases: { gas: string; reason: string }[]
  keyPrinciple: string
}

export const DRYING_AGENT_MATRIX: DryingAgentRule[] = [
  {
    name: '浓硫酸 (98% H₂SO₄)',
    nature: 'acidic',
    natureLabel: '酸性 / 强氧化性液体干燥剂',
    apparatus: '洗气瓶 (长进短出)',
    suitableGases: ['Cl₂', 'SO₂', 'NO₂', 'NO', 'CO₂', 'CO', 'O₂', 'H₂', 'HCl', 'CH₄'],
    forbiddenGases: [
      { gas: 'NH₃', reason: '碱性气体，剧烈酸碱中和 2NH₃ + H₂SO₄ = (NH₄)₂SO₄' },
      { gas: 'H₂S', reason: '强还原性气体，氧化生成单质 S 和 SO₂：H₂S + H₂SO₄(浓) = S↓ + SO₂↑ + 2H₂O' },
      { gas: 'HBr / HI', reason: '还原性气体，被浓硫酸氧化生成 Br₂ / I₂ 和 SO₂' },
      { gas: 'C₂H₄ (乙烯)', reason: '乙烯在浓硫酸中会发生加成/聚合反应，尤其高温下将乙烯吸收导致目标气体损失' },
      { gas: 'C₂H₂ (乙炔)', reason: '乙炔在浓硫酸中会发生聚合/吸收反应，严禁用浓硫酸干燥乙炔' },
    ],
    keyPrinciple: '利用浓硫酸强烈吸水性；严禁干燥碱性气体及强还原性气体。',
  },
  {
    name: '碱石灰 (CaO + NaOH)',
    nature: 'basic',
    natureLabel: '碱性固体干燥剂',
    apparatus: '干燥管 (球形/U形，粗进细出)',
    suitableGases: ['NH₃', 'CO', 'O₂', 'H₂', 'CH₄', 'C₂H₄', 'C₂H₂'],
    forbiddenGases: [
      { gas: 'Cl₂', reason: '酸性强氧化性气体，与碱反应生成 NaCl、NaClO、CaCl₂' },
      { gas: 'SO₂ / CO₂', reason: '酸性氧化物，与碱反应生成亚硫酸盐/碳酸盐沉淀' },
      { gas: 'NO₂', reason: '酸性气体，反应生成 NaNO₃ / NaNO₂' },
      { gas: 'HCl / H₂S', reason: '酸性气体，发生剧烈酸碱中和反应' },
    ],
    keyPrinciple: '利用 CaO 吸水转化为 Ca(OH)₂ 及 NaOH 潮解吸水；严禁干燥酸性气体。',
  },
  {
    name: '无水氯化钙 (CaCl₂)',
    nature: 'neutral',
    natureLabel: '中性固体干燥剂',
    apparatus: '干燥管 (U形管或球形干燥管)',
    suitableGases: ['Cl₂', 'SO₂', 'NO₂', 'NO', 'CO₂', 'CO', 'O₂', 'H₂', 'HCl', 'CH₄', 'C₂H₄', 'C₂H₂'],
    forbiddenGases: [
      { gas: 'NH₃', reason: '高考第一高频雷区：CaCl₂ 与 NH₃ 发生络合生成八氨合氯化钙 CaCl₂·8NH₃ 晶体' },
      { gas: 'C₂H₅OH (乙醇蒸气)', reason: '与乙醇分子络合生成 CaCl₂·4C₂H₅OH 沉淀' },
    ],
    keyPrinciple: '吸水形成结晶水合物 (CaCl₂·2H₂O / 6H₂O)；可干燥绝大多数中性、酸性气体，但绝不能干燥氨气与乙醇！',
  },
  {
    name: '五氧化二磷 (P₂O₅)',
    nature: 'acidic',
    natureLabel: '强酸性固体干燥剂',
    apparatus: '干燥管 / 干燥塔',
    suitableGases: ['Cl₂', 'SO₂', 'NO₂', 'NO', 'CO₂', 'CO', 'O₂', 'H₂', 'HCl', 'H₂S'],
    forbiddenGases: [
      { gas: 'NH₃', reason: '酸性氧化物与碱性气体化合生成磷酸铵盐' },
      { gas: 'HF', reason: '与 HF 发生反应生成配合物' },
    ],
    keyPrinciple: '极强吸水生成偏磷酸/磷酸：P₂O₅ + 3H₂O = 2H₃PO₄，吸水极其彻底，常用于深度脱水。',
  },
]

/**
 * 专项矩阵 4：干燥剂交叉对比矩阵 (Cross Matrix)
 */
export interface CrossMatrixRow {
  gas: string
  gasCategory: string
  concH2SO4: { status: 'ok' | 'no'; note: string }
  sodaLime: { status: 'ok' | 'no'; note: string }
  cacl2: { status: 'ok' | 'no'; note: string }
  p2o5: { status: 'ok' | 'no'; note: string }
}

export const DRYING_CROSS_MATRIX: CrossMatrixRow[] = [
  {
    gas: 'Cl₂',
    gasCategory: '强氧化酸性',
    concH2SO4: { status: 'ok', note: '最佳干燥剂' },
    sodaLime: { status: 'no', note: '酸碱反应' },
    cacl2: { status: 'ok', note: '中性可用' },
    p2o5: { status: 'ok', note: '酸性可用' },
  },
  {
    gas: 'NH₃',
    gasCategory: '极易溶碱性',
    concH2SO4: { status: 'no', note: '剧烈酸碱中和' },
    sodaLime: { status: 'ok', note: '最佳碱性干燥剂' },
    cacl2: { status: 'no', note: '络合生成CaCl₂·8NH₃' },
    p2o5: { status: 'no', note: '化合生成磷酸盐' },
  },
  {
    gas: 'SO₂',
    gasCategory: '还原性酸性',
    concH2SO4: { status: 'ok', note: '酸性可用' },
    sodaLime: { status: 'no', note: '反应生成Na₂SO₃' },
    cacl2: { status: 'ok', note: '中性可用' },
    p2o5: { status: 'ok', note: '酸性可用' },
  },
  {
    gas: 'NO₂',
    gasCategory: '强氧化酸性',
    concH2SO4: { status: 'ok', note: '酸性可用' },
    sodaLime: { status: 'no', note: '反应生成硝酸盐' },
    cacl2: { status: 'ok', note: '中性可用' },
    p2o5: { status: 'ok', note: '酸性可用' },
  },
  {
    gas: 'NO',
    gasCategory: '中性难溶',
    concH2SO4: { status: 'ok', note: '中性可用' },
    sodaLime: { status: 'ok', note: '中性可用' },
    cacl2: { status: 'ok', note: '中性可用' },
    p2o5: { status: 'ok', note: '中性可用' },
  },
  {
    gas: 'CO₂',
    gasCategory: '弱酸性气体',
    concH2SO4: { status: 'ok', note: '酸性可用' },
    sodaLime: { status: 'no', note: '反应生成Na₂CO₃' },
    cacl2: { status: 'ok', note: '中性可用' },
    p2o5: { status: 'ok', note: '酸性可用' },
  },
  {
    gas: 'CO / H₂ / O₂',
    gasCategory: '中性难溶',
    concH2SO4: { status: 'ok', note: '中性可用' },
    sodaLime: { status: 'ok', note: '中性可用' },
    cacl2: { status: 'ok', note: '中性可用' },
    p2o5: { status: 'ok', note: '中性可用' },
  },
  {
    gas: 'HCl',
    gasCategory: '强酸性气体',
    concH2SO4: { status: 'ok', note: '酸性可用' },
    sodaLime: { status: 'no', note: '剧烈酸碱中和' },
    cacl2: { status: 'ok', note: '中性可用' },
    p2o5: { status: 'ok', note: '酸性可用' },
  },
  {
    gas: 'H₂S',
    gasCategory: '强还原酸性',
    concH2SO4: { status: 'no', note: '氧化生成S与SO₂' },
    sodaLime: { status: 'no', note: '酸碱中和' },
    cacl2: { status: 'ok', note: '最佳中性干燥剂' },
    p2o5: { status: 'ok', note: '酸性可用' },
  },
  {
    gas: 'C₂H₄ / C₂H₂',
    gasCategory: '有机烃类',
    // 浓硫酸严禁用于干燥 C₂H₄ 和 C₂H₂：烯烃不饱和键与浓硫酸会发生加成/聚合副反应
    concH2SO4: { status: 'no', note: '烯烃加成/聚合副反应，严禁' },
    sodaLime: { status: 'ok', note: '碱性可用' },
    cacl2: { status: 'ok', note: '中性可用' },
    p2o5: { status: 'ok', note: '酸性可用' },
  },
]

/**
 * 专项矩阵 5：启普发生器适用条件与判定矩阵
 */
export interface KippRuleItem {
  gas: string
  suitable: boolean
  reactants: string
  reason: string
}

export const KIPP_GENERATOR_RULES: {
  principles: string[]
  items: KippRuleItem[]
} = {
  principles: [
    '反应物形态：块状不溶性固体 + 易溶液体 (粉末不可，会漏入下半球无法分离)',
    '反应条件：常温反应，严禁加热 (启普发生器受热膨胀易炸裂)',
    '气体溶解度：生成气体必须难溶或微溶于水 (极易溶气体液面无法形成有效气压差)',
    '副产物与热效应：反应不能产生糊状物/沉淀 (防堵塞筛板)；反应不能剧烈放热',
  ],
  items: [
    {
      gas: 'H₂ (氢气)',
      suitable: true,
      reactants: '锌粒 + 稀硫酸',
      reason: '锌为块状固体，稀硫酸为液体，常温反应，H₂ 难溶于水，无糊状产物，完全符合。',
    },
    {
      gas: 'CO₂ (二氧化碳)',
      suitable: true,
      reactants: '大理石块 + 稀盐酸',
      reason: '大理石为块状固体，稀盐酸为液体，常温反应，CO₂ 微溶，反应温和，完全符合。',
    },
    {
      gas: 'H₂S (硫化氢)',
      suitable: true,
      reactants: '硫化亚铁块 + 稀盐酸',
      reason: 'FeS 为块状固体，稀盐酸常温反应，H₂S 溶解度较小，完全符合。',
    },
    {
      gas: 'C₂H₂ (乙炔)',
      suitable: false,
      reactants: '电石 (CaC₂) + 水',
      reason: '❌ 严禁使用！电石遇水反应极度剧烈且放出巨大热量；生成 Ca(OH)₂ 为糊状物堵塞筛板。',
    },
    {
      gas: 'Cl₂ (氯气)',
      suitable: false,
      reactants: 'MnO₂ + 浓盐酸',
      reason: '❌ 不可使用：MnO₂ 为粉末状固体且该反应必须加热；启普发生器严禁加热。',
    },
    {
      gas: 'SO₂ (二氧化硫)',
      suitable: false,
      reactants: 'Na₂SO₃ 固体 + 浓硫酸',
      reason: '❌ 不宜使用：Na₂SO₃ 为粉末状易溶固体，且 SO₂ 极易溶于水 (1:40) 压强差不易形成。',
    },
    {
      gas: 'O₂ (氧气 - 双氧水法)',
      suitable: false,
      reactants: 'MnO₂ 粉末 + H₂O₂ 溶液',
      reason: '❌ 不可使用：催化剂 MnO₂ 为细小粉末状，会直接漏入酸槽中无法固液分离。',
    },
  ],
}

/**
 * 专项矩阵 6：收集方法选择决策树与物理化学判据
 */
export interface CollectionDecisionModel {
  method: string
  applicableCriteria: string
  typicalGases: string[]
  tubeConnection: string
  fullTestSummary: string
  cautions: string
}

export const COLLECTION_DECISION_RULES: CollectionDecisionModel[] = [
  {
    method: '向上排空气法',
    applicableCriteria: '密度大于空气 (M > 29)，且不与空气中成分 (O₂/N₂) 反应',
    typicalGases: ['Cl₂ (71)', 'SO₂ (64)', 'NO₂ (46)', 'CO₂ (44)', 'HCl (36.5)', 'H₂S (34)'],
    tubeConnection: '长进短出 (导管直插集气瓶底，出气管微露出瓶塞)',
    fullTestSummary: '试纸置于瓶口检验：Cl₂ 湿淀粉KI试纸变蓝；SO₂ 湿品红试纸褪色；CO₂ 燃木条熄灭',
    cautions: '有毒气体集气瓶口需塞双孔塞并连接尾气处理装置。',
  },
  {
    method: '向下排空气法',
    applicableCriteria: '密度小于空气 (M < 29)，且不与空气中成分反应',
    typicalGases: ['H₂ (2)', 'CH₄ (16)', 'NH₃ (17)'],
    tubeConnection: '短进长出 (若正放集气瓶)；或倒置试管长管伸入底部',
    fullTestSummary: 'NH₃ 湿润红色石蕊试纸变蓝；H₂ 倒置试管检验爆鸣纯度',
    cautions: 'NH₃ 极易溶于水，瓶口需塞一团浸有稀硫酸的棉花防散逸。',
  },
  {
    method: '排水集气法 (最纯净收集法)',
    applicableCriteria: '难溶或微溶于水，且不与水反应的气体',
    typicalGases: ['H₂', 'O₂', 'NO', 'CO', 'CH₄', 'C₂H₄', 'C₂H₂'],
    tubeConnection: '短进长出 (集气瓶预先装满水倒扣于水槽中，短管进气排挤水)',
    fullTestSummary: '集气瓶内水全部排尽，瓶口冒出大气泡即已集满',
    cautions: 'NO 接触空气立即氧化为 NO₂，排水法为其唯一规范收集法；停机必须先撤导管后熄灯。',
  },
  {
    method: '排特定饱和溶液法',
    applicableCriteria: '气体极易溶于水但在特定饱和溶液中溶解度骤降',
    typicalGases: ['Cl₂ (排饱和食盐水)', 'CO₂ (排饱和 NaHCO₃ 溶液)', 'SO₂ (排饱和 NaHSO₃ 溶液)'],
    tubeConnection: '同排水法连接',
    fullTestSummary: '集气瓶中饱和溶液全部被排尽',
    cautions: '利用同离子效应大幅抑制气体水解与溶解。',
  },
]

/**
 * 专项矩阵 7：6 大防倒吸装置与结构原理
 */
export interface AntiSiphonModel {
  name: string
  structureFeature: string
  workingPrinciple: string
  applicableScenarios: string
  cautionPoint: string
}

export const ANTI_SIPHON_MODELS: AntiSiphonModel[] = [
  {
    name: '倒置漏斗微触水面装置',
    structureFeature: '倒置漏斗边缘与烧杯吸收液液面刚好接触 (相切)',
    workingPrinciple: '当气体溶解压强骤降时，液体进入漏斗使液面脱离，漏斗内重力大于吸力液体自动回落，自动消除倒吸。',
    applicableScenarios: 'NH₃、HCl、SO₂ 等极易溶气体的水溶液吸收',
    cautionPoint: '漏斗边缘严禁深深插入液面以下！若浸入太深脱离机制失效仍会倒吸。',
  },
  {
    name: '空安全瓶 (广口瓶双短导管)',
    structureFeature: '在反应/收集装置与吸收装置之间串联一个空广口瓶，导管短进短出 (均不插入瓶底)',
    workingPrinciple: '吸收液即便发生倒吸也仅倒吸入空安全瓶中，阻断其继续倒吸进入前序加热反应器中。',
    applicableScenarios: '高温加热固液制气体系与极易溶气体吸收体系之间',
    cautionPoint: '安全瓶容积必须大于吸收液总体积，且导管严禁插到瓶底。',
  },
  {
    name: '球形干燥管 / 防倒吸洗气管',
    structureFeature: '干燥管球部容积大，粗端朝下微插液面或细端进气',
    workingPrinciple: '大球部容积迅速容纳上升液体，使液面脱离或依靠重力自动回降。',
    applicableScenarios: '微型实验及 NH₃ 发生尾气吸收',
    cautionPoint: '粗端接触液面不可过深。',
  },
  {
    name: '肚容球形瓶 (肚容管)',
    structureFeature: '导管中间带有一个膨大的球泡 (如移液管状球泡)',
    workingPrinciple: '球泡截面积大，当液体倒吸进入球泡时液柱高度上升慢，重力平衡负压阻止继续上升。',
    applicableScenarios: '连续通气反应中的极易溶气体吸收',
    cautionPoint: '球泡容积需足够大。',
  },
  {
    name: '四氯化碳与水双层液体隔离法',
    structureFeature: '下层为密度大难溶的 CCl₄，上层为水；导管直接插入下层 CCl₄ 中',
    workingPrinciple: '气体先在不溶的 CCl₄ 中逸散成气泡上升，进入上层水层时才被溶解，气体与水不直接在管口接触，杜绝倒吸。',
    applicableScenarios: '极易溶于水但难溶于有机溶剂的气体 (NH₃、HCl)',
    cautionPoint: '下层必须密度大于水 (如 CCl₄)，不能用苯 (密度小于水浮在上层则失效)。',
  },
  {
    name: '倾斜双球洗气管',
    structureFeature: '两端对称的双球玻璃管斜置于吸收液中',
    workingPrinciple: '液体被吸入第一个球体后与外界大气形成压力平衡，阻断负压传导。',
    applicableScenarios: '高精度定量实验中的尾气吸收',
    cautionPoint: '需固定倾斜角度。',
  },
]

/**
 * 专项矩阵 8：高考大题装置气密性检验三大规范答题模板
 */
export interface AirtightnessTemplate {
  method: string
  applicableDevice: string
  standardSteps: string
  phenomenonAndConclusion: string
}

export const AIRTIGHTNESS_TEMPLATES: AirtightnessTemplate[] = [
  {
    method: '微热法 (手捂法 / 酒精灯微热法)',
    applicableDevice: '无分液漏斗、单一出气导管的标准密闭发生装置',
    standardSteps: '① 将导气管末端伸入水槽/烧杯液面以下；② 用双手紧贴容器外壁 (或用酒精灯外焰微热容器底部)。',
    phenomenonAndConclusion: '现象：导管口有连续气泡冒出；移开双手 (或撤去酒精灯) 后，导管内形成一段稳定回升的水柱，且一段时间内不下降，说明气密性良好。',
  },
  {
    method: '液差法 / 注水法 (长颈漏斗/分液漏斗型)',
    applicableDevice: '带有长颈漏斗、分液漏斗或启普发生器的装置',
    standardSteps: '① 关闭导气管活塞/止水夹；② 从长颈漏斗口向锥形瓶中注入蒸馏水，使漏斗下端浸入液面以下，继续注水使漏斗颈内液面高于锥形瓶内液面。',
    phenomenonAndConclusion: '现象：停止注水后，长颈漏斗内外形成一段稳定的液面高度差，且静置一段时间液面差保持不下降，证明装置气密性良好。',
  },
  {
    method: '抽气 / 打气加压法',
    applicableDevice: '复杂多节点串联装置、带注射器的实验全链体系',
    standardSteps: '① 关闭全套装置所有出气口活塞；② 在装置端口连接注射器，缓慢向内推注射器活塞 (或向外拉活塞)。',
    phenomenonAndConclusion: '现象：松开手后，注射器活塞能够迅速弹回至初始刻度位置，证明全套装置气密性优良。',
  },
]

/**
 * 专项矩阵 9：高考尾气处理与无害化转化四大方法体系
 */
export interface TailGasModel {
  method: string
  applicableGases: string
  absorberApparatus: string
  typicalReactions: { gas: string; equation: string; note: string }[]
  antiSiphonRequired: boolean
  examTraps: string[]
}

export const TAIL_GAS_TREATMENT_MODELS: TailGasModel[] = [
  {
    method: '强碱溶液吸收法 (酸性/强氧化性/歧化气体)',
    applicableGases: 'Cl₂、SO₂、NO₂、NO+NO₂、HCl、H₂S',
    absorberApparatus: '烧杯/洗气瓶 + 浓 NaOH 溶液 (极易溶气体必须加装防倒吸装置)',
    typicalReactions: [
      { gas: 'Cl₂', equation: 'Cl_2 + 2NaOH = NaCl + NaClO + H_2O', note: '强氧化性气体歧化吸收' },
      { gas: 'SO₂', equation: 'SO_2 + 2NaOH = Na_2SO_3 + H_2O', note: '酸性氧化物中和吸收' },
      { gas: 'NO₂', equation: '2NO_2 + 2NaOH = NaNO_3 + NaNO_2 + H_2O', note: '歧化生成硝酸盐与亚硝酸盐' },
      { gas: 'NO+NO₂', equation: 'NO + NO_2 + 2NaOH = 2NaNO_2 + H_2O', note: '等物质的量归中吸收' },
      { gas: 'H₂S', equation: 'H_2S + 2NaOH = Na_2S + 2H_2O', note: '二元弱酸中和' },
      { gas: 'HCl', equation: 'HCl + NaOH = NaCl + H_2O', note: '强酸剧烈中和' },
    ],
    antiSiphonRequired: true,
    examTraps: [
      'Cl₂ 尾气吸收严禁用澄清石灰水：Ca(OH)₂ 微溶于水，浓度极低无法彻底吸收 Cl₂',
      '单独的 NO 气体不能被 NaOH 溶液吸收，必须与 NO₂ 混合 (1:1) 或通入氧气才能吸收',
    ],
  },
  {
    method: '水 / 稀酸吸收法 (极易溶碱性气体)',
    applicableGases: 'NH₃ (氨气)',
    absorberApparatus: '倒置漏斗微触水面 / 安全瓶 + 稀硫酸或水',
    typicalReactions: [
      { gas: 'NH₃', equation: 'NH_3 + H^+ = NH_4^+', note: '酸碱中和形成铵盐' },
    ],
    antiSiphonRequired: true,
    examTraps: [
      'NH₃ 极易溶于水 (1:700)，尾气吸收绝对严禁直导管插水，必须使用倒置漏斗 (边缘微触水面) 或安全瓶防倒吸',
      '吸收氨气优先使用稀硫酸而非浓硫酸，防止浓硫酸飞溅发热',
    ],
  },
  {
    method: '点燃 / 灼烧燃烧法 (可燃性剧毒气体)',
    applicableGases: 'CO、CH₄、C₂H₄、C₂H₂、H₂',
    absorberApparatus: '尖嘴玻璃导管 + 酒精灯火焰引燃 / 导回加热炉重新利用',
    typicalReactions: [
      { gas: 'CO', equation: '2CO + O_2 \\xrightarrow{点燃} 2CO_2', note: '剧毒气体无害化转化为无毒 CO₂' },
      { gas: 'C₂H₄', equation: 'C_2H_4 + 3O_2 \\xrightarrow{点燃} 2CO_2 + 2H_2O', note: '有机烯烃燃烧' },
      { gas: 'C₂H₂', equation: '2C_2H_2 + 5O_2 \\xrightarrow{点燃} 4CO_2 + 2H_2O', note: '有机炔烃燃烧' },
    ],
    antiSiphonRequired: false,
    examTraps: [
      'CO 剧毒且不溶于酸碱，严禁直接排放或用水吸收；必须在导管末端点燃或导回反应炉',
      '点燃可燃性气体尾气前，必须先检验气流纯度或确保装置内空气已排尽，防止回火爆炸',
    ],
  },
  {
    method: '气囊 / 气球收集法 (高毒/需回收废气)',
    applicableGases: 'CO、有毒有机蒸气、难吸收混合废气',
    absorberApparatus: '乳胶气囊 / 气球 / 双链球套在末端出气口',
    typicalReactions: [],
    antiSiphonRequired: false,
    examTraps: [
      '适用于长时间反应且产气量较小的剧毒体系，实验完毕后统一在通风橱中进行无害化销毁',
    ],
  },
]
