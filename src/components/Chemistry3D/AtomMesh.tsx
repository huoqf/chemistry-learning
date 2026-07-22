/**
 * AtomMesh — 可复用的原子球体组件
 *
 * 用于晶胞/分子 3D 场景中的原子渲染。
 * 支持点击选中 + 高亮发光 + 局域悬浮回调。
 */
import { useMemo } from 'react'
import { SCENE_COLORS, CHEMISTRY_COLORS, CANVAS_COLORS } from '@/theme'

export interface AtomMeshProps {
  /** 世界坐标位置 [x, y, z] */
  position: [number, number, number]
  /** 元素符号 */
  element: string
  /** 球体颜色（默认 SCENE_COLORS.materials.metal） */
  color?: string
  /** 球体半径（世界单位） */
  radius?: number
  /** 是否选中（高亮） */
  isSelected?: boolean
  /** 点击回调 */
  onSelect?: () => void
  /** 悬浮状态改变回调 */
  onHoverChange?: (isHovered: boolean) => void
  /** 自定义 emissive 颜色（非选中态），用于浅色原子增加可见度 */
  emissiveColor?: string
}

export function AtomMesh({
  position,
  color = SCENE_COLORS.materials.metal,
  radius = 0.18,
  isSelected = false,
  onSelect,
  onHoverChange,
  emissiveColor,
}: AtomMeshProps) {
  const highlightColor = CHEMISTRY_COLORS.concentration
  const meshColor = useMemo(
    () => (isSelected ? highlightColor : color),
    [isSelected, color, highlightColor],
  )

  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHoverChange?.(true)
        }}
        onPointerOut={() => {
          onHoverChange?.(false)
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={meshColor}
          roughness={0.25}
          metalness={0.2}
          emissive={isSelected ? highlightColor : (emissiveColor ?? CANVAS_COLORS.labelText)}
          emissiveIntensity={isSelected ? 0.45 : (emissiveColor ? 0.15 : 0)}
        />
      </mesh>
    </group>
  )
}
