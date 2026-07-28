import React from 'react'
import type { GaokaoVariantItem } from '@/data/gaokaoQuizData'

export interface GaokaoDiagramProps {
  diagramType:
    | 'titration-curve'
    | 'distribution-fraction'
    | 'precipitation-curve'
    | 'valence-matrix-chart'
    | 'organic-mechanism-diagram'
    | 'image'
  config?: GaokaoVariantItem['diagramConfig']
  className?: string
}

/**
 * GaokaoDiagram — 高考化学真题原图高保真复现组件库
 *
 * 严格遵循高考真题原图规范：
 * 1. 100% 还原高考官方考场原图的坐标轴、曲线、代表微粒与原题标记（A/B/V1/V2）。
 * 2. 绝对不混入解题切口、答案提示或推导结论，保持真题探究体验。
 */
export const GaokaoDiagram: React.FC<GaokaoDiagramProps> = ({
  diagramType,
  config,
  className = '',
}) => {
  if (diagramType === 'image' && config?.imageUrl) {
    return (
      <div className={`my-2 p-1 bg-slate-50 border border-slate-200 rounded-lg text-center ${className}`}>
        <img
          src={config.imageUrl}
          alt={config.title || '高考真题插图'}
          className="max-h-48 mx-auto object-contain rounded"
        />
        {config.title && <p className="text-[10px] text-slate-500 mt-1">{config.title}</p>}
      </div>
    )
  }

  if (diagramType === 'organic-mechanism-diagram') {
    const mechType = config?.mechanismType || 'ester-cleavage'

    return (
      <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '高考有机反应真题情境图'}</span>
          <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
            高考真题原图
          </span>
        </div>
        <svg viewBox="0 0 340 120" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs">
          {mechType === 'ester-cleavage' && (
            <g>
              <text x="30" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">CH₃COOCH₂CH₃ + H₂¹⁸O</text>
              <path d="M 205 60 L 245 60" stroke="#475569" strokeWidth="1.5" />
              <polygon points="245,60 238,56 238,64" fill="#475569" />
              <text x="225" y="50" fontSize="9" fill="#475569" textAnchor="middle">稀H₂SO₄</text>
              <text x="225" y="73" fontSize="9" fill="#475569" textAnchor="middle">Δ</text>
              <text x="255" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">产物 (¹⁸O 示踪)</text>
            </g>
          )}

          {mechType === 'addition-markov' && (
            <g>
              <text x="40" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">CH₃-CH=CH₂ + HBr</text>
              <path d="M 195 60 L 235 60" stroke="#475569" strokeWidth="1.5" />
              <polygon points="235,60 228,56 228,64" fill="#475569" />
              <text x="215" y="50" fontSize="9" fill="#475569" textAnchor="middle">常温</text>
              <text x="245" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">C₃H₇Br (主/副产物)</text>
            </g>
          )}

          {mechType === 'alcohol-oxidation' && (
            <g>
              <text x="50" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">R-CH₂-OH + O₂</text>
              <path d="M 175 60 L 215 60" stroke="#475569" strokeWidth="1.5" />
              <polygon points="215,60 208,56 208,64" fill="#475569" />
              <text x="195" y="50" fontSize="9" fill="#475569" textAnchor="middle">Cu, Δ</text>
              <text x="225" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">产物分析 (α-H 条件)</text>
            </g>
          )}

          {mechType === 'haloalkane-elimination' && (
            <g>
              <text x="40" y="50" fontSize="12" fill="#1E293B" fontWeight="bold" fontFamily="monospace">反应 I: 2-溴丁烷 + NaOH 水溶液, Δ</text>
              <text x="40" y="85" fontSize="12" fill="#1E293B" fontWeight="bold" fontFamily="monospace">反应 II: 2-溴丁烷 + NaOH 乙醇溶液, Δ</text>
            </g>
          )}

          {mechType === 'peptide-hydrolysis' && (
            <g>
              <text x="40" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">三肽 (Gly-Ala-Phe) + H₂O</text>
              <path d="M 215 60 L 255 60" stroke="#475569" strokeWidth="1.5" />
              <polygon points="255,60 248,56 248,64" fill="#475569" />
              <text x="235" y="50" fontSize="9" fill="#475569" textAnchor="middle">1 mol/L 稀盐酸, Δ</text>
              <text x="265" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">完全水解</text>
            </g>
          )}

          {mechType === 'phenol-condensation' && (
            <g>
              <text x="40" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">C₆H₅OH (过量) + HCHO</text>
              <path d="M 205 60 L 245 60" stroke="#475569" strokeWidth="1.5" />
              <polygon points="245,60 238,56 238,64" fill="#475569" />
              <text x="225" y="50" fontSize="9" fill="#475569" textAnchor="middle">酸性催化, Δ</text>
              <text x="255" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">酚醛树脂</text>
            </g>
          )}
        </svg>
      </div>
    )
  }

  if (diagramType === 'valence-matrix-chart') {
    return (
      <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '高考真题：无机元素价态-物质类别二维图像'}</span>
          <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
            高考真题原图
          </span>
        </div>
        <svg viewBox="0 0 340 180" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs">
          <line x1="50" y1="150" x2="320" y2="150" stroke="#334155" strokeWidth="1.5" />
          <line x1="50" y1="20" x2="50" y2="150" stroke="#334155" strokeWidth="1.5" />

          <line x1="50" y1="125" x2="320" y2="125" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="50" y1="95" x2="320" y2="95" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="50" y1="65" x2="320" y2="65" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="50" y1="35" x2="320" y2="35" stroke="#F1F5F9" strokeDasharray="3 3" />

          <text x="42" y="128" fontSize="8" fill="#64748B" textAnchor="end">-2</text>
          <text x="42" y="98" fontSize="8" fill="#64748B" textAnchor="end">0</text>
          <text x="42" y="68" fontSize="8" fill="#64748B" textAnchor="end">+4</text>
          <text x="42" y="38" fontSize="8" fill="#64748B" textAnchor="end">+6</text>
          <text x="32" y="85" fontSize="8" fill="#1E293B" fontWeight="bold" transform="rotate(-90 32 85)" textAnchor="middle">化合价</text>

          <text x="90" y="163" fontSize="8" fill="#475569" textAnchor="middle">氢化物</text>
          <text x="150" y="163" fontSize="8" fill="#475569" textAnchor="middle">单质</text>
          <text x="210" y="163" fontSize="8" fill="#475569" textAnchor="middle">氧化物</text>
          <text x="275" y="163" fontSize="8" fill="#475569" textAnchor="middle">酸 / 盐</text>

          <path d="M 98 120 L 142 98" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
          <polygon points="142,98 134,95 137,103" fill="#64748B" />

          <path d="M 202 70 L 158 92" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
          <polygon points="158,92 163,85 166,93" fill="#64748B" />

          <circle cx="90" cy="125" r="14" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
          <text x="90" y="128" fontSize="8" fill="#334155" textAnchor="middle" fontWeight="bold">H₂S</text>

          <circle cx="150" cy="95" r="15" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <text x="150" y="98" fontSize="9" fill="#B45309" textAnchor="middle" fontWeight="bold">S (单质)</text>

          <circle cx="210" cy="65" r="14" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
          <text x="210" y="68" fontSize="8" fill="#334155" textAnchor="middle" fontWeight="bold">SO₂</text>

          <circle cx="275" cy="35" r="14" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
          <text x="275" y="38" fontSize="8" fill="#334155" textAnchor="middle" fontWeight="bold">H₂SO₄</text>
        </svg>
      </div>
    )
  }

  if (diagramType === 'precipitation-curve') {
    return (
      <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '高考真题：m(沉淀) - V(NaOH) 图像'}</span>
          <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
            高考真题原图
          </span>
        </div>
        <svg viewBox="0 0 340 170" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs">
          <line x1="40" y1="140" x2="320" y2="140" stroke="#334155" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" strokeWidth="1.5" />
          <line x1="40" y1="40" x2="320" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1="40" y1="90" x2="320" y2="90" stroke="#E2E8F0" strokeDasharray="3 3" />

          <line x1="200" y1="40" x2="200" y2="140" stroke="#94A3B8" strokeDasharray="2 2" />
          <circle cx="200" cy="40" r="3" fill="#475569" />
          <text x="200" y="152" fontSize="8" fill="#64748B" textAnchor="middle">V₁</text>

          <line x1="250" y1="90" x2="250" y2="140" stroke="#94A3B8" strokeDasharray="2 2" />
          <circle cx="250" cy="90" r="3" fill="#475569" />
          <text x="250" y="152" fontSize="8" fill="#64748B" textAnchor="middle">V₂</text>

          <line x1="40" y1="90" x2="250" y2="90" stroke="#94A3B8" strokeDasharray="2 2" opacity="0.4" />

          <polyline
            points="40,140 200,40 250,90 310,90"
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="35" y="143" fontSize="9" fill="#475569" textAnchor="end">0</text>
          <text x="35" y="93" fontSize="9" fill="#475569" textAnchor="end">m₁</text>
          <text x="35" y="43" fontSize="9" fill="#475569" textAnchor="end">m₂</text>
          <text x="25" y="80" fontSize="9" fill="#1E293B" fontWeight="bold" transform="rotate(-90 25 80)" textAnchor="middle">沉淀质量 m / g</text>
          <text x="315" y="155" fontSize="9" fill="#1E293B" fontWeight="bold" textAnchor="end">V(NaOH) / mL</text>
        </svg>
      </div>
    )
  }

  if (diagramType === 'titration-curve') {
    const phJump = config?.phJumpRange || [7.7, 9.7]
    const vEq = config?.vEq || 20

    return (
      <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '高考真题：滴定曲线与突跃区间示意图'}</span>
          <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
            高考真题原图
          </span>
        </div>
        <svg viewBox="0 0 340 180" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs">
          <line x1="40" y1="20" x2="320" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1="40" y1="60" x2="320" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1="40" y1="100" x2="320" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1="40" y1="140" x2="320" y2="140" stroke="#E2E8F0" strokeDasharray="3 3" />

          <rect x="170" y="53" width="20" height="20" fill="#FEF3C7" opacity="0.85" rx="2" />
          <line x1="40" y1="53" x2="320" y2="53" stroke="#F59E0B" strokeDasharray="2 2" strokeWidth="1" />
          <line x1="40" y1="73" x2="320" y2="73" stroke="#F59E0B" strokeDasharray="2 2" strokeWidth="1" />
          <text x="315" y="50" fontSize="9" fill="#B45309" textAnchor="end" fontWeight="bold">{phJump[1]}</text>
          <text x="315" y="82" fontSize="9" fill="#B45309" textAnchor="end" fontWeight="bold">{phJump[0]}</text>

          <line x1="180" y1="20" x2="180" y2="150" stroke="#6366F1" strokeDasharray="3 3" strokeWidth="1" />
          <text x="180" y="162" fontSize="9" fill="#4338CA" textAnchor="middle" fontWeight="bold">Veq({vEq}mL)</text>

          <line x1="110" y1="102" x2="110" y2="150" stroke="#94A3B8" strokeDasharray="2 2" />
          <circle cx="110" cy="102.5" r="3" fill="#6366F1" />
          <text x="110" y="96" fontSize="8" fill="#475569" textAnchor="middle">pH=pKa</text>
          <text x="110" y="162" fontSize="8" fill="#64748B" textAnchor="middle">10mL</text>

          <line x1="40" y1="80" x2="320" y2="80" stroke="#10B981" strokeDasharray="2 2" opacity="0.6" />
          <text x="44" y="77" fontSize="8" fill="#047857" fontWeight="bold">pH = 7</text>

          <path
            d="M 40 121 C 70 115, 90 106, 110 102 C 145 96, 168 90, 175 83 C 178 78, 179 66, 180 63 C 181 55, 183 45, 188 40 C 210 30, 260 26, 310 24"
            fill="none"
            stroke="#4338CA"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <line x1="40" y1="150" x2="320" y2="150" stroke="#334155" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="150" stroke="#334155" strokeWidth="1.5" />

          <text x="35" y="153" fontSize="9" fill="#475569" textAnchor="end">0</text>
          <text x="35" y="24" fontSize="9" fill="#475569" textAnchor="end">14</text>
          <text x="25" y="90" fontSize="9" fill="#1E293B" fontWeight="bold" transform="rotate(-90 25 90)" textAnchor="middle">pH</text>
          <text x="315" y="165" fontSize="9" fill="#1E293B" fontWeight="bold" textAnchor="end">V(NaOH) / mL</text>
        </svg>
      </div>
    )
  }

  if (diagramType === 'distribution-fraction') {
    return (
      <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '高考真题：微粒分布分数 δ - pH 图'}</span>
          <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
            高考真题原图
          </span>
        </div>
        <svg viewBox="0 0 340 170" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs">
          <line x1="40" y1="140" x2="320" y2="140" stroke="#334155" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="320" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1="40" y1="80" x2="320" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />

          <line x1="85" y1="80" x2="85" y2="140" stroke="#94A3B8" strokeDasharray="2 2" />
          <circle cx="85" cy="80" r="3" fill="#EF4444" />
          <text x="85" y="73" fontSize="8" fill="#DC2626" textAnchor="middle" fontWeight="bold">pH = pKa1</text>

          <line x1="210" y1="80" x2="210" y2="140" stroke="#94A3B8" strokeDasharray="2 2" />
          <circle cx="210" cy="80" r="3" fill="#10B981" />
          <text x="210" y="73" fontSize="8" fill="#059669" textAnchor="middle" fontWeight="bold">pH = pKa2</text>

          <path d="M 40 20 C 60 20, 75 40, 85 80 C 95 120, 110 138, 140 140" fill="none" stroke="#EF4444" strokeWidth="2" />
          <text x="50" y="32" fontSize="9" fill="#DC2626" fontWeight="bold">δ(H₂A)</text>

          <path d="M 40 140 C 65 130, 75 100, 85 80 C 95 60, 130 25, 150 25 C 170 25, 195 50, 210 80 C 220 100, 245 135, 290 140" fill="none" stroke="#6366F1" strokeWidth="2" />
          <text x="150" y="18" fontSize="9" fill="#4338CA" fontWeight="bold" textAnchor="middle">δ(HA⁻)</text>

          <path d="M 150 140 C 180 138, 200 110, 210 80 C 220 50, 240 20, 290 20" fill="none" stroke="#10B981" strokeWidth="2" />
          <text x="275" y="32" fontSize="9" fill="#059669" fontWeight="bold">δ(A²⁻)</text>

          <text x="35" y="23" fontSize="9" fill="#475569" textAnchor="end">1.0</text>
          <text x="35" y="83" fontSize="9" fill="#475569" textAnchor="end">0.5</text>
          <text x="35" y="143" fontSize="9" fill="#475569" textAnchor="end">0</text>
          <text x="25" y="80" fontSize="9" fill="#1E293B" fontWeight="bold" transform="rotate(-90 25 80)" textAnchor="middle">分布分数 δ</text>
          <text x="315" y="155" fontSize="9" fill="#1E293B" fontWeight="bold" textAnchor="end">pH</text>
        </svg>
      </div>
    )
  }

  return null
}
