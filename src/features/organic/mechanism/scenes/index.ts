import type { MechanismSceneProps } from '../types'
import { EsterificationScene } from './EsterificationScene'
import { AlkeneAdditionScene } from './AlkeneAdditionScene'
import { AlcoholOxidationScene } from './AlcoholOxidationScene'
import { EliminationScene } from './EliminationScene'
import { PeptideBondScene } from './PeptideBondScene'
import { PhenolFormaldehydeScene } from './PhenolFormaldehydeScene'

export type SceneRenderer = React.FC<MechanismSceneProps & Record<string, unknown>>

export const scenes: Record<number, SceneRenderer> = {
  0: EsterificationScene as unknown as SceneRenderer,
  1: AlkeneAdditionScene as SceneRenderer,
  2: AlcoholOxidationScene as unknown as SceneRenderer,
  3: EliminationScene as SceneRenderer,
  4: PeptideBondScene as SceneRenderer,
  5: PhenolFormaldehydeScene as SceneRenderer,
}

export { EsterificationScene, AlkeneAdditionScene, AlcoholOxidationScene, EliminationScene, PeptideBondScene, PhenolFormaldehydeScene }
