import React from 'react'
import * as THREE from 'three'
import type { AtomNode, BondEdge } from '../../types'
import { SCENE_COLORS } from '@/theme'

interface MoleculeMeshProps {
  atoms: AtomNode[]
  bonds: BondEdge[]
  showSpaceFilling?: boolean
}

/**
 * 3D 分子球棍与比例模型组件 (遵守 @/theme Token 规范)
 */
export const MoleculeMesh: React.FC<MoleculeMeshProps> = ({
  atoms,
  bonds,
  showSpaceFilling = false,
}) => {
  const atomMap = new Map<string, AtomNode>()
  atoms.forEach(a => atomMap.set(a.id, a))

  return (
    <group>
      {/* 1. 原子球体 */}
      {atoms.map(atom => {
        const radiusScale = showSpaceFilling ? 1.6 : 1.0
        return (
          <mesh key={atom.id} position={atom.position}>
            <sphereGeometry args={[atom.radius * radiusScale, 32, 32]} />
            <meshStandardMaterial
              color={atom.color}
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>
        )
      })}

      {/* 2. 化学键圆柱 (依据 bondOrder 区分单键、双键、三键与离域大 π 键) */}
      {!showSpaceFilling &&
        bonds.map(bond => {
          const fromAtom = atomMap.get(bond.fromAtomId)
          const toAtom = atomMap.get(bond.toAtomId)
          if (!fromAtom || !toAtom) return null

          const start = new THREE.Vector3(...fromAtom.position)
          const end = new THREE.Vector3(...toAtom.position)
          const direction = new THREE.Vector3().subVectors(end, start)
          const length = direction.length()
          if (length < 1e-6) return null
          const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
          const unitDir = direction.clone().normalize()

          const orientation = new THREE.Quaternion()
          orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), unitDir)

          // 构造与键轴正交的偏移方向，用于绘制平行双键 / 离域副键
          const refAxis = Math.abs(unitDir.z) < 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0)
          const perp = new THREE.Vector3().crossVectors(unitDir, refAxis).normalize()

          const order = bond.bondOrder ?? 1
          if (Math.abs(order - 2) < 0.05) {
            return (
              <group key={bond.id}>
                {[-0.085, 0.085].map((offset, idx) => (
                  <mesh key={idx} position={midPoint.clone().addScaledVector(perp, offset)} quaternion={orientation}>
                    <cylinderGeometry args={[0.052, 0.052, length, 16]} />
                    <meshStandardMaterial color={SCENE_COLORS.materials.metal} roughness={0.3} metalness={0.2} />
                  </mesh>
                ))}
              </group>
            )
          }

          if (Math.abs(order - 3) < 0.05) {
            return (
              <group key={bond.id}>
                {[-0.105, 0, 0.105].map((offset, idx) => (
                  <mesh key={idx} position={midPoint.clone().addScaledVector(perp, offset)} quaternion={orientation}>
                    <cylinderGeometry args={[0.044, 0.044, length, 16]} />
                    <meshStandardMaterial color={SCENE_COLORS.materials.metal} roughness={0.3} metalness={0.2} />
                  </mesh>
                ))}
              </group>
            )
          }

          if (order > 1.05 && order < 1.95) {
            // 离域键（如 SO₂ 1.5、CO₃²⁻/NO₃⁻/SO₃ 4/3）：主 σ 键 + 半透明离域 π 副柱
            return (
              <group key={bond.id}>
                <mesh position={midPoint.clone().addScaledVector(perp, -0.065)} quaternion={orientation}>
                  <cylinderGeometry args={[0.064, 0.064, length, 16]} />
                  <meshStandardMaterial color={SCENE_COLORS.materials.metal} roughness={0.3} metalness={0.2} />
                </mesh>
                <mesh position={midPoint.clone().addScaledVector(perp, 0.075)} quaternion={orientation}>
                  <cylinderGeometry args={[0.036, 0.036, length, 16]} />
                  <meshStandardMaterial color={SCENE_COLORS.materials.metal} roughness={0.3} metalness={0.2} transparent opacity={0.5} />
                </mesh>
              </group>
            )
          }

          return (
            <mesh key={bond.id} position={midPoint} quaternion={orientation}>
              <cylinderGeometry args={[0.08, 0.08, length, 16]} />
              <meshStandardMaterial color={SCENE_COLORS.materials.metal} roughness={0.3} metalness={0.2} />
            </mesh>
          )
        })}
    </group>
  )
}
