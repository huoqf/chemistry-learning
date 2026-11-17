import React from 'react'
import { withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'
import type { AvogadroParams } from '../types'

interface AvogadroStructureSceneProps {
  structureItem: AvogadroParams['structureItem']
  animTime: number
  font: FontScaler
}

/**
 * 阿伏加德罗常数 - 结构化学微观几何与成键拓扑 SVG 子场景
 */
export const AvogadroStructureScene: React.FC<AvogadroStructureSceneProps> = ({
  structureItem,
  animTime,
  font,
}) => {
  return (
    <g transform="translate(210, 215)">
      {structureItem === 'P4' ? (
        /* P4 白磷正四面体立体旋转微动画 */
        <g>
          {(() => {
            const rotTheta = Math.sin(animTime * 1.2) * 16
            const rad = (rotTheta * Math.PI) / 180
            const p1x = 0
            const p1y = -105
            const p2x = -95 * Math.cos(rad) - 20 * Math.sin(rad)
            const p2y = 55
            const p3x = 95 * Math.cos(rad) - 20 * Math.sin(rad)
            const p3y = 55
            const p4x = 25 * Math.sin(rad)
            const p4y = 0
            const glowAlpha = 0.75 + 0.25 * Math.sin(animTime * 3)

            return (
              <g>
                <polygon
                  points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
                  fill={withAlpha('#a855f7', 0.12)}
                  stroke="#7e22ce"
                  strokeWidth={3}
                  strokeOpacity={glowAlpha}
                />
                <line x1={p1x} y1={p1y} x2={p4x} y2={p4y} stroke="#7e22ce" strokeWidth={2.8} strokeOpacity={glowAlpha} />
                <line x1={p2x} y1={p2y} x2={p4x} y2={p4y} stroke="#a855f7" strokeWidth={2.2} strokeDasharray="4 3" />
                <line x1={p3x} y1={p3y} x2={p4x} y2={p4y} stroke="#a855f7" strokeWidth={2.2} strokeDasharray="4 3" />

                {[
                  [p1x, p1y], [p2x, p2y], [p3x, p3y], [p4x, p4y],
                ].map(([px, py], idx) => (
                  <g key={idx}>
                    <circle cx={px} cy={py} r="18" fill="#f3e8ff" stroke="#7e22ce" strokeWidth={2.5} />
                    <text x={px} y={py + 5} fill="#6b21a8" fontSize={font(13)} textAnchor="middle" fontWeight="bold">
                      P
                    </text>
                  </g>
                ))}
              </g>
            )
          })()}

          <text x="0" y="96" fill="#6b21a8" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            正四面体：4 个 P 顶点 · 6 条 P-P 棱键
          </text>
          <text x="0" y="118" fill="#7e22ce" fontSize={font(11)} textAnchor="middle">
            1 mol P<tspan dy="2" fontSize="0.75em">4</tspan><tspan dy="-2" fontSize="1em"> = 6 mol 共价键 (键角 60°)</tspan>
          </text>
        </g>
      ) : structureItem === 'SiO2' ? (
        /* SiO2 二氧化硅硅氧网状单元 */
        <g>
          {(() => {
            const wave = Math.sin(animTime * 2) * 2
            return (
              <g>
                <line x1="0" y1="0" x2="0" y2={-70 - wave} stroke="#0284c7" strokeWidth={3.5} />
                <line x1="0" y1="0" x2={-65 - wave} y2={45 + wave} stroke="#0284c7" strokeWidth={3.5} />
                <line x1="0" y1="0" x2={65 + wave} y2={45 + wave} stroke="#0284c7" strokeWidth={3.5} />
                <line x1="0" y1="0" x2="0" y2={65 + wave} stroke="#0284c7" strokeWidth={3.5} strokeDasharray="4 3" />

                <line x1="0" y1={-70 - wave} x2="45" y2="-105" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                <line x1={-65 - wave} y1={45 + wave} x2="-105" y2="65" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                <line x1={65 + wave} y1={45 + wave} x2="105" y2="65" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />

                <circle cx="0" cy="0" r="22" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                <text x="0" y="5" fill="#ffffff" fontSize={font(12)} textAnchor="middle" fontWeight="bold">Si</text>

                <circle cx="0" cy={-70 - wave} r="14" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                <text x="0" y={-65 - wave} fill="#ffffff" fontSize={font(10)} textAnchor="middle" fontWeight="bold">O</text>
                <circle cx={-65 - wave} cy={45 + wave} r="14" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                <text x={-65 - wave} y={50 + wave} fill="#ffffff" fontSize={font(10)} textAnchor="middle" fontWeight="bold">O</text>
                <circle cx={65 + wave} cy={45 + wave} r="14" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                <text x={65 + wave} y={50 + wave} fill="#ffffff" fontSize={font(10)} textAnchor="middle" fontWeight="bold">O</text>
                <circle cx="0" cy={65 + wave} r="14" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                <text x="0" y={70 + wave} fill="#ffffff" fontSize={font(10)} textAnchor="middle" fontWeight="bold">O</text>
              </g>
            )
          })()}
          <text x="0" y="105" fill="#0369a1" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            共价晶体：1 mol Si 对应 4 mol Si-O 键
          </text>
        </g>
      ) : structureItem === 'ice' ? (
        /* 冰晶体水分子四面体定向氢键流动 */
        <g>
          <circle cx="0" cy="0" r="28" fill="#0284c7" />
          <text x="0" y="5" fill="#ffffff" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            H<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em">O</tspan>
          </text>
          {[
            [-60, -60], [60, -60], [-60, 60], [60, 60],
          ].map(([hx, hy], idx) => (
            <g key={idx}>
              <line
                x1="0"
                y1="0"
                x2={hx}
                y2={hy}
                stroke="#0284c7"
                strokeWidth={3}
                strokeDasharray="4 3"
                strokeDashoffset={-animTime * 18}
              />
              <circle cx={hx} cy={hy} r="16" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
              <text x={hx} y={hy + 4} fill="#0369a1" fontSize={font(9)} textAnchor="middle" fontWeight="bold">
                H<tspan dy="1.5" fontSize="0.75em">2</tspan><tspan dy="-1.5" fontSize="1em">O</tspan>
              </text>
            </g>
          ))}
          <text x="0" y="100" fill="#0369a1" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            冰氢键均摊：1 mol 冰 (18 g) = 2 mol 氢键
          </text>
          <text x="0" y="118" fill="#64748b" fontSize={font(10)} textAnchor="middle">
            (4 个氢键方向 × 1/2 共享 = 2)
          </text>
        </g>
      ) : structureItem === 'graphite' ? (
        /* 石墨平面六元环网状均摊拓扑 */
        <g>
          <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill={withAlpha('#475569', 0.1)} stroke="#334155" strokeWidth={3} />
          <line x1="52" y1="-30" x2="88" y2="-50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="52" y1="30" x2="88" y2="50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="-52" y1="-30" x2="-88" y2="-50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="-52" y1="30" x2="-88" y2="50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          {[[0, -60], [52, -30], [52, 30], [0, 60], [-52, 30], [-52, -30]].map(([x, y], idx) => (
            <g key={idx}>
              <circle cx={x} cy={y} r="13" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
              <text x={x} y={y + 4} fill="#ffffff" fontSize={font(9)} textAnchor="middle" fontWeight="bold">C</text>
            </g>
          ))}
          <text x="0" y="95" fill="#1e293b" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            石墨均摊：1 mol C 形成 1.5 mol C-C 键
          </text>
          <text x="0" y="115" fill="#64748b" fontSize={font(10)} textAnchor="middle">
            (每个 C 连 3 键，3 × 1/2 = 1.5)
          </text>
        </g>
      ) : structureItem === 'S8' ? (
        /* S8 皇冠八元环 */
        <g>
          <polygon
            points="0,-72 52,-50 72,0 52,50 0,72 -52,50 -72,0 -52,-50"
            fill={withAlpha('#eab308', 0.14)}
            stroke="#ca8a04"
            strokeWidth={3}
          />
          {[[0, -72], [52, -50], [72, 0], [52, 50], [0, 72], [-52, 50], [-72, 0], [-52, -50]].map(([sx, sy], idx) => (
            <g key={idx}>
              <circle cx={sx} cy={sy} r="12" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />
              <text x={sx} y={sy + 4} fill="#ffffff" fontSize={font(9)} textAnchor="middle" fontWeight="bold">S</text>
            </g>
          ))}
          <text x="0" y="105" fill="#854d0e" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            S₈ 皇冠环：1 mol S₈ (256 g) 含 8 mol S-S 键
          </text>
        </g>
      ) : structureItem === 'D2O' || structureItem === 'T2O' ? (
        /* D2O / T2O 重水/超重水同位素中子剖析 */
        <g>
          <circle cx="0" cy="-12" r="32" fill="#0284c7" />
          <text x="0" y="-7" fill="#ffffff" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            ¹⁶O (8n)
          </text>
          <circle cx="-62" cy="24" r="20" fill="#6366f1" />
          <text x="-62" y="28" fill="#ffffff" fontSize={font(10)} textAnchor="middle" fontWeight="bold">
            {structureItem === 'D2O' ? '²H (1n)' : '³H (2n)'}
          </text>
          <circle cx="62" cy="24" r="20" fill="#6366f1" />
          <text x="62" y="28" fill="#ffffff" fontSize={font(10)} textAnchor="middle" fontWeight="bold">
            {structureItem === 'D2O' ? '²H (1n)' : '³H (2n)'}
          </text>
          <line x1="-26" y1="2" x2="-45" y2="14" stroke="#334155" strokeWidth={2.5} />
          <line x1="26" y1="2" x2="45" y2="14" stroke="#334155" strokeWidth={2.5} />
          <text x="0" y="75" fill="#1e293b" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            {structureItem === 'D2O'
              ? 'D₂O (M=20 g/mol)：每 mol 含 10 mol 中子 (非 8 mol)'
              : 'T₂O (M=22 g/mol)：每 mol 含 12 mol 中子 (非 8 mol)'}
          </text>
        </g>
      ) : structureItem === 'NH4Cl' ? (
        /* NH4Cl 离子键与配位共价键拓扑 */
        <g>
          <circle cx="-48" cy="0" r="32" fill="#0284c7" />
          <text x="-48" y="4" fill="#ffffff" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            [NH₄]⁺
          </text>
          <circle cx="58" cy="0" r="28" fill="#16a34a" />
          <text x="58" y="4" fill="#ffffff" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            Cl⁻
          </text>
          <line x1="-14" y1="0" x2="28" y2="0" stroke="#64748b" strokeWidth={2} strokeDasharray="4 3" />
          <text x="0" y="70" fill="#1e293b" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            1 mol NH₄Cl 含 4 mol N-H 共价键 + 1 mol 离子键
          </text>
        </g>
      ) : (
        /* Na2O2 过氧化物晶体单元 */
        <g>
          <circle cx="-55" cy="0" r="30" fill="#0284c7" />
          <circle cx="55" cy="0" r="30" fill="#dc2626" />
          <line x1="-25" y1="0" x2="25" y2="0" stroke="#334155" strokeWidth={3.5} />
          <text x="-55" y="5" fill="#ffffff" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            Na<tspan dy="-3" fontSize="0.75em">+</tspan><tspan dy="3" fontSize="1em"></tspan>
          </text>
          <text x="55" y="5" fill="#ffffff" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            O<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-5" fontSize="0.75em">2−</tspan><tspan dy="3" fontSize="1em"></tspan>
          </text>
          <text x="0" y="70" fill="#1e293b" fontSize={font(12)} textAnchor="middle" fontWeight="bold">
            Na<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em">O</tspan><tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em">：阳:阴 = 2:1 (含 1 mol O-O 键)</tspan>
          </text>
        </g>
      )}
    </g>
  )
}
