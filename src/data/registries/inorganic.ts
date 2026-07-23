import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'
import { getRedoxFormulas, getRedoxExamPoints } from '../quantities/inorganic/redoxElectronTransfer'

export const inorganicAnimations = defineAnimations({
  'anim-redox-electron-transfer': {
    title: '电子转移与化合价',
    knowledgeId: 'redox-electron-transfer',
    Component: lazy(() => import('@/features/inorganic/redox-electron-transfer/RedoxElectronTransferAnimation')),
    controlsMode: 'timed',
    defaultParams: {
      reaction: 0,
      moleAmount: 1.0,
      bridgeStyle: 0,
    } as const,
    paramMeta: [
      {
        key: 'moleAmount',
        label: '反应基准物质的量',
        min: 0.1,
        max: 5.0,
        step: 0.1,
        unit: 'mol',
        group: '反应化学量',
      },
    ],
    controlMeta: [
      {
        type: 'segmented',
        key: 'reaction',
        group: '高考高频反应模型',
        resetOnChange: true,
        options: [
          { label: 'Na+Cl₂ (离子键)', value: 0 },
          { label: 'Zn+CuSO₄ (置换)', value: 1 },
          { label: 'MnO₂+HCl (部分氧化)', value: 2 },
          { label: 'KMnO₄+H₂O₂ (复杂守恒)', value: 3 },
        ],
      },
      {
        type: 'segmented',
        key: 'bridgeStyle',
        group: '表示法与微观视角',
        resetOnChange: false,
        options: [
          { label: '双线桥法', value: 0 },
          { label: '单线桥法', value: 1 },
          { label: '微观电子层', value: 2 },
        ],
      },
      {
        type: 'tip',
        group: '高考记忆口诀',
        content: '升失氧，降得还；剂性相反；电子守恒 $n(\\text{失}) = n(\\text{得}) = n(e^-)$',
      },
    ],
    formulas: (params: Record<string, number>) => getRedoxFormulas(params),
    gaokaoPoints: (params: Record<string, number>) => getRedoxExamPoints(params),
  },
})
