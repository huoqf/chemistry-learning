/**
 * src/features/gas-chain/components/GasChainDiagnosticCard.tsx
 * 气体制备/净化/尾气处理装置链工具 - 装置链逻辑与避坑诊断看板
 */

import React from 'react'
import type { GasChainChemistryResult } from '../hooks/useGasChainChemistry'

interface GasChainDiagnosticCardProps {
  chemistry: GasChainChemistryResult
}

export const GasChainDiagnosticCard: React.FC<GasChainDiagnosticCardProps> = ({
  chemistry,
}) => {
  const { issues, hasDangerAlert, dangerType, gasPurity, tailAbsorbRate } = chemistry

  return (
    <div className="w-full h-full flex flex-col gap-3 font-sans">
      {/* 顶部指标卡 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[11px] text-slate-500 font-medium">气体收集纯度 ($w\%$)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-extrabold text-blue-600">{gasPurity.toFixed(1)}%</span>
            <span className="text-[10px] text-slate-400">标准 &gt; 95%</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[11px] text-slate-500 font-medium">尾气吸收吸收率</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-extrabold text-emerald-600">{tailAbsorbRate.toFixed(1)}%</span>
            <span className="text-[10px] text-slate-400">绿色环保</span>
          </div>
        </div>

        <div className={`border rounded-lg p-2.5 flex flex-col justify-between ${
          hasDangerAlert
            ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span className="text-[11px] font-medium">装置链逻辑安全评估</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold">
              {hasDangerAlert ? `⚠️ 高危事故 (${dangerType})` : '✓ 安全且合规'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white/80">
              {issues.length} 项评估
            </span>
          </div>
        </div>
      </div>

      {/* 诊断列表 */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
        {issues.map((issue) => {
          let badgeBg = 'bg-slate-100 text-slate-700 border-slate-300'
          if (issue.level === 'danger') badgeBg = 'bg-rose-100 text-rose-800 border-rose-300'
          if (issue.level === 'warning') badgeBg = 'bg-amber-100 text-amber-800 border-amber-300'
          if (issue.level === 'success') badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300'

          return (
            <div
              key={issue.id}
              className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] border font-bold ${badgeBg}`}>
                    {issue.level === 'danger' ? '事故高危' : issue.level === 'warning' ? '易错扣分' : '合规建议'}
                  </span>
                  {issue.title}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">{issue.description}</p>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 text-[11px] text-slate-600 flex items-start gap-1">
                <span className="font-bold text-blue-600 shrink-0">💡 高考考点:</span>
                <span>{issue.examPoint}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
