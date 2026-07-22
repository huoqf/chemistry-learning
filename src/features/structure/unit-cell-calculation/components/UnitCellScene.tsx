import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import {
  UnitCellMesh,
  AtomMesh,
  BondMesh,
  fracToWorld,
  isWebGLAvailable,
} from '@/components/Chemistry3D'
import { CANVAS_COLORS, CHEMISTRY_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec } from '../data/unitCellData'

interface UnitCellSceneProps {
  crystalData: CrystalTypeData
  isExploded?: boolean
  showBonds?: boolean
  edgeLengthPm?: number
  className?: string
}

function WebGLFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-8 text-center border border-slate-200 rounded-xl">
      <div className="text-5xl mb-4">🔬</div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">WebGL 不可用</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        当前环境无法渲染 3D 晶胞场景。请启用 WebGL 硬件加速后重新加载。
      </p>
    </div>
  )
}

export function UnitCellScene({
  crystalData,
  isExploded = false,
  showBonds = true,
  edgeLengthPm = 564,
  className = '',
}: UnitCellSceneProps) {
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  if (!isWebGLAvailable()) {
    return <WebGLFallback />
  }

  // 查出被选中原子的详细信息
  const selectedAtom = useMemo(() => {
    if (!selectedAtomId) return null
    return crystalData.atoms.find((a) => a.id === selectedAtomId) || null
  }, [selectedAtomId, crystalData])

  return (
    <div
      className={`w-full h-full relative overflow-hidden rounded-xl border border-slate-200/80 shadow-inner ${className}`}
      style={{
        touchAction: 'none',
        cursor: isHovered ? 'pointer' : 'grab',
      }}
    >
      <Canvas
        orthographic
        frameloop="always"
        dpr={[1, 2]}
        camera={{
          zoom: 145,
          position: [3.2, 2.6, 3.2],
          near: -100,
          far: 100,
        }}
        style={{ background: CANVAS_COLORS.objectFillNeutral }}
      >
        <SceneContent
          crystalData={crystalData}
          isExploded={isExploded}
          showBonds={showBonds}
          selectedAtomId={selectedAtomId}
          onSelectAtom={setSelectedAtomId}
          onHoverChange={setIsHovered}
        />
      </Canvas>

      {/* 2D 固定尺寸参数面板 (右上角) */}
      <div className="absolute top-3 right-3 pointer-events-none px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur border border-slate-200 shadow-sm flex items-center gap-2 font-mono text-xs font-semibold text-slate-700">
        <div>
          <span style={{ color: CHEMISTRY_COLORS.concentration }}>a</span> = {edgeLengthPm} pm
        </div>
        {crystalData.id === 'hcp-mg' && (
          <div>
            <span style={{ color: CHEMISTRY_COLORS.temperature }}>c</span> = {Math.round(Math.sqrt(8 / 3) * edgeLengthPm)} pm
          </div>
        )}
      </div>

      {/* 2D 固定原子选中均摊明细面板 (左下角，选中的时候显示) */}
      {selectedAtom && (
        <div className="absolute bottom-12 left-3 z-10 p-3 rounded-xl bg-white/95 backdrop-blur border border-blue-200 shadow-md text-xs text-slate-800 flex items-center gap-3">
          <div>
            <div className="font-bold flex items-center gap-1.5">
              <span>{selectedAtom.element}</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 font-normal">
                {selectedAtom.locationType}
              </span>
            </div>
            <div className="text-blue-600 font-semibold mt-0.5">{selectedAtom.label}</div>
          </div>
          <button
            onClick={() => setSelectedAtomId(null)}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 text-[11px] font-medium transition-colors"
          >
            取消高亮
          </button>
        </div>
      )}

      {/* 底部 3D 操作提示 */}
      <div className="absolute bottom-3 left-3 pointer-events-none px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur border border-slate-200 text-[11px] text-slate-600 shadow-sm flex items-center gap-2">
        <span>💡 拖拽视角旋转 | 滚轮缩放 | 点击原子查看均摊份额</span>
      </div>
    </div>
  )
}

function SceneContent({
  crystalData,
  isExploded,
  showBonds,
  selectedAtomId,
  onSelectAtom,
  onHoverChange,
}: {
  crystalData: CrystalTypeData
  isExploded: boolean
  showBonds: boolean
  selectedAtomId: string | null
  onSelectAtom: (id: string | null) => void
  onHoverChange: (isHovered: boolean) => void
}) {
  const cellParams = crystalData.cellParams
  const explodeFactor = isExploded ? 0.38 : 0

  // 计算每个原子的实际 3D 位置（包含爆炸拆解外扩）
  const atomPositions = useMemo(() => {
    return crystalData.atoms.map((atom: AtomSpec) => {
      const worldPos = fracToWorld(atom.fracPos, cellParams)
      if (explodeFactor === 0) return { atom, pos: worldPos }

      // 爆炸方向向量 = (fracPos - [0.5, 0.5, 0.5])
      const dirX = atom.fracPos[0] - 0.5
      const dirY = atom.fracPos[1] - 0.5
      const dirZ = atom.fracPos[2] - 0.5

      const offsetPos: [number, number, number] = [
        worldPos[0] + dirX * explodeFactor,
        worldPos[1] + dirY * explodeFactor,
        worldPos[2] + dirZ * explodeFactor,
      ]
      return { atom, pos: offsetPos }
    })
  }, [crystalData, cellParams, explodeFactor])

  return (
    <>
      {/* 3D 照相与环境光 */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 9, 6]} intensity={1.2} castShadow />
      <directionalLight position={[-6, -4, -6]} intensity={0.35} />

      {/* 晶胞 3D 高对比度坚固线框 */}
      <UnitCellMesh
        cellParams={cellParams}
        color={CANVAS_COLORS.strokeDark}
        lineWidth={2.4}
      />

      {/* 晶格/化学键连线 */}
      {showBonds &&
        !isExploded &&
        crystalData.bonds.map((bond, i) => {
          const fromPos = atomPositions[bond.fromIndex]?.pos
          const toPos = atomPositions[bond.toIndex]?.pos
          if (!fromPos || !toPos) return null

          const fromAtom = crystalData.atoms[bond.fromIndex]
          const toAtom = crystalData.atoms[bond.toIndex]

          return (
            <BondMesh
              key={`bond-${i}`}
              start={fromPos}
              end={toPos}
              color={bond.color || CANVAS_COLORS.trackHistory}
              startInset={fromAtom?.radius ?? 0.18}
              endInset={toAtom?.radius ?? 0.18}
            />
          )
        })}

      {/* 原子球体渲染 */}
      {atomPositions.map(({ atom, pos }) => {
        const isSelected = selectedAtomId === atom.id
        return (
          <AtomMesh
            key={atom.id}
            position={pos}
            element={atom.element}
            color={atom.color}
            radius={atom.radius}
            isSelected={isSelected}
            onSelect={() => onSelectAtom(isSelected ? null : atom.id)}
            onHoverChange={onHoverChange}
          />
        );
      })}

      {/* OrbitControls 丝滑手势控制 */}
      <OrbitControls enableDamping={true} dampingFactor={0.05} makeDefault />
    </>
  )
}
