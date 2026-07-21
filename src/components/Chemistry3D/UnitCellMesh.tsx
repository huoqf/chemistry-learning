/**
 * UnitCellMesh — 可复用的晶胞线框组件
 *
 * 用于 3D 晶胞场景中渲染晶胞棱边。
 * 支持任意晶系（通过 CellParams 传入 a/b/c/α/β/γ）。
 *
 * @example
 * ```tsx
 * <UnitCellMesh
 *   cellParams={{ a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 }}
 *   color={CANVAS_COLORS.grid}
 * />
 * ```
 */
import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { fracToWorld, type CellParams } from './utils/coordTransform'
import { CANVAS_COLORS } from '@/theme'

export interface UnitCellMeshProps {
  /** 晶胞参数 */
  cellParams: CellParams
  /** 线框颜色（默认 CANVAS_COLORS.strokeDark） */
  color?: string
  /** 线宽（默认 1.8） */
  lineWidth?: number
  /** 是否虚线（默认 true） */
  dashed?: boolean
}

const CORNER_FRACS: Array<readonly [number, number, number]> = [
  [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
  [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
]

const EDGE_PAIRS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 0], // 底面
  [4, 5], [5, 6], [6, 7], [7, 4], // 顶面
  [0, 4], [1, 5], [2, 6], [3, 7], // 竖棱
]

export function UnitCellMesh({
  cellParams,
  color = CANVAS_COLORS.strokeDark,
  lineWidth = 1.8,
  dashed = true,
}: UnitCellMeshProps) {
  const lines = useMemo(() => {
    return EDGE_PAIRS.map(([a, b]) => ({
      start: fracToWorld(CORNER_FRACS[a], cellParams),
      end: fracToWorld(CORNER_FRACS[b], cellParams),
    }))
  }, [cellParams])

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color={color}
          lineWidth={lineWidth}
          dashed={dashed}
          dashScale={12}
          dashSize={0.4}
          gapSize={0.3}
        />
      ))}
    </group>
  )
}
