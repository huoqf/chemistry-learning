/**
 * 反应历程势能图组件 (Collision Theory Feature 专属数据适配)
 */

import { EnergyProfileChart as BaseEnergyProfileChart } from '@/components/Chart'
import type { EnergyProfileResult } from '../hooks/useEnergyProfile'

interface FeatureEnergyProfileProps {
  profile: EnergyProfileResult
  hasCatalyst: boolean
  title?: string
}

export function EnergyProfileChart({
  profile,
  hasCatalyst,
  title = '反应历程与活化能势能图',
}: FeatureEnergyProfileProps) {
  const { reactantsEnergy, productsEnergy, ea1Normal, ea1Catalyst } = profile

  return (
    <div className="w-full h-full flex flex-col">
      <BaseEnergyProfileChart
        reactantEnergy={reactantsEnergy}
        productEnergy={productsEnergy}
        activationEnergy={reactantsEnergy + ea1Normal}
        catalyzedEnergy={hasCatalyst ? reactantsEnergy + ea1Catalyst : undefined}
        title={title}
        xLabel="反应历程"
        yLabel="E /(kJ/mol)"
      />
    </div>
  )
}
