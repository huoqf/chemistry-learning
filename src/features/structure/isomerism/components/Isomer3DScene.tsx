import { useState, useMemo, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { AtomMesh, BondMesh } from '@/components/Chemistry3D'
import { SCENE_COLORS, CANVAS_COLORS, colors } from '@/theme'
import type { IsomerNode } from '@/components/Chemistry'
import { get3DModelForIsomer } from '../utils/isomer3dTransform'

// 3D 球棍模型在白色主屏上需要更柔和的光照，避免高光过曝
const AMBIENT_INTENSITY = 0.95
const DIRECTIONAL_INTENSITY = 0.9

// 惰性缓存 WebGL 检测
let _cachedWebGL: boolean | null = null
function isWebGLAvailable(): boolean {
  if (_cachedWebGL !== null) return _cachedWebGL
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    _cachedWebGL = !!gl
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    _cachedWebGL = false
  }
  return _cachedWebGL
}

function WebGLFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-4 text-center rounded-xl border border-slate-200">
      <span className="text-3xl mb-2">🔬</span>
      <h4 className="text-sm font-bold text-slate-800 mb-1">3D 视图不可用</h4>
      <p className="text-xs text-slate-500 max-w-xs">
        当前环境未开启 WebGL 硬件加速，左侧 2D 碳骨架图可正常用于探究与学习。
      </p>
    </div>
  )
}

export interface Isomer3DSceneProps {
  isomer?: IsomerNode | null
  className?: string
}

export function Isomer3DScene({ isomer, className = '' }: Isomer3DSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null)
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  // 监听容器 DOM 真实宽高，只有当 width > 0 且 height > 0 时才渲染 R3F Canvas，杜绝 Three.js 0 尺寸崩溃！
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setContainerSize({ width: Math.round(width), height: Math.round(height) })
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const model3d = useMemo(() => get3DModelForIsomer(isomer), [isomer])

  const selectedAtom = useMemo(
    () => model3d.atoms.find((a) => a.id === selectedAtomId) ?? null,
    [model3d.atoms, selectedAtomId],
  )

  // 去重统计当前分子中出现的元素类型
  const legendElements = useMemo(() => {
    const seen = new Set<string>()
    const result: Array<{ element: string; color: string; role: string }> = []
    for (const atom of model3d.atoms) {
      if (seen.has(atom.element)) continue
      seen.add(atom.element)
      const role = atom.element === 'C'
        ? '碳骨架'
        : atom.element === 'O'
          ? '官能团 (O)'
          : '氢原子'
      result.push({ element: atom.element, color: atom.color, role })
    }
    return result
  }, [model3d.atoms])

  if (!isWebGLAvailable()) {
    return <WebGLFallback />
  }

  const isReady = containerSize.width > 0 && containerSize.height > 0

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* 顶部标题与交互提示徽章（浅色 token，适配白底主屏）*/}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur"
          style={{ backgroundColor: colors.primary[600], color: colors.neutral.white }}
        >
          3D 空间球棍模型 (360° 旋转)
        </span>
        {isomer?.name && (
          <span
            className="text-[11px] px-2 py-0.5 rounded border"
            style={{
              color: colors.neutral[700],
              backgroundColor: colors.neutral[50],
              borderColor: colors.neutral[200],
            }}
          >
            {isomer.name}
          </span>
        )}
      </div>

      {isReady ? (
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          camera={{
            position: [0, 0, 4.5],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={AMBIENT_INTENSITY} />
          <directionalLight position={[5, 8, 5]} intensity={DIRECTIONAL_INTENSITY} />
          <pointLight position={[-5, -5, -5]} intensity={0.4} />

          <group onPointerMissed={() => setSelectedAtomId(null)}>
            {/* 1. 渲染 3D 化学键 */}
            {model3d.bonds.map((bond) => (
              <BondMesh
                key={bond.id}
                start={bond.start}
                end={bond.end}
                color={bond.color || SCENE_COLORS.materials.metal}
                radius={0.035}
                startInset={0.1}
                endInset={0.1}
              />
            ))}

            {/* 2. 渲染 3D 原子 (点击切换选中/取消选中) */}
            {model3d.atoms.map((atom) => (
              <AtomMesh
                key={atom.id}
                position={atom.position}
                radius={atom.radius}
                color={atom.color}
                element={atom.element}
                isSelected={selectedAtomId === atom.id}
                onSelect={() => setSelectedAtomId(selectedAtomId === atom.id ? null : atom.id)}
                emissiveColor={atom.element === 'H' ? CANVAS_COLORS.labelText : undefined}
              />
            ))}
          </group>

          {/* 3. OrbitControls 3D 手势交互 - 关闭 damping */}
          <OrbitControls enableDamping={false} makeDefault />
        </Canvas>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-xs"
          style={{ color: colors.neutral[500] }}
        >
          加载 3D 视口…
        </div>
      )}

      {/* 主屏右下角图例 (Legend Card) */}
      <div className="absolute bottom-3 right-3 z-10 p-3 rounded-xl bg-white/95 backdrop-blur border border-slate-200 shadow-md text-xs flex flex-col gap-2 pointer-events-auto">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
          分子图例
        </div>
        {legendElements.map((el) => (
          <div key={el.element} className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0 border border-slate-300/40"
              style={{ backgroundColor: el.color }}
            />
            <span className="font-bold text-slate-800">{el.element}</span>
            <span className="text-[11px] text-slate-500">({el.role})</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 rounded-full shrink-0" style={{ backgroundColor: SCENE_COLORS.materials.metal }} />
          <span className="text-[11px] text-slate-500">化学键 (σ / π)</span>
        </div>
      </div>

      {/* 选中原子明细与关闭按钮 (左下角) */}
      {selectedAtom && (
        <div className="absolute bottom-3 left-3 z-10 p-3 rounded-xl bg-white/95 backdrop-blur border border-blue-200 shadow-lg text-xs text-slate-800 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="w-4 h-4 rounded-full shadow-sm shrink-0"
              style={{ backgroundColor: selectedAtom.color }}
            />
            <div>
              <div className="font-bold flex items-center gap-2">
                <span>{selectedAtom.element} 原子</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                  {selectedAtom.element === 'C' ? '碳原子' : selectedAtom.element === 'O' ? '氧原子' : '氢原子'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {selectedAtom.element === 'C'
                  ? '碳原子构成分子骨架，形成四个共价键'
                  : selectedAtom.element === 'O'
                    ? '氧原子参与形成官能团 (羟基/醚键/羰基等)'
                    : '氢原子与碳原子形成 σ 键，决定等效氢种类'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedAtomId(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition-colors shrink-0"
          >
            关闭明细
          </button>
        </div>
      )}
    </div>
  )
}
