import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import { AtomMesh, BondMesh } from '@/components/Chemistry3D'
import { LonePairMesh } from './LonePairMesh'
import type { VseprMolecule } from '../data/vseprData'
import { SCENE_COLORS, CANVAS_COLORS, CHEMISTRY_COLORS } from '@/theme'

interface VseprSceneProps {
  molecule: VseprMolecule
  showLonePairs: boolean
  showPolyhedron: boolean
  showAngles: boolean
}

function SceneContent({
  molecule,
  showLonePairs,
  showPolyhedron,
  showAngles,
  selectedNode,
  setSelectedNode,
}: VseprSceneProps & {
  selectedNode: string | null
  setSelectedNode: (id: string | null) => void
}) {
  return (
    <group onPointerMissed={() => setSelectedNode(null)}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} />
      <directionalLight position={[-5, -4, -5]} intensity={0.3} />

      {/* 1. 中心原子 */}
      <AtomMesh
        position={[0, 0, 0]}
        element={molecule.centralElement}
        color={molecule.centralColor}
        radius={0.36}
        isSelected={selectedNode === 'central'}
        onSelect={() => setSelectedNode(selectedNode === 'central' ? null : 'central')}
      />

      {/* 2. 配位原子与化学键 */}
      {molecule.ligands.map((lig, idx) => {
        const nodeId = `ligand-${idx}`
        const isSelected = selectedNode === nodeId

        return (
          <group key={`ligand-${idx}`}>
            <BondMesh
              start={[0, 0, 0]}
              end={lig.pos}
              color={SCENE_COLORS.materials.metal}
              radius={0.038}
              startInset={0.34}
              endInset={0.24}
            />
            <AtomMesh
              position={lig.pos}
              element={molecule.ligandElement}
              color={molecule.ligandColor}
              radius={0.24}
              isSelected={isSelected}
              onSelect={() => setSelectedNode(isSelected ? null : nodeId)}
            />
          </group>
        )
      })}

      {/* 3. 孤电子对半透明云泡 */}
      {showLonePairs &&
        molecule.lonePairs.length > 0 &&
        molecule.lonePairs.map((lp, idx) => (
          <LonePairMesh
            key={`lonepair-${idx}`}
            position={lp.pos}
            label={lp.label}
          />
        ))}

      {/* 4. 理想电子对几何框架多面体虚线 */}
      {showPolyhedron &&
        molecule.polyEdges.map((edge, idx) => (
          <Line
            key={`poly-edge-${idx}`}
            points={[edge[0], edge[1]]}
            color={CANVAS_COLORS.axis}
            lineWidth={1.5}
            dashed
            dashScale={12}
            dashSize={0.12}
            gapSize={0.08}
          />
        ))}

      {/* 5. 键角标注线段 */}
      {showAngles &&
        molecule.bondAngles.map((angle, idx) => (
          <Line
            key={`angle-${idx}`}
            points={[angle.p1, [0, 0, 0], angle.p2]}
            color={CHEMISTRY_COLORS.equilibrium}
            lineWidth={2}
          />
        ))}

      {/* OrbitControls */}
      <OrbitControls enableDamping={false} makeDefault />
    </group>
  )
}

export function VseprScene({
  molecule,
  showLonePairs,
  showPolyhedron,
  showAngles,
}: VseprSceneProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // 区分单键配体 (H, F, Cl) 与双键/重键配体 (O, S) 的化学精准描述
  const isMultipleBondLigand = molecule.ligandValence === 2 // O/S 结合电子数记 2 (形成重键)

  const selectedInfo = selectedNode === 'central'
    ? {
        title: `${molecule.centralElement} 原子`,
        role: '中心原子',
        detail: `最外层价电子数 a = ${molecule.centralValence}，与 ${molecule.ligandCount} 个 ${molecule.ligandElement} 原子结合 (含 ${molecule.lonePairCount} 对孤电子对)`,
        color: molecule.centralColor,
      }
    : selectedNode?.startsWith('ligand-')
    ? {
        title: `${molecule.ligandElement} 原子`,
        role: '配位原子',
        detail: isMultipleBondLigand
          ? `与中心 ${molecule.centralElement} 原子形成重键 (VSEPR 理论中算作 1 个电子对方向)`
          : `与中心 ${molecule.centralElement} 原子形成 1 个 σ 键`,
        color: molecule.ligandColor,
      }
    : null

  return (
    <div className="w-full h-full relative" style={{ touchAction: 'none' }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{
          position: [2.5, 2.0, 3.8],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        style={{ background: '#f8fafc' }}
      >
        <SceneContent
          molecule={molecule}
          showLonePairs={showLonePairs}
          showPolyhedron={showPolyhedron}
          showAngles={showAngles}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
        />
      </Canvas>

      {/* 1. 主屏右下角图例 (Legend Card) */}
      <div className="absolute bottom-3 right-3 z-10 p-3 rounded-xl bg-white/95 backdrop-blur border border-slate-200 shadow-md text-xs flex flex-col gap-2 pointer-events-auto">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
          分子图例
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0 border border-slate-300/40"
            style={{ backgroundColor: molecule.centralColor }}
          />
          <span className="font-bold text-slate-800">{molecule.centralElement}</span>
          <span className="text-[11px] text-slate-500">(中心原子)</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0 border border-slate-300/40"
            style={{ backgroundColor: molecule.ligandColor }}
          />
          <span className="font-bold text-slate-800">{molecule.ligandElement}</span>
          <span className="text-[11px] text-slate-500">(配位原子)</span>
        </div>

        {showLonePairs && molecule.lonePairs.length > 0 && (
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0 border border-blue-300 bg-sky-200/60"
            />
            <span className="font-bold text-slate-800">: 孤电子对</span>
          </div>
        )}
      </div>

      {/* 2. 选中原子明细与关闭按钮 (左下角) */}
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
            onClick={() => setSelectedNode(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition-colors shrink-0"
          >
            关闭明细
          </button>
        </div>
      )}
    </div>
  )
}
