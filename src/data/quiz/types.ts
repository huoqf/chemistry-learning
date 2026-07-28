export interface ScoringStep {
  id: string
  title: string
  type: 'fill-in' | 'keywords' | 'calculation'
  questionText: string
  formulaLatex?: string
  placeholder?: string
  correctAnswer: string | string[]
  explanation: string
}

export interface GaokaoVariantItem {
  id: string
  yearProvince: string
  modelId: string
  title: string
  contextDescription: string
  questionText: string
  options: {
    label: string
    text: string
    isCorrect: boolean
  }[]
  modelAlignmentAnalysis: string
  detailedExplanation: string
}

export interface ModelQuizData {
  modelId: string
  scoringSteps: ScoringStep[]
  variantQuizzes: GaokaoVariantItem[]
}
