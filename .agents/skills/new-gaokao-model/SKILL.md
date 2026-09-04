---
name: new-gaokao-model
description: >
  新建高考解题母题 / 创建记忆矩阵探究页面 / 新增双对比解题模型 /
  重构高考母题页面 / 注册高考解题平行节点 / 新增高考提分模块 /
  create gaokao master model / add memory matrix / new exam tool page
---

# 高考解题母题与记忆强化矩阵 Skill

> 本 Skill 适用于高考专属提分工具（路由 `/gaokao-tool/:id`）的新建、重构与更新。
> 核心原则：**按需读取规则资源 ➔ 按内容选择 Preset ➔ 锁定设计分辨率 ➔ 调基座组件与坐标变换 Hook 实现精准自适应**。

---

## 1. 前置必读资源 (Context On-Demand)

在开始创建或重构高考解题母题页面前，必须读取以下规则与组件索引文件：

1. [08_THREE_PANEL_RULES.md](file:///d:/code/chemistry-learning/docs/agent-rules/ui/08_THREE_PANEL_RULES.md) — 三屏职责划分与顶栏 Header 规范
2. [07_CANVAS_SVG_CHART_RULES.md](file:///d:/code/chemistry-learning/docs/agent-rules/ui/07_CANVAS_SVG_CHART_RULES.md) — 预设 Preset 分辨率尺寸账本与画布背景规范
3. [COMPONENT_REGISTRY.md](file:///d:/code/chemistry-learning/docs/agent-rules/ui/COMPONENT_REGISTRY.md) — 全量 44+ 可复用 UI 与化学器材组件注册表

---

## 2. 标准架构与代码闭环示范

每一个高考解题母题/记忆矩阵页面（`XxxCanvas.tsx`）必须遵循下述标准的组件调度与自适应坐标变换闭环：

```tsx
import React, { useState } from 'react'
import { ThreePanel, AnimationSvgCanvas } from '@/components/Layout'
import {
  GaokaoToolHeader,
  LeftPanel,
  LeftPanelSection,
  ParamControl,
  ScoringCardSection,
  GaokaoVariantQuiz,
} from '@/components/UI'
import { ChemistryVectorArrow } from '@/components/Chemistry'
import { useAnimationViewport, useSceneScale } from '@/hooks'
import { CANVAS_PRESETS, CHEMISTRY_COLORS } from '@/theme'
import { worldToDesign } from '@/scene'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz'

export const XxxCanvas: React.FC = () => {
  const modelId = 'model-xxx'
  const model = getGaokaoModel(modelId)
  const quizData = getModelQuizData(modelId)

  // 视角模式 (0: 图谱探究 | 1: 规范踩分 | 2: 真题研析)
  const [viewMode, setViewMode] = useState<number>(0)

  // 1. 根据化学内容选择 Preset（非预先推荐，纯内容驱动）：
  // - 纯 3D/晶体/结构/全景: CANVAS_PRESETS.full (840x650)
  // - 对称容器+对照图: CANVAS_PRESETS.splitH (420x650 + 420x650)
  // - 装置区+宽幅时序图表: CANVAS_PRESETS.splitHw (280x650 + 560x650)
  // - 旋转/正方形对称: CANVAS_PRESETS.square (650x650)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitHw,
  })

  // 2. 比例尺与设计分辨率计算
  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.splitHw,
    anchor: 'center',
  })

  // 3. 将物理逻辑坐标精确变换为设计像素坐标，保障多设备/DPR 下矢量与标注 100% 零偏移
  const targetPos = worldToDesign({ x: 1.5, y: 2.0 }, sceneScale)

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 4. 必须直接使用 GaokaoToolHeader 渲染统一 Header 导航与右侧视角 Tabs */}
      <GaokaoToolHeader
        modelId={modelId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

        <ThreePanel
          left={
            <LeftPanel>
              <LeftPanelSection title="参数调控">
                {/* 必须使用 ParamControl 滑块组件 */}
              </LeftPanelSection>
            </LeftPanel>
          }
          center={
            <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50">
              {viewMode === 0 && (
                // 中屏自适应 SVG 画布（透出 Theme 背景，绝对不加深色/杂色 div）
                <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
                  <ChemistryVectorArrow
                    x1={0}
                    y1={0}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    label="c = 0.1 mol/L"
                    fontSize={canvasSize.font(12)}
                  />
                </AnimationSvgCanvas>
              )}

              {viewMode === 1 && quizData && (
                <div className="w-full max-w-4xl mx-auto py-4 overflow-y-auto">
                  <ScoringCardSection steps={quizData.scoringSteps} />
                </div>
              )}

              {viewMode === 2 && quizData && (
                <div className="w-full max-w-4xl mx-auto py-4 overflow-y-auto">
                  <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
                </div>
              )}
            </div>
          }
          right={
            <div className="w-full h-full p-4 bg-white overflow-y-auto">
              {/* 右屏统一展示化学量、公式与高考要点 */}
            </div>
          }
        />
      </div>
    </div>
  )
}
```

---

## 3. 按需调用的组件与 Hook 调度映射表

开发或重构高考母题页面时，按照下表直接从现有的组件库与工具函数中按需调用：

| 页面层级/需求 | 必须调用的现成资源 | 导入路径 | 职责与效果 |
|---|---|---|---|
| **页面顶栏** | `<GaokaoToolHeader>` | `@/components/UI` | 渲染统一黑金 Header 与 `[图谱探究] [规范踩分] [真题研析]` 视角 Tabs。禁止手写 Header。 |
| **页面三栏基座** | `<ThreePanel>` | `@/components/Layout` | 响应式三栏承载容器。 |
| **画布自适应 Viewport** | `useAnimationViewport` | `@/hooks` | 传入内容决定的 Preset，自动计算 `containerRef`, `canvasSize.font`, `vp.transform`。 |
| **坐标转换与缩放** | `useSceneScale` + `worldToDesign` | `@/hooks` / `@/scene` | 将逻辑坐标转换为设计像素，保证图形与标注**在任何屏幕设备/DPR 下零偏移、鼠标交互坐标精准**。 |
| **中屏 SVG 画布** | `<AnimationSvgCanvas>` | `@/components/Layout` | 中屏只放 SVG 场景与矢量图表，**外层绝对严禁包裹深色/杂色 `div`**。 |
| **矢量箭头与标注** | `<ChemistryVectorArrow>` / `<VectorArrow>` | `@/components/Chemistry` | 绘制精准矢量箭头，结合 `canvasSize.font(N)` 进行字号自适应。 |
| **视角 1 踩分卡** | `<ScoringCardSection>` | `@/components/UI` | `viewMode 1` 时在 DOM 层渲染高考踩分步骤。 |
| **视角 2 真题变式** | `<GaokaoVariantQuiz>` | `@/components/UI` | `viewMode 2` 时在 DOM 层渲染压轴真题与变式。 |
| **左屏控制面板** | `<LeftPanel>` / `<LeftPanelSection>` / `<ParamControl>` | `@/components/UI` | 声明式组件控制，禁止手写原生的 `<input type="range">` 或散乱按钮。 |

---

## 4. 左屏与右屏深度联动设计规范（避免教条）

### 4.1 左屏标题纯粹性与教学提示说明定位
- **标题与选项按钮保持纯粹干净（严禁在标题上乱搞）**：
  - 选项卡片与模式切换按钮仅承担**核心标识与动作选择**功能，大标题必须干脆有力；
  - **禁止在标题下方硬塞晦涩次级副标题**（如生涩化学名、长串分子式等无感说明）；
  - **禁止在标题或按钮前堆砌装饰性 emoji 或散乱小图标**（如 📚 🧩 📊 📑 🔍 等），保持学术界面的沉稳现代。
- **教学提示说明的规范归宿（有必要时在下方结构化呈现）**：
  - **使用原则**：因地制宜，避免教条。仅在需要向学生交代特定反应前提或启发思考时使用；
  - **位置**：统一置于左屏底部独立卡片 `LeftPanelSection title="教学思考与探究提示"`；
  - **结构化三要素**：
    1. **实验与反应条件**：说明强酸/强碱、加热、常温中和等物理化学前提；
    2. **核心设问与思考**：提出关键启发性设问（如断键位置、定量关系为何不同）；
    3. **观察指引**：引导学生观察中屏微观/定量加法拆解，并在右屏核对标准高考方程式与避坑要点。

### 4.2 右屏动态同步与高中化学真理合规双铁律（见 08_THREE_PANEL_RULES.md 3.4）
1. **模式动态强绑定（杜绝无关干扰）**：
   - 右屏化学量、公式、考点、警示必须由当前选项（`mode` / `tab` / `system`）通过**模式字典映射**纯函数生成，严禁无模式条件的全局静态大数组；
   - **物理量条件守卫**：无产气隐藏气量，无固相变化隐藏增重，严禁显示 `0 L`、`0 g` 等无效占位。
2. **高中化学学科真理与新高考对标**：
   - **教材边界**：严格以高中必修+选择性必修教材为事实源，严禁引入大学物理化学超纲展开；
   - **反应式与介质**：酸性介质补 H⁺，碱性介质补 OH⁻，水溶液严禁出现自由 O²⁻；严格配平原子与电荷；
   - **高考解题闭环**：公式必须采用高考标准守恒式（如法拉第电子守恒链、勒夏特列商商对比），考点与警示直接切中真题采分点与丢分陷阱；
   - **单容器流**：右屏统一使用垂直流呈现（化学量 ➔ 公式 ➔ 高考要点 ➔ 易错警示），取消生硬嵌套 Tab。

---

## 5. 职责拆分与题库数据质量铁律

### 5.1 高考真题与变式题质量铁律（原文 + 客观原图 + 默认隐藏解题线索）
1. **题干与答案原文一致性**：`contextDescription`、`questionText` 与选项/答案描述必须与高考官方原题完全一致，不得随意删除、简化或改写条件，保障试题逻辑严谨性。
2. **客观配图还原**：变式题插图必须是考生在高考考场上看到的**官方客观原图高保真复现**。
3. **解题线索默认隐蔽**：默认插图与题干视图中，**绝对严禁直接标注解题切口（如剪刀切断线 ✂）、答案提示文本、加成取向箭头或归中反应结论**。所有的机理剖析、断键取向与答案推导，**必须且只能放置在“盲盒解密 / 详解分析”折叠卡展开后呈现**，保障考场真实刷题探究体验。

### 5.2 职责拆分与数据注册
复杂母题按**单一职责**拆分：
1. `types.ts`：数据接口
2. `hooks/useXxxChemistry.ts`：纯化学计算 Hook（零 JSX，零副作用）
3. `components/XxxLeftPanel.tsx`：左屏 UI
4. `components/XxxCenterView.tsx`：中屏 DOM 层平级条件切换
5. `components/XxxRightPanel.tsx`：右屏数据/公式/考点展示
6. `XxxCanvas.tsx`：ThreePanel 入口组装

数据注册：
- 在 `src/data/gaokaoModels.ts` 注册母题元数据。
- 在 `src/data/quiz/<model-id>.ts` 新建题库数据并在 `src/data/quiz/index.ts` 中注册 `modelQuizMap`。
- 在 `src/pages/GaokaoToolPage.tsx` 中注册路由分发。

---

## 6. 验收标准
- [ ] 运行 `npx tsc --noEmit` 0 错误；
- [ ] 运行 `npm run test:run` 全量单元测试 100% 通过；
- [ ] 编写或通过专属 `<topic>TruthAuditor.test.ts` 学科真理守门测试（核验方程式配平、守恒计算与模式隔离）；
- [ ] 检查左屏无晦涩子标题与多余 emoji，底部在需要时包含清晰的反应条件与核心设问；
- [ ] 检查右屏四大区块 100% 与左屏当前选项动态同步，无任何上一模式的残留内容或无效 `0` 值。
