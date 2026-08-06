import { ChemistryPanel } from '@/components/UI'
import type { RetrosynthesisModelData, RetrosynthesisStep } from '../types'

interface OrganicRetrosynthesisRightPanelProps {
  currentModel: RetrosynthesisModelData
  currentStep: RetrosynthesisStep
}

export function OrganicRetrosynthesisRightPanel({
  currentModel,
  currentStep,
}: OrganicRetrosynthesisRightPanelProps) {
  // 1. 化学量与数据统计卡 (quantities)
  const quantities = [
    {
      label: '目标分子 (TM)',
      value: currentModel.targetMolecule,
      unit: currentModel.targetFormula,
    },
    {
      label: '路线进度',
      value: `步骤 ${currentStep.stepIndex}`,
      unit: currentStep.fgiType,
    },
    {
      label: '原子利用率',
      value: currentStep.atomEconomy,
      unit: '%',
      highlight: (currentStep.atomEconomy > 80 ? 'positive' : 'negative') as 'positive' | 'negative',
    },
    {
      label: '官能团 Protection 状态',
      value: currentStep.protectionStatus.isProtected ? '防护中 🛡' : '未保护',
      unit: currentStep.protectionStatus.protectedGroup || '暴露',
      highlight: (currentStep.protectionStatus.isProtected ? 'equilibrium' : 'zero') as 'equilibrium' | 'zero',
    },
  ]

  // 2. 反应方程式与信息反应 (formulas)
  const formulas = [
    {
      name: currentModel.infoReaction ? currentModel.infoReaction.name : '选择性 Protection 反应',
      latex: currentModel.infoReaction
        ? currentModel.infoReaction.equation
        : '\\mathrm{Ar-OH + (CH_3CO)_2O \\rightarrow Ar-O-COCH_3 + CH_3COOH}',
      condition: currentStep.reagents,
      note: currentModel.infoReaction
        ? currentModel.infoReaction.mechanismDesc
        : '保护基团试剂发生选择性亲核取代。',
    },
    {
      name: '切断等价物 (Synthon)',
      latex: currentStep.cutBond
        ? `\\text{${currentStep.cutBond.bondType}} \\Rightarrow ${currentStep.cutBond.retroSynthon}`
        : '\\text{正向组装合成目标分子}',
      condition: currentStep.cutBond ? `切断位置: ${currentStep.cutBond.positionDesc}` : '无切断',
      note: '逆合成分析剪刀切断 C-C 或 C-O 键',
    },
  ]

  // 3. 高考破解要点 (gaokaoPoints)
  const gaokaoPoints = [
    {
      text: '【逆合成切断 3 步法】：1. 定位目标分子官能团；2. 寻找碳骨架构建或切断点 (剪刀 ✂)；3. 推断合成前体。',
      importance: 'gaokao' as const,
    },
    {
      text: '【官能团保护 4 大经典】：酚/醇 -OH 乙酰化成酯；双键加加成 Br₂；醛/酮与乙二醇成缩醛；氨基乙酰化。',
      importance: 'core' as const,
    },
    {
      text: '【脱保护终极原则】：合成步骤完成后，必须加入特定试剂 (如 Zn/H₃O⁺) 脱去保护基团复原原官能团！',
      importance: 'gaokao' as const,
    },
    ...currentModel.protectionKeyPoints.map((pt) => ({
      text: pt,
      importance: 'core' as const,
    })),
  ]

  // 4. 易错警示 (warnings)
  const warnings = [
    {
      text: '高考踩分雷区：在答题框书写合成路线时，绝对不能遗漏「脱保护步骤」（如加了 Br₂ 保护双键后忘记写 Zn/EtOH 脱溴）。',
      level: 'danger' as const,
    },
    {
      text: '注意试剂选择性：含有碳碳双键时，强氧化剂 (KMnO₄/H⁺) 会无差别氧化双键，必须先进行 Protection。',
      level: 'warning' as const,
    },
    {
      text: '缩醛保护基特点：环状缩醛高度耐碱和耐 LiAlH₄ 还原，但极易被稀酸 (H₃O⁺) 水解破坏。',
      level: 'info' as const,
    },
  ]

  return (
    <div className="w-full h-full overflow-y-auto">
      <ChemistryPanel
        quantities={quantities}
        formulas={formulas}
        gaokaoPoints={gaokaoPoints}
        warnings={warnings}
        mnemonic="切断找双键或酯，保护瞄准活泼氢。加加成脱溴用锌粉，缩醛还原酸水解。"
      />
    </div>
  )
}
