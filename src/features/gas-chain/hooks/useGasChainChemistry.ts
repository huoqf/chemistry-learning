/**
 * src/features/gas-chain/hooks/useGasChainChemistry.ts
 * 气体制备/净化/尾气处理装置链工具 - 纯化学计算 Hook
 */

import { useMemo } from 'react'
import type {
  GasChainParams,
  DiagnosticIssue,
} from '../types'

export interface GasChainChemistryResult {
  gasPurity: number          // 目标气体纯度 (0 - 100%)
  impurityConc: number       // 杂质残留浓度 (0 - 100%)
  tailAbsorbRate: number     // 尾气吸收效率 (0 - 100%)
  flowRateOut: number        // 最终流出流速 (mL/min)
  issues: DiagnosticIssue[]  // 逻辑与避坑诊断提示
  hasDangerAlert: boolean    // 是否存在高危引发事故项
  dangerType: 'siphon' | 'splashing' | 'clogging' | 'none'
  reactionEquation: string   // 发生方程式
  purificationEquation: string // 净化/干燥方程式
  tailGasEquation: string    // 尾气吸收方程式
}

export function useGasChainChemistry(params: GasChainParams): GasChainChemistryResult {
  return useMemo(() => {
    const {
      systemId,
      targetGas,
      generator,
      washingSteps,
      collection,
      tailGas,
      flowRate,
      temp,
      heating,
    } = params

    // 按 role/device 精确提取净化与干燥步骤，避免仅凭索引 0 造成两者相互覆盖
    const purifyStep = washingSteps.find(
      (s) => s.role === 'purify' || s.role === 'detect' || s.device === 'wash-bottle'
    )
    const washReagent = purifyStep?.reagent ?? 'none'
    const washReverse = purifyStep?.reversed ?? false
    const dryer = washingSteps.find((s) => s.device === 'dry-tube')?.reagent
      ?? (washingSteps.find((s) => s.device === 'acid-bottle') ? 'conc-h2so4' : 'none')

    const issues: DiagnosticIssue[] = []
    let dangerType: 'siphon' | 'splashing' | 'clogging' | 'none' = 'none'

    // 1. 发生器条件与气体匹配审查
    if ((generator === 'flask-heat' || generator === 'testtube-heat') && !heating) {
      issues.push({
        id: 'no-heating-gen',
        level: 'warning',
        title: '提示：加热发生反应未开启酒精灯',
        description: `当前选用的发生装置需要加热才能反应生成 ${targetGas}，建议开启酒精灯加热！`,
        examPoint: '高考反应条件审查：MnO₂ + 浓盐酸、固固制 NH₃、乙醇脱水等均需加热。',
      })
    }

    // 发生装置与目标气体匹配校验
    if (targetGas === 'Cl₂' || systemId === 'cl2-prep') {
      if (generator === 'testtube-heat') {
        dangerType = 'splashing'
        issues.push({
          id: 'generator-cl2-wrong',
          level: 'danger',
          title: '严重化学错误：Cl₂ 制备严禁使用固-固加热试管！',
          description: 'Cl₂ 实验室制法是用 MnO₂ 固体与浓盐酸液体加热反应，倾斜试管装液体加热会导致浓盐酸直接流出或剧烈暴沸喷溅！必须使用圆底/蒸馏烧瓶 + 分液漏斗。',
          examPoint: '反应物状态与发生装置选择：固+液加热必须使用烧瓶/蒸馏烧瓶 + 分液漏斗，严禁用倾斜试管。',
        })
      } else if (generator === 'kipp') {
        dangerType = 'clogging'
        issues.push({
          id: 'generator-cl2-kipp-wrong',
          level: 'danger',
          title: '化学逻辑错误：Cl₂ 制备不能使用启普发生器！',
          description: '启普发生器适用于“块状固体 + 液体 不加热”反应，而 Cl₂ 制备需要加热且反应物 MnO₂ 为粉末状，会从小孔掉入底球！',
          examPoint: '启普发生器使用条件：①块状固体(非粉末)；②液体；③不加热；④生成难溶/微溶气体。',
        })
      }
    } else if (targetGas === 'NH₃' || systemId === 'nh3-prep') {
      if (generator === 'flask-noheat' || generator === 'kipp') {
        dangerType = 'clogging'
        issues.push({
          id: 'generator-nh3-wrong',
          level: 'danger',
          title: '高考常考陷阱：NH₃ 实验室标准制法需用固-固加热试管！',
          description: '实验室制 NH₃ 经典反应为 2NH₄Cl + Ca(OH)₂ 固体加热，必须使用固-固加热倾斜试管（试管口略向下倾斜防冷凝水倒流）。',
          examPoint: '固+固加热制气 (NH₃/O₂) 试管口必须略向下倾斜，防止反应生成的水蒸气冷凝倒流炸裂试管。',
        })
      }
    } else if (targetGas === 'SO₂' || systemId === 'so2-chain') {
      if (generator === 'kipp') {
        dangerType = 'clogging'
        issues.push({
          id: 'generator-so2-kipp-wrong',
          level: 'danger',
          title: '化学逻辑错误：SO₂ 制备不能使用启普发生器！',
          description: 'Na₂SO₃ 为粉末状固体且易溶于水，且生成的 SO₂ 易溶于水，完全不符合启普发生器使用条件（块状难溶固体+液体常温生成难溶气体）！',
          examPoint: '启普发生器使用条件：①块状固体(非粉末)；②液体；③不加热；④生成难溶/微溶气体。',
        })
      } else if (generator === 'testtube-heat') {
        issues.push({
          id: 'generator-so2-testtube-wrong',
          level: 'warning',
          title: '装置选择不当：Na₂SO₃ 与 H₂SO₄ 反应为固液常温，无需固固试管加热',
          description: '实验室制 SO₂ 用亚硫酸钠粉末与 70% 硫酸常温反应即可快速发生，使用固固加热试管存在液体倒流腐蚀风险。',
          examPoint: '反应物为粉末固体+液体且常温反应，应选用分液漏斗+圆底/蒸馏/锥形瓶。',
        })
      }
    } else if (targetGas === 'C₂H₄' || systemId === 'c2h4-prep') {
      if (generator !== 'flask-heat') {
        dangerType = 'splashing'
        issues.push({
          id: 'generator-c2h4-wrong',
          level: 'danger',
          title: '严重错误：乙烯 (C₂H₄) 制备必须使用烧瓶加热并控制 170°C！',
          description: '乙醇脱水制乙烯需要浓硫酸催化加热至 170°C，且温度计水银球必须浸没在反应混合液面下，不能使用其他发生装置。',
          examPoint: '乙烯制备三大要素：①蒸馏烧瓶；②浓硫酸与乙醇 3:1 混合；③水银球浸没液面下控温 170°C。',
        })
      }
    } else if (targetGas === 'C₂H₂' && generator === 'kipp') {
      dangerType = 'clogging'
      issues.push({
        id: 'generator-c2h2-kipp-wrong',
        level: 'danger',
        title: '高考经典陷阱：实验室制乙炔 (C₂H₂) 严禁使用启普发生器！',
        description: '电石 (CaC₂) 与水反应剧烈放热，生成的糊状 Ca(OH)₂ 会堵塞启普发生器球形漏斗下端并使反应无法随时停止，易引起炸裂。',
        examPoint: '实验室制乙炔必须选用分液漏斗 + 烧瓶/锥形瓶，且用饱和食盐水代替纯水以减缓反应速率。',
      })
    }

    // 发生方程式计算（覆盖全部 13 种气体）
    let reactionEquation = ''
    if (systemId === 'cl2-prep' || targetGas === 'Cl₂') {
      reactionEquation = '\\text{MnO}_2 + 4\\text{HCl(浓)} \\xrightarrow{\\Delta} \\text{MnCl}_2 + \\text{Cl}_2\\uparrow + 2\\text{H}_2\\text{O}'
    } else if (systemId === 'nh3-prep' || targetGas === 'NH₃') {
      reactionEquation = '2\\text{NH}_4\\text{Cl} + \\text{Ca(OH)}_2 \\xrightarrow{\\Delta} \\text{CaCl}_2 + 2\\text{NH}_3\\uparrow + 2\\text{H}_2\\text{O}'
    } else if (systemId === 'so2-chain' || targetGas === 'SO₂') {
      reactionEquation = '\\text{Na}_2\\text{SO}_3 + \\text{H}_2\\text{SO}_4(70\\%) \\rightarrow \\text{Na}_2\\text{SO}_4 + \\text{SO}_2\\uparrow + \\text{H}_2\\text{O}'
    } else if (systemId === 'no-no2-chain' || targetGas === 'NO₂' || targetGas === 'NO') {
      if (targetGas === 'NO') {
        reactionEquation = '3\\text{Cu} + 8\\text{HNO}_3(\\text{稀}) \\rightarrow 3\\mathrm{Cu(NO_3)_2} + 2\\text{NO}\\uparrow + 4\\text{H}_2\\text{O}'
      } else {
        reactionEquation = '\\text{Cu} + 4\\text{HNO}_3(\\text{浓}) \\rightarrow \\mathrm{Cu(NO_3)_2} + 2\\text{NO}_2\\uparrow + 2\\text{H}_2\\text{O}'
      }
    } else if (targetGas === 'C₂H₂') {
      reactionEquation = '\\text{CaC}_2 + 2\\text{H}_2\\text{O} \\rightarrow \\text{Ca(OH)}_2 + \\text{C}_2\\text{H}_2\\uparrow'
    } else if (targetGas === 'CO₂') {
      reactionEquation = '\\text{CaCO}_3 + 2\\text{HCl} = \\text{CaCl}_2 + \\text{CO}_2\\uparrow + \\text{H}_2\\text{O}'
    } else if (targetGas === 'CO') {
      reactionEquation = '\\text{HCOOH} \\xrightarrow[\\Delta]{\\text{浓 H}_2\\text{SO}_4} \\text{CO}\\uparrow + \\text{H}_2\\text{O}'
    } else if (targetGas === 'O₂') {
      reactionEquation = '2\\text{H}_2\\text{O}_2 \\xrightarrow{\\text{MnO}_2} 2\\text{H}_2\\text{O} + \\text{O}_2\\uparrow'
    } else if (targetGas === 'H₂') {
      reactionEquation = '\\text{Zn} + \\text{H}_2\\text{SO}_4(\\text{稀}) = \\text{ZnSO}_4 + \\text{H}_2\\uparrow'
    } else if (targetGas === 'HCl') {
      reactionEquation = '\\text{NaCl(固)} + \\text{H}_2\\text{SO}_4(\\text{浓}) \\xrightarrow{\\text{微热}} \\text{NaHSO}_4 + \\text{HCl}\\uparrow'
    } else if (targetGas === 'H₂S') {
      reactionEquation = '\\text{FeS} + 2\\text{HCl} = \\text{FeCl}_2 + \\text{H}_2\\text{S}\\uparrow'
    } else {
      reactionEquation = `\\text{CH}_3\\text{CH}_2\\text{OH} \\xrightarrow[${temp}^\\circ\\text{C}]{\\text{浓 H}_2\\text{SO}_4} \\text{CH}_2=\\text{CH}_2\\uparrow + \\text{H}_2\\text{O}`
    }

    // 净化方程式计算
    let purificationEquation = ''
    if (washReagent === 'none') {
      purificationEquation = '\\text{未配置净化洗气瓶 (跳过洗气)}'
    } else if (washReagent === 'sat-nacl') {
      purificationEquation = '\\text{HCl} + \\text{H}_2\\text{O} \\rightarrow \\text{HCl(aq)} \\quad (\\text{饱和 NaCl 吸 HCl 抑 } \\text{Cl}_2)'
    } else if (washReagent === 'nahco3') {
      purificationEquation = '\\text{NaHCO}_3 + \\text{HCl} = \\text{NaCl} + \\text{CO}_2\\uparrow + \\text{H}_2\\text{O} \\quad (\\text{除 HCl 增产 } \\text{CO}_2)'
    } else if (washReagent === 'nahso3') {
      purificationEquation = '\\text{NaHSO}_3 + \\text{HCl} = \\text{NaCl} + \\text{SO}_2\\uparrow + \\text{H}_2\\text{O} \\quad (\\text{除 HCl 抑 } \\text{SO}_2)'
    } else if (washReagent === 'cuso4') {
      purificationEquation = '\\text{CuSO}_4 + \\text{H}_2\\text{S} = \\text{CuS}\\downarrow + \\text{H}_2\\text{SO}_4 \\quad (\\text{除去恶臭剧毒 } \\text{H}_2\\text{S})'
    } else if (washReagent === 'fuchsin') {
      purificationEquation = '\\text{SO}_2 + \\text{品红} \\rightleftharpoons \\text{无色不稳定物} \\quad (\\text{检验 SO}_2 \\text{ 漂白性})'
    } else if (washReagent === 'kmno4') {
      purificationEquation = '5\\text{SO}_2 + 2\\text{MnO}_4^- + 2\\text{H}_2\\text{O} = 5\\text{SO}_4^{2-} + 2\\text{Mn}^{2+} + 4\\text{H}^+'
    } else if (washReagent === 'naoh') {
      if (targetGas === 'CO') {
        purificationEquation = '\\text{CO}_2 + 2\\text{NaOH} = \\text{Na}_2\\text{CO}_3 + \\text{H}_2\\text{O}'
      } else if (targetGas === 'C₂H₄') {
        purificationEquation = '\\text{SO}_2/\\text{CO}_2 + 2\\text{NaOH} \\rightarrow \\text{Na}_2\\text{SO}_3/\\text{Na}_2\\text{CO}_3 + \\text{H}_2\\text{O}'
      } else {
        purificationEquation = '\\text{SO}_2 + 2\\text{NaOH} = \\text{Na}_2\\text{SO}_3 + \\text{H}_2\\text{O}'
      }
    } else if (washReagent === 'water') {
      purificationEquation = targetGas === 'NO'
        ? '3\\text{NO}_2 + \\text{H}_2\\text{O} = 2\\text{HNO}_3 + \\text{NO}'
        : '\\text{水洗除去易溶性气体杂质}'
    } else {
      purificationEquation = '\\text{洗气瓶除杂中}'
    }

    // 尾气吸收方程式计算（严格按目标气体分支）
    let tailGasEquation = ''
    if (tailGas === 'combustion') {
      if (targetGas === 'C₂H₂') {
        tailGasEquation = '2\\text{C}_2\\text{H}_2 + 5\\text{O}_2 \\xrightarrow{\\text{点燃}} 4\\text{CO}_2 + 2\\text{H}_2\\text{O}'
      } else if (targetGas === 'CO') {
        tailGasEquation = '2\\text{CO} + \\text{O}_2 \\xrightarrow{\\text{点燃}} 2\\text{CO}_2'
      } else if (targetGas === 'H₂') {
        tailGasEquation = '2\\text{H}_2 + \\text{O}_2 \\xrightarrow{\\text{点燃}} 2\\text{H}_2\\text{O}'
      } else if (targetGas === 'H₂S') {
        tailGasEquation = '2\\text{H}_2\\text{S} + 3\\text{O}_2 \\xrightarrow{\\text{点燃}} 2\\text{SO}_2 + 2\\text{H}_2\\text{O}'
      } else {
        tailGasEquation = '\\text{CH}_2=\\text{CH}_2 + 3\\text{O}_2 \\xrightarrow{\\text{点燃}} 2\\text{CO}_2 + 2\\text{H}_2\\text{O}'
      }
    } else if (tailGas === 'balloon') {
      tailGasEquation = '\\text{气球物理收集 (防尾气逸散污染)}'
    } else if (targetGas === 'NO₂') {
      tailGasEquation = '2\\text{NO}_2 + 2\\text{NaOH} = \\text{NaNO}_2 + \\text{NaNO}_3 + \\text{H}_2\\text{O}'
    } else if (targetGas === 'NO') {
      // 纯 NO 不与 NaOH 反应；高中实验室尾气处理：
      // 先向尾气中通入少量 O₂（开窗通风）将 NO 氧化为 NO₂，再用 NaOH 吸收
      // 等物质量混合气 (NO + NO₂) 才可直接被 NaOH 吸收：
      tailGasEquation = '\\text{（纯 NO 不与 NaOH 反应）}\\\\\\text{尾气处理: }2\\text{NO} + \\text{O}_2 \\rightarrow 2\\text{NO}_2,\\quad \\text{NO} + \\text{NO}_2 + 2\\text{NaOH} = 2\\text{NaNO}_2 + \\text{H}_2\\text{O}'
    } else if (targetGas === 'Cl₂') {
      tailGasEquation = '\\text{Cl}_2 + 2\\text{OH}^- = \\text{Cl}^- + \\text{ClO}^- + \\text{H}_2\\text{O}'
    } else if (targetGas === 'NH₃') {
      tailGasEquation = '\\text{NH}_3 + \\text{H}^+ = \\text{NH}_4^+'
    } else if (targetGas === 'SO₂') {
      tailGasEquation = '\\text{SO}_2 + 2\\text{OH}^- = \\text{SO}_3^{2-} + \\text{H}_2\\text{O}'
    } else if (targetGas === 'HCl') {
      tailGasEquation = '\\text{HCl} + \\text{OH}^- = \\text{Cl}^- + \\text{H}_2\\text{O}'
    } else if (targetGas === 'H₂S') {
      tailGasEquation = '\\text{H}_2\\text{S} + 2\\text{OH}^- = \\text{S}^{2-} + 2\\text{H}_2\\text{O}'
    } else if (targetGas === 'CO₂') {
      tailGasEquation = '\\text{CO}_2 + 2\\text{OH}^- = \\text{CO}_3^{2-} + \\text{H}_2\\text{O}'
    } else {
      tailGasEquation = '\\text{无毒/惰性或已充分收集气体，无需化学中和尾气}'
    }

    // 2. 洗气瓶管道与除杂试剂诊断
    if (washReverse && washReagent !== 'none') {
      dangerType = 'splashing'
      issues.push({
        id: 'wash-reverse',
        level: 'danger',
        title: '高危事故：洗气瓶管路接反（短进长出）！',
        description: '气体由短管进入瓶内增压，将洗气瓶内的液体沿着长导管强行压出瓶外喷溅！',
        examPoint: '洗气瓶除杂必须严格遵循“长进短出”原则，确保气体通入液面下方充分洗涤。',
      })
    }

    if ((systemId === 'c2h4-prep' || targetGas === 'C₂H₄') && washReagent === 'kmno4') {
      issues.push({
        id: 'c2h4-kmno4-wrong',
        level: 'danger',
        title: '高考经典陷阱：除 C₂H₄ 中 SO₂ 杂质严禁使用酸性 KMnO₄！',
        description: '酸性 KMnO₄ 具有强氧化性，会直接切断乙烯的碳碳双键，将乙烯氧化生成 CO₂ 气体，引入新的 CO₂ 杂质！',
        examPoint: '除去 C₂H₄ 中混有的 SO₂/CO₂ 必须且只能使用 NaOH 溶液洗气瓶。',
      })
    }

    // CO₂ 净化试剂误用判断
    if (targetGas === 'CO₂') {
      if (washReagent === 'naoh') {
        issues.push({
          id: 'co2-naoh-wrong',
          level: 'danger',
          title: '严重化学错误：NaOH 溶液会完全吸收目标气体 CO₂！',
          description: 'CO₂ 为酸性氧化物，与 NaOH 剧烈反应 2NaOH + CO₂ = Na₂CO₃ + H₂O，导致目标气体全部被吸收，无气体导出！',
          examPoint: '除去 CO₂ 中混有的 HCl 酸雾，必须使用饱和 NaHCO₃ 溶液（NaHCO₃ + HCl = NaCl + CO₂↑ + H₂O），严禁使用 NaOH 或 Na₂CO₃ 溶液。',
        })
      } else if (washReagent === 'water') {
        issues.push({
          id: 'co2-water-warning',
          level: 'warning',
          title: '洗气试剂选择不当：CO₂ 在水中溶解度较大导致气体损失！',
          description: '常温常压下 1 体积水可溶解约 1 体积 CO₂，用水洗气会溶解吸收大量目标气体。应改用饱和 NaHCO₃ 溶液。',
          examPoint: '除 HCl 杂质用饱和 NaHCO₃ 溶液，既抑制 CO₂ 溶解，又将 HCl 转化为 CO₂。',
        })
      }
    }

    // SO₂ 净化试剂误用判断
    if (targetGas === 'SO₂' && washReagent === 'naoh') {
      issues.push({
        id: 'so2-naoh-wrong',
        level: 'danger',
        title: '严重化学错误：NaOH 溶液会完全吸收目标气体 SO₂！',
        description: 'SO₂ 为酸性氧化物，通入 NaOH 溶液中直接反应生成 Na₂SO₃，目标气体无法导出！',
        examPoint: '除去 SO₂ 中混有的 SO₃/HCl 酸雾，应选用饱和 NaHSO₃ 溶液洗气，严禁选用 NaOH 溶液。',
      })
    }

    // C₂H₂ 净化试剂误用判断
    if (targetGas === 'C₂H₂' && washReagent === 'naoh') {
      issues.push({
        id: 'c2h2-naoh-warning',
        level: 'warning',
        title: '除杂试剂选择不当：NaOH 只能吸收 H₂S，无法除去 PH₃',
        description:
          '电石法制乙炔中的有害杂质为 H₂S 与 PH₃。NaOH 溶液只能吸收酸性气体 H₂S，对 PH₃ 无效；而饱和 CuSO₄ 溶液可与二者分别生成难溶 CuS、磷化铜沉淀，一次性除尽，故为标准选择。',
        examPoint: '除去 C₂H₂ 中的 H₂S/PH₃ 应使用饱和 CuSO₄ 溶液：CuSO₄ + H₂S = CuS↓ + H₂SO₄（PH₃ 亦生成难溶磷化铜沉淀）。',
      })
    }

    // 3. 干燥剂化学冲突与配合/封堵诊断
    let dryerClogged = false
    if (targetGas === 'NH₃' || systemId === 'nh3-prep') {
      if (dryer === 'conc-h2so4') {
        dryerClogged = true
        dangerType = 'clogging'
        issues.push({
          id: 'dryer-nh3-acid',
          level: 'danger',
          title: '高考易错陷阱：严禁使用浓硫酸干燥氨气 (NH₃)！',
          description: '氨气为碱性气体，与浓硫酸发生剧烈反应 2NH₃ + H₂SO₄ = (NH₄)₂SO₄ 生成固体结晶，封堵导管！',
          examPoint: '酸性干燥剂 (浓H₂SO₄/P₂O₅) 不能干燥碱性气体 (NH₃)；碱性干燥剂 (碱石灰) 不能干燥酸性气体。',
        })
      } else if (dryer === 'cacl2') {
        dryerClogged = true
        dangerType = 'clogging'
        issues.push({
          id: 'dryer-nh3-cacl2',
          level: 'danger',
          title: '高考压轴陷阱：无水 CaCl₂ 不能干燥氨气 (NH₃)！',
          description: '无水 CaCl₂ 会与 NH₃ 发生络合反应生成八氨合氯化钙 CaCl₂·8NH₃ 配合物，吸收氨气导致实验完全失败！',
          examPoint: '干燥 NH₃ 必须且只能选用碱石灰 (CaO + NaOH) 干燥管。',
        })
      }
    } else if (['Cl₂', 'SO₂', 'NO₂', 'CO₂', 'HCl', 'H₂S'].includes(targetGas) || systemId === 'cl2-prep' || systemId === 'so2-chain') {
      if (dryer === 'soda-lime') {
        dryerClogged = true
        dangerType = 'clogging'
        issues.push({
          id: 'dryer-acid-sodalime',
          level: 'danger',
          title: '严重错误：碱石灰会完全吸收酸性气体 (Cl₂ / SO₂ / NO₂ / CO₂ / HCl / H₂S)！',
          description: '碱石灰 (CaO+NaOH) 为强碱性干燥剂，会与酸性气体发生中和反应全部吸收，导致出口无气体流出！',
          examPoint: '干燥酸性气体 (Cl₂, SO₂, CO₂, NO₂, HCl) 应选用浓硫酸或无水 CaCl₂（H₂S 只能用无水 CaCl₂ / P₂O₅）。',
        })
      }
    }
    if (targetGas === 'H₂S' && dryer === 'conc-h2so4') {
      dryerClogged = true
      dangerType = 'clogging'
      issues.push({
        id: 'dryer-h2s-h2so4-wrong',
        level: 'danger',
        title: '高考高频雷区：严禁使用浓硫酸干燥强还原性气体 H₂S！',
        description: '浓 H₂SO₄ 具有强氧化性，会与 H₂S 发生氧化还原反应 H₂S + H₂SO₄(浓) = S↓ + SO₂↑ + 2H₂O，产生硫沉淀并消耗 H₂S！',
        examPoint: '强还原性气体 (H₂S、HI、HBr) 严禁使用强氧化性浓硫酸干燥，H₂S 应选用无水 CaCl₂ 或 P₂O₅ 干燥。',
      })
    }

    // C₂H₄ 不能用浓H₂SO₄干燥（浓H₂SO₄会与乙烯的碳碳双键加成/氧化，消耗乙烯）
    // 注意：此处刻意【不】设置 dangerType / dryerClogged。
    //   dangerType 枚举 (siphon | splashing | clogging | none) 描述的是"气路物理失效模式"，
    //   而浓硫酸对乙烯是"目标气体被化学破坏"（加成/碳化），机理属化学层面；若误标 clogging
    //   会连带把 flowRateOut 判成 0（气路其实并未堵塞，仍有气流通过，只是流出物已非乙烯，
    //   纯度由 gasPurity 单独反映）。该危险由 issue(level:'danger') + hasDangerAlert 承载。
    if ((targetGas === 'C₂H₄' || systemId === 'c2h4-prep') && dryer === 'conc-h2so4') {
      issues.push({
        id: 'dryer-c2h4-h2so4-wrong',
        level: 'danger',
        title: '高考经典错误：浓硫酸不能用于干燥乙烯 (C₂H₄)！',
        description: '浓 H₂SO₄ 具有强氧化性和吸水性，常温下易与乙烯碳碳双键发生加成生成硫酸氢乙酯，且脱水碳化破坏乙烯，引入 CO₂、SO₂ 杂质！乙烯气体制备纯化必须选用无水 CaCl₂ 或碱石灰干燥管。',
        examPoint: '乙烯 (C₂H₄) 含碳碳双键，浓 H₂SO₄ 具强氧化性与加成活性，严禁用于干燥乙烯；应选用固态干燥剂 (无水 CaCl₂ 或碱石灰)。',
      })
    }

    // 4. NO / NO₂ 与极易溶气体防倒吸诊断
    const isHighlySoluble = ['NH₃', 'HCl', 'SO₂'].includes(targetGas) || systemId === 'nh3-prep'
    if (isHighlySoluble && (tailGas === 'naoh-absorber' || tailGas === 'direct-pipe')) {
      dangerType = 'siphon'
      issues.push({
        id: 'siphon-danger',
        level: 'danger',
        title: '高危致命错误：极易溶气体直接插入液面下引发剧烈倒吸！',
        description: `${targetGas} 极易溶于水/碱液，导管直接插入液面下会导致瓶内压强骤降，吸收液沿导管快速倒吸入热发生装置中，引发试管/烧瓶炸裂！`,
        examPoint: '吸收极易溶气体 (NH₃/HCl/SO₂) 必须使用防倒吸装置：倒置漏斗 (刚好接触液面) 或安全瓶。',
      })
    }

    // NO 不溶于 NaOH，直接通入 NaOH 溶液无效（高考易错）
    if (targetGas === 'NO' && (tailGas === 'naoh-absorber' || tailGas === 'direct-pipe')) {
      issues.push({
        id: 'no-naoh-invalid',
        level: 'warning',
        title: '化学原理错误：NO 不与 NaOH 溶液反应，直接通入无法吸收尾气！',
        description: 'NO 为不活泼氮氧化物，不溶于水也不与 NaOH 反应。实验室处理 NO 尾气须先通入适量 O₂ 将 NO 氧化为 NO₂，再用浓 NaOH 溶液吸收 NO₂，或在通风橱中将尾气在排风口处直接稀释。',
        examPoint: 'NO 与 NaOH 不反应 (牢记！)；只有 NO + NO₂ 等物质量混合气才可被 NaOH 吸收：NO + NO₂ + 2NaOH = 2NaNO₂ + H₂O。',
      })
    }

    // 倒置漏斗深深浸没失灵诊断
    if (tailGas === 'inverted-funnel' && params.funnelDepth === 'deep') {
      dangerType = 'siphon'
      issues.push({
        id: 'funnel-deep-siphon-danger',
        level: 'danger',
        title: '高考核心考点警示：防倒吸漏斗深深浸没水槽底部，防倒吸失效！',
        description: '倒置漏斗防倒吸的物理机制依赖于“液面与漏斗口脱离”。若漏斗深深浸没在烧杯底部，发生倒吸时烧杯液面下降但漏斗口无法脱离液面，液体在脱离液面之前就会直接吸入导管炸裂发生器！',
        examPoint: '倒置漏斗吸收极易溶气体防倒吸时，漏斗大口边缘必须刚好接触液面 (相切 1~4mm)，严禁深深浸没！',
      })
    }

    // 5. 收集方式合规性诊断
    if (targetGas === 'NO') {
      if (collection !== 'water-displacement') {
        issues.push({
          id: 'no-air-collect-wrong',
          level: 'danger',
          title: '高考必考爆点：NO 绝不能用排空气法收集！',
          description: '一氧化氮 (NO) 极易与空气中的 O₂ 反应生成红棕色的 NO₂ (2NO + O₂ = 2NO₂)，集气瓶中会变红棕色，必须且只能用排水集气法！',
          examPoint: 'NO 密度与空气接近且极易被 O₂ 氧化为 NO₂，只能用排水法收集。',
        })
      }
    }

    if (targetGas === 'NO₂') {
      if (collection === 'water-displacement') {
        issues.push({
          id: 'no2-water-collect-wrong',
          level: 'danger',
          title: '高考必考爆点：NO₂ 绝不能用排水集气法收集！',
          description: 'NO₂ 与水剧烈反应 3NO₂ + H₂O = 2HNO₃ + NO，在水槽中会被完全反应破坏，冒出无色 NO 气体，无法收集到 NO₂！',
          examPoint: 'NO₂ 易溶于水并与水反应，只能用向上排空气法收集。',
        })
      }
    }

    if ((targetGas === 'NH₃' || targetGas === 'H₂') && collection === 'upward-air') {
      issues.push({
        id: 'collect-nh3-upward-wrong',
        level: 'danger',
        title: `严重收集错误：${targetGas} 密度小于空气，严禁用向上排空气法！`,
        description: `${targetGas} 密度明显小于空气 (平均 M=29)，向上排空气法气体会迅速上浮逸散，无法集满瓶！`,
        examPoint: '轻气体 (NH₃, H₂) 必须使用向下排空气法 (短进长出)，或根据溶解度选用排水法 (H₂)。',
      })
    }

    if (['CO', 'C₂H₄'].includes(targetGas) && (collection === 'upward-air' || collection === 'downward-air')) {
      issues.push({
        id: 'collect-air-density-close-wrong',
        level: 'warning',
        title: `收集方式不当：${targetGas} 摩尔质量 (28) 与空气 (29) 接近，不能用排空气法！`,
        description: `${targetGas} 密度与空气过于接近（且混合易引发爆炸），无法通过空气排代有效收集纯净气体，必须使用排水集气法！`,
        examPoint: 'NO(30)、CO(28)、C₂H₄(28)、N₂(28) 密度均与空气相近，一律采用排水集气法收集。',
      })
    }

    // 向下排空气法“长进短出”误接判断
    if (collection === 'downward-air' && params.collectTubeMode === 'wrong-long-in') {
      issues.push({
        id: 'collect-nh3-longin-wrong',
        level: 'danger',
        title: '高考实验细节陷阱：向下排空气法接法错误（长进短出误用）！',
        description: '氨气密度小于空气，采用向下排空气法时，正放集气瓶若误接为“长进短出”（进气管伸入瓶底），这实际上是向上排空气法，会导致氨气从长管深入瓶底后直接上升从顶部短管溢出而无法集满！',
        examPoint: '向下排空气法正放集气瓶必须“短进长出”（轻气体从短管进积累在瓶顶部，空气由瓶底长管排出）。',
      })
    }

    if (collection === 'water-displacement') {
      if (targetGas === 'Cl₂' || systemId === 'cl2-prep') {
        issues.push({
          id: 'collect-cl2-water-warning',
          level: 'warning',
          title: '高考高频考点警示：氯气不能用排纯水法收集，须用排饱和食盐水法！',
          description: '常温下 1 体积水约溶解 2 体积 Cl₂，且发生 Cl₂ + H₂O ⇌ HCl + HClO 反应。排纯水会造成氯气显著损耗并污染水体；若要使用排液法收集，必须改用【排饱和食盐水法】（同离子效应抑制 Cl₂ 溶解）！',
          examPoint: 'Cl₂ 可溶于水并与水反应，不能排纯水；实验室常用【向上排空气法】或【排饱和食盐水法】收集。',
        })
      } else if (['NH₃', 'SO₂', 'HCl'].includes(targetGas) || systemId === 'nh3-prep') {
        issues.push({
          id: 'collect-water-wrong',
          level: 'warning',
          title: '收集方式错误：易溶于水的气体不能用排水集气法！',
          description: `${targetGas} 极易/易溶于水 (NH₃ 1:700，HCl 1:500，SO₂ 1:40)，在水槽中迅速溶解并引发倒吸，排水法无法收集到气体！`,
          examPoint: '只有难溶/微溶于水且不与水反应的气体 (O₂, H₂, NO, CO, CH₄, C₂H₄, C₂H₂) 才能用排水法收集。',
        })
      }
    } else if (collection === 'downward-air') {
      if (['Cl₂', 'SO₂', 'NO₂', 'CO₂', 'HCl', 'H₂S'].includes(targetGas) || systemId === 'cl2-prep' || systemId === 'so2-chain') {
        issues.push({
          id: 'collect-air-density-wrong',
          level: 'warning',
          title: '收集方式错误：密度比空气大的气体不能用向下排空气法！',
          description: `${targetGas} 的相对分子质量明显大于空气 (29)，密度比空气大，向下排空气法气体直接沉到底部下溢泄漏！`,
          examPoint: '密度大于空气用向上排空气法 (长进短出)；密度小于空气用向下排空气法 (短进长出)。',
        })
      }
    }

    // 6. 计算纯度、流速与吸收率
    let gasPurity = 0
    let impurityConc = 100
    let tailAbsorbRate = 0
    let currentFlow = flowRate

    if (dryerClogged || washReverse) {
      currentFlow = 0
    }

    const isToxicGas = ['Cl₂', 'SO₂', 'NO₂', 'NO', 'CO', 'NH₃', 'HCl', 'H₂S'].includes(targetGas)
    if (isToxicGas && tailGas === 'none' && collection !== 'water-displacement') {
      issues.push({
        id: 'toxic-tailgas-missing',
        level: 'danger',
        title: `环保与安全严重错误：有毒/污染性气体 ${targetGas} 未配置尾气处理！`,
        description: `${targetGas} 具有毒性或强烈刺激性，非密闭排空气法收集末端严禁直接敞口排空！`,
        examPoint: '高考实验必查：凡涉及 Cl₂、SO₂、NOₓ、CO、NH₃、HCl、H₂S 等有毒/污染气体，装置末端必须配备吸收/燃烧/收集尾气处理装置。',
      })
    }

    if (isToxicGas && tailGas === 'none' && collection === 'water-displacement') {
      issues.push({
        id: 'tail-gas-water-vent-info',
        level: 'info',
        title: `实验提示：排水集气收集有毒气体 ${targetGas}，建议末段增设${targetGas === 'NO' ? '气球收集' : '尾气处理'}`,
        description: `水封可阻隔气体大量逸散，但在取瓶或换瓶间隙仍有微量有毒 ${targetGas} 挥发，规范装置宜配合${targetGas === 'NO' ? '气球或氧化吸收装置' : '点燃/尾气吸收装置'}并在通风橱中进行。`,
        examPoint: 'NO 等微溶/难溶有毒气体采用排水集气法收集时，仍应注意排气操作安全，必要时加气球收集余气。',
      })
    }

    const allowsWaterDisplacement = ['NO', 'C₂H₂', 'CO', 'O₂', 'H₂', 'C₂H₄'].includes(targetGas)
    const drySatisfied = dryer !== 'none' || (collection === 'water-displacement' && allowsWaterDisplacement)
    const washSatisfied =
      washReagent !== 'none' ||
      (!issues.some((i) => i.id.startsWith('wash-')) &&
        ['O₂', 'H₂', 'NH₃', 'NO₂', 'HCl', 'H₂S'].includes(targetGas))

    if (systemId === 'cl2-prep') {
      if (washReagent === 'sat-nacl') {
        impurityConc -= 60
      }
      if (dryer === 'conc-h2so4') {
        impurityConc -= 40
      }
    } else if (systemId === 'nh3-prep') {
      if (dryer === 'soda-lime') {
        impurityConc = 0
      }
    } else if (systemId === 'so2-chain') {
      if (dryer === 'conc-h2so4') {
        impurityConc = 0
      }
    } else if (targetGas === 'C₂H₄' || systemId === 'c2h4-prep') {
      if (washReagent === 'naoh') {
        impurityConc = (collection === 'water-displacement' || dryer === 'cacl2' || dryer === 'p2o5') ? 0 : 20
      } else if (washReagent === 'kmno4') {
        impurityConc = 90 // 引入新杂质 CO₂，纯度反降
      } else {
        impurityConc = 60
      }
    } else {
      impurityConc = Math.max(0, 100 - (washSatisfied ? 50 : 0) - (drySatisfied ? 50 : 0))
    }

    gasPurity = Math.max(0, 100 - impurityConc)

    const hasNoNaohInvalid = issues.some((i) => i.id === 'no-naoh-invalid')
    if (hasNoNaohInvalid) {
      tailAbsorbRate = 0
    } else if (tailGas === 'inverted-funnel' || tailGas === 'safety-bottle' || tailGas === 'naoh-absorber') {
      tailAbsorbRate = 98
    } else if (tailGas === 'combustion' || tailGas === 'balloon') {
      tailAbsorbRate = 100
    } else if (tailGas === 'direct-pipe') {
      tailAbsorbRate = 75
    } else if (tailGas === 'none' && collection === 'water-displacement') {
      tailAbsorbRate = isToxicGas ? 85 : 100 // 排水液封可减少外逸；非有毒气体无须尾气吸收，有毒气体建议加气球/灼烧处理
    }

    if (issues.length === 0) {
      issues.push({
        id: 'perfect-chain',
        level: 'success',
        title: '装置链组装完美符合高考标准！',
        description: '气体制备 ➔ 净化除杂 ➔ 干燥脱水 ➔ 规范收集 ➔ 防倒吸尾气处理 全链路化学逻辑无瑕疵。',
        examPoint: '满分标准：装置顺序严密、洗气长进短出、干燥剂化学匹配、极易溶气体防倒吸。',
      })
    }

    const hasDangerAlert = issues.some(i => i.level === 'danger')

    return {
      gasPurity,
      impurityConc,
      tailAbsorbRate,
      flowRateOut: currentFlow,
      issues,
      hasDangerAlert,
      dangerType,
      reactionEquation,
      purificationEquation,
      tailGasEquation,
    }
  }, [params])
}
