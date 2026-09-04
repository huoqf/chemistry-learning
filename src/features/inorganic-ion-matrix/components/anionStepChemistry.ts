import type { StepChemistryState } from './IonMatrixChemistry'

/** 18 种核心阴离子连续滴加真实化学相变计算（内聚酸根与卤素置换、沉淀与产气机理） */
export function computeAnionStepChemistry(
  ionId: string,
  reagentId: string,
  dropCount: number,
  baseColor: string
): StepChemistryState | null {
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
  return null
}
