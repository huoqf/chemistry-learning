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
   * 法拉第定量计算
   * n(e-) = (I * t) / F
   */
  const quantResult = useMemo<QuantResult>(() => {
    // 总电荷 Q = I * t (C)
    const chargeC = currentAmp * timeSec
    // 电子转移量 n(e-) = Q / F (mol)
    const molesElectron = chargeC / FARADAY_CONST

    // 以 Cu-Zn / Cu-C 反应为例：
    // Zn -> Zn2+ + 2e- (M_Zn = 65.38 g/mol)
    // Cu2+ + 2e- -> Cu (M_Cu = 63.55 g/mol)
    // 2H+ + 2e- -> H2 (V_m = 22.4 L/mol)
    const molesProductLeft = molesElectron / 2 // Zn 溶解或 H2 生成 (mol)
    const molesProductRight = molesElectron / 2 // Cu 沉积或 O2/Cl2 生成 (mol)

    const massChangeLeft = -(molesProductLeft * 65.38) // 负极溶解或质量增加
    const massChangeRight = molesProductRight * 63.55 // 正极/阴极 Cu 沉积

    // 假设右极析出气体：2Cl- - 2e- -> Cl2 或 4OH- - 4e- -> 2H2O + O2
    const gasVolumeRight = (molesElectron / 4) * 22.4 // 假设析出 O2，V = (n(e-)/4) * 22.4 L

    // 溶液 pH 动态偏移估算 (按 1L 溶液)
    const deltaPH = +(molesElectron * 0.5).toFixed(2)

    return {
      molesElectron: +molesElectron.toFixed(5),
      molesProductLeft: +molesProductLeft.toFixed(5),
      molesProductRight: +molesProductRight.toFixed(5),
      massChangeLeft: +massChangeLeft.toFixed(3),
      massChangeRight: +massChangeRight.toFixed(3),
      gasVolumeRight: +gasVolumeRight.toFixed(3),
      deltaPH,
    }
  }, [currentAmp, timeSec])

  /**
   * 反应与电极元数据构建
   */
  const cellDetails = useMemo<CellDetails>(() => {
    if (mode === 0) {
      // 模式 0：经典原电池 vs 电解池对比
      return {
        title: '经典双池基准：原电池 (Cu-Zn) vs 电解池 (C-Cu)',
        subtitle: '左屏自发化学能转化为电能，右屏外接电源电能转化为化学能',
        cellType: 'galvanic',
        leftElectrode: {
          name: '负极 (Zn) - 氧化反应',
          poleType: 'negative',
          reactionFormula: '\\text{Zn} - 2e^- \\rightarrow \\text{Zn}^{2+}',
          electronChange: '失去 2e⁻',
          phenomenon: '锌片逐渐溶解变薄，溶液中 Zn²⁺ 浓度升高',
        },
        rightElectrode: {
          name: '正极 (Cu) - 还原反应',
          poleType: 'positive',
          reactionFormula: '\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}',
          electronChange: '得到 2e⁻',
          phenomenon: '铜片表面析出红红色固体，溶液蓝色逐渐变浅',
        },
        overallReaction: '\\text{Zn} + \\text{Cu}^{2+} = \\text{Zn}^{2+} + \\text{Cu}',
        energyConversion: '化学能 \\rightarrow 电能 (\\Delta G < 0)',
        electrolyteInfo: '左烧杯 CuSO₄ 溶液，右烧杯 ZnSO₄ 溶液（配双液盐桥）',
        membraneFunction: '盐桥中的 K⁺ 移向正极(Cu)，Cl⁻ 移向负极(Zn)，维持电荷平衡',
      }
    }

    if (mode === 1) {
      // 模式 1：新型全钒液流电池 / 蓄电池
      const isDischarge = batteryState === 0
      if (isDischarge) {
        return {
          title: '全钒液流电池 - 放电模式 (原电池)',
          subtitle: '自发进行：$V^{2+}$ 氧化为 $V^{3+}$，放电输出电能',
          cellType: 'galvanic',
          leftElectrode: {
            name: '负极 - 氧化反应',
            poleType: 'negative',
            reactionFormula: '\\text{V}^{2+} - e^- \\rightarrow \\text{V}^{3+}',
            electronChange: '失去 1e⁻',
            phenomenon: '溶液由紫色变为绿色 ($V^{2+} \\rightarrow V^{3+}$)',
          },
          rightElectrode: {
            name: '正极 - 还原反应',
            poleType: 'positive',
            reactionFormula: '\\text{VO}_2^+ + 2\\text{H}^+ + e^- \\rightarrow \\text{VO}^{2+} + \\text{H}_2\\text{O}',
            electronChange: '得到 1e⁻',
            phenomenon: '溶液由黄色变为蓝色 (\\text{VO}_2^+ \\rightarrow \\text{VO}^{2+})',
          },
          overallReaction: '\\text{V}^{2+} + \\text{VO}_2^+ + 2\\text{H}^+ = \\text{V}^{3+} + \\text{VO}^{2+} + \\text{H}_2\\text{O}',
          energyConversion: '化学能 \\rightarrow 电能',
          electrolyteInfo: '酸性钒盐溶液 ($H_2SO_4$ 介质)',
          membraneFunction: '阳离子/质子交换膜：$H^+$ 从负极区向正极区迁移',
        }
      } else {
        return {
          title: '全钒液流电池 - 充电模式 (电解池)',
          subtitle: '外电源驱动：强迫进行逆反应，恢复高价与低价钒活性物质',
          cellType: 'electrolytic',
          leftElectrode: {
            name: '阴极 (接电源负极) - 还原反应',
            poleType: 'cathode',
            reactionFormula: '\\text{V}^{3+} + e^- \\rightarrow \\text{V}^{2+}',
            electronChange: '得到 1e⁻',
            phenomenon: '溶液由绿色恢复为紫色 ($V^{3+} \\rightarrow V^{2+}$)',
          },
          rightElectrode: {
            name: '阳极 (接电源正极) - 氧化反应',
            poleType: 'anode',
            reactionFormula: '\\text{VO}^{2+} + \\text{H}_2\\text{O} - e^- \\rightarrow \\text{VO}_2^+ + 2\\text{H}^+',
            electronChange: '失去 1e⁻',
            phenomenon: '溶液由蓝色恢复为黄色 (\\text{VO}^{2+} \\rightarrow \\text{VO}_2^+)',
          },
          overallReaction: '\\text{V}^{3+} + \\text{VO}^{2+} + \\text{H}_2\\text{O} = \\text{V}^{2+} + \\text{VO}_2^+ + 2\\text{H}^+',
          energyConversion: '电能 \\rightarrow 化学能',
          electrolyteInfo: '酸性钒盐溶液 ($H_2SO_4$ 介质)',
          membraneFunction: '阳离子/质子交换膜：$H^+$ 从阳极区向阴极区迁移',
        }
      }
    }

    if (mode === 2) {
      // 模式 2：双极膜与膜法电解
      let membraneDesc = '无膜/普通隔膜'
      if (membraneType === 1) membraneDesc = '阳离子交换膜（只透阳离子 $Na^+$ / $H^+$）'
      if (membraneType === 2) membraneDesc = '阴离子交换膜（只透阴离子 $Cl^-$ / $SO_4^{2-}$）'
      if (membraneType === 3) membraneDesc = '双极膜 BPM（催化 $H_2O \\rightarrow H^+ + OH^-$）'

      return {
        title: '离子交换膜与多室电解池探究',
        subtitle: `当前隔膜：${membraneDesc}`,
        cellType: 'electrolytic',
        leftElectrode: {
          name: '阴极 (得电子)',
          poleType: 'cathode',
          reactionFormula: '2\\text{H}_2\\text{O} + 2e^- \\rightarrow \\text{H}_2\\uparrow + 2\\text{OH}^-',
          electronChange: '得到 2e⁻',
          phenomenon: '阴极产生无色气体，pH 显著升高生成烧碱 $NaOH$',
        },
        rightElectrode: {
          name: '阳极 (失电子)',
          poleType: 'anode',
          reactionFormula: '2\\text{Cl}^- - 2e^- \\rightarrow \\text{Cl}_2\\uparrow',
          electronChange: '失去 2e⁻',
          phenomenon: '阳极产生黄绿色气体，刺激性气味 (工业氯碱)',
        },
        overallReaction: '2\\text{NaCl} + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{NaOH} + \\text{H}_2\\uparrow + \\text{Cl}_2\\uparrow',
        energyConversion: '电能 \\rightarrow 化学能',
        electrolyteInfo: '饱和食盐水 ($NaCl$ 溶液)',
        membraneFunction: `隔膜阻隔 $Cl_2$ 与 $NaOH$ 反应，${membraneDesc}`,
      }
    }

    // 模式 3：法拉第定量计算
    return {
      title: '法拉第电解定律与定量守恒模型',
      subtitle: `当前调控：I = ${currentAmp} A, t = ${timeSec} s`,
      cellType: 'electrolytic',
      leftElectrode: {
        name: '阴极还原反应',
        poleType: 'cathode',
        reactionFormula: '\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}',
        electronChange: `转移 ${quantResult.molesElectron} mol 电子`,
        phenomenon: `析出 Cu 质量：${quantResult.massChangeRight} g`,
      },
      rightElectrode: {
        name: '阳极氧化反应',
        poleType: 'anode',
        reactionFormula: '4\\text{OH}^- - 4e^- \\rightarrow 2\\text{H}_2\\text{O} + \\text{O}_2\\uparrow',
        electronChange: `转移 ${quantResult.molesElectron} mol 电子`,
        phenomenon: `析出 O₂ 体积 (标况)：${quantResult.gasVolumeRight} L`,
      },
      overallReaction: '2\\text{CuSO}_4 + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{Cu} + 2\\text{H}_2\\text{SO}_4 + \\text{O}_2\\uparrow',
      energyConversion: '电能 \\rightarrow 化学能',
      electrolyteInfo: `硫酸铜溶液 (c₀ = ${electrolyteConc} mol/L)`,
      membraneFunction: '法拉第守恒：$n(e^-) = 2n(Cu) = 4n(O_2) = \\frac{I \\cdot t}{F}$',
    }
  }, [mode, batteryState, membraneType, currentAmp, timeSec, electrolyteConc, quantResult])

  return {
    cellDetails,
    quantResult,
  }
}
