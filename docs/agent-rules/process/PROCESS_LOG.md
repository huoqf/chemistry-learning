# 化学演示项目工程日志

## 当前周期

- 当前日期：2026-W32（08-05）
- 当前里程碑：M1 项目初始化
- 提交流程：[CHECKLIST.md](./CHECKLIST.md)

## 最近变更摘要

| 日期 | 模块 | 类型 | 变更 |
|------|------|------|------|
| 09-15 | valence-matrix | fix | 专题一价类二维图化学符合性修复：P1 修正 Na₂O₂ 阴阳离子数比口径统一为阳:阴=2:1；P2 将 B/As/Se/Be/Ga/Ge/Sb/Bi/Mo/W 10 种偏学术元素降级 isCoreGaokao=false 并按 30核心/10拓展 断言；统一阿伏伽德罗组件与题库(model-avogadro/flash-cards)同源 Na₂O₂ 表述 |
| 09-15 | inorganic-ion-matrix | feature/fix | 专题二离子共存互斥矩阵化学符合性修复与扩展：P0 修正 Al³⁺+F⁻ 络合共存、软化 Ca²⁺+AlO₂⁻ 争议项、Ba²⁺+F⁻/S₂O₃²⁻ 标注微溶条件；P1 新增 complex 络合分类基础设施与 MnO₄⁻(H⁺)+Cl⁻ 酸性氧化三元陷阱；P2 增补 PO₄³⁻ 矩阵维度(14阳×19阴=266格)、检验档案(ION_DATA 19阴/33离子)，同步修正 truth-auditor 锁沉淀测试 |
| 09-14 | docs | docs | 归档高中化学符合性审查/修复报告至 docs/reports/，作为合规性审查与修复的永久文档记录 |
| 09-03 | ci | fix | 修复 GitHub CI oxlint 零警告门禁失败：清理 12 条违规（正则多余转义、useMemo 多余依赖、Fast Refresh only-export-components）；computeStepChemistry 从组件文件抽离至 IonMatrixChemistry.ts |
| 08-05 | chemistry/titration | feature | 新增 6 个化学装置组件（AntiSiphonFunnel/Crucible/GasBurette/GasWashingBottle/RefluxCondenser/SeparatoryFunnelSetup）+ titration-error-purity 高考母题专题整套；更新现有装置 ports、ExtractionScene 改用装配体；新增测试与文档 |
| 07-19 | project | init | 项目规范框架建立：project_rules / AGENTS / SKILL / docs 全套 |
| 07-19 | project | init | 化学项目目录结构初始化 |

## 日志记录规范

1. **主文件瘦身**：仅保留当前周索引 + 最近 10-20 条摘要
2. **按周归档**：详细记录存入 ./logs/YYYY-Wxx.md
3. **变更分类**：feature/refactor/fix/test/docs/style/compliance
4. **格式压缩**：每条 <= 6 bullet + 1 行涉及文件 + 1 行验证命令

## 提交流程

参见 [CHECKLIST.md](./CHECKLIST.md)。
