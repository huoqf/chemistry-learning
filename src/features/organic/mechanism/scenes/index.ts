import type { MechanismSceneProps } from '../types'
import { EsterificationScene } from './EsterificationScene'
import { AlkeneAdditionScene } from './AlkeneAdditionScene'
import { AlcoholOxidationScene } from './AlcoholOxidationScene'
import { EliminationScene } from './EliminationScene'
import { PeptideBondScene } from './PeptideBondScene'
import { PhenolFormaldehydeScene } from './PhenolFormaldehydeScene'

export type SceneRenderer = React.FC<MechanismSceneProps & Record<string, unknown>>

export const scenes: Record<number, SceneRenderer> = {
  0: AlkeneAdditionScene as SceneRenderer,
  1: EliminationScene as unknown as SceneRenderer,
  2: AlcoholOxidationScene as unknown as SceneRenderer,
  3: EsterificationScene as unknown as SceneRenderer,
  4: PhenolFormaldehydeScene as SceneRenderer,
  5: PeptideBondScene as SceneRenderer,
}

export { EsterificationScene, AlkeneAdditionScene, AlcoholOxidationScene, EliminationScene, PeptideBondScene, PhenolFormaldehydeScene }
