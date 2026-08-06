import { useMemo, useState } from 'react'
import type {
  RetrosynthesisModelId,
  SynthesisMode,
  RetrosynthesisModelData,
  RetrosynthesisStep,
} from '../types'

export const RETRO_MODELS_DATA: Record<RetrosynthesisModelId, RetrosynthesisModelData> = {
  'aspirin-benorilate': {
    id: 'aspirin-benorilate',
    title: '模型一：贝诺酯 (Benorilate) 逆合成与酚羟基保护剖析',
    subtitle: '双官能团选择性酰化与酯键/酰胺键切断策略',
    targetMolecule: '贝诺酯 (Benorilate)',
    targetFormula: 'C₁₇H₁₅NO₅',
    difficulty: '高考冲刺',
    description:
      '贝诺酯是阿司匹林与对乙酰氨基酚解热镇痛药的协同酯化产物。分子中同时含有酚酯键与酰胺键，需通过逆合成切断法寻找切断点，并控制选择性。',
    coreStrategy:
      '逆向切断酯键 (✂ C-O) 得到水杨酸与对乙酰氨基酚；水杨酸酚羟基需先用乙酸酐选择性酰化保护，避免二次交联。',
    protectionKeyPoints: [
      '水杨酸含有 -COOH 与 酚 -OH 两个活性官能团',
      '与乙酸酐反应时，酚羟基发生酯化保护为乙酰氧基',
      '保留羧基用于后续与对乙酰氨基酚的偶联酯化',
    ],
    infoReaction: {
      name: '选择性酚羟基酰化 (Protection)',
      equation: 'Ar-OH + (CH₃CO)₂O → Ar-O-COCH₃ + CH₃COOH',
      mechanismDesc:
        '在酸性或吡啶催化下，酚羟基比羧基更易与乙酸酐发生亲核取代，生成酚酯完成保护。',
    },
    steps: [
      {
        stepIndex: 1,
        title: '第 1 步：目标分子 (TM) 逆合成切断分析',
        description: '在贝诺酯分子中定位酯键位置，剪刀切断 C-O 键，逆推前体。',
        reactants: [{ name: '贝诺酯 (TM)', formula: 'C₁₇H₁₅NO₅' }],
        products: [
          { name: '乙酰水杨酸 (前体 A)', formula: 'C₉H₈O₄' },
          { name: '对乙酰氨基酚 (前体 B)', formula: 'C∯H₉NO₂' },
        ],
        reagents: '逆向切断 (✂ Disconnection)',
        protectionStatus: {
          isProtected: false,
          reason: '目标分子已完成全合成，切断点位于碳-氧酯键。',
        },
        cutBond: {
          bondType: '酯键 (C-O 键)',
          positionDesc: '羧基 C 与 酚氧 O 之间的单键',
          retroSynthon: '[Ar-CO⁺] + [Ar\'-O⁻]',
        },
        atomEconomy: 91.2,
        fgiType: '酯键逆向切断 (Disconnection)',
        nodes: [
          { id: 'tm', label: '贝诺酯 (TM)', formula: 'C₁₇H₁₅NO₅', x: 420, y: 100, role: 'TM', isTarget: true },
          { id: 'p1', label: '乙酰水杨酸 (前体A)', formula: 'C₉H∯O₄', x: 220, y: 320, role: 'precursor', badge: '亲电 Synthons' },
          { id: 'p2', label: '对乙酰氨基酚 (前体B)', formula: 'C∯H₉NO₂', x: 620, y: 320, role: 'precursor', badge: '亲核 Synthons' },
          { id: 'sub', label: '水杨酸 (原料基石)', formula: 'C₇H₆O₃', x: 420, y: 510, role: 'intermediate', badge: '起始原料' },
        ],
        connections: [
          { from: 'tm', to: 'p1', label: '✂ 切断 C-O 酯键', isDisconnection: true },
          { from: 'tm', to: 'p2', label: '✂ 释放酚羟基组件', isDisconnection: true },
          { from: 'p1', to: 'sub', label: '逆推酚 -OH 游离态' },
        ],
      },
      {
        stepIndex: 2,
        title: '第 2 步：前体 A (阿司匹林) 的酚羟基保护与酰化',
        description: '水杨酸与乙酸酐反应，酚羟基被选择性酰化转化为 -O-COCH₃，避免羧基脱水。',
        reactants: [
          { name: '水杨酸', formula: 'C₇H₆O₃' },
          { name: '乙酸酐', formula: '(CH₃CO)₂O' },
        ],
        products: [
          { name: '乙酰水杨酸', formula: 'C₉H∯O₄' },
          { name: '乙酸', formula: 'CH₃COOH' },
        ],
        reagents: '浓硫酸 / 85℃ 加热',
        protectionStatus: {
          isProtected: true,
          protectedGroup: '酚羟基 (-OH)',
          protectingAgent: '乙酸酐 (CH₃CO)₂O',
          reason: '封堵酚羟基，使其转化为酯，防止下一步强缩合试剂副反应。',
        },
        cutBond: null,
        atomEconomy: 75.0,
        fgiType: '酚羟基酰化保护 (Protection)',
        nodes: [
          { id: 'sa', label: '水杨酸 (原料)', formula: 'C₇H₆O₃', x: 220, y: 110, role: 'precursor' },
          { id: 'ac', label: '乙酸酐 Protection 试剂', formula: '(CH₃CO)₂O', x: 620, y: 110, role: 'reagent' },
          { id: 'asp', label: '乙酰水杨酸 (Protection 态)', formula: 'C₉H∯O₄', x: 420, y: 320, role: 'protected', badge: '酚 -OH 已封堵', isProtectedGroup: true },
          { id: 'by', label: '副产物 乙酸', formula: 'CH₃COOH', x: 420, y: 510, role: 'intermediate', badge: '副产物释放' },
        ],
        connections: [
          { from: 'sa', to: 'asp', label: '乙酰化 Protection', condition: '85℃ H₂SO₄' },
          { from: 'ac', to: 'asp', label: '提供乙酰基 (-COCH₃)', isProtectionShield: true },
          { from: 'asp', to: 'by', label: '脱去 CH₃COOH' },
        ],
      },
      {
        stepIndex: 3,
        title: '第 3 步：保留羧基与对乙酰氨基酚偶联缩合',
        description: '在 DCC/DAP 或 SOCl₂ 缩合试剂作用下，乙酰水杨酸羧基与对乙酰氨基酚脱水生成贝诺酯。',
        reactants: [
          { name: '乙酰水杨酸', formula: 'C₉H∯O₄' },
          { name: '对乙酰氨基酚', formula: 'C∯H₉NO₂' },
        ],
        products: [
          { name: '贝诺酯', formula: 'C₁₇H₁₅NO₅' },
          { name: '水', formula: 'H₂O' },
        ],
        reagents: 'DCC / 吡啶 / 室温',
        protectionStatus: {
          isProtected: true,
          protectedGroup: '酚羟基以 -OCOCH₃ 形式存在',
          reason: '保护基团在合成最终产物中保留，作为前体药物在人体内酶解释放。',
        },
        cutBond: null,
        atomEconomy: 94.6,
        fgiType: '酯化缩合偶联 (Coupling)',
        nodes: [
          { id: 'asp', label: '乙酰水杨酸', formula: 'C₉H∯O₄', x: 220, y: 120, role: 'protected', isProtectedGroup: true },
          { id: 'par', label: '对乙酰氨基酚', formula: 'C∯H₉NO₂', x: 620, y: 120, role: 'precursor' },
          { id: 'ben', label: '贝诺酯 (TM 全合成产物)', formula: 'C₁₇H₁₅NO₅', x: 420, y: 330, role: 'TM', isTarget: true },
          { id: 'fin', label: '前体药物协同增效', formula: 'Target Molecule', x: 420, y: 510, role: 'intermediate', badge: '双药合一' },
        ],
        connections: [
          { from: 'asp', to: 'ben', label: '脱水酯化' },
          { from: 'par', to: 'ben', label: '酚 -OH 偶联' },
          { from: 'ben', to: 'fin', label: '人体内酶解复原' },
        ],
      },
    ],
  },
  'diels-alder-acetal': {
    id: 'diels-alder-acetal',
    title: '模型二：Diels-Alder 环加成与乙二醇羰基缩醛 Protection',
    subtitle: '高考新情境环加成与羰基耐碱/耐还原性缩醛保护',
    targetMolecule: '4-羟甲基环己烯甲醛',
    targetFormula: 'C∯H₁₂O₂',
    difficulty: '高考冲刺',
    description:
      '目标分子含有碳碳双键与醛基、醇羟基。在利用 LiAlH₄ 强还原剂将酯还原为醇时，醛基会被优先破坏，需用乙二醇将其转化为环状缩醛进行保护。',
    coreStrategy:
      '先利用 Diels-Alder 反应构建六元环骨架；醛基用乙二醇生成环状缩醛保护后，强还原剂还原酯基，最后酸性水解脱去缩醛保护基。',
    protectionKeyPoints: [
      '醛基 (羰基) 极其活泼，易被 LiAlH₄ / NaBH₄ 快速还原',
      '在无水酸催化下与乙二醇反应生成 1,3-二氧六环/五环 (环状缩醛)',
      '环状缩醛对强碱、亲核试剂和强还原剂高度稳定',
      '合成完成后在稀盐酸 (H₃O⁺) 加热下脱保护复原醛基',
    ],
    infoReaction: {
      name: '乙二醇缩醛化 protection 与 H₃O⁺ 逆反应',
      equation: 'R-CHO + HO-CH₂CH₂-OH ⇌ R-CH(OCH₂CH₂O) + H₂O',
      mechanismDesc: '质子催化下，乙二醇两个羟基先后亲核加成羰基脱去一分子水，生成五元环状缩醛。',
    },
    steps: [
      {
        stepIndex: 1,
        title: '第 1 步：Diels-Alder 环加成构建六元碳环骨架',
        description: '1,3-丁二烯与丙烯酸甲酯在加热下发生 [4+2] 环加成，生成环己烯羧酸甲酯。',
        reactants: [
          { name: '1,3-丁二烯', formula: 'C₄H₆' },
          { name: '丙烯酸甲酯', formula: 'C₄H₆O₂' },
        ],
        products: [{ name: '3-环己烯羧酸甲酯', formula: 'C∯H₁₂O₂' }],
        reagents: 'Δ (100℃) / 无溶剂',
        protectionStatus: { isProtected: false },
        cutBond: {
          bondType: 'C-C 双键切断',
          positionDesc: '六元环上 C(1)-C(6) 与 C(3)-C(4) 切断',
          retroSynthon: '双烯体 (Diene) + 亲双烯体 (Dienophile)',
        },
        atomEconomy: 100.0,
        fgiType: '[4+2] 环加成 (Diels-Alder)',
        nodes: [
          { id: 'd1', label: '1,3-丁二烯', formula: 'C₄H₆', x: 220, y: 110, role: 'precursor' },
          { id: 'd2', label: '丙烯酸甲酯', formula: 'C₄H₆O₂', x: 620, y: 110, role: 'precursor' },
          { id: 'ad', label: '3-环己烯羧酸甲酯', formula: 'C∯H₁₂O₂', x: 420, y: 320, role: 'intermediate', badge: '六元碳环骨架' },
          { id: 'next', label: '待保护 -CHO 羰基', formula: 'R-CHO', x: 420, y: 510, role: 'intermediate', badge: '活泼羰基' },
        ],
        connections: [
          { from: 'd1', to: 'ad', label: '[4+2] 环加成' },
          { from: 'd2', to: 'ad', label: '碳骨架闭环' },
          { from: 'ad', to: 'next', label: '官能团修饰' },
        ],
      },
      {
        stepIndex: 2,
        title: '第 2 步：羰基/醛基的乙二醇环状缩醛 protection',
        description: '将中间体醛基用乙二醇保护为环状缩醛，使其能承受下一步 LiAlH₄ 强还原条件。',
        reactants: [
          { name: '甲醛基中间体', formula: 'R-CHO' },
          { name: '乙二醇', formula: 'HO-CH₂CH₂-OH' },
        ],
        products: [
          { name: '环状缩醛保护产物', formula: 'R-CH(OCH₂-)' },
          { name: '水', formula: 'H₂O' },
        ],
        reagents: 'p-TsOH (对甲苯磺酸) / 甲苯回流共沸除水',
        protectionStatus: {
          isProtected: true,
          protectedGroup: '醛基 (-CHO)',
          protectingAgent: '乙二醇 HO-CH₂CH₂-OH',
          reason: '避免在后续强还原剂 LiAlH₄ 反应中醛基被破坏。',
        },
        cutBond: null,
        atomEconomy: 88.5,
        fgiType: '缩醛保护 (Acetal Protection)',
        nodes: [
          { id: 'cho', label: '醛基前体', formula: 'R-CHO', x: 220, y: 120, role: 'precursor' },
          { id: 'gly', label: '乙二醇 Protection 试剂', formula: 'HO(CH₂)₂OH', x: 620, y: 120, role: 'reagent' },
          { id: 'act', label: '环状缩醛 (Protection 态)', formula: 'R-CH(OCH₂-)₂', x: 420, y: 330, role: 'protected', isProtectedGroup: true, badge: '抗强碱/强还原剂' },
          { id: 'lah', label: '耐受 LiAlH₄ 还原', formula: 'Stable Acetal', x: 420, y: 510, role: 'intermediate', badge: '盾牌全防护' },
        ],
        connections: [
          { from: 'cho', to: 'act', label: '酸催化脱水' },
          { from: 'gly', to: 'act', label: '形成五元二氧环', isProtectionShield: true },
          { from: 'act', to: 'lah', label: 'LiAlH₄ 专属选择性' },
        ],
      },
      {
        stepIndex: 3,
        title: '第 3 步：强还原剂选择性还原酯基与稀酸脱保护',
        description: 'LiAlH₄ 还原酯基为 -CH₂OH，随后加入稀盐酸 (H₃O⁺) 加热脱去乙二醇恢复 -CHO。',
        reactants: [
          { name: '缩醛保护产物', formula: 'R-CH(OCH₂-)₂' },
          { name: 'LiAlH₄，随后 H₃O⁺', formula: '还原剂 + 稀酸' },
        ],
        products: [
          { name: '4-羟甲基环己烯甲醛 (TM)', formula: 'C∯H₁₂O₂' },
          { name: '乙二醇 (回收)', formula: 'HO(CH₂)₂OH' },
        ],
        reagents: '1) LiAlH₄, THF  2) H₃O⁺ / Δ 脱保护',
        protectionStatus: {
          isProtected: false,
          deprotectingAgent: '稀盐酸 (H₃O⁺)',
          reason: '稀酸水解打破缩醛键，复原醛基，释放保护剂乙二醇。',
        },
        cutBond: null,
        atomEconomy: 82.4,
        fgiType: '稀酸水解脱保护 (Deprotection)',
        nodes: [
          { id: 'act', label: '环状缩醛', formula: 'R-CH(OCH₂-)₂', x: 220, y: 120, role: 'protected', isProtectedGroup: true },
          { id: 'lah', label: 'LiAlH₄ / H₃O⁺ 脱保护', formula: '试剂与酸', x: 620, y: 120, role: 'reagent' },
          { id: 'tm', label: '4-羟甲基环己烯甲醛 (TM)', formula: 'C∯H₁₂O₂', x: 420, y: 330, role: 'TM', isTarget: true, badge: '双键+醛基+醇羟基' },
          { id: 'rec', label: '乙二醇 循环回收', formula: 'HO(CH₂)₂OH', x: 420, y: 510, role: 'intermediate', badge: '绿色循环' },
        ],
        connections: [
          { from: 'act', to: 'tm', label: 'H₃O⁺ 脱保护复原 -CHO' },
          { from: 'lah', to: 'tm', label: '还原 Ester 为 -CH₂OH' },
          { from: 'tm', to: 'rec', label: '释放 HO(CH₂)₂OH' },
        ],
      },
    ],
  },
  'double-bond-protection': {
    id: 'double-bond-protection',
    title: '模型三：碳碳双键加溴 Protection 与锌粉脱溴复原',
    subtitle: '多官能团烯烃在强氧化剂/亲电反应中的保护策略',
    targetMolecule: '4-甲氧基苯丙烯',
    targetFormula: 'C₁₀H₁₂O',
    difficulty: '中等',
    description:
      '4-烯丙基酚含有碳碳双键 (C=C) 与酚羟基 (-OH)。若要将酚羟基转化为甲基醚 (-OCH₃)，强碱 (NaOH) 与 CH₃I 可能会导致 C=C 双键发生亲电加成或氧化副反应。',
    coreStrategy:
      '双键先与 Br₂ 发生亲电加成转化为 1,2-二溴代物 (加溴 protection)，进行酚羟基甲基化后，最后用 Zn 粉在乙醇中加热消去还原复原 C=C 双键。',
    protectionKeyPoints: [
      '碳碳双键极易被 KMnO₄ 氧化或与亲电试剂反应',
      '加加成 Br₂ / HCl 可暂时消除双键不饱和性',
      '成醚反应完成后，利用金属 Zn 的还原性在乙醇中与二溴化物反应脱溴复原双键',
    ],
    infoReaction: {
      name: 'Zn 粉脱溴复原双键 (Deprotection)',
      equation: 'R-CHBr-CH₂Br + Zn → R-CH=CH₂ + ZnBr₂',
      mechanismDesc: 'Zn 作为强还原剂在乙醇中转移两个电子给邻二溴化物，发生 β-消去脱去 ZnBr₂ 重新建立 C=C 双键。',
    },
    steps: [
      {
        stepIndex: 1,
        title: '第 1 步：碳碳双键加成 Br₂ 保护 (消除不饱和性)',
        description: '4-烯丙基酚在 CCl₄ 溶剂中与 Br₂ 发生亲电加成，生成二溴代物。',
        reactants: [
          { name: '4-烯丙基酚', formula: 'C≉H₁₀O' },
          { name: '溴素', formula: 'Br₂' },
        ],
        products: [{ name: '1,2-二溴代酚', formula: 'C≉H₁₀Br₂O' }],
        reagents: 'CCl₄ 溶剂 / 室温避光',
        protectionStatus: {
          isProtected: true,
          protectedGroup: '碳碳双键 (C=C)',
          protectingAgent: '液溴 (Br₂ / CCl₄)',
          reason: '将活泼双键转化为稳定的饱和邻二溴代物。',
        },
        cutBond: null,
        atomEconomy: 100.0,
        fgiType: '加溴保护 (Br₂ Addition Protection)',
        nodes: [
          { id: 'all', label: '4-烯丙基酚 (烯烃原料)', formula: 'C≉H₁₀O', x: 220, y: 110, role: 'precursor' },
          { id: 'br', label: 'Br₂ / CCl₄ 试剂', formula: 'Br₂', x: 620, y: 110, role: 'reagent' },
          { id: 'dib', label: '二溴代产物 (双键已护)', formula: 'C≉H₁₀Br₂O', x: 420, y: 320, role: 'protected', isProtectedGroup: true, badge: '饱和代物' },
          { id: 'next', label: '待酚 -OH 甲基化', formula: 'Phenol Ether', x: 420, y: 510, role: 'intermediate', badge: '准备成醚' },
        ],
        connections: [
          { from: 'all', to: 'dib', label: '亲电加成' },
          { from: 'br', to: 'dib', label: '加成 Br₂ 封锁双键', isProtectionShield: true },
          { from: 'dib', to: 'next', label: '碱性成醚' },
        ],
      },
      {
        stepIndex: 2,
        title: '第 2 步：强碱下酚羟基甲基化 (威廉姆逊成醚反应)',
        description: '在 NaOH 碱性条件下，酚羟基脱质子生成酚氧负离子，与 CH₃I 反应生成甲基醚。',
        reactants: [
          { name: '二溴代酚', formula: 'C≉H₁₀Br₂O' },
          { name: '碘甲烷', formula: 'CH₃I' },
        ],
        products: [
          { name: '二溴代甲基醚', formula: 'C₁₀H₁₂Br₂O' },
          { name: 'NaI', formula: 'NaI' },
        ],
        reagents: 'NaOH / Acetone / 回流',
        protectionStatus: {
          isProtected: true,
          protectedGroup: '双键仍维持 Br₂ 保护状态',
          reason: '饱和碳骨架不会与 CH₃I 或强碱 NaOH 发生副反应。',
        },
        cutBond: null,
        atomEconomy: 78.2,
        fgiType: '威廉姆逊成醚 (Williamson Etherification)',
        nodes: [
          { id: 'dib', label: '二溴代酚', formula: 'C≉H₁₀Br₂O', x: 220, y: 120, role: 'protected', isProtectedGroup: true },
          { id: 'me', label: 'CH₃I + NaOH 成醚试剂', formula: 'CH₃I', x: 620, y: 120, role: 'reagent' },
          { id: 'eth', label: '二溴代甲基醚', formula: 'C₁₀H₁₂Br₂O', x: 420, y: 330, role: 'intermediate' },
          { id: 'dep', label: '待 Zn 粉脱溴 Deprotection', formula: 'Zn / EtOH', x: 420, y: 510, role: 'intermediate', badge: '等待复原双键' },
        ],
        connections: [
          { from: 'dib', to: 'eth', label: '酚 -OH 甲基化' },
          { from: 'me', to: 'eth', label: '提供 -CH₃' },
          { from: 'eth', to: 'dep', label: '还原消去' },
        ],
      },
      {
        stepIndex: 3,
        title: '第 3 步：锌粉在乙醇中加热脱溴复原碳碳双键',
        description: '加入 Zn 粉在无水乙醇中加热，发生还原性消去脱去 ZnBr₂，重新复原 C=C 双键。',
        reactants: [
          { name: '二溴代甲基醚', formula: 'C₁₀H₁₂Br₂O' },
          { name: '锌粉', formula: 'Zn' },
        ],
        products: [
          { name: '4-甲氧基苯丙烯 (TM)', formula: 'C₁₀H₁₂O' },
          { name: '溴化锌', formula: 'ZnBr₂' },
        ],
        reagents: 'Zn 粉 / CH₃CH₂OH / Δ 回流',
        protectionStatus: {
          isProtected: false,
          deprotectingAgent: 'Zn 粉 / 乙醇',
          reason: '还原性消去脱溴，成功保留酚甲基醚并复原双键。',
        },
        cutBond: null,
        atomEconomy: 69.5,
        fgiType: 'Zn 粉消去脱保护 (Deprotection)',
        nodes: [
          { id: 'eth', label: '二溴代甲基醚', formula: 'C₁₀H₁₂Br₂O', x: 220, y: 120, role: 'intermediate' },
          { id: 'zn', label: 'Zn 粉 / EtOH 脱溴试剂', formula: 'Zn', x: 620, y: 120, role: 'reagent' },
          { id: 'tm', label: '4-甲氧基苯丙烯 (TM)', formula: 'C₁₀H₁₂O', x: 420, y: 330, role: 'TM', isTarget: true, badge: '完好双键 + 酚醚' },
          { id: 'salt', label: '副产物 溴化锌 沉淀', formula: 'ZnBr₂', x: 420, y: 510, role: 'intermediate', badge: '沉淀分离' },
        ],
        connections: [
          { from: 'eth', to: 'tm', label: 'Zn 脱溴 β-消去' },
          { from: 'zn', to: 'tm', label: '生成 ZnBr₂ 沉淀' },
          { from: 'tm', to: 'salt', label: '滤去沉淀' },
        ],
      },
    ],
  },
  'carbon-carbon-builder': {
    id: 'carbon-carbon-builder',
    title: '模型四：高考推断 C-C 键构建 (格式试剂与逆合成切断)',
    subtitle: '格氏试剂 (RMgX) 加成/羟醛缩合新情境碳链增长切断',
    targetMolecule: '1,3-二苯基-2-丙烯-1-酮',
    targetFormula: 'C₁₅H₁₂O',
    difficulty: '高考冲刺',
    description:
      '高考有机推断常考 C-C 键切断与增长。通过逆合成切断法定位双键两侧 C-C 键，推断前体为苯甲醛与乙酰苯，在碱催化下发生羟醛缩合 (Aldol Condensation)。',
    coreStrategy:
      '逆向切断 α,β-不饱和酮的 C=C 双键，得到两分子羰基化合物前体；正向合成利用 NaOH 碱催化羟醛缩合脱水生成目标产物。',
    protectionKeyPoints: [
      'α,β-不饱和羰基化合物切断点位于 C=C 双键处',
      '切断后产生 [Ar-CHO] 亲电碳与 [Ar-COCH₂⁻] 亲核碳碎片',
      '控制碱浓度与温度，防止多聚反应发生',
    ],
    infoReaction: {
      name: '羟醛缩合反应 (Aldol Condensation)',
      equation: 'Ar-CHO + CH₃-CO-Ar\' → Ar-CH=CH-CO-Ar\' + H₂O',
      mechanismDesc: 'α-氢在碱作用下形成烯醇负离子，亲核加成醛羰基，随后脱水生成 α,β-不饱和酮。',
    },
    steps: [
      {
        stepIndex: 1,
        title: '第 1 步：目标分子 C=C 切断与等价物逆推',
        description: '在目标分子中定位 α,β-不饱和酮键，✂ 剪刀切断双键，推导两个羰基前体。',
        reactants: [{ name: '1,3-二苯基-2-丙烯-1-酮', formula: 'C₁₅H₁₂O' }],
        products: [
          { name: '苯甲醛 (前体 1)', formula: 'C⇥H₆O' },
          { name: '乙酰苯 (前体 2)', formula: 'C∯H∯O' },
        ],
        reagents: '逆向切断 (✂ C=C Disconnection)',
        protectionStatus: { isProtected: false },
        cutBond: {
          bondType: 'C=C 碳碳双键切断',
          positionDesc: 'α,β-不饱和双键',
          retroSynthon: '[Ph-CHO] + [Ph-CO-CH₃]',
        },
        atomEconomy: 92.0,
        fgiType: 'C=C 双键逆向切断',
        nodes: [
          { id: 'tm', label: '1,3-二苯基-2-丙烯-1-酮', formula: 'C₁₅H₁₂O', x: 420, y: 100, role: 'TM', isTarget: true },
          { id: 'b1', label: '苯甲醛 (亲电Synthons)', formula: 'C⇥H₆O', x: 220, y: 320, role: 'precursor', badge: '亲电前体' },
          { id: 'b2', label: '乙酰苯 (亲核Synthons)', formula: 'C∯H∯O', x: 620, y: 320, role: 'precursor', badge: '亲核 α-H 前体' },
          { id: 'aldol', label: 'β-羟基酮 中间体', formula: 'Aldol Intermediate', x: 420, y: 510, role: 'intermediate', badge: '加成中间体' },
        ],
        connections: [
          { from: 'tm', to: 'b1', label: '✂ 切断 C=C 双键', isDisconnection: true },
          { from: 'tm', to: 'b2', label: '✂ 释放乙酰苯', isDisconnection: true },
          { from: 'b1', to: 'aldol', label: '逆推亲核加成' },
        ],
      },
      {
        stepIndex: 2,
        title: '第 2 步：碱催化羟醛缩合 C-C 键增长与脱水',
        description: '在 10% NaOH 稀溶液中，乙酰苯 α-H 脱质子亲核加成苯甲醛，脱去 H₂O 形成 C=C 双键。',
        reactants: [
          { name: '苯甲醛', formula: 'C⇥H₆O' },
          { name: '乙酰苯', formula: 'C∯H∯O' },
        ],
        products: [
          { name: '目标产物', formula: 'C₁₅H₁₂O' },
          { name: '水', formula: 'H₂O' },
        ],
        reagents: '10% NaOH / EtOH / 室温搅拌',
        protectionStatus: { isProtected: false },
        cutBond: null,
        atomEconomy: 92.0,
        fgiType: '羟醛缩合 (Aldol Condensation)',
        nodes: [
          { id: 'b1', label: '苯甲醛 (醛基)', formula: 'C⇥H₆O', x: 220, y: 120, role: 'precursor' },
          { id: 'b2', label: '乙酰苯 (酮基)', formula: 'C∯H∯O', x: 620, y: 120, role: 'precursor' },
          { id: 'tm', label: '1,3-二苯基-2-丙烯-1-酮', formula: 'C₁₅H₁₂O', x: 420, y: 330, role: 'TM', isTarget: true, badge: 'C-C 键成链' },
          { id: 'h2o', label: '副产物 H₂O 脱去', formula: 'H₂O', x: 420, y: 510, role: 'intermediate', badge: '脱水完成' },
        ],
        connections: [
          { from: 'b1', to: 'tm', label: '羰基亲核加成' },
          { from: 'b2', to: 'tm', label: 'α-C 偶联脱水' },
          { from: 'tm', to: 'h2o', label: '消除 H₂O' },
        ],
      },
    ],
  },
}

export function useOrganicRetrosynthesisChemistry() {
  const [modelId, setModelId] = useState<RetrosynthesisModelId>('aspirin-benorilate')
  const [synthesisMode, setSynthesisMode] = useState<SynthesisMode>('retrosynthetic')
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const currentModel = useMemo(() => RETRO_MODELS_DATA[modelId], [modelId])
  const currentStep: RetrosynthesisStep = useMemo(() => {
    const steps = currentModel.steps
    const idx = Math.min(Math.max(currentStepIndex, 0), steps.length - 1)
    return steps[idx]
  }, [currentModel, currentStepIndex])

  const handleNextStep = () => {
    if (currentStepIndex < currentModel.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const handleResetStep = () => {
    setCurrentStepIndex(0)
    setIsPlaying(false)
  }

  const selectModel = (id: RetrosynthesisModelId) => {
    setModelId(id)
    setCurrentStepIndex(0)
    setIsPlaying(false)
  }

  return {
    modelId,
    selectModel,
    synthesisMode,
    setSynthesisMode,
    currentModel,
    currentStepIndex,
    setCurrentStepIndex,
    currentStep,
    totalSteps: currentModel.steps.length,
    isPlaying,
    setIsPlaying,
    handleNextStep,
    handlePrevStep,
    handleResetStep,
  }
}
