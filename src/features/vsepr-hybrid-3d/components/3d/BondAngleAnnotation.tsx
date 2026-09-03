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

        const dot = Math.min(Math.max(v1.dot(v2), -1), 1)
        const isLinear = dot <= -0.999 // 接近 180° (如 CO2)

        let labelPos: THREE.Vector3

        if (isLinear) {
          // 直线形分子 (180°): 选择一个垂直于键轴的法向基底 (优先选用 Y 轴上方)
          const refAxis = Math.abs(v1.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1)
          const perpDir = refAxis.clone().projectOnPlane(v1).normalize()
          if (perpDir.y < 0) perpDir.negate() // 确保朝上

          // 绕垂直轴作 0 ~ π 的正圆半弧
          const rotAxis = new THREE.Vector3().crossVectors(v1, perpDir).normalize()
          for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * Math.PI
            const pVec = v1.clone().applyAxisAngle(rotAxis, angle)
            const p = cPos.clone().add(pVec.multiplyScalar(radius))
            curvePoints.push([p.x, p.y, p.z])
          }

          labelPos = cPos.clone().add(perpDir.multiplyScalar(radius + 0.35))
        } else {
          // 常规弯曲分子: 沿 v1 与 v2 所在平面的严格圆弧旋转
          const rotAxis = new THREE.Vector3().crossVectors(v1, v2).normalize()
          const totalAngle = Math.acos(dot)
          const bisector = new THREE.Vector3().addVectors(v1, v2).normalize()

          for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * totalAngle
            const pVec = v1.clone().applyAxisAngle(rotAxis, angle)
            const p = cPos.clone().add(pVec.multiplyScalar(radius))
            curvePoints.push([p.x, p.y, p.z])
          }

          labelPos = cPos.clone().add(bisector.multiplyScalar(radius + 0.35))
        }

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
