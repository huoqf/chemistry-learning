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
      solvent: 0, // 0: CCl4, 1: 苯, 2: 乙醇 (高考反例)
      misoperation: 0, // 蒸馏易错操作: 0: 规范操作, 1: 温度计深入液面, 2: 冷凝水上进下出, 3: 未加沸石/碎瓷片, 4: 接收瓶密闭
      extractionMisoperation: 0, // 萃取易错操作: 0: 规范操作, 1: 未拔塞放液(负压阻断), 2: 上层液体由下口放出(污染)
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
        group: '萃取剂选择 (密度与互溶性对比)',
        resetOnChange: true,
        showIf: 'experimentMode',
        showIfValue: 0,
        options: [
          { label: 'CCl₄ (下层紫红)', value: 0 },
          { label: '苯 (上层橙红)', value: 1 },
          { label: '乙醇 (互溶不分层 ❌)', value: 2 },
        ],
      },
      {
        type: 'segmented',
        key: 'extractionMisoperation',
        group: '萃取易错操作诊断',
        resetOnChange: true,
        showIf: 'experimentMode',
        showIfValue: 0,
        options: [
          { label: '标准规范操作', value: 0 },
          { label: '未拔塞放液 (负压阻断)', value: 1 },
        ],
      },
      {
        type: 'segmented',
        key: 'misoperation',
        group: '蒸馏易错操作模拟诊断',
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
        content: '【分液铁律】双手倒持放气，拔塞连通大气，下层下放下口贴壁，上层上倒！【蒸馏铁律】陶土网加热，水银球对准支管口，下进上出满水逆流，冷却补沸石！',
      },
    ],
    formulas: (params: Record<string, number>) => {
      const mode = params.experimentMode ?? 0
      if (mode === 0) {
        return [
          {
            name: '萃取分配定律 (能斯特分配定律)',
            latex: 'K = \\frac{c_{\\text{org}}}{c_{\\text{aq}}} = \\text{Const}',
            description: '一定温度和压强下，溶质在互不相溶的两种溶剂中的溶解平衡分配系数',
            level: 'core' as const,
          },
          {
            name: '多次萃取残留率公式',
            latex: 'w_n = \\left( \\frac{V_{\\text{aq}}}{V_{\\text{aq}} + K \\cdot V_{\\text{org}}} \\right)^n',
            description: '相同萃取剂总体积下，少量多次萃取效率显著高于一次性大体积萃取',
            level: 'important' as const,
          },
        ]
      } else {
        return [
          {
            name: '蒸馏气液相平衡 (拉乌尔-道尔顿定律)',
            latex: 'p_i = p_i^* \\cdot x_i = y_i \\cdot P_{\\text{total}}',
            description: '低沸点组分蒸气压大优先汽化进入气相，利用沸点差异分离互溶液体',
            level: 'core' as const,
          },
          {
            name: '逆流热交换传热方程',
            latex: '\\Phi = K_{\\text{heat}} \\cdot A \\cdot \\Delta T_m = c_w \\cdot q_{m,w} \\cdot (T_{\\text{out}} - T_{\\text{in}})',
            description: '直形冷凝管下进上出实现逆流高效热交换并确保套管 100% 满水',
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
            text: '【萃取剂选择三原则】①与原溶剂互不相溶；②溶质在萃取剂中溶解度远大于原溶剂；③与溶质/原溶剂不反应。乙醇与水互溶不可做萃取剂！',
            importance: 'must-know' as any,
          },
          {
            text: '【倒转放气姿态】右手食指顶住玻璃塞，左手握住活塞，倒转分液漏斗使下口朝斜上方，旋开活塞放气。',
            importance: 'gaokao' as any,
          },
          {
            text: '【拔塞通大气与下放下倒】放液前必须拔开玻璃塞（或凹槽对准小孔）；下层液体由下口靠壁放出；关活塞，上层液体由上口倒入另一烧杯。',
            importance: 'core' as any,
          },
        ]
      } else {
        return [
          {
            text: '【陶土网与装液量】蒸馏烧瓶不可直火加热，必须垫陶土网；液体量控制在烧瓶容积的 1/3 ~ 2/3 之间。',
            importance: 'must-know' as any,
          },
          {
            text: '【水银球位置】温度计水银球必须与蒸馏烧瓶支管口中央平齐，测定逸出蒸气的沸点。',
            importance: 'gaokao' as any,
          },
          {
            text: '【沸石防暴沸与冷却补加】加热前加 2~3 粒沸石/碎瓷片；若加热后发现未加，严禁直接加入，必须停止加热、冷却后再补加！',
            importance: 'gaokao' as any,
          },
          {
            text: '【冷凝管与通大气】选用直形冷凝管且冷却水下进上出（逆流满水）；牛角管伸入锥形瓶但不可密闭，保持体系通大气。',
            importance: 'core' as any,
          },
        ]
      }
    },
  },
})
