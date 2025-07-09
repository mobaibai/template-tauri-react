#!/usr/bin/env node
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function formatSize(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

function getDirSize(dirPath) {
  try {
    const output = execSync(`du -sb "${dirPath}" 2>/dev/null || echo "0"`).toString().trim()
    return parseInt(output.split('\t')[0]) || 0
  } catch {
    return 0
  }
}

function removeDir(dirPath, description) {
  try {
    if (fs.existsSync(dirPath)) {
      const size = getDirSize(dirPath)
      execSync(`rm -rf "${dirPath}"`)
      log(`✅ 已清理 ${description}: ${formatSize(size)}`, 'green')
      return size
    } else {
      log(`ℹ️  ${description} 不存在，跳过`, 'yellow')
      return 0
    }
  } catch (error) {
    log(`❌ 清理 ${description} 失败: ${error.message}`, 'red')
    return 0
  }
}

function cleanTargetSpecificDirs() {
  const targetDir = './src-tauri/target'

  if (!fs.existsSync(targetDir)) {
    log(`ℹ️  target 目录不存在，跳过`, 'yellow')
    return 0
  }

  const size = getDirSize(targetDir)
  try {
    execSync(`rm -rf "${targetDir}"/*`)
    log(`✅ 已清理整个 target 目录: ${formatSize(size)}`, 'green')
    return size
  } catch (error) {
    log(`❌ 清理 target 目录失败: ${error.message}`, 'red')
    return 0
  }
}

async function main() {
  log('🧹 Tauri 跨平台构建缓存清理工具', 'cyan')
  log('='.repeat(50), 'cyan')

  let totalCleaned = 0

  // 检查当前磁盘占用
  log('\n📊 当前磁盘占用情况:', 'blue')

  const cacheLocations = [
    { path: process.env.HOME + '/.xwin', name: 'Windows SDK 缓存 (~/.xwin)' },
    { path: process.env.HOME + '/Library/Caches/cargo-xwin', name: 'cargo-xwin 缓存' },
    { path: './.xwin-cache', name: '项目本地缓存 (.xwin-cache)' },
    { path: './src-tauri/target', name: 'Rust 构建缓存 (target)' },
    { path: './dist-builds', name: '构建产物 (dist-builds)' },
  ]

  cacheLocations.forEach(location => {
    const size = getDirSize(location.path)
    if (size > 0) {
      log(`  ${location.name}: ${formatSize(size)}`, size > 1024 * 1024 * 1024 ? 'red' : 'yellow')
    }
  })

  // 询问用户要清理什么
  log('\n🤔 请选择要清理的内容:', 'blue')
  log('1. 仅清理项目本地缓存 (.xwin-cache, target/)')
  log('2. 清理所有 Windows SDK 缓存 (包括 ~/.xwin)')
  log('3. 清理构建产物 (dist-builds/)')
  log('4. 清理整个构建缓存目录 (src-tauri/target/)')
  log('5. 全部清理 (保留 LLVM 工具)')
  log('6. 显示 LLVM 工具占用情况')
  log('0. 取消')

  const { createInterface } = await import('readline')
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('\n请输入选项 (0-6): ', answer => {
    rl.close()

    switch (answer.trim()) {
      case '1':
        log('\n🧹 清理项目本地缓存...', 'yellow')
        totalCleaned += removeDir('./.xwin-cache', '项目本地 Windows SDK 缓存')
        totalCleaned += removeDir('./src-tauri/target', 'Rust 构建缓存')
        break

      case '2':
        log('\n🧹 清理所有 Windows SDK 缓存...', 'yellow')
        totalCleaned += removeDir(process.env.HOME + '/.xwin', '全局 Windows SDK 缓存')
        totalCleaned += removeDir(
          process.env.HOME + '/Library/Caches/cargo-xwin',
          'cargo-xwin 缓存'
        )
        totalCleaned += removeDir('./.xwin-cache', '项目本地 Windows SDK 缓存')
        break

      case '3':
        log('\n🧹 清理构建产物...', 'yellow')
        totalCleaned += removeDir('./dist-builds', '构建产物')
        break

      case '4':
        log('\n🧹 清理整个构建缓存目录...', 'yellow')
        totalCleaned += cleanTargetSpecificDirs()
        break

      case '5':
        log('\n🧹 全部清理...', 'yellow')
        totalCleaned += removeDir('./.xwin-cache', '项目本地 Windows SDK 缓存')
        totalCleaned += removeDir('./src-tauri/target', 'Rust 构建缓存')
        totalCleaned += removeDir('./dist-builds', '构建产物')
        totalCleaned += removeDir(process.env.HOME + '/.xwin', '全局 Windows SDK 缓存')
        totalCleaned += removeDir(
          process.env.HOME + '/Library/Caches/cargo-xwin',
          'cargo-xwin 缓存'
        )
        break

      case '6':
        log('\n📊 LLVM 工具磁盘占用:', 'blue')
        try {
          const llvmDirs = ['/opt/homebrew/Cellar/llvm', '/opt/homebrew/Cellar/llvm@19']
          llvmDirs.forEach(dir => {
            const size = getDirSize(dir)
            if (size > 0) {
              log(`  ${dir}: ${formatSize(size)}`, 'yellow')
            }
          })
          log('\n💡 提示: LLVM 工具用于跨平台编译，建议保留。如需卸载:', 'cyan')
          log('  brew uninstall llvm llvm@19', 'cyan')
        } catch (error) {
          log(`❌ 检查 LLVM 工具失败: ${error.message}`, 'red')
        }
        return

      case '0':
        log('\n❌ 已取消清理操作', 'yellow')
        return

      default:
        log('\n❌ 无效选项', 'red')
        return
    }

    log(`\n✨ 清理完成！共释放磁盘空间: ${formatSize(totalCleaned)}`, 'green')

    if (answer === '2' || answer === '5') {
      log('\n⚠️  注意: 如果需要再次构建 Windows ARM64，需要重新下载 Windows SDK:', 'yellow')
      log('  xwin --accept-license splat --output ~/.xwin', 'cyan')
    }
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }
