/**
 * BondMesh — 3D 晶格/化学键连线组件
 *
 * 用圆柱体渲染可见的化学键连线，避免 WebGL Line lineWidth=1 限制。
 * 缩短起止点到原子表面，避免键被原子遮挡。
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { CANVAS_COLORS } from '@/theme'

export interface BondMeshProps {
  /** 起点世界坐标 [x, y, z] */
  start: [number, number, number]
  /** 终点世界坐标 [x, y, z] */
  end: [number, number, number]
  /** 连线颜色（默认 CANVAS_COLORS.trackHistory） */
  color?: string
  /** 圆柱半径（世界单位，默认 0.028） */
  radius?: number
  /** 起点缩进（世界单位，模拟原子半径遮挡，默认 0.18） */
  startInset?: number
  /** 终点缩进（世界单位，模拟原子半径遮挡，默认 0.18） */
  endInset?: number
}

const _start = new THREE.Vector3()
const _end = new THREE.Vector3()
const _mid = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _up = new THREE.Vector3(0, 1, 0)

export function BondMesh({
  start,
  end,
  color = CANVAS_COLORS.trackHistory,
  radius = 0.028,
  startInset = 0.18,
  endInset = 0.18,
}: BondMeshProps) {
  const { position, quaternion, length } = useMemo(() => {
    _start.fromArray(start)
    _end.fromArray(end)
    _dir.subVectors(_end, _start)
    const fullLen = _dir.length()
    if (fullLen < 1e-6) return { position: [0, 0, 0] as [number, number, number], quaternion: _quat.identity().clone(), length: 0 }

    _dir.normalize()
    // 缩进起止点，让键只在原子之间的空隙中可见
    const visibleLen = Math.max(fullLen - startInset - endInset, 0)
    if (visibleLen < 1e-6) return { position: [0, 0, 0] as [number, number, number], quaternion: _quat.identity().clone(), length: 0 }

    _mid.copy(_start).addScaledVector(_dir, startInset + visibleLen * 0.5)
    _quat.setFromUnitVectors(_up, _dir)

    return {
      position: [_mid.x, _mid.y, _mid.z] as [number, number, number],
      quaternion: _quat.clone(),
      length: visibleLen,
    }
  }, [start, end, startInset, endInset])

  if (length < 1e-6) return null

  return (
    <mesh position={position} quaternion={quaternion} renderOrder={1}>
      <cylinderGeometry args={[radius, radius, length, 12, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
        depthTest={true}
        depthWrite={true}
      />
    </mesh>
  )
}
