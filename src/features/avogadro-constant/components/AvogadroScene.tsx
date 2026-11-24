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
import { AvogadroStructureScene } from './AvogadroStructureScene'

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
          {chemistry.physicalState} ·{' '}
          {chemistry.isStateGas
            ? `Vm = ${chemistry.vmValue} L/mol`
            : params.temperatureCondition === 'standard'
            ? '标况非气体'
            : '常温非气体'}
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
            {chemistry.vmValue.toFixed(1)} L 空间容器 ({params.temperatureCondition === 'standard' ? '0℃' : '25℃'}, 101 kPa)
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
                同体积凝聚态粒子数远超气体基准
              </text>
            </g>
          )}

          {/* 中间体积落差指示对比区 (x: 195, y: 95) */}
          {(() => {
            const condensedSpec: Record<string, { mvMl: number; mvText: string; ratioText: string; labelText: string }> = {
              H2O: { mvMl: 18, mvText: '~18 mL', ratioText: '1244×', labelText: '实际液态体积' },
              SO3: { mvMl: 42, mvText: '~42 mL', ratioText: '537×', labelText: '实际聚集体积' },
              HF: { mvMl: 20, mvText: '~20 mL', ratioText: '1120×', labelText: '实际液态体积' },
              CCl4: { mvMl: 97, mvText: '~97 mL', ratioText: '231×', labelText: '实际液态体积' },
              CH3OH: { mvMl: 41, mvText: '~41 mL', ratioText: '553×', labelText: '实际液态体积' },
            }
            const spec = condensedSpec[params.stateItem] ?? {
              mvMl: 40,
              mvText: '~40 mL',
              ratioText: '500+×',
              labelText: '实际凝聚体积',
            }
            // 将 1 mol 凝聚态体积 (0~100 mL) 线性映射至右侧刻度线：25 mL -> y=170, 50 mL -> y=130, 75 mL -> y=90, 100 mL -> y=50
            const liquidTopY = Math.max(46, Math.min(205, 210 - (spec.mvMl / 25) * 40))
            const waveY = liquidTopY + Math.sin(animTime * 3) * 1.5
            const liquidHeight = Math.max(22, 228 - waveY)
            return (
              <>
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
                    <rect x="14" y="-6" width="54" height="18" rx="4" fill="#fee2e2" stroke="#fca5a5" strokeWidth="0.8" />
                    <text x="41" y="7" fill="#dc2626" fontSize={canvasSize.font(9.5)} textAnchor="middle" fontWeight="bold">
                      {spec.ratioText}
                    </text>
                    <text x="41" y="38" fill="#991b1b" fontSize={canvasSize.font(9)} textAnchor="middle">
                      体积落差
                    </text>
                  </g>
                ) : (
                  <g transform="translate(198, 105)">
                    <line x1="5" y1="10" x2="55" y2="10" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="30" y="4" fill="#0284c7" fontSize={canvasSize.font(9)} textAnchor="middle" fontWeight="bold">
                      气态同阶
                    </text>
                  </g>
                )}

                {/* 右室：真实 1 mol 物料体积对比管 */}
                <g transform="translate(270, 0)">
                  <rect x="0" y="0" width="85" height="235" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
                  <text x="42" y="24" fill="#334155" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
                    1 mol 真实物料
                  </text>

                  {/* 刻度线与标注 */}
                  {!chemistry.isStateGas &&
                    [50, 90, 130, 170].map((ly, idx) => (
                      <g key={idx}>
                        <line x1="68" y1={ly} x2="78" y2={ly} stroke="#94a3b8" strokeWidth="1" />
                        <text x="64" y={ly + 3} fill="#94a3b8" fontSize={canvasSize.font(7.5)} textAnchor="end">
                          {(4 - idx) * 25}mL
                        </text>
                      </g>
                    ))}

                  {/* 气态 vs 凝聚态填充示意（液面随 1 mol 真实体积与右侧刻度对齐） */}
                  <rect
                    x="6"
                    y={chemistry.isStateGas ? 42 : waveY}
                    width="73"
                    height={chemistry.isStateGas ? 186 : liquidHeight}
                    rx="4"
                    fill={chemistry.isStateGas ? '#38bdf8' : '#fb7175'}
                    opacity={chemistry.isStateGas ? 0.22 : 0.7}
                  />
                  <text
                    x="42"
                    y={chemistry.isStateGas ? 132 : 198}
                    fill={chemistry.isStateGas ? '#0369a1' : '#991b1b'}
                    fontSize={canvasSize.font(11)}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {chemistry.isStateGas ? `${chemistry.vmValue.toFixed(1)} L` : spec.mvText}
                  </text>
                  <text
                    x="42"
                    y={chemistry.isStateGas ? 150 : 214}
                    fill="#64748b"
                    fontSize={canvasSize.font(8.5)}
                    textAnchor="middle"
                  >
                    {chemistry.isStateGas ? '气体摩尔体积' : spec.labelText}
                  </text>
                </g>
              </>
            )
          })()}
        </g>
      )}

      {/* 2. 结构化学微观几何与成键拓扑 */}
      {params.trapCategory === 'structure-bonds' && (
        <AvogadroStructureScene
          structureItem={params.structureItem}
          animTime={animTime}
          font={canvasSize.font}
        />
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
          ) : params.electrolyteItem === 'pureH2O' ? (
            /* 纯水极微弱电离 */
            <g>
              <BeakerApparatus
                x={0}
                y={0}
                width={180}
                height={205}
                fillLevel={0.7}
                fillColor={withAlpha('#bae6fd', 0.55)}
                label="25℃ 纯水体系"
                font={canvasSize.font}
              />
              <circle cx="65" cy="95" r="18" fill="#0284c7" />
              <text x="65" y="99" fill="#ffffff" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">
                H₂O
              </text>
              <text x="98" y="99" fill="#0369a1" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                ⇌
              </text>
              <text x="135" y="98" fill="#dc2626" fontSize={canvasSize.font(10)} textAnchor="middle" fontWeight="bold">
                H⁺+OH⁻
              </text>
              <text x="90" y="235" fill="#0369a1" fontSize={canvasSize.font(11.5)} textAnchor="middle" fontWeight="bold">
                c(H⁺) = 10⁻⁷ mol/L (极微弱)
              </text>
            </g>
          ) : params.electrolyteItem === 'Na2CO3' ? (
            /* Na2CO3 水解使阴离子总数增加 */
            <g>
              <BeakerApparatus
                x={0}
                y={0}
                width={180}
                height={205}
                fillLevel={0.7}
                fillColor={SCENE_COLORS.reagent.solution}
                label="Na₂CO₃ 水解体系"
                font={canvasSize.font}
              />
              <circle cx="48" cy="92" r="18" fill="#0369a1" />
              <text x="48" y="96" fill="#ffffff" fontSize={canvasSize.font(8.5)} textAnchor="middle" fontWeight="bold">
                CO₃²⁻
              </text>
              <text x="82" y="96" fill="#0284c7" fontSize={canvasSize.font(13)} textAnchor="middle" fontWeight="bold">
                ⇌
              </text>
              <circle cx="122" cy="84" r="16" fill="#2563eb" />
              <text x="122" y="88" fill="#ffffff" fontSize={canvasSize.font(8)} textAnchor="middle" fontWeight="bold">
                HCO₃⁻
              </text>
              <circle cx="122" cy="122" r="14" fill="#dc2626" />
              <text x="122" y="126" fill="#ffffff" fontSize={canvasSize.font(8)} textAnchor="middle" fontWeight="bold">
                OH⁻
              </text>
              <text x="90" y="235" fill="#0369a1" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">
                1 个阴离子水解得 2 个阴离子
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
            /* 电子转移定量动画（依据当前 redoxItem 动态标注反应物、价态跃迁与电子转移数） */
            (() => {
              const redoxMeta = {
                'Cu-S': { fromVal: '0', toVal: '+1', bridge: '失 1e⁻ (Cu→Cu₂S)', caption: 'S 为弱氧化剂，1 mol Cu 转移 1 NA 电子' },
                'Na2O2-H2O': { fromVal: '-1', toVal: '0 / -2', bridge: '歧化转移 1e⁻', caption: '1 mol Na₂O₂ 歧化反应转移 1 NA 电子' },
                'NO2-H2O': { fromVal: '+4', toVal: '+5 / +2', bridge: '3 NO₂ 转移 2e⁻', caption: '1 mol NO₂ 歧化反应转移 2/3 NA 电子' },
                'SO2-O2-reversible': { fromVal: '+4', toVal: '+6', bridge: '可逆反应 < 2e⁻', caption: '可逆反应有限度，转移电子数 < 2·n(SO₂)' },
                'Fe-HNO3': { fromVal: '0', toVal: '+3', bridge: '失 3e⁻ (生成 Fe³⁺)', caption: '足量稀硝酸将 Fe 氧化为 +3 价，转移 3 NA' },
                'Cl2-NaOH': { fromVal: '0', toVal: '+1 / -1', bridge: '歧化转移 1e⁻', caption: '1 mol Cl₂ 歧化反应转移 1 NA 电子' },
              }[params.redoxItem] ?? {
                fromVal: '0',
                toVal: '+1 / -1',
                bridge: '歧化转移 1e⁻',
                caption: '1 mol Cl₂ 歧化反应转移 1 NA 电子',
              }
              return (
                <g>
                  <OxidationBridgeArrow
                    startPos={[-80, 0]}
                    endPos={[80, 0]}
                    label={redoxMeta.bridge}
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
                  <text x="-80" y="5" fill="#b45309" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">{redoxMeta.fromVal}</text>
                  <circle cx="80" cy="0" r="22" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                  <text x="80" y="5" fill="#15803d" fontSize={canvasSize.font(11)} textAnchor="middle" fontWeight="bold">{redoxMeta.toVal}</text>
                  <text x="0" y="65" fill="#334155" fontSize={canvasSize.font(12)} textAnchor="middle" fontWeight="bold">
                    {redoxMeta.caption}
                  </text>
                </g>
              )
            })()
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

              {/* 真实值对比条（isIndicative 的教学示意量以"示意值 + ≈"呈现，不伪装成精确计算结果） */}
              <g transform="translate(0, 20)">
                <text x="0" y="10" fill="#0369a1" fontSize={canvasSize.font(10)} fontWeight="bold">
                  {stat.isIndicative ? '示意值:' : '真实值:'}
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
                  {stat.isIndicative ? '≈' : ''}
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
