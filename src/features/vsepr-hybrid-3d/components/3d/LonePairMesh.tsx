import React from 'react'
import * as THREE from 'three'
import type { LonePairNode } from '../../types'
import { CHEMISTRY_COLORS } from '@/theme'

interface LonePairMeshProps {
  lonePairs: LonePairNode[]
  centerPosition: [number, number, number]
  showRepulsionHalo?: boolean
}

/**
 * 3D 孤电子对发光气泡组件 (简洁清爽，移除多余繁复的网状线框球)
 */
export const LonePairMesh: React.FC<LonePairMeshProps> = ({
  lonePairs,
  centerPosition,
  showRepulsionHalo = false,
}) => {
  const centerPos = new THREE.Vector3(...centerPosition)

  return (
    <group position={centerPos}>
      {lonePairs.map((lp, idx) => {
        const dir = new THREE.Vector3(...lp.direction).normalize()
        const lpPosition = dir.clone().multiplyScalar(0.95)

        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)

        // 在排斥模式下提高自发光强度，替代繁复的网格线框
        const emissiveIntensity = showRepulsionHalo ? 0.75 : 0.4
        const opacity = showRepulsionHalo ? 0.8 : 0.65

        return (
          <group key={lp.id || idx}>
            {/* 孤电子对空间电子云 (干净清爽的琥珀发光包络体) */}
            <mesh position={lpPosition} quaternion={quaternion} scale={[0.42, 0.75, 0.42]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial
                color={CHEMISTRY_COLORS.pressure}
                transparent
                opacity={opacity}
                emissive={CHEMISTRY_COLORS.equilibrium}
                emissiveIntensity={emissiveIntensity}
                roughness={0.1}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
