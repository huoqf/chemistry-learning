import type { LazyExoticComponent, ComponentType, ReactNode } from 'react'
import type { SceneLayoutProfile } from '@/scene'

export type InteractionType =
  | '3d-rotate'
  | 'bond-break'
  | 'particle-sandbox'
  | 'ion-flow'
  | 'valence-matrix'
  | 'crystal-cell'
  | 'macro-experiment'
  | 'chart-analysis'

export interface KnowledgeNode {
  id: string
  title: string
  chapter: string
  module: string
  importance: 'basic' | 'core' | 'gaokao' | 'hard' | 'extend'
  animationIds: string[]
  prerequisites: string[]
  parentId?: string
  /** 跳转动画时注入的参数覆盖，合并到 defaultParams 之上 */
  animationParams?: Record<string, number>
  /** 交互功能标签：标识该考点支持的动画交互类型 */
  interactionTags?: InteractionType[]
  /** 关联的高考提分母题专题 ID 列表 */
  relatedModelIds?: string[]
}

export type ParamImportance = 'core' | 'advanced' | 'display'

export type ParamMarkVariant = 'zero' | 'critical' | 'recommended'

export interface ParamMark {
  value: number
  label?: string
  variant?: ParamMarkVariant
}

export interface ControlCondition {
  group?: string
  showIf?: string
  showIfValue?: number
  hideIf?: string
  hideIfValue?: number
  onChangeSideEffect?: {
    resetParams?: string[]
    setParams?: Record<string, number>
  } | ((newValue: number, currentParams: Record<string, number>) => {
    resetParams?: string[]
    setParams?: Record<string, number>
  } | undefined)
}

export interface ControlOption {
  value: number
  label: string | ReactNode
  description?: string
}

export type ControlMeta =
  | (ControlCondition & {
      type: 'number'
      key: string
      label: string | ReactNode
      min: number
      max: number
      step?: number
      unit?: string
      description?: string
      resetOnChange?: boolean
      /** 滑块轨道标注点（支持冲突自动避让） */
      marks?: ParamMark[]
      /** 是否显示数字输入框（可直接编辑数值） */
      showInput?: boolean
    })
  | (ControlCondition & {
      type: 'segmented'
      key: string
      label?: string | ReactNode
      options: ControlOption[]
      resetOnChange?: boolean
    })
  | (ControlCondition & {
      type: 'toggle'
      key: string
      label: string | ReactNode
      trueValue?: number
      falseValue?: number
      resetOnChange?: boolean
    })
  | (ControlCondition & {
      type: 'preset'
      label: string | ReactNode
      params: Record<string, number> | ((current: Record<string, number>) => Record<string, number>)
      description?: string
      resetOnApply?: boolean
      restartOnApply?: boolean
    })
  | (ControlCondition & {
      type: 'tip'
      title?: string | ReactNode
      content: string | ((params: Record<string, number>) => string)
      variant?: 'info' | 'primary' | 'warning'
    })
  | (ControlCondition & {
      type: 'action'
      label: string | ReactNode
      variant?: 'primary' | 'secondary' | 'danger'
      action: 'launch' | 'restart' | 'reset' | 'setDirection' | 'setDirectionAndRestart' | 'resetAndRestart'
      directionValue?: 1 | -1
      setParams?: Record<string, number>
    })
  | (ControlCondition & {
      type: 'storeToggle'
      label: string | ReactNode
      storeKey: 'toggleVectors' | 'toggleTimeSlices' | 'toggleDualObjects'
      stateKey: 'showVectors' | 'showTimeSlices' | 'showDualObjects'
    })
  | (ControlCondition & {
      type: 'modeGrid'
      key: string
      modes: Array<{ value: number; label: string | ReactNode; description: string }>
      label?: string | ReactNode
      cols?: number
      resetOnChange?: boolean
    })
  | (ControlCondition & {
      type: 'step'
      /** 步进按钮标签，如 "加入 NaOH" */
      label: string | ReactNode
      /** 目标参数 key */
      paramKey: string
      /** 每步增量（正数增加，负数减少） */
      step: number
      /** 参数上限，超过后按钮禁用 */
      max?: number
      /** 参数下限，低于后按钮禁用 */
      min?: number
      /** 步进后重置时间（默认 true，因为化学加试剂后反应重新开始） */
      resetTime?: boolean
      /** 按钮图标提示，如 "滴加" */
      hint?: string
      /** 步进单位，如 "滴" / "mL" */
      unit?: string
    })

export interface ParamMeta {
  key: string
  label: string | ReactNode
  min: number
  max: number
  step?: number
  unit?: string
  group?: string
  description?: string
  marks?: ParamMark[]
  importance?: ParamImportance
  resetOnChange?: boolean
  showIf?: string
  showIfValue?: number
  hideIf?: string
  hideIfValue?: number
}

export interface AnimationActions {
  resetAnimation: () => void
  pauseAnimation: () => void
  restartAnimation: () => void
  setDirection: (d: 1 | -1) => void
}

export interface AnimationConfig<P extends Record<string, number> = Record<string, number>> {
  id: string
  title: string
  knowledgeId: string
  Component: LazyExoticComponent<ComponentType> & { preload?: () => Promise<void> }
  defaultParams: P
  paramMeta?: ParamMeta[]
  buildParamMeta?: (params: Record<string, number>) => ParamMeta[]
  controlMeta?: ControlMeta[]
  supportsDiscovery?: boolean
  DiscoveryComponent?: LazyExoticComponent<ComponentType>
  discoverySteps?: () => Promise<{ default: import('@/components/UI').DiscoveryStepData[] }>
  CenterExtra?: LazyExoticComponent<ComponentType>
  centerExtraHeight?: string
  centerExtraMode?: string
  centerLayout?: 'splitH' | 'splitV'
  maxTime?: number
  sceneLayout?: SceneLayoutProfile
  controlsMode?: 'timed' | 'loop' | 'param' | 'pause-only' | ((params: Record<string, number>) => 'timed' | 'loop' | 'param' | 'pause-only')
  /** 化学平衡条件终止：当返回 true 时自动暂停并标记已达到平衡 */
  stopCondition?: (params: P, t: number) => boolean
  /** 右侧屏：公式列表 */
  formulas?: Array<{ name: string; latex: string; condition?: string; note?: string; level?: 'core' | 'important' | 'derived' | 'supplementary' }>
  /** 右侧屏：高考要点 */
  gaokaoPoints?: Array<{ text: string; importance: 'gaokao' | 'hard' | 'core' | 'basic' | 'extend' }>
  /** 右侧屏：警示信息 */
  warnings?: Array<{ text: string; level: 'info' | 'warning' | 'danger' }>
  /** "微观-宏观-符号"三重表征支持 */
  tripleRepresentation?: {
    micro: boolean
    macro: boolean
    symbol: boolean
  }
}