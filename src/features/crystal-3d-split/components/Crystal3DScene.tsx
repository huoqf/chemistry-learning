import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import {
  UnitCellMesh,
  AtomMesh,
  BondMesh,
  fracToWorld,
  isWebGLAvailable,
} from '@/components/Chemistry3D'
import { CANVAS_COLORS, CHEMISTRY_COLORS, SCENE_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, DisplayMode } from '../types'

interface Crystal3DSceneProps {
  crystalData: CrystalTypeData
  displayMode: DisplayMode
  highlightElement?: string | null
  edgeLengthPm: number
  className?: string
}

function WebGLFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 border border-slate-200 rounded-xl">
      <div className="text-5xl mb-4">🔬</div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">WebGL 暂不可用</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        当前浏览器环境未开启 WebGL 硬件加速，无法渲染 3D 晶胞场景。请检查浏览器设置。
      </p>
    </div>
  )
}

export function Crystal3DScene({
  crystalData,
  displayMode,
  highlightElement,
  edgeLengthPm,
  className = '',
}: Crystal3DSceneProps) {
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const selectedAtom = useMemo(() => {
    if (!selectedAtomId) return null
    return crystalData.atoms.find((a) => a.id === selectedAtomId) || null
  }, [selectedAtomId, crystalData])

  if (!isWebGLAvailable()) {
    return <WebGLFallback />
  }

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
        frameloop="demand"
        dpr={[1, 2]}
        camera={{
          zoom: 140,
          position: [3.2, 2.6, 3.2],
          near: -100,
          far: 100,
        }}
        style={{ background: CANVAS_COLORS.objectFillNeutral }}
      >
        <SceneContent
          crystalData={crystalData}
          displayMode={displayMode}
          highlightElement={highlightElement}
          selectedAtomId={selectedAtomId}
          onSelectAtom={setSelectedAtomId}
          onHoverChange={setIsHovered}
        />
      </Canvas>

      {/* 右上角 2D 晶胞边长与参数水滴标注 */}
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

      {/* 左下角选中原子均摊算式浮窗 */}
      {selectedAtom && (
        <div className="absolute bottom-12 left-3 z-10 p-3 rounded-xl bg-white/95 backdrop-blur border border-blue-200 shadow-md text-xs text-slate-800 flex items-center gap-3">
          <div>
            <div className="font-bold flex items-center gap-1.5">
              <span>{selectedAtom.element}</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 font-normal">
                {selectedAtom.sharingLabel}
              </span>
            </div>
            <div className="text-blue-600 font-semibold mt-0.5">
              均摊贡献: {selectedAtom.sharingRatio} 个原子
            </div>
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
  displayMode,
  highlightElement,
  selectedAtomId,
  onSelectAtom,
  onHoverChange,
}: {
  crystalData: CrystalTypeData
  displayMode: DisplayMode
  highlightElement?: string | null
  selectedAtomId: string | null
  onSelectAtom: (id: string | null) => void
  onHoverChange: (isHovered: boolean) => void
}) {
  const cellParams = crystalData.cellParams
  const isExploded = displayMode === 'exploded'
  const explodeFactor = isExploded ? 0.38 : 0

  // 1. 计算每个原子的 3D 空间位置 (包含爆炸外扩)
  const atomPositions = useMemo(() => {
    return crystalData.atoms.map((atom: AtomSpec) => {
      const worldPos = fracToWorld(atom.fracPos, cellParams)
      if (explodeFactor === 0) return { atom, pos: worldPos }

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

  // 2. 几何相切或晶格对角线辅助线 (geometry 模式)
  const diagonalLines = useMemo(() => {
    if (displayMode !== 'geometry') return null

    const p000 = fracToWorld([0, 0, 0], cellParams)
    const p111 = fracToWorld([1, 1, 1], cellParams)
    const p110 = fracToWorld([1, 1, 0], cellParams)

    return (
      <group>
        {/* 体对角线 (长划线) */}
        <Line
          points={[p000, p111]}
          color={CANVAS_COLORS.diagonalBody}
          lineWidth={2.5}
          dashed
          dashSize={0.08}
          gapSize={0.04}
        />
        {/* 面对角线 (长划线) */}
        <Line
          points={[p000, p110]}
          color={CANVAS_COLORS.diagonalFace}
          lineWidth={2}
          dashed
          dashSize={0.08}
          gapSize={0.04}
        />
      </group>
    )
  }, [displayMode, cellParams])

  return (
    <>
      {/* 3D 灯光设置 */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 9, 6]} intensity={1.2} castShadow />
      <directionalLight position={[-6, -4, -6]} intensity={0.35} />

      {/* 晶胞框架线 */}
      <UnitCellMesh
        cellParams={cellParams}
        color={CANVAS_COLORS.strokeDark}
        lineWidth={2.5}
      />

      {/* 相切对角线 */}
      {diagonalLines}

      {/* 晶格与配位键连线 */}
      {!isExploded &&
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

      {/* 原子球体 */}
      {atomPositions.map(({ atom, pos }) => {
        const isSelected = selectedAtomId === atom.id
        const isFiltered = highlightElement ? atom.element === highlightElement : true
        const isCuttingMode = displayMode === 'cutting'

        // 切割模式下按均摊比例透明度渲染
        const displayColor = isFiltered
          ? atom.color
          : SCENE_COLORS.materials.metal

        return (
          <AtomMesh
            key={atom.id}
            position={pos}
            element={atom.element}
            color={displayColor}
            radius={isCuttingMode ? atom.radius * (0.6 + atom.sharingRatio * 0.4) : atom.radius}
            isSelected={isSelected}
            onSelect={() => onSelectAtom(isSelected ? null : atom.id)}
            onHoverChange={onHoverChange}
          />
        )
      })}

      {/* OrbitControls 手势旋转 (关闭 damping) */}
      <OrbitControls enableDamping={false} makeDefault />
    </>
  )
}
