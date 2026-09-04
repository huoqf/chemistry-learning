/**
 * src/features/electrochemical-twin/components/ElectrochemicalTwinCenterView.tsx
 * 中屏探究视图：基于 CANVAS_PRESETS.full (840x650) 标准设计分辨率
 * - 60 FPS 电子流、离子定向漂移与电极气泡物理升腾动画
 * - 严格遵循三屏铁律：禁止手写包裹背景色，禁止堆砌 emoji，禁止长篇推导
 * - 布局严密垂直居中（Y: 195），黄金分割留白与工业级器材高光细节
 * - 模式 0：Cu-Zn 盐桥原电池 vs C-Cu 硫酸铜电解池 经典同屏镜像对比
 * - 模式 1：全钒液流电池放电态 (原电池) vs 充电态 (电解池) 同屏双态反转对比
 * - 模式 2：工业离子交换膜 (阳膜/阴膜/双极膜BPM) 多室电解槽居中全景
 * - 模式 3：法拉第电解定律与定量守恒 (Cu沉积增重 / O₂标况气量) 居中全景
 */

import React, { useState } from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { VectorArrow } from '@/components/Chemistry'
import { useAnimationViewport, useSceneScale } from '@/hooks'
import { CANVAS_PRESETS, CHEMISTRY_COLORS, SCENE_COLORS, withAlpha } from '@/theme'
import { useSimulationFrame } from '@/utils/animation'
import type { CellDetails, QuantResult, ElectrochemicalParams } from '../types'
import type { ModelQuizData } from '@/data/quiz'

interface Props {
  viewMode: number
  params: ElectrochemicalParams
  cellDetails: CellDetails
  quantResult: QuantResult
  quizData?: ModelQuizData
}

export const ElectrochemicalTwinCenterView: React.FC<Props> = ({
  viewMode,
  params,
  cellDetails: _cellDetails,
  quantResult,
  quizData,
}) => {
  // 标准 CANVAS_PRESETS.full (840x650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.full,
    anchor: 'center',
  })

  // 60 FPS 连续动画相位
  const [animProgress, setAnimProgress] = useState(0)

  useSimulationFrame(() => {
    setAnimProgress(prev => (prev + 0.012) % 1)
  })

  const tick = animProgress

  // 统一的字体缩放快捷调用
  const f = (size: number) => canvasSize.font(size)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      {viewMode === 0 && (
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          {/* ========================================================= */}
          {/* 模式 0：经典双池同屏镜像对比 (Cu-Zn 原电池 vs C-Cu 电解池) */}
          {/* ========================================================= */}
          {params.mode === 0 && (
            <>
              {/* ------------------------------------------------------- */}
              {/* 左池：自发原电池 (x: 60, y: 195, w: 310, h: 320) */}
              {/* ------------------------------------------------------- */}
              <g transform="translate(60, 195)">
                {/* 烧杯外框与双室结构 */}
                <rect
                  x="0"
                  y="0"
                  width="310"
                  height="320"
                  rx="10"
                  fill={withAlpha(SCENE_COLORS.container.beaker, 0.12)}
                  stroke={SCENE_COLORS.container.beakerBorder}
                  strokeWidth="2.5"
                />
                {/* 烧杯上沿卷边 */}
                <rect x="-4" y="-3" width="318" height="6" rx="3" fill="#94A3B8" opacity={0.6} />

                {/* 负极室溶液 (ZnSO4, 澄清) */}
                <rect x="4" y="60" width="148" height="256" rx="6" fill={withAlpha('#94A3B8', 0.15)} />
                {/* 正极室溶液 (CuSO4, 浅蓝) */}
                <rect x="158" y="60" width="148" height="256" rx="6" fill={withAlpha('#3B82F6', 0.22)} />

                {/* 溶液标签 */}
                <text x="78" y="295" textAnchor="middle" fill="#475569" fontSize={f(12)} fontWeight="bold">
                  ZnSO₄ 溶液
                </text>
                <text x="232" y="295" textAnchor="middle" fill="#1E40AF" fontSize={f(12)} fontWeight="bold">
                  CuSO₄ 溶液
                </text>

                {/* 负极 Zn 极板 */}
                <rect x="42" y="-50" width="30" height="250" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
                <rect x="38" y="-55" width="38" height="10" rx="2" fill="#334155" />
                <text x="57" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                  负极 (Zn)
                </text>
                <text x="57" y="100" textAnchor="middle" fill="#334155" fontSize={f(11)}>
                  Zn → Zn²⁺
                </text>

                {/* 正极 Cu 极板 */}
                <rect x="238" y="-50" width="30" height="250" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                <rect x="234" y="-55" width="38" height="10" rx="2" fill="#334155" />
                <text x="253" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                  正极 (Cu)
                </text>
                <text x="253" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                  Cu²⁺ → Cu
                </text>

                {/* 倒 U 型盐桥 (KCl 琼脂) */}
                <path
                  d="M 145 270 L 145 35 Q 155 20 165 35 L 165 270"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 145 270 L 145 35 Q 155 20 165 35 L 165 270"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="18"
                  strokeLinecap="round"
                  opacity={0.3}
                />
                <text x="155" y="14" textAnchor="middle" fill="#B45309" fontSize={f(11)} fontWeight="bold">
                  KCl 盐桥
                </text>

                {/* 外电路导线与电流计 */}
                <path d="M 57 -55 L 57 -105 L 253 -105 L 253 -55" fill="none" stroke="#334155" strokeWidth="3" />
                <circle cx="155" cy="-105" r="20" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                {/* 电流计刻度与指针偏转 */}
                <line x1="155" y1="-95" x2="167" y2="-117" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                <circle cx="155" cy="-95" r="2.5" fill="#0F172A" />
                <text x="155" y="-100" textAnchor="middle" fill="#0F172A" fontSize={f(10)} fontWeight="bold">
                  G
                </text>

                {/* 池体顶部学术标题 */}
                <rect x="55" y="-142" width="200" height="24" rx="4" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
                <text x="155" y="-126" textAnchor="middle" fill="#1D4ED8" fontSize={f(12)} fontWeight="bold">
                  原电池 (化学能 → 电能)
                </text>

                {/* 导线电子定向移动 (Zn 负极 → Cu 正极) */}
                {params.showElectrons === 1 && (
                  <g transform="translate(0, -105)">
                    <VectorArrow
                      originDesign={{ x: 57, y: 0 }}
                      vector={{ x: 50, y: 0 }}
                      type="electron"
                      sceneScale={sceneScale}
                      label="e⁻"
                      color={CHEMISTRY_COLORS.electron}
                    />
                    <circle cx={57 + tick * 65} cy={0} r="4" fill="#EF4444" />
                    <circle cx={155 + tick * 65} cy={0} r="4" fill="#EF4444" />
                  </g>
                )}

                {/* 盐桥离子定向漂移：K⁺往正极(右)，Cl⁻往负极(左) */}
                {params.showIons === 1 && (
                  <g>
                    <circle cx={155 + tick * 45} cy={160} r="5" fill="#3B82F6" />
                    <text x={155 + tick * 45} y={150} textAnchor="middle" fill="#2563EB" fontSize={f(10)} fontWeight="bold">
                      K⁺→
                    </text>

                    <circle cx={155 - tick * 45} cy={210} r="5" fill="#EF4444" />
                    <text x={155 - tick * 45} y={200} textAnchor="middle" fill="#DC2626" fontSize={f(10)} fontWeight="bold">
                      ←Cl⁻
                    </text>
                  </g>
                )}
              </g>

              {/* ------------------------------------------------------- */}
              {/* 右池：外接电解池 (x: 470, y: 195, w: 310, h: 320) */}
              {/* ------------------------------------------------------- */}
              <g transform="translate(470, 195)">
                <rect
                  x="0"
                  y="0"
                  width="310"
                  height="320"
                  rx="10"
                  fill={withAlpha(SCENE_COLORS.container.beaker, 0.12)}
                  stroke={SCENE_COLORS.container.beakerBorder}
                  strokeWidth="2.5"
                />
                <rect x="-4" y="-3" width="318" height="6" rx="3" fill="#94A3B8" opacity={0.6} />

                {/* 硫酸铜电解液 */}
                <rect x="4" y="60" width="302" height="256" rx="6" fill={withAlpha('#8B5CF6', 0.16)} />
                <text x="155" y="295" textAnchor="middle" fill="#5B21B6" fontSize={f(12)} fontWeight="bold">
                  CuSO₄ 电解质溶液
                </text>

                {/* 阳极 (石墨 C, 接电源正极) */}
                <rect x="42" y="-50" width="30" height="250" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
                <rect x="38" y="-55" width="38" height="10" rx="2" fill="#DC2626" />
                <text x="57" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                  阳极 (石墨 C)
                </text>
                <text x="57" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                  失 e⁻ 氧化
                </text>

                {/* 阴极 (纯铜 Cu, 接电源负极) */}
                <rect x="238" y="-50" width="30" height="250" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                <rect x="234" y="-55" width="38" height="10" rx="2" fill="#2563EB" />
                <text x="253" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                  阴极 (铜 Cu)
                </text>
                <text x="253" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                  得 e⁻ 还原
                </text>

                {/* 阴极铜沉积层 */}
                <rect x="232" y="70" width="6" height="130" rx="2" fill="#D97706" opacity={0.9} />
                <text x="253" y="235" textAnchor="middle" fill="#B45309" fontSize={f(11)} fontWeight="bold">
                  Cu 附着沉积
                </text>

                {/* 阳极 O2 气泡升腾 */}
                <g transform="translate(57, 150)">
                  <circle cx="-5" cy={-((tick * 70) % 70)} r="3.5" fill="#34D399" opacity={0.8} />
                  <circle cx="5" cy={-(((tick + 0.5) * 70) % 70)} r="4.5" fill="#34D399" opacity={0.9} />
                  <text x="-25" y="-50" fill="#047857" fontSize={f(11)} fontWeight="bold">
                    O₂ 气体↑
                  </text>
                </g>

                {/* 外接 DC 电源仪表盒 */}
                <path d="M 57 -55 L 57 -105 L 253 -105 L 253 -55" fill="none" stroke="#DC2626" strokeWidth="3" />
                <rect x="115" y="-123" width="80" height="36" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                <circle cx="130" cy="-105" r="5" fill="#EF4444" />
                <circle cx="180" cy="-105" r="5" fill="#3B82F6" />
                <text x="155" y="-100" textAnchor="middle" fill="#F8FAFC" fontSize={f(11)} fontWeight="bold">
                  + DC -
                </text>

                {/* 池体顶部学术标题 */}
                <rect x="55" y="-142" width="200" height="24" rx="4" fill="#F5F3FF" stroke="#DDD6FE" strokeWidth="1" />
                <text x="155" y="-126" textAnchor="middle" fill="#6D28D9" fontSize={f(12)} fontWeight="bold">
                  电解池 (电能 → 化学能)
                </text>

                {/* 电解池溶液离子流动：Cu²⁺往阴极，SO₄²⁻往阳极 */}
                {params.showIons === 1 && (
                  <g>
                    <circle cx={100 + tick * 90} cy={180} r="5" fill="#3B82F6" />
                    <text x={100 + tick * 90} y={170} textAnchor="middle" fill="#2563EB" fontSize={f(10)} fontWeight="bold">
                      Cu²⁺→
                    </text>

                    <circle cx={210 - tick * 90} cy={225} r="5" fill="#EF4444" />
                    <text x={210 - tick * 90} y={215} textAnchor="middle" fill="#DC2626" fontSize={f(10)} fontWeight="bold">
                      ←SO₄²⁻
                    </text>
                  </g>
                )}
              </g>
            </>
          )}

          {/* ========================================================= */}
          {/* 模式 1：全钒液流电池充放电双态同屏反转对比 */}
          {/* ========================================================= */}
          {params.mode === 1 && (
            <>
              {/* ------------------------------------------------------- */}
              {/* 左池：放电工作态 (原电池，x: 60, y: 195) */}
              {/* ------------------------------------------------------- */}
              <g transform="translate(60, 195)">
                <rect
                  x="0"
                  y="0"
                  width="310"
                  height="320"
                  rx="10"
                  fill={withAlpha(SCENE_COLORS.container.beaker, 0.12)}
                  stroke={SCENE_COLORS.container.beakerBorder}
                  strokeWidth="2.5"
                />
                <rect x="-4" y="-3" width="318" height="6" rx="3" fill="#94A3B8" opacity={0.6} />

                {/* 负极区 (紫色 V²⁺) */}
                <rect x="4" y="60" width="148" height="256" rx="6" fill={withAlpha('#7C3AED', 0.2)} />
                {/* 正极区 (黄色 VO₂⁺) */}
                <rect x="158" y="60" width="148" height="256" rx="6" fill={withAlpha('#F59E0B', 0.22)} />

                <text x="78" y="295" textAnchor="middle" fill="#6D28D9" fontSize={f(12)} fontWeight="bold">
                  V²⁺ / V³⁺ (负极电解液)
                </text>
                <text x="232" y="295" textAnchor="middle" fill="#B45309" fontSize={f(12)} fontWeight="bold">
                  VO₂⁺ / VO²⁺ (正极电解液)
                </text>

                {/* 负极 */}
                <rect x="42" y="-50" width="30" height="250" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
                <rect x="38" y="-55" width="38" height="10" rx="2" fill="#334155" />
                <text x="57" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                  负极 (-)
                </text>
                <text x="57" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                  V²⁺ - e⁻ → V³⁺
                </text>

                {/* 正极 */}
                <rect x="238" y="-50" width="30" height="250" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
                <rect x="234" y="-55" width="38" height="10" rx="2" fill="#334155" />
                <text x="253" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                  正极 (+)
                </text>
                <text x="253" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                  VO₂⁺ + e⁻ → VO²⁺
                </text>

                {/* 质子交换膜 (PEM) */}
                <rect x="149" y="30" width="12" height="286" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
                <text x="155" y="18" textAnchor="middle" fill="#B45309" fontSize={f(11)} fontWeight="bold">
                  质子膜
                </text>

                {/* 外电路导线与负载 */}
                <path d="M 57 -55 L 57 -105 L 253 -105 L 253 -55" fill="none" stroke="#334155" strokeWidth="3" />
                <circle cx="155" cy="-105" r="20" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                <text x="155" y="-100" textAnchor="middle" fill="#0F172A" fontSize={f(11)} fontWeight="bold">
                  A
                </text>

                <rect x="55" y="-142" width="200" height="24" rx="4" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                <text x="155" y="-126" textAnchor="middle" fill="#047857" fontSize={f(12)} fontWeight="bold">
                  放电态 (原电池：阳离子H⁺往正极)
                </text>

                {/* 质子定向穿膜 (放电：负极向正极，H⁺ 向右) */}
                <g>
                  <circle cx={125 + tick * 60} cy={180} r="5" fill="#2563EB" />
                  <text x={125 + tick * 60} y={170} textAnchor="middle" fill="#2563EB" fontSize={f(10)} fontWeight="bold">
                    H⁺→
                  </text>
                </g>
              </g>

              {/* ------------------------------------------------------- */}
              {/* 右池：充电工作态 (电解池，x: 470, y: 195) */}
              {/* ------------------------------------------------------- */}
              <g transform="translate(470, 195)">
                <rect
                  x="0"
                  y="0"
                  width="310"
                  height="320"
                  rx="10"
                  fill={withAlpha(SCENE_COLORS.container.beaker, 0.12)}
                  stroke={SCENE_COLORS.container.beakerBorder}
                  strokeWidth="2.5"
                />
                <rect x="-4" y="-3" width="318" height="6" rx="3" fill="#94A3B8" opacity={0.6} />

                {/* 阴极区 (绿色 V³⁺ 还原为紫色 V²⁺) */}
                <rect x="4" y="60" width="148" height="256" rx="6" fill={withAlpha('#10B981', 0.2)} />
                {/* 阳极区 (蓝色 VO²⁺ 氧化为黄色 VO₂⁺) */}
                <rect x="158" y="60" width="148" height="256" rx="6" fill={withAlpha('#3B82F6', 0.22)} />

                <text x="78" y="295" textAnchor="middle" fill="#047857" fontSize={f(12)} fontWeight="bold">
                  V³⁺ / V²⁺ (阴极再生区)
                </text>
                <text x="232" y="295" textAnchor="middle" fill="#1E40AF" fontSize={f(12)} fontWeight="bold">
                  VO²⁺ / VO₂⁺ (阳极再生区)
                </text>

                {/* 阴极 (接直流电源负极) */}
                <rect x="42" y="-50" width="30" height="250" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
                <rect x="38" y="-55" width="38" height="10" rx="2" fill="#2563EB" />
                <text x="57" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                  阴极 (接负极)
                </text>
                <text x="57" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                  V³⁺ + e⁻ → V²⁺
                </text>

                {/* 阳极 (接直流电源正极) */}
                <rect x="238" y="-50" width="30" height="250" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
                <rect x="234" y="-55" width="38" height="10" rx="2" fill="#DC2626" />
                <text x="253" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                  阳极 (接正极)
                </text>
                <text x="253" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                  VO²⁺ - e⁻ → VO₂⁺
                </text>

                {/* 质子交换膜 */}
                <rect x="149" y="30" width="12" height="286" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
                <text x="155" y="18" textAnchor="middle" fill="#B45309" fontSize={f(11)} fontWeight="bold">
                  质子膜
                </text>

                {/* 外接 DC 充电电源 */}
                <path d="M 57 -55 L 57 -105 L 253 -105 L 253 -55" fill="none" stroke="#DC2626" strokeWidth="3" />
                <rect x="115" y="-123" width="80" height="36" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                <circle cx="130" cy="-105" r="5" fill="#3B82F6" />
                <circle cx="180" cy="-105" r="5" fill="#EF4444" />
                <text x="155" y="-100" textAnchor="middle" fill="#F8FAFC" fontSize={f(11)} fontWeight="bold">
                  - DC +
                </text>

                <rect x="55" y="-142" width="200" height="24" rx="4" fill="#FDF2F8" stroke="#FBCFE8" strokeWidth="1" />
                <text x="155" y="-126" textAnchor="middle" fill="#BE185D" fontSize={f(12)} fontWeight="bold">
                  充电态 (电解池：阳离子H⁺往阴极)
                </text>

                {/* 质子定向穿膜 (充电：阳极向阴极，H⁺ 向左) */}
                <g>
                  <circle cx={185 - tick * 60} cy={180} r="5" fill="#2563EB" />
                  <text x={185 - tick * 60} y={170} textAnchor="middle" fill="#2563EB" fontSize={f(10)} fontWeight="bold">
                    ←H⁺
                  </text>
                </g>
              </g>
            </>
          )}

          {/* ========================================================= */}
          {/* 模式 2：工业离子交换膜多室电解槽居中全景 (x: 170, y: 195) */}
          {/* ========================================================= */}
          {params.mode === 2 && (
            <g transform="translate(170, 195)">
              {/* 大槽外框 */}
              <rect
                x="0"
                y="0"
                width="500"
                height="320"
                rx="12"
                fill={withAlpha(SCENE_COLORS.container.beaker, 0.12)}
                stroke={SCENE_COLORS.container.beakerBorder}
                strokeWidth="2.5"
              />
              <rect x="-4" y="-3" width="508" height="6" rx="3" fill="#94A3B8" opacity={0.6} />

              {/* 阳极室溶液 (NaCl) 与 阴极室溶液 (NaOH) */}
              <rect x="4" y="60" width="242" height="256" rx="6" fill={withAlpha('#3B82F6', 0.18)} />
              <rect x="254" y="60" width="242" height="256" rx="6" fill={withAlpha('#10B981', 0.18)} />

              <text x="125" y="295" textAnchor="middle" fill="#1E40AF" fontSize={f(13)} fontWeight="bold">
                阳极室 (饱和 NaCl 盐水)
              </text>
              <text x="375" y="295" textAnchor="middle" fill="#047857" fontSize={f(13)} fontWeight="bold">
                阴极室 (浓缩烧碱 NaOH 溶液)
              </text>

              {/* 阳极 (C, 接直流电源正极) */}
              <rect x="55" y="-50" width="30" height="250" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
              <rect x="51" y="-55" width="38" height="10" rx="2" fill="#DC2626" />
              <text x="70" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                阳极 (C)
              </text>
              <text x="70" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                2Cl⁻ - 2e⁻ → Cl₂↑
              </text>

              {/* 阴极 (Fe/C, 接直流电源负极) */}
              <rect x="415" y="-50" width="30" height="250" rx="4" fill="#64748B" stroke="#334155" strokeWidth="2" />
              <rect x="411" y="-55" width="38" height="10" rx="2" fill="#2563EB" />
              <text x="430" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                阴极 (Fe/C)
              </text>
              <text x="430" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                2H₂O + 2e⁻ → H₂↑ + 2OH⁻
              </text>

              {/* 中央隔膜 */}
              <rect
                x="242"
                y="20"
                width="16"
                height="296"
                rx="2"
                fill={params.membraneType === 3 ? '#A855F7' : '#F59E0B'}
                stroke="#D97706"
                strokeDasharray={params.membraneType > 0 ? '5 3' : 'none'}
                strokeWidth="2"
              />
              <text x="250" y="12" textAnchor="middle" fill="#B45309" fontSize={f(11)} fontWeight="bold">
                {params.membraneType === 0
                  ? '多孔隔膜'
                  : params.membraneType === 1
                  ? '阳离子交换膜 (只透Na⁺)'
                  : params.membraneType === 2
                  ? '阴离子交换膜 (只透Cl⁻)'
                  : '双极膜 (BPM 水解离)'}
              </text>

              {/* 外接 DC 电源 */}
              <path d="M 70 -55 L 70 -105 L 430 -105 L 430 -55" fill="none" stroke="#DC2626" strokeWidth="3" />
              <rect x="210" y="-123" width="80" height="36" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="225" cy="-105" r="5" fill="#EF4444" />
              <circle cx="275" cy="-105" r="5" fill="#3B82F6" />
              <text x="250" y="-100" textAnchor="middle" fill="#F8FAFC" fontSize={f(11)} fontWeight="bold">
                + DC -
              </text>

              <rect x="150" y="-142" width="200" height="24" rx="4" fill="#F5F3FF" stroke="#DDD6FE" strokeWidth="1" />
              <text x="250" y="-126" textAnchor="middle" fill="#6D28D9" fontSize={f(12)} fontWeight="bold">
                离子膜电解池 (氯碱工业模型)
              </text>

              {/* 阳极 Cl₂ 黄绿色气泡 */}
              <g transform="translate(70, 150)">
                <circle cx="-6" cy={-((tick * 70) % 70)} r="3.5" fill="#10B981" opacity={0.85} />
                <circle cx="6" cy={-(((tick + 0.5) * 70) % 70)} r="4.5" fill="#10B981" opacity={0.9} />
                <text x="-32" y="-50" fill="#047857" fontSize={f(11)} fontWeight="bold">
                  Cl₂ 气体↑
                </text>
              </g>

              {/* 阴极 H₂ 气泡 */}
              <g transform="translate(430, 150)">
                <circle cx="-6" cy={-((tick * 70) % 70)} r="3" fill="#60A5FA" opacity={0.8} />
                <circle cx="6" cy={-(((tick + 0.5) * 70) % 70)} r="4" fill="#60A5FA" opacity={0.9} />
                <text x="-15" y="-50" fill="#2563EB" fontSize={f(11)} fontWeight="bold">
                  H₂ 气体↑
                </text>
              </g>

              {/* 膜定向穿透微粒 */}
              {params.membraneType === 1 && (
                <g>
                  <circle cx={205 + tick * 90} cy={180} r="5" fill="#3B82F6" />
                  <text x={205 + tick * 90} y={170} textAnchor="middle" fill="#2563EB" fontSize={f(11)} fontWeight="bold">
                    Na⁺→
                  </text>
                </g>
              )}
              {params.membraneType === 2 && (
                <g>
                  <circle cx={295 - tick * 90} cy={180} r="5" fill="#EF4444" />
                  <text x={295 - tick * 90} y={170} textAnchor="middle" fill="#DC2626" fontSize={f(11)} fontWeight="bold">
                    ←Cl⁻
                  </text>
                </g>
              )}
              {params.membraneType === 3 && (
                <g>
                  <circle cx={250 - tick * 60} cy={170} r="5" fill="#2563EB" />
                  <text x={250 - tick * 60} y={158} textAnchor="middle" fill="#2563EB" fontSize={f(10)} fontWeight="bold">
                    ←H⁺
                  </text>
                  <circle cx={250 + tick * 60} cy={215} r="5" fill="#EF4444" />
                  <text x={250 + tick * 60} y={203} textAnchor="middle" fill="#DC2626" fontSize={f(10)} fontWeight="bold">
                    OH⁻→
                  </text>
                </g>
              )}
            </g>
          )}

          {/* ========================================================= */}
          {/* 模式 3：法拉第电解定律与定量守恒电解槽居中全景 (x: 170, y: 195) */}
          {/* ========================================================= */}
          {params.mode === 3 && (
            <g transform="translate(170, 195)">
              <rect
                x="0"
                y="0"
                width="500"
                height="320"
                rx="12"
                fill={withAlpha(SCENE_COLORS.container.beaker, 0.12)}
                stroke={SCENE_COLORS.container.beakerBorder}
                strokeWidth="2.5"
              />
              <rect x="-4" y="-3" width="508" height="6" rx="3" fill="#94A3B8" opacity={0.6} />

              <rect x="4" y="60" width="492" height="256" rx="6" fill={withAlpha('#3B82F6', 0.18)} />
              <text x="250" y="295" textAnchor="middle" fill="#1E40AF" fontSize={f(13)} fontWeight="bold">
                CuSO₄ 溶液 (c₀ = {params.electrolyteConc} mol/L)
              </text>

              {/* 阳极 (Pt 惰性极板) */}
              <rect x="65" y="-50" width="30" height="250" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
              <rect x="61" y="-55" width="38" height="10" rx="2" fill="#DC2626" />
              <text x="80" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                阳极 (Pt)
              </text>
              <text x="80" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                4OH⁻ - 4e⁻ → O₂↑
              </text>

              {/* 阴极 (Cu 极板，析出增重) */}
              <rect x="405" y="-50" width="30" height="250" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              <rect x="401" y="-55" width="38" height="10" rx="2" fill="#2563EB" />
              <text x="420" y="-66" textAnchor="middle" fill="#1E293B" fontSize={f(13)} fontWeight="bold">
                阴极 (Cu)
              </text>
              <text x="420" y="100" textAnchor="middle" fill="#FFFFFF" fontSize={f(11)}>
                Cu²⁺ + 2e⁻ → Cu
              </text>

              {/* Cu 附着增厚层 */}
              <rect x="398" y="70" width="7" height="140" rx="2" fill="#D97706" opacity={0.9} />
              <text x="420" y="240" textAnchor="middle" fill="#B45309" fontSize={f(12)} fontWeight="bold">
                Δm(Cu) = +{quantResult.massChangeRight} g
              </text>

              {/* 阳极气泡与定量产物标注 */}
              <g transform="translate(80, 150)">
                <circle cx="-6" cy={-((tick * 70) % 70)} r="3.5" fill="#34D399" opacity={0.8} />
                <circle cx="6" cy={-(((tick + 0.5) * 70) % 70)} r="4.5" fill="#34D399" opacity={0.9} />
                <text x="-35" y="-50" fill="#047857" fontSize={f(12)} fontWeight="bold">
                  V(O₂) = {quantResult.gasVolumeRight} L
                </text>
              </g>

              {/* 外接 DC 电源 */}
              <path d="M 80 -55 L 80 -105 L 420 -105 L 420 -55" fill="none" stroke="#DC2626" strokeWidth="3" />
              <rect x="210" y="-123" width="80" height="36" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="225" cy="-105" r="5" fill="#EF4444" />
              <circle cx="275" cy="-105" r="5" fill="#3B82F6" />
              <text x="250" y="-100" textAnchor="middle" fill="#F8FAFC" fontSize={f(11)} fontWeight="bold">
                + DC -
              </text>

              {/* 居中定量参数徽章 */}
              <rect x="140" y="-142" width="220" height="24" rx="4" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
              <text x="250" y="-126" textAnchor="middle" fill="#1D4ED8" fontSize={f(12)} fontWeight="bold">
                I = {params.currentAmp} A | t = {params.timeSec} s | n(e⁻) = {quantResult.molesElectron} mol
              </text>

              {/* 溶液离子流动 */}
              {params.showIons === 1 && (
                <g>
                  <circle cx={140 + tick * 180} cy={180} r="5" fill="#3B82F6" />
                  <text x={140 + tick * 180} y={170} textAnchor="middle" fill="#2563EB" fontSize={f(11)} fontWeight="bold">
                    Cu²⁺→
                  </text>

                  <circle cx={340 - tick * 180} cy={220} r="5" fill="#EF4444" />
                  <text x={340 - tick * 180} y={210} textAnchor="middle" fill="#DC2626" fontSize={f(11)} fontWeight="bold">
                    ←SO₄²⁻
                  </text>
                </g>
              )}
            </g>
          )}
        </AnimationSvgCanvas>
      )}

      {/* 规范踩分 ViewMode 1 */}
      {viewMode === 1 && quizData && (
        <div className="w-full max-w-4xl mx-auto py-6 px-4 overflow-y-auto">
          <ScoringCardSection steps={quizData.scoringSteps} />
        </div>
      )}

      {/* 真题研析 ViewMode 2 */}
      {viewMode === 2 && quizData && (
        <div className="w-full max-w-4xl mx-auto py-6 px-4 overflow-y-auto">
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        </div>
      )}
    </div>
  )
}
