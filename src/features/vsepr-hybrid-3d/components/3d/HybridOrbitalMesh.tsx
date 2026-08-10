import React, { useMemo } from 'react'
import * as THREE from 'three'
import type { HybridizationType, AtomNode, BondEdge, LonePairNode } from '../../types'
import { CHEMISTRY_COLORS } from '@/theme'

interface HybridOrbitalMeshProps {
  hybridization: HybridizationType
  centerAtom: AtomNode
  atoms: AtomNode[]
  bonds: BondEdge[]
  lonePairs: LonePairNode[]
}

interface OrbitalDescriptor {
  direction: THREE.Vector3
  isLonePair: boolean
}

/**
 * 3D 杂化轨道 Lobes 电子云组件 (严谨区分成键杂化与孤对杂化，无重复穿模)
 */
export const HybridOrbitalMesh: React.FC<HybridOrbitalMeshProps> = ({
  hybridization,
  centerAtom,
  atoms,
  bonds,
  lonePairs,
}) => {
  const centerPos = useMemo(() => new THREE.Vector3(...centerAtom.position), [centerAtom])

  // 生成所有杂化轨道的方向与类型描述
  const orbitals = useMemo(() => {
    const list: OrbitalDescriptor[] = []
    const atomMap = new Map<string, AtomNode>()
    atoms.forEach(a => atomMap.set(a.id, a))

    // 1. 成键杂化轨道方向
    bonds.forEach(bond => {
      let targetAtomId: string | null = null
      if (bond.fromAtomId === centerAtom.id) targetAtomId = bond.toAtomId
      else if (bond.toAtomId === centerAtom.id) targetAtomId = bond.fromAtomId

      if (targetAtomId) {
        const targetAtom = atomMap.get(targetAtomId)
        if (targetAtom) {
          const dir = new THREE.Vector3(...targetAtom.position).sub(centerPos).normalize()
          list.push({ direction: dir, isLonePair: false })
        }
      }
    })

    // 2. 充填孤电子对的杂化轨道方向
    lonePairs.forEach(lp => {
      const dir = new THREE.Vector3(...lp.direction).normalize()
      list.push({ direction: dir, isLonePair: true })
    })

    // 保底处理
    if (list.length === 0) {
      if (hybridization === 'sp') {
        list.push({ direction: new THREE.Vector3(1, 0, 0), isLonePair: false })
        list.push({ direction: new THREE.Vector3(-1, 0, 0), isLonePair: false })
      } else if (hybridization === 'sp2') {
        list.push({ direction: new THREE.Vector3(0, 1, 0), isLonePair: false })
        list.push({ direction: new THREE.Vector3(-0.866, -0.5, 0), isLonePair: false })
        list.push({ direction: new THREE.Vector3(0.866, -0.5, 0), isLonePair: false })
      } else {
        list.push({ direction: new THREE.Vector3(0, 1, 0), isLonePair: false })
        list.push({ direction: new THREE.Vector3(0.94, -0.33, 0), isLonePair: false })
        list.push({ direction: new THREE.Vector3(-0.47, -0.33, 0.81), isLonePair: false })
        list.push({ direction: new THREE.Vector3(-0.47, -0.33, -0.81), isLonePair: false })
      }
    }

    return list
  }, [centerAtom, atoms, bonds, lonePairs, hybridization, centerPos])

  return (
    <group position={centerPos}>
      {orbitals.map((item, idx) => {
        const { direction: dir, isLonePair } = item
        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)

        // 主叶中心偏移位置
        const mainLobeOffset = dir.clone().multiplyScalar(0.55)
        // 尾叶位置
        const tailLobeOffset = dir.clone().multiplyScalar(-0.15)

        // 成键杂化使用青蓝色，孤对杂化使用琥珀金色
        const mainColor = isLonePair ? CHEMISTRY_COLORS.pressure : CHEMISTRY_COLORS.electron
        const tailColor = isLonePair ? CHEMISTRY_COLORS.equilibrium : CHEMISTRY_COLORS.ion

        return (
          <group key={idx}>
            {/* 1. 主叶 (Main Lobe) */}
            <mesh position={mainLobeOffset} quaternion={quaternion} scale={[0.34, 0.68, 0.34]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial
                color={mainColor}
                transparent
                opacity={isLonePair ? 0.65 : 0.45}
                emissive={isLonePair ? CHEMISTRY_COLORS.equilibrium : '#000000'}
                emissiveIntensity={isLonePair ? 0.3 : 0}
                roughness={0.1}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* 2. 小尾叶 (Tail Lobe) */}
            <mesh position={tailLobeOffset} quaternion={quaternion} scale={[0.15, 0.25, 0.15]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={tailColor}
                transparent
                opacity={0.35}
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
