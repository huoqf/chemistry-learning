import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ScoringCardSection } from '../ScoringCardSection'
import type { ScoringStep } from '@/data/gaokaoQuizData'

describe('ScoringCardSection 踩分卡判分与公式渲染回归测试', () => {
  const sampleSteps: ScoringStep[] = [
    {
      id: 'kw-step',
      title: '氨气收集规范 ($\\text{NH}_3$)',
      type: 'keywords',
      questionText: '极易溶气体倒置漏斗防倒吸原理及探底能否生效？',
      correctAnswer: ['脱离液面', '回落', '不能'],
      explanation: '必须包含脱离液面、重力回落及不能探底，含 $N_{\\text{A}}$ 等公式时正确渲染。',
    },
    {
      id: 'syn-step',
      title: '半径排序',
      type: 'keywords',
      questionText: '比较 10 电子微粒半径：',
      correctAnswer: ['O2->F->Na+>Mg2+>Al3+', 'O²⁻>F⁻>Na⁺>Mg²⁺>Al³⁺'],
      explanation: '核电荷数越大半径越小。',
    },
    {
      id: 'calc-step',
      title: '纯度计算',
      type: 'calculation',
      questionText: '计算标况气体占比：',
      correctAnswer: ['Yes', 'yes'],
      explanation: '物料守恒不变。',
    },
  ]

  it('空输入时禁止提交验证按钮触发判分，且通过 KatexText 渲染公式不裸露源码', () => {
    const { container } = render(<ScoringCardSection steps={sampleSteps} />)

    const submitButtons = screen.getAllByRole('button', { name: '提交验证' })
    expect(submitButtons[0]).toBeDisabled()
    fireEvent.click(submitButtons[0])
    expect(screen.queryByText('✕ 未达精准词')).not.toBeInTheDocument()

    // 标题中 $\text{NH}_3$ 应由 KaTeX 渲染，不裸露原始 $...$
    expect(container.querySelector('.katex')).toBeTruthy()
    expect(container.textContent).not.toContain('$\\text{NH}_3$')
  })

  it('keywords 题防单字蒙混：只填“不能”判错，覆盖全部核心关键词才通过', () => {
    render(<ScoringCardSection steps={[sampleSteps[0]]} />)
    const input = screen.getByRole('textbox')
    const submitBtn = screen.getByRole('button', { name: '提交验证' })

    fireEvent.change(input, { target: { value: '不能' } })
    fireEvent.click(submitBtn)
    expect(screen.getByText('✕ 未达精准词')).toBeInTheDocument()

    fireEvent.click(screen.getByTitle('重新做题'))
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '不能探底，因为无法脱离液面而回落' },
    })
    fireEvent.click(screen.getByRole('button', { name: '提交验证' }))
    expect(screen.getByText('✓ 匹配踩分点')).toBeInTheDocument()
  })

  it('同义上下标数组与大小写同义答案均应规范匹配', () => {
    render(<ScoringCardSection steps={[sampleSteps[1], sampleSteps[2]]} />)
    const inputs = screen.getAllByRole('textbox')
    const submits = screen.getAllByRole('button', { name: '提交验证' })

    fireEvent.change(inputs[0], { target: { value: 'O2- > F- > Na+ > Mg2+ > Al3+' } })
    fireEvent.click(submits[0])

    fireEvent.change(inputs[1], { target: { value: 'YES' } })
    fireEvent.click(submits[1])

    expect(screen.getAllByText('✓ 匹配踩分点')).toHaveLength(2)
  })

  it('同义词分组 (requiredKeywordGroups / alternativeKeywordGroups) 防死题与防子词放水', () => {
    const groupedSteps: ScoringStep[] = [
      {
        id: 'gas-airtight',
        title: '气密性检查',
        type: 'keywords',
        questionText: '简述气密性检查方法：',
        correctAnswer: ['微热', '气泡', '水柱', '止水夹', '液面差'],
        alternativeKeywordGroups: [
          [['微热', '双手紧握'], ['气泡'], ['水柱']],
          [['止水夹', '夹紧'], ['液面差']],
        ],
        explanation: '微热法或液封法均可得分。',
      },
      {
        id: 'alcohol-ox',
        title: '叔丁醇',
        type: 'keywords',
        questionText: '叔丁醇能否催化氧化？',
        correctAnswer: ['不能', '无α-氢', '没有α-氢', '没有α氢', '无α-H'],
        requiredKeywordGroups: [['不能', '不可'], ['无α-氢', '没有α-氢', '没有α氢', '无α-H']],
        explanation: '须同时说明不能及无α-H。',
      },
      {
        id: 'hess-endo',
        title: '反应热',
        type: 'keywords',
        questionText: '写出公式及吸放热：',
        correctAnswer: ['ΔH = Ea(正) - Ea(逆)', '放热', '放热反应'],
        explanation: '不得靠子串放热/放热反应混过去。',
      },
    ]

    render(<ScoringCardSection steps={groupedSteps} />)
    const inputs = screen.getAllByRole('textbox')
    const submits = screen.getAllByRole('button', { name: '提交验证' })

    // 1. 仅用液封法完整作答应当判对（原先 2/5 必判错的死题已修复）
    fireEvent.change(inputs[0], { target: { value: '关闭止水夹加水，静置后液面差不变' } })
    fireEvent.click(submits[0])

    // 2. 叔丁醇简洁规范作答应当判对（原先 2/5 死题已修复）
    fireEvent.change(inputs[1], { target: { value: '不能，因为无α-H' } })
    fireEvent.click(submits[1])

    // 3. 漏答第一问、仅写「放热反应」必须判错（原先靠子词+超集命中 2/3 放水漏洞已封堵）
    fireEvent.change(inputs[2], { target: { value: '放热反应' } })
    fireEvent.click(submits[2])

    expect(screen.getAllByText('✓ 匹配踩分点')).toHaveLength(2)
    expect(screen.getAllByText('✕ 未达精准词')).toHaveLength(1)
  })
})
