import { describe, it, expect } from 'vitest'
import { ION_DATA } from '../constants'
import { MAIN_GROUP_CONFLICTS } from '../data/conflicts/mainGroupConflicts'
import { TRANSITION_METAL_CONFLICTS } from '../data/conflicts/transitionMetalConflicts'

/**
 * inorganicChemistryTruthAuditor.test.ts
 *
 * 高中化学真理性与新高考命题合规性自动化守门测试套件
 * 严格覆盖：
 * 1. 试剂特异性与排他性（杜绝自身氧化还原干扰，如铜片+浓硫酸错误）
 * 2. 离子方程式高考阅卷规范（水合氨分子表达、沉淀气体符号、勒夏特列可逆号）
 * 3. 实验大题“四步标准化答题模板”（取样、加试剂、现象、结论）
 * 4. 共存互斥矩阵分类严密性（沉淀/氧化还原/双水解/酸性介质陷阱分类准确性）
 * 5. 教材超纲词与误导词拦截（如亚硝酸根淡蓝色、非说明的大学试剂等）
 */
describe('无机离子与共存互斥矩阵 — 新高考化学真理性自动化守门审计', () => {
  describe('1. 试剂特异性与氧化还原介质铁律', () => {
    it('NO₃⁻ 检验试剂严禁使用浓硫酸，必须使用稀硫酸提供 H⁺', () => {
      const no3 = ION_DATA.find((i) => i.id === 'NO3-')
      expect(no3).toBeDefined()
      expect(no3?.testReagent).toContain('稀硫酸')
      expect(no3?.testReagent).not.toContain('浓硫酸')

      const optimal = no3?.reagentOptions.find((r) => r.isOptimal)
      expect(optimal?.name).toContain('稀硫酸')
      expect(optimal?.name).not.toContain('浓硫酸')
      expect(optimal?.feedback).toMatch(/稀硫酸|酸性条件/)
    })

    it('中性环境下 NO₃⁻ 严禁显示强氧化性', () => {
      const no3 = ION_DATA.find((i) => i.id === 'NO3-')
      const neutralTrap = no3?.reagentOptions.find((r) => r.id === 'no3-cu-only')
      expect(neutralTrap).toBeDefined()
      expect(neutralTrap?.isOptimal).toBe(false)
      expect(neutralTrap?.feedback).toMatch(/中性.*不显氧化性|必须在 H⁺/)
    })

    it('Fe²⁺ 检验必须包含“先加 KSCN 排除 Fe³⁺，后加氧化剂”的严谨先后次序', () => {
      const fe2 = ION_DATA.find((i) => i.id === 'Fe2+')
      expect(fe2).toBeDefined()
      expect(fe2?.standardProcedure).toMatch(/先.*KSCN.*(无明显|不变).*再.*(氯水|H₂O₂|双氧水)/)
      const optimal = fe2?.reagentOptions.find((r) => r.isOptimal)
      expect(optimal?.name).toContain('KSCN')
      expect(optimal?.name).toMatch(/氯水|氧化剂/)
      const trap = fe2?.reagentOptions.find((r) => r.id === 'fe2-kscn-only')
      expect(trap?.isOptimal).toBe(false)
    })
  })

  describe('2. 离子方程式书写与教材规范铁律', () => {
    it('氨水体系生成银氨配离子的方程式中，反应物必须规范书写为 NH₃·H₂O 且两边守恒', () => {
      const ag = ION_DATA.find((i) => i.id === 'Ag+')
      expect(ag).toBeDefined()
      // 严禁出现未配平的 AgCl + 2NH3 = [Ag(NH3)2]+ + Cl-
      expect(ag?.testEquation).toMatch(/NH_3\\cdot H_2O/)
      expect(ag?.testEquation).toContain('2H_2O')
    })

    it('Fe³⁺ 与 SCN⁻ 显色反应必须保留教材原版可逆平衡符号 ⇌', () => {
      const fe3 = ION_DATA.find((i) => i.id === 'Fe3+')
      expect(fe3).toBeDefined()
      expect(fe3?.testEquation).toContain('\\rightleftharpoons')
    })

    it('S₂O₃²⁻ 歧化产物必须包含沉淀号与气体号', () => {
      const s2o3 = ION_DATA.find((i) => i.id === 'S2O32-')
      expect(s2o3).toBeDefined()
      expect(s2o3?.testEquation).toContain('S\\downarrow')
      expect(s2o3?.testEquation).toContain('SO_2\\uparrow')
    })
  })

  describe('3. 高考实验大题“四步标准化模板”守门', () => {
    it('所有离子的 standardProcedure 必须包含取样、试剂操作、特征现象、结论四要素', () => {
      ION_DATA.forEach((ion) => {
        const text = ion.standardProcedure
        expect(text, `离子 [${ion.id}] 规范答题必须包含取样说明`).toMatch(/取.*(样|液|少量)/)
        expect(text, `离子 [${ion.id}] 规范答题必须包含试剂加入或试验操作`).toMatch(/加|滴|通入|蘸取|灼烧/)
        expect(text, `离子 [${ion.id}] 规范答题必须包含现象描述`).toMatch(/若|出现|生成|产生|变|观察|呈|闻到|气味/)
        expect(text, `离子 [${ion.id}] 规范答题必须包含证明结论`).toMatch(/证明.*含/)
      })
    })

    it('现象描述严禁出现违背高中阅卷标准的超纲或主观词', () => {
      const no2 = ION_DATA.find((i) => i.id === 'NO2-')
      // 亚硝酸根严禁在高中现象中描述为淡蓝色溶液
      expect(no2?.testPhenomenon).not.toContain('淡蓝色')
      no2?.reagentOptions.forEach((opt) => {
        expect(opt.phenomenon).not.toContain('淡蓝色')
      })

      const ch3coo = ION_DATA.find((i) => i.id === 'CH3COO-')
      // 醋酸根加三价铁常温下为深红色溶液，严禁误导为红褐色沉淀
      expect(ch3coo?.testPhenomenon).not.toMatch(/FeCl.*红褐色沉淀/)
      expect(ch3coo?.testPhenomenon).toMatch(/FeCl.*(深红|配合物)/)
    })
  })

  describe('4. 离子共存互斥矩阵分类与化学准确性守门', () => {
    const allConflicts = { ...MAIN_GROUP_CONFLICTS, ...TRANSITION_METAL_CONFLICTS }

    it('所有 conflict 项必须具备明确的高考互斥分类与化学反应方程式/机理解释', () => {
      Object.entries(allConflicts).forEach(([pairKey, cell]) => {
        if (cell.status === 'conflict') {
          expect(cell.category, `[${pairKey}] 互斥必须拥有分类且不能为 none`).not.toBe('none')
          expect(cell.reason.length, `[${pairKey}] 互斥必须给出详尽化学原因`).toBeGreaterThanOrEqual(4)
        }
      })
    })

    it('Al³⁺ 与 F⁻ 反应必须归入沉淀分类 precipitate 并生成 AlF₃↓', () => {
      const alF = MAIN_GROUP_CONFLICTS['Al3+:F-']
      expect(alF).toBeDefined()
      expect(alF.status).toBe('conflict')
      expect(alF.category).toBe('precipitate')
      expect(alF.equation).toContain('AlF_3\\downarrow')
    })

    it('酸性介质诱发的氧化还原陷阱必须标记为 acid-medium-trap 或 redox', () => {
      // 遍历所有含硝酸根在酸性下的互斥反应
      const acidTraps = Object.values(allConflicts).filter(
        (c) => c.category === 'acid-medium-trap'
      )
      expect(acidTraps.length).toBeGreaterThan(0)
      acidTraps.forEach((trap) => {
        expect(trap.reason).toMatch(/酸性|H⁺|氧化/)
      })
    })

    it('Al³⁺ 与弱酸根的剧烈双水解必须生成氢氧化铝沉淀与气体/弱酸', () => {
      const alHco3 = MAIN_GROUP_CONFLICTS['Al3+:HCO3-']
      expect(alHco3.status).toBe('conflict')
      expect(alHco3.category).toBe('double-hydrolysis')
      expect(alHco3.equation).toContain('Al(OH)_3\\downarrow')
      expect(alHco3.equation).toContain('CO_2\\uparrow')

      const alAlO2 = MAIN_GROUP_CONFLICTS['Al3+:AlO2-']
      expect(alAlO2.status).toBe('conflict')
      expect(alAlO2.category).toBe('double-hydrolysis')
      expect(alAlO2.equation).toContain('Al(OH)_3\\downarrow')
    })
  })
})
