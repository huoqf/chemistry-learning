import { useState, useMemo, useRef, useEffect } from 'react'
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
import type { CrystalTypeData, AtomSpec, DisplayMode, ModelStyle, AtomLocationType } from '../types'

interface Crystal3DSceneProps {
  crystalData: CrystalTypeData
  displayMode: DisplayMode
  modelStyle?: ModelStyle
  highlightElement?: string | null
  edgeLengthPm: number
  onSelectLocationType?: (loc: AtomLocationType | null) => void
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

function formatFrac(n: number): string {
  if (Math.abs(n - 0) < 1e-4) return '0'
  if (Math.abs(n - 1) < 1e-4) return '1'
  if (Math.abs(n - 0.5) < 1e-4) return '1/2'
  if (Math.abs(n - 0.25) < 1e-4) return '1/4'
  if (Math.abs(n - 0.75) < 1e-4) return '3/4'
  if (Math.abs(n - 1 / 3) < 1e-4) return '1/3'
  if (Math.abs(n - 2 / 3) < 1e-4) return '2/3'
  return n.toFixed(2).replace(/\.?0+$/, '')
}

export function Crystal3DScene({
  crystalData,
  displayMode,
  modelStyle = 'ball-stick',
  highlightElement,
  edgeLengthPm,
  onSelectLocationType,
  className = '',
}: Crystal3DSceneProps) {
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [viewMode, setViewMode] = useState<'3d' | 'top'>('3d')

  const selectedAtom = useMemo(() => {
    if (!selectedAtomId) return null
    return crystalData.atoms.find((a) => a.id === selectedAtomId) || null
  }, [selectedAtomId, crystalData])

  const handleSelectAtom = (id: string | null) => {
    setSelectedAtomId(id)
    if (!id) {
      onSelectLocationType?.(null)
    } else {
      const atom = crystalData.atoms.find((a) => a.id === id)
      onSelectLocationType?.(atom?.locationType ?? null)
    }
  }

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
          modelStyle={modelStyle}
          viewMode={viewMode}
          highlightElement={highlightElement}
          selectedAtomId={selectedAtomId}
          onSelectAtom={handleSelectAtom}
          onHoverChange={setIsHovered}
        />
      </Canvas>

      {/* 左上角高考投影视角切换器 */}
      <div className="absolute top-3 left-3 z-10 flex items-center bg-white/95 backdrop-blur border border-slate-200 rounded-lg p-0.5 shadow-sm text-xs font-medium">
        <button
          onClick={() => setViewMode('3d')}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            viewMode === '3d'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          🧊 3D 透视
        </button>
        <button
          onClick={() => setViewMode('top')}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            viewMode === 'top'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="高考常见解题视角：沿 c 轴向底面正交投影"
        >
          👁️ 沿 c 轴正交投影
        </button>
      </div>

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
            <div className="text-slate-700 font-mono text-[11px] mt-0.5">
              分数坐标: ({selectedAtom.fracPos.map(formatFrac).join(', ')})
            </div>
            <div className="text-blue-600 font-semibold mt-0.5">
              均摊贡献: {
                Math.abs(selectedAtom.sharingRatio - 1 / 8) < 0.001 ? '1/8 个 (0.125)' :
                Math.abs(selectedAtom.sharingRatio - 1 / 4) < 0.001 ? '1/4 个 (0.25)' :
                Math.abs(selectedAtom.sharingRatio - 1 / 2) < 0.001 ? '1/2 个 (0.5)' :
                Math.abs(selectedAtom.sharingRatio - 1 / 12) < 0.001 ? '1/12 个 (约 0.083)' :
                Math.abs(selectedAtom.sharingRatio - 1 / 6) < 0.001 ? '1/6 个 (约 0.167)' :
                '1 个 (晶胞独占)'
              }
            </div>
          </div>
          <button
            onClick={() => handleSelectAtom(null)}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 text-[11px] font-medium transition-colors"
          >
            取消
          </button>
        </div>
      )}

      {/* 底部 3D 操作提示 */}
      <div className="absolute bottom-3 left-3 pointer-events-none px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur border border-slate-200 text-[11px] text-slate-600 shadow-sm flex items-center gap-2">
        <span>💡 拖拽旋转 | 滚轮缩放 | 点击原子右侧联动高亮均摊表格</span>
      </div>
    </div>
  )
}

function SceneContent({
  crystalData,
  displayMode,
  modelStyle = 'ball-stick',
  viewMode,
  highlightElement,
  selectedAtomId,
  onSelectAtom,
  onHoverChange,
}: {
  crystalData: CrystalTypeData
  displayMode: DisplayMode
  modelStyle?: ModelStyle
  viewMode: '3d' | 'top'
  highlightElement?: string | null
  selectedAtomId: string | null
  onSelectAtom: (id: string | null) => void
  onHoverChange: (isHovered: boolean) => void
}) {
  const cellParams = crystalData.cellParams
  const isExploded = displayMode === 'exploded'
  const explodeFactor = isExploded ? 0.38 : 0
  const isSpaceFilling = modelStyle === 'space-filling'

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

  // 2. 几何相切或晶格对角线辅助线 (各晶胞专属配置驱动)
  const diagonalLines = useMemo(() => {
    if (displayMode !== 'geometry') return null

    if (crystalData.tangentLines && crystalData.tangentLines.length > 0) {
      return (
        <group>
          {crystalData.tangentLines.map((line, idx) => {
            const pFrom = fracToWorld(line.startFrac, cellParams)
            const pTo = fracToWorld(line.endFrac, cellParams)
            return (
              <Line
                key={`tangent-line-${idx}`}
                points={[pFrom, pTo]}
                color={line.color || CANVAS_COLORS.diagonalFace}
                lineWidth={2.5}
                dashed
                dashSize={0.08}
                gapSize={0.04}
              />
            )
          })}
        </group>
      )
    }

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
  }, [displayMode, cellParams, crystalData.tangentLines])

  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      if (viewMode === 'top') {
        controlsRef.current.object.position.set(0, 0, 8)
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      } else {
        controlsRef.current.object.position.set(3.2, 2.6, 3.2)
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    }
  }, [viewMode])

  return (
    <>
      {/* 3D 灯光设置 */}
      <ambientLight intensity={0.75} />
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

      {/* 晶格与配位键连线（密堆积模式下隐藏以避免穿模） */}
      {!isExploded && !isSpaceFilling &&
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

        // 真实几何相切半径计算
        const baseRadius = (isSpaceFilling || displayMode === 'geometry')
          ? (crystalData.tangentRadii?.[atom.element] ?? atom.tangentRadius ?? atom.radius * 1.6)
          : atom.radius

        const finalRadius = isCuttingMode
          ? baseRadius * (0.6 + atom.sharingRatio * 0.4)
          : baseRadius

        const displayColor = isFiltered
          ? atom.color
          : SCENE_COLORS.materials.metal

        return (
          <AtomMesh
            key={atom.id}
            position={pos}
            element={atom.element}
            color={displayColor}
            radius={finalRadius}
            isSelected={isSelected}
            onSelect={() => onSelectAtom(isSelected ? null : atom.id)}
            onHoverChange={onHoverChange}
          />
        )
      })}

      {/* OrbitControls 手势旋转 (关闭 damping) */}
      <OrbitControls ref={controlsRef} enableDamping={false} makeDefault />
    </>
  )
}
