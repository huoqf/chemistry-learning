import { useState, useEffect, useCallback } from 'react'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useSimulationFrame } from '@/utils/animation'
import {
  initCollisionWorld,
  stepCollisionWorld,
  type CollisionWorld,
} from './hooks/useCollisionPhysics'
import { ParticleScene } from './components/ParticleScene'

export default function CollisionTheoryAnimation() {
  // 1. 订阅 Store 参数
  const { params } = useAnimationStore(
    useShallow((s) => ({ params: s.params }))
  )

  const temperature = (params['temperature'] as number) ?? 298
  const concentration = (params['concentration'] as number) ?? 1.0
  const hasCatalyst = ((params['catalyst'] as number) ?? 0) > 0.5

  // 2. 视口
  const { containerRef, canvasSize } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })
  const { width, height } = canvasSize

  // 3. 碰撞世界状态
  const [world, setWorld] = useState<CollisionWorld>(() =>
    initCollisionWorld(width, height, temperature, concentration, hasCatalyst)
  )

  // 参数变化时重置
  useEffect(() => {
    setWorld(initCollisionWorld(width, height, temperature, concentration, hasCatalyst))
  }, [width, height, temperature, concentration, hasCatalyst])

  // 4. 物理仿真循环
  const step = useCallback(
    (dtMs: number) => {
      setWorld((prev) => {
        // 深拷贝避免直接修改状态
        const next: CollisionWorld = {
          particles: prev.particles.map((p) => ({ ...p })),
          stats: { ...prev.stats },
        }
        stepCollisionWorld(next, width, height, dtMs / 1000, concentration)
        return next
      })
    },
    [width, height, concentration]
  )

  useSimulationFrame(step, { active: true, maxDeltaMs: 33 })

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-transparent"
    >
      <ParticleScene
        particles={world.particles}
        stats={world.stats}
        width={width}
        height={height}
      />
    </div>
  )
}
