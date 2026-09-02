/**
 * src/features/industrial-flow/components/IndustrialFlowGuideModal.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 高考题型剖析、解题思路与工具用法导学弹窗
 */

import React, { useState } from 'react'
import {
  X,
  BookOpen,
  Compass,
  MousePointerClick,
  ArrowRight,
  Zap,
} from 'lucide-react'

interface IndustrialFlowGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'exam-types' | 'solving-strategy' | 'how-to-use'

export const IndustrialFlowGuideModal: React.FC<IndustrialFlowGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('exam-types')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* 顶部 Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  无机工艺流程大题 · 备考导学与工具使用手册
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-medium">
                  高考 14~15 分压轴题突破
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                搞懂高考怎么考、标准解题步骤是什么、如何利用本工具把微观机理与答题得分点彻底吃透
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 标签栏 Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50/80 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('exam-types')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'exam-types'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            1. 高考考什么？（4类核心设问）
          </button>

          <button
            onClick={() => setActiveTab('solving-strategy')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'solving-strategy'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            2. 整体怎么破？（“三线四步”解题模型）
          </button>

          <button
            onClick={() => setActiveTab('how-to-use')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'how-to-use'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MousePointerClick className="w-4 h-4" />
            3. 本工具怎么用？（4步互动探究玩法）
          </button>
        </div>

        {/* 主体滚动区 */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700 space-y-6">
          {/* TAB 1: 高考考什么 */}
          {activeTab === 'exam-types' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                <span className="font-bold">【高考命题背景】：</span>
                工业流程题通常以<strong>矿石冶炼、工业废渣资源化利用（如软锰矿、铜锌渣）、退役锂电池回收、高盐卤水提取</strong>等为情境，
                考查将复杂多组分混合物中的目标金属离子提纯分离。全题看似繁杂，但核心命题落脚点全部高度固定在以下 4 大工序设问中：
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. 预处理与浸出 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-shadow shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h4 className="font-bold text-xs text-slate-800">
                      原料预处理与酸浸设问
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>
                      <strong className="text-slate-800">高频设问：</strong>
                      “写出还原酸浸反应式”、“提高浸出速率/浸出率的措施有哪些？”
                    </li>
                    <li>
                      <strong className="text-slate-800">解题核心：</strong>
                      难溶的 +4 价 MnO₂ 或高价钴不能直接酸溶，必须加入还原剂（如 Fe²⁺、草酸或 H₂O₂）将其还原为可溶低价阳离子。
                    </li>
                    <li>
                      <strong className="text-slate-800">满分模板：</strong>
                      粉碎矿石增大接触面积、适当升高浸出温度、充分搅拌、适当增大酸浓度。
                    </li>
                  </ul>
                </div>

                {/* 2. 氧化调价除杂 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-shadow shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h4 className="font-bold text-xs text-slate-800">
                      氧化调价设问（除铁核心考点）
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>
                      <strong className="text-slate-800">必考设问：</strong>
                      “为什么在调 pH 沉淀前必须加入足量 H₂O₂？”
                    </li>
                    <li>
                      <strong className="text-slate-800">踩分本质：</strong>
                      Fe²⁺ 沉淀完全需要 pH ≥ 9.0，而此时主产品离子（如 Mn²⁺, Zn²⁺）早已经开始沉淀，造成严重<strong>共沉淀损失</strong>；氧化成 Fe³⁺ 后在 pH 3.2 即可沉淀完全，拉开安全分离窗口。
                    </li>
                    <li>
                      <strong className="text-slate-800">绿色评价：</strong>
                      H₂O₂ 作氧化剂的优点：氧化产物是水，绿色环保且<strong>不引入新杂质</strong>。
                    </li>
                  </ul>
                </div>

                {/* 3. 调 pH 沉淀与 Ksp 计算 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-shadow shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h4 className="font-bold text-xs text-slate-800">
                      调 pH 沉淀除杂与 Ksp 定量计算
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>
                      <strong className="text-slate-800">试剂设问：</strong>
                      为什么选用 MnO（或 ZnO, MgO）而不选用 NaOH？
                    </li>
                    <li>
                      <strong className="text-slate-800">踩分要点：</strong>
                      MnO 能与 H⁺ 反应耗酸升高 pH，引入的阳离子即为主产品离子，<strong>不增添新杂质</strong>；且难溶氧化物具有“自限性”，不会导致局部过碱引发 Al(OH)₃ 两性反溶。
                    </li>
                    <li>
                      <strong className="text-slate-800">计算下限与上限：</strong>
                      下限：杂质离子沉淀完全点（高考硬性规定残余浓度 c ≤ 10⁻⁵ mol/L）；上限：主目标阳离子开始沉淀析出点。
                    </li>
                  </ul>
                </div>

                {/* 4. 结晶分离与洗涤 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-shadow shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <h4 className="font-bold text-xs text-slate-800">
                      分离提纯与洗涤规范
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>
                      <strong className="text-slate-800">结晶操作：</strong>
                      溶解度随温度升高显著增大的物质（如大部分金属硫酸盐）→ 蒸发浓缩、冷却结晶、过滤。
                    </li>
                    <li>
                      <strong className="text-slate-800">无水乙醇洗涤三大目的：</strong>
                      ① 洗去晶体表面附着的可溶性杂质离子；② 减少晶体在水中的溶解损耗；③ 乙醇易挥发，便于晶体快速干燥。
                    </li>
                    <li>
                      <strong className="text-slate-800">沉淀洗涤干净检验标准句：</strong>
                      取少许最后一次洗涤滤液于试管中 → 滴加检验试剂 → 若无明显沉淀生成 → 说明已洗净。
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 整体解题思路 */}
          {activeTab === 'solving-strategy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                面对一张布满方框和箭头的流程图，只要掌握<strong>“三线四步”思维模型</strong>，就能把复杂的流程拆解为清晰的流水线：
              </div>

              {/* 四步步骤条 */}
              <div className="space-y-3">
                <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    步1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      抓两头，识目标（确立主次元素）
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-normal">
                      • <strong>起点（原料）</strong>：看原料中含有哪些金属和非金属元素（例如：软锰矿含 Mn、杂质 Fe, Al, Si）。<br />
                      • <strong>终点（产品）</strong>：看最终要求制备的产品是什么（如高纯 MnSO₄·H₂O）。由此迅速明确目标金属是 Mn，待除杂质是 Fe, Al, Si。
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    步2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      走三线，判去向（主线、支线、试剂线）
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1.5 text-xs">
                      <div className="p-2 bg-blue-50/70 rounded-lg border border-blue-100">
                        <span className="font-bold text-blue-900">① 主线（主金属走向）：</span>
                        <p className="text-slate-600 mt-0.5">固态矿物 → 浸出液 → 净化液 → 析出结晶固体，紧盯主产物在各槽中的相态。</p>
                      </div>
                      <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-100">
                        <span className="font-bold text-amber-900">② 支线（渣与母液）：</span>
                        <p className="text-slate-600 mt-0.5">过滤滤渣1（SiO₂等酸浸渣）、过滤滤渣2（Fe(OH)₃, Al(OH)₃中和渣）、结晶滤液（母液循环利用）。</p>
                      </div>
                      <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-900">③ 试剂线（目的与机理）：</span>
                        <p className="text-slate-600 mt-0.5">每个方框箭头上方加入的试剂：是氧化？还原？调 pH？还是沉淀剂？必须遵循“不增新杂质”原则。</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    步3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      精计算，锁区间（利用 Ksp 定量推导）
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-normal">
                      根据题目给出的溶度积常数 Ksp：<br />
                      ① 当杂质 c(Fe³⁺) = 10⁻⁵ mol/L 时，由 c(OH⁻) 算出沉淀完全的 pH 下限；<br />
                      ② 结合主离子开始沉淀的 c(OH⁻) 算出耐受上限，从而锁定最佳除杂安全 pH 窗口（如 [4.7, 8.4]）。
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    步4
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      套规范，踩要点（防范化学术语失分）
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-normal">
                      将化学机理与高考试卷标准采分点无缝对接，避免因“口语化描述”、“漏写检验试剂”或“未提及洗涤干净标志”扣除关键步骤分。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 本工具怎么用 */}
          {activeTab === 'how-to-use' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
                本工具将高考中的死记硬背转变为<strong>“可触摸的交互探究”</strong>。你可以按照以下 4 步展开深度学习：
              </div>

              <div className="space-y-3">
                {/* 步骤 1 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-slate-900">
                      左屏顶部【选考题体系】
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      在左侧面板选择 5 套高考高频真实工业背景（如 <strong>Fe-Al-Mn 软锰矿</strong>、<strong>Fe-Cu-Zn 铜锌渣</strong>、<strong>Ni-Co-Li 退役锂电池</strong>等）。
                    </p>
                  </div>
                </div>

                {/* 步骤 2 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-slate-900">
                      中屏上方【点击方框槽体下钻微观机理】
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      中屏上半区展示高考规范的工艺流程方框图。<strong>直接点击方框中的 1~4 号槽体</strong>（酸浸槽 → 氧化槽 → 调pH槽 → 结晶槽）：
                      <br />
                      • 下半区会自动切换为该槽体的<strong>微观物理化学机理图表</strong>（酸浸动力学曲线、共沉淀柱状图、lg c-pH 曲线、溶解度曲线）；
                      <br />
                      • 右侧<strong>“元素走向矩阵”</strong>会精准标出此时各元素去向与沉淀状态。
                    </p>
                  </div>
                </div>

                {/* 步骤 3 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-slate-900">
                      左屏调控【沉浸式参数探究与试错】
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      • <strong>工序一</strong>：拖动温度滑块与矿石粉碎粒度，直观观察中屏动力学曲线的陡峭度与浸出率；<br />
                      • <strong>工序二</strong>：切换“投料充分”与“投料不足”，感受未完全氧化时 Fe²⁺ 沉淀 pH 过高引发的“共沉淀锁死”；<br />
                      • <strong>工序三（重点）</strong>：拖动 pH 滑块，看离子浓度沿理论曲线急剧下降。故意选择错误试剂（如选 NaOH），右下角会立即弹出【高考评价失分警告】；<br />
                      • <strong>工序四</strong>：选择无水乙醇洗涤与降温结晶，观察综合收率指标变化。
                    </p>
                  </div>
                </div>

                {/* 步骤 4 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-slate-900">
                      顶部切换【规范踩分】与【真题研析】
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      探究机理完成后，点击右上角 Tab：
                      <br />
                      • <strong>【规范踩分】</strong>：逐条查看高考评分细则与满分规范表达句式；
                      <br />
                      • <strong>【真题研析】</strong>：通过精选的经典官方高考真题进行巩固刷题与思路验证。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮栏 */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-600">
            随时可点击顶部导航栏右上角的 <strong>「解题指引与用法」</strong> 重新打开本手册
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              我知道了，开始互动探究
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
