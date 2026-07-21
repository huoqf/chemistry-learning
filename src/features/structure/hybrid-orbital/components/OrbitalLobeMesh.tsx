import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface OrbitalLobeMeshProps {
  position: [number, number, number]
  direction: [number, number, number] // 方向向量
  type: 'hybrid' | 'unhybridizedP' | 'lonePair'
  showPhases: boolean
  scale?: number
}

/**
 * 3D 杂化轨道叶片 Mesh 组件
 *
 * 保持 3D 中屏画布纯净，不直接在 3D 空间内挂载 Html 悬浮文字，改为右下角 Legend 统一图例标注
 *
 * 结构：
 * - hybrid: 大叶 (Major Lobe) + 反向小叶 (Minor Lobe)
 * - unhybridizedP: 上下对称双叶 (Dumbbell)
 * - lonePair: 孤电子对透明云泡
 */
export function OrbitalLobeMesh({
  position,
  direction,
  type,
  showPhases,
  scale = 1.0,
}: OrbitalLobeMeshProps) {
  const groupRef = useRef<THREE.Group>(null)

  // 根据方向向量计算旋转 Quaternion
  const rotationQuaternion = useMemo(() => {
    const defaultDir = new THREE.Vector3(0, 1, 0)
    const targetDir = new THREE.Vector3(...direction).normalize()
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(defaultDir, targetDir)
    return q
  }, [direction])

  const dirLength = useMemo(() => {
    return new THREE.Vector3(...direction).length()
  }, [direction])

  const s = scale * dirLength

  // 正负相位颜色定义
  const posColor = showPhases ? '#F43F5E' : '#38BDF8' // 红色 (+ / 杂化大叶)
  const negColor = showPhases ? '#3B82F6' : '#0284C7' // 蓝色 (- / 反向小叶)
  const pColorPos = showPhases ? '#EC4899' : '#0EA5E9' // 未杂化 p 正叶
  const pColorNeg = showPhases ? '#8B5CF6' : '#0284C7' // 未杂化 p 负叶

  if (type === 'lonePair') {
    return (
      <group position={position} quaternion={rotationQuaternion}>
        {/* 孤电子对包络云 */}
        <mesh position={[0, s * 0.45, 0]}>
          <sphereGeometry args={[s * 0.38, 24, 24]} />
          <meshStandardMaterial
            color="#60A5FA"
            transparent
            opacity={0.45}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
        {/* 孤电子对双点标志 */}
        <mesh position={[-s * 0.1, s * 0.48, 0]}>
          <sphereGeometry args={[s * 0.05, 12, 12]} />
          <meshBasicMaterial color="#1E40AF" />
        </mesh>
        <mesh position={[s * 0.1, s * 0.48, 0]}>
          <sphereGeometry args={[s * 0.05, 12, 12]} />
          <meshBasicMaterial color="#1E40AF" />
        </mesh>
      </group>
    )
  }

  if (type === 'unhybridizedP') {
    return (
      <group position={position} quaternion={rotationQuaternion}>
        {/* 上叶 (+) */}
        <mesh position={[0, s * 0.45, 0]} scale={[s * 0.28, s * 0.45, s * 0.28]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={pColorPos}
            transparent
            opacity={0.65}
            roughness={0.3}
          />
        </mesh>
        {/* 下叶 (-) */}
        <mesh position={[0, -s * 0.45, 0]} scale={[s * 0.28, s * 0.45, s * 0.28]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={pColorNeg}
            transparent
            opacity={0.65}
            roughness={0.3}
          />
        </mesh>
      </group>
    )
  }

  // 杂化轨道 (hybrid): 大叶 (Major) + 反向小叶 (Minor)
  return (
    <group ref={groupRef} position={position} quaternion={rotationQuaternion}>
      {/* 1. 大叶 (Major Lobe) — 延 0,1,0 方向开阔 */}
      <group position={[0, s * 0.45, 0]} scale={[s * 0.32, s * 0.48, s * 0.32]}>
        <mesh>
          <sphereGeometry args={[1, 28, 28]} />
          <meshStandardMaterial
            color={posColor}
            transparent
            opacity={0.78}
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>
      </group>

      {/* 2. 反向小叶 (Minor Lobe) — 延 0,-1,0 方向缩小 */}
      <group position={[0, -s * 0.16, 0]} scale={[s * 0.14, s * 0.16, s * 0.14]}>
        <mesh>
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial
            color={negColor}
            transparent
            opacity={0.65}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  )
}
