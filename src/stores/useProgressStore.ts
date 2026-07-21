import { create } from 'zustand'

interface ProgressState {
  viewedAnimations: string[]
  masteredKnowledge: string[]
  totalAnimationCount: number
  totalKnowledgeCount: number
  markAnimationViewed: (id: string) => void
  markKnowledgeMastered: (id: string) => void
  setTotalCounts: (animationCount: number, knowledgeCount: number) => void
  getProgress: () => {
    knowledgeProgress: number
    animationProgress: number
  }
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  viewedAnimations: [],
  masteredKnowledge: [],
  totalAnimationCount: 0,
  totalKnowledgeCount: 0,
  markAnimationViewed: (id: string) => {
    set(state => {
      if (state.viewedAnimations.includes(id)) return state
      return { viewedAnimations: [...state.viewedAnimations, id] }
    })
  },
  markKnowledgeMastered: (id: string) => {
    set(state => {
      if (state.masteredKnowledge.includes(id)) return state
      return { masteredKnowledge: [...state.masteredKnowledge, id] }
    })
  },
  setTotalCounts: (animationCount: number, knowledgeCount: number) => {
    set({ totalAnimationCount: animationCount, totalKnowledgeCount: knowledgeCount })
  },
  getProgress: () => {
    const { viewedAnimations, masteredKnowledge, totalAnimationCount, totalKnowledgeCount } = get()
    return {
      knowledgeProgress: totalKnowledgeCount > 0
        ? (masteredKnowledge.length / totalKnowledgeCount) * 100
        : 0,
      animationProgress: totalAnimationCount > 0
        ? (viewedAnimations.length / totalAnimationCount) * 100
        : 0,
    }
  },
}))
