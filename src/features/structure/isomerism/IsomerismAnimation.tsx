import { useMemo } from 'react'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS } from '@/theme'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import type { IsomerNode } from '@/components/Chemistry'
import { IsomerismScene } from './components/IsomerismScene'

// 1. 戊烷 C5H12 异构体预设数据
const PENTANE_ISOMERS: IsomerNode[] = [
  {
    id: 'pentane-n',
    name: '正戊烷',
    formula: 'C₅H₁₂',
    iupacName: '戊烷',
    equivalentHCount: 3,
    boilingPoint: 36.1,
    hnmrPeaks: [
      { group: 1, delta: 0.9, count: 6, multiplicity: '三重峰 (t)' },
      { group: 2, delta: 1.3, count: 4, multiplicity: '六重峰 (h)' },
      { group: 3, delta: 1.5, count: 2, multiplicity: '五重峰 (q)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 50, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH₂', x: 130, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₂', x: 210, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'c4', label: 'CH₂', x: 290, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c5', label: 'CH₃', x: 370, y: 240, equivalentHydrogenGroup: 1 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c3', toId: 'c4' },
      { fromId: 'c4', toId: 'c5' },
    ],
  },
  {
    id: 'pentane-iso',
    name: '异戊烷',
    formula: 'C₅H₁₂',
    iupacName: '2-甲基丁烷',
    equivalentHCount: 4,
    boilingPoint: 27.8,
    hnmrPeaks: [
      { group: 1, delta: 0.9, count: 6, multiplicity: '二重峰 (d)' },
      { group: 2, delta: 1.7, count: 1, multiplicity: '多重峰 (m)' },
      { group: 3, delta: 1.4, count: 2, multiplicity: '五重峰 (m)' },
      { group: 4, delta: 0.95, count: 3, multiplicity: '三重峰 (t)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 70, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH', x: 160, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₂', x: 250, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'c4', label: 'CH₃', x: 340, y: 240, equivalentHydrogenGroup: 4 },
      { id: 'c5', label: 'CH₃', x: 160, y: 150, equivalentHydrogenGroup: 1, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c3', toId: 'c4' },
      { fromId: 'c2', toId: 'c5' },
    ],
  },
  {
    id: 'pentane-neo',
    name: '新戊烷',
    formula: 'C₅H₁₂',
    iupacName: '2,2-二甲基丙烷',
    equivalentHCount: 1,
    boilingPoint: 9.5,
    hnmrPeaks: [
      { group: 1, delta: 0.9, count: 12, multiplicity: '单峰 (s, 全等氢)' },
    ],
    nodes: [
      { id: 'c1', label: 'C', x: 210, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH₃', x: 110, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c3', label: 'CH₃', x: 310, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c4', label: 'CH₃', x: 210, y: 150, equivalentHydrogenGroup: 1, isBranch: true },
      { id: 'c5', label: 'CH₃', x: 210, y: 330, equivalentHydrogenGroup: 1, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c1', toId: 'c3' },
      { fromId: 'c1', toId: 'c4' },
      { fromId: 'c1', toId: 'c5' },
    ],
  },
]

// 2. 丁醇 & 丁醚 C4H10O 异构体预设数据 (4种醇 + 3种醚 = 7种)
const BUTANOL_ISOMERS: IsomerNode[] = [
  {
    id: 'butanol-1',
    name: '1-丁醇',
    formula: 'C₄H₁₀O',
    iupacName: '丁-1-醇',
    equivalentHCount: 5,
    boilingPoint: 117.7,
    hnmrPeaks: [
      { group: 1, delta: 0.9, count: 3, multiplicity: '三重峰 (t)' },
      { group: 2, delta: 1.4, count: 2, multiplicity: '多重峰 (m)' },
      { group: 3, delta: 1.5, count: 2, multiplicity: '多重峰 (m)' },
      { group: 4, delta: 3.6, count: 2, multiplicity: '三重峰 (t)' },
      { group: 5, delta: 2.1, count: 1, multiplicity: '单峰 (-OH)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 60, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH₂', x: 140, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₂', x: 220, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'c4', label: 'CH₂', x: 300, y: 240, equivalentHydrogenGroup: 4 },
      { id: 'o1', label: 'OH', x: 370, y: 240, equivalentHydrogenGroup: 5 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c3', toId: 'c4' },
      { fromId: 'c4', toId: 'o1' },
    ],
  },
  {
    id: 'butanol-2',
    name: '2-丁醇',
    formula: 'C₄H₁₀O',
    iupacName: '丁-2-醇',
    equivalentHCount: 5,
    boilingPoint: 99.5,
    hnmrPeaks: [
      { group: 1, delta: 0.9, count: 3, multiplicity: '三重峰 (t)' },
      { group: 2, delta: 3.7, count: 1, multiplicity: '多重峰 (m)' },
      { group: 3, delta: 1.5, count: 2, multiplicity: '多重峰 (m)' },
      { group: 4, delta: 1.15, count: 3, multiplicity: '二重峰 (d)' },
      { group: 5, delta: 1.8, count: 1, multiplicity: '单峰 (-OH)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 70, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH', x: 160, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₂', x: 250, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'c4', label: 'CH₃', x: 340, y: 240, equivalentHydrogenGroup: 4 },
      { id: 'o1', label: 'OH', x: 160, y: 150, equivalentHydrogenGroup: 5, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c3', toId: 'c4' },
      { fromId: 'c2', toId: 'o1' },
    ],
  },
  {
    id: 'butanol-iso',
    name: '异丁醇',
    formula: 'C₄H₁₀O',
    iupacName: '2-甲基丙-1-醇',
    equivalentHCount: 4,
    boilingPoint: 108.0,
    hnmrPeaks: [
      { group: 1, delta: 0.9, count: 6, multiplicity: '二重峰 (d)' },
      { group: 2, delta: 1.8, count: 1, multiplicity: '多重峰 (m)' },
      { group: 3, delta: 3.4, count: 2, multiplicity: '二重峰 (d)' },
      { group: 4, delta: 2.2, count: 1, multiplicity: '单峰 (-OH)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 70, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH', x: 160, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₂', x: 250, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'o1', label: 'OH', x: 330, y: 240, equivalentHydrogenGroup: 4 },
      { id: 'c4', label: 'CH₃', x: 160, y: 150, equivalentHydrogenGroup: 1, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c3', toId: 'o1' },
      { fromId: 'c2', toId: 'c4' },
    ],
  },
  {
    id: 'butanol-tert',
    name: '叔丁醇',
    formula: 'C₄H₁₀O',
    iupacName: '2-甲基丙-2-醇',
    equivalentHCount: 2,
    boilingPoint: 82.5,
    hnmrPeaks: [
      { group: 1, delta: 1.25, count: 9, multiplicity: '强单峰 (s)' },
      { group: 2, delta: 1.6, count: 1, multiplicity: '单峰 (-OH)' },
    ],
    nodes: [
      { id: 'c1', label: 'C', x: 200, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c2', label: 'CH₃', x: 100, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c3', label: 'CH₃', x: 300, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c4', label: 'CH₃', x: 200, y: 150, equivalentHydrogenGroup: 1, isBranch: true },
      { id: 'o1', label: 'OH', x: 200, y: 330, equivalentHydrogenGroup: 2, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c1', toId: 'c3' },
      { fromId: 'c1', toId: 'c4' },
      { fromId: 'c1', toId: 'o1' },
    ],
  },
  {
    id: 'ether-diethyl',
    name: '二乙醚',
    formula: 'C₄H₁₀O',
    iupacName: '乙氧基乙烷',
    equivalentHCount: 2,
    boilingPoint: 34.6,
    hnmrPeaks: [
      { group: 1, delta: 1.2, count: 6, multiplicity: '三重峰 (t)' },
      { group: 2, delta: 3.5, count: 4, multiplicity: '四重峰 (q)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 50, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH₂', x: 130, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'o1', label: 'O', x: 210, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₂', x: 290, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c4', label: 'CH₃', x: 370, y: 240, equivalentHydrogenGroup: 1 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'o1' },
      { fromId: 'o1', toId: 'c3' },
      { fromId: 'c3', toId: 'c4' },
    ],
  },
  {
    id: 'ether-methyl-propyl',
    name: '甲基丙基醚',
    formula: 'C₄H₁₀O',
    iupacName: '1-甲氧基丙烷',
    equivalentHCount: 4,
    boilingPoint: 38.8,
    hnmrPeaks: [
      { group: 1, delta: 3.3, count: 3, multiplicity: '单峰 (s)' },
      { group: 2, delta: 3.4, count: 2, multiplicity: '三重峰 (t)' },
      { group: 3, delta: 1.6, count: 2, multiplicity: '六重峰 (m)' },
      { group: 4, delta: 0.9, count: 3, multiplicity: '三重峰 (t)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 60, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'o1', label: 'O', x: 140, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c2', label: 'CH₂', x: 220, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'c3', label: 'CH₂', x: 300, y: 240, equivalentHydrogenGroup: 4 },
      { id: 'c4', label: 'CH₃', x: 380, y: 240, equivalentHydrogenGroup: 2 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'o1' },
      { fromId: 'o1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c3', toId: 'c4' },
    ],
  },
  {
    id: 'ether-methyl-isopropyl',
    name: '甲基异丙基醚',
    formula: 'C₄H₁₀O',
    iupacName: '2-甲氧基丙烷',
    equivalentHCount: 3,
    boilingPoint: 31.0,
    hnmrPeaks: [
      { group: 1, delta: 3.3, count: 3, multiplicity: '单峰 (s)' },
      { group: 2, delta: 3.5, count: 1, multiplicity: '七重峰 (m)' },
      { group: 3, delta: 1.1, count: 6, multiplicity: '二重峰 (d)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 70, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'o1', label: 'O', x: 150, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c2', label: 'CH', x: 230, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₃', x: 320, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'c4', label: 'CH₃', x: 230, y: 150, equivalentHydrogenGroup: 3, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'o1' },
      { fromId: 'o1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c2', toId: 'c4' },
    ],
  },
]

// 3. 羧酸 & 酯 C3H6O2 异构体预设数据
const ESTERS_ISOMERS: IsomerNode[] = [
  {
    id: 'propionic-acid',
    name: '丙酸',
    formula: 'C₃H₆O₂',
    iupacName: '丙酸',
    equivalentHCount: 3,
    boilingPoint: 141.2,
    hnmrPeaks: [
      { group: 1, delta: 1.1, count: 3, multiplicity: '三重峰 (t)' },
      { group: 2, delta: 2.3, count: 2, multiplicity: '四重峰 (q)' },
      { group: 3, delta: 11.5, count: 1, multiplicity: '极低场单峰 (COOH)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 90, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH₂', x: 190, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'COOH', x: 300, y: 240, equivalentHydrogenGroup: 3 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
    ],
  },
  {
    id: 'ethyl-formate',
    name: '甲酸乙酯',
    formula: 'C₃H₆O₂',
    iupacName: '甲酸乙酯',
    equivalentHCount: 3,
    boilingPoint: 54.0,
    hnmrPeaks: [
      { group: 1, delta: 8.0, count: 1, multiplicity: '高场单峰 (HCOO-)' },
      { group: 2, delta: 4.2, count: 2, multiplicity: '四重峰 (q)' },
      { group: 3, delta: 1.3, count: 3, multiplicity: '三重峰 (t)' },
    ],
    nodes: [
      { id: 'c1', label: 'HCOO', x: 90, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH₂', x: 210, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₃', x: 310, y: 240, equivalentHydrogenGroup: 3 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
    ],
  },
  {
    id: 'methyl-acetate',
    name: '乙酸甲酯',
    formula: 'C₃H₆O₂',
    iupacName: '乙酸甲酯',
    equivalentHCount: 2,
    boilingPoint: 56.9,
    hnmrPeaks: [
      { group: 1, delta: 2.0, count: 3, multiplicity: '单峰 (CH3CO)' },
      { group: 2, delta: 3.6, count: 3, multiplicity: '单峰 (OCH3)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 100, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'COO', x: 210, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c3', label: 'CH₃', x: 320, y: 240, equivalentHydrogenGroup: 2 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
    ],
  },
  {
    id: 'hydroxy-propanal',
    name: '2-羟基丙醛',
    formula: 'C₃H₆O₂',
    iupacName: '3-羟基丙醛',
    equivalentHCount: 4,
    boilingPoint: 120.0,
    hnmrPeaks: [
      { group: 1, delta: 2.5, count: 1, multiplicity: '单峰 (-OH)' },
      { group: 2, delta: 3.8, count: 2, multiplicity: '三重峰 (t)' },
      { group: 3, delta: 2.7, count: 2, multiplicity: '三重峰 (t)' },
      { group: 4, delta: 9.7, count: 1, multiplicity: '低场单峰 (-CHO)' },
    ],
    nodes: [
      { id: 'o1', label: 'OH', x: 70, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c1', label: 'CH₂', x: 160, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c2', label: 'CH₂', x: 250, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'c3', label: 'CHO', x: 340, y: 240, equivalentHydrogenGroup: 4 },
    ],
    bonds: [
      { fromId: 'o1', toId: 'c1' },
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
    ],
  },
]

// 4. 芳香族 C7H8O 异构体预设数据 (邻间对甲酚 + 苯甲醇 + 苯甲醚)
const AROMATIC_ISOMERS: IsomerNode[] = [
  {
    id: 'cresol-o',
    name: '邻甲酚',
    formula: 'C₇H₈O',
    iupacName: '2-甲基苯酚',
    equivalentHCount: 5,
    boilingPoint: 191.0,
    hnmrPeaks: [
      { group: 1, delta: 6.8, count: 4, multiplicity: '芳香环多重峰 (m)' },
      { group: 2, delta: 5.1, count: 1, multiplicity: '酚羟基单峰 (Ar-OH)' },
      { group: 3, delta: 2.2, count: 3, multiplicity: '甲基单峰 (Ar-CH3)' },
    ],
    nodes: [
      { id: 'c1', label: 'C₆H₄', x: 190, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'o1', label: 'OH', x: 110, y: 170, equivalentHydrogenGroup: 2, isBranch: true },
      { id: 'c2', label: 'CH₃', x: 270, y: 170, equivalentHydrogenGroup: 3, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'o1' },
      { fromId: 'c1', toId: 'c2' },
    ],
  },
  {
    id: 'cresol-m',
    name: '间甲酚',
    formula: 'C₇H₈O',
    iupacName: '3-甲基苯酚',
    equivalentHCount: 5,
    boilingPoint: 202.0,
    hnmrPeaks: [
      { group: 1, delta: 7.0, count: 4, multiplicity: '芳香环多重峰 (m)' },
      { group: 2, delta: 5.0, count: 1, multiplicity: '酚羟基单峰 (Ar-OH)' },
      { group: 3, delta: 2.3, count: 3, multiplicity: '甲基单峰 (Ar-CH3)' },
    ],
    nodes: [
      { id: 'c1', label: 'C₆H₄', x: 190, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'o1', label: 'OH', x: 100, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c2', label: 'CH₃', x: 280, y: 150, equivalentHydrogenGroup: 3, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'o1' },
      { fromId: 'c1', toId: 'c2' },
    ],
  },
  {
    id: 'cresol-p',
    name: '对甲酚',
    formula: 'C₇H₈O',
    iupacName: '4-甲基苯酚',
    equivalentHCount: 3,
    boilingPoint: 201.9,
    hnmrPeaks: [
      { group: 1, delta: 6.9, count: 4, multiplicity: '对称二重峰 (d, 2H+2H)' },
      { group: 2, delta: 5.2, count: 1, multiplicity: '酚羟基单峰 (Ar-OH)' },
      { group: 3, delta: 2.25, count: 3, multiplicity: '甲基单峰 (Ar-CH3)' },
    ],
    nodes: [
      { id: 'c1', label: 'C₆H₄', x: 190, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'o1', label: 'OH', x: 90, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c2', label: 'CH₃', x: 290, y: 240, equivalentHydrogenGroup: 3 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'o1' },
      { fromId: 'c1', toId: 'c2' },
    ],
  },
  {
    id: 'benzyl-alcohol',
    name: '苯甲醇',
    formula: 'C₇H₈O',
    iupacName: '苯甲醇',
    equivalentHCount: 4,
    boilingPoint: 205.0,
    hnmrPeaks: [
      { group: 1, delta: 7.3, count: 5, multiplicity: '苯环多重峰 (m)' },
      { group: 2, delta: 4.6, count: 2, multiplicity: '单峰 (Ar-CH2-)' },
      { group: 3, delta: 2.4, count: 1, multiplicity: '醇羟基单峰 (-OH)' },
    ],
    nodes: [
      { id: 'c1', label: 'C₆H₅', x: 100, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH₂', x: 210, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'o1', label: 'OH', x: 310, y: 240, equivalentHydrogenGroup: 3 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'o1' },
    ],
  },
  {
    id: 'anisole',
    name: '苯甲醚',
    formula: 'C₇H₈O',
    iupacName: '甲氧基苯',
    equivalentHCount: 3,
    boilingPoint: 154.0,
    hnmrPeaks: [
      { group: 1, delta: 7.1, count: 5, multiplicity: '苯环多重峰 (m)' },
      { group: 2, delta: 3.8, count: 3, multiplicity: '甲氧基单峰 (Ar-OCH3)' },
    ],
    nodes: [
      { id: 'c1', label: 'C₆H₅', x: 100, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'o1', label: 'O', x: 210, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c2', label: 'CH₃', x: 310, y: 240, equivalentHydrogenGroup: 3 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'o1' },
      { fromId: 'o1', toId: 'c2' },
    ],
  },
]

// 5. 丁烯 & 环烷 C4H8 异构体预设数据
const BUTENE_ISOMERS: IsomerNode[] = [
  {
    id: 'butene-1',
    name: '1-丁烯',
    formula: 'C₄H₈',
    iupacName: '丁-1-烯',
    equivalentHCount: 4,
    boilingPoint: -6.3,
    hnmrPeaks: [
      { group: 1, delta: 4.9, count: 2, multiplicity: '末端烯氢多重峰 (=CH2)' },
      { group: 2, delta: 5.8, count: 1, multiplicity: '烯氢多重峰 (=CH-)' },
      { group: 3, delta: 2.0, count: 2, multiplicity: '烯丙基氢 (m)' },
      { group: 4, delta: 1.0, count: 3, multiplicity: '甲基三重峰 (t)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₂', x: 60, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH', x: 150, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₂', x: 240, y: 240, equivalentHydrogenGroup: 3 },
      { id: 'c4', label: 'CH₃', x: 330, y: 240, equivalentHydrogenGroup: 4 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2', type: 'double' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c3', toId: 'c4' },
    ],
  },
  {
    id: 'butene-2-cis',
    name: '顺-2-丁烯',
    formula: 'C₄H₈',
    iupacName: '(Z)-丁-2-烯',
    equivalentHCount: 2,
    boilingPoint: 3.7,
    hnmrPeaks: [
      { group: 1, delta: 1.6, count: 6, multiplicity: '二重峰 (d, 2xCH3)' },
      { group: 2, delta: 5.4, count: 2, multiplicity: '多重峰 (m, 2x=CH)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 80, y: 150, equivalentHydrogenGroup: 1, isBranch: true },
      { id: 'c2', label: 'CH', x: 160, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH', x: 250, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c4', label: 'CH₃', x: 330, y: 150, equivalentHydrogenGroup: 1, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3', type: 'double' },
      { fromId: 'c3', toId: 'c4' },
    ],
  },
  {
    id: 'butene-2-trans',
    name: '反-2-丁烯',
    formula: 'C₄H₈',
    iupacName: '(E)-丁-2-烯',
    equivalentHCount: 2,
    boilingPoint: 0.9,
    hnmrPeaks: [
      { group: 1, delta: 1.6, count: 6, multiplicity: '二重峰 (d, 2xCH3)' },
      { group: 2, delta: 5.4, count: 2, multiplicity: '多重峰 (m, 2x=CH)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₃', x: 80, y: 150, equivalentHydrogenGroup: 1, isBranch: true },
      { id: 'c2', label: 'CH', x: 160, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH', x: 250, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c4', label: 'CH₃', x: 330, y: 330, equivalentHydrogenGroup: 1 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3', type: 'double' },
      { fromId: 'c3', toId: 'c4' },
    ],
  },
  {
    id: 'isobutene',
    name: '异丁烯',
    formula: 'C₄H₈',
    iupacName: '2-甲基丙-1-烯',
    equivalentHCount: 2,
    boilingPoint: -6.9,
    hnmrPeaks: [
      { group: 1, delta: 4.6, count: 2, multiplicity: '单峰 (=CH2)' },
      { group: 2, delta: 1.7, count: 6, multiplicity: '单峰 (2xCH3)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₂', x: 80, y: 240, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'C', x: 180, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c3', label: 'CH₃', x: 280, y: 240, equivalentHydrogenGroup: 2 },
      { id: 'c4', label: 'CH₃', x: 180, y: 150, equivalentHydrogenGroup: 2, isBranch: true },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2', type: 'double' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c2', toId: 'c4' },
    ],
  },
  {
    id: 'cyclobutane',
    name: '环丁烷',
    formula: 'C₄H₈',
    iupacName: '环丁烷',
    equivalentHCount: 1,
    boilingPoint: 12.5,
    hnmrPeaks: [
      { group: 1, delta: 1.96, count: 8, multiplicity: '强单峰 (s, 全等氢)' },
    ],
    nodes: [
      { id: 'c1', label: 'CH₂', x: 140, y: 170, equivalentHydrogenGroup: 1 },
      { id: 'c2', label: 'CH₂', x: 260, y: 170, equivalentHydrogenGroup: 1 },
      { id: 'c3', label: 'CH₂', x: 260, y: 290, equivalentHydrogenGroup: 1 },
      { id: 'c4', label: 'CH₂', x: 140, y: 290, equivalentHydrogenGroup: 1 },
    ],
    bonds: [
      { fromId: 'c1', toId: 'c2' },
      { fromId: 'c2', toId: 'c3' },
      { fromId: 'c3', toId: 'c4' },
      { fromId: 'c4', toId: 'c1' },
    ],
  },
]

export default function IsomerismAnimation() {
  // Store 精确订阅
  const params = useAnimationStore(useShallow((s) => s.params))

  // 视口绑定：依据用户提点，左右分屏 preset 选用 CANVAS_PRESETS.splitH (420x650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })

  const isomerType = params.isomerType ?? 0
  const selectedIndex = params.selectedIndex ?? 0
  const showEquivalentH = (params.showEquivalentH ?? 1) === 1

  // 当前所选系的异构体列表 (映射 5 大高考探究体系)
  const currentList = useMemo(() => {
    switch (isomerType) {
      case 1:
        return BUTANOL_ISOMERS
      case 2:
        return ESTERS_ISOMERS
      case 3:
        return AROMATIC_ISOMERS
      case 4:
        return BUTENE_ISOMERS
      case 0:
      default:
        return PENTANE_ISOMERS
    }
  }, [isomerType])

  const safeIndex = Math.min(selectedIndex, currentList.length - 1)
  const currentIsomer = currentList[safeIndex] || currentList[0]

  return (
    <IsomerismScene
      containerRef={containerRef}
      transform={vp.transform}
      currentIsomer={currentIsomer}
      showEquivalentH={showEquivalentH}
      font={canvasSize.font}
    />
  )
}
