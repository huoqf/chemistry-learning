import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'
import { leChatelierFormulas, leChatelierExamPoints } from '../quantities/reaction-principle/leChatelier'

export const reactionPrincipleAnimations = defineAnimations({
  'anim-le-chatelier': {
    title: '勒夏特列原理与化学平衡移动',
    knowledgeId: 'le-chatelier',
    Component: lazy(() => import('@/features/reaction-principle/le-chatelier')),
    controlsMode: 'timed',
    defaultParams: {
      temp: 298,
      pressure: 1.0,
      addedNO2: 0,
    } as const,
    paramMeta: [
      {
        key: 'temp',
        label: '体系温度 T',
        min: 273,
        max: 398,
        step: 5,
        unit: 'K',
        group: '反应条件',
        description: '升高温度向吸热反应方向（逆反应方向）移动',
      },
      {
        key: 'pressure',
        label: '相对压强 P',
        min: 0.5,
        max: 3.0,
        step: 0.1,
        unit: 'P₀',
        group: '反应条件',
        description: '增大压强向气体分子数减小（正反应方向）移动',
      },
      {
        key: 'addedNO2',
        label: '外加 NO₂ 浓度',
        min: 0,
        max: 2.0,
        step: 0.1,
        unit: 'mol/L',
        group: '反应物浓度',
        description: '增加反应物浓度使平衡正向移动',
      },
    ],
    controlMeta: [
      {
        type: 'tip',
        group: '实验操作指引',
        variant: 'primary',
        content: '调节左侧温度、压强或注入 NO₂ 反应物，观察主屏与图表中平衡向减弱改变方向移动的演化过程。',
      },
      {
        type: 'step',
        label: '注入一滴 NO₂ 气体',
        paramKey: 'addedNO2',
        step: 0.2,
        max: 2.0,
        unit: 'mol/L',
        resetTime: true,
        hint: '加试剂重置演化时间',
      },
    ],
    maxTime: 10,
    formulas: leChatelierFormulas,
    gaokaoPoints: leChatelierExamPoints,
  },
})
