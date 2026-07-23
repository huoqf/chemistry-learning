import type { FontScaler } from '@/theme'
import type { SceneScale } from '@/scene'
import type { ExtractionDistillationChemistryResult } from '../hooks/useExtractionDistillationChemistry'
import { ExtractionScene } from './ExtractionScene'
import { DistillationScene } from './DistillationScene'

interface ExtractionDistillationSceneProps {
  chemistry: ExtractionDistillationChemistryResult
  canvasSize: { font: FontScaler }
  sceneScale: SceneScale
}

export function ExtractionDistillationScene({ chemistry, canvasSize, sceneScale }: ExtractionDistillationSceneProps) {
  const { experimentMode, extraction, distillation } = chemistry
  const { font } = canvasSize

  return (
    <g>
      {experimentMode === 0 ? (
        <ExtractionScene extraction={extraction} font={font} sceneScale={sceneScale} />
      ) : (
        <DistillationScene distillation={distillation} font={font} sceneScale={sceneScale} />
      )}
    </g>
  )
}
