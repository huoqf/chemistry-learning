import { useMemo } from 'react'

export interface PrimaryCellChemistryParams {
  cellType: number // 0: 单槽, 1: 盐桥双槽, 2: 氢氧燃料, 3: 铅蓄电池
  electrolyteType: number // 0: 碱性, 1: 酸性
  current: number // 电流 A
  time: number // 时间 s
}

export interface MassHistoryPoint {
  time: number
  anodeDeltaM: number
  cathodeDeltaM: number
}

export interface IonHistoryPoint {
  time: number
  cMain: number
  ne: number
}

export interface PrimaryCellChemistryResult {
  ne: number
  voltage: number
  anodeDeltaM: number
  cathodeDeltaM: number
  cMain: number
  fullMassHistory: MassHistoryPoint[]
  fullIonHistory: IonHistoryPoint[]
  massHistory: MassHistoryPoint[]
  ionHistory: IonHistoryPoint[]
}

const MAX_TIME = 10
const F = 96485

function calculateStateAtTime(
  cellType: number,
  electrolyteType: number,
  current: number,
  t: number
) {
  const ne = parseFloat(((current * t * 50) / F).toFixed(4))
  let anodeDeltaM = 0
  let cathodeDeltaM = 0
  let voltage = 1.10
  let cMain = 1.0

  if (cellType === 0) {
    // 经典单槽 Zn-Cu
    anodeDeltaM = -parseFloat((ne * 0.5 * 65.38).toFixed(3))
    cathodeDeltaM = 0
    voltage = 1.10
    cMain = Math.max(0.05, parseFloat((1.0 - ne * 0.5).toFixed(3)))
  } else if (cellType === 1) {
    // 双槽盐桥 Zn-Cu
    anodeDeltaM = -parseFloat((ne * 0.5 * 65.38).toFixed(3))
    cathodeDeltaM = parseFloat((ne * 0.5 * 63.55).toFixed(3))
    voltage = 1.10
    cMain = Math.max(0.05, parseFloat((1.0 - ne * 0.5).toFixed(3)))
  } else if (cellType === 2) {
    // 氢氧燃料电池
    anodeDeltaM = 0
    cathodeDeltaM = 0
    voltage = 1.23
    cMain = electrolyteType === 0 ? 1.0 : Math.max(0.1, parseFloat((1.0 - ne * 0.1).toFixed(3)))
  } else {
    // 铅蓄电池
    anodeDeltaM = parseFloat((ne * 0.5 * 96.1).toFixed(3))
    cathodeDeltaM = parseFloat((ne * 0.5 * 64.1).toFixed(3))
    voltage = 2.04
    cMain = Math.max(0.1, parseFloat((1.0 - ne * 1.0).toFixed(3)))
  }

  return { ne, anodeDeltaM, cathodeDeltaM, voltage, cMain }
}

/**
 * 原电池纯化学逻辑计算 Hook
 */
export function usePrimaryCellChemistry({
  cellType,
  electrolyteType,
  current,
  time,
}: PrimaryCellChemistryParams): PrimaryCellChemistryResult {
  // 全量预计算 (0~10s, 间隔 0.1s)
  const { fullMassHistory, fullIonHistory } = useMemo(() => {
    const massHist: MassHistoryPoint[] = []
    const ionHist: IonHistoryPoint[] = []
    const steps = 100

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * MAX_TIME
      const st = calculateStateAtTime(cellType, electrolyteType, current, t)
      massHist.push({
        time: parseFloat(t.toFixed(1)),
        anodeDeltaM: st.anodeDeltaM,
        cathodeDeltaM: st.cathodeDeltaM,
      })
      ionHist.push({
        time: parseFloat(t.toFixed(1)),
        cMain: st.cMain,
        ne: st.ne,
      })
    }

    return { fullMassHistory: massHist, fullIonHistory: ionHist }
  }, [cellType, electrolyteType, current])

  // 动态根据当前 time 揭示历史数据
  const massHistory = useMemo(
    () => fullMassHistory.filter((p) => p.time <= time + 0.05),
    [fullMassHistory, time]
  )
  const ionHistory = useMemo(
    () => fullIonHistory.filter((p) => p.time <= time + 0.05),
    [fullIonHistory, time]
  )

  // 当前时刻状态
  const currentState = useMemo(
    () => calculateStateAtTime(cellType, electrolyteType, current, time),
    [cellType, electrolyteType, current, time]
  )

  return {
    ...currentState,
    fullMassHistory,
    fullIonHistory,
    massHistory,
    ionHistory,
  }
}
