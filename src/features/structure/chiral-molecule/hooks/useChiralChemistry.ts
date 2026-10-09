import { useMemo } from 'react'
import { CHIRAL_PRESETS, type ChiralMolecule, type Atom3D, type Bond3D } from '../data/chiralData'

export interface UseChiralChemistryOptions {
  presetIdx: number
  showMirror?: boolean
  mirrorOverlapRatio?: number // 0 ~ 1, 表示镜像分子向原分子重合平移的进度
}

export interface MirroredMoleculeData {
  atoms: Atom3D[]
  bonds: Bond3D[]
}

export function useChiralChemistry({
  presetIdx,
  mirrorOverlapRatio = 0,
}: UseChiralChemistryOptions) {
  const molecule = useMemo<ChiralMolecule>(() => {
    const validIdx = Math.max(0, Math.min(presetIdx, CHIRAL_PRESETS.length - 1))
    return CHIRAL_PRESETS[validIdx]
  }, [presetIdx])

  // 计算相对于镜像面 (x=0) 的镜像分子 3D 坐标。
  // 当 mirrorOverlapRatio > 0 时，镜像分子沿 x 轴向原分子位置平移（x' = −x + 3.5·(1−ratio)）。
  //
  // ── 镜像面约定（P2-12）──
  // 镜像面**固定取 x = 0**（即 yOz 平面）。因此数据侧必须保证：
  //   · 非手性预设（isChiral === false）：分子自身的对称面就落在 x = 0 上，
  //     如此才可能发生「平移后完全重合」，与画面结论一致；
  //   · 手性预设：不存在任何对称面，故镜像必然错位。
  // 该约定由 __tests__/useChiralChemistry.test.ts 的守门测试锁定。
  const mirroredMolecule = useMemo<MirroredMoleculeData>(() => {
    const mirrorOffset = 3.5 * (1 - mirrorOverlapRatio) // 从 x = +3.5 平移到 x = 0

    const mirroredAtoms: Atom3D[] = molecule.atoms.map((atom) => {
      // 对称变换：x' = -x + mirrorOffset
      const mx = -atom.pos[0] + mirrorOffset
      const my = atom.pos[1]
      const mz = atom.pos[2]
      return {
        ...atom,
        id: `mirror-${atom.id}`,
        pos: [mx, my, mz],
      }
    })

    const mirroredBonds: Bond3D[] = molecule.bonds.map((bond) => {
      const sx = -bond.start[0] + mirrorOffset
      const sy = bond.start[1]
      const sz = bond.start[2]

      const ex = -bond.end[0] + mirrorOffset
      const ey = bond.end[1]
      const ez = bond.end[2]

      return {
        ...bond,
        start: [sx, sy, sz],
        end: [ex, ey, ez],
      }
    })

    return {
      atoms: mirroredAtoms,
      bonds: mirroredBonds,
    }
  }, [molecule, mirrorOverlapRatio])

  // 重叠适配度（在重合比 1.0 时，非手性分子重合度为 100%，手性分子基团重合错位）
  const overlapStatus = useMemo(() => {
    if (mirrorOverlapRatio < 0.95) {
      return { isTesting: false, canOverlap: false, matchPercent: 0 }
    }
    if (!molecule.isChiral) {
      return { isTesting: true, canOverlap: true, matchPercent: 100 }
    } else {
      return { isTesting: true, canOverlap: false, matchPercent: 50 } // 手性分子无法 100% 重合
    }
  }, [mirrorOverlapRatio, molecule.isChiral])

  return {
    molecule,
    mirroredMolecule,
    overlapStatus,
  }
}
