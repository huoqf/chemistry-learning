import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import type { AtomNode, LonePairNode } from '../../types'
import { CHEMISTRY_COLORS } from '@/theme'

interface VseprPolyhedronFrameProps {
  atoms: AtomNode[]
  lonePairs: LonePairNode[]
}

/**
 * VSEPR 理想多面体虚线外框组件 (用于 vsepr_cloud 模式)
 * 将所有价层电子对顶点 (成键原子 + 孤电子对顶点) 连接形成理想外框
 */
export const VseprPolyhedronFrame: React.FC<VseprPolyhedronFrameProps> = ({ atoms, lonePairs }) => {
  const centerAtom = atoms.find(a => a.role === 'center') || atoms[0]
  const centerPos = useMemo(() => new THREE.Vector3(...centerAtom.position), [centerAtom])

  // 汇总所有价层电子对顶点
  const vertexPositions = useMemo(() => {
    const points: THREE.Vector3[] = []

    // 1. 成键原子顶点
    atoms.forEach(a => {
      if (a.role === 'terminal') {
        points.push(new THREE.Vector3(...a.position))
      }
    })

    // 2. 孤电子对顶点
    lonePairs.forEach(lp => {
      const dir = new THREE.Vector3(...lp.direction).normalize()
      const pt = centerPos.clone().add(dir.multiplyScalar(1.3))
      points.push(pt)
    })

    return points
  }, [atoms, lonePairs, centerPos])

  // 生成两两连线的虚线段对
  const frameLinePairs = useMemo(() => {
    const pairs: [number, number, number][][] = []
    const n = vertexPositions.length
    if (n < 2) return pairs

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const p1 = vertexPositions[i]
        const p2 = vertexPositions[j]
        pairs.push([
          [p1.x, p1.y, p1.z],
          [p2.x, p2.y, p2.z],
        ])
      }
    }
    return pairs
  }, [vertexPositions])

  return (
    <group>
      {frameLinePairs.map((pair, idx) => (
        <Line
          key={idx}
          points={pair}
          color={CHEMISTRY_COLORS.concentration}
          lineWidth={1.5}
          dashed
          dashSize={0.15}
          gapSize={0.1}
        />
      ))}
    </group>
  )
}
