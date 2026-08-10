import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import type { AtomNode, LonePairNode } from '../../types'
import { CHEMISTRY_COLORS } from '@/theme'

interface RepulsionVectorsProps {
  atoms: AtomNode[]
  lonePairs: LonePairNode[]
}

/**
 * 静电排斥力挤压作用矢线组件 (用于 repulsion_demo 模式)
 * 从孤电子对指向成键电子对，绘制排斥压制弧线
 */
export const RepulsionVectors: React.FC<RepulsionVectorsProps> = ({ atoms, lonePairs }) => {
  const centerAtom = atoms.find(a => a.role === 'center') || atoms[0]
  const centerPos = useMemo(() => new THREE.Vector3(...centerAtom.position), [centerAtom])

  const terminalAtoms = useMemo(() => atoms.filter(a => a.role === 'terminal'), [atoms])

  // 生成从每个孤电子对指向每个配位原子的弧线段
  const repulsionArcPairs = useMemo(() => {
    const arcs: [number, number, number][][] = []

    lonePairs.forEach(lp => {
      const lpDir = new THREE.Vector3(...lp.direction).normalize()
      const lpPos = centerPos.clone().add(lpDir.multiplyScalar(1.0))

      terminalAtoms.forEach(tAtom => {
        const tPos = new THREE.Vector3(...tAtom.position)

        // 生成从 lpPos 到 tPos 的小二次贝塞尔弧线
        const rawMid = new THREE.Vector3().addVectors(lpPos, tPos).multiplyScalar(0.5)
        const midPoint = rawMid.clone().add(centerPos.clone().sub(rawMid).normalize().multiplyScalar(-0.2))

        const curve = new THREE.QuadraticBezierCurve3(lpPos, midPoint, tPos)
        const points = curve.getPoints(16).map(p => [p.x, p.y, p.z] as [number, number, number])
        arcs.push(points)
      })
    })

    return arcs
  }, [lonePairs, terminalAtoms, centerPos])

  if (lonePairs.length === 0) return null

  return (
    <group>
      {repulsionArcPairs.map((arcPoints, idx) => (
        <Line
          key={idx}
          points={arcPoints}
          color={CHEMISTRY_COLORS.temperature}
          lineWidth={2.5}
          dashed
          dashSize={0.12}
          gapSize={0.08}
        />
      ))}
    </group>
  )
}
