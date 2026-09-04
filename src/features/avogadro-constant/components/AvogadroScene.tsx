import React from 'react'
import {
  SCENE_COLORS,
  CANVAS_COLORS,
  withAlpha,
} from '@/theme'
import type { FontScaler } from '@/theme'
import type { SceneScale } from '@/scene/SceneScale'
import {
  BeakerApparatus,
  OxidationBridgeArrow,
  VectorArrow,
} from '@/components/Chemistry'
import type { AvogadroParams, AvogadroResult } from '../types'

interface AvogadroSceneProps {
  params: AvogadroParams
  chemistry: AvogadroResult
  animTime: number
  canvasSize: { font: FontScaler }
  sceneScale: SceneScale
  gasMolecules: {
    base: number[]
    seed: number
    rot0: number
  }[]
}

export const AvogadroScene: React.FC<AvogadroSceneProps> = ({
  params,
  chemistry,
  animTime,
  canvasSize,
  sceneScale,
  gasMolecules,
}) => {
  return (
    <>
      <defs>
        <pattern id="avogadro-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={CANVAS_COLORS.grid} strokeWidth="0.5" />
        </pattern>
        {/* 丁达尔光束渐变 */}
        <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
        </linearGradient>
        {/* 电子发光渐变 */}
        <radialGradient id="electron-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
          <stop offset="60%" stopColor="#eab308" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="420" height="650" fill="url(#avogadro-grid)" opacity={0.3} />

      {/* 顶层：紧凑状态微标胶囊 (y: 18~54) */}
      <g transform="translate(20, 18)">
        <rect
          x="0"
          y="0"
          width="380"
          height="36"
          rx="18"
          fill={withAlpha('#f8fafc', 0.9)}
          stroke={withAlpha('#cbd5e1', 0.8)}
          strokeWidth={1}
        />
        <circle
          cx="20"
          cy="18"
          r="6"
          fill={chemistry.isStateGas ? '#10B981' : '#EF4444'}
        />
        <circle
          cx="20"
          cy="18"
          r={6 + 2 * Math.abs(Math.sin(animTime * 3))}
          fill="none"
          stroke={chemistry.isStateGas ? '#10B981' : '#EF4444'}
          strokeWidth={1}
          opacity={0.6}
        />
        <text x="34" y="22" fill="#1e293b" fontSize={canvasSize.font(12)} fontWeight="bold">
          {chemistry.physicalState} · {chemistry.isStateGas ? `Vm = ${chemistry.vmValue} L/mol` : '标况非气体'}
        </text>
        <text
          x="364"
          y="22"
          fill={chemistry.trapLevel === 'high' ? '#dc2626' : '#15803d'}
          fontSize={canvasSize.font(11)}
          textAnchor="end"
          fontWeight="bold"
        >
          {chemistry.trapBadge}
        </text>
      </g>

      {/* ──────────────── 中层舞台：五大微观拓扑与宏观场景 ──────────────── */}

      {/* 1. 标况状态与体积对比 */}
      {params.trapCategory === 'state-volume' && (
        <g transform="translate(20, 75)">
          {/* 左室：22.4 L 标况密闭空间容器 (宽 190 × 高 235) */}
          <rect
            x="0"
            y="0"
            width="190"
            height="235"
            rx="12"
            fill={withAlpha(SCENE_COLORS.reagent.solution, 0.05)}
            stroke={chemistry.isStateGas ? '#0284c7' : '#94a3b8'}
            strokeWidth={2}
            strokeDasharray={chemistry.isStateGas ? 'none' : '5 4'}
          />
          <text x="95" y="24" fill="#334155" fontSize={canvasSize.font(11.5)} textAnchor="middle" fontWeight="bold">
            22.4 L 空间容器 (0℃, 101 kPa)
          </text>

          {chemistry.isStateGas ? (
            /* 气体分子：8个双球哑铃自由热运动 */
            <g>
              {gasMolecules.map((m, i) => {
                const dx = Math.sin(animTime * 1.8 + m.seed) * 5
                const dy = Math.cos(animTime * 2.2 + m.seed) * 5
                const rot = m.rot0 + animTime * 35
                return (
                  <g
                    key={i}
                    transform={`translate(${m.base[0] + dx - 5}, ${m.base[1] + dy + 10}) rotate(${rot})`}
                  >
                    <circle cx="-5.5" cy="0" r="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                    <circle cx="5.5" cy="0" r="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                    <line x1="-3" y1="0" x2="3" y2="0" stroke="#0369a1" strokeWidth="1.8" />
                  </g>
                )
              })}
              <text x="95" y="215" fill="#0284c7" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
                分子热运动 · 充满 22.4 L (1 NA)
              </text>
            </g>
          ) : (
            /* 标况非气体：容器底部的微量聚集液体/晶体，强烈体积鸿沟 */
            <g>
              <path
                d={`M 15 220 Q 55 ${217 + Math.sin(animTime * 4) * 2} 95 220 T 175 ${219 + Math.cos(animTime * 4) * 2} L 175 230 L 15 230 Z`}
                fill={withAlpha('#ef4444', 0.35)}
                stroke="#ef4444"
                strokeWidth={1.5}
              />
              <text x="95" y="110" fill="#dc2626" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                非气态！禁用 22.4 L/mol
              </text>
              <text x="95" y="134" fill="#64748b" fontSize={canvasSize.font(10)} textAnchor="middle">
                实际分子数远超 1 NA (500+ NA)
              </text>
            </g>
          )}

          {/* 中间体积落差指示对比区 (x: 195, y: 95) */}
          {!chemistry.isStateGas ? (
            <g transform="translate(195, 95)">
              <VectorArrow
                originDesign={{ x: 5, y: 15 }}
                vector={{ x: 55, y: 0 }}
                type="equilibriumShift"
                sceneScale={sceneScale}
                pixelLength={50}
                color="#ef4444"
                strokeWidth={2}
                font={canvasSize.font}
              />
              <rect x="18" y="-6" width="46" height="18" rx="4" fill="#fee2e2" stroke="#fca5a5" strokeWidth="0.8" />
              <text x="41" y="7" fill="#dc2626" fontSize={canvasSize.font(9.5)} textAnchor="middle" fontWeight="bold">
                1200×
              </text>
              <text x="41" y="38" fill="#991b1b" fontSize={canvasSize.font(9)} textAnchor="middle">
                体积落差
              </text>
            </g>
          ) : (
            <g transform="translate(198, 105)">
              <line x1="5" y1="10" x2="55" y2="10" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="30" y="4" fill="#0284c7" fontSize={canvasSize.font(9)} textAnchor="middle" fontWeight="bold">
                对比
              </text>
            </g>
          )}

          {/* 右室：真实 1 mol 聚集液体刻度管 (x: 275, y: 10, 宽 85, 高 215) */}
          <g transform="translate(270, 0)">
            <rect x="0" y="0" width="85" height="235" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
            <text x="42" y="24" fill="#334155" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
              1 mol 真实物料
            </text>

            {/* 刻度线与标注 */}
            {[50, 90, 130, 170].map((ly, idx) => (
              <g key={idx}>
                <line x1="68" y1={ly} x2="78" y2={ly} stroke="#94a3b8" strokeWidth="1" />
                <text x="64" y={ly + 3} fill="#94a3b8" fontSize={canvasSize.font(7.5)} textAnchor="end">
                  {(4 - idx) * 10}mL
                </text>
              </g>
            ))}

            {/* 液体填充与微波动 */}
            <rect
              x="6"
              y={170 + Math.sin(animTime * 3) * 1.5}
              width="73"
              height={58 - Math.sin(animTime * 3) * 1.5}
              rx="4"
              fill={chemistry.isStateGas ? '#38bdf8' : '#fb7175'}
              opacity={0.7}
            />
            <text x="42" y="198" fill={chemistry.isStateGas ? '#0369a1' : '#991b1b'} fontSize={canvasSize.font(11.5)} textAnchor="middle" fontWeight="bold">
              ~18 mL
            </text>
            <text x="42" y="214" fill="#64748b" fontSize={canvasSize.font(8.5)} textAnchor="middle">
              实际所占体积
            </text>
          </g>
        </g>
      )}

      {/* 2. 结构化学微观几何与成键拓扑 */}
      {params.trapCategory === 'structure-bonds' && (
        <g transform="translate(210, 215)">
          {params.structureItem === 'P4' ? (
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
                      [p1x, p1y], [p2x, p2y], [p3x, p3y], [p4x, p4y]
                    ].map(([px, py], idx) => (
                      <g key={idx}>
                        <circle cx={px} cy={py} r="18" fill="#f3e8ff" stroke="#7e22ce" strokeWidth={2.5} />
                        <text x={px} y={py + 5} fill="#6b21a8" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                          P
                        </text>
                      </g>
                    ))}
                  </g>
                )
              })()}

              <text x="0" y="96" fill="#6b21a8" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                正四面体：4 个 P 顶点 · 6 条 P-P 棱键
              </text>
              <text x="0" y="118" fill="#7e22ce" fontSize={canvasSize.font(11)} textAnchor="middle">
                1 mol P<tspan dy="2" fontSize="0.75em">4</tspan><tspan dy="-2" fontSize="1em"> = 6 mol 共价键 (键角 60°)</tspan>
              </text>
            </g>
          ) : params.structureItem === 'SiO2' ? (
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
                    <text x="0" y="5" fill="#ffffff" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">Si</text>

                    <circle cx="0" cy={-70 - wave} r="14" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                    <text x="0" y={-65 - wave} fill="#ffffff" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">O</text>
                    <circle cx={-65 - wave} cy={45 + wave} r="14" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                    <text x={-65 - wave} y={50 + wave} fill="#ffffff" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">O</text>
                    <circle cx={65 + wave} cy={45 + wave} r="14" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                    <text x={65 + wave} y={50 + wave} fill="#ffffff" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">O</text>
                    <circle cx="0" cy={65 + wave} r="14" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                    <text x="0" y={70 + wave} fill="#ffffff" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">O</text>
                  </g>
                )
              })()}
              <text x="0" y="105" fill="#0369a1" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                共价晶体：1 mol Si 对应 4 mol Si-O 键
              </text>
            </g>
          ) : params.structureItem === 'ice' ? (
            /* 冰晶体水分子四面体定向氢键流动 */
            <g>
              <circle cx="0" cy="0" r="28" fill="#0284c7" />
              <text x="0" y="5" fill="#ffffff" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                H<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em">O</tspan>
              </text>
              {[
                [-60, -60], [60, -60], [-60, 60], [60, 60]
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
                  <text x={hx} y={hy + 4} fill="#0369a1" fontSize={canvasSize.font(9)} textAnchor="middle" fontWeight="bold">
                    H<tspan dy="1.5" fontSize="0.75em">2</tspan><tspan dy="-1.5" fontSize="1em">O</tspan>
                  </text>
                </g>
              ))}
              <text x="0" y="100" fill="#0369a1" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                冰氢键均摊：1 mol 冰 (18 g) = 2 mol 氢键
              </text>
              <text x="0" y="118" fill="#64748b" fontSize={canvasSize.font(10)} textAnchor="middle">
                (4 个氢键方向 × 1/2 共享 = 2)
              </text>
            </g>
          ) : params.structureItem === 'graphite' ? (
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
                  <text x={x} y={y + 4} fill="#ffffff" fontSize={canvasSize.font(9)} textAnchor="middle" fontWeight="bold">C</text>
                </g>
              ))}
              <text x="0" y="95" fill="#1e293b" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                石墨均摊：1 mol C 形成 1.5 mol C-C 键
              </text>
              <text x="0" y="115" fill="#64748b" fontSize={canvasSize.font(10)} textAnchor="middle">
                (每个 C 连 3 键，3 × 1/2 = 1.5)
              </text>
            </g>
          ) : (
            /* Na2O2 过氧化物晶体单元 */
            <g>
              <circle cx="-55" cy="0" r="30" fill="#0284c7" />
              <circle cx="55" cy="0" r="30" fill="#dc2626" />
              <line x1="-25" y1="0" x2="25" y2="0" stroke="#334155" strokeWidth={3.5} />
              <text x="-55" y="5" fill="#ffffff" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                Na<tspan dy="-3" fontSize="0.75em">+</tspan><tspan dy="3" fontSize="1em"></tspan>
              </text>
              <text x="55" y="5" fill="#ffffff" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                O<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-5" fontSize="0.75em">2−</tspan><tspan dy="3" fontSize="1em"></tspan>
              </text>
              <text x="0" y="70" fill="#1e293b" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                Na<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em">O</tspan><tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em">：阴阳离子比 1:2 (含 1 mol O-O 键)</tspan>
              </text>
            </g>
          )}
        </g>
      )}

      {/* 3. 弱电解质、胶体与熔融态 */}
      {params.trapCategory === 'electrolyte-hydrolysis' && (
        <g transform="translate(120, 85)">
          {params.electrolyteItem === 'FeCl3' ? (
            /* FeCl3 制备胶体：动态丁达尔光束与胶团布朗运动 */
            <g>
              <BeakerApparatus
                x={0}
                y={0}
                width={180}
                height={205}
                fillLevel={0.7}
                fillColor={withAlpha('#fef3c7', 0.85)}
                label="Fe(OH)3 胶体体系"
                font={canvasSize.font}
              />
              <polygon
                points={`-10,120 190,${105 + Math.sin(animTime * 2) * 3} 190,${145 + Math.sin(animTime * 2) * 3} -10,130`}
                fill="url(#beam-grad)"
                opacity={0.65}
              />
              {[
                { base: [90, 125], phase: 0 },
                { base: [140, 120], phase: 1.5 },
              ].map((p, idx) => {
                const bx = p.base[0] + Math.sin(animTime * 1.5 + p.phase) * 5
                const by = p.base[1] + Math.cos(animTime * 1.8 + p.phase) * 4
                return (
                  <g key={idx} transform={`translate(${bx}, ${by})`}>
                    <circle cx="0" cy="0" r={idx === 0 ? 26 : 18} fill="#b45309" stroke="#78350f" strokeWidth={1.5} strokeDasharray="3 3" />
                    {idx === 0 && (
                      <text x="0" y="-2" fill="#ffffff" fontSize={canvasSize.font(9)} textAnchor="middle" fontWeight="bold">
                        胶团
                      </text>
                    )}
                    {idx === 0 && (
                      <text x="0" y="10" fill="#fef3c7" fontSize={canvasSize.font(7)} textAnchor="middle">
                        聚集体
                      </text>
                    )}
                  </g>
                )
              })}
              <text x="90" y="235" fill="#b45309" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                胶粒数 ≪ 投料 Fe<tspan dy="-3" fontSize="0.75em">3+</tspan><tspan dy="3" fontSize="1em"> 离子数</tspan>
              </text>
            </g>
          ) : params.electrolyteItem === 'NaHSO4-molten' ? (
            /* 熔融态 NaHSO4：共价键不断裂 */
            <g transform="translate(0, 30)">
              <rect x="0" y="0" width="180" height="150" rx="14" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" />
              <text x="90" y="28" fill="#c2410c" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                熔融态电离 (无水)
              </text>
              <circle cx="45" cy="80" r="22" fill="#3b82f6" />
              <text x="45" y="84" fill="#ffffff" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
                Na<tspan dy="-3" fontSize="0.75em">+</tspan><tspan dy="3" fontSize="1em"></tspan>
              </text>
              <circle cx="135" cy="80" r="24" fill="#ea580c" />
              <text x="135" y="84" fill="#ffffff" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">
                HSO<tspan dy="2" fontSize="0.75em">4</tspan><tspan dy="-5" fontSize="0.75em">−</tspan><tspan dy="3" fontSize="1em"></tspan>
              </text>
              <text x="90" y="130" fill="#9a3412" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
                仅拆出 2 mol 离子 (不拆 H<tspan dy="-3" fontSize="0.75em">+</tspan><tspan dy="3" fontSize="1em">)</tspan>
              </text>
            </g>
          ) : (
            /* CH3COOH 弱酸微弱电离 */
            <g>
              <BeakerApparatus
                x={0}
                y={0}
                width={180}
                height={205}
                fillLevel={0.7}
                fillColor={SCENE_COLORS.reagent.solution}
                label="弱酸溶液体系"
                font={canvasSize.font}
              />
              <circle cx="50" cy="85" r="14" fill="#0284c7" />
              <text x="50" y="88" fill="#ffffff" fontSize={canvasSize.font(8)} textAnchor="middle" fontWeight="bold">
                CH<tspan dy="1.5" fontSize="0.75em">3</tspan><tspan dy="-1.5" fontSize="1em">COO</tspan><tspan dy="-2" fontSize="0.75em">−</tspan><tspan dy="2" fontSize="1em"></tspan>
              </text>
              <circle cx="130" cy="105" r="10" fill="#ef4444" />
              <text x="130" y="108" fill="#ffffff" fontSize={canvasSize.font(8)} textAnchor="middle" fontWeight="bold">
                H<tspan dy="-2" fontSize="0.75em">+</tspan><tspan dy="2" fontSize="1em"></tspan>
              </text>
              <rect x="65" y="130" width="60" height="24" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <text x="95" y="146" fill="#475569" fontSize={canvasSize.font(9)} textAnchor="middle" fontWeight="bold">
                CH<tspan dy="1.5" fontSize="0.75em">3</tspan><tspan dy="-1.5" fontSize="1em">COOH</tspan>
              </text>
              <text x="90" y="235" fill="#0369a1" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                物料守恒：c · V 恒成立
              </text>
            </g>
          )}
        </g>
      )}

      {/* 4. 氧化还原与电子转移 */}
      {params.trapCategory === 'redox-electron' && (
        <g transform="translate(210, 205)">
          {params.redoxItem === 'NO2-N2O4-reversible' ? (
            /* 2NO2 <=> N2O4 动态可逆碰撞二聚平衡 */
            <g>
              <rect x="-105" y="-70" width="210" height="145" rx="14" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
              {(() => {
                const offset = 18 + 10 * Math.sin(animTime * 2.2)
                return (
                  <g>
                    <circle cx={-35 - offset} cy="0" r="17" fill="#b91c1c" />
                    <text x={-35 - offset} y="5" fill="#ffffff" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">
                      NO<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em"></tspan>
                    </text>
                    <circle cx={-15 - offset} cy="15" r="17" fill="#b91c1c" />
                    <text x={-15 - offset} y="20" fill="#ffffff" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">
                      NO<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em"></tspan>
                    </text>
                    <text x="10" y="5" fill="#dc2626" fontSize={canvasSize.font(16)} textAnchor="middle" fontWeight="bold">⇌</text>
                    <ellipse cx="65" cy="5" rx="26" ry="18" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
                    <text x="65" y="10" fill="#991b1b" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">
                      N<tspan dy="2" fontSize="0.75em">2</tspan><tspan dy="-2" fontSize="1em">O</tspan><tspan dy="2" fontSize="0.75em">4</tspan><tspan dy="-2" fontSize="1em"></tspan>
                    </text>
                  </g>
                )
              })()}
              <text x="0" y="54" fill="#b91c1c" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
                2 分子二聚为 1 分子 ➔ 分子总数 &lt; 1 NA
              </text>
            </g>
          ) : (
            /* Cl2 / Na2O2 歧化反应：飞行动画电子转移 */
            <g>
              <OxidationBridgeArrow
                startPos={[-80, 0]}
                endPos={[80, 0]}
                label={params.redoxItem === 'Cu-S' ? '失 1e- (生成 Cu2S)' : '歧化转移 1e-'}
                arcHeight={35}
                font={canvasSize.font}
              />
              {(() => {
                const p = (animTime * 0.75) % 1
                const ex = -80 + p * 160
                const ey = -4 * 35 * p * (1 - p)
                return (
                  <g transform={`translate(${ex}, ${ey})`}>
                    <circle cx="0" cy="0" r="7" fill="url(#electron-glow)" />
                    <circle cx="0" cy="0" r="3.5" fill="#facc15" />
                    <text x="0" y="2.5" fill="#713f12" fontSize={canvasSize.font(6)} textAnchor="middle" fontWeight="bold">
                      e<tspan dy="-1" fontSize="0.75em">−</tspan><tspan dy="1" fontSize="1em"></tspan>
                    </text>
                  </g>
                )
              })()}
              <circle cx="-80" cy="0" r="22" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <text x="-80" y="5" fill="#b45309" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">0</text>
              <circle cx="80" cy="0" r="22" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
              <text x="80" y="5" fill="#15803d" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">+1</text>
              <text x="0" y="65" fill="#334155" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                {params.redoxItem === 'Cu-S'
                  ? 'S 为弱氧化剂，1 mol Cu 转移 1 NA 电子'
                  : '1 mol Cl2 歧化反应转移 1 NA 电子'}
              </text>
            </g>
          )}
        </g>
      )}

      {/* 5. 五步秒杀思维雷达旋转扫描探针 */}
      {params.trapCategory === '5-step-matrix' && (
        <g transform="translate(210, 215)">
          {[120, 95, 70, 45, 20].map((r, i) => (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={r}
              fill="none"
              stroke={params.matrixStepIndex === 4 - i ? '#16a34a' : '#cbd5e1'}
              strokeWidth={params.matrixStepIndex === 4 - i ? 3 : 1}
              strokeDasharray="4 3"
            />
          ))}

          {/* 雷达匀速旋转扫描针动画 */}
          {(() => {
            const angle = (animTime * 50) % 360
            const rad = (angle * Math.PI) / 180
            const sx = Math.cos(rad) * 120
            const sy = Math.sin(rad) * 120
            return (
              <g>
                <line x1="0" y1="0" x2={sx} y2={sy} stroke="#10b981" strokeWidth="2" strokeOpacity="0.8" />
                <circle cx={sx} cy={sy} r="4" fill="#10b981" />
              </g>
            )
          })()}

          {[
            { name: '①环境', angle: -90 },
            { name: '②状态', angle: -18 },
            { name: '③结构', angle: 54 },
            { name: '④过程', angle: 126 },
            { name: '⑤电子', angle: 198 },
          ].map((step, idx) => {
            const rad = (step.angle * Math.PI) / 180
            const px = Math.cos(rad) * 115
            const py = Math.sin(rad) * 115
            const isAct = params.matrixStepIndex === idx
            return (
              <g key={idx} transform={`translate(${px}, ${py})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={isAct ? 18 + Math.sin(animTime * 4) * 1.5 : 17}
                  fill={isAct ? '#16a34a' : '#f8fafc'}
                  stroke={isAct ? '#15803d' : '#94a3b8'}
                  strokeWidth={2}
                />
                <text x="0" y="4" fill={isAct ? '#ffffff' : '#334155'} fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">
                  {step.name}
                </text>
              </g>
            )
          })}

          <circle cx="0" cy="0" r="18" fill="#0284c7" />
          <text x="0" y="5" fill="#ffffff" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
            NA
          </text>
          <text x="0" y="155" fill="#15803d" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
            五步严谨排查 · 100% 避坑闭环
          </text>
        </g>
      )}

      {/* ──────────────── 底层基座 (y: 360~570)：微粒数量定量诊断对比台 ──────────────── */}
      <g transform="translate(20, 360)">
        <rect
          x="0"
          y="0"
          width="380"
          height="210"
          rx="12"
          fill={withAlpha('#f8fafc', 0.9)}
          stroke={withAlpha('#cbd5e1', 0.8)}
          strokeWidth={1}
        />

        {/* 标题栏 */}
        <text x="16" y="24" fill="#1e293b" fontSize={canvasSize.font(12)} fontWeight="bold">
          微粒数量定量诊断对比
        </text>
        <text x="364" y="24" fill="#64748b" fontSize={canvasSize.font(10)} textAnchor="end">
          真实微粒数 vs 错解误判值
        </text>
        <line x1="16" y1="34" x2="364" y2="34" stroke="#e2e8f0" strokeWidth="1" />

        {/* 动态微粒对比条 */}
        {chemistry.particleStats.slice(0, 2).map((stat, idx) => {
          const itemY = 44 + idx * 72
          const maxVal = Math.max(stat.actualMoles, stat.theoreticalMoles, 1)
          const actRatio = Math.min(1, stat.actualMoles / maxVal)
          const theoRatio = Math.min(1, stat.theoreticalMoles / maxVal)
          const barWidth = 190

          return (
            <g key={idx} transform={`translate(16, ${itemY})`}>
              {/* 微粒名称 */}
              <text x="0" y="12" fill="#334155" fontSize={canvasSize.font(11)} fontWeight="bold">
                {stat.label}
              </text>
              {stat.isTrap && (
                <g transform="translate(110, 0)">
                  <rect x="0" y="0" width="56" height="15" rx="3" fill="#fee2e2" stroke="#fca5a5" strokeWidth="0.5" />
                  <text x="28" y="11" fill="#dc2626" fontSize={canvasSize.font(9)} textAnchor="middle" fontWeight="bold">
                    高频设陷
                  </text>
                </g>
              )}

              {/* 真实值对比条 */}
              <g transform="translate(0, 20)">
                <text x="0" y="10" fill="#0369a1" fontSize={canvasSize.font(10)} fontWeight="bold">
                  真实值:
                </text>
                <rect x="44" y="1" width={barWidth} height="11" rx="3" fill="#e0f2fe" />
                <rect
                  x="44"
                  y="1"
                  width={Math.max(10, barWidth * actRatio)}
                  height="11"
                  rx="3"
                  fill="#0284c7"
                />
                <text x={50 + Math.max(10, barWidth * actRatio)} y="10" fill="#0369a1" fontSize={canvasSize.font(10)} fontWeight="bold">
                  {stat.actualMoles >= 100 ? `${stat.actualMoles.toFixed(0)}+` : stat.actualMoles.toFixed(2)} NA
                </text>
              </g>

              {/* 误判值对比条（若存在陷阱） */}
              <g transform="translate(0, 36)">
                <text x="0" y="10" fill={stat.isTrap ? '#dc2626' : '#64748b'} fontSize={canvasSize.font(10)} fontWeight="bold">
                  {stat.isTrap ? '误判值:' : '理论值:'}
                </text>
                <rect x="44" y="1" width={barWidth} height="11" rx="3" fill="#f1f5f9" />
                <rect
                  x="44"
                  y="1"
                  width={Math.max(10, barWidth * theoRatio)}
                  height="11"
                  rx="3"
                  fill={stat.isTrap ? '#ef4444' : '#94a3b8'}
                  stroke={stat.isTrap ? '#b91c1c' : 'none'}
                  strokeDasharray={stat.isTrap ? '2 2' : 'none'}
                />
                <text x={50 + Math.max(10, barWidth * theoRatio)} y="10" fill={stat.isTrap ? '#dc2626' : '#64748b'} fontSize={canvasSize.font(10)} fontWeight="bold">
                  {stat.theoreticalMoles.toFixed(2)} NA
                </text>
              </g>
            </g>
          )
        })}
      </g>
    </>
  )
}
