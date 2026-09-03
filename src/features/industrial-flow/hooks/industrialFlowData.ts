/**
 * src/features/industrial-flow/hooks/industrialFlowData.ts
 * 母题七：无机工艺流程各工业体系静态知识数据 (元素走向与试剂评估)
 * 遵循《AGENTS.md》铁律 10 领域内聚准则，分离静态知识矩阵与动态化学计算
 */

import type { ElementFate, ReagentRecommendation, IndustrialFlowSystemId } from '../types'

/**
 * 依据体系 ID 与氧化状态，生成元素走向追踪矩阵
 */
export function getElementFates(systemId: IndustrialFlowSystemId, isOxidized: boolean): ElementFate[] {
  if (systemId === 'fe-al-mn') {
    return [
      {
        element: 'Mn (主产物)',
        rawState: 'MnO₂ (软锰矿)',
        leachState: 'Mn²⁺ (经还原浸出)',
        separationStep: '调 pH=4.7~8.1 保留在滤液',
        finalState: 'MnSO₄·H₂O 晶体',
        isTarget: true,
      },
      {
        element: 'Fe (主要杂质)',
        rawState: 'Fe₂O₃ / FeSO₄ 还原剂',
        leachState: isOxidized ? 'Fe³⁺ (已充分氧化)' : 'Fe²⁺ (氧化不足)',
        separationStep: isOxidized ? '调 pH≥3.2 完全沉淀' : '需 pH≥9.0 才沉淀(无法分离)',
        finalState: isOxidized ? 'Fe(OH)₃ 沉淀 (中和渣)' : '残留溶液污染 MnSO₄',
        isTarget: false,
      },
      {
        element: 'Al (伴生杂质)',
        rawState: 'Al₂O₃ (泥质脉石)',
        leachState: 'Al³⁺ 铝离子',
        separationStep: '调 pH≥4.7 完全沉淀 (防强碱再溶解)',
        finalState: 'Al(OH)₃ 沉淀 (中和渣)',
        isTarget: false,
      },
      {
        element: 'Si (不溶脉石)',
        rawState: 'SiO₂ 石英砂',
        leachState: '不溶于稀硫酸',
        separationStep: '酸浸后过滤直接分离',
        finalState: '滤渣 I (浸出渣)',
        isTarget: false,
      },
    ]
  } else if (systemId === 'fe-cu-zn') {
    return [
      {
        element: 'Zn (主产物)',
        rawState: 'ZnO / ZnS 烟道灰',
        leachState: 'Zn²⁺ 锌离子',
        separationStep: '调 pH=5.2 保留在滤液',
        finalState: 'ZnSO₄·7H₂O 晶体',
        isTarget: true,
      },
      {
        element: 'Cu (重金属杂质)',
        rawState: 'CuO 铜杂质',
        leachState: 'Cu²⁺ 铜离子',
        separationStep: '后续加过量锌粉置换深度除铜',
        finalState: 'Cu 单质沉淀渣 (回收铜)',
        isTarget: false,
      },
      {
        element: 'Fe (主要杂质)',
        rawState: 'Fe₂O₃ / FeO',
        leachState: isOxidized ? 'Fe³⁺' : 'Fe²⁺',
        separationStep: '调 pH≥3.2 水解沉淀',
        finalState: 'Fe(OH)₃ 沉淀 (中和渣)',
        isTarget: false,
      },
      {
        element: 'Al (伴生杂质)',
        rawState: 'Al₂O₃',
        leachState: 'Al³⁺',
        separationStep: '调 pH≥4.7 水解沉淀',
        finalState: 'Al(OH)₃ 沉淀 (中和渣)',
        isTarget: false,
      },
    ]
  } else if (systemId === 'ti-fe') {
    return [
      {
        element: 'Ti (主产物)',
        rawState: 'FeTiO₃ (钛铁矿)',
        leachState: 'TiOSO₄ (钛酰硫酸盐)',
        separationStep: '加热稀释水解析出 H₂TiO₃',
        finalState: '煅烧生成高纯 TiO₂ (钛白粉)',
        isTarget: true,
      },
      {
        element: 'Fe (伴生回收)',
        rawState: 'Fe²⁺ / Fe³⁺ 氧化物',
        leachState: '加铁屑还原为 Fe²⁺ (防水解)',
        separationStep: '降温结晶析出绿矾',
        finalState: 'FeSO₄·7H₂O 副产晶体',
        isTarget: false,
      },
      {
        element: 'Mg (伴生杂质)',
        rawState: 'MgO 脉石',
        leachState: 'Mg²⁺ (水解弱，留在母液)',
        separationStep: '多次结晶后母液外排处理',
        finalState: '母液废渣',
        isTarget: false,
      },
    ]
  } else if (systemId === 'ni-co-li') {
    return [
      {
        element: 'Co/Ni/Li (主产品)',
        rawState: 'LiCoO₂ / LiNiO₂ 正极废料',
        leachState: 'Co²⁺ / Ni²⁺ / Li⁺ (H₂O₂还原浸出)',
        separationStep: '除杂后萃取分离或分步沉淀',
        finalState: 'CoSO₄ / NiSO₄ 电池级盐',
        isTarget: true,
      },
      {
        element: 'Fe/Al (集流体杂质)',
        rawState: '铝箔 / 铁外壳杂质',
        leachState: 'Fe³⁺ / Al³⁺',
        separationStep: '调 pH=4.7~5.0 沉淀去除',
        finalState: 'Fe(OH)₃ / Al(OH)₃ 混合滤渣',
        isTarget: false,
      },
      {
        element: 'Ca/Mg (水质杂质)',
        rawState: '工艺水引入杂质',
        leachState: 'Ca²⁺ / Mg²⁺',
        separationStep: '加入 NaF 深度沉淀',
        finalState: 'CaF₂ / MgF₂ 难溶氟化物渣',
        isTarget: false,
      },
    ]
  } else if (systemId === 'mg-ca') {
    return [
      {
        element: 'Mg (主产物)',
        rawState: 'Mg²⁺ 盐湖卤水 / 白云石',
        leachState: 'Mg²⁺ 镁离子',
        separationStep: '调 pH 去铁铝后加碱沉淀',
        finalState: 'Mg(OH)₂ 煅烧得高纯 MgO',
        isTarget: true,
      },
      {
        element: 'Fe/Al (微量杂质)',
        rawState: '黏土伴生泥',
        leachState: 'Fe³⁺ / Al³⁺',
        separationStep: '用 MgO 调 pH=5.0 沉淀',
        finalState: 'Fe(OH)₃ / Al(OH)₃ 滤渣',
        isTarget: false,
      },
      {
        element: 'Ca (主要共生离子)',
        rawState: 'Ca²⁺ 卤水伴生',
        leachState: 'Ca²⁺ 钙离子',
        separationStep: '加入草酸铵或硫酸根沉淀',
        finalState: 'CaC₂O₄ 沉淀分离',
        isTarget: false,
      },
    ]
  } else if (systemId === 'al-fe-si') {
    return [
      {
        element: 'Al (主产物)',
        rawState: 'Al₂O₃ (一水硬铝石/三水铝石)',
        leachState: '[Al(OH)₄]⁻ 强碱浸出液',
        separationStep: '通入过量 CO₂ 酸化水解完全沉淀',
        finalState: '高纯 α-Al₂O₃ (煅烧产物)',
        isTarget: true,
      },
      {
        element: 'Fe (主要赤泥成分)',
        rawState: 'Fe₂O₃ 赤铁矿伴生',
        leachState: '强碱中极难溶解',
        separationStep: '碱浸后第一道固液过滤分离',
        finalState: '赤泥滤渣 (高炉炼铁副产原料)',
        isTarget: false,
      },
      {
        element: 'Si (泥质脉石杂质)',
        rawState: 'SiO₂ / 高岭石脉石',
        leachState: '与碱反应溶为硅酸根',
        separationStep: '加热与铝酸钠反应生成水合铝硅酸钠沉淀',
        finalState: '脱硅渣 (进入赤泥固相)',
        isTarget: false,
      },
    ]
  } else if (systemId === 'li-fe-p') {
    return [
      {
        element: 'Li (核心主产品)',
        rawState: 'LiFePO₄ 废旧电池黑粉',
        leachState: 'Li⁺ 硫酸锂溶液',
        separationStep: '加饱和纯碱加热至90℃趁热过滤',
        finalState: '电池级 Li₂CO₃ 晶体',
        isTarget: true,
      },
      {
        element: 'Fe (高附加值副产)',
        rawState: 'LiFePO₄ (+2 价铁)',
        leachState: 'H₂O₂ 氧化为 Fe³⁺',
        separationStep: '调 pH=2.0~2.5 与磷酸根结合沉淀',
        finalState: '高纯电池级 FePO₄ 前驱体',
        isTarget: false,
      },
      {
        element: 'P (磷酸根成分)',
        rawState: 'LiFePO₄ 晶格骨架',
        leachState: 'PO₄³⁻ 磷酸根离子',
        separationStep: '沉淀结合进入固相',
        finalState: 'FePO₄ 沉淀产品',
        isTarget: false,
      },
      {
        element: 'C (导电剂杂质)',
        rawState: '导电炭黑 / 乙炔黑',
        leachState: '不溶于酸性氧化液',
        separationStep: '酸浸后第一道精密过滤',
        finalState: '炭黑滤渣 (外排或焚烧回收)',
        isTarget: false,
      },
    ]
  } else {
    // cu-fe 孔雀石/废铜制备胆矾
    return [
      {
        element: 'Cu (主产物)',
        rawState: 'Cu₂(OH)₂CO₃ / 废铜粉',
        leachState: 'Cu²⁺ 硫酸铜溶液',
        separationStep: '调 pH=3.2~4.4 保留在滤液结晶',
        finalState: 'CuSO₄·5H₂O 胆矾晶体',
        isTarget: true,
      },
      {
        element: 'Fe (主要杂质)',
        rawState: 'Fe₂O₃ / FeO 伴生杂质',
        leachState: isOxidized ? 'Fe³⁺ (已氧化)' : 'Fe²⁺ (氧化不足)',
        separationStep: isOxidized ? '加 CuO 调 pH≥3.2 完全沉淀' : '需 pH≥9.0 无法与铜分离',
        finalState: isOxidized ? 'Fe(OH)₃ 中和渣' : '残留污染硫酸铜晶体',
        isTarget: false,
      },
      {
        element: 'Si (不溶脉石)',
        rawState: 'SiO₂ 脉石泥沙',
        leachState: '不溶于稀硫酸',
        separationStep: '酸浸后过滤直接分离',
        finalState: '滤渣 I (浸出脉石渣)',
        isTarget: false,
      },
    ]
  }
}

/**
 * 依据体系 ID，生成调 pH 试剂不增杂智能评估列表
 */
export function getReagentEvaluations(systemId: IndustrialFlowSystemId): ReagentRecommendation[] {
  if (systemId === 'fe-al-mn') {
    return [
      {
        reagent: 'MnO',
        isRecommended: true,
        label: 'MnO (氧化锰)',
        tag: '首选氧化物',
        category: 'target-compound',
        reaction: 'MnO + 2H⁺ = Mn²⁺ + H₂O',
      },
      {
        reagent: 'MnCO3',
        isRecommended: true,
        label: 'MnCO₃ (碳酸锰)',
        tag: '首选碳酸盐',
        category: 'target-compound',
        reaction: 'MnCO₃ + 2H⁺ = Mn²⁺ + CO₂↑ + H₂O',
      },
      {
        reagent: 'NaOH',
        isRecommended: false,
        label: 'NaOH (烧碱)',
        tag: '易局部过碱',
        category: 'external',
        reaction: 'OH⁻ + H⁺ = H₂O',
        warning: '强碱无自限性，极易局部过碱造成 Al(OH)₃ 两性溶解并引入 Na⁺',
      },
      {
        reagent: 'CaCO3',
        isRecommended: false,
        label: 'CaCO₃ (石灰石)',
        tag: '副产微溶物',
        category: 'external',
        reaction: 'CaCO₃ + 2H⁺ + SO₄²⁻ = CaSO₄↓ + CO₂↑ + H₂O',
        warning: '生成微溶 CaSO₄ 包裹矿粉且污染滤渣，引入 Ca²⁺ 杂质',
      },
    ]
  } else if (systemId === 'fe-cu-zn') {
    return [
      {
        reagent: 'ZnO',
        isRecommended: true,
        label: 'ZnO (氧化锌)',
        tag: '首选氧化物',
        category: 'target-compound',
        reaction: 'ZnO + 2H⁺ = Zn²⁺ + H₂O',
      },
      {
        reagent: 'ZnCO3',
        isRecommended: true,
        label: 'ZnCO₃ (碳酸锌)',
        tag: '首选碳酸盐',
        category: 'target-compound',
        reaction: 'ZnCO₃ + 2H⁺ = Zn²⁺ + CO₂↑ + H₂O',
      },
      {
        reagent: 'CuO',
        isRecommended: false,
        label: 'CuO (氧化铜)',
        tag: '非主产物化合物',
        category: 'external',
        reaction: 'CuO + 2H⁺ = Cu²⁺ + H₂O',
        warning: '引入重金属 Cu²⁺ 杂质，加大后续置换锌粉消耗量',
      },
      {
        reagent: 'NaOH',
        isRecommended: false,
        label: 'NaOH (烧碱)',
        tag: '易局部过碱',
        category: 'external',
        reaction: 'OH⁻ + H⁺ = H₂O',
        warning: '引入难除 Na⁺，且极易导致 Zn(OH)₂ 与 Al(OH)₃ 两性反溶',
      },
    ]
  } else if (systemId === 'ti-fe') {
    return [
      {
        reagent: 'NaOH',
        isRecommended: true,
        label: '稀 NaOH (精密滴定)',
        tag: '中和酸度',
        category: 'external',
        reaction: 'H⁺ + OH⁻ = H₂O',
      },
      {
        reagent: 'CaCO3',
        isRecommended: false,
        label: 'CaCO₃ (石灰石)',
        tag: '包裹板结',
        category: 'external',
        reaction: 'CaCO₃ + 2H⁺ + SO₄²⁻ = CaSO₄↓ + CO₂↑ + H₂O',
        warning: '硫酸介质生成 CaSO₄ 微溶沉淀包裹电极与设备，严禁在钛白水解中加入',
      },
    ]
  } else if (systemId === 'ni-co-li') {
    return [
      {
        reagent: 'NaOH',
        isRecommended: true,
        label: '稀 NaOH 溶液',
        tag: '精准沉淀铁铝',
        category: 'external',
        reaction: 'OH⁻ + H⁺ = H₂O',
      },
      {
        reagent: 'Na2CO3',
        isRecommended: true,
        label: 'Na₂CO₃ (纯碱)',
        tag: '温和沉淀剂',
        category: 'external',
        reaction: 'CO₃²⁻ + 2H⁺ = CO₂↑ + H₂O',
      },
      {
        reagent: 'CaCO3',
        isRecommended: false,
        label: 'CaCO₃ (石灰石)',
        tag: '混入难除钙',
        category: 'external',
        reaction: 'CaCO₃ + 2H⁺ = Ca²⁺ + CO₂↑ + H₂O',
        warning: '电池级化学品严防 Ca²⁺ 污染，后续极难通过萃取彻底脱钙',
      },
    ]
  } else if (systemId === 'mg-ca') {
    return [
      {
        reagent: 'MgO',
        isRecommended: true,
        label: 'MgO (氧化镁)',
        tag: '首选推荐',
        category: 'target-compound',
        reaction: 'MgO + 2H⁺ = Mg²⁺ + H₂O',
      },
      {
        reagent: 'MgCO3',
        isRecommended: true,
        label: 'MgCO₃ (碳酸镁)',
        tag: '首选碳酸盐',
        category: 'target-compound',
        reaction: 'MgCO₃ + 2H⁺ = Mg²⁺ + CO₂↑ + H₂O',
      },
      {
        reagent: 'CaCO3',
        isRecommended: false,
        label: 'CaCO₃ (石灰石)',
        tag: '共生钙杂质',
        category: 'external',
        reaction: 'CaCO₃ + 2H⁺ = Ca²⁺ + CO₂↑ + H₂O',
        warning: '引入 Ca²⁺ 杂质，直接降低高纯 MgO 纯度',
      },
      {
        reagent: 'NaOH',
        isRecommended: false,
        label: 'NaOH (烧碱)',
        tag: '易局部沉淀镁',
        category: 'external',
        reaction: 'OH⁻ + H⁺ = H₂O',
        warning: '强碱造成局部过碱，导致 Mg(OH)₂ 提前过早沉淀损失',
      },
    ]
  } else if (systemId === 'al-fe-si') {
    return [
      {
        reagent: 'CO2',
        isRecommended: true,
        label: '通入过量 CO₂ 气流',
        tag: '拜耳法首选',
        category: 'external',
        reaction: '[Al(OH)₄]⁻ + CO₂ = Al(OH)₃↓ + HCO₃⁻',
      },
      {
        reagent: 'NaOH',
        isRecommended: false,
        label: 'NaOH 强碱',
        tag: '抑制水解析出',
        category: 'external',
        reaction: '无水解反应',
        warning: '强碱抑制偏铝酸根分解水解，无法析出 Al(OH)₃ 沉淀',
      },
      {
        reagent: 'CaCO3',
        isRecommended: false,
        label: 'CaCO₃ 石灰石',
        tag: '无法酸解中和',
        category: 'external',
        warning: '难溶弱碱性盐无法分解铝酸根，且引入微溶钙盐杂质',
      },
    ]
  } else if (systemId === 'li-fe-p') {
    return [
      {
        reagent: 'Na2CO3',
        isRecommended: true,
        label: '饱和 Na₂CO₃ 溶液',
        tag: '沉锂标准试剂',
        category: 'external',
        reaction: '2Li⁺ + CO₃²⁻ = Li₂CO₃↓',
      },
      {
        reagent: 'NaOH',
        isRecommended: false,
        label: 'NaOH (烧碱)',
        tag: '生成极易溶 LiOH',
        category: 'external',
        reaction: 'Li⁺ + OH⁻ = LiOH(极易溶)',
        warning: '氢氧化锂为强碱极易溶于水，不能实现锂元素固液沉淀分离',
      },
      {
        reagent: 'CaCO3',
        isRecommended: false,
        label: 'CaCO₃ (石灰石)',
        tag: '引入电池死敌钙',
        category: 'external',
        reaction: '无有效沉锂反应',
        warning: '电池级化学品严防 Ca²⁺ 杂质，难溶碳酸盐无法沉锂',
      },
    ]
  } else {
    // cu-fe
    return [
      {
        reagent: 'CuO',
        isRecommended: true,
        label: 'CuO (氧化铜粉)',
        tag: '首选氧化物',
        category: 'target-compound',
        reaction: 'CuO + 2H⁺ = Cu²⁺ + H₂O',
      },
      {
        reagent: 'Cu2(OH)2CO3',
        isRecommended: true,
        label: '碱式碳酸铜',
        tag: '推荐碳酸盐',
        category: 'target-compound',
        reaction: 'Cu₂(OH)₂CO₃ + 4H⁺ = 2Cu²⁺ + CO₂↑ + 3H₂O',
      },
      {
        reagent: 'NaOH',
        isRecommended: false,
        label: 'NaOH (烧碱)',
        tag: '局部沉淀铜损耗',
        category: 'external',
        reaction: 'OH⁻ + H⁺ = H₂O',
        warning: '强碱极易造成局部过碱析出 Cu(OH)₂ 蓝色沉淀，损失产物并引入 Na⁺',
      },
      {
        reagent: 'CaCO3',
        isRecommended: false,
        label: 'CaCO₃ (石灰石)',
        tag: '副产石膏微溶物',
        category: 'external',
        reaction: 'CaCO₃ + 2H⁺ + SO₄²⁻ = CaSO₄↓ + CO₂↑ + H₂O',
        warning: '硫酸体系生成微溶 CaSO₄ 包裹并严重污染胆矾晶体',
      },
    ]
  }
}
