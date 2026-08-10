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

      {/* 2. 化学键圆柱 (使用 SCENE_COLORS.materials.metal) */}
      {!showSpaceFilling &&
        bonds.map(bond => {
          const fromAtom = atomMap.get(bond.fromAtomId)
          const toAtom = atomMap.get(bond.toAtomId)
          if (!fromAtom || !toAtom) return null

          const start = new THREE.Vector3(...fromAtom.position)
          const end = new THREE.Vector3(...toAtom.position)
          const direction = new THREE.Vector3().subVectors(end, start)
          const length = direction.length()
          const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

          // 旋转四元数计算
          const orientation = new THREE.Quaternion()
          orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())

          return (
            <mesh
              key={bond.id}
              position={midPoint}
              quaternion={orientation}
            >
              <cylinderGeometry args={[0.08, 0.08, length, 16]} />
              <meshStandardMaterial
                color={SCENE_COLORS.materials.metal}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
          )
        })}
    </group>
  )
}
