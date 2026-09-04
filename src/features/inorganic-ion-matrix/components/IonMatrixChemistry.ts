/**
 * 分步连续滴加的真实化学相变计算（纯函数，返回渲染所需的化学态数据）。
 * 覆盖高中化学 32 种核心阴阳离子全集与各类试剂选项的相变。
 */

export interface StepChemistryState {
  fillLevel: number
  fillColor: string
  hasPrecipitate: boolean
  precipitateLevel: number
  precipitateColor: string
  hasGas: boolean
  litmusChange: boolean
  annotation: string
  stepTitle: string
  isFlameTest?: boolean
  flameColor?: string
  hasCobaltGlass?: boolean
}

/** 计算分步连续滴加的真实化学相变与现象描述 */
export function computeStepChemistry(
  ionId: string,
  reagentId: string,
  dropCount: number,
  baseColor: string
): StepChemistryState {
  // ── 0 滴：未滴加初始状态 ──
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
      isFlameTest: ionId === 'Na+' || ionId === 'K+' || (ionId === 'Ca2+' && reagentId.includes('flame')),
    }
  }

  // ════════════════════════════════════════════════════════
  // 阳离子部分 (14 种核心阳离子)
  // ════════════════════════════════════════════════════════

  // ── 1. Fe3+ ──
  if (ionId === 'Fe3+') {
    if (reagentId.includes('fe3-kscn')) {
      return {
        fillLevel: 0.55,
        fillColor: 'rgba(185, 28, 28, 0.95)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【显色反应】：Fe³⁺ + 3SCN⁻ ⇌ Fe(SCN)₃ 瞬间生成特征血红色配合物溶液',
        stepTitle: '滴加 KSCN 溶液 (瞬间显血红色)',
      }
    }
    if (reagentId.includes('fe3-naoh')) {
      return {
        fillLevel: 0.58,
        fillColor: 'rgba(217, 119, 6, 0.35)',
        hasPrecipitate: true,
        precipitateLevel: dropCount === 1 ? 0.32 : 0.45,
        precipitateColor: '#78350f',
        hasGas: false,
        litmusChange: false,
        annotation: '【强碱沉淀】：Fe³⁺ + 3OH⁻ = Fe(OH)₃↓ 生成大量红褐色絮状沉淀，不溶于过量碱',
        stepTitle: dropCount === 1 ? '滴加少量 NaOH (析出红褐沉淀)' : '过量 NaOH (沉淀依然稳定不溶)',
      }
    }
    // 淀粉无效试剂
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无显色反应】：淀粉溶液仅与单质碘 I₂ 变蓝，与 Fe³⁺ 不反应，溶液保持棕黄色',
      stepTitle: '加入淀粉溶液 (无明显现象)',
    }
  }

  // ── 2. Fe2+ ──
  if (ionId === 'Fe2+') {
    if (reagentId.includes('fe2-kscn-cl2')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.48,
          fillColor: 'rgba(16, 185, 129, 0.65)',
          hasPrecipitate: false,
          precipitateLevel: 0,
          precipitateColor: '#ffffff',
          hasGas: false,
          litmusChange: false,
          annotation: '【第一步：先加 2 滴 KSCN】：溶液保持浅绿不变红，证明原液无 Fe³⁺ 干扰',
          stepTitle: '步骤 1/2：加 KSCN 溶液 (不变红)',
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
        annotation: '【第二步：继续滴加新制氯水】：2Fe²⁺ + Cl₂ = 2Fe³⁺ + 2Cl⁻，氧化后瞬间变为血红色！',
        stepTitle: '步骤 2/2：滴加新制氯水 (瞬间血红)',
      }
    }
    if (reagentId.includes('fe2-naoh')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.52,
          fillColor: 'rgba(16, 185, 129, 0.4)',
          hasPrecipitate: true,
          precipitateLevel: 0.3,
          precipitateColor: '#94a3b8',
          hasGas: false,
          litmusChange: false,
          annotation: '【沉淀生成】：Fe²⁺ + 2OH⁻ = Fe(OH)₂↓ 析出白色絮状沉淀，迅速变为灰绿色',
          stepTitle: '阶段 1/2：析出白色沉淀转灰绿',
        }
      }
      return {
        fillLevel: 0.68,
        fillColor: 'rgba(120, 53, 15, 0.4)',
        hasPrecipitate: true,
        precipitateLevel: 0.45,
        precipitateColor: '#78350f',
        hasGas: false,
        litmusChange: false,
        annotation: '【空气氧化】：4Fe(OH)₂ + O₂ + 2H₂O = 4Fe(OH)₃ 灰绿色沉淀最终转变为红褐色',
        stepTitle: '阶段 2/2：被空气氧化为红褐色',
      }
    }
    // 单加 KSCN
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无反应】：Fe²⁺ 与 KSCN 不反应，溶液不变红，无法证明是否含有 Fe²⁺',
      stepTitle: '单加 KSCN (不变红，无法鉴别)',
    }
  }

  // ── 3. Al3+ ──
  if (ionId === 'Al3+') {
    if (reagentId.includes('al3-naoh')) {
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
      return {
        fillLevel: 0.68,
        fillColor: 'rgba(240, 249, 255, 0.85)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【继续滴加过量 NaOH】：Al(OH)₃ + OH⁻ = [Al(OH)₄]⁻ 两性沉淀完全溶解澄清',
        stepTitle: '阶段 2/2：过量强碱 (沉淀完全溶解)',
      }
    }
    if (reagentId.includes('al3-nh3')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(240, 249, 255, 0.7)',
        hasPrecipitate: true,
        precipitateLevel: dropCount === 1 ? 0.32 : 0.45,
        precipitateColor: '#f1f5f9',
        hasGas: false,
        litmusChange: false,
        annotation: '【弱碱反应】：Al(OH)₃ 不溶于弱碱（氨水），过量氨水沉淀依然稳定不溶解',
        stepTitle: dropCount === 1 ? '滴加氨水 (生成白色沉淀)' : '过量氨水 (沉淀依然不溶)',
      }
    }
    // BaCl2 无反应
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无反应】：Al³⁺ 与 BaCl₂ 不发生沉淀或复分解反应',
      stepTitle: '滴加 BaCl₂ (无明显现象)',
    }
  }

  // ── 4. Zn2+ ──
  if (ionId === 'Zn2+') {
    if (reagentId.includes('zn-ammonia')) {
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
    return {
      fillLevel: dropCount === 1 ? 0.5 : 0.68,
      fillColor: 'rgba(248, 250, 252, 0.7)',
      hasPrecipitate: true,
      precipitateLevel: 0.35,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【氢氧化锌两性沉淀】：Zn²⁺ + 2OH⁻ = Zn(OH)₂↓ 生成白色沉淀',
      stepTitle: '生成白色沉淀',
    }
  }

  // ── 5. Mg2+ ──
  if (ionId === 'Mg2+') {
    if (reagentId.includes('mg-naoh')) {
      return {
        fillLevel: dropCount === 1 ? 0.5 : 0.68,
        fillColor: 'rgba(248, 250, 252, 0.7)',
        hasPrecipitate: true,
        precipitateLevel: dropCount === 1 ? 0.35 : 0.48,
        precipitateColor: '#e2e8f0',
        hasGas: false,
        litmusChange: false,
        annotation: '【生成中强碱】：Mg²⁺ + 2OH⁻ = Mg(OH)₂↓ 白色沉淀在过量强碱中依然不溶 (与 Al³⁺ 区别)',
        stepTitle: dropCount === 1 ? '滴加少量 NaOH (生成白色沉淀)' : '过量强碱 (沉淀依然稳定不溶)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无明显反应】：无沉淀或显色反应',
      stepTitle: '加入试剂 (无明显现象)',
    }
  }

  // ── 6. Cu2+ ──
  if (ionId === 'Cu2+') {
    if (reagentId.includes('cu2-naoh')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.52,
          fillColor: 'rgba(37, 99, 235, 0.35)',
          hasPrecipitate: true,
          precipitateLevel: 0.32,
          precipitateColor: '#0ea5e9',
          hasGas: false,
          litmusChange: false,
          annotation: '【生成碱沉淀】：Cu²⁺ + 2OH⁻ = Cu(OH)₂↓ 析出特征天蓝色絮状沉淀',
          stepTitle: '滴加 NaOH 溶液 (析出天蓝絮状沉淀)',
        }
      }
      return {
        fillLevel: 0.68,
        fillColor: 'rgba(30, 58, 138, 0.9)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【继续滴加浓氨水】：Cu(OH)₂ + 4NH₃ = [Cu(NH₃)₄]²⁺ + 2OH⁻ 沉淀溶解生成深蓝色澄清络溶液',
        stepTitle: '过量浓氨水 (沉淀溶解为深蓝澄清液)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无反应】：同阳离子或非沉淀介质，保持天蓝色原液',
      stepTitle: '加入试剂 (无反应)',
    }
  }

  // ── 7. Ag+ ──
  if (ionId === 'Ag+') {
    if (reagentId.includes('ag-hcl-nh3')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.5,
          fillColor: 'rgba(241, 245, 249, 0.7)',
          hasPrecipitate: true,
          precipitateLevel: 0.35,
          precipitateColor: '#ffffff',
          hasGas: false,
          litmusChange: false,
          annotation: '【滴加稀盐酸】：Ag⁺ + Cl⁻ = AgCl↓ 析出白色凝乳状沉淀，不溶于稀硝酸',
          stepTitle: '步骤 1/2：滴加稀盐酸 (白色沉淀)',
        }
      }
      return {
        fillLevel: 0.68,
        fillColor: 'rgba(241, 245, 249, 0.85)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【滴加过量氨水】：AgCl + 2NH₃ = [Ag(NH₃)₂]⁺ + Cl⁻ 沉淀溶解为澄清银氨溶液',
        stepTitle: '步骤 2/2：滴加氨水 (沉淀完全溶解澄清)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【微溶或无反应】：现象不灵敏，难以作为绝对定性依据',
      stepTitle: '加入试剂 (现象不明显)',
    }
  }

  // ── 8. Ba2+ ──
  if (ionId === 'Ba2+') {
    if (reagentId.includes('ba2-h2so4')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(248, 250, 252, 0.8)',
        hasPrecipitate: true,
        precipitateLevel: dropCount === 1 ? 0.32 : 0.45,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【硫酸钡沉淀】：Ba²⁺ + SO₄²⁻ = BaSO₄↓ 生成难溶于酸的白色细晶沉淀',
        stepTitle: '滴加稀硫酸与稀硝酸 (生成白色沉淀且不溶)',
      }
    }
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.68,
      fillColor: 'rgba(248, 250, 252, 0.7)',
      hasPrecipitate: true,
      precipitateLevel: 0.35,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【碳酸钡沉淀】：Ba²⁺ + CO₃²⁻ = BaCO₃↓ 白色沉淀溶于盐酸',
      stepTitle: '生成白色沉淀',
    }
  }

  // ── 9. Ca2+ ──
  if (ionId === 'Ca2+') {
    if (reagentId.includes('ca-flame')) {
      return {
        fillLevel: 0.55,
        fillColor: 'rgba(248, 250, 252, 0.7)',
        hasPrecipitate: true,
        precipitateLevel: 0.32,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【钙盐反应】：加碳酸钠析出白色沉淀 CaCO₃；焰色试验火焰呈现特征砖红色',
        stepTitle: 'Na₂CO₃ 白色沉淀 + 砖红色焰色',
        isFlameTest: true,
        flameColor: '#dc2626',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【灵敏度低】：CaSO₄ 属于微溶物，稀溶液中不易析出沉淀',
      stepTitle: '稀硫酸 (微溶无明显沉淀)',
    }
  }

  // ── 10. NH4+ ──
  if (ionId === 'NH4+') {
    if (reagentId.includes('nh4-naoh-heat')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.65,
        fillColor: 'rgba(241, 245, 249, 0.7)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: true,
        litmusChange: true,
        annotation: '【微热促逸出】：NH₄⁺ + OH⁻ ⇌ NH₃↑ + H₂O，管口湿润红色石蕊试纸遇氨气迅速变蓝',
        stepTitle: dropCount === 1 ? '滴加浓 NaOH 溶液' : '微热促使刺激性 NH₃ 逸出 (试纸变蓝)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【室温稀溶液】：氨气极易溶于水，常温稀溶液中极难逸出，试纸无变化',
      stepTitle: '室温不加热 (无气体逸出)',
    }
  }

  // ── 11. H+ ──
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

  // ── 12. Na+ ──
  if (ionId === 'Na+') {
    if (reagentId.includes('na-flame')) {
      return {
        fillLevel: 0.5,
        fillColor: 'rgba(234, 179, 8, 0.95)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【物理原子光谱】：Na 元素在无色火焰中灼烧，呈现特征明亮耀眼的金黄色火焰 (589nm)',
        stepTitle: '焰色试验：火焰呈特征金黄色',
        isFlameTest: true,
        flameColor: '#eab308',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【全共存特性】：Na⁺ 不与常见阴离子沉淀，化学试剂无法显色',
      stepTitle: '化学试剂 (无反应)',
    }
  }

  // ── 13. K+ ──
  if (ionId === 'K+') {
    if (reagentId.includes('k-flame-cobalt')) {
      return {
        fillLevel: 0.5,
        fillColor: 'rgba(168, 85, 247, 0.9)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【蓝色钴玻璃滤光】：透过蓝色钴玻璃滤去微量钠的黄光干扰，清晰观察到钾特征浅紫色火焰',
        stepTitle: '焰色试验 (透过钴玻璃呈淡紫色)',
        isFlameTest: true,
        flameColor: '#c084fc',
        hasCobaltGlass: true,
      }
    }
    if (reagentId.includes('k-flame-direct')) {
      return {
        fillLevel: 0.5,
        fillColor: 'rgba(234, 179, 8, 0.85)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【高考经典陷阱】：样品微量混有 Na⁺，肉眼看到强烈黄光彻底掩盖紫色，必须透过蓝色钴玻璃！',
        stepTitle: '直接肉眼观察 (被钠黄光掩盖)',
        isFlameTest: true,
        flameColor: '#eab308',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无明显反应】：钾盐全溶，无特征沉淀',
      stepTitle: '化学试剂 (无反应)',
    }
  }

  // ── 14. Mn2+ ──
  if (ionId === 'Mn2+') {
    if (reagentId.includes('mn-naoh')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.52,
          fillColor: 'rgba(251, 207, 232, 0.5)',
          hasPrecipitate: true,
          precipitateLevel: 0.32,
          precipitateColor: '#ffffff',
          hasGas: false,
          litmusChange: false,
          annotation: '【生成氢氧化锰】：Mn²⁺ + 2OH⁻ = Mn(OH)₂↓ 析出不稳定白色沉淀',
          stepTitle: '阶段 1/2：析出白色沉淀 Mn(OH)₂',
        }
      }
      return {
        fillLevel: 0.68,
        fillColor: 'rgba(120, 53, 15, 0.4)',
        hasPrecipitate: true,
        precipitateLevel: 0.45,
        precipitateColor: '#78350f',
        hasGas: false,
        litmusChange: false,
        annotation: '【空气氧化为水合二氧化锰】：2Mn(OH)₂ + O₂ = 2MnO(OH)₂↓ 沉淀迅速氧化变为棕褐色',
        stepTitle: '阶段 2/2：迅速被空气氧化为棕褐色沉淀',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无反应】：保持近肉粉色无明显变化',
      stepTitle: '加入试剂 (无明显现象)',
    }
  }

  // ════════════════════════════════════════════════════════
  // 阴离子部分 (18 种核心阴离子)
  // ════════════════════════════════════════════════════════

  // ── 15. Cl- ──
  if (ionId === 'Cl-') {
    if (reagentId.includes('cl-hno3-agno3')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(241, 245, 249, 0.8)',
        hasPrecipitate: true,
        precipitateLevel: dropCount === 1 ? 0.35 : 0.48,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【氯化银沉淀】：Ag⁺ + Cl⁻ = AgCl↓ 生成不溶于稀硝酸的白色凝乳状沉淀',
        stepTitle: '加稀硝酸与 AgNO₃ (生成不溶白色沉淀)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无显色反应】：无沉淀无变化',
      stepTitle: '加入试剂 (无反应)',
    }
  }

  // ── 16. Br- (萃取分层，绝无沉淀！) ──
  if (ionId === 'Br-') {
    if (reagentId.includes('br-cl2-ccl4')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(234, 88, 12, 0.88)', // 萃取下层呈现极鲜明橙红色
        hasPrecipitate: false, // 严格物理规律：液体萃取绝无沉淀
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【置换与萃取】：2Br⁻ + Cl₂ = Br₂ + 2Cl⁻，单质 Br₂ 溶于下层 CCl₄ 呈特征橙红色',
        stepTitle: '氯水置换 + CCl₄ 萃取 (下层呈橙红色)',
      }
    }
    if (reagentId.includes('br-agno3')) {
      return {
        fillLevel: 0.55,
        fillColor: 'rgba(254, 243, 199, 0.7)',
        hasPrecipitate: true,
        precipitateLevel: 0.35,
        precipitateColor: '#fef08a',
        hasGas: false,
        litmusChange: false,
        annotation: '【溴化银沉淀】：Ag⁺ + Br⁻ = AgBr↓ 生成淡黄色沉淀',
        stepTitle: 'AgNO₃ + 稀硝酸 (生成淡黄色沉淀)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无沉淀】：无反应发生',
      stepTitle: '无反应',
    }
  }

  // ── 17. I- (淀粉包合物，绝无沉淀！) ──
  if (ionId === 'I-') {
    if (reagentId.includes('i-cl2-starch')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(30, 58, 138, 0.95)', // 淀粉深蓝
        hasPrecipitate: false, // 溶液包合物，绝无沉淀
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【单质碘特性】：2I⁻ + Cl₂ = I₂ + 2Cl⁻，单质 I₂ 与淀粉形成深蓝色包合物溶液',
        stepTitle: '新制氯水 + 淀粉 (瞬间变为深蓝色)',
      }
    }
    if (reagentId.includes('i-agno3')) {
      return {
        fillLevel: 0.55,
        fillColor: 'rgba(254, 249, 195, 0.7)',
        hasPrecipitate: true,
        precipitateLevel: 0.38,
        precipitateColor: '#facc15',
        hasGas: false,
        litmusChange: false,
        annotation: '【碘化银沉淀】：Ag⁺ + I⁻ = AgI↓ 生成特征黄色沉淀，不溶于酸和氨水',
        stepTitle: 'AgNO₃ + 稀硝酸 (生成黄色沉淀)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【非氧化性酸】：无法氧化 I⁻，无明显变化',
      stepTitle: '稀硫酸 (无现象)',
    }
  }

  // ── 18. F- (AgF 极易溶于水，绝对无沉淀！) ──
  if (ionId === 'F-') {
    if (reagentId.includes('f-cacl2-hf')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(248, 250, 252, 0.7)',
        hasPrecipitate: true,
        precipitateLevel: 0.38,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【氟化钙沉淀】：Ca²⁺ + 2F⁻ = CaF₂↓ 生成致密白色沉淀，难溶于酸',
        stepTitle: '滴加 CaCl₂ (析出白色沉淀 CaF₂)',
      }
    }
    if (reagentId.includes('f-agno3')) {
      return {
        fillLevel: 0.52,
        fillColor: baseColor,
        hasPrecipitate: false, // 高考核心考点：AgF 极易溶于水，绝对无沉淀！
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【高考经典陷阱】：AgF 极易溶于水，滴加硝酸银绝对无沉淀，与其它卤素截然相反！',
        stepTitle: '滴加 AgNO₃ (AgF 极易溶，无沉淀)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无反应】：无反应发生',
      stepTitle: '无明显变化',
    }
  }

  // ── 19. S2- ──
  if (ionId === 'S2-') {
    if (reagentId.includes('s2-cuso4')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(15, 23, 42, 0.4)',
        hasPrecipitate: true,
        precipitateLevel: dropCount === 1 ? 0.35 : 0.48,
        precipitateColor: '#0f172a',
        hasGas: false,
        litmusChange: false,
        annotation: '【极难溶硫化物】：Cu²⁺ + S²⁻ = CuS↓ (黑色沉淀，Ksp = 6.3×10⁻³⁶)，不溶于非氧化性酸',
        stepTitle: '滴加 CuSO₄ (立即析出特征黑色沉淀)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【BaS 易溶】：无沉淀析出，无明显反应',
      stepTitle: '滴加 BaCl₂ (BaS 易溶，无沉淀)',
    }
  }

  // ── 20. SO42- ──
  if (ionId === 'SO42-') {
    if (reagentId.includes('so4-hcl')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.48,
          fillColor: 'rgba(248, 250, 252, 0.6)',
          hasPrecipitate: false,
          precipitateLevel: 0,
          precipitateColor: '#ffffff',
          hasGas: false,
          litmusChange: false,
          annotation: '【第一步：加足量稀盐酸酸化】：无沉淀无气体，彻底排除 Ag⁺、SO₃²⁻、CO₃²⁻ 干扰',
          stepTitle: '步骤 1/2：加稀盐酸 (排除干扰无现象)',
        }
      }
      return {
        fillLevel: 0.65,
        fillColor: 'rgba(248, 250, 252, 0.8)',
        hasPrecipitate: true,
        precipitateLevel: 0.4,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【第二步：滴加 BaCl₂ 溶液】：Ba²⁺ + SO₄²⁻ = BaSO₄↓ 产生不溶于盐酸的白色沉淀',
        stepTitle: '步骤 2/2：滴加 BaCl₂ (生成白色难溶沉淀)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: 'rgba(248, 250, 252, 0.7)',
      hasPrecipitate: true,
      precipitateLevel: 0.35,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【未排除干扰陷阱】：直接加 BaCl₂ 虽然有白沉淀，但无法排除 SO₃²⁻/CO₃²⁻ 干扰！',
      stepTitle: '直接加 BaCl₂ (无法排除假阳性)',
    }
  }

  // ── 21. CO32- ──
  if (ionId === 'CO32-') {
    if (reagentId.includes('co3-cacl2')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.5,
          fillColor: 'rgba(248, 250, 252, 0.7)',
          hasPrecipitate: true,
          precipitateLevel: 0.35,
          precipitateColor: '#ffffff',
          hasGas: false,
          litmusChange: false,
          annotation: '【第一步：先加 CaCl₂ 溶液】：Ca²⁺ + CO₃²⁻ = CaCO₃↓ 产生白色沉淀 (彻底排除 HCO₃⁻ 干扰)',
          stepTitle: '步骤 1/2：加 CaCl₂ (产生白色沉淀)',
        }
      }
      return {
        fillLevel: 0.68,
        fillColor: 'rgba(248, 250, 252, 0.8)',
        hasPrecipitate: false, // 沉淀溶于酸完全澄清
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: true,
        litmusChange: false,
        annotation: '【第二步：继续加稀盐酸】：CaCO₃ + 2H⁺ = Ca²⁺ + CO₂↑ + H₂O 沉淀完全溶解并剧烈冒气泡',
        stepTitle: '步骤 2/2：加盐酸 (沉淀溶解并剧烈产气)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: true,
      litmusChange: false,
      annotation: '【直接加酸缺陷】：直接加酸剧烈冒泡，但无法排除 HCO₃⁻！必须先用 CaCl₂ 区分',
      stepTitle: '直接加酸冒泡 (无法区分正盐与酸式盐)',
    }
  }

  // ── 22. HCO3- ──
  if (ionId === 'HCO3-') {
    if (reagentId.includes('hco3-cacl2')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.48,
          fillColor: 'rgba(248, 250, 252, 0.6)',
          hasPrecipitate: false, // 先加 CaCl2 绝对无沉淀
          precipitateLevel: 0,
          precipitateColor: '#ffffff',
          hasGas: false,
          litmusChange: false,
          annotation: '【第一步：先加 CaCl₂ 溶液】：Ca(HCO₃)₂ 易溶无沉淀析出，彻底排除 CO₃²⁻ 干扰',
          stepTitle: '步骤 1/2：加 CaCl₂ (无沉淀析出)',
        }
      }
      return {
        fillLevel: 0.65,
        fillColor: 'rgba(248, 250, 252, 0.8)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: true,
        litmusChange: false,
        annotation: '【第二步：滴加稀盐酸】：HCO₃⁻ + H⁺ = CO₂↑ + H₂O 剧烈产生大量无色无味气泡',
        stepTitle: '步骤 2/2：滴加稀盐酸 (剧烈冒气泡)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: true,
      litmusChange: false,
      annotation: '【直接加酸冒泡】：产生气体但无法确认为酸式盐',
      stepTitle: '直接加酸产气',
    }
  }

  // ── 23. AlO2- (两性偏铝酸根：先析出 Al(OH)3，酸过量完全溶解澄清！) ──
  if (ionId === 'AlO2-') {
    if (reagentId.includes('alo2-hcl')) {
      if (dropCount === 1) {
        return {
          fillLevel: 0.5,
          fillColor: 'rgba(240, 249, 255, 0.7)',
          hasPrecipitate: true,
          precipitateLevel: 0.35,
          precipitateColor: '#ffffff',
          hasGas: false,
          litmusChange: false,
          annotation: '【逐滴滴加少量强酸】：AlO₂⁻ + H⁺ + H₂O = Al(OH)₃↓ 析出白色胶状沉淀',
          stepTitle: '阶段 1/2：滴加少量强酸 (析出白色沉淀)',
        }
      }
      return {
        fillLevel: 0.68,
        fillColor: 'rgba(240, 249, 255, 0.85)',
        hasPrecipitate: false, // 酸过量沉淀完全溶解生成澄清 Al3+
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【继续滴加过量强酸】：Al(OH)₃ + 3H⁺ = Al³⁺ + 3H₂O 两性沉淀完全溶解澄清',
        stepTitle: '阶段 2/2：过量强酸 (沉淀完全溶解澄清)',
      }
    }
    if (reagentId.includes('alo2-co2')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(240, 249, 255, 0.75)',
        hasPrecipitate: true,
        precipitateLevel: dropCount === 1 ? 0.35 : 0.48,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【通入弱酸 CO₂】：AlO₂⁻ + CO₂ + 2H₂O = Al(OH)₃↓ + HCO₃⁻ 沉淀在过量弱酸中绝对不溶解',
        stepTitle: '通入过量 CO₂ (析出白色沉淀且不溶解)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【无沉淀】：无明显变化',
      stepTitle: '无现象',
    }
  }

  // ── 24. SO32- (可逆漂白品红，绝无沉淀！) ──
  if (ionId === 'SO32-') {
    if (reagentId.includes('so3-hcl')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(248, 250, 252, 0.7)',
        hasPrecipitate: false, // 气体产物，无沉淀
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: true,
        litmusChange: false,
        annotation: '【特征可逆漂白】：SO₃²⁻ + 2H⁺ = SO₂↑ + H₂O，通入品红褪色，微热后品红恢复红色',
        stepTitle: '稀盐酸 + 品红 (气体使品红褪色，受热复色)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: 'rgba(248, 250, 252, 0.7)',
      hasPrecipitate: true,
      precipitateLevel: 0.35,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【BaSO₃沉淀】：Ba²⁺ + SO₃²⁻ = BaSO₃↓ 沉淀在空气中易氧化为 BaSO₄',
      stepTitle: '生成白色沉淀',
    }
  }

  // ── 25. ClO- (强氧化不可逆漂白) ──
  if (ionId === 'ClO-') {
    if (reagentId.includes('clo-fuchsin')) {
      return {
        fillLevel: 0.55,
        fillColor: 'rgba(248, 250, 252, 0.8)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: false,
        litmusChange: false,
        annotation: '【不可逆氧化漂白】：HClO 强氧化破坏发色基团，加热不可恢复红色 (区别于 SO₂ 可逆漂白)',
        stepTitle: '品红溶液微热 (不可逆彻底褪色)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: 'rgba(248, 250, 252, 0.85)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【试纸变色与漂白】：水解显碱性先使试纸变蓝，随后强氧化漂白为白色斑块',
      stepTitle: 'pH 试纸 (先变蓝后被漂白)',
    }
  }

  // ── 26. MnO4- ──
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
        annotation: '【强氧化消耗】：5Fe²⁺ + MnO₄⁻ + 8H⁺ = 5Fe³⁺ + Mn²⁺ + 4H₂O 深紫红色变浅',
        stepTitle: '阶段 1/2：滴加还原剂 (紫红色变浅)',
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
      annotation: '【完全还原褪色】：高锰酸根完全被还原为无色 Mn²⁺，深紫红色彻底褪去为澄清液',
      stepTitle: '阶段 2/2：完全反应 (深紫红彻底褪色澄清)',
    }
  }

  // ── 27. SiO32- ──
  if (ionId === 'SiO32-') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.68,
      fillColor: 'rgba(240, 249, 255, 0.85)',
      hasPrecipitate: true,
      precipitateLevel: dropCount === 1 ? 0.35 : 0.5,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【强酸制弱酸】：SiO₃²⁻ + 2H⁺ = H₂SiO₃↓ 生成白色果冻状硅酸胶体，过量强酸依然不溶解',
      stepTitle: dropCount === 1 ? '滴加稀盐酸 (果冻胶状沉淀)' : '过量盐酸 (沉淀依然稳定不溶)',
    }
  }

  // ── 28. S2O32- ──
  if (ionId === 'S2O32-') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.68,
      fillColor: 'rgba(254, 240, 138, 0.8)',
      hasPrecipitate: true,
      precipitateLevel: dropCount === 1 ? 0.28 : 0.42,
      precipitateColor: '#fde047',
      hasGas: true,
      litmusChange: false,
      annotation: '【酸性特征歧化】：S₂O₃²⁻ + 2H⁺ = S↓ (淡黄色单质沉淀) + SO₂↑ (刺激性气味) + H₂O',
      stepTitle: dropCount === 1 ? '滴加稀硫酸 (析出淡黄沉淀)' : '反应完全 (淡黄色硫沉淀与刺激性气体)',
    }
  }

  // ── 29. NO3- ──
  if (ionId === 'NO3-') {
    if (reagentId.includes('no3-cu-h2so4')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.65,
        fillColor: 'rgba(37, 99, 235, 0.8)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: true,
        litmusChange: false,
        annotation: '【酸性强氧化】：3Cu + 8H⁺ + 2NO₃⁻ = 3Cu²⁺ + 2NO↑ + 4H₂O，管口呈红棕色 NO₂，溶液变天蓝',
        stepTitle: dropCount === 1 ? '加入浓硫酸' : '微热生成红棕色气体与天蓝色溶液',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: baseColor,
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【中性不显氧化性】：中性介质中 NO₃⁻ 不氧化铜单质，铜片光亮无变化',
      stepTitle: '单加铜片 (中性不反应)',
    }
  }

  // ── 30. NO2- ──
  if (ionId === 'NO2-') {
    if (reagentId.includes('no2-ki-starch')) {
      return {
        fillLevel: dropCount === 1 ? 0.52 : 0.68,
        fillColor: 'rgba(30, 58, 138, 0.95)',
        hasPrecipitate: false,
        precipitateLevel: 0,
        precipitateColor: '#ffffff',
        hasGas: true,
        litmusChange: false,
        annotation: '【弱酸氧化碘化物】：2NO₂⁻ + 2I⁻ + 4H⁺ = 2NO↑ + I₂ + 2H₂O，淀粉变深蓝，管口呈红棕色',
        stepTitle: '弱酸 + KI-淀粉 (溶液变深蓝且逸出气体)',
      }
    }
    return {
      fillLevel: 0.52,
      fillColor: 'rgba(248, 250, 252, 0.7)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: true,
      litmusChange: false,
      annotation: '【酸性歧化】：3NO₂⁻ + 2H⁺ = NO₃⁻ + 2NO↑ + H₂O 逸出气体遇空气变红棕色',
      stepTitle: '单加稀硫酸 (红棕色气体)',
    }
  }

  // ── 31. CH3COO- ──
  if (ionId === 'CH3COO-') {
    return {
      fillLevel: dropCount === 1 ? 0.52 : 0.65,
      fillColor: 'rgba(248, 250, 252, 0.7)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: true,
      litmusChange: false,
      annotation: '【挥发性弱酸】：CH₃COO⁻ + H⁺ ⇌ CH₃COOH↑ 微热产生特有强烈刺激性酸醋香味',
      stepTitle: '浓硫酸微热 (挥发刺激性醋酸香味)',
    }
  }

  // ── 32. OH- ──
  if (ionId === 'OH-') {
    if (reagentId.includes('oh-fecl3')) {
      return {
        fillLevel: 0.55,
        fillColor: 'rgba(120, 53, 15, 0.5)',
        hasPrecipitate: true,
        precipitateLevel: 0.4,
        precipitateColor: '#78350f',
        hasGas: false,
        litmusChange: false,
        annotation: '【沉淀反应】：Fe³⁺ + 3OH⁻ = Fe(OH)₃↓ 生成红褐色絮状沉淀',
        stepTitle: '滴加 FeCl₃ (生成红褐色沉淀)',
      }
    }
    return {
      fillLevel: 0.55,
      fillColor: 'rgba(236, 72, 153, 0.9)',
      hasPrecipitate: false,
      precipitateLevel: 0,
      precipitateColor: '#ffffff',
      hasGas: false,
      litmusChange: false,
      annotation: '【碱性指示】：碱性介质促使酚酞显色，溶液瞬间变为鲜艳粉红色/红色',
      stepTitle: '滴加无色酚酞试液 (变红)',
    }
  }

  // ── 通用兜底安全保护 ──
  return {
    fillLevel: dropCount === 1 ? 0.52 : 0.68,
    fillColor: baseColor,
    hasPrecipitate: false,
    precipitateLevel: 0,
    precipitateColor: '#ffffff',
    hasGas: false,
    litmusChange: false,
    annotation: `滴加 ${dropCount === 1 ? '少量' : '过量'} 试剂：反应进行`,
    stepTitle: dropCount === 1 ? '阶段 1/2：滴加少量试剂' : '阶段 2/2：继续滴加过量',
  }
}