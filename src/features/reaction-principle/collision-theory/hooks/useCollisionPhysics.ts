/**
 * 碰撞理论物理计算引擎
 *
 * 纯计算模块，无 DOM/React 依赖。
 * 包含 A₂ + B₂ -> 2AB 取向碰撞、能量阈值判断、碰撞闪光及统计。
 */

const R = 8.314 // J/(mol·K)

export type ParticleType = 'A2' | 'B2' | 'AB'

export interface Particle {
  id: number
  type: ParticleType
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  energy: number // 相对能量 (0~1 归一化)
  angle: number // 粒子碰撞取向角 (0 ~ 2π)
  isActivated: boolean
  flashFrames: number // 碰撞闪光剩余帧数
}

export interface CollisionStats {
  totalCollisions: number
  effectiveCollisions: number
  activationFraction: number
  rateConstant: number // 相对速率常数 k
  reactionRate: number // 相对反应速率 v
  producedABCount: number // 生成的 AB 分子数量
}

export interface CollisionWorld {
  particles: Particle[]
  stats: CollisionStats
}

function makeParticles(
  count: number,
  width: number,
  height: number,
  temperature: number,
  activationEnergy: number
): Particle[] {
  const baseSpeed = 40 * Math.sqrt(temperature / 298)
  const f = Math.exp((-activationEnergy * 1000) / (R * temperature * 2.5))

  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const moveAngle = Math.random() * Math.PI * 2
    const speed = baseSpeed * (0.6 + Math.random() * 0.8)
    const energy = Math.random()
    const isActivated = energy < Math.max(f * 2.5, 0.15)
    // 前一半为 A2，后一半为 B2
    const type: ParticleType = i % 2 === 0 ? 'A2' : 'B2'

    return {
      id: i,
      type,
      x: 20 + Math.random() * Math.max(20, width - 40),
      y: 20 + Math.random() * Math.max(20, height - 40),
      vx: Math.cos(moveAngle) * speed,
      vy: Math.sin(moveAngle) * speed,
      radius: 7,
      energy,
      angle,
      isActivated,
      flashFrames: 0,
    }
  })
}

/** 初始化碰撞世界 */
export function initCollisionWorld(
  width: number,
  height: number,
  temperature: number,
  concentration: number,
  hasCatalyst: boolean,
  activationEnergy: number = 80
): CollisionWorld {
  const effectiveEa = hasCatalyst ? activationEnergy * 0.55 : activationEnergy
  const baseCount = 14
  const count = Math.max(6, Math.round(baseCount * concentration))
  const particles = makeParticles(count, width, height, temperature, effectiveEa)
  const f = Math.exp((-effectiveEa * 1000) / (R * temperature * 2.5))

  return {
    particles,
    stats: {
      totalCollisions: 0,
      effectiveCollisions: 0,
      activationFraction: f,
      rateConstant: 100 * f,
      reactionRate: 100 * f * concentration,
      producedABCount: 0,
    },
  }
}

/** 单步推进物理世界 */
export function stepCollisionWorld(
  world: CollisionWorld,
  width: number,
  height: number,
  dtSec: number,
  concentration: number,
  checkOrientation: boolean = true
): CollisionWorld {
  const particles = world.particles
  const clampedDt = Math.min(dtSec, 0.05)

  // 1. 更新位置
  for (const p of particles) {
    p.x += p.vx * clampedDt
    p.y += p.vy * clampedDt

    if (p.x < p.radius) {
      p.x = p.radius
      p.vx = Math.abs(p.vx)
    }
    if (p.x > width - p.radius) {
      p.x = width - p.radius
      p.vx = -Math.abs(p.vx)
    }
    if (p.y < p.radius) {
      p.y = p.radius
      p.vy = Math.abs(p.vy)
    }
    if (p.y > height - p.radius) {
      p.y = height - p.radius
      p.vy = -Math.abs(p.vy)
    }

    if (p.flashFrames > 0) p.flashFrames--
  }

  // 2. 碰撞检测与取向判断
  let total = 0
  let effective = 0

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const minDist = a.radius + b.radius

      if (dist < minDist) {
        total++
        // 能量条件：两者均需为活化分子
        const hasEnergy = a.isActivated || b.isActivated

        // 取向条件：如果开启取向检查，不同类型粒子（A2 与 B2 碰撞）且碰撞矢量接近对心才算取向正确
        let hasOrientation = true
        if (checkOrientation) {
          const isDifferent = (a.type === 'A2' && b.type === 'B2') || (a.type === 'B2' && b.type === 'A2')
          // 取向夹角判断 (根据相对速度向量 dot product)
          const dvx = a.vx - b.vx
          const dvy = a.vy - b.vy
          const speedNorm = Math.sqrt(dvx * dvx + dvy * dvy) || 1
          const dot = (dvx * (dx / dist) + dvy * (dy / dist)) / speedNorm
          hasOrientation = isDifferent && Math.abs(dot) > 0.4
        }

        const isEffective = hasEnergy && hasOrientation

        if (isEffective) {
          effective++
          a.flashFrames = 8
          b.flashFrames = 8
          // 若触发有效碰撞且未全是 AB，有概率转化为 AB
          if (a.type !== 'AB' || b.type !== 'AB') {
            if (Math.random() < 0.2) {
              a.type = 'AB'
              b.type = 'AB'
              world.stats.producedABCount++
            }
          }
        } else {
          a.flashFrames = 2
          b.flashFrames = 2
        }

        // 弹性碰撞物理响应
        const nx = dx / (dist || 1)
        const ny = dy / (dist || 1)
        const dvx = a.vx - b.vx
        const dvy = a.vy - b.vy
        const dot = dvx * nx + dvy * ny
        if (dot > 0) {
          a.vx -= dot * nx
          a.vy -= dot * ny
          b.vx += dot * nx
          b.vy += dot * ny
        }

        const overlap = minDist - dist
        const sx = nx * overlap * 0.5
        const sy = ny * overlap * 0.5
        a.x -= sx
        a.y -= sy
        b.x += sx
        b.y += sy
      }
    }
  }

  // 3. 滑动平均统计
  const s = world.stats
  s.totalCollisions = s.totalCollisions * 0.92 + total * 0.08
  s.effectiveCollisions = s.effectiveCollisions * 0.92 + effective * 0.08
  s.reactionRate = s.rateConstant * concentration

  return world
}
