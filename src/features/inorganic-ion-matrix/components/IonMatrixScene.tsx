import React from 'react'
import {
  TestTubeApparatus,
  DropperApparatus,
  BeakerApparatus,
} from '@/components/Chemistry'
import type { IonItem, CoexistenceConflict, ReagentOption } from '../types'
import { SCENE_COLORS, FONT, withAlpha } from '@/theme'
import { computeStepChemistry } from './IonMatrixChemistry'

interface IonMatrixSceneProps {
  mode: 'single-test' | 'coexistence-check'
  selectedIon?: IonItem
  selectedReagent?: ReagentOption
  dropCount: number // 0: 初始, 1: 少量/第一步, 2: 过量/第二步
  coexistenceIons: IonItem[]
  conflicts: CoexistenceConflict[]
  font: (size: number) => number
  onDropReagent?: () => void
  onResetReaction?: () => void
}

export const IonMatrixScene: React.FC<IonMatrixSceneProps> = ({
  mode,
  selectedIon,
  selectedReagent,
  dropCount,
  coexistenceIons,
  conflicts,
  font,
  onDropReagent,
  onResetReaction,
}) => {
  if (mode === 'single-test') {
    if (!selectedIon) return null

    const currentReagent = selectedReagent || selectedIon.reagentOptions?.[0]
    const reagentName = currentReagent ? currentReagent.name : selectedIon.testReagent.split(' ')[0]

    // 严谨计算当前滴加阶段的物理相变
    const state = computeStepChemistry(
      selectedIon.id,
      currentReagent?.id || '',
      dropCount,
      selectedIon.colorRgb
    )

    // 滴管液体颜色匹配所选试剂
    const dropperLiquidColor = currentReagent?.resultColor
      ? withAlpha(currentReagent.resultColor, 0.75)
      : 'rgba(56, 189, 248, 0.65)'
    const dropperDropColor = currentReagent?.resultColor || '#0284c7'

    // 解析相变卡片的标题与机理正文
    let annotationTitle = '相变原理解析'
    let annotationDetail = state.annotation
    if (state.annotation.includes('】：')) {
      const parts = state.annotation.split('】：')
      annotationTitle = parts[0].replace('【', '')
      annotationDetail = parts[1]
    } else if (state.annotation.includes('：')) {
      const parts = state.annotation.split('：')
      annotationTitle = parts[0]
      annotationDetail = parts[1]
    }

    return (
      <g className="ion-single-virtual-bench select-none">
        <defs>
          {/* 按钮轻微渐变与滤镜 */}
          <linearGradient id="dropperBtnGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="dropperBtnGradStep2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="dropperBtnGradSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.06" />
          </filter>
        </defs>

        {/* ── 1. 顶部实验状态与指示横幅 ── */}
        <g transform="translate(420, 32)">
          <rect
            x={-310}
            y={-17}
            width={620}
            height={34}
            rx={17}
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth={1.5}
            filter="url(#cardShadow)"
          />
          {/* 状态指示点 */}
          <circle
            cx={-285}
            cy={0}
            r={5}
            fill={dropCount > 0 ? (currentReagent?.isOptimal ? '#10b981' : '#f59e0b') : '#3b82f6'}
          />
          {/* 待测样品与试剂标注 */}
          <text
            x={-268}
            y={5}
            fill="#0f172a"
            fontSize={font(FONT.small)}
            fontWeight="bold"
          >
            待测样：{selectedIon.name}（{selectedIon.colorInSolution}）
          </text>
          <text
            x={10}
            y={5}
            fill="#64748b"
            fontSize={font(FONT.annotation)}
          >
            | 滴管：{reagentName}
          </text>
          {/* 实验阶段徽章 */}
          <g transform="translate(205, 0)">
            <rect
              x={-85}
              y={-11}
              width={170}
              height={22}
              rx={11}
              fill={dropCount > 0 ? (currentReagent?.isOptimal ? '#ecfdf5' : '#fffbeb') : '#eff6ff'}
              stroke={dropCount > 0 ? (currentReagent?.isOptimal ? '#a7f3d0' : '#fde68a') : '#bfdbfe'}
              strokeWidth={1}
            />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fill={dropCount > 0 ? (currentReagent?.isOptimal ? '#047857' : '#b45309') : '#1d4ed8'}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              {dropCount === 0 ? '⚡ 待滴加试剂' : state.stepTitle}
            </text>
          </g>
        </g>

        {/* ── 2. 操作交互控制区 (居中胶囊按钮，绝不压盖滴管) ── */}
        <g transform="translate(420, 80)">
          {/* 滴加试剂主交互按钮 */}
          <g
            onClick={onDropReagent}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            className="transition-transform hover:opacity-95"
          >
            <rect
              x={-120}
              y={-17}
              width={240}
              height={34}
              rx={17}
              fill={
                dropCount === 0
                  ? 'url(#dropperBtnGradPrimary)'
                  : dropCount === 1
                  ? 'url(#dropperBtnGradStep2)'
                  : 'url(#dropperBtnGradSuccess)'
              }
              filter="drop-shadow(0 3px 10px rgba(37, 99, 235, 0.28))"
            />
            {/* 按钮微图标水滴 */}
            <circle cx={-92} cy={0} r={4} fill="#ffffff" opacity={0.9} />
            <text
              x={-80}
              y={5}
              fill="#ffffff"
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              {dropCount === 0
                ? `点击滴加：${reagentName.slice(0, 8)}`
                : dropCount === 1
                ? '点击继续滴加 (过量)'
                : '✓ 反应完成 (再次点击重做)'}
            </text>
          </g>
        </g>

        {/* ── 3. 实验规范悬空指引标注 (在滴管左上方，清晰独立) ── */}
        <g transform="translate(420, 118)">
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fill="#64748b"
            fontSize={font(FONT.annotation)}
          >
            【规范操作】胶头滴管垂直悬空于管口上方 1~2 cm 滴加，严禁触碰管壁
          </text>
        </g>

        {/* ── 4. 实验核心场景：焰色试验 vs 试管滴加 ── */}
        {state.isFlameTest ? (
          <g className="chem-flame-test-scene" transform="translate(420, 240)">
            {/* 酒精喷灯底座与灯管 */}
            <g transform="translate(0, 180)">
              {/* 底座 */}
              <ellipse cx={0} cy={30} rx={50} ry={12} fill="#64748b" stroke="#475569" strokeWidth={1.5} />
              <rect x={-35} y={15} width={70} height={15} fill="#94a3b8" />
              {/* 喷嘴 */}
              <path d="M -8 15 L -6 -60 L 6 -60 L 8 15 Z" fill="#b45309" stroke="#78350f" strokeWidth={1.5} />
              <rect x={-10} y={-64} width={20} height={6} rx={2} fill="#d97706" />
            </g>

            {/* 本生灯火焰 */}
            <g transform="translate(0, 110)">
              {/* 外焰 */}
              <path
                d="M 0 -85 Q -32 -20 0 0 Q 32 -20 0 -85 Z"
                fill={dropCount > 0 ? (state.flameColor || '#facc15') : 'rgba(147, 197, 253, 0.45)'}
                filter="drop-shadow(0 0 16px rgba(250, 204, 21, 0.6))"
                opacity={0.9}
              />
              {/* 内焰 */}
              <path
                d="M 0 -55 Q -18 -15 0 0 Q 18 -15 0 -55 Z"
                fill={dropCount > 0 ? (state.flameColor ? withAlpha(state.flameColor, 0.8) : '#fef08a') : 'rgba(96, 165, 250, 0.7)'}
              />
              {/* 焰心 */}
              <path d="M 0 -25 Q -8 -8 0 0 Q 8 -8 0 -25 Z" fill="#ffffff" opacity={0.8} />
            </g>

            {/* 光洁铂丝 (带环形尖端浸入外焰) */}
            <g transform="translate(-60, 50)">
              <rect x={-110} y={-4} width={90} height={8} rx={3} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1.2} />
              <line x1={-20} y1={0} x2={55} y2={0} stroke="#cbd5e1" strokeWidth={2} />
              <circle cx={58} cy={0} r={4} fill="none" stroke="#f8fafc" strokeWidth={2} />
              <text x={-65} y={-10} fontSize={font(FONT.annotation)} fill="#64748b" textAnchor="middle">
                光洁铂丝 (蘸取试样灼烧)
              </text>
            </g>

            {/* 蓝色钴玻璃滤光片 (K+ 专属) */}
            {state.hasCobaltGlass && (
              <g transform="translate(60, 45)">
                <rect
                  x={-15}
                  y={-50}
                  width={60}
                  height={90}
                  rx={4}
                  fill="rgba(30, 58, 138, 0.75)"
                  stroke="#1e3a8a"
                  strokeWidth={2}
                  filter="drop-shadow(0 4px 12px rgba(30, 58, 138, 0.4))"
                />
                <text
                  x={15}
                  y={55}
                  textAnchor="middle"
                  fontSize={font(FONT.annotation)}
                  fill="#1e3a8a"
                  fontWeight="bold"
                >
                  蓝色钴玻璃
                </text>
              </g>
            )}
          </g>
        ) : (
          <>
            {/* ── 4. 标准胶头滴管组件 (尖嘴悬空于试管口) ── */}
            <g className="dropper-interactive-apparatus" onClick={onDropReagent} style={{ cursor: 'pointer' }}>
              <DropperApparatus
                x={420}
                y={240}
                bodyHeight={65}
                bodyWidth={11}
                liquidLevel={dropCount === 0 ? 0.78 : dropCount === 1 ? 0.42 : 0.15}
                liquidColor={dropperLiquidColor}
                isSqueezed={dropCount > 0}
                bulbColor={dropCount > 0 ? '#dc2626' : '#ef4444'}
                dropProgress={dropCount === 1 ? 0.75 : dropCount === 2 ? 0.92 : 0}
                dropColor={dropperDropColor}
              />
            </g>

            {/* 滴管尖端悬空标尺微标注 (学术严谨度提升) */}
            <g transform="translate(438, 240)">
              <line x1={0} y1={0} x2={8} y2={0} stroke="#94a3b8" strokeWidth={1} />
              <line x1={4} y1={0} x2={4} y2={25} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
              <line x1={0} y1={25} x2={8} y2={25} stroke="#94a3b8" strokeWidth={1} />
              <text x={12} y={15} fontSize={font(FONT.annotation)} fill="#64748b">
                悬空 1~2cm
              </text>
            </g>

            {/* ── 5. NH4+ 特有：酒精灯微热 ── */}
            {selectedIon.id === 'NH4+' && dropCount > 0 && (
              <g transform="translate(420, 520)">
                <path
                  d="M -24 35 L 24 35 L 16 10 L -16 10 Z"
                  fill={withAlpha(SCENE_COLORS.materials.glass, 0.75)}
                  stroke={SCENE_COLORS.materials.glassBorder}
                  strokeWidth={1.5}
                />
                <rect x={-3} y={0} width={6} height={10} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
                <path
                  d="M 0 -22 Q -12 -5 0 0 Q 12 -5 0 -22 Z"
                  fill="#f97316"
                  filter="drop-shadow(0 0 8px rgba(249, 115, 22, 0.7))"
                />
                <path d="M 0 -14 Q -6 -3 0 0 Q 6 -3 0 -14 Z" fill="#fde047" />
                <text x={42} y={15} fontSize={font(FONT.annotation)} fill="#d97706" fontWeight="bold">
                  微热促使 NH₃ 挥发
                </text>
              </g>
            )}

            {/* ── 6. 主实验试管（居中规范定标） ── */}
            <g className="chem-test-tube-container" transform="translate(388, 265)">
              {/* 试管背部环境浅淡柔光 */}
              <rect
                x={-4}
                y={-4}
                width={72}
                height={248}
                rx={34}
                fill="rgba(0, 0, 0, 0.02)"
              />

              <TestTubeApparatus
                x={0}
                y={0}
                width={64}
                height={240}
                fillColor={state.fillColor}
                fillLevel={state.fillLevel}
                precipitateLevel={state.precipitateLevel}
                precipitateColor={state.precipitateColor}
                font={font}
              />

              {/* 铜片 (NO3- 专属反应) */}
              {selectedIon.id === 'NO3-' && (
                <rect
                  x={24}
                  y={210}
                  width={16}
                  height={20}
                  rx={2}
                  fill="#b45309"
                  stroke="#78350f"
                  strokeWidth={1}
                />
              )}

              {/* 气泡产生 */}
              {state.hasGas && dropCount > 0 && (
                <g transform="translate(22, 70)">
                  <circle cx={6} cy={20} r={3.5} fill="#ffffff" opacity={0.9} />
                  <circle cx={14} cy={50} r={4.5} fill="#ffffff" opacity={0.85} />
                  <circle cx={8} cy={80} r={3} fill="#ffffff" opacity={0.9} />
                  <circle cx={16} cy={110} r={4} fill="#ffffff" opacity={0.85} />
                </g>
              )}

              {/* 红棕色气体 (NO3- 专属) */}
              {selectedIon.id === 'NO3-' && dropCount > 0 && (
                <ellipse cx={32} cy={-12} rx={26} ry={14} fill="rgba(180, 83, 9, 0.6)" />
              )}

              {/* 试管口湿润红色石蕊试纸 (NH4+ 专属规范) */}
              {selectedIon.id === 'NH4+' && (
                <g transform="translate(70, -20)">
                  <line x1={45} y1={-15} x2={0} y2={10} stroke="#94a3b8" strokeWidth={2.5} />
                  <rect
                    x={-4}
                    y={8}
                    width={14}
                    height={34}
                    rx={2}
                    fill={state.litmusChange ? '#2563eb' : '#f87171'}
                    stroke={state.litmusChange ? '#1d4ed8' : '#ef4444'}
                    strokeWidth={1}
                  />
                  <text
                    x={18}
                    y={26}
                    fontSize={font(FONT.annotation)}
                    fill={state.litmusChange ? '#1d4ed8' : '#b91c1c'}
                    fontWeight="bold"
                  >
                    {state.litmusChange ? '湿润石蕊试纸变蓝' : '湿润红色石蕊试纸'}
                  </text>
                </g>
              )}
            </g>
          </>
        )}

        {/* ── 7. 试管右侧化学相变与原理解析卡片 (两行排版，安全宽度) ── */}
        {dropCount > 0 && (
          <g transform="translate(468, 360)">
            {/* 指向液面的虚线引线与连接圆点 */}
            <line x1={-16} y1={0} x2={16} y2={0} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3 3" />
            <circle cx={-16} cy={0} r={3} fill="#3b82f6" />
            <rect
              x={20}
              y={-28}
              width={280}
              height={56}
              rx={10}
              fill="#eff6ff"
              stroke="#bfdbfe"
              strokeWidth={1.2}
              filter="url(#cardShadow)"
            />
            {/* 卡片内标题行 */}
            <text
              x={32}
              y={-10}
              fill="#1e40af"
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              📌 {annotationTitle}
            </text>
            {/* 卡片内详细机理/方程式行 */}
            <text
              x={32}
              y={14}
              fill="#334155"
              fontSize={font(FONT.annotation)}
              fontWeight="medium"
            >
              {annotationDetail.length > 20 ? annotationDetail.slice(0, 20) + '...' : annotationDetail}
            </text>
          </g>
        )}

        {/* ── 8. 试管底部现象说明展示标牌 ── */}
        <g transform="translate(420, 526)">
          <rect
            x={-240}
            y={-15}
            width={480}
            height={30}
            rx={8}
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth={1}
            filter="drop-shadow(0 1px 4px rgba(0, 0, 0, 0.03))"
          />
          <text
            x={0}
            y={5}
            textAnchor="middle"
            fill="#0f172a"
            fontSize={font(FONT.annotation)}
            fontWeight="bold"
          >
            {dropCount > 0
              ? `【实验现象】：${selectedIon.testPhenomenon}`
              : `【待测原液】：${selectedIon.name} · 溶液呈${selectedIon.colorInSolution}`}
          </text>
        </g>

        {/* ── 9. 底部快捷重置实验按钮 ── */}
        {dropCount > 0 && (
          <g
            transform="translate(420, 575)"
            onClick={onResetReaction}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            className="transition-opacity hover:opacity-85"
          >
            <rect
              x={-80}
              y={-13}
              width={160}
              height={26}
              rx={13}
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth={1}
              filter="drop-shadow(0 1px 3px rgba(0, 0, 0, 0.05))"
            />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fill="#475569"
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ↺ 清空试管重新实验
            </text>
          </g>
        )}
      </g>
    )
  }

  // ── 共存排斥大容器场景 (采用标准 BeakerApparatus 烧杯组件) ──
  const cols = 4
  const hasPrecipitateConflict = conflicts.some(
    (c) => c.type === 'precipitate' || c.type === 'double-hydrolysis'
  )

  return (
    <g className="ion-coexistence-virtual-scene select-none">
      {/* ── 顶部共存诊断徽章 ── */}
      <g transform="translate(420, 42)">
        <rect
          x={-280}
          y={-18}
          width={560}
          height={36}
          rx={18}
          fill={conflicts.length === 0 ? '#f0fdf4' : '#fef2f2'}
          stroke={conflicts.length === 0 ? '#86efac' : '#fca5a5'}
          strokeWidth={1.5}
          filter="drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04))"
        />
        <text
          x={0}
          y={5}
          textAnchor="middle"
          fontSize={font(FONT.small)}
          fontWeight="bold"
          fill={conflicts.length === 0 ? '#15803d' : '#b91c1c'}
        >
          {conflicts.length === 0
            ? `✓ 已选 ${coexistenceIons.length} 种离子，体系无冲突可大量共存`
            : `⚠ 检测到 ${conflicts.length} 组互斥反应，无法大量共存`}
        </text>
      </g>

      {/* ── 烧杯标准器材组件：微观离子混合体系 ── */}
      <g className="chem-beaker-container" transform="translate(220, 95)">
        <BeakerApparatus
          x={0}
          y={0}
          width={400}
          height={380}
          fillLevel={coexistenceIons.length > 0 ? 0.72 : 0}
          fillColor={
            conflicts.length > 0
              ? 'rgba(254, 226, 226, 0.7)' // 冲突浅红
              : 'rgba(224, 242, 254, 0.7)' // 稳定浅蓝
          }
          precipitateLevel={hasPrecipitateConflict ? 0.16 : 0}
          precipitateColor="#94a3b8"
          label="500mL"
          font={font}
        />

        {/* 烧杯内离子悬浮球 */}
        {coexistenceIons.length === 0 ? (
          <text
            x={200}
            y={210}
            textAnchor="middle"
            fontSize={font(FONT.label)}
            fill="#94a3b8"
            fontWeight="bold"
          >
            ← 请在左侧勾选待检测离子
          </text>
        ) : (
          coexistenceIons.map((ion, idx) => {
            const row = Math.floor(idx / cols)
            const col = idx % cols
            const posX = 75 + col * 85
            const posY = 155 + row * 65

            return (
              <g key={ion.id} transform={`translate(${posX}, ${posY})`}>
                <circle
                  r={22}
                  fill={ion.type === 'cation' ? '#dbeafe' : '#fef3c7'}
                  stroke={ion.type === 'cation' ? '#3b82f6' : '#f59e0b'}
                  strokeWidth={2}
                  filter="drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08))"
                />
                <text
                  x={0}
                  y={5}
                  textAnchor="middle"
                  fontSize={font(FONT.annotation)}
                  fontWeight="bold"
                  fill="#0f172a"
                >
                  {ion.id}
                </text>
              </g>
            )
          })
        )}

        {/* 沉淀文字标注 */}
        {hasPrecipitateConflict && (
          <text
            x={200}
            y={355}
            textAnchor="middle"
            fontSize={font(FONT.annotation)}
            fill="#ffffff"
            fontWeight="bold"
            filter="drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))"
          >
            沉淀析出（难溶物/微溶物沉积于烧杯底部）
          </text>
        )}
      </g>
    </g>
  )
}
