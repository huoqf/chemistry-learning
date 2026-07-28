const fs = require('fs')
const path = require('path')

// ── 配置 ──────────────────────────────────────────────────────────────────────

/** 逻辑文件行数警戒线（触发则报错退出） */
const LOGIC_LIMIT = 400

/** 豁免规则：文件名包含以下关键词则跳过行数检查（纯数据/纯类型文件） */
const DATA_EXEMPT_PATTERNS = [
  /Data\.ts$/,
  /data\.ts$/,
  /types\.ts$/,
  /Transform\.ts$/,
  /constants\.ts$/,
  /index\.ts$/,
  /\/data\//,
]

/** 扫描目录（相对于项目根） */
const SCAN_DIRS = [
  'src/features',
  'src/pages',
  'src/components',
]

const EXTENSIONS = ['.tsx', '.ts']

// ── 工具函数 ──────────────────────────────────────────────────────────────────

function isDataExempt(filePath) {
  return DATA_EXEMPT_PATTERNS.some(function(p) { return p.test(filePath) })
}

function countLines(filePath) {
  return fs.readFileSync(filePath, 'utf8').split('\n').length
}

function walk(dir, results) {
  results = results || []
  if (!fs.existsSync(dir)) return results
  var entries = fs.readdirSync(dir, { withFileTypes: true })
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i]
    var fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['__tests__', 'node_modules', 'dist', '.git'].indexOf(entry.name) !== -1) continue
      walk(fullPath, results)
    } else if (EXTENSIONS.indexOf(path.extname(entry.name)) !== -1) {
      results.push(fullPath)
    }
  }
  return results
}

// ── 主逻辑 ────────────────────────────────────────────────────────────────────

var root = path.resolve(__dirname, '..')
var violations = []
var checked = 0

for (var d = 0; d < SCAN_DIRS.length; d++) {
  var files = walk(path.join(root, SCAN_DIRS[d]))
  for (var f = 0; f < files.length; f++) {
    var file = files[f]
    var rel = file.replace(root + path.sep, '').replace(/\\/g, '/')
    if (isDataExempt(rel)) continue
    var lines = countLines(file)
    checked++
    if (lines > LOGIC_LIMIT) {
      violations.push({ file: rel, lines: lines })
    }
  }
}

// ── 报告 ──────────────────────────────────────────────────────────────────────

console.log('\n文件规模检查：扫描 ' + checked + ' 个逻辑文件（数据/类型文件已豁免）\n')

if (violations.length === 0) {
  console.log('全部通过（阈值 ' + LOGIC_LIMIT + ' 行）\n')
  process.exit(0)
} else {
  console.error('以下文件超过 ' + LOGIC_LIMIT + ' 行，请检查是否存在职责混合：\n')
  violations.sort(function(a, b) { return b.lines - a.lines }).forEach(function(v) {
    console.error('   ' + String(v.lines).padStart(4) + ' 行  ' + v.file)
  })
  console.error('\n提示：行数多不等于需要拆分。判断文件是否同时包含多种关注点（UI渲染+化学计算等）。')
  console.error('      若职责单一（如纯SVG场景），可将文件名加入 DATA_EXEMPT_PATTERNS 豁免。\n')
  process.exit(1)
}