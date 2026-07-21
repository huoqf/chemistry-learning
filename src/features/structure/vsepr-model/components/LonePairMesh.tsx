import { useMemo } from 'react'
import * as THREE from 'three'
import { SCENE_COLORS } from '@/theme'

interface LonePairMeshProps {
  position: [number, number, number]
  label?: string
  scale?: number
}

export function LonePairMesh({ position, scale = 1 }: LonePairMeshProps) {
  // 计算旋转四元数，使拉长的椭球体朝向 position 方向
  const { direction, length, quaternion } = useMemo(() => {
    const dir = new THREE.Vector3(...position)
    const len = dir.length()
    dir.normalize()
    // 默认几何轴向设为 (0, 1, 0)
    const up = new THREE.Vector3(0, 1, 0)
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(up, dir)
    return { direction: dir, length: len, quaternion: q }
  }, [position])

  // 椭球体中点放置
  const midPos = useMemo(() => {
    return [
      direction.x * (length * 0.55),
      direction.y * (length * 0.55),
      direction.z * (length * 0.55),
    ] as [number, number, number]
  }, [direction, length])

  // 孤电子对小圆点
  const dotOffset = 0.18

  return (
    <group position={midPos} quaternion={quaternion}>
      {/* 半透明孤电子对云泡 (水滴状拉长) */}
      <mesh scale={[0.42 * scale, 0.65 * scale, 0.42 * scale]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={SCENE_COLORS.materials.glass}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* 电子对内部两颗发光/高亮小球 */}
      <mesh position={[-dotOffset, 0.1, 0]} scale={[0.07 * scale, 0.07 * scale, 0.07 * scale]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={SCENE_COLORS.materials.glassBorder} emissive={SCENE_COLORS.materials.glassBorder} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[dotOffset, 0.1, 0]} scale={[0.07 * scale, 0.07 * scale, 0.07 * scale]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={SCENE_COLORS.materials.glassBorder} emissive={SCENE_COLORS.materials.glassBorder} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}
