import React, { useState, useEffect } from 'react'
import {
  X,
  ArrowRight,
  Beaker,
} from 'lucide-react'
import { ChemicalFormula } from '@/components/UI/ChemicalFormula'
import type { ValenceSubstanceNode, ElementValenceConfig } from '@/data/valence-matrix'
import { CHEMISTRY_COLORS } from '@/theme'

export interface ValenceColorTestModalProps {
  isOpen: boolean
  onClose: () => void
  substance: ValenceSubstanceNode | null
  elementConfig: ElementValenceConfig
  onSelectSubstance?: (substance: ValenceSubstanceNode) => void
}

/**
 * ValenceColorTestModal — 无机物质高考全景档案与价态规律探究卡
 *
 * 彻底摒弃单一违和的试管动画，以高考学术标准全面呈现：
 * 1. 【物质物理标本与本色状态】：真实聚集形态、外观色泽、氧化还原角色定位；
 * 2. 【高考实验三要素】：规范操作、标准判分现象、核心配平离子/化学方程式；
 * 3. 【价态升降与氧化还原规律】：向上氧化所需氧化剂、向下还原所需还原剂、同价非氧化还原转化；
 * 4. 【高考易错警示与解题金句】：直击高考核心命题坑点；
 * 5. 【同元素代表物全景对比】：同族代表物一键快速切换研读。
 */
export const ValenceColorTestModal: React.FC<ValenceColorTestModalProps> = ({
  isOpen,
  onClose,
  substance,
  elementConfig,
  onSelectSubstance,
}) => {
  const [currentSubstance, setCurrentSubstance] = useState<ValenceSubstanceNode | null>(substance)

  useEffect(() => {
    if (substance) {
      setCurrentSubstance(substance)
    }
  }, [substance])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !currentSubstance) return null

  // 物质聚集状态与特征属性
  const isGas =
    currentSubstance.physicalState === 'gas' ||
    ['Cl2', 'Cl₂', 'SO2', 'SO₂', 'NO2', 'NO₂', 'NO', 'NH3', 'NH₃', 'H2S', 'H₂S', 'HCl', 'CH4', 'CH₄', 'CO', 'CO2', 'CO₂', 'O2', 'O₂', 'N2', 'N₂'].some(
      (g) => currentSubstance.substance.includes(g)
    )

  const isSolid =
    !isGas &&
    (currentSubstance.physicalState === 'solid' ||
      currentSubstance.category === '单质' ||
      (currentSubstance.category === '氧化物' && !currentSubstance.substance.includes('SO')))

  const isPrecipitate =
    !isGas &&
    !isSolid &&
    (currentSubstance.physicalState === 'precipitate' ||
      currentSubstance.precipitateType === 'transient-feoh2' ||
      currentSubstance.precipitateType === 'red-brown' ||
      currentSubstance.colorText.includes('沉淀'))

  const physicalStateLabel = isGas
    ? '气态分子 (气体)'
    : isSolid
    ? '固体粉末 / 晶体'
    : isPrecipitate
    ? '难溶沉淀 / 胶状物'
    : '澄清离子水溶液'

  // 计算与当前物质相关的价态升降转化路径
  const upwardOxidations = elementConfig.transformations.filter(
    (t) => t.fromSubstance.includes(currentSubstance.substance) && t.type === 'oxidation'
  )
  const downwardReductions = elementConfig.transformations.filter(
    (t) => t.fromSubstance.includes(currentSubstance.substance) && t.type === 'reduction'
  )
  const otherTransformations = elementConfig.transformations.filter(
    (t) =>
      (t.fromSubstance.includes(currentSubstance.substance) || t.toSubstance.includes(currentSubstance.substance)) &&
      t.type !== 'oxidation' &&
      t.type !== 'reduction'
  )

  const siblingSubstances = elementConfig.items

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 顶栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl shadow-xs border border-slate-300/80 flex items-center justify-center font-black text-base"
              style={{
                backgroundColor: currentSubstance.rgbColor || CHEMISTRY_COLORS.indicator,
                color: '#0F172A',
              }}
            >
              {currentSubstance.substance.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                  <ChemicalFormula formula={currentSubstance.substance} />
                  <span className="text-sm font-semibold text-slate-500">
                    高考物质全景档案
                  </span>
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                    currentSubstance.valence > 0
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : currentSubstance.valence < 0
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  {currentSubstance.valence > 0 ? `+${currentSubstance.valence}` : currentSubstance.valence} 价
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentSubstance.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {elementConfig.name} · {elementConfig.badgeText}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            title="关闭 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 主体内容卡片网格 */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* 左侧：物质物理本色与特征实验三要素 (7列) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* 模块 1：物理标本与聚集状态 */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex flex-col gap-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  【物理本色与聚集状态】
                </span>
                <span className="text-2xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                  {physicalStateLabel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1">
                  <span className="text-2xs text-slate-500 font-medium">真实外观与颜色</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full inline-block border border-slate-300 shrink-0"
                      style={{ backgroundColor: currentSubstance.rgbColor || '#CBD5E1' }}
                    />
                    {currentSubstance.colorText}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1">
                  <span className="text-2xs text-slate-500 font-medium">氧化还原角色</span>
                  <span className="font-bold text-indigo-950">
                    {currentSubstance.isOxidant && '强氧化性（易得电子降价）'}
                    {currentSubstance.isReductant && '强还原性（易失电子升价）'}
                    {!currentSubstance.isOxidant && !currentSubstance.isReductant && '中间价态 · 兼具氧化与还原性'}
                  </span>
                </div>
              </div>
            </div>

            {/* 模块 2：高考特征实验与现象三要素 */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex flex-col gap-3 shadow-2xs">
              <div className="text-xs font-bold text-indigo-900">
                【高考特征实验现象与判分点】
              </div>

              <div className="text-xs text-indigo-950 leading-relaxed font-medium bg-white/90 p-3 rounded-xl border border-indigo-100/80 shadow-2xs">
                {currentSubstance.testReaction || '该物质在高中阶段主要作为化工原料或反应中间体考察。'}
              </div>

              {currentSubstance.equation && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xs font-bold text-indigo-800">
                    规范高考离子 / 化学方程式：
                  </span>
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 font-mono text-xs font-bold text-indigo-950 select-text overflow-x-auto">
                    {currentSubstance.equation}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：价态升降核心规律与易错考点 (5列) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* 模块 3：价态升降转化规律 */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col gap-3 shadow-2xs">
              <div className="text-xs font-bold text-amber-900">
                【价态升降与核心转化路径】
              </div>

              <div className="flex flex-col gap-2 text-xs">
                {/* 向上氧化路径 */}
                {upwardOxidations.length > 0 && (
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/70 flex flex-col gap-1">
                    <span className="text-2xs font-bold text-rose-700">
                      ↑ 升高氧化（失电子）：
                    </span>
                    {upwardOxidations.map((t) => (
                      <div key={t.id} className="text-2xs text-slate-700 flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        <span className="px-1.5 py-0.5 bg-rose-50 text-rose-800 rounded font-medium border border-rose-200">
                          {t.reagent}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 向下还原路径 */}
                {downwardReductions.length > 0 && (
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/70 flex flex-col gap-1">
                    <span className="text-2xs font-bold text-blue-700">
                      ↓ 降低还原（得电子）：
                    </span>
                    {downwardReductions.map((t) => (
                      <div key={t.id} className="text-2xs text-slate-700 flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded font-medium border border-blue-200">
                          {t.reagent}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 其他非氧化还原转化 */}
                {otherTransformations.length > 0 && (
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/70 flex flex-col gap-1">
                    <span className="text-2xs font-bold text-emerald-700">
                      ↔ 类别转化（酸碱/沉淀/复分解）：
                    </span>
                    {otherTransformations.slice(0, 2).map((t) => (
                      <div key={t.id} className="text-2xs text-slate-700 flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <ChemicalFormula formula={t.fromSubstance} />
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <ChemicalFormula formula={t.toSubstance} />
                        </span>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium border border-emerald-200">
                          {t.reagent}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {upwardOxidations.length === 0 && downwardReductions.length === 0 && otherTransformations.length === 0 && (
                  <div className="text-2xs text-slate-500 p-2 bg-white rounded-lg">
                    该物质处于典型稳定价态，遵循同族元素通性转化。
                  </div>
                )}
              </div>
            </div>

            {/* 模块 4：高考易错点与解题提示 */}
            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200/80 flex flex-col gap-2 shadow-2xs">
              <div className="text-xs font-bold text-rose-900">
                【高考高频考点与答题要诀】
              </div>
              <p className="text-2xs text-rose-950 leading-relaxed font-medium">
                {currentSubstance.roleDescription || '掌握反应物与生成物配平方程式，关注沉淀符号与气体符号的规范标注。'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. 底栏：同元素代表物质快速切换研读 */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
            <Beaker className="w-4 h-4 text-indigo-600" />
            <span>{elementConfig.name} 全部代表物档案 ({siblingSubstances.length} 种):</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {siblingSubstances.map((item) => {
              const isActive = currentSubstance.substance === item.substance
              return (
                <button
                  key={item.substance}
                  onClick={() => {
                    setCurrentSubstance(item)
                    if (onSelectSubstance) {
                      onSelectSubstance(item)
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
                  }`}
                >
                  <ChemicalFormula formula={item.substance} />
                  <span className={`text-2xs px-1 py-0.2 rounded font-mono ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'}`}>
                    {item.valence >= 0 ? `+${item.valence}` : item.valence}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
