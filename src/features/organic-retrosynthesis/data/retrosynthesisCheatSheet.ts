import type { ProtectionCheatItem } from '../types'

/**
 * GAOKAO_PROTECTION_CHEAT_SHEET — 高考有机合成核心保护基策略与易错题眼速查表
 *
 * 层级说明（与 `syllabusTiers` 同一口径）：
 * - `textbook`  教材主线：人教版选择性必修3 第三章第五节《有机合成》正文要求
 * - `info-item` 信息题素材：教材未作要求，高考以"给出信息"的方式考查
 * - `beyond`    超纲术语：大学有机合成表述，不作考点
 */
export const GAOKAO_PROTECTION_CHEAT_SHEET: ProtectionCheatItem[] = [
  {
    targetGroup: '酚羟基 / 醇羟基 (-OH)',
    reagents: '(CH₃CO)₂O / 吡啶 或 CH₃COCl',
    protectedForm: '乙酸酯 (-OCOCH₃)',
    tolerance: '耐酸性氧化剂 (KMnO₄/H⁺)、烷基化亲电试剂',
    deprotection: '稀 NaOH 溶液 / 稀酸加热水解',
    examTip: '防止酚羟基自身氧化或发生分子间多重缩合。',
    syllabusTier: 'textbook',
  },
  {
    targetGroup: '酚羟基 (-OH)',
    reagents: 'PhCH₂Cl / K₂CO₃ (苄氯)',
    protectedForm: '苄醚 (-OCH₂Ph)',
    tolerance: '耐强碱、耐还原剂、耐强酸',
    deprotection: 'H₂ + Pd/C 常温常压催化氢解',
    examTip: '温和脱保护生成 PhCH₃ (甲苯) 和复原酚羟基。苄醚保护与 Pd/C 氢解教材未作要求，属信息题素材。',
    syllabusTier: 'info-item',
  },
  {
    targetGroup: '醛基 / 酮羰基 (-CHO / >C=O)',
    reagents: 'HO-CH₂CH₂-OH / TsOH (乙二醇)',
    protectedForm: '1,3-二氧五环 (环状缩醛 / 缩酮)',
    tolerance: '耐强碱、耐强还原剂 (LiAlH₄/NaBH₄)、耐格氏试剂',
    deprotection: '稀盐酸 (H₃O⁺) / 加热回流水解',
    examTip: '【绝不能用碱脱保护】！缩醛在碱中极稳定，只在酸中水解。注意教材常见官能团保护清单不含羰基，LiAlH₄、格氏试剂均属信息题素材。',
    syllabusTier: 'info-item',
  },
  {
    targetGroup: '碳碳双键 (-CH=CH-)',
    reagents: 'Br₂ / CCl₄ 溶液 (避光加成)',
    protectedForm: '邻二溴代烷 (-CHBr-CHBr-)',
    tolerance: '消除不饱和性，耐酸性 KMnO₄ 强氧化、耐强碱性烷基化',
    deprotection: '金属 Zn 粉 / 无水乙醇加热 (β-消去)',
    examTip: '【失分重灾区】：路线设计中不能遗漏 Zn/EtOH 脱溴步骤！该试剂与条件由题目信息给出，教材未作要求。',
    syllabusTier: 'info-item',
  },
  {
    targetGroup: '氨基 (-NH₂)',
    reagents: '(CH₃CO)₂O 或 CH₃COCl',
    protectedForm: '乙酰苯胺 (-NHCOCH₃)',
    tolerance: '降低氨基氮的亲核性与碱性，耐浓硝酸氧化/定位钝化',
    deprotection: '酸性 (稀H₂SO₄) 或碱性 (NaOH) 水解',
    examTip: '苯胺硝化制对硝基苯胺时，必须先将氨基乙酰化保护，防硝酸氧化并控制对位取代。',
    syllabusTier: 'textbook',
  },
]
