import { useState, useMemo, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import { AtomMesh, BondMesh } from '@/components/Chemistry3D'
import type { ChiralMolecule, Atom3D, Bond3D } from '../data/chiralData'
import type { MirroredMoleculeData } from '../hooks/useChiralChemistry'
import { useSimulationFrame } from '@/utils/animation'
import { SCENE_COLORS } from '@/theme'

interface ChiralMoleculeSceneProps {
  molecule: ChiralMolecule
  mirroredMolecule: MirroredMoleculeData
  showMirror: boolean
  showChiralLabels: boolean
  showCisTransCompare: boolean
  mirrorOverlapRatio: number
  onRatioChange?: (ratio: number) => void
}

function MirrorPlaneMesh({ positionX }: { positionX: number }) {
  return (
    <group position={[positionX, 0, 0]}>
      {/* 镜像半透明网格平面 */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial
          color={SCENE_COLORS.materials.glass}
          transparent
          opacity={0.35}
          side={2} // DoubleSide
        />
      </mesh>
      {/* 镜像面外框线 */}
      <Line
        points={[
          [0, 2, -2.5],
          [0, 2, 2.5],
          [0, -2, 2.5],
          [0, -2, -2.5],
          [0, 2, -2.5],
        ]}
        color="#818CF8"
        lineWidth={2}
      />
      <Html position={[0, 2.2, 0]} center>
        <div className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-500/80 text-white shadow backdrop-blur-sm pointer-events-none whitespace-nowrap">
          🪞 镜像平面 (Mirror Plane)
        </div>
      </Html>
    </group>
  )
}

function ChiralCenterStar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      <Html position={[0, 0.55, 0]} center>
        <div className="px-1.5 py-0.5 text-[11px] font-black rounded-full bg-amber-500 text-slate-900 border border-amber-300 shadow-md animate-pulse pointer-events-none whitespace-nowrap">
          ★ *C 手性中心
        </div>
      </Html>
    </group>
  )
}

function MoleculeRenderGroup({
  atoms,
  bonds,
  selectedAtomId,
  onSelectAtom,
  showLabels,
  substituents,
  isMirror = false,
}: {
  atoms: Atom3D[]
  bonds: Bond3D[]
  selectedAtomId: string | null
  onSelectAtom: (id: string | null) => void
  showLabels: boolean
  substituents?: ChiralMolecule['substituents']
  isMirror?: boolean
}) {
  const atomColorMap = useMemo(() => {
    const map: Record<number, string> = {}
    if (substituents) {
      substituents.forEach((sub) => {
        sub.atomIndices.forEach((idx) => {
          map[idx] = sub.color
        })
      })
    }
    return map
  }, [substituents])

  return (
    <group>
      {/* 1. 渲染化学键 */}
      {bonds.map((bond, idx) => (
        <BondMesh
          key={`bond-${idx}`}
          start={bond.start}
          end={bond.end}
          color={bond.type === 'double' ? '#818CF8' : SCENE_COLORS.materials.metal}
          radius={bond.type === 'double' ? 0.05 : 0.04}
        />
      ))}

      {/* 2. 渲染原子 */}
      {atoms.map((atom, idx) => {
        const isSelected = selectedAtomId === atom.id
        const groupColor = atomColorMap[idx]

        return (
          <group key={atom.id}>
            <AtomMesh
              position={atom.pos}
              element={atom.element}
              color={groupColor || atom.color}
              radius={atom.isChiralCenter ? 0.38 : 0.28}
              isSelected={isSelected}
              onSelect={() => onSelectAtom(isSelected ? null : atom.id)}
            />

            {/* 手性碳星号标记 */}
            {atom.isChiralCenter && !isMirror && (
              <ChiralCenterStar position={atom.pos} />
            )}

            {/* 基团与原子 3D 文字标签 */}
            {showLabels && atom.groupLabel && (
              <Html position={[atom.pos[0], atom.pos[1] + 0.45, atom.pos[2]]} center>
                <div
                  className={`px-1.5 py-0.5 text-xs font-bold rounded shadow-sm backdrop-blur-sm pointer-events-none whitespace-nowrap border ${
                    isMirror
                      ? 'bg-purple-900/80 text-purple-200 border-purple-400/50'
                      : atom.isChiralCenter
                      ? 'bg-amber-500/90 text-slate-900 border-amber-300'
                      : 'bg-slate-800/80 text-slate-100 border-slate-600'
                  }`}
                >
                  {isMirror ? `镜像 ${atom.groupLabel}` : atom.groupLabel}
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}

function SceneContent({
  molecule,
  mirroredMolecule,
  showMirror,
  showChiralLabels,
  showCisTransCompare,
  mirrorOverlapRatio,
}: ChiralMoleculeSceneProps) {
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null)
  const mirrorPlaneX = 1.75 * (1 - mirrorOverlapRatio)

  return (
    <group onPointerMissed={() => setSelectedAtomId(null)}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 6]} intensity={0.9} />
      <directionalLight position={[-6, -4, -6]} intensity={0.35} />

      {showCisTransCompare && molecule.cisTransPair ? (
        <group>
          <group position={[-2.2, 0, 0]}>
            <MoleculeRenderGroup
              atoms={molecule.atoms}
              bonds={molecule.bonds}
              selectedAtomId={selectedAtomId}
              onSelectAtom={setSelectedAtomId}
              showLabels={showChiralLabels}
            />
            <Html position={[0, -2, 0]} center>
              <div className="px-2 py-1 text-xs font-bold bg-emerald-600/90 text-white rounded-md shadow border border-emerald-400 pointer-events-none whitespace-nowrap">
                顺式 (Cis Isomer): {molecule.name}
              </div>
            </Html>
          </group>

          <group position={[2.2, 0, 0]}>
            <MoleculeRenderGroup
              atoms={molecule.cisTransPair.pairAtoms}
              bonds={molecule.cisTransPair.pairBonds}
              selectedAtomId={selectedAtomId}
              onSelectAtom={setSelectedAtomId}
              showLabels={showChiralLabels}
            />
            <Html position={[0, -2, 0]} center>
              <div className="px-2 py-1 text-xs font-bold bg-indigo-600/90 text-white rounded-md shadow border border-indigo-400 pointer-events-none whitespace-nowrap">
                反式 (Trans Isomer): {molecule.cisTransPair.pairName}
              </div>
            </Html>
          </group>
        </group>
      ) : (
        <group>
          <group position={showMirror ? [-0.5 * (1 - mirrorOverlapRatio), 0, 0] : [0, 0, 0]}>
            <MoleculeRenderGroup
              atoms={molecule.atoms}
              bonds={molecule.bonds}
              selectedAtomId={selectedAtomId}
              onSelectAtom={setSelectedAtomId}
              showLabels={showChiralLabels}
              substituents={molecule.substituents}
            />
            {showMirror && (
              <Html position={[0, -2.2, 0]} center>
                <div className="px-2 py-1 text-xs font-bold bg-blue-600/90 text-white rounded-md shadow border border-blue-400 pointer-events-none whitespace-nowrap">
                  实物分子 (Original)
                </div>
              </Html>
            )}
          </group>

          {showMirror && mirrorOverlapRatio < 0.9 && (
            <MirrorPlaneMesh positionX={mirrorPlaneX} />
          )}

          {showMirror && (
            <group>
              <MoleculeRenderGroup
                atoms={mirroredMolecule.atoms}
                bonds={mirroredMolecule.bonds}
                selectedAtomId={selectedAtomId}
                onSelectAtom={setSelectedAtomId}
                showLabels={showChiralLabels}
                substituents={molecule.substituents}
                isMirror
              />
              <Html position={[3.5 * (1 - mirrorOverlapRatio), -2.2, 0]} center>
                <div className="px-2 py-1 text-xs font-bold bg-purple-600/90 text-white rounded-md shadow border border-purple-400 pointer-events-none whitespace-nowrap">
                  镜像分子 (Mirror Image)
                </div>
              </Html>
            </group>
          )}
        </group>
      )}

      <OrbitControls enableDamping={false} makeDefault />
    </group>
  )
}

export function ChiralMoleculeScene(props: ChiralMoleculeSceneProps) {
  const { molecule, showMirror, showCisTransCompare, mirrorOverlapRatio, onRatioChange } = props
  const [isPlaying, setIsPlaying] = useState(false)
  const elapsedRef = useRef(0)
  const startRatioRef = useRef(0)
  const duration = 2400

  const step = useCallback((deltaMs: number) => {
    elapsedRef.current += deltaMs
    const progress = Math.min(1, elapsedRef.current / duration)

    // cubic ease-in-out
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    const nextRatio = startRatioRef.current + (1 - startRatioRef.current) * eased
    onRatioChange?.(Math.min(1, nextRatio))

    if (progress >= 1) {
      setIsPlaying(false)
      onRatioChange?.(1)
    }
  }, [onRatioChange])

  useSimulationFrame(step, { active: isPlaying })

  const startOverlap = useCallback(() => {
    startRatioRef.current = mirrorOverlapRatio >= 1 ? 0 : mirrorOverlapRatio
    elapsedRef.current = 0
    setIsPlaying(true)
  }, [mirrorOverlapRatio])

  return (
    <div className="w-full h-full relative" style={{ touchAction: 'none' }}>
      {/* 3D 画布 */}
      <Canvas
        camera={{
          position: [0, 1.5, 6.5],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        frameloop="demand"
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <SceneContent {...props} />
      </Canvas>

      {/* 3D Overlay 美化悬浮交互工具栏 */}
      {showMirror && !showCisTransCompare && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
          {/* 毛玻璃核心交互控制条 */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-2xl text-slate-100 text-xs">
            {/* 自动重叠播放按钮 */}
            <button
              onClick={() => isPlaying ? setIsPlaying(false) : startOverlap()}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all shadow ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {isPlaying ? '⏸ 暂停演示' : '▶ 自动平移重叠演示'}
            </button>

            <div className="h-4 w-px bg-slate-700/80 my-auto" />

            {/* 分级控制按钮 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setIsPlaying(false); onRatioChange?.(0) }}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  mirrorOverlapRatio === 0 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                0% 分离
              </button>
              <button
                onClick={() => { setIsPlaying(false); onRatioChange?.(0.5) }}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  mirrorOverlapRatio > 0.3 && mirrorOverlapRatio < 0.8 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                50% 接近
              </button>
              <button
                onClick={() => { setIsPlaying(false); onRatioChange?.(1) }}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  mirrorOverlapRatio === 1 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                100% 尝试重合
              </button>
            </div>
          </div>

          {/* 实时重叠测试结论 Banner */}
          {mirrorOverlapRatio >= 0.95 && (
            <div
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border shadow-xl backdrop-blur-md animate-bounce ${
                molecule.isChiral
                  ? 'bg-rose-950/90 text-rose-200 border-rose-500/80'
                  : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80'
              }`}
            >
              {molecule.isChiral ? (
                <span>❌ 手性分子验证结论：实物与镜像无法完全重合 (非叠合性)</span>
              ) : (
                <span>✅ 非手性分子验证结论：存在对称面，镜像旋转平移后完全重合</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
