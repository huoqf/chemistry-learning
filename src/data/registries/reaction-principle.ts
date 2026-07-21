import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'
import { leChatelierFormulas, leChatelierExamPoints } from '../quantities/reaction-principle/leChatelier'
import { collisionTheoryFormulas, collisionTheoryExamPoints } from '../quantities/reaction-principle/collisionTheory'

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
    tripleRepresentation: {
      micro: true,
      macro: true,
      symbol: true,
    },
  },
  'anim-collision-theory': {
    title: '碰撞理论与反应速率影响因素',
    knowledgeId: 'rate-theory',
    Component: lazy(() => import('@/features/reaction-principle/collision-theory/CollisionTheoryAnimation')),
    controlsMode: 'param',
    defaultParams: {
      temperature: 298,
      concentration: 1.0,
      catalyst: 0,
    } as const,
    paramMeta: [
      {
        key: 'temperature',
        label: '体系温度 T',
        min: 273,
        max: 398,
        step: 5,
        unit: 'K',
        group: '反应条件',
        description: '升高温度增加活化分子比例与碰撞频率',
      },
      {
        key: 'concentration',
        label: '反应物浓度 c',
        min: 0.5,
        max: 3.0,
        step: 0.1,
        unit: 'mol/L',
        group: '反应条件',
        description: '增大浓度增加单位体积内分子数与碰撞频率',
      },
    ],
    controlMeta: [
      {
        type: 'toggle',
        label: '加入催化剂',
        key: 'catalyst',
        trueValue: 1,
        falseValue: 0,
      },
      {
        type: 'tip',
        group: '实验指引',
        variant: 'primary',
        content: '调节温度、浓度和催化剂，观察微观粒子碰撞频率与有效碰撞比例的变化。红色粒子为活化分子。',
      },
    ],
    formulas: collisionTheoryFormulas,
    gaokaoPoints: collisionTheoryExamPoints,
    tripleRepresentation: {
      micro: true,
      macro: false,
      symbol: true,
    },
  },
})
