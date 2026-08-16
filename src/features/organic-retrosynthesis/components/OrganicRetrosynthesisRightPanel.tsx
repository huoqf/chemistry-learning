import { ChemistryPanel } from '@/components/UI'
import type { RetrosynthesisModelData, RetrosynthesisStep, SynthesisMode } from '../types'

interface OrganicRetrosynthesisRightPanelProps {
  currentModel: RetrosynthesisModelData
  currentStep: RetrosynthesisStep
  synthesisMode?: SynthesisMode
}

export function OrganicRetrosynthesisRightPanel({
  currentModel,
  currentStep,
  synthesisMode = 'retrosynthetic',
}: OrganicRetrosynthesisRightPanelProps) {
  // 1. 化学量看板 (quantities)
  const quantities = [
    {
      label: '目标分子 (TM)',
      value: currentModel.targetMolecule.split('(')[0].trim(),
      unit: currentModel.targetFormula,
    },
    {
      label: '策略模式',
      value:
        synthesisMode === 'retrosynthetic'
          ? '逆合成切断 ✂'
          : synthesisMode === 'forward'
          ? '正向组装 ➔'
          : '保护基闭环 🛡',
      unit: `Step ${currentStep.stepIndex}`,
    },
    {
      label: '理论原子利用率',
      value: currentStep.atomEconomy,
      unit: '%',
      highlight: (currentStep.atomEconomy >= 80 ? 'positive' : 'negative') as 'positive' | 'negative',
    },
    {
      label: '官能团保护状态',
      value: currentStep.protectionStatus.isProtected ? '🛡 防护态' : '已复原 / 暴露',
      unit: currentStep.protectionStatus.protectedGroup || '未保护',
      highlight: (currentStep.protectionStatus.isProtected ? 'equilibrium' : 'zero') as 'equilibrium' | 'zero',
    },
  ]

  // 2. 反应方程式与合成子公式 (formulas) — 符合人类阅读习惯的多行紧凑对齐，绝不溢出
  const getModelSpecificFormulas = () => {
    switch (currentModel.id) {
      case 'aspirin-benorilate':
        return [
          {
            name: currentStep.title.split('：')[1] || currentStep.title,
            latex: '\\begin{aligned} &\\mathrm{Ar\\text{-}OH + (Ac)_2O} \\\\[2pt] &\\quad \\xrightarrow{\\mathrm{H^+}} \\mathrm{Ar\\text{-}OAc + AcOH} \\end{aligned}',
            condition: currentStep.reagents,
            note: '水杨酸酚羟基发生选择性亲核酰化保护。',
          },
          {
            name: '酯键逆向切断与合成子 (Synthons)',
            latex: '\\begin{aligned} &\\mathrm{Ar\\text{-}COO\\text{-}Ar\' (贝诺酯)} \\\\[2pt] &\\quad \\Downarrow \\text{ ✂ 切断 C-O 键} \\\\[2pt] &\\mathrm{[Ar\\text{-}CO]^+ + [Ar\'\\text{-}O]^-} \\end{aligned}',
            condition: '切断 C-O 酯单键',
            note: '亲电等价物为乙酰水杨酸，亲核等价物为对乙酰氨基酚。',
          },
          {
            name: '高考合成路线标准答题范式',
            latex: '\\begin{aligned} &\\mathrm{A} \\xrightarrow{\\text{试剂 1}} \\mathrm{B(保护)} \\\\[2pt] &\\quad \\xrightarrow{\\text{试剂 2}} \\mathrm{C} \\xrightarrow{\\text{脱保护}} \\mathrm{TM} \\end{aligned}',
            condition: '单向分步流程',
            note: '箭头上下必须写全主试剂与反应条件，保护与脱保护必须配对。',
          },
        ]
      case 'diels-alder-acetal':
        return [
          {
            name: currentStep.title.split('：')[1] || currentStep.title,
            latex: '\\begin{aligned} &\\mathrm{R\\text{-}CHO + (CH_2OH)_2} \\\\[2pt] &\\quad \\rightleftharpoons \\mathrm{环状缩醛 + H_2O} \\end{aligned}',
            condition: currentStep.reagents,
            note: '醛基在 TsOH 催化下与乙二醇脱水生成 1,3-二氧五环。',
          },
          {
            name: 'Diels-Alder [4+2] 环加成逆推',
            latex: '\\begin{aligned} &\\mathrm{六元碳环骨架} \\\\[2pt] &\\quad \\Downarrow \\text{ [4+2] 逆推} \\\\[2pt] &\\mathrm{共轭双烯 + 亲双烯体} \\end{aligned}',
            condition: 'Δ 加热环化',
            note: '1,3-丁二烯与亲双烯体一步构建六元碳环骨架。',
          },
          {
            name: '高考合成路线标准答题范式',
            latex: '\\begin{aligned} &\\mathrm{A} \\xrightarrow{\\text{试剂 1}} \\mathrm{B(保护)} \\\\[2pt] &\\quad \\xrightarrow{\\text{试剂 2}} \\mathrm{C} \\xrightarrow{\\text{脱保护}} \\mathrm{TM} \\end{aligned}',
            condition: '单向分步流程',
            note: '强还原剂反应后，必须加入稀酸 (H₃O⁺) 加热水解复原醛基。',
          },
        ]
      case 'double-bond-protection':
        return [
          {
            name: currentStep.title.split('：')[1] || currentStep.title,
            latex: '\\begin{aligned} &\\mathrm{R\\text{-}CH=CH_2 + Br_2} \\\\[2pt] &\\quad \\rightarrow \\mathrm{R\\text{-}CHBr\\text{-}CH_2Br} \\end{aligned}',
            condition: currentStep.reagents,
            note: '亲电加成消除双键不饱和性，保护骨架抗强氧化与强碱。',
          },
          {
            name: '金属 Zn 粉还原消去脱溴',
            latex: '\\begin{aligned} &\\mathrm{邻二溴代烷 + Zn} \\\\[2pt] &\\quad \\xrightarrow{\\mathrm{EtOH, \\Delta}} \\mathrm{烯烃 + ZnBr_2\\downarrow} \\end{aligned}',
            condition: 'Zn 粉 / 无水乙醇加热',
            note: '两电子转移反式 β-消去高效复原碳碳双键。',
          },
          {
            name: '高考合成路线标准答题范式',
            latex: '\\begin{aligned} &\\mathrm{A} \\xrightarrow{\\text{试剂 1}} \\mathrm{B(保护)} \\\\[2pt] &\\quad \\xrightarrow{\\text{试剂 2}} \\mathrm{C} \\xrightarrow{\\text{脱保护}} \\mathrm{TM} \\end{aligned}',
            condition: '单向分步流程',
            note: '高考答题框中，绝不能遗漏最后一步 Zn/EtOH 脱溴步骤！',
          },
        ]
      case 'carbon-carbon-builder':
        return [
          {
            name: currentStep.title.split('：')[1] || currentStep.title,
            latex: '\\begin{aligned} &\\mathrm{Ph\\text{-}CHO + MeCOPh} \\\\[2pt] &\\quad \\xrightarrow{\\mathrm{OH^-}} \\mathrm{Ph\\text{-}CH=CH\\text{-}COPh + H_2O} \\end{aligned}',
            condition: currentStep.reagents,
            note: '碱催化羟醛缩合脱水构建共轭 α,β-不饱和烯酮。',
          },
          {
            name: 'α,β-不饱和烯酮 C=C 双键切断',
            latex: '\\begin{aligned} &\\mathrm{共轭 \\alpha,\\beta\\text{-}不饱和烯酮} \\\\[2pt] &\\quad \\Downarrow \\text{ ✂ 双键逆向切断} \\\\[2pt] &\\mathrm{[Ph\\text{-}CH]^+ + [CH_2COPh]^-} \\end{aligned}',
            condition: '逆向双键断裂',
            note: '亲电前体为苯甲醛，亲核前体为苯乙酮 (含活泼 α-H)。',
          },
          {
            name: '高考合成路线标准答题范式',
            latex: '\\begin{aligned} &\\mathrm{A} \\xrightarrow{\\text{试剂 1}} \\mathrm{B(保护)} \\\\[2pt] &\\quad \\xrightarrow{\\text{试剂 2}} \\mathrm{C} \\xrightarrow{\\text{脱保护}} \\mathrm{TM} \\end{aligned}',
            condition: '单向分步流程',
            note: '通过羟醛缩合实现分子间碳链骨架的精确增长。',
          },
        ]
      default:
        return []
    }
  }

  // 3. 高考破解要点 (gaokaoPoints) — 100% 按当前模型动态分类呈现
  const getModelSpecificGaokaoPoints = () => {
    switch (currentModel.id) {
      case 'aspirin-benorilate':
        return [
          {
            text: '【水杨酸双活性位点选择性】：分子中同时含有 -COOH 与酚 -OH，与乙酸酐反应时酚羟基优先酯化被保护，保留游离羧基单向缩合。',
            importance: 'gaokao' as const,
          },
          {
            text: '【酯键逆向切断策略】：目标分子中酚酯键活性高于酰胺键，优先剪刀 ✂ 切断酚酯键，逆推得到乙酰水杨酸与对乙酰氨基酚。',
            importance: 'core' as const,
          },
          {
            text: '【前体药物体内酶解】：保护基团 (-OCOCH₃) 作为药物结构直接保留，进入人体后经酯酶水解双靶点释放阿司匹林与扑热息痛。',
            importance: 'gaokao' as const,
          },
        ]
      case 'diels-alder-acetal':
        return [
          {
            text: '【Diels-Alder 骨架构建】：1,3-丁二烯 (共轭双烯) 与亲双烯体在加热下发生 [4+2] 环加成，一步构建六元碳环骨架。',
            importance: 'gaokao' as const,
          },
          {
            text: '【乙二醇缩醛耐受性】：生成的 1,3-二氧五环 (环状缩醛) 对强碱、亲核试剂和强还原剂 (LiAlH₄) 高度稳定，保护活泼醛基不被还原。',
            importance: 'core' as const,
          },
          {
            text: '【酸水解脱保护复原】：还原酯基为醇后，加入稀酸 (H₃O⁺) 加热水解打破缩醛醚键，高效复原醛基并回收乙二醇。',
            importance: 'gaokao' as const,
          },
        ]
      case 'double-bond-protection':
        return [
          {
            text: '【碳碳双键加溴保护】：双键极易被酸性 KMnO₄ 强氧化或与碱性亲电试剂副反应，先加成 Br₂/CCl₄ 生成邻二溴代烷消除不饱和性。',
            importance: 'gaokao' as const,
          },
          {
            text: '【酚羟基安全烷基化】：在双键处于二溴保护状态下，加入强碱与 CH₃I 安全完成酚羟基威廉姆逊成醚反应。',
            importance: 'core' as const,
          },
          {
            text: '【金属 Zn 还原消去脱溴】：反应完成后，加入金属 Zn 粉在无水乙醇中加热回流，发生反式 β-消去脱溴高效复原 C=C 双键。',
            importance: 'gaokao' as const,
          },
        ]
      case 'carbon-carbon-builder':
        return [
          {
            text: '【α,β-不饱和烯酮切断点】：高考推断高频题眼：定位共轭 C=C 双键，从双键处逆向切断推导醛基与活泼甲基酮两个前体。',
            importance: 'gaokao' as const,
          },
          {
            text: '【羟醛缩合机理与对齐】：在稀碱 (10% NaOH) 作用下，苯乙酮 α-H 脱质子形成烯醇负离子，亲核进攻苯甲醛羰基碳成链脱水。',
            importance: 'core' as const,
          },
          {
            text: '【反应选择性控制】：控制苯甲醛适量过量并缓慢滴加苯乙酮，防止苯乙酮分子间发生自身缩合等多聚副反应。',
            importance: 'gaokao' as const,
          },
        ]
      default:
        return []
    }
  }

  // 4. 易错警示 (warnings) — 100% 按当前模型精准警示
  const getModelSpecificWarnings = () => {
    switch (currentModel.id) {
      case 'aspirin-benorilate':
        return [
          {
            text: '【未保护致命副反应】：若水杨酸未进行酚羟基乙酰化保护，其分子间的酚 -OH 与 -COOH 在缩合剂下会发生自身脱水交联聚合，产率极低。',
            level: 'danger' as const,
          },
          {
            text: '【切断选择性禁忌】：切勿优先切断稳定的酰胺键 (-CONH-)，酚酯键更易在温和条件下单向构建。',
            level: 'warning' as const,
          },
        ]
      case 'diels-alder-acetal':
        return [
          {
            text: '【试剂禁忌 · 切勿用碱脱保护】：缩醛在强碱中极度稳定！脱去缩醛保护基只能使用稀酸 (H₃O⁺) 加热水解，严禁加 NaOH 浓碱！',
            level: 'danger' as const,
          },
          {
            text: '【强还原剂选择性】：若不保护醛基，LiAlH₄ 会同时将 -CHO 和 -COOMe 全部还原为醇，无法获得目标醛。',
            level: 'warning' as const,
          },
        ]
      case 'double-bond-protection':
        return [
          {
            text: '【高考致命扣分点】：在答题框设计合成路线时，绝对不能遗漏「脱保护步骤」（如加了 Br₂ 保护双键后必须以 Zn/EtOH 脱溴收尾）！',
            level: 'danger' as const,
          },
          {
            text: '【试剂正交性规律】：酸性 KMnO₄ 强氧化剂会破坏碳碳双键，必须先加 Br₂ 保护消除不饱和性后再进行氧化。',
            level: 'warning' as const,
          },
        ]
      case 'carbon-carbon-builder':
        return [
          {
            text: '【碱浓度与温度控制】：碱性过强或反应温度过高会导致苯乙酮发生分子间自身缩合生成 dypnone 等杂质，降低查尔酮产率。',
            level: 'warning' as const,
          },
          {
            text: '【顺反异构考点】：羟醛缩合脱水产物通常以热力学更稳定的反式 (trans/E 型) 共轭烯酮为主。',
            level: 'info' as const,
          },
        ]
      default:
        return []
    }
  }

  // 5. 记忆口诀 (mnemonic) — 按当前模型精准匹配
  const getModelMnemonic = () => {
    switch (currentModel.id) {
      case 'aspirin-benorilate':
        return '酚羟保护先成酯，羧基偶联贝诺酯。切断瞄准碳氧键，双药合一效倍增。'
      case 'diels-alder-acetal':
        return '双烯环加六元环，缩醛还原酸水解。耐碱耐还原固若金汤，酸解脱除复原醛基。'
      case 'double-bond-protection':
        return '双键加溴防氧化，碱性成醚安无忧。回流锌粉脱二溴，反式消去复双键。'
      case 'carbon-carbon-builder':
        return '烯酮双键切两半，羟醛缩合碳链长。亲电亲核合成子，碱催脱水成共轭。'
      default:
        return '切断找双键或酯，保护瞄准活泼氢。加成脱溴用锌粉，缩醛还原酸水解。'
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden max-w-full select-none">
      <ChemistryPanel
        quantities={quantities}
        formulas={getModelSpecificFormulas()}
        gaokaoPoints={getModelSpecificGaokaoPoints()}
        warnings={getModelSpecificWarnings()}
        mnemonic={getModelMnemonic()}
      />
    </div>
  )
}
