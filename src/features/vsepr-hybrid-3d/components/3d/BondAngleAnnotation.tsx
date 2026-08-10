import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Line, Html } from '@react-three/drei'
import type { BondAngleData, AtomNode } from '../../types'
import { CHEMISTRY_COLORS } from '@/theme'

interface BondAngleAnnotationProps {
  angles: BondAngleData[]
  atoms: AtomNode[]
}

/**
 * 3D 空间成键电子对夹角弧线与测量标示组件 (遵守 @/theme Token 规范)
 */
export const BondAngleAnnotation: React.FC<BondAngleAnnotationProps> = ({ angles, atoms }) => {
  const atomMap = useMemo(() => {
    const map = new Map<string, AtomNode>()
    atoms.forEach(a => map.set(a.id, a))
    return map
  }, [atoms])

  return (
    <group>
      {angles.map(angleData => {
        const atom1 = atomMap.get(angleData.atom1Id)
        const center = atomMap.get(angleData.centerAtomId)
        const atom2 = atomMap.get(angleData.atom2Id)

        if (!atom1 || !center || !atom2) return null

        const cPos = new THREE.Vector3(...center.position)
        const v1 = new THREE.Vector3(...atom1.position).sub(cPos).normalize()
        const v2 = new THREE.Vector3(...atom2.position).sub(cPos).normalize()

        // 弧线半径
        const radius = 0.7
        const numPoints = 24
        const curvePoints: [number, number, number][] = []

        // 计算角平分线方向用于放置 Html 标注
        const bisector = new THREE.Vector3().addVectors(v1, v2).normalize()

        for (let i = 0; i <= numPoints; i++) {
          const t = i / numPoints
          // 向量 Slerp 球形球面插值
          const pVector = v1.clone().applyQuaternion(
            new THREE.Quaternion().setFromUnitVectors(
              v1,
              v1.clone().lerp(v2, t).normalize()
            )
          )
          const p = cPos.clone().add(pVector.multiplyScalar(radius))
          curvePoints.push([p.x, p.y, p.z])
        }

        const labelPos = cPos.clone().add(bisector.multiplyScalar(radius + 0.35))

        return (
          <group key={angleData.id}>
            {/* 1. 3D 弧线 (使用 CHEMISTRY_COLORS.volume 紫色) */}
            {curvePoints.length > 1 && (
              <Line
                points={curvePoints}
                color={CHEMISTRY_COLORS.volume}
                lineWidth={3}
                dashed={false}
              />
            )}

            {/* 2. 角度数值 Html Badge */}
            <Html position={[labelPos.x, labelPos.y, labelPos.z]} center distanceFactor={10}>
              <div className="px-2 py-0.5 rounded bg-indigo-600/90 text-white font-mono text-[11px] font-bold shadow border border-indigo-300 pointer-events-none whitespace-nowrap">
                ∠ {angleData.displayLabel || `${angleData.angleDegree}°`}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
