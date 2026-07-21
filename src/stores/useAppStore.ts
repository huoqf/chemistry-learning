import { create } from 'zustand'

interface AppState {
  mode: 'animation' | 'discovery'
  discoveryStep: number
  discoveryMaxStep: number
  setMode: (mode: 'animation' | 'discovery') => void
  setDiscoveryStep: (step: number) => void
  setDiscoveryMaxStep: (step: number) => void
  nextDiscoveryStep: () => void
  prevDiscoveryStep: () => void
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'animation',
  discoveryStep: 0,
  discoveryMaxStep: 0,
  setMode: (mode) => set({ mode }),
  setDiscoveryStep: (step) => set({ discoveryStep: step }),
  setDiscoveryMaxStep: (step) => set({ discoveryMaxStep: step }),
  nextDiscoveryStep: () => set((s) => ({ discoveryStep: Math.min(s.discoveryStep + 1, s.discoveryMaxStep) })),
  prevDiscoveryStep: () => set((s) => ({ discoveryStep: Math.max(s.discoveryStep - 1, 0) })),
}))
