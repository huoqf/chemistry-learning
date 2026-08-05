import type { ModelQuizData } from './types'

export const modelTitrationErrorPurity: ModelQuizData = {
  modelId: 'model-titration-error-purity',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：滴定管读数视线视角偏差（仰视/俯视）推导',
      type: 'keywords',
      questionText:
        '滴定管刻度自上而下增大。若滴定前平视，滴定后仰视滴定管刻度读取终点体积，将导致测得的标准溶液消耗体积 V(标) 偏大还是偏小？由此计算的待测液浓度 c(待) 如何变化？写出代数推导过程。',
      correctAnswer: ['偏大', '偏高'],
      explanation:
        '滴定管刻度自上而下增大（0 刻度在上）。滴定后仰视凹液面最低处，视线向下斜穿刻度线，读取的终点刻度数值 V(终) 偏大。因此算出 V(标) = V(终) - V(始) 偏大。由测定关系式 c(待) = [c(标) × V(标)] / V(待) 可知，c(标) 与 V(待) 为已知常数，V(标) 偏大直接导致算得的 c(待) 偏高。',
    },
    {
      id: 'step-2',
      title: '步骤 2：未润洗与尖嘴悬滴错误代数影响',
      type: 'keywords',
      questionText:
        '滴定管洗净后未用标准溶液润洗即直接装液，以及滴定结束时滴定管尖嘴挂有一滴悬滴未落入锥形瓶，这两项操作对测定结果分别产生何种影响？',
      correctAnswer: ['偏高', '偏高'],
      explanation:
        '① 未用标准液润洗滴定管，管壁残余的蒸馏水会将装入的标准溶液稀释，达到滴定终点需要消耗更大体积的标准液，导致 V(标) 读数偏大，算得 c(待) 偏高；② 滴定管尖嘴挂有悬滴，该滴标准液已被记入滴定管终点读数中但并未进入锥形瓶参与反应，使 V(标) 测量值虚高，算得 c(待) 偏高。',
    },
    {
      id: 'step-3',
      title: '步骤 3：返滴定法（Back Titration）物质的量代数消去关系',
      type: 'calculation',
      questionText:
        '称取 1.50 g 粗 CaCO₃ 样品，加入 50.00 mL 1.00 mol/L 过量 HCl 溶液充分反应。反应后残余的过量 HCl 需消耗 20.00 mL 1.00 mol/L NaOH 溶液滴定至终点。计算样品中 CaCO₃ 的质量分数为多少 %？(M = 100 g/mol)',
      formulaLatex:
        'w\\% = \\frac{[c_{\\text{HCl}} V_{\\text{HCl}} - c_{\\text{NaOH}} V_{\\text{NaOH}}] \\times 0.5 \\times M_{\\text{CaCO}_3}}{m_{\\text{sample}}} \\times 100\\%',
      placeholder: '100',
      correctAnswer: ['100', '100%'],
      explanation:
        'n(HCl总) = 0.0500 L × 1.00 mol/L = 0.0500 mol。与过量 HCl 反应的 n(NaOH) = 0.0200 L × 1.00 mol/L = 0.0200 mol，故残余 n(HCl) = 0.0200 mol。被 CaCO₃ 消耗的 n(HCl) = 0.0500 - 0.0200 = 0.0300 mol。根据 CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O，n(CaCO₃) = 0.5 × 0.0300 = 0.0150 mol，m(CaCO₃) = 0.0150 × 100 = 1.50 g。纯度 w% = (1.50 / 1.50) × 100% = 100%。',
    },
    {
      id: 'step-4',
      title: '步骤 4：多步氧化还原滴定与产品产率计算',
      type: 'calculation',
      questionText:
        '以 2.80 g 还原铁粉为原料制备摩尔盐 (NH₄)₂Fe(SO₄)₂·6H₂O (M = 392 g/mol)。最终所得纯品用 0.1000 mol/L KMnO₄ 标准溶液滴定，消耗 KMnO₄ 溶液 100.00 mL。计算该制备实验中铁元素的产率 (Yield%) 为多少 %？(M_Fe = 56 g/mol)',
      formulaLatex:
        '\\text{Yield}\\% = \\frac{5 \\times c_{\\text{KMnO}_4} V_{\\text{KMnO}_4} \\times M_{\\text{Fe}}}{m_{\\text{Fe,原料}}} \\times 100\\%',
      placeholder: '100',
      correctAnswer: ['100', '100%'],
      explanation:
        '根据离子方程式 5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O，定量关系为 n(Fe²⁺) = 5 n(MnO₄⁻) = 5 × (0.1000 mol/L × 0.1000 L) = 0.0500 mol。原料中铁元素的物质的量 n(Fe) = 2.80 g / 56 g/mol = 0.0500 mol。因此铁元素转化产率 Yield% = (0.0500 mol / 0.0500 mol) × 100% = 100%。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-err-1',
      yearProvince: '2024 全国高考河北卷/湖北卷',
      modelId: 'model-titration-error-purity',
      title: '重铬酸钾返滴定法测定水体 COD 与定量误差评估',
      contextDescription:
        '化学需氧量 (COD) 是衡量水体有机还原性污染物浓度的关键指标。测试人员取 20.00 mL 工业废水样品于锥形瓶中，加入 10.00 mL 0.0500 mol/L K₂Cr₂O₇ 酸性过量标准溶液，在催化剂作用下加热回流消解，使水中有机物被完全氧化。冷却后，过量的 K₂Cr₂O₇ 用 0.1000 mol/L FeSO₄ 标准溶液返滴定至终点，消耗 FeSO₄ 溶液 12.00 mL。反应离子方程式为：Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ = 2Cr³⁺ + 6Fe³⁺ + 7H₂O，以试亚铁灵为指示剂。',
      questionText: '下列关于该返滴定实验及其定量误差分析的说法中，正确的是（ ）',
      diagramType: 'titration-error-diagram',
      diagramConfig: {
        errorDiagramType: 'cod-back-titration',
        title: 'K₂Cr₂O₇ 消解与 FeSO₄ 返滴定测定水体 COD 实验原图',
      },
      options: [
        {
          label: 'A',
          text: '若滴定前盛装 FeSO₄ 的滴定管未用标准溶液润洗，将导致测得的 COD 值偏高',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '滴定终点时，溶液颜色变化应为：由红褐色恰好变为浅蓝绿色，且 30s 内不恢复',
          isCorrect: false,
        },
        {
          label: 'C',
          text: '若盛装 FeSO₄ 标准液的滴定管读数时“始平视、终仰视”，将导致算得的 COD 值偏低',
          isCorrect: true,
        },
        {
          label: 'D',
          text: '滴定前锥形瓶内留有少量蒸馏水，会导致消耗 FeSO₄ 的体积偏大，算得 COD 偏高',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【母题模型对齐】：考查返滴定法（Back Titration）代数消去关系。被测物消耗量 n(COD) = n(加入总 K₂Cr₂O₇) - (1/6) n(返滴定耗 Fe²⁺)。若返滴定标准液消耗量 V(FeSO₄) 测定值偏大（如终点仰视、未润洗滴定管），推算出的“残余 K₂Cr₂O₇ 量”偏大，进而导致反向推算出的“废水中 COD 消耗量”严重偏低！准确把握返滴定法“正向耗液偏大 → 结果反向偏低”的极值反转逻辑是突破高考压轴定量题的核心考点！',
      detailedExplanation:
        'A 项错误：盛装 FeSO₄ 的滴定管未润洗，使得标准液被稀释，滴定到达终点需消耗更大体积的 FeSO₄ 溶液，导致 V(FeSO₄) 读数偏大，算得残余 K₂Cr₂O₇ 偏大，最终计算出的 COD 测定值偏低；B 项错误：试亚铁灵指示剂在 Fe²⁺ 过量时呈红褐色，终点颜色变化为浅蓝绿变为红褐色；C 项正确：“始平视、终仰视”使得终点读数偏大，算出 ΔV(FeSO₄) 偏大，代入公式算得 COD 偏低；D 项错误：锥形瓶内蒸馏水不改变被测溶质摩尔数，无误差。',
    },
    {
      id: 'var-err-2',
      yearProvince: '2023 全国高考甲卷',
      modelId: 'model-titration-error-purity',
      title: '草酸钠纯度测定与高锰酸钾滴定视角读数误差分析',
      contextDescription:
        '称取 0.2680 g Na₂C₂O₄ 基准试剂样品于锥形瓶中，加入 50 mL 蒸馏水及 10 mL 3 mol/L 稀 H₂SO₄ 溶解，加热至 75~85 ℃，用 0.0400 mol/L KMnO₄ 标准溶液滴定至终点。反应离子方程式为：5C₂O₄²⁻ + 2MnO₄⁻ + 16H⁺ = 10CO₂↑ + 2Mn²⁺ + 8H₂O。实验中滴定管光路折射与视角读数示意图如图所示。',
      questionText: '关于该 KMnO₄ 滴定实验的操作及误差分析，下列说法正确的是（ ）',
      diagramType: 'titration-error-diagram',
      diagramConfig: {
        errorDiagramType: 'permanganate-view-angle',
        title: 'KMnO₄ 酸式滴定管视线折射与“始仰终俯”读数误差分析图',
      },
      options: [
        {
          label: 'A',
          text: 'KMnO₄ 标准溶液具有强氧化性，应装在带有橡胶管的碱式滴定管中',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '若读取 KMnO₄ 滴定管刻度时“始仰视、终俯视”，会导致测得的 Na₂C₂O₄ 纯度 w% 偏高',
          isCorrect: false,
        },
        {
          label: 'C',
          text: '滴定前滴定管尖嘴有气泡，滴定后气泡消失，会导致测得的 Na₂C₂O₄ 纯度 w% 偏高',
          isCorrect: true,
        },
        {
          label: 'D',
          text: '滴定终点判定：滴入最后一滴 KMnO₄ 溶液，锥形瓶内溶液由紫红色变无色且 30s 内不褪色',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【母题模型对齐】：考查直接滴定法中滴定管选择、终点判定与视线偏差代数计算。滴定管刻度自上而下递增（0 刻度在上）。“始仰视”读数 V(始) 偏大；“终俯视”读数 V(终) 偏小。消耗体积 ΔV = V(终) - V(始) 严重偏小，由纯度关系式 w% = [5/2 × c(KMnO₄) × ΔV × M(Na₂C₂O₄)] / m(样品) 得出算出的纯度 w% 严重偏低！气泡消失则多记了体积，导致纯度偏高。',
      detailedExplanation:
        'A 项错误：KMnO₄ 强氧化性会腐蚀橡胶管，必须装在酸式（或聚四氟乙烯）棕色滴定管中；B 项错误：“始仰视”使起点读数偏大，“终俯视”使终点读数偏小，导致算出的消耗体积 ΔV 严重偏小，测得样品纯度 w% 偏低；C 项正确：滴定前尖嘴有气泡，滴定后气泡消失，气泡体积被误计入 KMnO₄ 消耗量中，使 ΔV 读数偏大，算得纯度 w% 偏高；D 项错误：终点现象为“由无色变为粉红/紫红色且 30s 内不褪色”。',
    },
    {
      id: 'var-err-3',
      yearProvince: '2024 全国高考山东卷/湖南卷',
      modelId: 'model-titration-error-purity',
      title: '工业粗品碱式碳酸铜纯度与间接碘量法滴定计算',
      contextDescription:
        '实验室以粗铜为原料制备碱式碳酸铜 CuCO₃·Cu(OH)₂ (M = 222 g/mol)。称取制得的粗品样品 m = 2.500 g，用过量稀 H₂SO₄ 溶解，煮沸驱尽 CO₂。冷却后加入足量 KI 发生反应：2Cu²⁺ + 4I⁻ = 2CuI↓ + I₂。生成的 I₂ 用 0.1000 mol/L Na₂S₂O₃ 标准溶液滴定，以淀粉溶液为指示剂，滴定至终点消耗 Na₂S₂O₃ 溶液 20.00 mL。反应为：I₂ + 2S₂O₃²⁻ = 2I⁻ + S₄O₆²⁻。',
      questionText: '关于该实验的定量计算及误差分析，下列说法正确的是（ ）',
      diagramType: 'titration-error-diagram',
      diagramConfig: {
        errorDiagramType: 'iodometry-purity',
        title: '2Cu²⁺ ~ I₂ ~ 2S₂O₃²⁻ 间接碘量法关系链与淀粉指示终点图',
      },
      options: [
        {
          label: 'A',
          text: '间接碘量法定量关系式链为：1 mol CuCO₃·Cu(OH)₂ ～ 2 mol Cu²⁺ ～ 1 mol S₂O₃²⁻',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '配制 Na₂S₂O₃ 标准溶液定容时仰视刻度线，将导致最终测得的样品纯度偏低',
          isCorrect: false,
        },
        {
          label: 'C',
          text: '该粗品样品中 CuCO₃·Cu(OH)₂ 的质量分数为 8.88%',
          isCorrect: true,
        },
        {
          label: 'D',
          text: '淀粉指示剂应在滴定开始前加入，终点现象为溶液由无色变为蓝色且半分钟内不恢复',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【母题模型对齐】：考查多步反应关系式链与纯度计算：CuCO₃·Cu(OH)₂ ～ 2Cu²⁺ ～ I₂ ～ 2S₂O₃²⁻。关键在于计量数比：1 mol 碱式碳酸铜产生 2 mol Cu²⁺，消耗 2 mol Na₂S₂O₃！计算时 n(纯品) = 1/2 n(S₂O₃²⁻) = 1/2 × (0.1000 mol/L × 0.0200 L) = 0.0010 mol，m(纯品) = 0.0010 mol × 222 g/mol = 0.222 g，纯度 w% = (0.222 g / 2.500 g) × 100% = 8.88%。',
      detailedExplanation:
        'A 项错误：1 mol CuCO₃·Cu(OH)₂ 含有 2 mol Cu²⁺，对应生成 1 mol I₂，消耗 2 mol S₂O₃²⁻，定量比应为 1 mol 碱式碳酸铜 ～ 2 mol S₂O₃²⁻；B 项错误：配制标准液定容仰视加水过量，实际浓度 c(标) 偏低，滴定消耗 V(标) 偏大，导致测得纯度偏高；C 项正确：n(S₂O₃²⁻) = 0.1000 × 0.0200 = 0.0020 mol，n(碱式碳酸铜) = 0.0010 mol，m = 0.222 g，w% = 0.222 / 2.500 = 8.88%；D 项错误：淀粉指示剂若过早加入会吸附大量 I₂ 导致终点滞后，应在近终点（溶液呈浅黄色）时加入，终点现象为蓝色变为无色且 30s 内不恢复。',
    },
  ],
}
