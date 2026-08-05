import { SeparatoryFunnelSetup } from '@/components/Chemistry'
import type { FontScaler } from '@/theme'
import type { SceneScale } from '@/scene'
import type { ExtractionState } from '../hooks/useExtractionDistillationChemistry'

interface ExtractionSceneProps {
  extraction: ExtractionState
  font: FontScaler
  sceneScale: SceneScale
}

/**
 * ExtractionScene — 萃取分液实验场景组件
 *
 * 预制装配体范式重构：
 * 彻底解耦散装坐标推算，直接调用高阶 `<SeparatoryFunnelSetup />` 装配体组件。
 */
export function ExtractionScene({ extraction, font }: ExtractionSceneProps) {
  return <SeparatoryFunnelSetup extraction={extraction} font={font} />
}
