import React from 'react'
import { TestTubeApparatus } from '@/components/Chemistry/TestTubeApparatus'
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

    return (
      <g className="ion-single-virtual-bench">
        {/* ── 顶部实验状态指示横幅 ── */}
        <g transform="translate(420, 36)">
          <rect
            x={-300}
            y={-18}
            width={600}
            height={36}
            rx={18}
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth={1.5}
            filter="drop-shadow(0 2px 8px rgba(0, 0, 0, 0.04))"
          />
          <circle
            cx={-275}
            cy={0}
            r={5}
            fill={dropCount > 0 ? (currentReagent?.isOptimal ? '#10b981' : '#f59e0b') : '#3b82f6'}
          />
          <text
            x={-255}
            y={5}
            fill="#0f172a"
            fontSize={font(FONT.small)}
            fontWeight="bold"
          >
            待测样：{selectedIon.name}（{selectedIon.colorInSolution}） | 滴管试剂：{reagentName}
          </text>
          <text
            x={190}
            y={5}
            fill={dropCount > 0 ? (currentReagent?.isOptimal ? '#059669' : '#d97706') : '#2563eb'}
            fontSize={font(FONT.annotation)}
            fontWeight="bold"
          >
            {dropCount === 0 ? '⚡ 悬空待滴加' : state.stepTitle}
          </text>
        </g>

        {/* ── 规范操作提示条 (胶头滴管垂直悬空) ── */}
        <g transform="translate(420, 84)">
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fill="#64748b"
            fontSize={font(FONT.annotation)}
          >
            【规范】：胶头滴管垂直悬空于管口上方滴加，严禁伸入试管或触碰管壁
          </text>
        </g>

        {/* ── 胶头滴管交互系统 (完全无黑框，纯净 SVG 绘制) ── */}
        <g transform="translate(420, 105)">
          {/* 胶头滴管控制按钮胶囊 */}
          <g
            onClick={onDropReagent}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
          >
            <rect
              x={-100}
              y={-14}
              width={200}
              height={28}
              rx={14}
              fill={dropCount === 0 ? '#2563eb' : dropCount === 1 ? '#0284c7' : '#059669'}
              filter="drop-shadow(0 3px 8px rgba(37, 99, 235, 0.25))"
            />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fill="#ffffff"
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              {dropCount === 0
                ? `💧 滴加少量 ${reagentName.slice(0, 8)}`
                : dropCount === 1
                ? '💧 继续滴加 (过量)'
                : '✓ 反应已达终点'}
            </text>
          </g>

          {/* 真实胶头滴管物理绘制 */}
          <g transform="translate(0, 18)">
            {/* 橡胶乳头 */}
            <rect
              x={-8}
              y={0}
              width={16}
              height={16}
              rx={5}
              fill={dropCount > 0 ? '#ef4444' : '#dc2626'}
            />
            {/* 玻璃管身 */}
            <path
              d="M -5 16 L 5 16 L 3 52 L -3 52 Z"
              fill={withAlpha(SCENE_COLORS.materials.glass, 0.85)}
              stroke={SCENE_COLORS.materials.glassBorder}
              strokeWidth={1.2}
            />
            {/* 滴落的液滴 */}
            {dropCount > 0 ? (
              <g transform="translate(0, 60)">
                <circle cx={0} cy={8} r={3.5} fill="#2563eb" />
                <circle cx={0} cy={24} r={3} fill="#2563eb" opacity={0.7} />
              </g>
            ) : (
              <circle cx={0} cy={55} r={2.5} fill="#3b82f6" opacity={0.8} />
            )}
          </g>
        </g>

        {/* ── NH4+ 特有：酒精灯微热 ── */}
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
            <text x={45} y={15} fontSize={font(FONT.annotation)} fill="#d97706" fontWeight="bold">
              微热促使 NH₃ 逸出
            </text>
          </g>
        )}

        {/* ── 主实验试管（居中展示） ── */}
        <g transform="translate(388, 215)">
          {/* 试管背部环境淡影 */}
          <rect
            x={-4}
            y={-4}
            width={72}
            height={280}
            rx={36}
            fill="rgba(0, 0, 0, 0.02)"
          />

          <TestTubeApparatus
            x={0}
            y={0}
            width={64}
            height={270}
            fillColor={state.fillColor}
            fillLevel={state.fillLevel}
            precipitateLevel={state.precipitateLevel}
            precipitateColor={state.precipitateColor}
            font={font}
          />

          {/* 铜片 (NO3- 专属) */}
          {selectedIon.id === 'NO3-' && (
            <rect
              x={24}
              y={235}
              width={16}
              height={22}
              rx={2}
              fill="#b45309"
              stroke="#78350f"
              strokeWidth={1}
            />
          )}

          {/* 气泡产生 */}
          {state.hasGas && dropCount > 0 && (
            <g transform="translate(22, 80)">
              <circle cx={6} cy={20} r={3.5} fill="#ffffff" opacity={0.9} />
              <circle cx={14} cy={55} r={4.5} fill="#ffffff" opacity={0.85} />
              <circle cx={8} cy={90} r={3} fill="#ffffff" opacity={0.9} />
              <circle cx={16} cy={125} r={4} fill="#ffffff" opacity={0.85} />
            </g>
          )}

          {/* 红棕色气体 (NO3- 专属) */}
          {selectedIon.id === 'NO3-' && dropCount > 0 && (
            <ellipse cx={32} cy={-12} rx={26} ry={14} fill="rgba(180, 83, 9, 0.6)" />
          )}

          {/* 试管口湿润红色石蕊试纸 (NH4+ 专属规范) */}
          {selectedIon.id === 'NH4+' && (
            <g transform="translate(70, -25)">
              <line x1={50} y1={-18} x2={0} y2={12} stroke="#94a3b8" strokeWidth={2.5} />
              <rect
                x={-4}
                y={8}
                width={14}
                height={36}
                rx={2}
                fill={state.litmusChange ? '#2563eb' : '#f87171'}
                stroke={state.litmusChange ? '#1d4ed8' : '#ef4444'}
                strokeWidth={1}
              />
              <text
                x={18}
                y={28}
                fontSize={font(FONT.annotation)}
                fill={state.litmusChange ? '#1d4ed8' : '#b91c1c'}
                fontWeight="bold"
              >
                {state.litmusChange ? '湿润石蕊试纸变蓝' : '湿润红色石蕊试纸'}
              </text>
            </g>
          )}

          {/* 试管底部现象说明标签 */}
          <text
            x={32}
            y={310}
            textAnchor="middle"
            fill="#0f172a"
            fontSize={font(FONT.label)}
            fontWeight="bold"
          >
            {dropCount > 0
              ? `现象：${selectedIon.testPhenomenon.slice(0, 24)}`
              : `待测样液：${selectedIon.name}（${selectedIon.colorInSolution}）`}
          </text>
        </g>

        {/* ── 试管右侧化学相变与多阶段注解卡片 (加宽至 310px，杜绝截断) ── */}
        {dropCount > 0 && (
          <g transform="translate(470, 310)">
            <line x1={0} y1={0} x2={35} y2={0} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3 3" />
            <circle cx={0} cy={0} r={3} fill="#3b82f6" />
            <rect
              x={40}
              y={-20}
              width={310}
              height={40}
              rx={8}
              fill="#eff6ff"
              stroke="#bfdbfe"
              strokeWidth={1.2}
              filter="drop-shadow(0 2px 6px rgba(59, 130, 246, 0.1))"
            />
            <text
              x={50}
              y={4}
              fill="#1e40af"
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              {state.annotation}
            </text>
          </g>
        )}

        {/* ── 底部快捷重置实验按钮 ── */}
        {dropCount > 0 && (
          <g
            transform="translate(420, 580)"
            onClick={onResetReaction}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
          >
            <rect
              x={-70}
              y={-14}
              width={140}
              height={28}
              rx={14}
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth={1}
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

  // ── 共存排斥大烧杯场景 ──
  const cols = 4
  return (
    <g className="ion-coexistence-virtual-scene">
      {/* ── 顶部共存诊断徽章 ── */}
      <g transform="translate(420, 45)">
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

      {/* ── 烧杯大容器：微观离子混合体系 ── */}
      <g transform="translate(220, 105)">
        {/* 烧杯玻璃器皿 */}
        <rect
          x={0}
          y={0}
          width={400}
          height={360}
          rx={18}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.55)}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={2.5}
        />

        {/* 烧杯刻度 */}
        <line x1={30} y1={90} x2={60} y2={90} stroke="#94a3b8" strokeWidth={2} />
        <text x={70} y={95} fontSize={font(FONT.annotation)} fill="#94a3b8" fontWeight="bold">
          300mL
        </text>
        <line x1={30} y1={180} x2={50} y2={180} stroke="#94a3b8" strokeWidth={1.5} />
        <line x1={30} y1={270} x2={60} y2={270} stroke="#94a3b8" strokeWidth={2} />
        <text x={70} y={275} fontSize={font(FONT.annotation)} fill="#94a3b8" fontWeight="bold">
          100mL
        </text>

        {/* 烧杯内溶液液体 */}
        <rect
          x={4}
          y={70}
          width={392}
          height={286}
          rx={14}
          fill={
            conflicts.length > 0
              ? 'rgba(254, 242, 242, 0.85)' // 发生反应冲突浅红
              : 'rgba(240, 249, 255, 0.85)' // 澄清稳定共存清爽浅蓝
          }
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
            const posX = 80 + col * 85
            const posY = 130 + row * 70

            return (
              <g key={ion.id} transform={`translate(${posX}, ${posY})`}>
                <circle
                  r={24}
                  fill={ion.type === 'cation' ? '#dbeafe' : '#fef3c7'}
                  stroke={ion.type === 'cation' ? '#3b82f6' : '#f59e0b'}
                  strokeWidth={2}
                  filter="drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08))"
                />
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  fontSize={font(FONT.label)}
                  fontWeight="bold"
                  fill="#0f172a"
                >
                  {ion.id}
                </text>
              </g>
            )
          })
        )}

        {/* 沉淀特效分层 */}
        {conflicts.some((c) => c.type === 'precipitate' || c.type === 'double-hydrolysis') && (
          <g transform="translate(10, 325)">
            <ellipse cx={190} cy={16} rx={160} ry={12} fill="#94a3b8" opacity={0.85} />
            <text
              x={190}
              y={20}
              textAnchor="middle"
              fontSize={font(FONT.annotation)}
              fill="#ffffff"
              fontWeight="bold"
            >
              沉淀析出 (不溶物沉积于底部)
            </text>
          </g>
        )}
      </g>
    </g>
  )
}
