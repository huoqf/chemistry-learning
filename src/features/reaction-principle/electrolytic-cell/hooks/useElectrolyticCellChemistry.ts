import { useMemo } from 'react'

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
  const F = 96485

  // 计算单一时间点下各种量
  const computeStateAtTime = (t: number) => {
    const ne = parseFloat(((current * t * 50) / F).toFixed(4))
    let anodeDeltaM = 0
    let cathodeDeltaM = 0
    let vAnodeGas = 0
    let vCathodeGas = 0
    let cMain = 1.0 // mol/L
    let pH = 7.0

    if (cellType === 0) {
      // 0: CuCl2 电解
      anodeDeltaM = 0
      cathodeDeltaM = parseFloat((ne * 0.5 * 63.55).toFixed(3))
      vAnodeGas = parseFloat((ne * 0.5 * 22.4).toFixed(3))
      vCathodeGas = 0
      cMain = Math.max(0.05, parseFloat((1.0 - ne * 0.5).toFixed(3)))
      pH = 7.0
    } else if (cellType === 1) {
      // 1: CuSO4 电解
      if (anodeMaterial === 0) {
        // 惰性石墨
        anodeDeltaM = 0
        vAnodeGas = parseFloat((ne * 0.25 * 22.4).toFixed(3))
        cathodeDeltaM = parseFloat((ne * 0.5 * 63.55).toFixed(3))
        cMain = Math.max(0.05, parseFloat((1.0 - ne * 0.5).toFixed(3)))
        pH = Math.max(1.0, parseFloat((7.0 - ne * 2.5).toFixed(2)))
      } else {
        // 活性铜
        anodeDeltaM = -parseFloat((ne * 0.5 * 63.55).toFixed(3))
        cathodeDeltaM = parseFloat((ne * 0.5 * 63.55).toFixed(3))
        vAnodeGas = 0
        vCathodeGas = 0
        cMain = 1.0
        pH = 7.0
      }
    } else if (cellType === 2) {
      // 2: 饱和食盐水 (氯碱)
      anodeDeltaM = 0
      cathodeDeltaM = 0
      vAnodeGas = parseFloat((ne * 0.5 * 22.4).toFixed(3))
      vCathodeGas = parseFloat((ne * 0.5 * 22.4).toFixed(3))
      cMain = Math.max(0.1, parseFloat((1.0 - ne * 0.5).toFixed(3)))
      pH = Math.min(13.8, parseFloat((7.0 + ne * 3.0).toFixed(2)))
    } else if (cellType === 3) {
      // 3: 粗铜精炼
      anodeDeltaM = -parseFloat((ne * 0.5 * 63.55 * 1.05).toFixed(3))
      cathodeDeltaM = parseFloat((ne * 0.5 * 63.55).toFixed(3))
      vAnodeGas = 0
      vCathodeGas = 0
      cMain = 1.0
      pH = 4.5
    } else {
      // 4: 熔融 Al2O3
      anodeDeltaM = -parseFloat((ne * 0.25 * 12.0).toFixed(3)) // C阳极消耗
      cathodeDeltaM = parseFloat((ne * (1 / 3) * 27.0).toFixed(3))
      vAnodeGas = parseFloat((ne * 0.25 * 22.4).toFixed(3))
      vCathodeGas = 0
      cMain = Math.max(0.1, parseFloat((1.0 - ne * 0.2).toFixed(3)))
      pH = 7.0
    }

    return {
      time: t,
      ne,
      anodeDeltaM,
      cathodeDeltaM,
      vAnodeGas,
      vCathodeGas,
      cMain,
      pH,
    }
  }

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
  }, [cellType, anodeMaterial, current])

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
  }, [cellType, anodeMaterial, current])

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
