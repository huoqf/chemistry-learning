import React from 'react'
import { FUNCTIONAL_GROUPS } from '../constants'
import { Radio } from 'lucide-react'
import { get3DModelForGroup, type Organic3DMolecule } from '../data/organic3dData'

interface OrganicSpectroscopyViewProps {
  onPreview3D: (molecule: Organic3DMolecule) => void
}

export const OrganicSpectroscopyView: React.FC<OrganicSpectroscopyViewProps> = ({ onPreview3D }) => {
  return (
    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs text-slate-800">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <Radio className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              高中化学 12 大核心官能团现代波谱特征全景大表
            </h3>
            <p className="text-xs text-slate-500">
              红外光谱 (IR) 官能团特征吸收区间 + ¹H-NMR 核磁共振氢谱化学位移与峰型规律
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          新高考前沿必考
        </span>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full table-fixed text-left border-collapse divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-800 font-bold select-none">
            <tr>
              <th className="w-[18%] py-3 px-3">官能团 / 结构式</th>
              <th className="w-[41%] py-3 px-3 bg-blue-50/60 text-blue-950">
                红外光谱 (IR) 特征吸收峰 (cm⁻¹)
              </th>
              <th className="w-[41%] py-3 px-3 bg-indigo-50/60 text-indigo-950">
                ¹H-NMR 核磁共振氢谱特征 (δ ppm)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {FUNCTIONAL_GROUPS.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-extrabold text-slate-900 text-xs sm:text-[13px]">{g.name}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded text-[11px]">
                      {g.structureSvg}
                    </span>
                    <button
                      onClick={() => {
                        const m = get3DModelForGroup(g.id)
                        if (m) onPreview3D(m)
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-900 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-200 cursor-pointer"
                    >
                      3D
                    </button>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-700 leading-relaxed bg-blue-50/20">
                  {g.spectroscopy?.ir || '见指纹区吸收'}
                </td>
                <td className="py-3 px-3 text-slate-700 leading-relaxed bg-indigo-50/20">
                  {g.spectroscopy?.hnmr || '无特异低场质子'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
        <strong className="font-bold text-amber-900">💡 新高考波谱推断黄金法则：</strong>
        <ul className="list-disc list-inside space-y-0.5 text-slate-700 leading-relaxed">
          <li>
            <strong>红外光谱 (IR)</strong> 用于确定分子中所含的<strong>化学键与官能团类型</strong>（如 1700 cm⁻¹ 附近有强吸收必含 C=O 键）；
          </li>
          <li>
            <strong>核磁共振氢谱 (¹H-NMR)</strong> 吸收峰的<strong>组数</strong>对应<strong>不同化学环境的氢原子种类</strong>；吸收峰的<strong>面积比</strong>对应<strong>各类氢原子的数目比</strong>；
          </li>
          <li>
            <strong>质谱 (MS)</strong> 中质荷比 ($m/z$) 最大的数值即为该有机分子的<strong>相对分子质量</strong>。
          </li>
        </ul>
      </div>
    </div>
  )
}
