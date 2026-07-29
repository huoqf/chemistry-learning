import type { ModelQuizData } from './types'

export const modelReactionPrincipleNexus: ModelQuizData = {
  modelId: 'model-reaction-principle-nexus',
  scoringSteps: [
    {
      id: 'nexus-step-1',
      title: '一、活化能与反应热计算',
      type: 'keywords',
      questionText:
        '在化学反应势能图谱中，正反应活化能为 Ea(正)，逆反应活化能为 Ea(逆)。请写出反应热 ΔH 的计算公式，并指出当 Ea(正) < Ea(逆) 时反应的吸放热性质：',
      formulaLatex: '\\Delta H = E_{a(\\text{正})} - E_{a(\\text{逆})}',
      placeholder: '输入公式与吸/放热结论...',
      correctAnswer: ['ΔH = Ea(正) - Ea(逆)', '放热', '放热反应'],
      explanation:
        '根据能量守恒，反应热等于正反应活化能减去逆反应活化能。当 Ea(正) < Ea(逆) 时，ΔH < 0，反应为放热反应。',
    },
    {
      id: 'nexus-step-2',
      title: '二、多步催化历程与决速步判定',
      type: 'keywords',
      questionText:
        '在多步催化反应历程中，决定整体反应速率的关键步骤被称为“决速步”。请说明决速步在能量图谱上的特征以及催化剂的作用本质：',
      formulaLatex: 'E_a(\\text{决速步}) = \\max(E_{a1}, E_{a2}, \\dots)',
      placeholder: '说明活化能最大与催化剂作用...',
      correctAnswer: ['活化能最大', '降低活化能', '改变反应历程', '决速步'],
      explanation:
        '多步反应中活化能 Ea 最高（即势能垒最陡高）的步骤反应最慢，决定整体反应速率；催化剂通过改变反应路径、降低决速步的活化能来显著加快反应速率。',
    },
    {
      id: 'nexus-step-3',
      title: '三、升温时反应速率与平衡移动的表达',
      type: 'keywords',
      questionText:
        '对于放热反应 (ΔH < 0)，升高温度时正、逆反应速率的变化情况及平衡移动方向的规范化学表达为：',
      placeholder: '写出正逆速率均增大及 v逆 > v正...',
      correctAnswer: [
        '正逆反应速率均增大',
        'v逆大于v正',
        '逆向移动',
        '吸热方向',
      ],
      explanation:
        '升温使正、逆反应速率均增大，但吸热方向（逆反应）速率增大的程度大于放热方向（正反应）速率增大的程度，即 v(逆) > v(正)，平衡向吸热方向（逆向）移动。',
    },
    {
      id: 'nexus-step-4',
      title: '四、惰性气体对平衡移动的影响',
      type: 'keywords',
      questionText:
        '对于反应 2NO₂(g) ⇌ N₂O₄(g)，充入惰性气体 (He) 时：① 恒温恒容条件下，平衡__移动；② 恒温恒压条件下，平衡__移动。',
      placeholder: '不 / 逆向...',
      correctAnswer: ['不移动', '逆向', '逆向移动'],
      explanation:
        '① 恒温恒容：充入 He 气，反应物和生成物的分压/浓度均未改变，v(正) = v(逆)，平衡不移动；② 恒温恒压：充入 He 气导致容器体积膨胀，各组分分压减小（相当于减压），平衡向气体分子数增大的逆反应方向移动。',
    },
    {
      id: 'nexus-step-5',
      title: '五、压强平衡常数 Kp 计算',
      type: 'calculation',
      questionText:
        '在 T K 时，体系总压为 P_tot。若反应 A(g) ⇌ 2B(g) 达平衡时 A 的物质的量分数为 x_A，B 的物质的量分数为 x_B。请给出 Kp 的分压表达式：',
      formulaLatex:
        'K_p = \\frac{p^2(B)}{p(A)} = \\frac{(x_B \\cdot P_{\\text{tot}})^2}{x_A \\cdot P_{\\text{tot}}}',
      placeholder: '输入 Kp 表达式...',
      correctAnswer: ['(xB * P)^2 / (xA * P)', '(xB)^2 * P / xA'],
      explanation:
        '分压等于总压乘以物质的量分数 p(i) = x_i * P_tot。将 p(B) = x_B * P_tot 和 p(A) = x_A * P_tot 代入 Kp = p(B)^2 / p(A) 整理即可得到。',
    },
  ],
  variantQuizzes: [
    {
      id: 'nexus-var-1',
      yearProvince: '2023 全国高考甲卷真题',
      modelId: 'model-reaction-principle-nexus',
      title: 'CO₂ 加氢合成甲醇反应历程与活化能图谱',
      contextDescription:
        'CO₂ 催化加氢制甲醇的主要反应历程如图所示。中间体为 *HCOO 和 *H₂CO。无催化剂与在 Cu/ZnO 催化剂作用下的势能变化曲线包含多步过渡态 TS1、TS2。',
      questionText: '下列关于该反应历程与催化机理的说法正确的是（ ）',
      options: [
        {
          label: 'A',
          text: '使用 Cu/ZnO 催化剂降低了整体反应的 ΔH',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '决速步为活化能最大的步骤：*HCOO + *H → *H₂CO',
          isCorrect: true,
        },
        {
          label: 'C',
          text: '升温能同等程度增大 TS1 和 TS2 的生成速率，且平衡不移动',
          isCorrect: false,
        },
        {
          label: 'D',
          text: '加入催化剂后，逆反应的活化能不变',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【母题模型对齐】：本题考查活化能量山峰与多步过渡态(TS)。催化剂只改变反应途径、降低正逆反应活化能，但不改变反应始态和终态的能量差 ΔH。活化能 Ea 最高的步骤为决速步。',
      detailedExplanation:
        '解析：A项，催化剂不能改变反应热 ΔH，错误；B项，由历程势能图可知 *HCOO + *H → *H₂CO 对应的势能垒 (Ea) 最高，为决速步，正确；C项，该反应为放热反应，升温平衡逆向移动，错误；D项，加入催化剂同等降低正、逆反应活化能，逆反应活化能变小，错误。',
      diagramType: 'titration-curve',
      diagramConfig: {
        title: 'CO₂ 加氢合成甲醇催化反应历程 (Ea 图谱)',
      },
    },
    {
      id: 'nexus-var-2',
      yearProvince: '2024 山东高考化学真题',
      modelId: 'model-reaction-principle-nexus',
      title: 'ln K - 1/T 范特霍夫图谱与热力学推导',
      contextDescription:
        '在密闭容器中研究反应 2A(g) ⇌ B(g) + C(g) 的平衡常数 K 随温度 T 的变化，以 ln K 对 1/T 作图得到一条倾斜直线。',
      questionText: '已知直线斜率 k > 0。下列说法正确的是（ ）',
      options: [
        {
          label: 'A',
          text: '该反应为吸热反应 (ΔH > 0)',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '升高温度，平衡常数 K 增大',
          isCorrect: false,
        },
        {
          label: 'C',
          text: '该反应的 ΔH < 0，升高温度平衡向逆反应方向移动',
          isCorrect: true,
        },
        {
          label: 'D',
          text: '增大压强，直线斜率 k 增大',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【母题模型对齐】：范特霍夫方程为 ln K = -ΔH / (R * T) + C。以 ln K 对 1/T 作图，斜率为 -ΔH / R。若斜率 > 0，则 -ΔH / R > 0 ⇒ ΔH < 0 (放热反应)。',
      detailedExplanation:
        '解析：斜率 -ΔH / R > 0 说明 ΔH < 0，反应放热。放热反应升高温度 T，1/T 减小，ln K 减小，K 减小，平衡逆向移动。平衡常数 K 仅与温度有关，压强改变不改变斜率。因此 C 正确。',
      diagramType: 'distribution-fraction',
      diagramConfig: {
        title: 'ln K - 1/T 范特霍夫线性关系图谱',
      },
    },
    {
      id: 'nexus-var-3',
      yearProvince: '2022 全国乙卷高考真题',
      modelId: 'model-reaction-principle-nexus',
      title: '2NO₂(g) ⇌ N₂O₄(g) v-t 速率-时间图与勒夏特列移动',
      contextDescription:
        '对于反应 2NO₂(g) (红棕色) ⇌ N₂O₄(g) (无色) ΔH < 0，在 t₁ 时刻改变某一条件，v-t 图像中 v(正) 瞬间不变，v(逆) 瞬间增大，随后二者逐渐靠近并在 t₂ 时刻达到新平衡。',
      questionText: '在 t₁ 时刻改变的条件是（ ）',
      options: [
        {
          label: 'A',
          text: '升高温度',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '增大压强 (压缩体积)',
          isCorrect: false,
        },
        {
          label: 'C',
          text: '增大 N₂O₄ 浓度',
          isCorrect: true,
        },
        {
          label: 'D',
          text: '加入高效催化剂',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【母题模型对齐】：勒夏特列移动 v-t 图像判断核心：① 若某一速率瞬间不变而另一速率瞬间改变，说明改变的是单一产物/反应物的浓度突变；② 若两速率均瞬间跳跃，说明是温度、压强或催化剂。',
      detailedExplanation:
        '解析：t₁ 时刻 v(正) 瞬间不变，说明反应物 NO₂ 浓度未突变；v(逆) 瞬间增大，说明生成物 N₂O₄ 浓度瞬间增大。随后 v(逆) 逐渐减小，v(正) 逐渐增大，平衡逆向移动。因此改变条件为增大 N₂O₄ 浓度，选 C。',
      diagramType: 'precipitation-curve',
      diagramConfig: {
        title: '2NO₂ ⇌ N₂O₄ 反应速率-时间 (v - t) 突变图谱',
      },
    },
  ],
}
