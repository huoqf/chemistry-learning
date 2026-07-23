/**
 * UI 组件库
 */
export { Button } from './Button'
export { Slider } from './Slider'
export type { ParamMark, ParamMarkVariant } from './Slider'
export { ToggleSwitch } from './ToggleSwitch'
export { OptionButton } from './OptionButton'
export { SegmentedControl } from './SegmentedControl'
export { ParamControl } from './ParamControl'
export { ControlPanel } from './ControlPanel'
export { ScrollDataTable } from './ScrollDataTable'
export type { ScrollDataTableColumn, ScrollDataTableProps } from './ScrollDataTable'
export { LeftPanel, LeftPanelSection } from './LeftPanel'
export { Card } from './Card'
export { Badge } from './Badge'
export { TipCard } from './TipCard'
export { MiniChart } from './MiniChart'
export type { MiniChartLine, MiniChartStaticLine, MiniChartProps } from './MiniChart'
export { KatexFormula } from './KatexFormula'
export { AnimationControls } from './AnimationControls'
export { PageTransition } from './PageTransition'
export { ChemistryPanel } from './ChemistryPanel'
export { ErrorBoundary } from './ErrorBoundary'
export { ScoringCardSection } from './ScoringCardSection'
export { GaokaoVariantQuiz } from './GaokaoVariantQuiz'
export { ChemicalFormula } from './ChemicalFormula'

export interface DiscoveryStepData {
  title: string
  description: string
  targetParams?: Record<string, number>
  targetTime?: number
}
