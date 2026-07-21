/**
 * 碰撞理论物理计算
 *
 * 纯计算函数，无 React/DOM 依赖，无 JSX。
 * 返回粒子更新器和统计计算器。
 */

const R = 8.314 // J/(mol·K)

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  energy: number // 相对能量 (0~1 归一化)
  isActivated: boolean
  color: string
  flashFrames: number // 碰撞闪光剩余帧数
}

export interface CollisionStats {
  totalCollisions: number
  effectiveCollisions: number
  activationFraction: number
  rateConstant: number // 相对速率常数
  reactionRate: number // 相对反应速率
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
  activationEnergy: number,
): Particle[] {
  const baseSpeed = 40 * Math.sqrt(temperature / 298)
  const f = Math.exp(-activationEnergy * 1000 / (R * temperature))
  const activatedColor = '#ef4444'
  const normalColor = '#3b82f6'

  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const speed = baseSpeed * (0.7 + Math.random() * 0.6)
    const energy = Math.random()
    const isActivated = energy < f
    return {
      id: i,
      x: 20 + Math.random() * (width - 40),
      y: 20 + Math.random() * (height - 40),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 5,
      energy,
      isActivated,
      color: isActivated ? activatedColor : normalColor,
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
): CollisionWorld {
  const activationEnergy = hasCatalyst ? 40 : 80
  const baseCount = 15
  const count = Math.max(5, Math.round(baseCount * concentration))
  const particles = makeParticles(count, width, height, temperature, activationEnergy)
  const f = Math.exp(-activationEnergy * 1000 / (R * temperature))
  return {
    particles,
    stats: {
      totalCollisions: 0,
      effectiveCollisions: 0,
      activationFraction: f,
      rateConstant: 100 * f,
      reactionRate: 100 * f * concentration,
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
): CollisionWorld {
  const particles = world.particles
  const clampedDt = Math.min(dtSec, 0.05)

  // 1. 更新位置
  for (const p of particles) {
    p.x += p.vx * clampedDt
    p.y += p.vy * clampedDt

    if (p.x < p.radius) { p.x = p.radius; p.vx = Math.abs(p.vx) }
    if (p.x > width - p.radius) { p.x = width - p.radius; p.vx = -Math.abs(p.vx) }
    if (p.y < p.radius) { p.y = p.radius; p.vy = Math.abs(p.vy) }
    if (p.y > height - p.radius) { p.y = height - p.radius; p.vy = -Math.abs(p.vy) }

    if (p.flashFrames > 0) p.flashFrames--
  }

  // 2. 碰撞检测
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
        const isEffective = a.isActivated && b.isActivated
        if (isEffective) {
          effective++
          a.flashFrames = 5
          b.flashFrames = 5
        }

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
        a.x -= sx; a.y -= sy
        b.x += sx; b.y += sy
      }
    }
  }

  // 3. 滑动平均统计
  const s = world.stats
  s.totalCollisions = s.totalCollisions * 0.95 + total * 0.05
  s.effectiveCollisions = s.effectiveCollisions * 0.95 + effective * 0.05
  s.reactionRate = s.rateConstant * concentration

  return world
}
