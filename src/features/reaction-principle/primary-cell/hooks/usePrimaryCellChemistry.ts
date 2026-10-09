import { useMemo } from 'react'
import { transferredElectronMoles, galvanicCellState } from '@/chemistry'

export interface PrimaryCellChemistryParams {
  cellType: number // 0: 单槽, 1: 盐桥双槽, 2: 氢氧燃料, 3: 铅蓄电池
  /**
   * 0: 碱性, 1: 酸性 —— 仅由中屏场景消费（离子标注、电极方程式）。
   * 本 hook 不再读它：燃料电池在两种介质下关键离子浓度同样「几乎不变」，
   * 若只为介质分支而给出不同结果，等于凭空制造差异。
   */
  electrolyteType: number
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

/**
 * 当前时刻状态。
 * 与右屏量面板共用 @/chemistry/galvanicCell 的同一模型，禁止两处各写一份。
 * electrolyteType 只影响中屏的离子标注与电极方程式，不进入本计算。
 */
function calculateStateAtTime(cellType: number, current: number, t: number) {
  const neRaw = transferredElectronMoles(current, t)
  const ne = parseFloat(neRaw.toFixed(4))
  const state = galvanicCellState(cellType, neRaw)
  return {
    ne,
    anodeDeltaM: parseFloat(state.anodeMassDelta.toFixed(3)),
    cathodeDeltaM: parseFloat(state.cathodeMassDelta.toFixed(3)),
    voltage: state.voltage,
    cMain: parseFloat(state.concentration.toFixed(3)),
  }
}

/**
 * 原电池纯化学逻辑计算 Hook
 */
export function usePrimaryCellChemistry({
  cellType,
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
      const st = calculateStateAtTime(cellType, current, t)
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
  }, [cellType, current])

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
    () => calculateStateAtTime(cellType, current, time),
    [cellType, current, time]
  )

  return {
    ...currentState,
    fullMassHistory,
    fullIonHistory,
    massHistory,
    ionHistory,
  }
}
