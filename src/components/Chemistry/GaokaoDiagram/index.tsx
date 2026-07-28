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
 * GaokaoDiagram — 高考化学真题插图矢量/图形渲染组件库
 *
 * 支持 5 大类化学高精矢量插图与静态图：
 * 1. titration-curve: 滴定突跃曲线图
 * 2. distribution-fraction: 微粒分布分数 δ - pH 图
 * 3. precipitation-curve: 沉淀质量 m - V 折线图
 * 4. valence-matrix-chart: 无机元素价类二维坐标阵列图
 * 5. organic-mechanism-diagram: 有机官能团断键机制图
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
      <div className={`my-2.5 p-3 bg-rose-50/40 border border-rose-100 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '有机反应官能团断键机制示意图'}</span>
          <span className="text-[10px] text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded font-mono">
            断键与产物定向 (Mechanism Cut)
          </span>
        </div>
        <svg viewBox="0 0 340 140" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs">
          {mechType === 'ester-cleavage' && (
            <g>
              <text x="50" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">CH₃-C(=O)</text>
              <text x="175" y="65" fontSize="13" fill="#E11D48" fontWeight="bold" fontFamily="monospace">O-CH₂CH₃</text>
              <line x1="160" y1="30" x2="160" y2="100" stroke="#F43F5E" strokeDasharray="3 3" strokeWidth="2" />
              <text x="160" y="24" fontSize="9" fill="#E11D48" textAnchor="middle" fontWeight="bold">✂ C-O单键切口</text>
              <path d="M 160 110 L 125 82" stroke="#0284C7" strokeWidth="1.5" />
              <polygon points="125,82 133,85 128,93" fill="#0284C7" />
              <text x="110" y="105" fontSize="9" fill="#0369A1" fontWeight="bold">+ -¹⁸OH (加至酰基)</text>
              <path d="M 160 110 L 195 82" stroke="#059669" strokeWidth="1.5" />
              <polygon points="195,82 192,93 187,85" fill="#059669" />
              <text x="210" y="105" fontSize="9" fill="#047857" fontWeight="bold">+ -H (加至烷氧基)</text>
            </g>
          )}

          {mechType === 'addition-markov' && (
            <g>
              <text x="60" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">CH₃-CH = CH₂</text>
              <line x1="165" y1="40" x2="165" y2="90" stroke="#F43F5E" strokeDasharray="3 3" strokeWidth="2" />
              <text x="165" y="32" fontSize="9" fill="#E11D48" textAnchor="middle" fontWeight="bold">✂ C=C π键断裂</text>
              <path d="M 125 110 L 130 80" stroke="#2563EB" strokeWidth="1.5" />
              <polygon points="130,80 126,88 134,88" fill="#2563EB" />
              <text x="110" y="125" fontSize="9" fill="#1D4ED8" textAnchor="middle" fontWeight="bold">Br⁻ (加至2号碳/较多取代)</text>
              <path d="M 200 110 L 195 80" stroke="#D97706" strokeWidth="1.5" />
              <polygon points="195,80 191,88 199,88" fill="#D97706" />
              <text x="210" y="125" fontSize="9" fill="#B45309" textAnchor="middle" fontWeight="bold">H⁺ (加至1号碳/含H多)</text>
            </g>
          )}

          {mechType === 'alcohol-oxidation' && (
            <g>
              <text x="70" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">R-CH(H)-O-H</text>
              <circle cx="123" cy="60" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeDasharray="2 2" />
              <text x="123" y="38" fontSize="9" fill="#B45309" textAnchor="middle" fontWeight="bold">α-H 存在</text>
              <line x1="123" y1="60" x2="180" y2="60" stroke="#E11D48" strokeDasharray="2 2" strokeWidth="1.5" />
              <text x="230" y="65" fontSize="11" fill="#059669" fontWeight="bold">Cu/O₂, Δ ──➔ R-CHO + H₂O</text>
              <text x="230" y="85" fontSize="9" fill="#64748B">脱除 2 个 H 形成 C=O 双键</text>
            </g>
          )}

          {mechType === 'haloalkane-elimination' && (
            <g>
              <text x="60" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">CH₃-CH(H)-CH(Br)-CH₃</text>
              <line x1="140" y1="35" x2="140" y2="95" stroke="#F43F5E" strokeDasharray="3 3" strokeWidth="1.5" />
              <line x1="200" y1="35" x2="200" y2="95" stroke="#F43F5E" strokeDasharray="3 3" strokeWidth="1.5" />
              <text x="170" y="26" fontSize="9" fill="#E11D48" textAnchor="middle" fontWeight="bold">✂ 脱去 HBr (扎伊采夫规则)</text>
              <text x="170" y="118" fontSize="10" fill="#2563EB" textAnchor="middle" fontWeight="bold">主产物: CH₃-CH=CH-CH₃ (2-丁烯)</text>
            </g>
          )}

          {mechType === 'peptide-hydrolysis' && (
            <g>
              <text x="50" y="65" fontSize="13" fill="#1E293B" fontWeight="bold" fontFamily="monospace">~R₁-C(=O)</text>
              <text x="175" y="65" fontSize="13" fill="#4338CA" fontWeight="bold" fontFamily="monospace">NH-R₂~</text>
              <line x1="160" y1="30" x2="160" y2="100" stroke="#F43F5E" strokeDasharray="3 3" strokeWidth="2" />
              <text x="160" y="24" fontSize="9" fill="#E11D48" textAnchor="middle" fontWeight="bold">✂ 肽键 C-N 单键切口</text>
              <text x="160" y="120" fontSize="10" fill="#4338CA" textAnchor="middle" fontWeight="bold">+ H₂O (稀盐酸中完全水解为氨基酸盐酸盐)</text>
            </g>
          )}

          {mechType === 'phenol-condensation' && (
            <g>
              <text x="50" y="65" fontSize="12" fill="#1E293B" fontWeight="bold">苯酚 (邻对位 C-H 活化)</text>
              <text x="190" y="65" fontSize="12" fill="#2563EB" fontWeight="bold">+ HCHO (甲醛)</text>
              <text x="150" y="105" fontSize="10" fill="#059669" textAnchor="middle" fontWeight="bold">➔ 邻羟甲基苯酚 ──➔ 线型 / 体型酚醛树脂</text>
            </g>
          )}
        </svg>
      </div>
    )
  }

  if (diagramType === 'valence-matrix-chart') {
    return (
      <div className={`my-2.5 p-3 bg-purple-50/40 border border-purple-100 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '无机元素价类二维坐标映射阵列图'}</span>
          <span className="text-[10px] text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-mono">
            价态-类别 (Valence-Category)
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
          <text x="32" y="85" fontSize="8" fill="#1E293B" fontWeight="bold" transform="rotate(-90 32 85)" textAnchor="middle">化合价 (Valence)</text>

          <text x="90" y="163" fontSize="8" fill="#475569" textAnchor="middle">氢化物</text>
          <text x="150" y="163" fontSize="8" fill="#475569" textAnchor="middle">单质</text>
          <text x="210" y="163" fontSize="8" fill="#475569" textAnchor="middle">氧化物</text>
          <text x="275" y="163" fontSize="8" fill="#475569" textAnchor="middle">酸 / 盐</text>

          <path d="M 98 120 L 142 98" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="2 2" />
          <polygon points="142,98 134,95 137,103" fill="#8B5CF6" />

          <path d="M 202 70 L 158 92" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="2 2" />
          <polygon points="158,92 163,85 166,93" fill="#8B5CF6" />

          <circle cx="90" cy="125" r="14" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="90" y="128" fontSize="8" fill="#6D28D9" textAnchor="middle" fontWeight="bold">H₂S</text>

          <circle cx="150" cy="95" r="15" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          <text x="150" y="98" fontSize="9" fill="#B45309" textAnchor="middle" fontWeight="bold">S (单质)</text>

          <circle cx="210" cy="65" r="14" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <text x="210" y="68" fontSize="8" fill="#0369A1" textAnchor="middle" fontWeight="bold">SO₂</text>

          <circle cx="275" cy="35" r="14" fill="#DCFCE7" stroke="#10B981" strokeWidth="1.5" />
          <text x="275" y="38" fontSize="8" fill="#047857" textAnchor="middle" fontWeight="bold">H₂SO₄</text>

          <rect x="180" y="105" width="130" height="20" fill="#F3E8FF" rx="4" stroke="#D8B4FE" />
          <text x="245" y="118" fontSize="8" fill="#7E22CE" textAnchor="middle" fontWeight="bold">归中: 2H₂S + SO₂ = 3S↓ + 2H₂O</text>
        </svg>
      </div>
    )
  }

  if (diagramType === 'precipitation-curve') {
    return (
      <div className={`my-2.5 p-3 bg-blue-50/40 border border-blue-100 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '两性金属离子滴定 m(沉淀) - V(NaOH) 关系图'}</span>
          <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-mono">
            Al³⁺/Mg²⁺ 沉淀与两性溶解
          </span>
        </div>
        <svg viewBox="0 0 340 170" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs">
          <line x1="40" y1="140" x2="320" y2="140" stroke="#334155" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" strokeWidth="1.5" />
          <line x1="40" y1="40" x2="320" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1="40" y1="90" x2="320" y2="90" stroke="#E2E8F0" strokeDasharray="3 3" />

          <line x1="200" y1="40" x2="200" y2="140" stroke="#6366F1" strokeDasharray="2 2" />
          <circle cx="200" cy="40" r="3.5" fill="#4338CA" />
          <text x="200" y="32" fontSize="8" fill="#4338CA" textAnchor="middle" fontWeight="bold">最大沉淀(Al+Mg)</text>
          <text x="200" y="152" fontSize="8" fill="#64748B" textAnchor="middle">V1 (最大点)</text>

          <line x1="250" y1="90" x2="250" y2="140" stroke="#059669" strokeDasharray="2 2" />
          <circle cx="250" cy="90" r="3.5" fill="#10B981" />
          <text x="250" y="83" fontSize="8" fill="#047857" textAnchor="middle" fontWeight="bold">Al(OH)₃完全溶解</text>
          <text x="250" y="152" fontSize="8" fill="#64748B" textAnchor="middle">V2 (完全溶解)</text>

          <line x1="40" y1="90" x2="250" y2="90" stroke="#10B981" strokeDasharray="2 2" opacity="0.4" />
          <text x="280" y="82" fontSize="8" fill="#059669" fontWeight="bold">Mg(OH)₂沉淀不溶</text>

          <polyline
            points="40,140 200,40 250,90 310,90"
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="35" y="143" fontSize="9" fill="#475569" textAnchor="end">0</text>
          <text x="35" y="93" fontSize="9" fill="#475569" textAnchor="end">m(Mg)</text>
          <text x="35" y="43" fontSize="9" fill="#475569" textAnchor="end">m(Max)</text>
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
      <div className={`my-2.5 p-3 bg-indigo-50/40 border border-indigo-100 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '滴定曲线与突跃区间示意图'}</span>
          <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-mono">
            突跃区间: pH {phJump[0]} ~ {phJump[1]}
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
          <text x="315" y="50" fontSize="9" fill="#B45309" textAnchor="end" fontWeight="bold">9.7</text>
          <text x="315" y="82" fontSize="9" fill="#B45309" textAnchor="end" fontWeight="bold">7.7</text>

          <line x1="180" y1="20" x2="180" y2="150" stroke="#6366F1" strokeDasharray="3 3" strokeWidth="1" />
          <text x="180" y="162" fontSize="9" fill="#4338CA" textAnchor="middle" fontWeight="bold">Veq({vEq}mL)</text>

          <line x1="110" y1="102" x2="110" y2="150" stroke="#94A3B8" strokeDasharray="2 2" />
          <circle cx="110" cy="102.5" r="3" fill="#6366F1" />
          <text x="110" y="96" fontSize="8" fill="#475569" textAnchor="middle">pH=pKa(4.75)</text>
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
          <text x="35" y="105" fontSize="9" fill="#475569" textAnchor="end">4.75</text>
          <text x="35" y="24" fontSize="9" fill="#475569" textAnchor="end">14</text>
          <text x="25" y="90" fontSize="9" fill="#1E293B" fontWeight="bold" transform="rotate(-90 25 90)" textAnchor="middle">pH</text>
          <text x="315" y="165" fontSize="9" fill="#1E293B" fontWeight="bold" textAnchor="end">V(NaOH) / mL</text>
        </svg>
      </div>
    )
  }

  if (diagramType === 'distribution-fraction') {
    return (
      <div className={`my-2.5 p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{config?.title || '二元弱酸 H₂A 分布分数 δ - pH 图'}</span>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
            pKa1={config?.pKa1 || 1.85}, pKa2={config?.pKa2 || 7.19}
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
          <text x="85" y="152" fontSize="8" fill="#64748B" textAnchor="middle">1.85</text>

          <line x1="210" y1="80" x2="210" y2="140" stroke="#94A3B8" strokeDasharray="2 2" />
          <circle cx="210" cy="80" r="3" fill="#10B981" />
          <text x="210" y="73" fontSize="8" fill="#059669" textAnchor="middle" fontWeight="bold">pH = pKa2</text>
          <text x="210" y="152" fontSize="8" fill="#64748B" textAnchor="middle">7.19</text>

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
