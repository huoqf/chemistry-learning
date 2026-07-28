/**
 * @deprecated 此文件已迁移至 src/data/quiz/ 目录
 * 保留此文件仅为向后兼容，请勿在此添加新的题库数据。
 * 新增母题数据请在 src/data/quiz/<model-id>.ts 中添加，并在 src/data/quiz/index.ts 注册。
 */
export type { ScoringStep, GaokaoVariantItem, ModelQuizData } from './quiz/types'
export { modelQuizMap, getModelQuizData } from './quiz/index'
