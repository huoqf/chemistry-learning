import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'

export const experimentAnimations = defineAnimations({
  'anim-extraction-distillation': {
    title: '萃取分液与蒸馏实验',
    knowledgeId: 'extraction-distillation',
    Component: lazy(() => import('@/features/experiment/extraction-distillation/ExtractionDistillationAnimation')),
    controlsMode: 'timed',
    defaultParams: {
      experimentMode: 0, // 0: 萃取分液, 1: 蒸馏分馏
      solvent: 0, // 0: CCl4, 1: 苯
      misoperation: 0, // 0: 规范操作, 1: 温度计深入液面, 2: 冷凝水上进下出, 3: 未加沸石/碎瓷片
      power: 500, // 蒸馏加热功率 (W)
      vSolvent: 20, // 萃取剂体积 (mL)
    } as const,
    paramMeta: [
      {
        key: 'power',
        label: '蒸馏加热功率',
        min: 200,
        max: 800,
        step: 50,
        unit: 'W',
        group: '蒸馏参数',
        showIf: 'experimentMode',
        showIfValue: 1,
      },
      {
        key: 'vSolvent',
        label: '萃取剂体积',
        min: 10,
        max: 50,
        step: 5,
        unit: 'mL',
        group: '萃取参数',
        showIf: 'experimentMode',
        showIfValue: 0,
      },
    ],
    controlMeta: [
      {
        type: 'segmented',
        key: 'experimentMode',
        group: '实验原理选择',
        resetOnChange: true,
        options: [
          { label: '萃取与分液 (I₂-水)', value: 0 },
          { label: '蒸馏与分馏 (I₂-CCl₄)', value: 1 },
        ],
      },
      {
        type: 'segmented',
        key: 'solvent',
        group: '萃取剂选择 (密度对比)',
        resetOnChange: true,
        showIf: 'experimentMode',
        showIfValue: 0,
        options: [
          { label: 'CCl₄ (下层紫红)', value: 0 },
          { label: '苯 (上层橙红)', value: 1 },
        ],
      },
      {
        type: 'segmented',
        key: 'misoperation',
        group: '高考易错操作模拟诊断',
        resetOnChange: true,
        showIf: 'experimentMode',
        showIfValue: 1,
        options: [
          { label: '标准规范操作', value: 0 },
          { label: '温度计深入液面', value: 1 },
          { label: '冷凝水上进下出', value: 2 },
          { label: '忘记加入沸石', value: 3 },
        ],
      },
      {
        type: 'tip',
        group: '高考避坑解析',
        content: '分液漏斗放液前必须拿开顶部玻璃塞；蒸馏烧瓶水银球需置于支管口处；直形冷凝管必须下进上出冷却水。',
      },
    ],
    formulas: (params: Record<string, number>) => {
      const mode = params.experimentMode ?? 0
      if (mode === 0) {
        return [
          {
            name: '萃取分配定律',
            latex: 'K = \\frac{c_{\\text{org}}}{c_{\\text{aq}}} = \\text{Const}',
            description: '一定温度和压强下，溶质在互不相溶的两种溶剂中的溶解平衡分配系数',
            level: 'core' as const,
          },
          {
            name: '多次萃取残留率公式',
            latex: 'w_n = \\left( \\frac{V_{\\text{aq}}}{V_{\\text{aq}} + K \\cdot V_{\\text{org}}} \\right)^n',
            description: '少量多次萃取效率远高于一次性大体积萃取',
            level: 'important' as const,
          },
        ]
      } else {
        return [
          {
            name: '蒸馏气液相平衡',
            latex: 'p_i = p_i^* \\cdot x_i',
            description: '低沸点组分蒸气压大优先汽化，利用沸点差异分离混合物',
            level: 'core' as const,
          },
          {
            name: '蒸气冷凝放热方程',
            latex: 'Q_{\\text{cool}} = m \\cdot \\Delta H_{\\text{vap}} = c_w \\cdot m_w \\cdot \\Delta T_w',
            description: '直形冷凝管下进上出确保逆流高效冷却与管内满水',
            level: 'important' as const,
          },
        ]
      }
    },
    gaokaoPoints: (params: Record<string, number>) => {
      const mode = params.experimentMode ?? 0
      if (mode === 0) {
        return [
          {
            text: '【分液检漏与放气】使用前装水倒置检漏；振荡时倒转漏斗打开活塞释放蒸气压。',
            importance: 'must-know' as any,
          },
          {
            text: '【拔塞与下放上倒】放液前拿开顶部塞子；下层液体从下口流出，上层液体从上口倒出。',
            importance: 'gaokao' as any,
          },
          {
            text: '【萃取剂选择原则】①不互溶；②溶解度远大于原溶剂；③不反应。',
            importance: 'core' as any,
          },
        ]
      } else {
        return [
          {
            text: '【水银球位置】温度计水银球必须置于蒸馏烧瓶支管口处，测蒸气温度。',
            importance: 'gaokao' as any,
          },
          {
            text: '【碎瓷片防暴沸】加热前加2~3粒碎瓷片；若忘记加，须冷却后再补加。',
            importance: 'must-know' as any,
          },
          {
            text: '【冷凝水下进上出】直形冷凝管必须下进上出（逆流冷却），保证管内满水。',
            importance: 'core' as any,
          },
          {
            text: '【接收器防密闭】牛角管下端靠瓶内壁，接收瓶不可密封，防超压炸裂。',
            importance: 'hard' as any,
          },
        ]
      }
    },
  },
})
