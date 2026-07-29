import { useState, useMemo } from 'react'
import { FLASH_CARDS } from '../constants'
import type { FlashCardParams, FlashCardCategory, FlashCard } from '../types'

export function useFlashCardChemistry() {
  const [params, setParamsState] = useState<FlashCardParams>({
    viewMode: 0,
    category: 'all',
    cardIndex: 0,
    isRevealed: false,
    selectedOption: null,
    isHeating: false,
    isCompressing: false,
  })

  const filteredCards = useMemo(() => {
    if (params.category === 'all') return FLASH_CARDS
    return FLASH_CARDS.filter((card) => card.category === params.category)
  }, [params.category])

  const safeIndex = useMemo(() => {
    if (params.cardIndex >= filteredCards.length) return 0
    return params.cardIndex
  }, [params.cardIndex, filteredCards.length])

  const currentCard: FlashCard = filteredCards[safeIndex] || FLASH_CARDS[0]

  const updateParam = <K extends keyof FlashCardParams>(key: K, value: FlashCardParams[K]) => {
    setParamsState((prev) => ({ ...prev, [key]: value }))
  }

  const setParams = (newParams: Partial<FlashCardParams>) => {
    setParamsState((prev) => ({ ...prev, ...newParams }))
  }

  const changeCategory = (cat: FlashCardCategory) => {
    setParamsState((prev) => ({
      ...prev,
      category: cat,
      cardIndex: 0,
      isRevealed: false,
      selectedOption: null,
      isHeating: false,
      isCompressing: false,
    }))
  }

  const nextCard = () => {
    setParamsState((prev) => ({
      ...prev,
      cardIndex: (safeIndex + 1) % filteredCards.length,
      isRevealed: false,
      selectedOption: null,
      isHeating: false,
      isCompressing: false,
    }))
  }

  const prevCard = () => {
    setParamsState((prev) => ({
      ...prev,
      cardIndex: (safeIndex - 1 + filteredCards.length) % filteredCards.length,
      isRevealed: false,
      selectedOption: null,
      isHeating: false,
      isCompressing: false,
    }))
  }

  const randomCard = () => {
    const randomIndex = Math.floor(Math.random() * filteredCards.length)
    setParamsState((prev) => ({
      ...prev,
      cardIndex: randomIndex,
      isRevealed: false,
      selectedOption: null,
      isHeating: false,
      isCompressing: false,
    }))
  }

  const selectOption = (opt: 'A' | 'B') => {
    setParamsState((prev) => ({
      ...prev,
      selectedOption: opt,
      isRevealed: true,
    }))
  }

  const toggleReveal = () => {
    setParamsState((prev) => ({
      ...prev,
      isRevealed: !prev.isRevealed,
    }))
  }

  const toggleHeating = () => {
    setParamsState((prev) => ({
      ...prev,
      isHeating: !prev.isHeating,
    }))
  }

  const toggleCompressing = () => {
    setParamsState((prev) => ({
      ...prev,
      isCompressing: !prev.isCompressing,
    }))
  }

  return {
    params,
    filteredCards,
    currentCard,
    totalCards: filteredCards.length,
    currentIndex: safeIndex,
    updateParam,
    setParams,
    changeCategory,
    nextCard,
    prevCard,
    randomCard,
    selectOption,
    toggleReveal,
    toggleHeating,
    toggleCompressing,
  }
}
