# 化学演示项目工程日志

## 当前周期

- 当前日期：2026-W48（11-27）
- 当前里程碑：M2 高考母题与规范治理收口
- 提交流程：[CHECKLIST.md](./CHECKLIST.md)

## 最近变更摘要

| 日期 | 模块 | 类型 | 变更 |
|------|------|------|------|
| 11-27 | docs/scripts | docs/chore | 移除过期 `.codebase-memory/` 与 MCP 配置，重写 Trae 项目记忆，校准 `FORMATTING_POLICY` / `TODO_deferred` / `ARCHITECTURE_RULES` / `08_THREE_PANEL_RULES` 与 `check-large-files` 豁免名单 |
| 11-24 | quiz/all-features | fix/test/refactor | 全库学科正确性校准与防剧透收口：判分卡归一化+关键词分组、题库 placeholder 去答案、GaokaoDiagram 非解析态隐藏结论、`gaokaoModels` 知识点双向联动、Avogadro/电解/晶体/VSEPR/滴定计算修正、工业流程动画拆分为 `useFlowAnimationPhase`、`isIndicative` 示意量级标注；新增 9 个守门测试 |
| 11-18 | docs/scripts | docs/refactor | 规范、记忆与门禁一致性收口：统一 AGENTS/project_rules/docs/SKILL 口径、移除失效引用与错误骨架、补齐 `COMPONENT_REGISTRY`、升级 `check-font-size.mjs` 与新增 `check-theme-import.mjs`、归档根目录过程报告至 `docs/reports/`、移除 `.prettierrc` |
| 11-17 | chemistry | fix | 全库高中化学合规性修复、移除伪真题署名并校准测试与 SKILL 规范（`0a45697`） |
| 10-10 | 3d/lint | refactor/style | 统一 `WebGLFallback` 降级边框 `framed` 开关、补齐 8/8 场景 WebGL 降级守卫测试、增强 `check-code-style.mjs` |
| 09-15 | valence-matrix | fix | 专题一价类二维图化学符合性修复：P1 修正 `Na₂O₂` 阴阳离子数比口径；P2 降级 10 种非核心元素并同步题库表述 |
| 09-15 | inorganic-ion-matrix | feature/fix | 专题二离子共存互斥矩阵修复与扩展：P0 修正 `Al³⁺+F⁻` 等冲突项，P1 新增 `complex` 分类与三元陷阱，P2 增补 `PO₄³⁻`（14阳×19阴=266格） |
| 09-14 | docs | docs | 归档高中化学符合性审查/修复报告至 `docs/reports/` |
| 09-03 | ci | fix | 修复 GitHub CI oxlint 零警告门禁失败 |
| 08-05 | chemistry/titration | feature | 新增 6 个化学装置组件与 `titration-error-purity` 高考母题专题 |
| 07-19 | project | init | 项目规范框架建立与目录结构初始化 |

## 日志记录规范

1. **按需精简记录**：主文件保留最近 10–20 条重大里程碑/跨模块架构变更，不再强制每次普通提交更新。
2. **变更分类**：`feature/refactor/fix/test/docs/style/compliance`
3. **格式压缩**：每条一行摘要，附关键模块与提交/验收说明。

## 提交流程

参见 [CHECKLIST.md](./CHECKLIST.md)。
