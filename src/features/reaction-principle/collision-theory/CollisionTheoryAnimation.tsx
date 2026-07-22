import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useSimulationFrame } from '@/utils/animation'

import {
  initCollisionWorld,
  stepCollisionWorld,
  type CollisionWorld,
} from './hooks/useCollisionPhysics'
import { computeEnergyProfile } from './hooks/useEnergyProfile'
import { computeMaxwellBoltzmann } from './hooks/useMaxwellBoltzmann'

import { ParticleCollisionScene } from './components/ParticleCollisionScene'
import { EnergyProfileChart } from './components/EnergyProfileChart'
import { BoltzmannDistributionChart } from './components/BoltzmannDistributionChart'

export default function CollisionTheoryAnimation() {
  // 1. 订阅 Store 参数
  const { params } = useAnimationStore(
    useShallow((s) => ({ params: s.params }))
  )

  const temperature = (params['temperature'] as number) ?? 298
  const concentration = (params['concentration'] as number) ?? 1.0
  const activationEnergy = (params['activationEnergy'] as number) ?? 80
  const hasCatalyst = ((params['catalyst'] as number) ?? 0) > 0.5
  const reactionTypeVal = (params['reactionType'] as number) ?? 0
  const reactionType = reactionTypeVal === 1 ? 'endothermic' : 'exothermic'
  const checkOrientation = ((params['checkOrientation'] as number) ?? 1) > 0.5

  // 2. 视口设置 (splitHw: 280x650 左窄右宽主力化学布局)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitHw,
  })
  const { width, height } = canvasSize

  // 3. 计算反应势能面 Profile 与麦克斯韦-玻尔兹曼分布 MB
  const energyProfile = useMemo(
    () => computeEnergyProfile(reactionType, activationEnergy, hasCatalyst),
    [reactionType, activationEnergy, hasCatalyst]
  )

  const mbData = useMemo(
    () => computeMaxwellBoltzmann(temperature, activationEnergy, hasCatalyst),
    [temperature, activationEnergy, hasCatalyst]
  )

  // 4. 粒子碰撞物理世界
  const [world, setWorld] = useState<CollisionWorld>(() =>
    initCollisionWorld(width, height, temperature, concentration, hasCatalyst, activationEnergy)
  )

  // 参数变化时重置世界
  useEffect(() => {
    setWorld(
      initCollisionWorld(width, height, temperature, concentration, hasCatalyst, activationEnergy)
    )
  }, [width, height, temperature, concentration, hasCatalyst, activationEnergy])

  // 5. 仿真循环
  const step = useCallback(
    (dtMs: number) => {
      setWorld((prev) => {
        const next: CollisionWorld = {
          particles: prev.particles.map((p) => ({ ...p })),
          stats: { ...prev.stats },
        }
        stepCollisionWorld(
          next,
          width,
          height,
          dtMs / 1000,
          concentration,
          checkOrientation
        )
        return next
      })
    },
    [width, height, concentration, checkOrientation]
  )

  useSimulationFrame(step, { active: true, maxDeltaMs: 33 })

  return (
    <div className="w-full h-full flex flex-row overflow-hidden bg-transparent select-none">
      {/* 左侧 280px 微观粒子碰撞大屏场景 */}
      <div className="w-[280px] shrink-0 h-full">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <ParticleCollisionScene
            particles={world.particles}
            stats={world.stats}
            width={width}
            height={height}
            checkOrientation={checkOrientation}
          />
        </AnimationSvgCanvas>
      </div>

      {/* 右侧 560px 势能图与玻尔兹曼能量分布图 */}
      <div className="flex-1 min-w-0 h-full flex flex-col gap-1 p-1 overflow-hidden bg-transparent">
        {/* 上区：反应历程势能曲线图 */}
        <div className="flex-1 min-h-0 relative">
          <EnergyProfileChart
            profile={energyProfile}
            hasCatalyst={hasCatalyst}
            title={`反应历程与活化能 (${reactionType === 'exothermic' ? '放热 ΔH < 0' : '吸热 ΔH > 0'})`}
          />
        </div>

        {/* 下区：麦克斯韦-玻尔兹曼分子能量分布图 */}
        <div className="flex-1 min-h-0 relative pt-1">
          <BoltzmannDistributionChart
            mbData={mbData}
            temperature={temperature}
            activationEnergy={activationEnergy}
            hasCatalyst={hasCatalyst}
          />
        </div>
      </div>
    </div>
  )
}
