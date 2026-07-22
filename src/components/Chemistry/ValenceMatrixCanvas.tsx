import { useState } from 'react'
import { Sparkles, FlaskConical } from 'lucide-react'

export interface MatrixItem {
  valence: number // 化合价，例如 -2, 0, +2, +3, +6
  category: string // '单质' | '氧化物' | '氢化物/酸' | '盐'
  substance: string // 示例化学式 'Fe', 'Fe2O3', 'FeCl3'
  colorText: string // 溶液/外观颜色描述 '黄色', '红褐色', '银白色'
  colorStyle: string // CSS 颜色或 Tailwind 样式 'text-amber-600 bg-amber-50'
  testReaction?: string // 检验探究显色反应 '滴加 KSCN 变血红色'
  equation?: string // 反应方程式
}

interface ValenceMatrixCanvasProps {
  elementName: string // '铁 (Fe)' | '硫 (S)'
  valences: number[]
  categories: string[]
  items: MatrixItem[]
}

/**
 * 无机元素“价类二维矩阵”探究组件
 * 用于高考无机元素性质的高效记忆与显色/氧化还原反应互动探究
 */
export function ValenceMatrixCanvas({
  elementName,
  valences,
  categories,
  items,
}: ValenceMatrixCanvasProps) {
  const [selectedItem, setSelectedItem] = useState<MatrixItem | null>(items[0] || null)
  const [showTestAnimation, setShowTestAnimation] = useState(false)

  const getItem = (valence: number, cat: string) => {
    return items.find(i => i.valence === valence && i.category === cat)
  }

  const handleTestClick = () => {
    setShowTestAnimation(true)
    setTimeout(() => setShowTestAnimation(false), 2000)
  }

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 bg-white/80 rounded-xl backdrop-blur border border-slate-200">
      {/* 矩阵标题与提示 */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-base">{elementName} — 无机价类二维矩阵卡片</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
          点击矩阵格触发显色与探究
        </span>
      </div>

      {/* 二维矩阵主体表格 */}
      <div className="flex-1 overflow-auto border border-slate-200 rounded-lg p-2 bg-slate-50/50">
        <table className="w-full h-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-slate-200 bg-slate-100/70 text-xs font-bold text-slate-600">
                类别 \ 化合价
              </th>
              {valences.map(v => (
                <th
                  key={v}
                  className="p-2 border border-slate-200 bg-slate-100/70 text-xs font-bold text-slate-700 text-center"
                >
                  {v > 0 ? `+${v}` : v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat}>
                <td className="p-2 border border-slate-200 bg-slate-100/70 text-xs font-bold text-slate-700 text-center">
                  {cat}
                </td>
                {valences.map(v => {
                  const item = getItem(v, cat)
                  const isSelected = selectedItem?.substance === item?.substance
                  return (
                    <td
                      key={v}
                      className={`p-2 border border-slate-200 text-center transition-all cursor-pointer ${
                        item
                          ? isSelected
                            ? 'bg-indigo-100 border-indigo-400 shadow-inner'
                            : 'bg-white hover:bg-indigo-50'
                          : 'bg-slate-100/30'
                      }`}
                      onClick={() => item && setSelectedItem(item)}
                    >
                      {item ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-semibold text-sm text-slate-800">{item.substance}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.colorStyle}`}>
                            {item.colorText}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 底部探究与反应卡片 */}
      {selectedItem && (
        <div className="p-3 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-sm text-slate-800">
                物质探究：{selectedItem.substance}（化合价：{selectedItem.valence > 0 ? `+${selectedItem.valence}` : selectedItem.valence}，类别：{selectedItem.category}）
              </span>
            </div>
            {selectedItem.testReaction && (
              <button
                onClick={handleTestClick}
                className="px-3 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-all flex items-center gap-1"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                探究检验反应
              </button>
            )}
          </div>

          {selectedItem.testReaction && (
            <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-700">高频考点检验：</span>
                <span>{selectedItem.testReaction}</span>
              </div>
              {showTestAnimation && (
                <span className="text-xs font-bold text-rose-600 animate-pulse flex items-center gap-1">
                  ✨ 试剂显色演练中...
                </span>
              )}
            </div>
          )}

          {selectedItem.equation && (
            <div className="text-xs text-slate-700 bg-indigo-50/80 p-2 rounded font-mono border border-indigo-100">
              <span className="font-semibold text-indigo-900 font-sans">转化方程式：</span>
              {selectedItem.equation}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
