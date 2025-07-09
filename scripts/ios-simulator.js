#!/usr/bin/env node
/**
 * iOS 模拟器管理脚本
 * 提供启动、停止、列出 iOS 模拟器的功能
 */
import { execSync, spawn } from 'child_process'
import os from 'os'
import readline from 'readline'

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

// 检查是否在 macOS 上运行
function checkMacOS() {
  if (os.platform() !== 'darwin') {
    logError('iOS 模拟器只能在 macOS 上运行')
    process.exit(1)
  }
}

// 检查 Xcode 工具是否可用
function checkXcodeTools() {
  try {
    execSync('which xcrun', { stdio: 'ignore' })
    return true
  } catch {
    logError('未找到 xcrun，请安装 Xcode Command Line Tools')
    logInfo('运行: xcode-select --install')
    return false
  }
}

// 获取可用的模拟器列表
function getAvailableSimulators() {
  try {
    const output = execSync('xcrun simctl list devices available --json', { encoding: 'utf8' })
    const data = JSON.parse(output)

    const simulators = []

    for (const [runtime, devices] of Object.entries(data.devices)) {
      if (runtime.includes('iOS')) {
        for (const device of devices) {
          if (device.isAvailable) {
            simulators.push({
              name: device.name,
              udid: device.udid,
              runtime: runtime,
              state: device.state,
            })
          }
        }
      }
    }

    return simulators
  } catch (error) {
    logError(`获取模拟器列表失败: ${error.message}`)
    return []
  }
}

// 获取正在运行的模拟器
function getRunningSimulators() {
  const simulators = getAvailableSimulators()
  return simulators.filter(sim => sim.state === 'Booted')
}

// 启动模拟器
function startSimulator(udid) {
  try {
    logInfo(`正在启动模拟器: ${udid}`)
    execSync(`xcrun simctl boot ${udid}`, { stdio: 'inherit' })

    // 打开模拟器应用
    execSync('open -a Simulator', { stdio: 'inherit' })

    logSuccess('模拟器启动成功')
    return true
  } catch (error) {
    logError(`启动模拟器失败: ${error.message}`)
    return false
  }
}

// 停止所有模拟器
function stopAllSimulators() {
  try {
    logInfo('正在停止所有模拟器...')
    execSync('xcrun simctl shutdown all', { stdio: 'inherit' })
    logSuccess('所有模拟器已停止')
    return true
  } catch (error) {
    logError(`停止模拟器失败: ${error.message}`)
    return false
  }
}

// 显示模拟器状态
function showStatus() {
  logStep('STATUS', '检查 iOS 模拟器状态...')

  if (!checkXcodeTools()) {
    return false
  }

  const simulators = getAvailableSimulators()
  const runningSimulators = getRunningSimulators()

  if (simulators.length === 0) {
    logWarning('未找到可用的 iOS 模拟器')
    logInfo('请在 Xcode 中创建 iOS 模拟器')
    return false
  }

  logInfo(`找到 ${simulators.length} 个可用模拟器:`)
  simulators.forEach(sim => {
    const status = sim.state === 'Booted' ? '🟢 运行中' : '⚪ 已停止'
    logInfo(`  ${status} ${sim.name} (${sim.runtime})`)
  })

  if (runningSimulators.length > 0) {
    logSuccess(`${runningSimulators.length} 个模拟器正在运行`)
  } else {
    logWarning('没有模拟器正在运行')
  }

  return true
}

// 自动启动推荐的模拟器
function autoStart() {
  logStep('START', '启动 iOS 模拟器...')

  if (!checkXcodeTools()) {
    return false
  }

  const simulators = getAvailableSimulators()
  const runningSimulators = getRunningSimulators()

  if (runningSimulators.length > 0) {
    logSuccess(`已有 ${runningSimulators.length} 个模拟器在运行`)
    runningSimulators.forEach(sim => {
      logInfo(`  🟢 ${sim.name}`)
    })
    return true
  }

  if (simulators.length === 0) {
    logError('未找到可用的 iOS 模拟器')
    logInfo('请在 Xcode 中创建 iOS 模拟器')
    return false
  }

  // 优先选择 iPhone 模拟器
  const preferredSimulator =
    simulators.find(
      sim =>
        sim.name.includes('iPhone') &&
        (sim.name.includes('15') || sim.name.includes('14') || sim.name.includes('13'))
    ) || simulators[0]

  logInfo(`选择模拟器: ${preferredSimulator.name}`)
  return startSimulator(preferredSimulator.udid)
}

// 交互式选择模拟器
function interactiveStart() {
  logStep('INTERACTIVE', '交互式启动 iOS 模拟器...')

  if (!checkXcodeTools()) {
    return
  }

  const simulators = getAvailableSimulators()

  if (simulators.length === 0) {
    logError('未找到可用的 iOS 模拟器')
    logInfo('请在 Xcode 中创建 iOS 模拟器')
    return
  }

  console.log('\n📱 可用的 iOS 模拟器:')
  simulators.forEach((sim, index) => {
    const status = sim.state === 'Booted' ? '🟢' : '⚪'
    console.log(`  ${index + 1}. ${status} ${sim.name} (${sim.runtime})`)
  })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('\n请选择要启动的模拟器 (输入序号): ', answer => {
    const index = parseInt(answer) - 1

    if (index >= 0 && index < simulators.length) {
      const selectedSimulator = simulators[index]

      if (selectedSimulator.state === 'Booted') {
        logInfo(`模拟器 "${selectedSimulator.name}" 已在运行`)
      } else {
        startSimulator(selectedSimulator.udid)
      }
    } else {
      logError('无效的选择')
    }

    rl.close()
  })
}

// 主函数
function main() {
  checkMacOS()

  const command = process.argv[2]

  switch (command) {
    case 'status':
      showStatus()
      break

    case 'start':
      autoStart()
      break

    case 'stop':
      stopAllSimulators()
      break

    case 'interactive':
      interactiveStart()
      break

    default:
      console.log('\n📱 iOS 模拟器管理工具')
      console.log('\n用法:')
      console.log('  node scripts/ios-simulator.js <command>')
      console.log('\n命令:')
      console.log('  status       显示模拟器状态')
      console.log('  start        自动启动推荐的模拟器')
      console.log('  stop         停止所有模拟器')
      console.log('  interactive  交互式选择并启动模拟器')
      console.log('\n示例:')
      console.log('  npm run simulator:status')
      console.log('  npm run simulator:start')
      console.log('  npm run simulator:stop')
      console.log('  npm run simulator:interactive')
      break
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export {
  getAvailableSimulators,
  getRunningSimulators,
  startSimulator,
  stopAllSimulators,
  showStatus,
  autoStart,
  interactiveStart,
}
