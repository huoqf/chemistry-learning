/**
 * 杂化轨道模型几何自洽性守门测试
 *
 * 校验「模型声明的键角」与「实际画出的三维取向」是否一致 ——
 * 这是中屏 3D 场景正确性的底线：数据和声明打架时，学生看到的就是错的立体结构。
 *
 * ── 覆盖范围 ──
 * 不再只盯 H₂O 一个模型：以下通用不变量对 HYBRID_MODELS 的全部 11 个模型逐一执行，
 * 任何新增模型只要取向写错，这里立刻红灯。
 */

import { describe, it, expect } from 'vitest'
import { HYBRID_MODELS, PRESET_KEYS, type HybridModelData, type HybridVector } from '../data/hybridData'

type Vec3 = [number, number, number]

function angleBetween(a: Vec3, b: Vec3): number {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const la = Math.hypot(...a)
  const lb = Math.hypot(...b)
  return (Math.acos(Math.max(-1, Math.min(1, dot / (la * lb)))) * 180) / Math.PI
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function len(a: Vec3): number {
  return Math.hypot(...a)
}

/** 4 个方向终点所张的四面体体积（除以 6）；为 0 表示四点共面 */
function tetraVolume(a: Vec3, b: Vec3, c: Vec3, d: Vec3): number {
  const u = sub(b, a)
  const v = sub(c, a)
  const w = sub(d, a)
  const cross: Vec3 = [
    v[1] * w[2] - v[2] * w[1],
    v[2] * w[0] - v[0] * w[2],
    v[0] * w[1] - v[1] * w[0],
  ]
  const det = u[0] * cross[0] + u[1] * cross[1] + u[2] * cross[2]
  return Math.abs(det) / 6
}

function group(orbs: HybridVector[], type: HybridVector['type']): HybridVector[] {
  return orbs.filter((o) => o.type === type)
}

/** 全部两两夹角 */
function pairwiseAngles(dirs: Vec3[]): number[] {
  const out: number[] = []
  for (let i = 0; i < dirs.length; i++) {
    for (let j = i + 1; j < dirs.length; j++) out.push(angleBetween(dirs[i], dirs[j]))
  }
  return out
}

const ALL_MODELS: { key: string; model: HybridModelData }[] = PRESET_KEYS.map((key) => ({
  key,
  model: HYBRID_MODELS[key],
}))

// ────────────────────────────────────────────────────────────
// 1. 通用不变量：全部 11 个模型
// ────────────────────────────────────────────────────────────
describe('全部杂化模型：通用几何不变量', () => {
  describe.each(ALL_MODELS)('$key', ({ key, model }) => {
    it('杂化轨道两两夹角严格等于模型声明的键角', () => {
      for (const center of model.centers) {
        const hybrids = group(center.hybridOrbitals, 'hybrid')
        for (const angle of pairwiseAngles(hybrids.map((h) => h.dir))) {
          expect(angle, `${key} 的杂化轨道夹角 ${angle.toFixed(2)}° ≠ 声明 ${model.bondAngle}°`).toBeCloseTo(
            model.bondAngle,
            1
          )
        }
      }
    })

    it('同类配体等长，且方向严格落在所属中心的某个杂化轨道上（σ 键无错位）', () => {
      const bondLengths: number[] = []
      const byCenter = new Map<number, number[][]>()
      let worstMisalign = 0

      model.ligands.forEach((lig) => {
        // 归属最近的中心原子
        let bestIdx = 0
        let bestDist = Infinity
        let bestRel: number[] = []
        model.centers.forEach((c, idx) => {
          const rel = sub(lig.pos, c.pos)
          const d = len(rel)
          if (d < bestDist) {
            bestDist = d
            bestIdx = idx
            bestRel = rel
          }
        })
        bondLengths.push(bestDist)
        byCenter.set(bestIdx, [...(byCenter.get(bestIdx) ?? []), bestRel])

        const hybrids = group(model.centers[bestIdx].hybridOrbitals, 'hybrid')
        const misalign = Math.min(...hybrids.map((h) => angleBetween(bestRel as Vec3, h.dir)))
        worstMisalign = Math.max(worstMisalign, misalign)
      })

      // 同类配体键长一致（相对偏差 < 0.5%：允许手写坐标的舍入误差）
      for (const l of bondLengths) {
        expect(Math.abs(l - bondLengths[0]) / bondLengths[0]).toBeLessThan(0.005)
      }
      // σ 键偏离杂化轨道方向不得超过 0.5°
      expect(worstMisalign, `${key} σ 键最大错位 ${worstMisalign.toFixed(3)}°`).toBeLessThan(0.5)

      // 同一中心上的配体两两夹角必须等于声明键角（±0.5°，容忍手写坐标舍入）
      for (const rels of byCenter.values()) {
        if (rels.length < 2) continue
        for (const a of pairwiseAngles(rels as Vec3[])) {
          expect(Math.abs(a - model.bondAngle), `${key} 配体夹角 ${a.toFixed(2)}° ≠ 声明 ${model.bondAngle}°`).toBeLessThan(0.5)
        }
      }
    })

    it('全部杂化轨道方向必须张成三维（不得退化共面，z 分量不可全为 0）', () => {
      for (const center of model.centers) {
        const hybrids = group(center.hybridOrbitals, 'hybrid')
        if (hybrids.length < 4) continue
        const zs = hybrids.map((h) => h.dir[2])
        // sp³ 类（4 个方向）必须真正立体
        expect(zs.some((z) => Math.abs(z) > 1e-6), `${key} 的 4 个 sp³ 方向共面`).toBe(true)
        const [a, b, c, d] = hybrids.map((h) => h.dir)
        expect(tetraVolume(a, b, c, d)).toBeGreaterThan(0.5)
      }
    })

    it('未杂化 p 轨道必须垂直于全部杂化轨道（可用于肩并肩形成 π 键）', () => {
      for (const center of model.centers) {
        const hybrids = group(center.hybridOrbitals, 'hybrid')
        for (const p of group(center.hybridOrbitals, 'unhybridizedP')) {
          for (const h of hybrids) {
            expect(angleBetween(p.dir, h.dir)).toBeCloseTo(90, 1)
          }
        }
      }
    })

    it('配体声明的连接中心必须与最近的杂化中心一致（多中心分子不得省略）', () => {
      model.ligands.forEach((lig) => {
        let bestIdx = 0
        let bestDist = Infinity
        model.centers.forEach((c, idx) => {
          const d = len(sub(lig.pos, c.pos))
          if (d < bestDist) {
            bestDist = d
            bestIdx = idx
          }
        })
        expect(
          lig.connectedCenterIdx ?? 0,
          `${key} 配体 ${JSON.stringify(lig.pos)} 声明的连接中心与最近中心不符 → σ 键会从错误的原子起画`
        ).toBe(bestIdx)
      })
    })

    it('每条 π 键的两端必须落在真实的原子位置上，且 π 云垂直于该 σ 轴', () => {
      const isAtomPos = (p: Vec3) =>
        model.centers.some((c) => len(sub(p, c.pos)) < 1e-6) ||
        model.ligands.some((l) => len(sub(p, l.pos)) < 1e-6)

      for (const pi of model.piBonds ?? []) {
        // 两端都必须是模型中真实存在的原子（中心原子或配体），
        // 否则 π 云会悬空画在不存在的位置上
        expect(isAtomPos(pi.startPos), `${key} π 键起点不在任何原子上`).toBe(true)
        expect(isAtomPos(pi.endPos), `${key} π 键终点不在任何原子上`).toBe(true)
        // dir 是 π 云相对 σ 轴的偏移方向 → 必须垂直于 σ 轴
        const axis = sub(pi.endPos, pi.startPos)
        const dot = axis[0] * pi.dir[0] + axis[1] * pi.dir[1] + axis[2] * pi.dir[2]
        expect(Math.abs(dot / (len(axis) * len(pi.dir))), `${key} π 云方向未垂直于 σ 轴`).toBeLessThan(1e-6)
      }
    })

    it('存在孤对时，VSEPR 排斥次序必须成立：孤对相关夹角 > 成键–成键', () => {
      for (const center of model.centers) {
        const lonePairs = group(center.hybridOrbitals, 'lonePair')
        const hybrids = group(center.hybridOrbitals, 'hybrid')
        if (lonePairs.length === 0) continue

        const bondBond = pairwiseAngles(hybrids.map((h) => h.dir))
        const minBondBond = Math.min(...bondBond)
        const lpBond = lonePairs.flatMap((lp) => hybrids.map((h) => angleBetween(lp.dir, h.dir)))

        // 孤对被排斥最强 —— 它与成键轨道的夹角必然大于成键彼此之间的夹角
        expect(Math.min(...lpBond), `${key} 孤对–成键角 < 成键–成键角`).toBeGreaterThan(minBondBond)

        if (lonePairs.length === 2) {
          // 2 对孤对时次序完整：孤对–孤对 > 孤对–成键 > 成键–成键
          const lpLp = angleBetween(lonePairs[0].dir, lonePairs[1].dir)
          expect(lpLp).toBeGreaterThan(Math.max(...lpBond))
          expect(lpLp).toBeGreaterThan(110)
        }
      }
    })
  })
})

// ────────────────────────────────────────────────────────────
// 2. 水分子 H₂O（P2-11 回归锁）
// ────────────────────────────────────────────────────────────
describe('H₂O 的 sp³ 取向（P2-11 回归锁）', () => {
  const h2o = HYBRID_MODELS.h2o
  const orbs = h2o.centers[0].hybridOrbitals
  const lonePairs = group(orbs, 'lonePair')
  const hybrids = group(orbs, 'hybrid')

  it('孤对位于垂直于 H–O–H 平面的平面内，且关于 y 轴对称（C2v）', () => {
    expect(lonePairs).toHaveLength(2)
    for (const lp of lonePairs) {
      expect(Math.abs(lp.dir[0])).toBeLessThan(1e-9)
    }
    // 两对孤对的 y、z 分量互为镜像
    expect(lonePairs[0].dir[1]).toBeCloseTo(lonePairs[1].dir[1], 10)
    expect(lonePairs[0].dir[2]).toBeCloseTo(-lonePairs[1].dir[2], 10)
  })

  it('成键–成键夹角严格等于声明的 H–O–H 键角', () => {
    expect(hybrids).toHaveLength(2)
    expect(angleBetween(hybrids[0].dir, hybrids[1].dir)).toBeCloseTo(h2o.bondAngle, 1)
  })
})

// ────────────────────────────────────────────────────────────
// 3. 氨分子 NH₃（C3v：1 对孤对 + 3 条等长 N–H）
// ────────────────────────────────────────────────────────────
describe('NH₃ 的 sp³ 取向（C3v 三角锥）', () => {
  const nh3 = HYBRID_MODELS.nh3
  const center = nh3.centers[0]
  const lonePairs = group(center.hybridOrbitals, 'lonePair')
  const hybrids = group(center.hybridOrbitals, 'hybrid')

  it('孤对沿 C3 轴，3 个 N–H 关于该轴严格 120° 对称（镜像关系成立）', () => {
    expect(lonePairs).toHaveLength(1)
    expect(hybrids).toHaveLength(3)
    // 孤对方向即 C3 轴
    const axis = lonePairs[0].dir
    expect(Math.abs(axis[0])).toBeLessThan(1e-9)
    expect(Math.abs(axis[2])).toBeLessThan(1e-9)

    // 3 个成键轨道相对 C3 轴的极角完全相同（各向同性张开）
    const polar = hybrids.map((h) => angleBetween(h.dir, axis))
    for (const p of polar) expect(p).toBeCloseTo(polar[0], 6)

    // 方位角互差 120°
    const azimuths = hybrids.map((h) => (Math.atan2(h.dir[2], h.dir[0]) * 180) / Math.PI)
    const sorted = [...azimuths].sort((a, b) => a - b)
    const gaps = [sorted[1] - sorted[0], sorted[2] - sorted[1], sorted[0] + 360 - sorted[2]]
    for (const g of gaps) expect(g).toBeCloseTo(120, 4)
  })

  it('H–N–H 键角等于声明的 107.3°，且三条 N–H 等长', () => {
    expect(nh3.bondAngle).toBeCloseTo(107.3, 5)
    for (const angle of pairwiseAngles(hybrids.map((h) => h.dir))) {
      expect(angle).toBeCloseTo(107.3, 1)
    }

    const rels = nh3.ligands.map((l) => sub(l.pos, center.pos))
    expect(rels).toHaveLength(3)
    for (const a of pairwiseAngles(rels)) expect(a).toBeCloseTo(107.3, 1)
    for (const r of rels) expect(len(r)).toBeCloseTo(len(rels[0]), 10)
  })

  it('孤对排斥更强：孤对–成键角（≈111.6°）明显大于 H–N–H 107.3°', () => {
    const lpBond = hybrids.map((h) => angleBetween(lonePairs[0].dir, h.dir))
    for (const a of lpBond) {
      expect(a).toBeGreaterThan(107.3)
      // 由 C3v 对称性唯一确定：cos²β = (1 + 2cosθ)/3
      const expected = (Math.acos(-Math.sqrt((1 + 2 * Math.cos((107.3 * Math.PI) / 180)) / 3)) * 180) / Math.PI
      expect(a).toBeCloseTo(expected, 4)
    }
  })

  it('H 配体与最近杂化轨道严格共线（σ 键无错位）', () => {
    for (const lig of nh3.ligands) {
      const rel = sub(lig.pos, center.pos)
      const best = Math.min(...hybrids.map((h) => angleBetween(rel, h.dir)))
      expect(best).toBeLessThan(0.5)
    }
  })
})

// ────────────────────────────────────────────────────────────
// 4. 二氧化硫 SO₂（sp²：1 对孤对使键角压缩到 119.5°）
// ────────────────────────────────────────────────────────────
describe('SO₂ 的 sp² 取向（V 形）', () => {
  const so2 = HYBRID_MODELS.so2
  const center = so2.centers[0]
  const lonePairs = group(center.hybridOrbitals, 'lonePair')
  const hybrids = group(center.hybridOrbitals, 'hybrid')
  const unhybrid = group(center.hybridOrbitals, 'unhybridizedP')

  it('3 个 sp² 方向共面（全在 xy 平面内），未杂化 p 垂直于该平面', () => {
    expect(lonePairs).toHaveLength(1)
    expect(hybrids).toHaveLength(2)
    expect(unhybrid).toHaveLength(1)
    for (const o of [...lonePairs, ...hybrids]) expect(Math.abs(o.dir[2])).toBeLessThan(1e-9)
    expect(Math.abs(unhybrid[0].dir[2])).toBeGreaterThan(0)
    expect(unhybrid[0].dir[0]).toBeCloseTo(0, 10)
    expect(unhybrid[0].dir[1]).toBeCloseTo(0, 10)
  })

  it('O–S–O 键角等于声明的 119.5°，两个 S–O 等长', () => {
    expect(so2.bondAngle).toBeCloseTo(119.5, 5)
    expect(angleBetween(hybrids[0].dir, hybrids[1].dir)).toBeCloseTo(119.5, 1)

    const rels = so2.ligands.map((l) => sub(l.pos, center.pos))
    expect(angleBetween(rels[0], rels[1])).toBeCloseTo(119.5, 1)
    expect(len(rels[0])).toBeCloseTo(len(rels[1]), 10)
  })

  it('孤对排斥更强：孤对–成键角 120.25° 大于成键–成键 119.5°（原实现此处写反）', () => {
    const lpBond = hybrids.map((h) => angleBetween(lonePairs[0].dir, h.dir))
    const bondBond = angleBetween(hybrids[0].dir, hybrids[1].dir)
    for (const a of lpBond) {
      expect(a).toBeGreaterThan(bondBond)
      // 共面三分：两角之和必须补齐 360°
      expect(a).toBeGreaterThan(120)
    }
    expect(lpBond[0] + lpBond[1] + bondBond).toBeCloseTo(360, 4)
  })

  it('两个 S=O 均为双键：必须各有 1 条 π 键，且 π 云都垂直于分子平面', () => {
    // 原数据只写了 1 条 π，等于把右侧画成 S=O、左侧画成 S–O —— 两个 S=O 都应为双键
    expect(so2.piBonds).toHaveLength(2)

    so2.piBonds!.forEach((pi, i) => {
      expect(len(sub(pi.endPos, so2.ligands[i].pos))).toBeLessThan(1e-6)
      // dir 即 π 云相对 σ 轴的上/下偏移方向，必须垂直于分子平面（±z）
      expect(Math.abs(pi.dir[0])).toBeLessThan(1e-9)
      expect(Math.abs(pi.dir[1])).toBeLessThan(1e-9)
      expect(Math.abs(pi.dir[2])).toBeGreaterThan(0)
      // 也等价于垂直于该 σ 键
      const axis = sub(pi.endPos, pi.startPos)
      const dot = axis[0] * pi.dir[0] + axis[1] * pi.dir[1] + axis[2] * pi.dir[2]
      expect(dot / (len(axis) * len(pi.dir))).toBeCloseTo(0, 9)
    })

    // 两条 π 分布在两个不同的 S–O 上（不是同一根键重复画）
    expect(len(sub(so2.piBonds![0].endPos, so2.piBonds![1].endPos))).toBeGreaterThan(1)

    const oS = so2.centers[0].hybridOrbitals.filter((o) => o.type === 'unhybridizedP')
    expect(oS).toHaveLength(1)
    expect(Math.abs(oS[0].dir[2])).toBeGreaterThan(0)
  })

  it('O 配体与最近杂化轨道严格共线（σ 键无错位）', () => {
    for (const lig of so2.ligands) {
      const rel = sub(lig.pos, center.pos)
      const best = Math.min(...hybrids.map((h) => angleBetween(rel, h.dir)))
      expect(best).toBeLessThan(0.5)
    }
  })
})

// ────────────────────────────────────────────────────────────
// 5. 键角声明值与右屏量面板必须同值（防止两处各写一份）
// ────────────────────────────────────────────────────────────
describe('杂化模型声明的键角与右屏量面板同源', () => {
  it('hybridData 与 hybridization 的键角逐模型一致', async () => {
    const { HYBRID_PRESETS } = await import('@/data/quantities/structure/hybridization')
    for (const key of PRESET_KEYS) {
      expect(
        HYBRID_PRESETS[key].bondAngle,
        `${key}：3D 数据 ${HYBRID_MODELS[key].bondAngle}° vs 量面板 ${HYBRID_PRESETS[key].bondAngle}°`
      ).toBe(HYBRID_MODELS[key].bondAngle)
    }
  })
})
