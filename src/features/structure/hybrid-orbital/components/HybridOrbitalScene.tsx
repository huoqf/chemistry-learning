import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import { AtomMesh, BondMesh } from '@/components/Chemistry3D'
import { OrbitalLobeMesh } from './OrbitalLobeMesh'
import type { HybridModelData } from '../data/hybridData'
import { SCENE_COLORS, CHEMISTRY_COLORS } from '@/theme'

interface HybridOrbitalSceneProps {
  model: HybridModelData
  viewMode: number // 0: 仅杂化轨道, 1: 分子成键
  showUnhybridizedP: boolean
  showPhases: boolean
}

function SceneContent({
  model,
  viewMode,
  showUnhybridizedP,
  showPhases,
  selectedId,
  setSelectedId,
}: HybridOrbitalSceneProps & {
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}) {
  return (
    <group onPointerMissed={() => setSelectedId(null)}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} />
      <directionalLight position={[-5, -4, -5]} intensity={0.3} />

      {/* 1. 中心原子与杂化轨道/未杂化 p 轨道 */}
      {model.centers.map((center, cIdx) => {
        const centerId = `center-${cIdx}`
        const isSelected = selectedId === centerId

        return (
          <group key={centerId} position={center.pos}>
            {/* 中心原子球 */}
            <AtomMesh
              position={[0, 0, 0]}
              element={center.element}
              color={center.color}
              radius={0.34}
              isSelected={isSelected}
              onSelect={() => setSelectedId(isSelected ? null : centerId)}
            />

            {/* 杂化轨道与未杂化 p 轨道渲染 */}
            {center.hybridOrbitals.map((orb, oIdx) => {
              if (orb.type === 'unhybridizedP' && !showUnhybridizedP) {
                return null
              }

              return (
                <OrbitalLobeMesh
                  key={`orb-${cIdx}-${oIdx}`}
                  position={[0, 0, 0]}
                  direction={orb.dir}
                  type={orb.type}
                  showPhases={showPhases}
                />
              )
            })}
          </group>
        )
      })}

      {/* 2. 当在 viewMode === 1 (分子成键模式) 时，渲染配位原子与 σ 键 */}
      {viewMode === 1 && (
        <>
          {/* 配位原子与 σ 键 */}
          {model.ligands.map((lig, lIdx) => {
            const ligId = `ligand-${lIdx}`
            const isSelected = selectedId === ligId
            const centerPos = model.centers[0]?.pos || [0, 0, 0]

            return (
              <group key={ligId}>
                <BondMesh
                  start={centerPos}
                  end={lig.pos}
                  color={SCENE_COLORS.materials.metal}
                  radius={0.038}
                  startInset={0.34}
                  endInset={0.24}
                />
                <AtomMesh
                  position={lig.pos}
                  element={lig.element}
                  color={lig.color}
                  radius={0.25}
                  isSelected={isSelected}
                  onSelect={() => setSelectedId(isSelected ? null : ligId)}
                />
              </group>
            )
          })}

          {/* 如果多个 C 原子（如 C₂H₄, C₂H₂），画 C-C 键 */}
          {model.centers.length > 1 && (
            <BondMesh
              start={model.centers[0].pos}
              end={model.centers[1].pos}
              color={SCENE_COLORS.materials.metal}
              radius={0.045}
              startInset={0.34}
              endInset={0.34}
            />
          )}

          {/* π 键“肩并肩”搭接虚线 */}
          {model.piBonds &&
            model.piBonds.map((pi, pIdx) => {
              const startTop: [number, number, number] = [
                pi.startPos[0] + pi.dir[0],
                pi.startPos[1] + pi.dir[1],
                pi.startPos[2] + pi.dir[2],
              ]
              const endTop: [number, number, number] = [
                pi.endPos[0] + pi.dir[0],
                pi.endPos[1] + pi.dir[1],
                pi.endPos[2] + pi.dir[2],
              ]
              const startBot: [number, number, number] = [
                pi.startPos[0] - pi.dir[0],
                pi.startPos[1] - pi.dir[1],
                pi.startPos[2] - pi.dir[2],
              ]
              const endBot: [number, number, number] = [
                pi.endPos[0] - pi.dir[0],
                pi.endPos[1] - pi.dir[1],
                pi.endPos[2] - pi.dir[2],
              ]

              return (
                <group key={`pi-${pIdx}`}>
                  <Line
                    points={[startTop, endTop]}
                    color={CHEMISTRY_COLORS.reactionRate}
                    lineWidth={2.5}
                    dashed
                    dashScale={10}
                    dashSize={0.15}
                    gapSize={0.1}
                  />
                  <Line
                    points={[startBot, endBot]}
                    color={CHEMISTRY_COLORS.reactionRate}
                    lineWidth={2.5}
                    dashed
                    dashScale={10}
                    dashSize={0.15}
                    gapSize={0.1}
                  />
                </group>
              )
            })}
        </>
      )}

      {/* OrbitControls */}
      <OrbitControls enableDamping={false} makeDefault />
    </group>
  )
}

export function HybridOrbitalScene({
  model,
  viewMode,
  showUnhybridizedP,
  showPhases,
}: HybridOrbitalSceneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedInfo = selectedId?.startsWith('center-')
    ? {
        title: `${model.centers[0]?.element} 原子`,
        role: '杂化中心原子',
        detail: `采取 ${model.hybridType} 杂化，具有 ${model.centers[0]?.hybridOrbitals.length} 个轨道方向 (理想键角 ${model.bondAngle}°)。`,
        color: model.centers[0]?.color,
      }
    : selectedId?.startsWith('ligand-')
    ? {
        title: '配位原子',
        role: '成键配体',
        detail: '通过 s 或 p 轨道与中心原子的杂化轨道“头碰头”重叠形成 σ 键。',
        color: '#A855F7',
      }
    : null

  return (
    <div className="w-full h-full relative" style={{ touchAction: 'none' }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{
          position: [3.2, 2.5, 4.2],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        style={{ background: '#f8fafc' }}
      >
        <SceneContent
          model={model}
          viewMode={viewMode}
          showUnhybridizedP={showUnhybridizedP}
          showPhases={showPhases}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </Canvas>

      {/* 1. 右下角图例 (Legend Card) */}
      <div className="absolute bottom-3 right-3 z-10 p-3 rounded-xl bg-white/95 backdrop-blur border border-slate-200 shadow-md text-xs flex flex-col gap-2 pointer-events-auto">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center justify-between gap-2">
          <span>杂化轨道与成键图例</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
            {model.hybridType}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-slate-300/40 shadow-sm" />
          <span className="font-bold text-slate-800">{model.hybridType} 杂化大叶 (+相位)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-slate-300/40 shadow-sm" />
          <span className="font-bold text-slate-800">反向小叶 (-相位)</span>
        </div>
        {showUnhybridizedP && (
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-purple-500/70 border border-purple-300 shadow-sm" />
            <span className="font-bold text-slate-800">未杂化 p 轨道 (π 键源)</span>
          </div>
        )}
        {model.centers.some((c) => c.hybridOrbitals.some((o) => o.type === 'lonePair')) && (
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-300/80 border border-blue-400 shadow-sm" />
            <span className="font-bold text-slate-800">孤电子对云包</span>
          </div>
        )}
        {viewMode === 1 && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>σ 键 (头碰头重叠)</span>
            {model.piBonds && model.piBonds.length > 0 && (
              <span className="ml-1 text-pink-600 font-semibold">| π 键 (肩并肩)</span>
            )}
          </div>
        )}
      </div>

      {/* 2. 选中明细 (左下角) */}
      {selectedInfo && (
        <div className="absolute bottom-3 left-3 z-10 p-3 rounded-xl bg-white/95 backdrop-blur border border-blue-200 shadow-lg text-xs text-slate-800 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="w-4 h-4 rounded-full shadow-sm shrink-0"
              style={{ backgroundColor: selectedInfo.color }}
            />
            <div>
              <div className="font-bold flex items-center gap-2">
                <span>{selectedInfo.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                  {selectedInfo.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{selectedInfo.detail}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedId(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition-colors shrink-0"
          >
            关闭明细
          </button>
        </div>
      )}
    </div>
  )
}
