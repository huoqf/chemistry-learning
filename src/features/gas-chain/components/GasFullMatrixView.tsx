/**
 * src/features/gas-chain/components/GasFullMatrixView.tsx
 * 母题六：气体制备/净化/尾气处理装置链 - 全景速查大表与多维专项决策矩阵
 *
 * 遵循 Rule 规范：
 * 1. 严格采用系统 Light Theme 规范，杜绝突兀深黑/暗黑包裹；
 * 2. 聚焦于全景横向对比大表与专项矩阵，深度覆盖新高考考纲；
 * 3. 采用单一主滚动条架构，各 Tab 拆分高内聚子组件，0 局部嵌套滚动条；
 * 4. 支持 13 种气体 100% 连通模拟。
 */

import React, { useState } from 'react'
import type { GasCategory } from '../data/gasChainMatrixData'
import {
  Beaker,
  ShieldAlert,
  Droplets,
  TableProperties,
} from 'lucide-react'
import { GasGeneratorTab } from './tabs/GasGeneratorTab'
import { GasDryingTab } from './tabs/GasDryingTab'
import { GasSafetyTab } from './tabs/GasSafetyTab'
import { GasMatrixTab } from './tabs/GasMatrixTab'

interface GasFullMatrixViewProps {
  onApplySystemPreset?: (targetGas: string) => void
  categoryFilter?: GasCategory | 'all'
  onCategoryFilterChange?: (cat: GasCategory | 'all') => void
}

type MainTabMode = 'kipp-generator' | 'cross-drying' | 'safety-templates' | 'matrix'

export const GasFullMatrixView: React.FC<GasFullMatrixViewProps> = ({
  onApplySystemPreset,
  categoryFilter = 'all',
  onCategoryFilterChange,
}) => {
  const [mainTab, setMainTab] = useState<MainTabMode>('kipp-generator')

  return (
    <div className="w-full h-full p-3.5 overflow-y-auto overflow-x-hidden space-y-3.5 text-slate-800 bg-slate-50/50">
      {/* 0. 顶层 4 大专业专项 Tab 切换 (按 发生 ➔ 净化干燥 ➔ 收集安全 ➔ 全景总表 全流程顺序排列) */}
      <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 w-full">
          {/* 1. 发生环节 */}
          <button
            onClick={() => setMainTab('kipp-generator')}
            className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              mainTab === 'kipp-generator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Beaker className="w-4 h-4" />
            <span>发生装置与启普判据</span>
          </button>

          {/* 2. 净化与干燥环节 */}
          <button
            onClick={() => setMainTab('cross-drying')}
            className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              mainTab === 'cross-drying'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>净化除杂与干燥相容</span>
          </button>

          {/* 3. 收集与安全防倒吸环节 */}
          <button
            onClick={() => setMainTab('safety-templates')}
            className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              mainTab === 'safety-templates'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>收集决策与防倒吸安全</span>
          </button>

          {/* 4. 全景综合总表 */}
          <button
            onClick={() => setMainTab('matrix')}
            className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              mainTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            <span>13 大气体制备全景总表</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 发生装置体系与启普发生器判据 */}
      {mainTab === 'kipp-generator' && <GasGeneratorTab />}

      {/* Tab 2: 净化除杂与干燥相容 */}
      {mainTab === 'cross-drying' && <GasDryingTab />}

      {/* Tab 3: 收集决策与防倒吸安全 */}
      {mainTab === 'safety-templates' && <GasSafetyTab />}

      {/* Tab 4: 13 大气体制备全景总表 */}
      {mainTab === 'matrix' && (
        <GasMatrixTab
          onApplySystemPreset={onApplySystemPreset}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={onCategoryFilterChange}
        />
      )}
    </div>
  )
}
