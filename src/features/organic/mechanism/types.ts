/**
 * 有机反应机制场景共享类型
 *
 * 所有 scene 组件接收统一的 MechanismSceneProps，
 * 不依赖 viewport / sceneScale，仅使用 design-space 坐标。
 */

export type ReactionMechanismType =
  | 'esterification'
  | 'addition'
  | 'oxidation'
  | 'elimination'
  | 'peptide'
  | 'phenol'

/**
 * 所有 scene 组件共享的输入参数
 */
export interface MechanismSceneProps {
  /** 反应阶段：0=反应物, 1=断键过渡, 2=生成产物 */
  reactionStage: number
  /** 字体缩放函数，所有 SVG fontSize 必须由 font() 包裹 */
  font: (n: number) => number
}

/**
 * 酯化机制额外参数
 */
export interface EsterificationSceneProps extends MechanismSceneProps {
  /** 是否显示 ¹⁸O 同位素示踪高亮 */
  show18OTracing: boolean
}

/**
 * 醇催化氧化额外参数
 */
export interface AlcoholOxidationSceneProps extends MechanismSceneProps {
  /** 是否使用叔丁醇 (无 α-H 反例) */
  useTertiaryAlcohol: boolean
}

export interface OrganicMechanismCanvasProps {}
