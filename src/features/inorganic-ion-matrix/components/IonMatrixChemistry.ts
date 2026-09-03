/**
 * 分步连续滴加的真实化学相变计算（纯函数，返回渲染所需的化学态数据）。
 * 独立成模块以规避 fast-refresh 对组件文件的 only-export-components 约束。
 */

/** 计算分步连续滴加的真实化学相变与现象描述 */
export function computeStepChemistry(
  ionId: string,
  reagentId: string,
  dropCount: number,
  baseColor: string
) {
  if (dropCount === 0) {
    return {
      fillLevel: 0.38,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '待测原液准备就绪，请在上方悬空滴加试剂',
      stepTitle: '未开始实验',
    }
  }

  // ── Al3+ 两性氢氧化物反应 ──
  if (ionId === 'Al3+' && reagentId.includes('al3-naoh')) {
    if (dropCount === 1) {
      return {
        fillLevel: 0.5,
        fillColor: 'rgba(240, 249, 255, 0.7)',
        hasPrecipitate: true,
        precipitateLevel: 0.35,
        precipitateColor: '#f1f5f9',
        hasGas: false,
        litmusChange: false,
        annotation: '【滴加少量 NaOH】：Al³⁺ + 3OH⁻ = Al(OH)₃↓ 生成白色胶状沉淀',
        stepTitle: '阶段 1/2：滴加少量 (沉淀析出)',
      }
    }
    // dropCount === 2: 过量沉淀溶解
    return {
      fillLevel: 0.68,
      fillColor: 'rgba(240, 249, 255, 0.85)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【继续滴加过量 NaOH】：Al(OH)₃ + OH⁻ = [Al(OH)₄]⁻ 沉淀完全溶解澄清',
      stepTitle: '阶段 2/2：继续滴加至过量 (沉淀溶解)',
    }
  }

  // ── Zn2+ 两性氢氧化物反应 (溶于过量强碱或过量氨水) ──
  if (ionId === 'Zn2+' && reagentId.includes('zn-ammonia')) {
    if (dropCount === 1) {
      return {
        fillLevel: 0.5,
        fillColor: 'rgba(240, 249, 255, 0.7)',
        hasPrecipitate: true,
        precipitateLevel: 0.32,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【滴加少量氨水】：Zn²⁺ + 2NH₃·H₂O = Zn(OH)₂↓ + 2NH₄⁺ 析出白色沉淀',
        stepTitle: '阶段 1/2：滴加少量氨水 (生成白沉淀)',
      }
    }
    return {
      fillLevel: 0.68,
      fillColor: 'rgba(240, 249, 255, 0.85)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【继续滴加过量氨水】：Zn(OH)₂ + 4NH₃ = [Zn(NH₃)₄]²⁺ + 2OH⁻ 沉淀完全溶解 (与 Al³⁺ 严格区分)',
      stepTitle: '阶段 2/2：过量氨水 (生成配离子完全溶解)',
    }
  }

  // ── Mg2+ 与强碱反应 (过量不溶对比) ──
  if (ionId === 'Mg2+' && reagentId.includes('mg-naoh')) {
    if (dropCount === 1) {
      return {
        fillLevel: 0.5,
        fillColor: 'rgba(248, 250, 252, 0.6)',
        hasPrecipitate: true,
        precipitateLevel: 0.35,
        precipitateColor: '#f1f5f9',
        hasGas: false,
        litmusChange: false,
        annotation: '【滴加少量 NaOH】：Mg²⁺ + 2OH⁻ = Mg(OH)₂↓ 生成白色沉淀',
        stepTitle: '阶段 1/2：滴加少量 (生成沉淀)',
      }
    }
    return {
      fillLevel: 0.68,
      fillColor: 'rgba(248, 250, 252, 0.7)',
      hasPrecipitate: true,
      precipitateLevel: 0.45,
      precipitateColor: '#e2e8f0',
      hasGas: false,
      litmusChange: false,
      annotation: '【继续滴加过量 NaOH】：中强碱不溶于过量强碱，沉淀依然稳定不溶 (与 Al³⁺ 区分)',
      stepTitle: '阶段 2/2：继续滴加至过量 (沉淀依然不溶)',
    }
  }

  // ── Fe2+ 先加 KSCN 后加氯水 ──
  if (ionId === 'Fe2+' && reagentId.includes('fe2-kscn')) {
    if (dropCount === 1) {
      return {
        fillLevel: 0.48,
        fillColor: 'rgba(16, 185, 129, 0.65)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【第一步：先滴加 2 滴 KSCN 溶液】：溶液无明显变化（不变红），排除原液 Fe³⁺ 干扰',
        stepTitle: '步骤 1/2：加 KSCN (不变红)',
      }
    }
    return {
      fillLevel: 0.65,
      fillColor: 'rgba(185, 28, 28, 0.95)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【第二步：继续滴加新制氯水】：2Fe²⁺ + Cl₂ = 2Fe³⁺ + 2Cl⁻，溶液瞬间变为血红色！',
      stepTitle: '步骤 2/2：滴加新制氯水 (瞬间血红)',
    }
  }

  // ── MnO4- 强氧化性紫红褪色 ──
  if (ionId === 'MnO4-') {
    if (dropCount === 1) {
      return {
        fillLevel: 0.5,
        fillColor: 'rgba(168, 85, 247, 0.5)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【滴加 FeSO₄ 还原剂】：MnO₄⁻ 强氧化性被消耗，深紫红色变浅',
        stepTitle: '阶段 1/2：滴加还原剂 (紫红变浅)',
      }
    }
    return {
      fillLevel: 0.68,
      fillColor: 'rgba(254, 240, 138, 0.35)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【反应完全】：5Fe²⁺ + MnO₄⁻ + 8H⁺ = 5Fe³⁺ + Mn²⁺ + 4H₂O，深紫红色彻底褪去为澄清液',
      stepTitle: '阶段 2/2：反应完全 (深紫红彻底褪色)',
    }
  }

  // ── S2O32- 酸性自身歧化 ──
  if (ionId === 'S2O32-') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.68,
      fillColor: 'rgba(254, 240, 138, 0.8)',
      hasPrecipitate: true,
      precipitateLevel: dropCount === 1 ? 0.28 : 0.42,
      precipitateColor: '#fde047',
      hasGas: true,
      litmusChange: false,
      annotation: '【酸性歧化】：S₂O₃²⁻ + 2H⁺ = S↓ (淡黄色沉淀) + SO₂↑ (刺激性气味) + H₂O',
      stepTitle: dropCount === 1 ? '滴加稀硫酸 (出现淡黄浑浊)' : '反应完全 (析出淡黄硫沉淀并放出 SO₂)',
    }
  }

  // ── SiO32- 生成硅酸胶体沉淀 ──
  if (ionId === 'SiO32-') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.68,
      fillColor: 'rgba(240, 249, 255, 0.85)',
      hasPrecipitate: true,
      precipitateLevel: dropCount === 1 ? 0.35 : 0.5,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【强酸制弱酸】：SiO₃²⁻ + 2H⁺ = H₂SiO₃↓ 生成白色果冻状硅酸胶体沉淀，过量酸不溶解',
      stepTitle: dropCount === 1 ? '滴加稀盐酸 (果冻胶状沉淀)' : '过量盐酸 (沉淀依然稳定不溶)',
    }
  }

  // ── H+ 遇石蕊变红 / 遇 NaHCO3 产气 ──
  if (ionId === 'H+') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.65,
      fillColor: 'rgba(220, 38, 38, 0.88)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: reagentId.includes('nahco3'),
      litmusChange: false,
      annotation: reagentId.includes('nahco3')
        ? '【酸遇碳酸氢根】：H⁺ + HCO₃⁻ = CO₂↑ + H₂O 剧烈产生大量无色无味气泡'
        : '【酸性介质指示】：滴加紫色石蕊试液，指示剂瞬间转变为鲜艳红色',
      stepTitle: dropCount === 1 ? '加入指示剂/试剂' : '现象极度鲜明',
    }
  }

  // ── OH- 遇酚酞变红 / 遇 FeCl3 沉淀 ──
  if (ionId === 'OH-') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.65,
      fillColor: reagentId.includes('fecl3') ? 'rgba(120, 53, 15, 0.5)' : 'rgba(236, 72, 153, 0.9)',
      hasPrecipitate: reagentId.includes('fecl3'),
      precipitateLevel: reagentId.includes('fecl3') ? 0.35 : 0,
      precipitateColor: '#78350f',
      hasGas: false,
      litmusChange: false,
      annotation: reagentId.includes('fecl3')
        ? '【碱与铁离子】：Fe³⁺ + 3OH⁻ = Fe(OH)₃↓ 生成红褐色沉淀'
        : '【碱性介质指示】：滴加无色酚酞试液，瞬间变为鲜艳粉红色/红色',
      stepTitle: dropCount === 1 ? '加入试剂' : '现象极度灵敏',
    }
  }

  // ── SO42- 先加稀盐酸后加 BaCl2 ──
  if (ionId === 'SO42-' && reagentId.includes('so4-hcl')) {
    if (dropCount === 1) {
      return {
        fillLevel: 0.48,
        fillColor: 'rgba(248, 250, 252, 0.6)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【第一步：先加稀盐酸酸化】：无沉淀无气体，彻底排除 Ag⁺、SO₃²⁻、CO₃²⁻ 干扰',
        stepTitle: '步骤 1/2：加稀盐酸 (排除干扰)',
      }
    }
    return {
      fillLevel: 0.65,
      fillColor: 'rgba(248, 250, 252, 0.8)',
      hasPrecipitate: true,
      precipitateLevel: 0.38,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【第二步：继续滴加 BaCl₂ 溶液】：Ba²⁺ + SO₄²⁻ = BaSO₄↓ 产生难溶于酸的白色沉淀',
      stepTitle: '步骤 2/2：加 BaCl₂ (生成白色沉淀)',
    }
  }

  // ── NH4+ 加浓 NaOH + 微热 + 石蕊 ──
  if (ionId === 'NH4+') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.65,
      fillColor: 'rgba(241, 245, 249, 0.7)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: true,
      litmusChange: true,
      annotation: '【微热促逸出】：NH₄⁺ + OH⁻ ⇌ NH₃↑ + H₂O，湿润红色石蕊试纸接触碱性气体迅速变蓝',
      stepTitle: dropCount === 1 ? '滴加浓 NaOH' : '微热试管促使 NH₃ 逸出',
    }
  }

  // ── NO3- 铜片 + 浓硫酸 ──
  if (ionId === 'NO3-') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.65,
      fillColor: 'rgba(37, 99, 235, 0.8)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: true,
      litmusChange: false,
      annotation: '【微热氧化铜片】：3Cu + 8H⁺ + 2NO₃⁻ = 3Cu²⁺ + 2NO↑ + 4H₂O，产生红棕色 NO₂ 气体与蓝色溶液',
      stepTitle: dropCount === 1 ? '注入浓硫酸' : '微热生成红棕色 NO₂ 与天蓝 Cu²⁺',
    }
  }

  // ── 通用常规反应 ──
  const isPrecip = ['Al3+', 'Ba2+', 'Ag+', 'Mg2+', 'Ca2+', 'Zn2+', 'Mn2+', 'SO42-', 'Cl-', 'Br-', 'S2-', 'CO32-', 'SiO32-', 'F-', 'Cu2+'].includes(ionId)
  let pColor = '#ffffff'
  if (ionId === 'S2-') pColor = '#0f172a'
  else if (ionId === 'Br-') pColor = '#fef08a'
  else if (ionId === 'I-') pColor = '#facc15'
  else if (ionId === 'Cu2+') pColor = '#0ea5e9'
  else if (ionId === 'Mn2+') pColor = '#78350f'

  let rColor = baseColor
  if (ionId === 'Fe3+') rColor = 'rgba(185, 28, 28, 0.95)'
  else if (ionId === 'I-') rColor = 'rgba(30, 27, 75, 0.95)'
  else if (ionId === 'Br-') rColor = 'rgba(234, 88, 12, 0.85)'
  else if (ionId === 'Cu2+') rColor = 'rgba(37, 99, 235, 0.5)'
  else if (ionId === 'Na+') rColor = 'rgba(234, 179, 8, 0.95)'
  else if (ionId === 'K+') rColor = 'rgba(168, 85, 247, 0.9)'

  return {
    fillLevel: dropCount === 1 ? 0.52 : 0.68,
    fillColor: rColor,
    hasPrecipitate: isPrecip,
    precipitateLevel: isPrecip ? (dropCount === 1 ? 0.28 : 0.38) : 0,
    precipitateColor: pColor,
    hasGas: ['SO32-', 'CO32-', 'HCO3-', 'NO2-'].includes(ionId),
    litmusChange: false,
    annotation: `滴加 ${dropCount === 1 ? '少量' : '过量'} 试剂：反应充分进行`,
    stepTitle: dropCount === 1 ? '阶段 1/2：滴加试剂' : '阶段 2/2：继续滴加过量',
  }
}