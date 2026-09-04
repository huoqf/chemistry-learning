import type { StepChemistryState } from './IonMatrixChemistry'

/** 14 种核心阳离子连续滴加真实化学相变计算（内聚金属显色、沉淀与焰色机理） */
export function computeCationStepChemistry(
  ionId: string,
  reagentId: string,
  dropCount: number,
  baseColor: string
): StepChemistryState | null {
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
  return null
}
