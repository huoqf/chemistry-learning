/**
 * src/features/electrochemical-twin/components/ElectrochemicalTwinRightPanel.tsx
 * 右屏三段式：化学量监控 + 公式与原理 + 高考要点卡片 (基于 ChemistryPanel)
 * - 与左屏选项 (mode, batteryState, membraneType) 100% 动态精准同步
 * - 彻底根除跨模式不相干内容的静态显示 (质量变化、气体体积、考点与警示按模式严密隔离)
 */

import React, { useMemo } from 'react'
import { ChemistryPanel } from '@/components/UI'
import type { CellDetails, QuantResult, ElectrochemicalParams } from '../types'

interface Props {
  params: ElectrochemicalParams
  cellDetails: CellDetails
  quantResult: QuantResult
}

export const ElectrochemicalTwinRightPanel: React.FC<Props> = ({ params, cellDetails, quantResult }) => {
  const { mode, membraneType } = params

  // 1. 动态化学量定义：依模式精准隔离无关化学量
  const quantities = useMemo(() => {
    // 基础电气参数
    const baseQuantities = [
      {
        label: '回路电流强度 I',
        value: params.currentAmp,
        unit: 'A',
      },
      {
        label: '持续时间 t',
        value: params.timeSec,
        unit: 's',
      },
      {
        label: '转移电子量 n(e⁻)',
        value: quantResult.molesElectron,
        unit: 'mol',
      },
    ]

    if (mode === 0) {
      // 模式 0：Cu-Zn 双池，重点监控 Zn 溶解与 Cu 析出增重
      return [
        ...baseQuantities,
        {
          label: 'Zn 负极质量变化 Δm',
          value: quantResult.massChangeLeft,
          unit: 'g (溶解)',
        },
        {
          label: 'Cu 正极质量变化 Δm',
          value: quantResult.massChangeRight,
          unit: 'g (析出)',
        },
        {
          label: '盐桥转移电荷当量',
          value: quantResult.molesMembraneIon ?? 0,
          unit: 'mol',
        },
      ]
    }

    if (mode === 1) {
      // 模式 1：全钒液流电池，无固相沉淀与产气，重点监控离子转化摩尔数与穿膜 H⁺
      return [
        ...baseQuantities,
        {
          label: 'V²⁺/V³⁺ 活性物质转化量',
          value: quantResult.molesProductLeft,
          unit: 'mol',
        },
        {
          label: 'VO₂⁺/VO²⁺ 活性物质转化量',
          value: quantResult.molesProductRight,
          unit: 'mol',
        },
        {
          label: '质子膜穿透 n(H⁺)',
          value: quantResult.molesMembraneIon ?? 0,
          unit: 'mol',
        },
      ]
    }

    if (mode === 2) {
      // 模式 2：工业离子膜氯碱，无电极增重，重点监控两极气体与生成 NaOH
      return [
        ...baseQuantities,
        {
          label: '阳极生成 Cl₂ 体积 V',
          value: quantResult.gasVolumeLeft ?? 0,
          unit: 'L (标况)',
        },
        {
          label: '阴极生成 H₂ 体积 V',
          value: quantResult.gasVolumeRight,
          unit: 'L (标况)',
        },
        {
          label: '阴极生成 NaOH 物质的量',
          value: quantResult.molesElectron,
          unit: 'mol',
        },
        {
          label: '膜定向穿透微粒量',
          value: quantResult.molesMembraneIon ?? 0,
          unit: 'mol',
        },
      ]
    }

    // 模式 3：法拉第定量计算，全量监控电极增重与气体标况体积
    return [
      ...baseQuantities,
      {
        label: '阳极析出 O₂ 气体体积 V',
        value: quantResult.gasVolumeLeft ?? 0,
        unit: 'L (标况)',
      },
      {
        label: '阴极析出 Cu 金属增重 Δm',
        value: quantResult.massChangeRight,
        unit: 'g',
      },
      {
        label: '电解产生酸量 n(H⁺)',
        value: quantResult.molesElectron,
        unit: 'mol',
      },
      {
        label: '溶液 pH 理论估算偏移',
        value: quantResult.deltaPH,
        unit: 'pH 单位',
      },
    ]
  }, [mode, params.currentAmp, params.timeSec, quantResult])

  // 2. 动态公式定义：依模式展示核心电极反应与机理方程
  const formulas = useMemo(() => {
    if (mode === 0) {
      return [
        {
          name: '原电池总反应式',
          latex: '\\text{Zn} + \\text{Cu}^{2+} = \\text{Zn}^{2+} + \\text{Cu}',
          note: '负极: Zn - 2e⁻ → Zn²⁺ | 正极: Cu²⁺ + 2e⁻ → Cu',
          level: 'core' as const,
        },
        {
          name: '电解池总反应式',
          latex: '2\\text{CuSO}_4 + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{Cu} + 2\\text{H}_2\\text{SO}_4 + \\text{O}_2\\uparrow',
          note: '阳极: 2H₂O - 4e⁻ → O₂↑ + 4H⁺ | 阴极: Cu²⁺ + 2e⁻ → Cu',
          level: 'core' as const,
        },
        {
          name: '电极反应判定口诀',
          latex: '\\text{负失氧, 正得还; 阳失氧, 阴得还}',
          note: '负极与阳极发生氧化反应；正极与阴极发生还原反应。',
          level: 'important' as const,
        },
        {
          name: '盐桥微粒平衡规律',
          latex: '\\text{盐桥中 K}^+ \\rightarrow \\text{正极室, Cl}^- \\rightarrow \\text{负极室}',
          note: '微粒定向移动维持两烧杯溶液电荷守恒。',
          level: 'derived' as const,
        },
      ]
    }

    if (mode === 1) {
      return [
        {
          name: '全钒液流电池放电总反应 (原电池)',
          latex: '\\text{V}^{2+} + \\text{VO}_2^+ + 2\\text{H}^+ = \\text{V}^{3+} + \\text{VO}^{2+} + \\text{H}_2\\text{O}',
          note: '负极: V²⁺ - e⁻ = V³⁺ | 正极: VO₂⁺ + 2H⁺ + e⁻ = VO²⁺ + H₂O',
          level: 'core' as const,
        },
        {
          name: '全钒液流电池充电总反应 (电解池)',
          latex: '\\text{V}^{3+} + \\text{VO}^{2+} + \\text{H}_2\\text{O} \\xrightarrow{\\text{充电}} \\text{V}^{2+} + \\text{VO}_2^+ + 2\\text{H}^+',
          note: '阴极: V³⁺ + e⁻ = V²⁺ | 阳极: VO²⁺ + H₂O - e⁻ = VO₂⁺ + 2H⁺',
          level: 'core' as const,
        },
        {
          name: '二次电池充放电对应极性铁律',
          latex: '\\text{放电负极} \\Longleftrightarrow \\text{充电阴极}; \\quad \\text{放电正极} \\Longleftrightarrow \\text{充电阳极}',
          note: '充电阴极接外电源负极，充电阳极接外电源正极。',
          level: 'important' as const,
        },
        {
          name: '质子穿膜反转规律',
          latex: '\\text{放电: H}^+ \\rightarrow \\text{正极室}; \\quad \\text{充电: H}^+ \\rightarrow \\text{阴极室}',
          note: '始终遵守阳离子“阳往正阴”定向移动规律。',
          level: 'derived' as const,
        },
      ]
    }

    if (mode === 2) {
      // 模式 2 依据 membraneType 动态提供膜方程
      let membraneFormula: {
        name: string
        latex: string
        note: string
        level: 'core' | 'important' | 'derived'
      } = {
        name: '阳离子交换膜选择性透膜',
        latex: '\\text{Na}^+(\\text{阳极室}) \\xrightarrow{\\text{CEM}} \\text{Na}^+(\\text{阴极室})',
        note: '只允许 Na⁺ 穿膜，阻隔 Cl₂ 与 OH⁻ 接触生成次氯酸盐。',
        level: 'derived',
      }
      if (membraneType === 2) {
        membraneFormula = {
          name: '阴离子交换膜选择性透膜',
          latex: '\\text{Cl}^-(\\text{阴极室}) \\xrightarrow{\\text{AEM}} \\text{Cl}^-(\\text{阳极室})',
          note: '只允许阴离子穿膜进入阳极室放电。',
          level: 'derived' as const,
        }
      } else if (membraneType === 3) {
        membraneFormula = {
          name: '双极膜 (BPM) 催化水分子解离',
          latex: '\\text{H}_2\\text{O} \\xrightarrow{\\text{BPM催化层}} \\text{H}^+(\\text{移向阳极}) + \\text{OH}^-(\\text{移向阴极})',
          note: '无需外加酸碱，直接高效生产高纯度无机强酸与强碱。',
          level: 'core' as const,
        }
      }

      return [
        {
          name: '工业氯碱电解总反应式',
          latex: '2\\text{NaCl} + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{电解}} 2\\text{NaOH} + \\text{H}_2\\uparrow + \\text{Cl}_2\\uparrow',
          note: '阳极: 2Cl⁻ - 2e⁻ = Cl₂↑ | 阴极: 2H₂O + 2e⁻ = H₂↑ + 2OH⁻',
          level: 'core' as const,
        },
        membraneFormula,
        {
          name: '微粒定向迁移铁律',
          latex: '\\text{阳往正/阴极，阴往负/阳极}',
          note: cellDetails.membraneFunction,
          level: 'important' as const,
        },
      ]
    }

    // 模式 3：法拉第定量守恒
    return [
      {
        name: '法拉第电解定律基本关系式',
        latex: 'n(e^-) = \\frac{I \\cdot t}{F} = \\frac{Q}{F}',
        note: 'F = 96485 C/mol，为 1 mol 电子所带电荷量绝对值。',
        level: 'core' as const,
      },
      {
        name: '串联回路电子得失守恒链',
        latex: 'n(e^-) = 2n(\\text{Cu}) = 4n(\\text{O}_2) = \\frac{I \\cdot t}{F}',
        note: '阴极沉积 1 mol Cu 消耗 2 mol 电子，阳极释放 1 mol O₂ 失去 4 mol 电子。',
        level: 'core' as const,
      },
      {
        name: '质量与气体标况体积推导式',
        latex: '\\Delta m(\\text{Cu}) = \\frac{n(e^-)}{2} \\times 63.55\\text{ g}, \\quad V(\\text{O}_2) = \\frac{n(e^-)}{4} \\times 22.4\\text{ L}',
        note: '高考计算大题书写必须带入标况摩尔体积 22.4 L/mol。',
        level: 'important' as const,
      },
    ]
  }, [mode, membraneType, cellDetails.membraneFunction])

  // 3. 动态高考要点：依模式提供精准考点
  const gaokaoPoints = useMemo(() => {
    if (mode === 0) {
      return [
        {
          text: '装置性质判定：有无外接直流电源为核心判据。无外接电源自发进行为原电池；有外接直流电源强迫反应为电解池。',
          importance: 'gaokao' as const,
        },
        {
          text: '两池电极极性与微粒流向：原电池称为正负极，电解池称为阴阳极；外电路电子负出正入，溶液中电子绝不通过。',
          importance: 'core' as const,
        },
        {
          text: '盐桥的作用与离子流向：平衡两烧杯电荷，消除液接电势；阳离子移向正极室，阴离子移向负极室。',
          importance: 'hard' as const,
        },
      ]
    }

    if (mode === 1) {
      return [
        {
          text: '二次电池充放电转化逻辑：放电=原电池（化学能→电能），充电=电解池（电能→化学能）。',
          importance: 'gaokao' as const,
        },
        {
          text: '充放电对应极性判据：放电负极对应充电阴极（发生还原）；放电正极对应充电阳极（发生氧化）。',
          importance: 'core' as const,
        },
        {
          text: '质子交换膜迁移方向：放电时 H⁺ 向正极区移动（“阳往正”）；充电时 H⁺ 向阴极区移动（“阳往阴”）。',
          importance: 'hard' as const,
        },
      ]
    }

    if (mode === 2) {
      return [
        {
          text: '离子交换膜选择透过性：阳离子交换膜仅允许阳离子（如 Na⁺、H⁺）穿膜，阻隔阴离子（Cl⁻、OH⁻）及气体。',
          importance: 'gaokao' as const,
        },
        {
          text: '双极膜 (BPM) 高考新热点：在反向电压下膜中间水催化层快速裂解为 H⁺ 和 OH⁻，无需外加试剂直接富集强酸强碱。',
          importance: 'hard' as const,
        },
        {
          text: '隔室产物高纯度保护：阳离子膜阻隔阴极室生成的 OH⁻ 与阳极室 Cl₂ 接触，避免歧化生成 NaClO 副产物。',
          importance: 'core' as const,
        },
      ]
    }

    return [
      {
        text: '串联电路电子守恒解题法：串联各电解池或同一回路各电极上转移电子总摩尔数严格相等。',
        importance: 'gaokao' as const,
      },
      {
        text: '放电顺序优先性：阳极惰性极板 OH⁻ 优先放电析出 O₂；阴极 Cu²⁺ 氧化性强于 H⁺ 优先析出金属 Cu。',
        importance: 'core' as const,
      },
      {
        text: '定量连环计算公式：熟练运用 n(e⁻) = It/F = 2n(Cu) = 4n(O₂) 快速联立求解质量、气量与 pH。',
        importance: 'hard' as const,
      },
    ]
  }, [mode])

  // 4. 动态易错警示：依模式提供专属失分陷阱
  const warnings = useMemo(() => {
    if (mode === 0) {
      return [
        {
          text: '【警示 1】：电子绝对不能穿过电解质溶液或盐桥！导线中靠电子移动导电，溶液与盐桥中靠阴阳离子定向漂移导电。',
          level: 'danger' as const,
        },
        {
          text: '【警示 2】：电极名称不可混淆：原电池只能叫“正极/负极”，电解池只能叫“阴极/阳极”。',
          level: 'warning' as const,
        },
      ]
    }

    if (mode === 1) {
      return [
        {
          text: '【警示 1】：二次电池充电接线原则：充电阳极必须接直流电源正极，充电阴极必须接直流电源负极，切不可接反！',
          level: 'danger' as const,
        },
        {
          text: '【警示 2】：充放电离子移动不可死记硬背：放电时阳离子移向正极，充电时阳离子移向阴极，方向反转！',
          level: 'warning' as const,
        },
      ]
    }

    if (mode === 2) {
      return [
        {
          text: '【警示 1】：工业电解防副反应：若阳离子膜破损，阳极析出的 Cl₂ 会与阴极生成的 NaOH 反应生成 NaClO，导致纯碱减产。',
          level: 'danger' as const,
        },
        {
          text: '【警示 2】：阳极材质判定：氯碱工业阳极必须使用惰性电极（石墨或钛网），若使用 Fe/Cu 作阳极，金属本身将优先失电子溶解！',
          level: 'warning' as const,
        },
      ]
    }

    return [
      {
        text: '【警示 1】：标况体积计算陷阱：V = n × 22.4 L 必须以“标准状况 (0℃, 101 kPa)”为前提，常温常压 (25℃) 下不可套用 22.4 L/mol！',
        level: 'danger' as const,
      },
      {
        text: '【警示 2】：电子守恒系数易错：析出 1 mol O₂ 转移 4 mol e⁻，析出 1 mol Cu 转移 2 mol e⁻，守恒关系式中系数切勿颠倒。',
        level: 'warning' as const,
      },
    ]
  }, [mode])

  return (
    <ChemistryPanel
      title={cellDetails.title}
      quantities={quantities}
      formulas={formulas}
      gaokaoPoints={gaokaoPoints}
      warnings={warnings}
    />
  )
}
