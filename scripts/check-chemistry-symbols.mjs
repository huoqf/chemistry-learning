#!/usr/bin/env node
/**
 * check-chemistry-symbols.mjs
 *
 * 化学符号书写规范门禁（全库源码扫描，`src/**\/*.{ts,tsx}`，跳过 __tests__）。
 *
 * 规则：
 *   1. 禁止自造符号 `≜`。
 *      —— 它既不是教材/国标写法，也被项目内部当作"等号 + 加热条件"使用，
 *         与 `=` / `⇌` / `\rightleftharpoons` 混用会让学生照抄到答卷上失分。
 *         加热/条件反应统一写 `=Δ=`（LaTeX 出口用 `\xlongequal{\Delta}`）。
 *   2. 禁止非整数系数配平（如 `Fe + 1.5 Cl₂`）。
 *      —— 化学方程式必须整体配平为最小整数比；需要半系数时应整体乘 2。
 *
 * 用法：node scripts/check-chemistry-symbols.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const TARGET_DIRS = [join(ROOT, 'src')]
const FILE_EXTENSIONS = new Set(['.ts', '.tsx'])
/** 测试文件内部可能刻意包含反例字面量，不参与扫描 */
const SKIP_SEGMENTS = ['__tests__']

/** 自造符号：任一出现即违规 */
const FORBIDDEN_LITERALS = ['≜']

/** 非整数系数配平：数字 + 元素/化学式（要求数字与符号之间无 "mol" 等单位，避免误伤"1.5 mol O₂"） */
const NON_INTEGER_COEFF = /(?<![\d.])1\.5\s*(Cl₂|Cl2|O₂|O2|H₂|H2|N₂|N2|Fe|Cu|NaOH|HCl|KOH)/

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

const violations = []
let scanned = 0
for (const dir of TARGET_DIRS) {
  if (!statSync(dir).isDirectory()) continue
  for (const file of walk(dir)) {
    scanned += 1
    const relPath = relative(ROOT, file).replaceAll('\\', '/')
    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      for (const literal of FORBIDDEN_LITERALS) {
        if (lines[i].includes(literal)) {
          violations.push({ file: relPath, line: i + 1, reason: `自造符号 "${literal}"（应为 =Δ=）`, text: lines[i].trim() })
        }
      }
      if (NON_INTEGER_COEFF.test(lines[i])) {
        violations.push({ file: relPath, line: i + 1, reason: '非整数系数配平（应整体配平为最小整数比）', text: lines[i].trim() })
      }
    }
  }
}

if (violations.length > 0) {
  console.error('❌ 化学符号书写不规范。')
  console.error('   ① 禁止自造符号 ≜：加热/条件反应统一写 =Δ=；')
  console.error('   ② 禁止非整数系数配平（如 Fe + 1.5 Cl₂）：须整体配平为最小整数比。')
  console.error('')
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.reason}`)
    console.error(`      ${v.text}`)
  }
  console.error('')
  process.exit(1)
}

console.log(`✅ Chemistry-symbol check passed: ${scanned} 个源文件无自造符号/非整数配平。`)
