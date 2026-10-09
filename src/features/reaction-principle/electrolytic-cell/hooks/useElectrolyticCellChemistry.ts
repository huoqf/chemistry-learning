import { useCallback, useMemo } from 'react'
import { electrolysisState, transferredElectronMoles } from '@/chemistry'

export interface UseElectrolyticCellChemistryParams {
  cellType: number // 0: CuCl2, 1: CuSO4, 2: NaCl(氯碱), 3: Cu精炼, 4: Al2O3熔融
  anodeMaterial: number // 0: 惰性石墨, 1: 活性铜
  membraneType?: number // 0: 阳离子膜, 1: 无膜
  current: number // A
  time: number // s
}

export interface MassPoint {
  time: number
  anodeDeltaM: number
  cathodeDeltaM: number
  vAnodeGas: number
  vCathodeGas: number
}

export interface IonPoint {
  time: number
  ne: number
  cMain: number
  pH: number
}

export interface ElectrolyticCellChemistryResult {
  ne: number
  anodeDeltaM: number
  cathodeDeltaM: number
  vAnodeGas: number
  vCathodeGas: number
  cMain: number
  pH: number
  anodeProduct: string
  cathodeProduct: string
  anodeEquation: string
  cathodeEquation: string
  overallEquation: string
  massHistory: MassPoint[]
  ionHistory: IonPoint[]
}

const MAX_TIME = 10
const TIME_STEPS = 50

export function useElectrolyticCellChemistry({
  cellType,
  anodeMaterial,
  current,
  time,
}: UseElectrolyticCellChemistryParams): ElectrolyticCellChemistryResult {
  // 计算单一时间点下各种量。
  // 与右屏量面板共用 @/chemistry/electrolysis 的同一模型，禁止两处各写一份。
  const computeStateAtTime = useCallback((t: number) => {
    const neRaw = transferredElectronMoles(current, t)
    const ne = parseFloat(neRaw.toFixed(4))
    const state = electrolysisState(cellType, anodeMaterial, neRaw)

    return {
      time: t,
      ne,
      anodeDeltaM: parseFloat(state.anodeMassDelta.toFixed(3)),
      cathodeDeltaM: parseFloat(state.cathodeMassDelta.toFixed(3)),
      vAnodeGas: parseFloat(state.anodeGasVolume.toFixed(3)),
      vCathodeGas: parseFloat(state.cathodeGasVolume.toFixed(3)),
      cMain: parseFloat(state.concentration.toFixed(4)),
      pH: parseFloat(state.pH.toFixed(2)),
    }
  }, [cellType, anodeMaterial, current])

  // 1. 全量预计算 0~MAX_TIME 的完整历史点 (AGENTS.md 铁律 8)
  const fullMassHistory = useMemo(() => {
    const list: MassPoint[] = []
    for (let i = 0; i <= TIME_STEPS; i++) {
      const t = (MAX_TIME / TIME_STEPS) * i
      const st = computeStateAtTime(t)
      list.push({
        time: st.time,
        anodeDeltaM: st.anodeDeltaM,
        cathodeDeltaM: st.cathodeDeltaM,
        vAnodeGas: st.vAnodeGas,
        vCathodeGas: st.vCathodeGas,
      })
    }
    return list;
  }, [computeStateAtTime])

  const fullIonHistory = useMemo(() => {
    const list: IonPoint[] = []
    for (let i = 0; i <= TIME_STEPS; i++) {
      const t = (MAX_TIME / TIME_STEPS) * i
      const st = computeStateAtTime(t)
      list.push({
        time: st.time,
        ne: st.ne,
        cMain: st.cMain,
        pH: st.pH,
      })
    }
    return list;
  }, [computeStateAtTime])

  // 2. 根据当前时间 reveal
  const massHistory = useMemo(
    () => fullMassHistory.filter((p) => p.time <= time),
    [fullMassHistory, time]
  )
  const ionHistory = useMemo(
    () => fullIonHistory.filter((p) => p.time <= time),
    [fullIonHistory, time]
  )

  const currentState = computeStateAtTime(time)

  // 文字描述与化学方程式
  const getProductDescriptions = () => {
    if (cellType === 0) {
      return {
        anodeProduct: 'Cl₂ (黄绿色气体)',
        cathodeProduct: 'Cu (红色金属沉淀)',
        anodeEquation: '2Cl⁻ - 2e⁻ = Cl₂↑',
        cathodeEquation: 'Cu²⁺ + 2e⁻ = Cu',
        overallEquation: 'CuCl₂ ═(电解)═ Cu + Cl₂↑',
      }
    } else if (cellType === 1) {
      if (anodeMaterial === 0) {
        return {
          anodeProduct: 'O₂ (无色气体) + H⁺',
          cathodeProduct: 'Cu (红色金属)',
          anodeEquation: '2H₂O - 4e⁻ = O₂↑ + 4H⁺',
          cathodeEquation: 'Cu²⁺ + 2e⁻ = Cu',
          overallEquation: '2CuSO₄ + 2H₂O ═(电解)═ 2Cu + O₂↑ + 2H₂SO₄',
        }
      } else {
        return {
          anodeProduct: 'Cu²⁺ (铜阳极溶解)',
          cathodeProduct: 'Cu (红色金属)',
          anodeEquation: 'Cu - 2e⁻ = Cu²⁺',
          cathodeEquation: 'Cu²⁺ + 2e⁻ = Cu',
          overallEquation: 'Cu(阳极) ═(电解)═ Cu(阴极)',
        }
      }
    } else if (cellType === 2) {
      return {
        anodeProduct: 'Cl₂ (黄绿色气体)',
        cathodeProduct: 'H₂ (无色气体) + OH⁻',
        anodeEquation: '2Cl⁻ - 2e⁻ = Cl₂↑',
        cathodeEquation: '2H₂O + 2e⁻ = H₂↑ + 2OH⁻',
        overallEquation: '2NaCl + 2H₂O ═(电解)═ 2NaOH + H₂↑ + Cl₂↑',
      }
    } else if (cellType === 3) {
      return {
        anodeProduct: 'Cu²⁺ (粗铜溶解, 阳极泥沉降)',
        cathodeProduct: 'Cu (精铜析出)',
        anodeEquation: 'Cu(粗) - 2e⁻ = Cu²⁺',
        cathodeEquation: 'Cu²⁺ + 2e⁻ = Cu',
        overallEquation: 'Cu(粗) ═(电解)═ Cu(精)',
      }
    } else {
      return {
        anodeProduct: 'O₂ (无色气体, C电极消耗)',
        cathodeProduct: 'Al (液态金属铝)',
        anodeEquation: '2O²⁻ - 4e⁻ = O₂↑',
        cathodeEquation: 'Al³⁺ + 3e⁻ = Al',
        overallEquation: '2Al₂O₃(熔融) ═(电解)═ 4Al + 3O₂↑',
      }
    }
  }

  const desc = getProductDescriptions()

  return {
    ...currentState,
    ...desc,
    massHistory,
    ionHistory,
  }
}
