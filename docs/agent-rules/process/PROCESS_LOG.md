# 化学演示项目工程日志

## 当前周期

- 当前日期：2026-W32（08-05）
- 当前里程碑：M1 项目初始化
- 提交流程：[CHECKLIST.md](./CHECKLIST.md)

## 最近变更摘要

| 日期 | 模块 | 类型 | 变更 |
|------|------|------|------|
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
