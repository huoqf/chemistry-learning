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
  diagramType?: 'titration-curve' | 'distribution-fraction' | 'precipitation-curve' | 'valence-matrix-chart' | 'organic-mechanism-diagram' | 'image'
  diagramConfig?: {
    titrationType?: 'weakAcid-strongBase' | 'weakBase-strongAcid'
    mechanismType?: 'ester-cleavage' | 'addition-markov' | 'alcohol-oxidation' | 'haloalkane-elimination' | 'peptide-hydrolysis' | 'phenol-condensation'
    vEq?: number
    phJumpRange?: [number, number]
    pKa?: number
    pKa1?: number
    pKa2?: number
    imageUrl?: string
    title?: string
  }
}

export interface ModelQuizData {
  modelId: string
  scoringSteps: ScoringStep[]
  variantQuizzes: GaokaoVariantItem[]
}
