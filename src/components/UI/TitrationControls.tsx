import React from 'react'
import { Play, Pause, RotateCcw, Droplet, PlusCircle } from 'lucide-react'

export interface TitrationControlsProps {
  volume: number // 当前滴加体积 (mL)
  maxVolume?: number // 最大滴加体积 (mL，默认 10)
  reagentName?: string // 试剂名称（如 '1.0 mol/L NaOH 溶液'）
  isPlaying: boolean
  onPlayPause: () => void
  onSingleDrop: () => void // 单滴微量 (+0.05 mL)
  onBulkAdd: () => void // 连续滴加 (+1.0 mL)
  onReset: () => void // 重新滴定
  onVolumeChange: (vol: number) => void // 直接调整体积
  steps?: { title: string; volume: number }[] // 特征节点快跳
  onJumpToStep?: (vol: number) => void
}

export const TitrationControls: React.FC<TitrationControlsProps> = ({
  volume,
  maxVolume = 10,
  reagentName = '1.0 mol/L NaOH 滴加试剂',
  isPlaying,
  onPlayPause,
  onSingleDrop,
  onBulkAdd,
  onReset,
  onVolumeChange,
  steps = [],
  onJumpToStep,
}) => {
  const dropsCount = Math.round(volume * 20) // 1 mL ≈ 20 滴
  const percentage = Math.min(100, Math.max(0, (volume / maxVolume) * 100))

  return (
    <div className="w-full bg-white rounded-xl shadow-xs border border-slate-200/90 p-2.5 flex flex-col gap-2 font-sans">
      {/* 顶部化学滴定数据与关键节点 */}
      <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-sky-500 fill-sky-500/20" />
            {reagentName}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-mono font-bold border border-sky-100">
            V = {volume.toFixed(2)} mL ({dropsCount} 滴)
          </span>
        </div>

        {/* 关键特征节点一键快跳按钮 */}
        {steps.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 font-medium mr-1">特征节点:</span>
            {steps.map((st, idx) => (
              <button
                key={idx}
                onClick={() => onJumpToStep?.(st.volume)}
                className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors font-mono"
                title={`跳转至 ${st.title}`}
              >
                {st.title.split('：')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 下部控制按键与滴加滑块 */}
      <div className="flex items-center gap-3">
        {/* 1. 自动滴定/暂停 */}
        <button
          onClick={onPlayPause}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all text-white shadow-2xs ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title={isPlaying ? '暂停滴加' : '连续自动滴加'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>暂停</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>自动滴下</span>
            </>
          )}
        </button>

        {/* 2. 单滴微量 (+0.05 mL / 1 滴) */}
        <button
          onClick={onSingleDrop}
          disabled={volume >= maxVolume}
          className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="微量挤压胶头滴管（+0.05 mL / 1 滴）"
        >
          <Droplet className="w-3.5 h-3.5 text-sky-600" />
          <span>+1 滴</span>
        </button>

        {/* 3. 连续滴加 (+1.0 mL) */}
        <button
          onClick={onBulkAdd}
          disabled={volume >= maxVolume}
          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="定量倾倒/滴定 (+1.0 mL)"
        >
          <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>+1.0 mL</span>
        </button>

        {/* 4. 重新滴定重置 */}
        <button
          onClick={onReset}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
          title="洗净试管，重置滴定"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 5. 化学滴定体积滑块 */}
        <div className="flex-1 flex items-center gap-2 ml-2">
          <span className="text-[11px] font-mono text-slate-500">0</span>
          <div className="flex-1 relative h-2 bg-slate-200 rounded-full flex items-center">
            <input
              type="range"
              min={0}
              max={maxVolume}
              step={0.05}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="peer absolute -inset-y-1 left-0 w-full h-4 opacity-0 cursor-pointer z-10"
            />
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-sky-500 transition-all duration-75 pointer-events-none"
              style={{ width: `${percentage}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-sky-600 rounded-full shadow-xs pointer-events-none transition-all duration-75"
              style={{ left: `calc(${percentage}% - 7px)` }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-500">{maxVolume} mL</span>
        </div>
      </div>
    </div>
  )
}
