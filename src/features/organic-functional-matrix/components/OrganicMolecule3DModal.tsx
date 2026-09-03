import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { AtomMesh, BondMesh } from '@/components/Chemistry3D'
import { isWebGLAvailable } from '@/components/Chemistry3D/utils/webgl'
import {
  ORGANIC_3D_MOLECULES,
  type Organic3DMolecule,
  type Atom3DData,
} from '../data/organic3dData'
import {
  X,
  RotateCw,
  Sparkles,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Layers,
  ArrowRightLeft,
} from 'lucide-react'

// 柔和光照
const AMBIENT_INTENSITY = 0.95
const DIRECTIONAL_INTENSITY = 0.85

interface OrganicMolecule3DModalProps {
  molecule: Organic3DMolecule | null
  onClose: () => void
}

function WebGLFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center rounded-xl border border-slate-200">
      <span className="text-4xl mb-3">🔬</span>
      <h4 className="text-sm font-bold text-slate-800 mb-1">3D 硬件加速未就绪</h4>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
        当前浏览器环境未启用 WebGL 硬件加速，建议使用现代 Chrome/Edge 浏览器获得最佳 3D 交互体验。
      </p>
    </div>
  )
}

export const OrganicMolecule3DModal: React.FC<OrganicMolecule3DModalProps> = ({
  molecule,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeMoleculeId, setActiveMoleculeId] = useState<string | null>(molecule?.id || null)
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const [selectedAtom, setSelectedAtom] = useState<Atom3DData | null>(null)

  // 当传入的 molecule 改变时，同步重置当前查看的分子与选中原子
  useEffect(() => {
    if (molecule) {
      setActiveMoleculeId(molecule.id)
      setSelectedAtom(null)
    } else {
      setActiveMoleculeId(null)
      setSelectedAtom(null)
      setContainerSize({ width: 0, height: 0 })
    }
  }, [molecule])

  const activeMolecule = useMemo(() => {
    if (!activeMoleculeId) return molecule
    return ORGANIC_3D_MOLECULES[activeMoleculeId] || molecule
  }, [activeMoleculeId, molecule])

  const hasMolecule = Boolean(molecule)

  // 监听容器大小以防 Three.js 0 尺寸报错，挂载时立即获取尺寸
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      setContainerSize({ width: Math.round(rect.width), height: Math.round(rect.height) })
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setContainerSize({ width: Math.round(width), height: Math.round(height) })
        }
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [activeMolecule?.id, hasMolecule])

  // 键盘 Esc 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // 统计当前分子中出现的元素图例
  const legendElements = useMemo(() => {
    if (!activeMolecule) return []
    const seen = new Set<string>()
    const result: Array<{ symbol: string; name: string; color: string }> = []
    for (const atom of activeMolecule.atoms) {
      if (seen.has(atom.symbol)) continue
      seen.add(atom.symbol)
      result.push({
        symbol: atom.symbol,
        name: atom.symbol === 'C' ? '碳 (C)' : atom.symbol === 'H' ? '氢 (H)' : atom.symbol === 'O' ? '氧 (O)' : atom.symbol === 'N' ? '氮 (N)' : atom.symbol === 'Br' ? '溴 (Br)' : atom.elementName,
        color: atom.color,
      })
    }
    return result
  }, [activeMolecule])

  if (!molecule || !activeMolecule) return null

  const isReady = containerSize.width > 0 && containerSize.height > 0
  const isWebGL = isWebGLAvailable()
  const availableVariants = molecule.variants || activeMolecule.variants

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] max-h-[820px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 顶栏：分子标题、分类与快捷关闭 */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {activeMolecule.name} 3D 空间球棍模型
                </h3>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeMolecule.formula}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                  {activeMolecule.categoryName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                鼠标左键 360° 拖拽旋转 • 滚轮缩放 • 点击任意原子查看成键与杂化特征
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="关闭返回大表 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1.5 变体/易混构型对比切换横条 (特别针对结构式相近但 3D 实质不同的分子) */}
        {availableVariants && availableVariants.length > 1 && (
          <div className="px-5 py-2 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between gap-3 shrink-0 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950 shrink-0">
              <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span>立体异构 / 易混构型对比切换：</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {availableVariants.map((v) => {
                const isActive = activeMolecule.id === v.targetMoleculeId
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveMoleculeId(v.targetMoleculeId)
                      setSelectedAtom(null)
                    }}
                    className={`px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                    title={v.differenceHint}
                  >
                    <Layers className="w-3 h-3 opacity-70" />
                    <span>{v.label}</span>
                    <span className={`text-[10px] font-mono ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                      ({v.formula})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 2. 核心 3D 画布区域 */}
        <div className="flex-1 relative bg-gradient-to-b from-slate-100/50 via-slate-50 to-white overflow-hidden flex flex-col min-h-[260px]">
          {/* 画布主视窗 */}
          <div ref={containerRef} className="w-full flex-1 relative">
            {!isWebGL ? (
              <WebGLFallback />
            ) : isReady ? (
              <Canvas
                key={activeMolecule.id}
                camera={{ position: [0, 0, 6.5], fov: 42 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ambientLight intensity={AMBIENT_INTENSITY} />
                <directionalLight position={[5, 8, 5]} intensity={DIRECTIONAL_INTENSITY} />
                <directionalLight position={[-5, -4, -3]} intensity={0.4} />

                {/* 3D 化学键 */}
                {activeMolecule.bonds.map((bond) => (
                  <BondMesh
                    key={bond.id}
                    start={bond.start}
                    end={bond.end}
                    color={bond.color}
                    radius={bond.order === 3 ? 0.05 : bond.order === 2 ? 0.055 : 0.065}
                  />
                ))}

                {/* 3D 原子 */}
                {activeMolecule.atoms.map((atom) => {
                  const isHovered = selectedAtom?.id === atom.id
                  return (
                    <AtomMesh
                      key={atom.id}
                      element={atom.symbol}
                      position={atom.position}
                      color={atom.color}
                      radius={atom.radius * (isHovered ? 1.18 : 1.0)}
                      isSelected={isHovered}
                      onSelect={() => setSelectedAtom(atom)}
                    />
                  )
                })}

                <OrbitControls
                  enableRotate={true}
                  enableZoom={true}
                  enablePan={true}
                  minDistance={2.5}
                  maxDistance={12}
                />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                正在初始化 3D 空间球棍模型...
              </div>
            )}

            {/* 左上角交互指引提示徽章 */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-2xs backdrop-blur-xs flex items-center gap-1.5">
                <RotateCw className="w-3 h-3 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
                3D 空间交互就绪
              </span>
            </div>

            {/* 左下角原子颜色图例 */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-xs space-y-1.5 text-xs">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                原子颜色图例
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {legendElements.map((item) => (
                  <div key={item.symbol} className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-400/40 shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-700 text-[11px]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 选中原子的即时信息悬浮卡片 */}
            {selectedAtom && (
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-indigo-200 shadow-md text-xs space-y-1 animate-in fade-in duration-150 max-w-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1 text-indigo-700">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-400"
                      style={{ backgroundColor: selectedAtom.color }}
                    />
                    {selectedAtom.elementName} ({selectedAtom.symbol})
                  </span>
                  <button
                    onClick={() => setSelectedAtom(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                  >
                    ×
                  </button>
                </div>
                <div className="text-slate-600 text-[11.5px] space-y-0.5 pt-0.5">
                  {selectedAtom.hybridization && (
                    <div>杂化类型：<strong className="text-slate-900">{selectedAtom.hybridization}</strong></div>
                  )}
                  {selectedAtom.isChiral && (
                    <div className="text-amber-600 font-extrabold flex items-center gap-1">
                      <span>⭐ 高考核心【手性碳原子 *C】（连接 4 个不同基团）</span>
                    </div>
                  )}
                  {selectedAtom.isFunctionalGroup && (
                    <div className="text-rose-600 font-semibold">• 核心活性官能团反应位点</div>
                  )}
                  <div>空间坐标：[{selectedAtom.position.map((v) => v.toFixed(2)).join(', ')}]</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. 底栏：空间构型/断键位点解析与【相近表达式实质辨析】 */}
        <div className="p-3.5 bg-white border-t border-slate-200 space-y-2.5 shrink-0 overflow-y-auto max-h-[250px]">
          {/* 重点：相近表达式 vs 3D 实质差异警示横幅 */}
          {activeMolecule.spatialContrastNote && (
            <div className="p-2.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2 shadow-2xs">
              <span className="text-base shrink-0 mt-0.5">💡</span>
              <div className="space-y-0.5">
                <strong className="font-extrabold text-amber-900">结构式相近 vs 3D 空间球棍实质差异：</strong>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {activeMolecule.spatialContrastNote}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {/* 构型特征 */}
            <div className="p-2 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
              <div className="font-bold text-indigo-950 flex items-center gap-1">
                <span>📐 杂化与共面特征</span>
              </div>
              <div className="text-slate-700 leading-relaxed font-medium">
                {activeMolecule.geometryFeatures.hybridization}；{activeMolecule.geometryFeatures.coplanarInfo}
                {activeMolecule.geometryFeatures.collinearInfo && `（${activeMolecule.geometryFeatures.collinearInfo}）`}
              </div>
            </div>

            {/* 反应位点 */}
            <div className="p-2 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
              <div className="font-bold text-rose-950 flex items-center gap-1">
                <span>⚡ 活性断键位点</span>
              </div>
              <div className="text-slate-700 leading-relaxed font-medium">
                {activeMolecule.geometryFeatures.reactionSite}
              </div>
            </div>

            {/* 核心考点 */}
            <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <div className="font-bold text-emerald-950 flex items-center gap-1">
                <span>🎯 高考秒杀要点</span>
              </div>
              <div className="text-slate-700 leading-relaxed font-medium">
                {activeMolecule.keyPoints[0]}
              </div>
            </div>
          </div>

          {/* 底部按钮栏：留在本大表 vs 可选前往教材知识点 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
            <div className="text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>关闭当前 3D 浮层即可继续浏览全景大表，您的筛选条件与浏览进度均完整保留。</span>
            </div>

            <div className="flex items-center gap-2">
              {activeMolecule.relatedKnowledgeNode && (
                <a
                  href={`#${activeMolecule.relatedKnowledgeNode.routeHash}`}
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="离开大表，跳转至教材知识点页面深入探究"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>深入探究教材：{activeMolecule.relatedKnowledgeNode.name}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              )}

              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer shadow-xs"
              >
                返回全景大表
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
