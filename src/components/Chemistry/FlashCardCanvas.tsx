import { useState } from 'react'
import { Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react'

interface FlashCardItem {
  id: string
  question: string
  optionA: string
  optionB: string
  correctOption: 'A' | 'B'
  explanation: string
  chemicalEquation?: string
}

const flashCardsData: FlashCardItem[] = [
  {
    id: 'card-1',
    question: '将 SO₂ 和 Cl₂ 分别通入品红溶液中，褪色后对溶液加热，现象有何不同？',
    optionA: '通入 SO₂ 的溶液加热恢复红色；通入 Cl₂ 的溶液加热不恢复红色',
    optionB: '两者加热均可恢复红色',
    correctOption: 'A',
    explanation: 'SO₂ 漂白属于化合作用（生成不稳定无色物质，加热解离恢复红色）；Cl₂ 的漂白属于强氧化作用（生成 HClO 永久破坏色素，加热不恢复）。',
    chemicalEquation: 'SO₂ + 色素 ⇌ 无色物质 (加热逆向)',
  },
  {
    id: 'card-2',
    question: '常温下，将铁片 (Fe) 放入浓硫酸 (98% H₂SO₄) 中，会发生什么？',
    optionA: '剧烈反应，产生大量 SO₂ 气体',
    optionB: '发生“钝化”，表面生成致密氧化膜保护内部金属，反应迅速停止',
    correctOption: 'B',
    explanation: '常温下浓硫酸/浓硝酸具有极强氧化性，使 Fe、Al 表面形成致密的氧化物薄膜而钝化。加热后钝化膜破坏，反应方可继续。',
  },
  {
    id: 'card-3',
    question: '在 NO₂ 与 N₂O₄ 的平衡体系中，压缩容器体积（增大压强），体系气体颜色有何变化？',
    optionA: '颜色先变深，随后随平衡逆向移动逐渐变浅（但仍比初始深）',
    optionB: '颜色直接变浅',
    correctOption: 'A',
    explanation: '压缩体积瞬间浓度增大致颜色变深；压强增大平衡向气体分子数减小的逆方向移动 (2NO₂ ⇌ N₂O₄)，颜色微变浅，但新平衡 c(NO₂) 仍高于压缩前。',
  },
]

export function FlashCardCanvas() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<'A' | 'B' | null>(null)

  const current = flashCardsData[currentIndex]

  const handleSelect = (option: 'A' | 'B') => {
    setSelected(option)
  }

  const handleNext = () => {
    setSelected(null)
    setCurrentIndex((currentIndex + 1) % flashCardsData.length)
  }

  return (
    <div className="w-full h-full p-4 bg-white/90 rounded-xl border border-slate-200 backdrop-blur flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-base">高考易错常识盲盒探究工具</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          卡片 {currentIndex + 1} / {flashCardsData.length}
        </span>
      </div>

      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col justify-between shadow-inner">
        <div>
          <div className="flex items-start gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <h4 className="font-bold text-slate-800 text-base leading-relaxed">{current.question}</h4>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleSelect('A')}
              className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                selected === 'A'
                  ? current.correctOption === 'A'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-rose-50 border-rose-400 text-rose-800'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              选项 A: {current.optionA}
            </button>
            <button
              onClick={() => handleSelect('B')}
              className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                selected === 'B'
                  ? current.correctOption === 'B'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-rose-50 border-rose-400 text-rose-800'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              选项 B: {current.optionB}
            </button>
          </div>
        </div>

        {selected && (
          <div className="mt-4 p-3 bg-white border border-indigo-200 rounded-lg flex flex-col gap-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              解析结论与高考考点：
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{current.explanation}</p>
            {current.chemicalEquation && (
              <div className="text-xs font-mono text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100">
                {current.chemicalEquation}
              </div>
            )}
            <button
              onClick={handleNext}
              className="mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-colors"
            >
              下一题 ➔
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
