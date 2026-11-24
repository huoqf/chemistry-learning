export interface ScoringStep {
  id: string
  title: string
  type: 'fill-in' | 'keywords' | 'calculation'
  questionText: string
  formulaLatex?: string
  placeholder?: string
  correctAnswer: string | string[]
  /** 单套方案下的必需踩分点分组（组间 AND、组内同义词 OR） */
  requiredKeywordGroups?: string[][]
  /** 多套并列可行方案（如微热法 OR 液封法；满足任意一套方案的全部组即得分） */
  alternativeKeywordGroups?: string[][][]
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
  diagramType?:
    | 'titration-curve'
    | 'distribution-fraction'
    | 'precipitation-curve'
    | 'valence-matrix-chart'
    | 'organic-mechanism-diagram'
    | 'titration-error-diagram'
    | 'image'
  diagramConfig?: {
    titrationType?: 'weakAcid-strongBase' | 'weakBase-strongAcid'
    mechanismType?:
      | 'ester-cleavage'
      | 'addition-markov'
      | 'alcohol-oxidation'
      | 'haloalkane-elimination'
      | 'peptide-hydrolysis'
      | 'phenol-condensation'
      | 'catalytic-cycle'
      | 'diels-alder'
    errorDiagramType?: 'cod-back-titration' | 'permanganate-view-angle' | 'iodometry-purity'
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
