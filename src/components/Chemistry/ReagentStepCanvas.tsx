import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ReagentStepAnimation } from '@/features/experiment/reagent-step'
import { getGaokaoModel } from '@/data/gaokaoModels'

/**
 * ReagentStepCanvas 桥接与全屏母题主容器
 * 在高考工具路由 /gaokao-tool/model-reagent-step 下渲染全屏 ThreePanel 架构
 */
export function ReagentStepCanvas() {
  const navigate = useNavigate()
  const model = getGaokaoModel('model-reagent-step')

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden">
      {/* 顶部 Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            返回高考母题索引
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{model?.title ?? '试剂滴加与沉淀变色演练工具'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${model?.badgeColor ?? 'bg-amber-100 text-amber-800'}`}>
                {model?.badgeText ?? '试剂滴加'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{model?.subtitle ?? '沉淀生成/溶解与颜色演变演练'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            高考提分专属交互母题工具
          </span>
        </div>
      </div>

      {/* 完整 ThreePanel 三栏区域 */}
      <div className="flex-1 overflow-hidden">
        <ReagentStepAnimation />
      </div>
    </div>
  )
}
