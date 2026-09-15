import React, { useState } from 'react'
import type { IonItem, CoexistenceConflict, ReagentOption, InquiryMode } from '../types'
import {
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Flame,
  Zap,
  Beaker,
  ChevronDown,
  ChevronRight,
  Droplet,
} from 'lucide-react'
import { KatexFormula } from '@/components/UI'
import { findMechanismItem, MECHANISM_GROUPS } from '../data/mechanismGridData'
import { getIonPairCell, CONFLICT_CATEGORY_CONFIG } from '../data/coexistenceMatrixData'
import { IonChemEquation } from './IonChemEquation'

interface IonRightPanelProps {
  inquiryMode: InquiryMode
  selectedIon?: IonItem
  selectedReagent?: ReagentOption
  dropCount: number
  conflicts: CoexistenceConflict[]
  coexistenceIons: IonItem[]
  selectedPair?: { cationId: string; anionId: string } | null
  onNavigateToBeaker?: (cationId: string, anionId: string) => void
}

export const IonRightPanel: React.FC<IonRightPanelProps> = ({
  inquiryMode,
  selectedIon,
  selectedReagent,
  dropCount,
  conflicts,
  coexistenceIons,
  selectedPair,
  onNavigateToBeaker,
}) => {
  // 控制全景大表模式下“审题四步法”和“暗语破译字典”的折叠状态（默认收起或精简展示，不喧宾夺主）
  const [showMethodology, setShowMethodology] = useState<boolean>(false)

  return (
    <div className="p-2.5 space-y-2.5 text-slate-800 text-xs w-full max-w-full overflow-x-hidden select-none">
      {/* ────────────────── 模式 1：单个离子特征检验 ────────────────── */}
      {inquiryMode === 'single-test' && selectedIon && (
        <>
          {/* 1. 离子档案基本信息条 */}
          <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                <span>{selectedIon.name}</span>
                <span className="text-xs text-blue-700 font-mono">
                  <KatexFormula formula={selectedIon.formula} mode="inline" />
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 shrink-0">
                {selectedIon.examImportance === 'ultra' ? '高考高频必考' : '重点考查'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 gap-2">
              <span className="text-slate-500 shrink-0">原液外观：</span>
              <span className="font-semibold text-slate-800 text-right truncate">
                {selectedIon.colorInSolution}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="text-slate-500 shrink-0">标配试剂：</span>
              <span className="font-bold text-blue-700 text-right truncate">
                {selectedIon.testReagent}
              </span>
            </div>
          </div>

          {/* 2. 当前选定试剂评级与滴加阶段（与左屏、中屏滴加步骤深度同步） */}
          {selectedReagent && (
            <div
              className={`p-2.5 rounded-lg border space-y-2 ${
                selectedReagent.tag === 'optimal'
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : selectedReagent.tag === 'trap'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {selectedReagent.tag === 'optimal' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : selectedReagent.tag === 'trap' ? (
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">试剂：{selectedReagent.name}</span>
                </div>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    selectedReagent.tag === 'optimal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedReagent.tag === 'trap'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedReagent.tag === 'optimal'
                    ? '高考最佳首选'
                    : selectedReagent.tag === 'trap'
                    ? '高考经典陷阱'
                    : '无关干扰试剂'}
                </span>
              </div>

              {/* 滴加实验三阶段动态进度条 */}
              <div className="p-1.5 rounded bg-white/80 border border-slate-200/80 flex items-center justify-between text-xs gap-1">
                <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0">
                  <Droplet className="w-3.5 h-3.5 text-blue-600" />
                  实验阶段:
                </span>
                <span className="font-bold text-slate-900">
                  {dropCount === 0 && '① 待测原液 (未滴加)'}
                  {dropCount === 1 && '② 滴加少量试剂 (初探)'}
                  {dropCount === 2 && '③ 继续滴加至过量 (终态)'}
                </span>
              </div>

              <div className="text-xs leading-relaxed font-medium">
                {selectedReagent.feedback}
              </div>
            </div>
          )}

          {/* 3. 特征离子反应方程式 (规范排版，无水平滚动条) */}
          <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>特征反应离子方程式 (必背)</span>
            </div>

            <IonChemEquation
              equation={selectedReagent?.equation || selectedIon.testEquation}
              highlight
            />

            <div className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              <span className="font-bold text-blue-900">宏观现象：</span>
              {selectedReagent?.phenomenon || selectedIon.testPhenomenon}
            </div>
          </div>

          {/* 4. 干扰离子排除指南 (高考避坑雷达) */}
          <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>干扰离子排除法则 (避坑指南)</span>
            </div>
            <div className="text-xs text-amber-900 leading-relaxed font-medium">
              {selectedIon.interference}
            </div>
          </div>

          {/* 5. 高考标准答题规范句式 (必背模板) */}
          <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>高考标准答题规范句式 (提分踩点)</span>
            </div>
            <div className="text-xs text-emerald-900 leading-relaxed font-medium bg-white p-2 rounded border border-emerald-200">
              “{selectedIon.standardProcedure}”
            </div>
          </div>
        </>
      )}

      {/* ────────────────── 模式 2：多离子共存探究 ────────────────── */}
      {inquiryMode === 'coexistence-check' && (
        <>
          {/* 1. 共存判定结论横幅 */}
          <div
            className={`p-2.5 rounded-lg border ${
              conflicts.length === 0
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm">
              {conflicts.length === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>
                {conflicts.length === 0
                  ? '已选离子可在同一溶液中大量共存'
                  : `不能大量共存 (发现 ${conflicts.length} 处反应互斥)`}
              </span>
            </div>
            <div className="text-xs mt-1 text-slate-600 font-medium">
              已选离子清单: {coexistenceIons.map((i) => i.id).join('、') || '未选择'}
            </div>
          </div>

          {/* 2. 互斥明细列表（若有冲突） */}
          {conflicts.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>互斥反应方程式与本质机理：</span>
              </div>
              {conflicts.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="p-2.5 bg-white rounded-lg border border-rose-200/90 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-rose-950 font-bold text-xs">
                    <span>
                      {idx + 1}. 【{c.typeLabel}】
                    </span>
                    <span className="text-xs bg-rose-100 px-1.5 py-0.5 rounded text-rose-800 font-mono">
                      {c.ionA} 与 {c.ionB}
                    </span>
                  </div>

                  {/* 规范方程式渲染 */}
                  <IonChemEquation equation={c.equation} />

                  <div className="text-slate-700 text-xs leading-relaxed font-medium">
                    <span className="font-bold text-slate-900">机理说明：</span>
                    {c.reason}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. 高考离子共存四大互斥铁律口诀 */}
          <div className="p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-200 space-y-1.5 text-indigo-950">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>高考离子共存四大互斥铁律口诀</span>
            </div>
            <div className="space-y-1 text-xs text-slate-700">
              <div className="p-1.5 bg-white rounded border border-indigo-100">
                <span className="font-bold text-indigo-900">① 看颜色：</span>
                <span className="text-slate-600">
                  无色溶液排斥 Cu²⁺(蓝)、Fe³⁺(黄)、Fe²⁺(浅绿)、MnO₄⁻(紫红)。
                </span>
              </div>
              <div className="p-1.5 bg-white rounded border border-indigo-100">
                <span className="font-bold text-indigo-900">② 看介质(酸碱)：</span>
                <span className="text-slate-600">
                  强酸性排斥弱酸根及 OH⁻；两性酸式根(HCO₃⁻/HSO₃⁻)酸碱皆排斥。
                </span>
              </div>
              <div className="p-1.5 bg-white rounded border border-indigo-100">
                <span className="font-bold text-indigo-900">③ 看氧化还原：</span>
                <span className="text-slate-600">
                  Fe³⁺/NO₃⁻(H⁺)/ClO⁻ 遇 S²⁻/I⁻/SO₃²⁻/Fe²⁺ 自发氧化还原。
                </span>
              </div>
              <div className="p-1.5 bg-white rounded border border-indigo-100">
                <span className="font-bold text-indigo-900">④ 看剧烈双水解：</span>
                <span className="text-slate-600">
                  Al³⁺/Fe³⁺ 遇 CO₃²⁻/HCO₃⁻/S²⁻/AlO₂⁻ 水解彻底生成沉淀与气体。
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ────────────────── 模式 3：9 大互斥机理九宫格 ────────────────── */}
      {inquiryMode === 'mechanism-grid' && (
        <>
          {(() => {
            const currentItem = selectedPair
              ? findMechanismItem(selectedPair.cationId, selectedPair.anionId)
              : undefined

            const currentGroup = currentItem
              ? MECHANISM_GROUPS.find((g) => g.id === currentItem.dimensionId)
              : undefined

            if (currentItem && currentGroup) {
              return (
                <div className="space-y-2.5">
                  {/* 母题身份卡 */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        {currentGroup.id === 'double-hydrolysis' && (
                          <Flame className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        {currentGroup.id === 'redox-hidden' && (
                          <Zap className="w-4 h-4 text-purple-600 shrink-0" />
                        )}
                        {currentGroup.id === 'precipitate-trap' && (
                          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                        {currentGroup.id === 'gas-weak-acid' && (
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>{currentItem.title}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 shrink-0">
                        {currentItem.tag}
                      </span>
                    </div>

                    <div className="p-1.5 rounded bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">核心反应产物：</span>
                      <span className="font-bold text-blue-900">{currentItem.productSummary}</span>
                    </div>
                  </div>

                  {/* 规范离子反应方程式 */}
                  <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>规范离子反应方程式 (必背)</span>
                    </div>
                    <IonChemEquation equation={currentItem.equation} highlight />
                  </div>

                  {/* 本质机理与宏观现象 */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>反应本质机理与宏观现象</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {currentItem.phenomenon}
                    </p>
                    <p className="text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
                      <strong>驱动力剖析：</strong>
                      {currentItem.mechanismReason}
                    </p>
                  </div>

                  {/* 高考命题陷阱与破题点拨 */}
                  <div className="p-2.5 bg-rose-50/70 rounded-lg border border-rose-200 space-y-1 text-xs text-rose-950">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>高考命题陷阱与破题点拨</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-rose-100 leading-relaxed font-medium">
                      {currentItem.examTrap}
                    </div>
                  </div>

                  {/* 维度归属 */}
                  <div className="p-2 bg-slate-100/80 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span>归属维度：{currentGroup.title}</span>
                    <span className="font-bold text-rose-700">一票否决共存</span>
                  </div>
                </div>
              )
            }

            return (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>新高考 4 大互斥维度命题思维导图</span>
                  </div>
                  <p className="text-indigo-800 leading-relaxed font-medium">
                    点击中屏九宫格中任意母题芯片，右侧将立即呈现该母题的高考规范方程式、反应驱动力机理及设问避坑秘籍。
                  </p>
                </div>

                <div className="space-y-1.5">
                  {MECHANISM_GROUPS.map((g) => (
                    <div
                      key={g.id}
                      className="p-2 bg-white rounded-lg border border-slate-200 space-y-0.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                        <span>{g.title}</span>
                        <span className="text-xs text-blue-700 font-mono">
                          {g.items.length} 组高频
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {g.examFocus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </>
      )}

      {/* ────────────────── 模式 4：14×18 全景互斥大表 ────────────────── */}
      {inquiryMode === 'coexistence-matrix' && (
        <>
          {(() => {
            // 读取中屏大表选定格子（cationId 与 anionId）的真实化学数据
            const activeCell = selectedPair
              ? getIonPairCell(selectedPair.cationId, selectedPair.anionId)
              : null

            return (
              <div className="space-y-2.5">
                {/* 1. 当前大表聚焦离子对深度卡片 (解决中屏与右屏脱节痛点) */}
                {activeCell ? (
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 font-mono">
                          {activeCell.cationId} + {activeCell.anionId}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            activeCell.status === 'coexist'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {activeCell.status === 'coexist' ? '✓ 大量共存' : '✕ 互斥排斥'}
                        </span>
                        {activeCell.category !== 'none' && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                              CONFLICT_CATEGORY_CONFIG[activeCell.category]?.badgeBg ||
                              'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {CONFLICT_CATEGORY_CONFIG[activeCell.category]?.label ||
                              activeCell.badgeLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 反应产物与方程式 */}
                    {activeCell.status === 'conflict' ? (
                      <div className="space-y-1.5">
                        {activeCell.productSummary && (
                          <div className="p-1.5 rounded bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">生成产物：</span>
                            <span className="font-bold text-blue-900">
                              {activeCell.productSummary}
                            </span>
                          </div>
                        )}

                        <div className="space-y-1">
                          <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            离子反应方程式
                          </span>
                          <IonChemEquation equation={activeCell.equation} highlight />
                        </div>

                        {/* 宏观现象与机理 */}
                        <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                          <span className="font-bold text-slate-800 block">
                            现象与反应本质：
                          </span>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {activeCell.phenomenon || activeCell.reason}
                          </p>
                          {activeCell.examTrap && (
                            <p className="text-rose-800 font-medium pt-1 border-t border-slate-200">
                              <strong>高考避坑：</strong>
                              {activeCell.examTrap}
                            </p>
                          )}
                        </div>

                        {/* 导入烧杯微观模拟快捷按钮 */}
                        {onNavigateToBeaker && (
                          <button
                            type="button"
                            onClick={() =>
                              onNavigateToBeaker(activeCell.cationId, activeCell.anionId)
                            }
                            className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          >
                            <Beaker className="w-3.5 h-3.5" />
                            <span>导入烧杯微观模拟</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <span className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          共存机理说明
                        </span>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {activeCell.reason ||
                            `${activeCell.cationId} 与 ${activeCell.anionId} 不发生复分解、氧化还原或剧烈双水解，可在同一溶液中稳定大量共存。`}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200 text-xs text-blue-900">
                    <p className="font-bold">点击中屏大表中的任意单元格</p>
                    <p className="text-slate-600 mt-0.5">
                      右屏将立即联动解析该离子对的高考方程式、宏观现象与反应机理。
                    </p>
                  </div>
                )}

                {/* 2. 高考离子共存解题“四步秒杀法” (支持紧凑展开/折叠) */}
                <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200 space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowMethodology((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-bold text-blue-950 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>高考离子共存审题“四步秒杀法”</span>
                    </div>
                    {showMethodology ? (
                      <ChevronDown className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    )}
                  </button>

                  {showMethodology && (
                    <div className="space-y-1.5 text-xs text-slate-700 pt-1 border-t border-blue-200/60">
                      <div className="p-2 bg-white rounded border border-blue-100">
                        <span className="font-bold text-blue-800">第 1 步【看限制条件】：</span>
                        <p className="text-slate-600 mt-0.5 font-medium">
                          抓“无色透明”、“酸性/碱性”、“水电离 c(H⁺)=10⁻¹³”等前置约束。
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded border border-blue-100">
                        <span className="font-bold text-blue-800">第 2 步【排查酸碱冲突】：</span>
                        <p className="text-slate-600 mt-0.5 font-medium">
                          弱酸根见酸互斥；多元弱酸酸式根（HCO₃⁻/HSO₃⁻）酸碱皆排斥。
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded border border-blue-100">
                        <span className="font-bold text-blue-800">第 3 步【排查氧化还原】：</span>
                        <p className="text-slate-600 mt-0.5 font-medium">
                          NO₃⁻(H⁺) 和 ClO⁻ 强氧化性，必氧化 Fe²⁺/I⁻/SO₃²⁻/S²⁻。
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded border border-blue-100">
                        <span className="font-bold text-blue-800">第 4 步【排查双水解与沉淀】：</span>
                        <p className="text-slate-600 mt-0.5 font-medium">
                          Al³⁺/Fe³⁺ 遇 HCO₃⁻/CO₃²⁻ 必水解生成沉淀与气体。
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. 题干高频“暗语”破译字典 */}
                <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>题干高频“暗语”破译字典</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="bg-white p-2 rounded border border-amber-100">
                      <span className="font-bold text-amber-950">“pH=1 的溶液”</span>
                      <p className="text-slate-600 font-medium">
                        含大量 H⁺，排斥 OH⁻ 及所有弱酸根/弱酸酸式根。
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded border border-amber-100">
                      <span className="font-bold text-amber-950">
                        “由水电离的 c(H⁺) = 10⁻¹³ mol/L”
                      </span>
                      <p className="text-slate-600 font-medium">
                        水的电离受抑制，溶液可能为强酸性（含大量 H⁺）或强碱性（含大量 OH⁻），所选离子需在酸碱双重环境中均能共存。
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded border border-amber-100">
                      <span className="font-bold text-amber-950">“加入铝粉产生 H₂ 的溶液”</span>
                      <p className="text-slate-600 font-medium">
                        可能为强酸溶液（但不能含 NO₃⁻，否则生成 NO），也可能为强碱溶液。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </>
      )}
    </div>
  )
}
