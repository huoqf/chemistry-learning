import { create } from 'zustand'

export type AnimationParamValue = number
export type AnimationParamKey = string
export type AnimationParams = Record<AnimationParamKey, AnimationParamValue>
export type StoreUpdater<T> = T | ((prev: T) => T)

interface AnimationDataState {
  animationType: string | null
  params: AnimationParams
  lastChangedParam: string | null
  time: number
  isPlaying: boolean
  speed: number
  direction: 1 | -1
  showVectors: boolean
  showFormulas: boolean
  showGrid: boolean
  showTimeSlices: boolean
  showDualObjects: boolean
  equilibriumReached: boolean
}

export interface AnimationState extends AnimationDataState {
  setAnimationType: (type: string | null) => void
  setParams: (params: AnimationParams) => void
  updateParam: (key: AnimationParamKey, value: AnimationParamValue) => void
  setTime: (time: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  setSpeed: (speed: number) => void
  setDirection: (direction: 1 | -1) => void
  toggleVectors: () => void
  toggleFormulas: () => void
  toggleGrid: () => void
  toggleTimeSlices: () => void
  toggleDualObjects: () => void
  setEquilibriumReached: (reached: boolean) => void
  reset: () => void
}

const initialState: AnimationDataState = {
  animationType: null,
  params: {},
  lastChangedParam: null as string | null,
  time: 0,
  isPlaying: false,
  speed: 1,
  direction: 1,
  showVectors: true,
  showFormulas: true,
  showGrid: true,
  showTimeSlices: false,
  showDualObjects: false,
  equilibriumReached: false,
}

export const useAnimationStore = create<AnimationState>((set) => ({
  ...initialState,
  setAnimationType: (type) => set({ animationType: type }),
  setParams: (params) => set({ params, equilibriumReached: false }),
  updateParam: (key, value) => set((state) => ({
    params: { ...state.params, [key]: value },
    lastChangedParam: key,
    equilibriumReached: false,
  })),
  setTime: (time) => set({ time }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  setDirection: (direction) => set({ direction }),
  toggleVectors: () => set((state) => ({ showVectors: !state.showVectors })),
  toggleFormulas: () => set((state) => ({ showFormulas: !state.showFormulas })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleTimeSlices: () => set((state) => ({ showTimeSlices: !state.showTimeSlices })),
  toggleDualObjects: () => set((state) => ({ showDualObjects: !state.showDualObjects })),
  setEquilibriumReached: (equilibriumReached) => set({ equilibriumReached }),
  reset: () => set(initialState),
}))