import { LeftPanel, LeftPanelSection, Button } from '@/components/UI'
import { ION_DATA } from '../constants'
import { FlaskConical, Sparkles, CheckSquare, Square, RotateCcw, Droplets } from 'lucide-react'

interface IonLeftPanelProps {
  inquiryMode: 'single-test' | 'coexistence-check'
  selectedIonId: string
  coexistenceSelectedIons: string[]
  isReactionActive: boolean
  onSelectMode: (mode: 'single-test' | 'coexistence-check') => void
  onSelectIon: (id: string) => void
  onToggleCoexistenceIon: (id: string) => void
  onToggleReaction: () => void
  onResetCoexistence: () => void
}

export const IonLeftPanel: React.FC<IonLeftPanelProps> = ({
  inquiryMode,
  selectedIonId,
  coexistenceSelectedIons,
  isReactionActive,
  onSelectMode,
  onSelectIon,
  onToggleCoexistenceIon,
  onToggleReaction,
  onResetCoexistence,
}) => {
  const cations = ION_DATA.filter((i) => i.type === 'cation')
  const anions = ION_DATA.filter((i) => i.type === 'anion')

  return (
    <LeftPanel>
      <LeftPanelSection title="探究模式切换">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={inquiryMode === 'single-test' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onSelectMode('single-test')}
          >
            <FlaskConical className="w-3.5 h-3.5 mr-1" />
            特征离子检验
          </Button>
          <Button
            variant={inquiryMode === 'coexistence-check' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onSelectMode('coexistence-check')}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            离子共存排斥
          </Button>
        </div>
      </LeftPanelSection>

      {inquiryMode === 'single-test' ? (
        <>
          <LeftPanelSection title="高频阳离子检验 (选择探究)">
            <div className="grid grid-cols-2 gap-1.5">
              {cations.map((ion) => (
                <button
                  key={ion.id}
                  onClick={() => onSelectIon(ion.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${
                    selectedIonId === ion.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {ion.name}
                </button>
              ))}
            </div>
          </LeftPanelSection>

          <LeftPanelSection title="高频阴离子检验 (选择探究)">
            <div className="grid grid-cols-2 gap-1.5">
              {anions.map((ion) => (
                <button
                  key={ion.id}
                  onClick={() => onSelectIon(ion.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${
                    selectedIonId === ion.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {ion.name}
                </button>
              ))}
            </div>
          </LeftPanelSection>

          <LeftPanelSection title="实验动作交互">
            <Button
              variant={isReactionActive ? 'secondary' : 'primary'}
              size="sm"
              onClick={onToggleReaction}
              className="w-full"
            >
              <Droplets className="w-4 h-4 mr-1.5" />
              {isReactionActive ? '重置并重新检验' : '滴加特效试剂检验'}
            </Button>
          </LeftPanelSection>
        </>
      ) : (
        <>
          <LeftPanelSection title="勾选待检测溶液中的离子 (多选)">
            <div className="text-xs text-slate-500 mb-2">已选 {coexistenceSelectedIons.length} 种离子进行共存判定：</div>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
              <div className="text-[11px] font-bold text-slate-400 mt-1 mb-0.5">阳离子：</div>
              <div className="grid grid-cols-2 gap-1">
                {cations.map((ion) => {
                  const isChecked = coexistenceSelectedIons.includes(ion.id)
                  return (
                    <button
                      key={ion.id}
                      onClick={() => onToggleCoexistenceIon(ion.id)}
                      className={`px-2 py-1 rounded text-xs flex items-center justify-between border ${
                        isChecked
                          ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{ion.id}</span>
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="text-[11px] font-bold text-slate-400 mt-2 mb-0.5">阴离子：</div>
              <div className="grid grid-cols-2 gap-1">
                {anions.map((ion) => {
                  const isChecked = coexistenceSelectedIons.includes(ion.id)
                  return (
                    <button
                      key={ion.id}
                      onClick={() => onToggleCoexistenceIon(ion.id)}
                      className={`px-2 py-1 rounded text-xs flex items-center justify-between border ${
                        isChecked
                          ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{ion.id}</span>
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </LeftPanelSection>

          <LeftPanelSection title="探究操作">
            <Button variant="secondary" size="sm" onClick={onResetCoexistence} className="w-full">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              清空所选离子
            </Button>
          </LeftPanelSection>
        </>
      )}
    </LeftPanel>
  )
}
