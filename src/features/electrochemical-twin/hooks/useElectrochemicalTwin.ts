/**
 * src/features/electrochemical-twin/hooks/useElectrochemicalTwin.ts
 * 纯化学逻辑 Hook：根据输入的电化学参数，计算电极反应、离子迁移方向及法拉第定量数据
 */

import { useMemo } from 'react'
import type { ElectrochemicalParams, CellDetails, QuantResult } from '../types'

/** 法拉第常数 F = 96485 C/mol */
const FARADAY_CONST = 96485

export function useElectrochemicalTwin(params: ElectrochemicalParams) {
  const { mode, batteryState, membraneType, currentAmp, timeSec, electrolyteConc } = params

  /**
   * 法拉第定量计算（依模式分支精准计算）
   * n(e-) = (I * t) / F
   */
  const quantResult = useMemo<QuantResult>(() => {
    // 总电荷 Q = I * t (C)
    const chargeC = currentAmp * timeSec
    // 电子转移量 n(e-) = Q / F (mol)
    const molesElectron = chargeC / FARADAY_CONST

    let molesProductLeft = 0
    let molesProductRight = 0
    let massChangeLeft = 0
    let massChangeRight = 0
    let gasVolumeLeft = 0
    let gasVolumeRight = 0
    let molesMembraneIon = 0
    let netAcidMoles = 0

    if (mode === 0) {
      // 模式 0：Cu-Zn 原电池 (负极 Zn 溶解，正极 Cu 析出)
      molesProductLeft = molesElectron / 2
      molesProductRight = molesElectron / 2
      massChangeLeft = -(molesProductLeft * 65.38)
      massChangeRight = molesProductRight * 63.55
      gasVolumeLeft = 0
      gasVolumeRight = 0
      molesMembraneIon = molesElectron // 盐桥平衡电荷对应离子
    } else if (mode === 1) {
      // 模式 1：全钒液流电池 (均在溶液中转化，无电极固相增减与产气)
      molesProductLeft = molesElectron
      molesProductRight = molesElectron
      massChangeLeft = 0
      massChangeRight = 0
      gasVolumeLeft = 0
      gasVolumeRight = 0
      molesMembraneIon = molesElectron // 穿膜 H⁺ 摩尔数与转移电子数严格 1:1
    } else if (mode === 2) {
      if (membraneType === 3) {
        // 模式 2 + 双极膜 BPM：三室双极膜电渗析制酸碱 (阳极 NaOH 室放 O₂，阴极 NaCl 室放 H₂ 并得 NaOH，中间酸室得 HCl)
        molesProductLeft = molesElectron / 4 // 阳极 O₂
        molesProductRight = molesElectron / 2 // 阴极 H₂
        massChangeLeft = 0
        massChangeRight = 0
        gasVolumeLeft = (molesElectron / 4) * 22.4 // 阳极 O₂ 标况体积
        gasVolumeRight = (molesElectron / 2) * 22.4 // 阴极 H₂ 标况体积
        molesMembraneIon = molesElectron // BPM 解离生成 H⁺ 与 OH⁻ 各 molesElectron mol
      } else {
        // 模式 2（非 BPM）：饱和食盐水电解（氯碱工业：阳极 Cl₂，阴极 H₂，生成 NaOH）
        molesProductLeft = molesElectron / 2 // Cl₂
        molesProductRight = molesElectron / 2 // H₂
        massChangeLeft = 0
        massChangeRight = 0
        gasVolumeLeft = (molesElectron / 2) * 22.4 // 阳极 Cl₂ 标况体积
        gasVolumeRight = (molesElectron / 2) * 22.4 // 阴极 H₂ 标况体积
        molesMembraneIon = molesElectron // 穿膜 Na⁺ 或 Cl⁻
      }
    } else {
      // 模式 3：电解硫酸铜溶液（按 1 L 溶液计：Cu²⁺ 上限为 electrolyteConc mol）
      const maxCuElectrons = Math.max(0, electrolyteConc * 2)
      const cuElectrons = Math.min(molesElectron, maxCuElectrons)
      const h2Electrons = Math.max(0, molesElectron - cuElectrons)
      molesProductLeft = molesElectron / 4 // 阳极全程析出 O₂
      molesProductRight = cuElectrons / 2 // 阴极析出 Cu（Cu²⁺ 耗尽后转为放 H₂）
      massChangeLeft = 0
      massChangeRight = molesProductRight * 63.55 // 阴极析出 Cu 质量
      gasVolumeLeft = (molesElectron / 4) * 22.4 // 阳极析出 O₂ 标况体积
      gasVolumeRight = (h2Electrons / 2) * 22.4 // 若 Cu²⁺ 耗尽则阴极继而产生 H₂
      molesMembraneIon = molesElectron
      // 只有析出 Cu 阶段对应净产酸：Cu²⁺ 耗尽后阴极 2H₂O + 2e⁻ = H₂↑ + 2OH⁻ 与阳极产 H⁺ 等量中和
      netAcidMoles = cuElectrons
    }

    // 溶液 pH 变化（按 1 L 溶液估算）：仅模式 3 在电解 CuSO₄ 阶段产生净 H⁺ 增量（等于 cuElectrons）。
    // 起始按近中性 pH ≈ 7 计，c(H⁺) ≈ netAcidMoles，则 pH 降幅 ΔpH = 7 - (-lg c(H⁺)) = 7 + lg netAcidMoles。
    const deltaPH =
      mode === 3 && netAcidMoles > 0
        ? +Math.min(7, Math.max(0, 7 + Math.log10(Math.max(netAcidMoles, 1e-14)))).toFixed(2)
        : 0

    return {
      molesElectron: +molesElectron.toFixed(5),
      molesProductLeft: +molesProductLeft.toFixed(5),
      molesProductRight: +molesProductRight.toFixed(5),
      massChangeLeft: +massChangeLeft.toFixed(3),
      massChangeRight: +massChangeRight.toFixed(3),
      gasVolumeLeft: +gasVolumeLeft.toFixed(3),
      gasVolumeRight: +gasVolumeRight.toFixed(3),
      molesMembraneIon: +molesMembraneIon.toFixed(5),
      netAcidMoles: +netAcidMoles.toFixed(5),
      deltaPH,
    }
  }, [currentAmp, timeSec, mode, membraneType, electrolyteConc])

  /**
   * 反应与电极元数据构建
   */
  const cellDetails = useMemo<CellDetails>(() => {
    if (mode === 0) {
      // 模式 0：经典原电池 vs 电解池对比
      return {
        title: '经典双池基准：原电池 (Cu-Zn) vs 电解池 (C-Cu)',
        subtitle: '左池自发化学能转化为电能，右池外接电源电能转化为化学能',
        cellType: 'galvanic',
        leftElectrode: {
          name: '原电池负极 (Zn) - 氧化反应',
          poleType: 'negative',
          reactionFormula: '\\text{Zn} - 2e^- \\rightarrow \\text{Zn}^{2+}',
          electronChange: '失去 2e⁻',
          phenomenon: '锌片逐渐溶解变薄，溶液中 Zn²⁺ 浓度升高',
        },
        rightElectrode: {
          name: '原电池正极 (Cu) - 还原反应',
          poleType: 'positive',
          reactionFormula: '\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}',
          electronChange: '得到 2e⁻',
          phenomenon: '铜片表面析出红色固体，溶液蓝色逐渐变浅',
        },
        overallReaction: '\\text{Zn} + \\text{Cu}^{2+} = \\text{Zn}^{2+} + \\text{Cu}',
        energyConversion: '化学能 \\rightarrow 电能 (\\Delta G < 0)',
        electrolyteInfo: '左烧杯 ZnSO₄ 溶液（负极），右烧杯 CuSO₄ 溶液（正极），两烧杯由盐桥连通',
        membraneFunction: '盐桥中的 K⁺ 移向正极(Cu)，Cl⁻ 移向负极(Zn)，维持电荷平衡',
        secondaryTitle: '外接电解池 (石墨C阳极 - 铜Cu阴极 电解CuSO₄)',
        secondaryLeftElectrode: {
          name: '电解池阳极 (C) - 氧化反应',
          poleType: 'anode',
          reactionFormula: '2\\text{H}_2\\text{O} - 4e^- \\rightarrow \\text{O}_2\\uparrow + 4\\text{H}^+',
          electronChange: '失去 4e⁻',
          phenomenon: '阳极碳棒表面产生无色气泡 (O₂ 气体)',
        },
        secondaryRightElectrode: {
          name: '电解池阴极 (Cu) - 还原反应',
          poleType: 'cathode',
          reactionFormula: '\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}',
          electronChange: '得到 2e⁻',
          phenomenon: '阴极铜棒表面析出红亮金属铜，厚度增加',
        },
        secondaryOverallReaction: '2\\text{CuSO}_4 + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{Cu} + 2\\text{H}_2\\text{SO}_4 + \\text{O}_2\\uparrow',
        secondaryEnergyConversion: '电能 \\rightarrow 化学能 (强迫非自发反应)',
      }
    }

    if (mode === 1) {
      // 模式 1：新型全钒液流电池 / 蓄电池（支持同屏充放电双态对比）
      const isDischarge = batteryState === 0
      const dischargeLeft = {
        name: '放电负极 (氧化反应)',
        poleType: 'negative' as const,
        reactionFormula: '\\text{V}^{2+} - e^- \\rightarrow \\text{V}^{3+}',
        electronChange: '失去 1e⁻',
        phenomenon: '溶液由紫色变为绿色 (V²⁺ \\rightarrow V³⁺)',
      }
      const dischargeRight = {
        name: '放电正极 (还原反应)',
        poleType: 'positive' as const,
        reactionFormula: '\\text{VO}_2^+ + 2\\text{H}^+ + e^- \\rightarrow \\text{VO}^{2+} + \\text{H}_2\\text{O}',
        electronChange: '得到 1e⁻',
        phenomenon: '溶液由黄色变为蓝色 (VO₂⁺ \\rightarrow VO²⁺)',
      }
      const chargeLeft = {
        name: '充电阴极 (接电源负极·还原反应)',
        poleType: 'cathode' as const,
        reactionFormula: '\\text{V}^{3+} + e^- \\rightarrow \\text{V}^{2+}',
        electronChange: '得到 1e⁻',
        phenomenon: '溶液由绿色恢复为紫色 (V³⁺ \\rightarrow V²⁺)',
      }
      const chargeRight = {
        name: '充电阳极 (接电源正极·氧化反应)',
        poleType: 'anode' as const,
        reactionFormula: '\\text{VO}^{2+} + \\text{H}_2\\text{O} - e^- \\rightarrow \\text{VO}_2^+ + 2\\text{H}^+',
        electronChange: '失去 1e⁻',
        phenomenon: '溶液由蓝色恢复为黄色 (VO²⁺ \\rightarrow VO₂⁺)',
      }

      return {
        title: isDischarge
          ? '全钒液流电池 - 放电模式 (原电池·化学能→电能)'
          : '全钒液流电池 - 充电模式 (电解池·电能→化学能)',
        subtitle: isDischarge
          ? '放电自发进行：V²⁺ 氧化为 V³⁺，VO₂⁺ 还原为 VO²⁺'
          : '充电强迫逆转：V³⁺ 还原为 V²⁺，VO²⁺ 氧化为 VO₂⁺',
        cellType: isDischarge ? 'galvanic' : 'electrolytic',
        leftElectrode: isDischarge ? dischargeLeft : chargeLeft,
        rightElectrode: isDischarge ? dischargeRight : chargeRight,
        overallReaction: isDischarge
          ? '\\text{V}^{2+} + \\text{VO}_2^+ + 2\\text{H}^+ = \\text{V}^{3+} + \\text{VO}^{2+} + \\text{H}_2\\text{O}'
          : '\\text{V}^{3+} + \\text{VO}^{2+} + \\text{H}_2\\text{O} \\xrightarrow{\\text{充电}} \\text{V}^{2+} + \\text{VO}_2^+ + 2\\text{H}^+',
        energyConversion: isDischarge ? '化学能 \\rightarrow 电能' : '电能 \\rightarrow 化学能',
        electrolyteInfo: '酸性钒盐溶液 (0.5 mol/L H₂SO₄ 介质)',
        membraneFunction: isDischarge
          ? '质子交换膜：H⁺ 向正极区移动（放电“阳往正”）'
          : '质子交换膜：H⁺ 向阴极区移动（充电“阳往阴”）',
        secondaryTitle: isDischarge
          ? '全钒液流电池 - 充电态 (电解池·接直流电源)'
          : '全钒液流电池 - 放电态 (原电池·接电流表/负载)',
        secondaryLeftElectrode: isDischarge ? chargeLeft : dischargeLeft,
        secondaryRightElectrode: isDischarge ? chargeRight : dischargeRight,
        secondaryOverallReaction: isDischarge
          ? '\\text{V}^{3+} + \\text{VO}^{2+} + \\text{H}_2\\text{O} \\xrightarrow{\\text{充电}} \\text{V}^{2+} + \\text{VO}_2^+ + 2\\text{H}^+'
          : '\\text{V}^{2+} + \\text{VO}_2^+ + 2\\text{H}^+ = \\text{V}^{3+} + \\text{VO}^{2+} + \\text{H}_2\\text{O}',
        secondaryEnergyConversion: isDischarge ? '电能 \\rightarrow 化学能' : '化学能 \\rightarrow 电能',
      }
    }

    if (mode === 2) {
      if (membraneType === 3) {
        return {
          title: '双极膜 (BPM) 四室电渗析制高纯酸碱模型',
          subtitle: '当前隔膜：双极膜 BPM（催化 H₂O → H⁺ + OH⁻，BPM|酸室|AEM|原料室|CEM|碱室 独立分盐防反迁）',
          cellType: 'electrolytic',
          leftElectrode: {
            name: '阳极 (NaOH 室·接正极) - 氧化反应',
            poleType: 'anode',
            reactionFormula: '4\\text{OH}^- - 4e^- \\rightarrow \\text{O}_2\\uparrow + 2\\text{H}_2\\text{O}',
            electronChange: '失去 4e⁻',
            phenomenon: '阳极析出 O₂；BPM 左侧向阳极室补充 OH⁻，不与 Cl⁻ 接触故无 Cl₂ 生成',
          },
          rightElectrode: {
            name: '阴极 (NaOH 碱室·接负极) - 还原反应',
            poleType: 'cathode',
            reactionFormula: '2\\text{H}_2\\text{O} + 2e^- \\rightarrow \\text{H}_2\\uparrow + 2\\text{OH}^-',
            electronChange: '得到 2e⁻',
            phenomenon: '阴极析出 H₂ 并接收穿阳膜 (CEM) 迁入的 Na⁺ 得高纯 NaOH；原料室 Cl⁻ 穿阴膜 (AEM) 入酸室得高纯 HCl',
          },
          overallReaction: '4\\text{NaCl} + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{BPM+AEM+CEM}} 4\\text{HCl} + 4\\text{NaOH} + 2\\text{H}_2\\uparrow + \\text{O}_2\\uparrow',
          energyConversion: '电能 \\rightarrow 化学能',
          electrolyteInfo: '四室串联：阳极室(O₂) | BPM | 酸室(HCl) | AEM | 原料室(NaCl) | CEM | 阴极碱室(NaOH)',
          membraneFunction: '双极膜 BPM 解离水供 H⁺/OH⁻；原料室两侧由 AEM 挡 Na⁺ 引 Cl⁻ 入酸室、CEM 挡 OH⁻ 反迁并引 Na⁺ 入阴极室，避免 NaCl 混杂与酸碱中和',
        }
      }

      // 模式 2（非 BPM）：氯碱工业两室电解池
      let membraneDesc = '无膜/普通隔膜'
      if (membraneType === 1) membraneDesc = '阳离子交换膜（只透阳离子 $Na^+$ / $H^+$）'
      if (membraneType === 2) membraneDesc = '阴离子交换膜（只透阴离子 $Cl^-$ / $SO_4^{2-}$）'

      let membranePlain = '无膜/普通隔膜'
      if (membraneType === 1) membranePlain = '阳离子交换膜（只允许 Na⁺、H⁺ 等阳离子通过）'
      if (membraneType === 2) membranePlain = '阴离子交换膜（允许 Cl⁻、OH⁻ 迁向阳极；氯碱工业单用会引起 Cl₂ 与 OH⁻ 副反应）'

      return {
        title: '离子交换膜与多室电解池探究',
        subtitle: `当前隔膜：${membraneDesc}`,
        cellType: 'electrolytic',
        leftElectrode: {
          name: '阳极 (接电源正极) - 氧化反应',
          poleType: 'anode',
          reactionFormula: '2\\text{Cl}^- - 2e^- \\rightarrow \\text{Cl}_2\\uparrow',
          electronChange: '失去 2e⁻',
          phenomenon: '阳极产生黄绿色气体，刺激性气味 (工业氯碱)',
        },
        rightElectrode: {
          name: '阴极 (接电源负极) - 还原反应',
          poleType: 'cathode',
          reactionFormula: '2\\text{H}_2\\text{O} + 2e^- \\rightarrow \\text{H}_2\\uparrow + 2\\text{OH}^-',
          electronChange: '得到 2e⁻',
          phenomenon: '阴极产生无色气体，pH 显著升高生成烧碱 NaOH',
        },
        overallReaction: '2\\text{NaCl} + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{NaOH} + \\text{H}_2\\uparrow + \\text{Cl}_2\\uparrow',
        energyConversion: '电能 \\rightarrow 化学能',
        electrolyteInfo: '饱和食盐水 (NaCl 溶液)',
        membraneFunction: `隔膜阻隔 Cl₂ 与 NaOH 反应，${membranePlain}`,
      }
    }

    // 模式 3：法拉第定量计算（对应右池布局：左阳极氧化析出 O2，右阴极还原沉积 Cu）
    return {
      title: '法拉第电解定律与定量守恒模型',
      subtitle: `当前调控：I = ${currentAmp} A, t = ${timeSec} s`,
      cellType: 'electrolytic',
      leftElectrode: {
        name: '阳极 (接电源正极) - 氧化反应',
        poleType: 'anode',
        reactionFormula: '2\\text{H}_2\\text{O} - 4e^- \\rightarrow \\text{O}_2\\uparrow + 4\\text{H}^+',
        electronChange: `转移 ${quantResult.molesElectron} mol 电子`,
        phenomenon: `析出 O₂ 体积 (标况)：${quantResult.gasVolumeLeft} L`,
      },
      rightElectrode: {
        name: '阴极 (接电源负极) - 还原反应',
        poleType: 'cathode',
        reactionFormula: '\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}',
        electronChange: `转移 ${quantResult.molesElectron} mol 电子`,
        phenomenon: `析出 Cu 质量：${quantResult.massChangeRight} g`,
      },
      overallReaction: '2\\text{CuSO}_4 + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{Cu} + 2\\text{H}_2\\text{SO}_4 + \\text{O}_2\\uparrow',
      energyConversion: '电能 \\rightarrow 化学能',
      electrolyteInfo: `硫酸铜溶液 (c₀ = ${electrolyteConc} mol/L)`,
      membraneFunction: '法拉第守恒：n(e⁻) = 2n(Cu) = 4n(O₂) = I·t/F',
    }
  }, [mode, batteryState, membraneType, currentAmp, timeSec, electrolyteConc, quantResult])

  return {
    cellDetails,
    quantResult,
  }
}
