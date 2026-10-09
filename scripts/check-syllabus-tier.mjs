#!/usr/bin/env node
/**
 * check-syllabus-tier.mjs
 *
 * 检查 src/ 下的「三层归属标注」用词是否符合规范 §一.2
 * （docs/agent-rules/core/GAOKAO_CHEMISTRY_RULES.md）。
 *
 * 规则：
 *   1. 只允许三种层级标签的**准确写法**：【教材主线】/【信息题素材】/【超纲】；
 *   2. 历史同义写法（【信息题拓展】【工业流程拓展】等）一律视为违规，
 *      统一改写为【信息题素材】；
 *   3. 禁止把层级打包成「拓展 / 给予 / 工业流程」这类笼统或自造的层级标签。
 *
 * 说明：本检查只针对「层级归属」语义的标签；`testReaction` 中的情景/考点标签
 * （如【医学钡餐】【古氏定砷法】）不属于层级标注，不在检查范围内。
 *
 * 用法：node scripts/check-syllabus-tier.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const TARGET_DIRS = [join(ROOT, 'src')]
const FILE_EXTENSIONS = new Set(['.ts', '.tsx'])
/**
 * 跳过测试目录。测试文件内部会刻意写入历史违规标签字面量
 * （如 `expect(text).not.toContain('【信息题拓展】')`）作为反向断言，
 * 本门禁的管辖对象是"面向学生的内容文本"，不应把测试里的黑名单字面量判为违规。
 * 与 `check-chemistry-symbols.mjs` 保持同一职责边界。
 */
const SKIP_SEGMENTS = ['__tests__']

/** 规范允许的层级标签准确写法 */
const ALLOWED_TAGS = new Set(['教材主线', '信息题素材', '超纲'])

/** 命中即判违规的层级用词（历史同义写法 / 笼统写法 / 自造写法） */
const FORBIDDEN_TIER_WORDS = [/拓展/, /给予/, /工业流程/]

/** 匹配任意 【...】 标签 */
const TAG_REGEX = /【([^】]{1,60})】/g

// ── 文件遍历 ───────────────────────────────────────────────
function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (SKIP_SEGMENTS.some((seg) => full.includes(seg))) continue
    const stat = statSync(full)
    if (stat.isDirectory()) files.push(...walk(full))
    else if (FILE_EXTENSIONS.has(entry.slice(entry.lastIndexOf('.')))) files.push(full)
  }
  return files
}

// ── 检测 ───────────────────────────────────────────────────
const violations = []
for (const dir of TARGET_DIRS) {
  if (!statSync(dir).isDirectory()) continue
  for (const file of walk(dir)) {
    const relPath = relative(ROOT, file).replaceAll('\\', '/')
    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      TAG_REGEX.lastIndex = 0
      let m
      while ((m = TAG_REGEX.exec(lines[i])) !== null) {
        const tag = m[1]
        if (ALLOWED_TAGS.has(tag)) continue
        if (!FORBIDDEN_TIER_WORDS.some(re => re.test(tag))) continue
        violations.push({ file: relPath, line: i + 1, tag, text: lines[i].trim() })
      }
    }
  }
}

// ── 输出 ───────────────────────────────────────────────────
if (violations.length > 0) {
  console.error('❌ 三层归属标注用词不合规（规范 §一.2）。')
  console.error('   只允许【教材主线】/【信息题素材】/【超纲】三种准确写法；')
  console.error('   历史写法「拓展 / 给予 / 工业流程」统一改写为【信息题素材】。')
  console.error('')
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  【${v.tag}】`)
    console.error(`      ${v.text}`)
  }
  console.error('')
  process.exit(1)
}

console.log('✅ Syllabus-tier check passed: 层级标注用词全部合规。')
