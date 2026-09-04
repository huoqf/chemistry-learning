export type ReagentSceneId = 'fe-air-ox' | 'al-amphoteric' | 'cu-ammonia' | 'fe-test' | 'ag-trans'

export interface ReagentStepPoint {
  /** 滴加量/进度 (0 ~ 1) */
  progress: number
  /** 阶段标题 */
  title: string
  /** 现象描述（高考标准用语） */
  description: string
  /** 溶液颜色 Hex/RGBA */
  solutionColor: string
  /** 溶液透明度 (0~1) */
  solutionOpacity: number
  /** 沉淀类型/名称 */
  precipitateText: string
  /** 沉淀颜色 Hex */
  precipitateColor: string
  /** 沉淀填充比例 (0~1) */
  precipitateLevel: number
  /** 离子/化学方程式 */
  equation: string
  /** 估算 pH */
  ph: number
}

export interface ReagentSceneConfig {
  id: ReagentSceneId
  title: string
  subtitle: string
  beakerSolution: string
  dropperReagent: string
  badgeText: string
  examPoints: string[]
  keyWarning: string
  steps: ReagentStepPoint[]
  /** 模式选项支持 */
  supportsAirIsolation?: boolean
  supportsAlMode?: boolean
  supportsReverseTitration?: boolean
  supportsWeakBase?: boolean
  /** 实验指引与核心设问 (铁律 3C) */
  guidance?: {
    condition: string
    coreQuestion: string
    observation: string
  }
}

export type AlTitrationMode = 'forward-strong' | 'reverse-strong' | 'forward-weak'

export type ViewMode = 'animation' | 'scoring' | 'quiz'
