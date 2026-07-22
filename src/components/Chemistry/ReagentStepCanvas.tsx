import { useState } from 'react'
import { FlaskConical, ArrowRight, RotateCcw } from 'lucide-react'

export function ReagentStepCanvas() {
  const [step, setStep] = useState(0)

  const stepsInfo = [
    {
      title: '初始状态：滴加少量 NaOH 溶液',
      description: 'Fe²⁺ 与 OH⁻ 结合，生成白色絮状沉淀 Fe(OH)₂。',
      precipitateColor: 'bg-white border-slate-300',
      precipitateText: '白色沉淀 Fe(OH)₂',
      solutionColor: 'bg-sky-50',
      equation: 'Fe²⁺ + 2OH⁻ = Fe(OH)₂↓ (白色)',
    },
    {
      title: '第二阶段：暴露在空气中氧化',
      description: 'Fe(OH)₂ 吸收空气中的 O₂ 和 H₂O，沉淀迅速转变为灰绿色。',
      precipitateColor: 'bg-emerald-600/40 border-emerald-600',
      precipitateText: '灰绿色沉淀',
      solutionColor: 'bg-emerald-50/30',
      equation: '4Fe(OH)₂ + O₂ + 2H₂O = 4Fe(OH)₃',
    },
    {
      title: '最终阶段：完全氧化为红褐色沉淀',
      description: '最终完全氧化生成红褐色的氢氧化铁 Fe(OH)₃ 沉淀。',
      precipitateColor: 'bg-amber-800 border-amber-900',
      precipitateText: '红褐色沉淀 Fe(OH)₃',
      solutionColor: 'bg-amber-100/40',
      equation: '4Fe(OH)₂ + O₂ + 2H₂O = 4Fe(OH)₃↓ (红褐色)',
    },
  ]

  const current = stepsInfo[step]

  return (
    <div className="w-full h-full p-4 bg-white/90 rounded-xl border border-slate-200 backdrop-blur flex flex-col gap-4">
      {/* 头部标题 */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-800 text-base">试剂滴加与沉淀变色演练工具</h3>
        </div>
        <button
          onClick={() => setStep(0)}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded"
        >
          <RotateCcw className="w-3.5 h-3.5" /> 重置演练
        </button>
      </div>

      {/* 烧杯演练场景 */}
      <div className="flex-1 flex items-center justify-center bg-slate-50/60 rounded-lg p-6 relative border border-slate-100 overflow-hidden">
        {/* 烧杯 SVG / Div 渲染 */}
        <div className="w-48 h-64 border-b-4 border-l-2 border-r-2 border-slate-400 rounded-b-xl relative flex flex-col justify-end p-2 bg-white/50 shadow-sm">
          {/* 刻度线 */}
          <div className="absolute left-2 top-8 text-[9px] text-slate-400 font-mono flex flex-col gap-4">
            <span>- 150ml</span>
            <span>- 100ml</span>
            <span>- 50ml</span>
          </div>

          {/* 溶液液体 */}
          <div className={`w-full h-40 rounded-b-lg transition-colors duration-700 ${current.solutionColor} relative flex items-end justify-center overflow-hidden`}>
            {/* 沉淀层 */}
            <div className={`w-36 h-16 rounded-b-lg border-t transition-all duration-700 flex items-center justify-center text-xs font-bold ${current.precipitateColor} text-slate-800 shadow-md animate-pulse`}>
              <span className="bg-white/80 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                {current.precipitateText}
              </span>
            </div>
          </div>
        </div>

        {/* 步骤控制浮动卡 */}
        <div className="absolute right-4 top-4 bottom-4 w-64 bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              步骤 {step + 1} / {stepsInfo.length}
            </span>
            <h4 className="font-bold text-sm text-slate-800 mt-2">{current.title}</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{current.description}</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-200 text-slate-800">
              {current.equation}
            </div>
            <button
              onClick={() => setStep((step + 1) % stepsInfo.length)}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              下一步：继续反应 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
