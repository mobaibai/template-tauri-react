#!/usr/bin/env node
/**
 * Android 模拟器管理脚本
 * 自动检测、启动和管理 Android 模拟器
 */
import { execSync, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function logStep(step, message) {
  log(`[${step}] ${message}`, 'cyan')
}

// 获取 Android SDK 路径
function getAndroidSdkPath() {
  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
  if (!androidHome) {
    throw new Error('ANDROID_HOME 环境变量未设置')
  }

  if (!fs.existsSync(androidHome)) {
    throw new Error(`Android SDK 目录不存在: ${androidHome}`)
  }

  return androidHome
}

// 获取模拟器路径
function getEmulatorPath() {
  const androidHome = getAndroidSdkPath()
  const emulatorPath = path.join(androidHome, 'emulator', 'emulator')

  if (!fs.existsSync(emulatorPath)) {
    throw new Error('Android 模拟器未安装，请在 Android Studio 中安装')
  }

  return emulatorPath
}

// 获取 ADB 路径
function getAdbPath() {
  const androidHome = getAndroidSdkPath()
  const adbPath = path.join(androidHome, 'platform-tools', 'adb')

  if (!fs.existsSync(adbPath)) {
    throw new Error('ADB 未安装，请安装 Android SDK Platform Tools')
  }

  return adbPath
}

// 列出所有 AVD
function listAvds() {
  try {
    const emulatorPath = getEmulatorPath()
    const output = execSync(`"${emulatorPath}" -list-avds`, { encoding: 'utf8' })
    return output
      .trim()
      .split('\n')
      .filter(line => line.trim())
  } catch (error) {
    throw new Error(`获取 AVD 列表失败: ${error.message}`)
  }
}

// 获取运行中的模拟器
function getRunningEmulators() {
  try {
    const adbPath = getAdbPath()
    const output = execSync(`"${adbPath}" devices`, { encoding: 'utf8' })
    const lines = output.split('\n')
    const emulators = []

    for (const line of lines) {
      if (line.includes('emulator-') && line.includes('device')) {
        const deviceId = line.split('\t')[0]
        emulators.push(deviceId)
      }
    }

    return emulators
  } catch (error) {
    logWarning(`获取运行中的模拟器失败: ${error.message}`)
    return []
  }
}

// 检查模拟器是否正在运行
function isEmulatorRunning(avdName) {
  const runningEmulators = getRunningEmulators()
  return runningEmulators.length > 0
}

// 启动模拟器
function startEmulator(avdName, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const emulatorPath = getEmulatorPath()
      const args = ['-avd', avdName]

      // 添加启动选项
      if (options.noWindow) {
        args.push('-no-window')
      }
      if (options.noAudio) {
        args.push('-no-audio')
      }
      if (options.gpu) {
        args.push('-gpu', options.gpu)
      }
      if (options.memory) {
        args.push('-memory', options.memory)
      }

      logInfo(`启动模拟器: ${avdName}`)
      logInfo(`命令: "${emulatorPath}" ${args.join(' ')}`)

      const emulatorProcess = spawn(emulatorPath, args, {
        detached: true,
        stdio: 'ignore',
      })

      emulatorProcess.unref()

      // 等待模拟器启动
      logInfo('等待模拟器启动...')
      const checkInterval = setInterval(() => {
        if (isEmulatorRunning()) {
          clearInterval(checkInterval)
          logSuccess(`模拟器 ${avdName} 启动成功`)
          resolve()
        }
      }, 2000)

      // 超时处理
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('模拟器启动超时'))
      }, 60000) // 60秒超时
    } catch (error) {
      reject(error)
    }
  })
}

// 停止所有模拟器
function stopAllEmulators() {
  try {
    const adbPath = getAdbPath()
    const runningEmulators = getRunningEmulators()

    if (runningEmulators.length === 0) {
      logInfo('没有运行中的模拟器')
      return
    }

    logInfo(`停止 ${runningEmulators.length} 个模拟器...`)

    for (const emulator of runningEmulators) {
      try {
        execSync(`"${adbPath}" -s ${emulator} emu kill`, { stdio: 'ignore' })
        logSuccess(`已停止模拟器: ${emulator}`)
      } catch (error) {
        logWarning(`停止模拟器失败: ${emulator}`)
      }
    }
  } catch (error) {
    logError(`停止模拟器时出错: ${error.message}`)
  }
}

// 创建用户交互界面
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

// 选择 AVD
function selectAvd(avds) {
  return new Promise(resolve => {
    const rl = createInterface()

    log('\n📱 可用的 Android 虚拟设备:', 'bright')
    avds.forEach((avd, index) => {
      log(`  ${index + 1}. ${avd}`, 'cyan')
    })

    rl.question('\n请选择要启动的 AVD (输入序号): ', answer => {
      const index = parseInt(answer) - 1
      rl.close()

      if (index >= 0 && index < avds.length) {
        resolve(avds[index])
      } else {
        logError('无效的选择')
        resolve(null)
      }
    })
  })
}

// 显示状态
function showStatus() {
  logStep('STATUS', '检查模拟器状态...')

  try {
    const avds = listAvds()
    const runningEmulators = getRunningEmulators()

    log('\n📱 AVD 列表:', 'bright')
    if (avds.length === 0) {
      logWarning('未找到 AVD，请在 Android Studio 中创建')
    } else {
      avds.forEach(avd => {
        log(`  - ${avd}`, 'cyan')
      })
    }

    log('\n🏃 运行中的模拟器:', 'bright')
    if (runningEmulators.length === 0) {
      logInfo('没有运行中的模拟器')
    } else {
      runningEmulators.forEach(emulator => {
        log(`  - ${emulator}`, 'green')
      })
    }
  } catch (error) {
    logError(`检查状态失败: ${error.message}`)
  }
}

// 启动最佳模拟器
function startBestEmulator() {
  try {
    const avds = listAvds()

    if (avds.length === 0) {
      throw new Error('未找到 AVD，请在 Android Studio 中创建')
    }

    // 检查是否已有模拟器运行
    if (isEmulatorRunning()) {
      logSuccess('已有模拟器在运行')
      return
    }

    // 优先选择包含特定关键词的 AVD
    const preferredKeywords = ['pixel', 'api', '30', '31', '32', '33', '34']
    let selectedAvd = null

    for (const keyword of preferredKeywords) {
      const found = avds.find(avd => avd.toLowerCase().includes(keyword))
      if (found) {
        selectedAvd = found
        break
      }
    }

    // 如果没找到首选的，使用第一个
    if (!selectedAvd) {
      selectedAvd = avds[0]
    }

    logInfo(`自动选择 AVD: ${selectedAvd}`)
    return startEmulator(selectedAvd, {
      gpu: 'auto',
      noAudio: true,
    })
  } catch (error) {
    throw new Error(`启动模拟器失败: ${error.message}`)
  }
}

// 交互式启动
async function interactiveStart() {
  try {
    const avds = listAvds()

    if (avds.length === 0) {
      throw new Error('未找到 AVD，请在 Android Studio 中创建')
    }

    // 检查是否已有模拟器运行
    if (isEmulatorRunning()) {
      logSuccess('已有模拟器在运行')
      return
    }

    const selectedAvd = await selectAvd(avds)
    if (selectedAvd) {
      await startEmulator(selectedAvd, {
        gpu: 'auto',
        noAudio: true,
      })
    }
  } catch (error) {
    logError(`交互式启动失败: ${error.message}`)
  }
}

// 显示帮助
function showHelp() {
  console.log('\n📱 Android 模拟器管理工具')
  console.log('\n用法:')
  console.log('  node scripts/android-emulator.js [命令] [选项]')
  console.log('\n命令:')
  console.log('  status, -s     显示模拟器状态')
  console.log('  start, -st     自动启动最佳模拟器')
  console.log('  interactive, -i 交互式选择并启动模拟器')
  console.log('  stop, -sp      停止所有模拟器')
  console.log('  list, -l       列出所有 AVD')
  console.log('  help, -h       显示帮助信息')
  console.log('\n示例:')
  console.log('  node scripts/android-emulator.js status')
  console.log('  node scripts/android-emulator.js start')
  console.log('  npm run emulator:start')
  console.log('  npm run emulator:stop')
}

// 主函数
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'status'

  try {
    switch (command) {
      case 'status':
      case '-s':
        showStatus()
        break

      case 'start':
      case '-st':
        await startBestEmulator()
        break

      case 'interactive':
      case '-i':
        await interactiveStart()
        break

      case 'stop':
      case '-sp':
        stopAllEmulators()
        break

      case 'list':
      case '-l':
        const avds = listAvds()
        log('\n📱 可用的 AVD:', 'bright')
        if (avds.length === 0) {
          logWarning('未找到 AVD')
        } else {
          avds.forEach(avd => log(`  - ${avd}`, 'cyan'))
        }
        break

      case 'help':
      case '-h':
      case '--help':
        showHelp()
        break

      default:
        logError(`未知命令: ${command}`)
        showHelp()
        process.exit(1)
    }
  } catch (error) {
    logError(error.message)
    process.exit(1)
  }
}

// 命令行执行
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export {
  listAvds,
  getRunningEmulators,
  isEmulatorRunning,
  startEmulator,
  stopAllEmulators,
  startBestEmulator,
  showStatus,
}
