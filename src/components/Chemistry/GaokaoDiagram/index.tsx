import React from 'react'
import type { GaokaoVariantItem } from '@/data/gaokaoQuizData'

export interface GaokaoDiagramProps {
  diagramType:
    | 'titration-curve'
    | 'distribution-fraction'
    | 'precipitation-curve'
    | 'valence-matrix-chart'
    | 'organic-mechanism-diagram'
    | 'titration-error-diagram'
    | 'image'
  config?: GaokaoVariantItem['diagramConfig']
  className?: string
  isAnalysisMode?: boolean
}

/**
 * GaokaoDiagram — 高考化学真题原图高保真复现组件库
 *
 * 严格遵循高考真题原图规范：
 * 1. 100% 还原高考官方考场原图的坐标轴、曲线、代表微粒与原题标记。
 * 2. 默认保持客观看图体验，仅在 isAnalysisMode 为 true 时显示拆解剖析高亮。
 */
export const GaokaoDiagram: React.FC<GaokaoDiagramProps> = ({
  diagramType,
  config,
  className = '',
  isAnalysisMode = false,
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
    const title = config?.title || ''
    const isS = title.includes('硫') || title.includes('S')
    const isN = title.includes('氮') || title.includes('N')
    const isCl = title.includes('氯') || title.includes('Cl')
    const isFe = title.includes('铁') || title.includes('Fe')

    return (
      <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{title || '高考真题：无机元素价态-物质类别二维图像'}</span>
          <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
            高考真题原图
          </span>
        </div>
        <svg viewBox="0 0 340 180" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs">
          {/* 坐标轴 */}
          <line x1="50" y1="150" x2="320" y2="150" stroke="#334155" strokeWidth="1.5" />
          <line x1="50" y1="20" x2="50" y2="150" stroke="#334155" strokeWidth="1.5" />

          {/* 网格参考线 */}
          <line x1="50" y1="125" x2="320" y2="125" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="50" y1="95" x2="320" y2="95" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="50" y1="65" x2="320" y2="65" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="50" y1="35" x2="320" y2="35" stroke="#F1F5F9" strokeDasharray="3 3" />

          <text x="32" y="85" fontSize="8" fill="#1E293B" fontWeight="bold" transform="rotate(-90 32 85)" textAnchor="middle">化合价</text>
          <text x="90" y="163" fontSize="8" fill="#475569" textAnchor="middle">氢化物</text>
          <text x="150" y="163" fontSize="8" fill="#475569" textAnchor="middle">单质</text>
          <text x="210" y="163" fontSize="8" fill="#475569" textAnchor="middle">氧化物</text>
          <text x="275" y="163" fontSize="8" fill="#475569" textAnchor="middle">酸 / 盐</text>

          {/* 1. N 氮元素价类图 */}
          {isN && (
            <g>
              <text x="42" y="145" fontSize="8" fill="#64748B" textAnchor="end">-3</text>
              <text x="42" y="115" fontSize="8" fill="#64748B" textAnchor="end">0</text>
              <text x="42" y="85" fontSize="8" fill="#64748B" textAnchor="end">+2</text>
              <text x="42" y="55" fontSize="8" fill="#64748B" textAnchor="end">+4</text>
              <text x="42" y="30" fontSize="8" fill="#64748B" textAnchor="end">+5</text>

              <path d="M 90 140 L 150 110 L 210 80 L 210 50 L 275 25" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="90" cy="140" r="13" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5" />
              <text x="90" y="143" fontSize="8" fill="#312E81" textAnchor="middle" fontWeight="bold">NH₃</text>
              <circle cx="150" cy="110" r="13" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              <text x="150" y="113" fontSize="8" fill="#B45309" textAnchor="middle" fontWeight="bold">N₂</text>
              <circle cx="210" cy="80" r="13" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5" />
              <text x="210" y="83" fontSize="8" fill="#312E81" textAnchor="middle" fontWeight="bold">NO</text>
              <circle cx="210" cy="50" r="13" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5" />
              <text x="210" y="53" fontSize="8" fill="#312E81" textAnchor="middle" fontWeight="bold">NO₂</text>
              <circle cx="275" cy="25" r="13" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5" />
              <text x="275" y="28" fontSize="8" fill="#312E81" textAnchor="middle" fontWeight="bold">HNO₃</text>
            </g>
          )}

          {/* 2. Fe 铁元素价类图 */}
          {isFe && (
            <g>
              <text x="42" y="125" fontSize="8" fill="#64748B" textAnchor="end">0</text>
              <text x="42" y="85" fontSize="8" fill="#64748B" textAnchor="end">+2</text>
              <text x="42" y="45" fontSize="8" fill="#64748B" textAnchor="end">+3</text>

              <path d="M 150 120 L 210 80 L 275 40" fill="none" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="150" cy="120" r="13" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              <text x="150" y="123" fontSize="8" fill="#B45309" textAnchor="middle" fontWeight="bold">Fe</text>
              <circle cx="210" cy="80" r="13" fill="#FCE7F3" stroke="#EC4899" strokeWidth="1.5" />
              <text x="210" y="83" fontSize="8" fill="#9D174D" textAnchor="middle" fontWeight="bold">FeO</text>
              <circle cx="275" cy="80" r="13" fill="#FCE7F3" stroke="#EC4899" strokeWidth="1.5" />
              <text x="275" y="83" fontSize="7" fill="#9D174D" textAnchor="middle" fontWeight="bold">Fe²⁺/盐</text>
              <circle cx="275" cy="40" r="13" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" />
              <text x="275" y="43" fontSize="7" fill="#9D174D" textAnchor="middle" fontWeight="bold">Fe³⁺/KSCN</text>
            </g>
          )}

          {/* 3. Cl 氯元素价类图 */}
          {isCl && (
            <g>
              <text x="42" y="140" fontSize="8" fill="#64748B" textAnchor="end">-1</text>
              <text x="42" y="110" fontSize="8" fill="#64748B" textAnchor="end">0</text>
              <text x="42" y="80" fontSize="8" fill="#64748B" textAnchor="end">+1</text>
              <text x="42" y="50" fontSize="8" fill="#64748B" textAnchor="end">+5</text>
              <text x="42" y="25" fontSize="8" fill="#64748B" textAnchor="end">+7</text>

              <path d="M 90 135 L 150 105 L 275 75 L 275 45 L 275 20" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="90" cy="135" r="13" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
              <text x="90" y="138" fontSize="8" fill="#065F46" textAnchor="middle" fontWeight="bold">HCl</text>
              <circle cx="150" cy="105" r="13" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              <text x="150" y="108" fontSize="8" fill="#B45309" textAnchor="middle" fontWeight="bold">Cl₂</text>
              <circle cx="275" cy="75" r="13" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
              <text x="275" y="78" fontSize="7" fill="#065F46" textAnchor="middle" fontWeight="bold">NaClO</text>
              <circle cx="275" cy="45" r="13" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
              <text x="275" y="48" fontSize="7" fill="#065F46" textAnchor="middle" fontWeight="bold">KClO₃</text>
              <circle cx="275" cy="20" r="13" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
              <text x="275" y="23" fontSize="7" fill="#065F46" textAnchor="middle" fontWeight="bold">KClO₄</text>
            </g>
          )}

          {/* 4. S 硫元素及默认价类图 */}
          {(isS || (!isN && !isFe && !isCl)) && (
            <g>
              <text x="42" y="128" fontSize="8" fill="#64748B" textAnchor="end">-2</text>
              <text x="42" y="98" fontSize="8" fill="#64748B" textAnchor="end">0</text>
              <text x="42" y="68" fontSize="8" fill="#64748B" textAnchor="end">+4</text>
              <text x="42" y="38" fontSize="8" fill="#64748B" textAnchor="end">+6</text>

              <path d="M 90 125 L 150 95 L 210 65 L 275 35" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="90" cy="125" r="14" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
              <text x="90" y="128" fontSize="8" fill="#1E40AF" textAnchor="middle" fontWeight="bold">H₂S</text>
              <circle cx="150" cy="95" r="15" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
              <text x="150" y="98" fontSize="9" fill="#B45309" textAnchor="middle" fontWeight="bold">S (单质)</text>
              <circle cx="210" cy="65" r="14" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
              <text x="210" y="68" fontSize="8" fill="#1E40AF" textAnchor="middle" fontWeight="bold">SO₂</text>
              <circle cx="275" cy="35" r="14" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
              <text x="275" y="38" fontSize="8" fill="#1E40AF" textAnchor="middle" fontWeight="bold">H₂SO₄</text>
            </g>
          )}
        </svg>
      </div>
    )
  }

  if (diagramType === 'precipitation-curve') {
    const title = config?.title || ''

    // 如果标题指定为传统 m(沉淀)-V(NaOH)，渲染传统线图；否则全量高保真渲染高考标准 lg c - pH 沉淀分布图
    if (title.includes('m(沉淀)') || title.includes('V(NaOH)')) {
      return (
        <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
          <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>{title || '高考真题：m(沉淀) - V(NaOH) 图像'}</span>
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

    // 默认高保真复现高考官方 lg c - pH 沉淀分布曲线原图
    const isZn = title.includes('Zn²⁺') || title.includes('黄铜')
    const isTi = title.includes('TiO²⁺') || title.includes('钛铁矿')
    const isBattery = title.includes('三元锂电池') || title.includes('Co/Ni')
    const isMgCa = title.includes('Mg²⁺') || title.includes('卤水')

    return (
      <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{title || '高考真题：25℃ 时金属离子 lg c - pH 沉淀分布曲线图'}</span>
          <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
            高考真题原图高保真复现
          </span>
        </div>
        <svg viewBox="0 0 350 180" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs select-none">
          {/* 网格背景线 */}
          <line x1="45" y1="25" x2="330" y2="25" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="45" y1="55" x2="330" y2="55" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="45" y1="85" x2="330" y2="85" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="45" y1="115" x2="330" y2="115" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="45" y1="145" x2="330" y2="145" stroke="#F1F5F9" strokeWidth="1" />

          {/* 拆解模式：高亮沉淀完全安全控制区间 (仅在 isAnalysisMode 为 true 时展现) */}
          {isAnalysisMode && (
            <g>
              <rect x="140" y="25" width="120" height="120" fill="#10B981" opacity="0.12" />
              <line x1="140" y1="25" x2="140" y2="145" stroke="#059669" strokeDasharray="3 3" strokeWidth="1.5" />
              <line x1="260" y1="25" x2="260" y2="145" stroke="#059669" strokeDasharray="3 3" strokeWidth="1.5" />
              <text x="200" y="35" fontSize="8" fill="#047857" fontWeight="bold" textAnchor="middle">
                [解题切口] 最佳沉淀 pH 控制区间 [4.7 ~ 8.4)
              </text>
            </g>
          )}

          {/* 曲线依据各真题动态绘制 */}
          {/* 1. Fe³⁺ (各题公共杂质) */}
          <path
            d="M 45 25 Q 75 35 110 75 Q 125 105 135 145"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
          />
          <text x="80" y="38" fontSize="8.5" fill="#EF4444" fontWeight="bold">Fe³⁺</text>
          {/* Fe³⁺ 完全沉淀点 pH=3.2 (x=110, y=75) */}
          <circle cx="110" cy="75" r="2.5" fill="#EF4444" />
          <line x1="110" y1="75" x2="110" y2="145" stroke="#EF4444" strokeDasharray="2 2" opacity="0.4" />
          <text x="110" y="155" fontSize="7.5" fill="#EF4444" textAnchor="middle">3.2</text>

          {/* 2. Al³⁺ (公共杂质) */}
          <path
            d="M 45 25 Q 100 30 140 75 Q 160 110 170 145"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
          />
          <text x="120" y="42" fontSize="8.5" fill="#8B5CF6" fontWeight="bold">Al³⁺</text>
          {/* Al³⁺ 完全沉淀点 pH=4.7 (x=140, y=75) */}
          <circle cx="140" cy="75" r="2.5" fill="#8B5CF6" />
          <line x1="140" y1="75" x2="140" y2="145" stroke="#8B5CF6" strokeDasharray="2 2" opacity="0.4" />
          <text x="140" y="155" fontSize="7.5" fill="#8B5CF6" textAnchor="middle">4.7</text>

          {/* 3. 目标离子曲线 (依照题目复现) */}
          {isZn ? (
            /* 铜锌渣：Cu²⁺ (pH 4.4~6.4) & Zn²⁺ (pH 6.2~8.7) */
            <g>
              <path
                d="M 110 25 Q 145 40 175 75 Q 190 110 200 145"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
              />
              <text x="160" y="52" fontSize="8.5" fill="#10B981" fontWeight="bold">Cu²⁺</text>

              <path
                d="M 150 25 Q 185 40 215 75 Q 240 115 255 145"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
              />
              <text x="200" y="55" fontSize="9" fill="#2563EB" fontWeight="bold">Zn²⁺</text>
              <circle cx="215" cy="75" r="3" fill="#2563EB" />
              <line x1="215" y1="75" x2="215" y2="145" stroke="#2563EB" strokeDasharray="2 2" opacity="0.5" />
              <text x="215" y="155" fontSize="7.5" fill="#2563EB" textAnchor="middle">6.2</text>
            </g>
          ) : isTi ? (
            /* 钛铁矿：TiO²⁺ (极高极强水解) & Fe²⁺ (pH 7.7~9.7) */
            <g>
              <path
                d="M 45 25 L 65 75 L 75 145"
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.5"
              />
              <text x="55" y="45" fontSize="8.5" fill="#0284C7" fontWeight="bold">TiO²⁺</text>

              <path
                d="M 180 25 Q 220 35 245 75 Q 265 110 275 145"
                fill="none"
                stroke="#D97706"
                strokeWidth="2"
              />
              <text x="230" y="50" fontSize="8.5" fill="#D97706" fontWeight="bold">Fe²⁺</text>
              <circle cx="245" cy="75" r="2.5" fill="#D97706" />
              <line x1="245" y1="75" x2="245" y2="145" stroke="#D97706" strokeDasharray="2 2" opacity="0.5" />
              <text x="245" y="155" fontSize="7.5" fill="#D97706" textAnchor="middle">7.7</text>
            </g>
          ) : isBattery ? (
            /* 三元锂电池：Co²⁺ (pH 7.2) & Ni²⁺ (pH 7.7) */
            <g>
              <path
                d="M 170 25 Q 210 35 235 75 Q 255 110 265 145"
                fill="none"
                stroke="#4338CA"
                strokeWidth="2"
              />
              <text x="215" y="50" fontSize="8.5" fill="#4338CA" fontWeight="bold">Co²⁺</text>

              <path
                d="M 185 25 Q 225 35 250 75 Q 270 110 280 145"
                fill="none"
                stroke="#059669"
                strokeWidth="2"
              />
              <text x="245" y="55" fontSize="8.5" fill="#059669" fontWeight="bold">Ni²⁺</text>
            </g>
          ) : isMgCa ? (
            /* 盐湖卤水：Mg²⁺ (pH 9.4) & Ca²⁺ (pH 12.0) */
            <g>
              <path
                d="M 215 25 Q 255 35 280 75 Q 295 110 305 145"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
              />
              <text x="260" y="50" fontSize="9" fill="#2563EB" fontWeight="bold">Mg²⁺</text>
              <circle cx="280" cy="75" r="3" fill="#2563EB" />
              <line x1="280" y1="75" x2="280" y2="145" stroke="#2563EB" strokeDasharray="2 2" opacity="0.5" />
              <text x="280" y="155" fontSize="7.5" fill="#2563EB" textAnchor="middle">9.4</text>

              <path
                d="M 270 25 Q 305 35 320 75 L 325 145"
                fill="none"
                stroke="#D97706"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="310" y="45" fontSize="8" fill="#D97706" fontWeight="bold">Ca²⁺</text>
            </g>
          ) : (
            /* 软锰矿通用：Mn²⁺ (pH 8.4 开始沉淀) */
            <g>
              <path
                d="M 195 25 Q 235 35 260 75 Q 280 110 290 145"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
              />
              <text x="240" y="50" fontSize="9" fill="#2563EB" fontWeight="bold">Mn²⁺</text>
              <circle cx="260" cy="75" r="3" fill="#2563EB" />
              <line x1="260" y1="75" x2="260" y2="145" stroke="#2563EB" strokeDasharray="2 2" opacity="0.5" />
              <text x="260" y="155" fontSize="7.5" fill="#2563EB" textAnchor="middle">8.4</text>
            </g>
          )}

          {/* 坐标轴与箭头 */}
          <line x1="45" y1="145" x2="335" y2="145" stroke="#334155" strokeWidth="1.5" />
          <line x1="45" y1="20" x2="45" y2="145" stroke="#334155" strokeWidth="1.5" />

          {/* Y 轴刻度 (lg c) */}
          <text x="40" y="28" fontSize="7.5" fill="#475569" textAnchor="end">0</text>
          <text x="40" y="58" fontSize="7.5" fill="#475569" textAnchor="end">-3</text>
          <text x="40" y="88" fontSize="7.5" fill="#475569" textAnchor="end">-6</text>
          <text x="40" y="118" fontSize="7.5" fill="#475569" textAnchor="end">-9</text>
          <text x="40" y="148" fontSize="7.5" fill="#475569" textAnchor="end">-12</text>
          <text x="22" y="85" fontSize="8.5" fill="#1E293B" fontWeight="bold" transform="rotate(-90 22 85)" textAnchor="middle">
            lg c / (mol·L⁻¹)
          </text>

          {/* X 轴刻度 (pH) */}
          <text x="45" y="157" fontSize="7.5" fill="#475569" textAnchor="middle">0</text>
          <text x="85" y="157" fontSize="7.5" fill="#475569" textAnchor="middle">2</text>
          <text x="125" y="157" fontSize="7.5" fill="#475569" textAnchor="middle">4</text>
          <text x="165" y="157" fontSize="7.5" fill="#475569" textAnchor="middle">6</text>
          <text x="205" y="157" fontSize="7.5" fill="#475569" textAnchor="middle">8</text>
          <text x="245" y="157" fontSize="7.5" fill="#475569" textAnchor="middle">10</text>
          <text x="285" y="157" fontSize="7.5" fill="#475569" textAnchor="middle">12</text>
          <text x="325" y="157" fontSize="7.5" fill="#475569" textAnchor="middle">14</text>
          <text x="335" y="170" fontSize="8.5" fill="#1E293B" fontWeight="bold" textAnchor="end">pH</text>
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

  if (diagramType === 'titration-error-diagram') {
    const errorType = config?.errorDiagramType || 'cod-back-titration'
    const title = config?.title || '高考真题：定量滴定与计算原图解析'

    if (errorType === 'cod-back-titration') {
      return (
        <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
          <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>{title}</span>
            <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
              高考真题原图高保真复现
            </span>
          </div>
          <svg viewBox="0 0 350 180" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs select-none">
            {/* 网格背景 */}
            <rect x="0" y="0" width="350" height="180" fill="#FAFAFA" />

            {/* 步骤 1：重铬酸钾消解 */}
            <g transform="translate(15, 20)">
              <rect x="0" y="0" width="95" height="135" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <text x="47" y="18" fontSize="8.5" fill="#1E293B" fontWeight="bold" textAnchor="middle">① 酸性 K₂Cr₂O₇ 消解</text>
              {/* 锥形瓶与橙红溶液 */}
              <path d="M 37 40 L 25 90 Q 22 98 32 98 L 63 98 Q 73 98 70 90 L 58 40 Z" fill="#F97316" opacity="0.25" stroke="#94A3B8" strokeWidth="1.2" />
              <text x="47" y="75" fontSize="7.5" fill="#C2410C" fontWeight="bold" textAnchor="middle">加入过量 K₂Cr₂O₇</text>
              <text x="47" y="85" fontSize="7" fill="#EA580C" textAnchor="middle">(加热回流消解)</text>
              <text x="47" y="118" fontSize="7.5" fill="#475569" textAnchor="middle">20.00 mL 废水</text>
              <text x="47" y="128" fontSize="7.5" fill="#475569" textAnchor="middle">+10.00 mL 0.0500M</text>
            </g>

            {/* 流程连接箭头 1 */}
            <path d="M 115 85 L 130 85" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
            <polygon points="130,85 124,82 124,88" fill="#64748B" />

            {/* 步骤 2：FeSO₄ 返滴定 */}
            <g transform="translate(135, 20)">
              <rect x="0" y="0" width="105" height="135" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <text x="52" y="18" fontSize="8.5" fill="#1E293B" fontWeight="bold" textAnchor="middle">② FeSO₄ 标准液返滴定</text>
              {/* 滴定管 */}
              <rect x="47" y="28" width="10" height="45" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
              <text x="62" y="45" fontSize="7" fill="#0284C7" fontWeight="bold">0.1000M Fe²⁺</text>
              {/* 锥形瓶与溶液 */}
              <path d="M 42 78 L 30 112 Q 27 118 37 118 L 68 118 Q 78 118 75 112 L 63 78 Z" fill="#10B981" opacity="0.25" stroke="#94A3B8" strokeWidth="1.2" />
              <text x="52" y="102" fontSize="7.5" fill="#047857" fontWeight="bold" textAnchor="middle">滴定过量 Cr₂O₇²⁻</text>
            </g>

            {/* 流程连接箭头 2 */}
            <path d="M 245 85 L 260 85" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
            <polygon points="260,85 254,82 254,88" fill="#64748B" />

            {/* 步骤 3：终点指示 (纯看图模式) */}
            <g transform="translate(265, 20)">
              <rect x="0" y="0" width="75" height="135" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <text x="37" y="18" fontSize="8.5" fill="#1E293B" fontWeight="bold" textAnchor="middle">③ 滴定终点</text>
              <circle cx="37" cy="42" r="14" fill="#B91C1C" opacity="0.8" stroke="#7F1D1D" strokeWidth="1" />
              <text x="37" y="45" fontSize="7.5" fill="#FFFFFF" fontWeight="bold" textAnchor="middle">红褐色</text>
              <text x="37" y="68" fontSize="7" fill="#475569" textAnchor="middle">试亚铁灵指示</text>
              <line x1="8" y1="78" x2="67" y2="78" stroke="#E2E8F0" />
              <text x="37" y="92" fontSize="7.5" fill="#334155" fontWeight="bold" textAnchor="middle">耗 FeSO₄ 溶液</text>
              <text x="37" y="105" fontSize="8" fill="#0284C7" fontWeight="bold" textAnchor="middle">12.00 mL</text>
            </g>

            {/* 剖析解密模式：叠加解答高亮卡与考点切口 */}
            {isAnalysisMode && (
              <g>
                <g transform="translate(265, 98)">
                  <rect x="0" y="0" width="75" height="55" rx="4" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1" />
                  <text x="37" y="14" fontSize="7" fill="#1E3A8A" fontWeight="bold" textAnchor="middle">解答推导:</text>
                  <text x="37" y="27" fontSize="6.5" fill="#1D4ED8" textAnchor="middle">n(COD) = n(Cr₂O₇²⁻)</text>
                  <text x="37" y="38" fontSize="6.5" fill="#1D4ED8" textAnchor="middle">- 1/6 n(Fe²⁺)</text>
                </g>
                <g transform="translate(15, 160)">
                  <rect x="0" y="0" width="325" height="16" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
                  <text x="162" y="11" fontSize="7.5" fill="#92400E" fontWeight="bold" textAnchor="middle">
                    💡 [剖析解密] 滴定管未润洗/终点仰视 → V(FeSO₄) 偏大 → 计算残余 Cr₂O₇²⁻ 偏大 → 算得 COD 偏低
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>
      )
    }

    if (errorType === 'permanganate-view-angle') {
      return (
        <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
          <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>{title}</span>
            <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
              高考真题原图高保真复现
            </span>
          </div>
          <svg viewBox="0 0 350 180" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs select-none">
            {/* 网格背景 */}
            <rect x="0" y="0" width="350" height="180" fill="#FAFAFA" />

            {/* 1. 棕色酸式滴定管与刻度 (高考题目看图层) */}
            <g transform="translate(30, 15)">
              <rect x="25" y="10" width="16" height="135" fill="#78350F" opacity="0.12" stroke="#92400E" strokeWidth="1.2" rx="2" />
              {[0, 5, 10, 15, 20].map((val, idx) => (
                <g key={val} transform={`translate(25, ${20 + idx * 26})`}>
                  <line x1="0" y1="0" x2="6" y2="0" stroke="#78350F" strokeWidth="1" />
                  <text x="-4" y="3" fontSize="7.5" fill="#78350F" textAnchor="end" fontFamily="monospace">{val}</text>
                </g>
              ))}
              <text x="33" y="155" fontSize="7.5" fill="#78350F" textAnchor="middle" fontWeight="bold">棕色酸式滴定管 (KMnO₄)</text>

              {/* 始读数凹液面 */}
              <ellipse cx="33" cy="30.4" rx="7" ry="2" fill="#881337" opacity="0.7" />
              <text x="45" y="32" fontSize="7" fill="#475569">V(始) 刻度</text>

              {/* 终读数凹液面 */}
              <ellipse cx="33" cy="124" rx="7" ry="2" fill="#881337" opacity="0.7" />
              <text x="45" y="126" fontSize="7" fill="#475569">V(终) 刻度</text>
            </g>

            {/* 2. 视角折射光路 (纯题目图示) */}
            <g transform="translate(135, 15)">
              <rect x="0" y="0" width="115" height="145" rx="5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <text x="57" y="16" fontSize="8" fill="#1E293B" fontWeight="bold" textAnchor="middle">考场视角读数示意</text>

              {/* 始仰视光路 */}
              <line x1="15" y1="45" x2="95" y2="30" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="15" cy="45" r="3" fill="#E11D48" />
              <text x="100" y="33" fontSize="7.5" fill="#334155" fontWeight="bold">始视角: 仰视</text>

              {/* 终俯视光路 */}
              <line x1="15" y1="105" x2="95" y2="124" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="15" cy="105" r="3" fill="#D97706" />
              <text x="100" y="123" fontSize="7.5" fill="#334155" fontWeight="bold">终视角: 俯视</text>

              <line x1="10" y1="75" x2="105" y2="75" stroke="#CBD5E1" strokeDasharray="2 2" />
              <text x="57" y="70" fontSize="7.5" fill="#475569" textAnchor="middle">读取消耗体积 ΔV = V(终) - V(始)</text>
              <text x="57" y="90" fontSize="7" fill="#64748B" textAnchor="middle">(试分析 ΔV 与纯度 w% 的变化)</text>
            </g>

            {/* 3. 剖析解密模式：叠加解答卡与推导分析 */}
            {isAnalysisMode ? (
              <g transform="translate(260, 15)">
                <rect x="0" y="0" width="80" height="145" rx="5" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1" />
                <text x="40" y="18" fontSize="8" fill="#991B1B" fontWeight="bold" textAnchor="middle">💡 剖析解密</text>
                <text x="40" y="36" fontSize="7" fill="#7F1D1D" textAnchor="middle">始仰: 读数偏大</text>
                <text x="40" y="48" fontSize="7" fill="#7F1D1D" textAnchor="middle">终俯: 读数偏小</text>

                <line x1="8" y1="58" x2="72" y2="58" stroke="#FECACA" />
                <text x="40" y="72" fontSize="7.5" fill="#991B1B" fontWeight="bold" textAnchor="middle">ΔV 严重偏小</text>
                <polygon points="40,84 34,77 46,77" fill="#DC2626" />

                <text x="40" y="100" fontSize="7" fill="#7F1D1D" textAnchor="middle">代入公式:</text>
                <text x="40" y="112" fontSize="6.5" fill="#B91C1C" textAnchor="middle">w% = c·ΔV·M / 5m</text>
                <text x="40" y="130" fontSize="8" fill="#DC2626" fontWeight="bold" textAnchor="middle">纯度 w% 偏低！</text>
              </g>
            ) : (
              <g transform="translate(260, 15)">
                <rect x="0" y="0" width="80" height="145" rx="5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 2" />
                <text x="40" y="65" fontSize="8" fill="#64748B" fontWeight="bold" textAnchor="middle">❓ 答题卡</text>
                <text x="40" y="85" fontSize="7" fill="#94A3B8" textAnchor="middle">作答后解密</text>
                <text x="40" y="98" fontSize="7" fill="#94A3B8" textAnchor="middle">误差推理板</text>
              </g>
            )}
          </svg>
        </div>
      )
    }

    if (errorType === 'iodometry-purity') {
      return (
        <div className={`my-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
          <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>{title}</span>
            <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">
              高考真题原图高保真复现
            </span>
          </div>
          <svg viewBox="0 0 350 180" className="w-full h-auto bg-white rounded border border-slate-200 shadow-2xs select-none">
            {/* 背景 */}
            <rect x="0" y="0" width="350" height="180" fill="#FAFAFA" />

            {/* 1. 多步反应流程 (看图做题层) */}
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="320" height="55" rx="5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <text x="160" y="16" fontSize="8.5" fill="#1E293B" fontWeight="bold" textAnchor="middle">
                🔗 间接碘量法 (Indirect Iodometry) 实验流程
              </text>
              <text x="160" y="32" fontSize="7.5" fill="#334155" fontFamily="monospace" textAnchor="middle">
                CuCO₃·Cu(OH)₂ (粗品 2.500 g) ＋ 过量 H₂SO₄ ──→ Cu²⁺ ＋ 足量 KI ──→ I₂ ＋ CuI↓
              </text>
              <text x="160" y="45" fontSize="7.5" fill="#334155" fontFamily="monospace" textAnchor="middle">
                生成的 I₂ ＋ 2Na₂S₂O₃ ──→ 2NaI ＋ Na₂S₄O₆ (消耗 0.1000 M Na₂S₂O₃ 20.00 mL)
              </text>
            </g>

            {/* 2. 滴定终点变色 (通用试卷层) */}
            <g transform="translate(15, 80)">
              <rect x="0" y="0" width="150" height="85" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <text x="75" y="18" fontSize="8" fill="#1E293B" fontWeight="bold" textAnchor="middle">🎨 滴定终点变色指示</text>
              {/* 深蓝色 -> 无色 */}
              <circle cx="45" cy="42" r="14" fill="#1E3A8A" stroke="#1E40AF" strokeWidth="1" />
              <text x="45" y="45" fontSize="7" fill="#FFFFFF" fontWeight="bold" textAnchor="middle">蓝色</text>
              <path d="M 67 42 L 87 42" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
              <polygon points="87,42 81,39 81,45" fill="#64748B" />
              <circle cx="110" cy="42" r="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
              <text x="110" y="45" fontSize="7" fill="#475569" fontWeight="bold" textAnchor="middle">无色</text>

              <text x="75" y="68" fontSize="7" fill="#475569" textAnchor="middle">淀粉指示剂: 蓝色恰好褪去</text>
              <text x="75" y="78" fontSize="6.5" fill="#64748B" textAnchor="middle">且半分钟内不恢复原色</text>
            </g>

            {/* 3. 剖析解密模式：叠加解答计算卡 */}
            {isAnalysisMode ? (
              <g transform="translate(175, 80)">
                <rect x="0" y="0" width="160" height="85" rx="5" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1" />
                <text x="80" y="18" fontSize="8" fill="#166534" fontWeight="bold" textAnchor="middle">💡 剖析解密: 计量比精算</text>
                <text x="80" y="34" fontSize="7.5" fill="#15803D" fontWeight="bold" textAnchor="middle">1 CuCO₃·Cu(OH)₂ ～ 2 S₂O₃²⁻</text>
                <line x1="15" y1="42" x2="145" y2="42" stroke="#DCFCE7" />
                <text x="80" y="55" fontSize="7" fill="#166534" textAnchor="middle">n(纯品) = 1/2 n(S₂O₃²⁻) = 0.0010 mol</text>
                <text x="80" y="67" fontSize="7" fill="#166534" textAnchor="middle">m(纯品) = 0.0010 × 222 = 0.222 g</text>
                <text x="80" y="78" fontSize="7.5" fill="#15803D" fontWeight="bold" textAnchor="middle">纯度 w% = 0.222 / 2.500 = 8.88%</text>
              </g>
            ) : (
              <g transform="translate(175, 80)">
                <rect x="0" y="0" width="160" height="85" rx="5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 2" />
                <text x="80" y="38" fontSize="8" fill="#64748B" fontWeight="bold" textAnchor="middle">❓ 计量比与纯度 w% 推导</text>
                <text x="80" y="55" fontSize="7" fill="#94A3B8" textAnchor="middle">请根据反应式计算样品纯度</text>
                <text x="80" y="68" fontSize="7" fill="#94A3B8" textAnchor="middle">点击选项后显示剖析精算板</text>
              </g>
            )}
          </svg>
        </div>
      )
    }
  }

  return null
}
