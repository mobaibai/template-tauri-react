#!/usr/bin/env node
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import buildConfig from '../build.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

// 前端构建状态跟踪
let frontendBuildChecked = false
let frontendBuildSuccess = false
let frontendBuildTime = 0

// 重置前端构建状态
function resetFrontendBuildState() {
  frontendBuildChecked = false
  frontendBuildSuccess = false
  frontendBuildTime = 0
}

// 检查构建环境
function checkBuildEnvironment() {
  const checks = []

  try {
    // 检查 Node.js 版本
    const nodeVersion = process.version
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
    if (majorVersion < 16) {
      checks.push({
        type: 'error',
        message: `Node.js 版本过低 (${nodeVersion})，建议使用 16.x 或更高版本`,
      })
    } else {
      checks.push({ type: 'success', message: `Node.js 版本: ${nodeVersion}` })
    }
  } catch (error) {
    checks.push({ type: 'error', message: '无法检测 Node.js 版本' })
  }

  try {
    // 检查 npm 是否可用
    execSync('npm --version', { stdio: 'pipe' })
    checks.push({ type: 'success', message: 'npm 可用' })
  } catch (error) {
    checks.push({ type: 'error', message: 'npm 不可用或未安装' })
  }

  try {
    // 检查 package.json 是否存在
    const packageJsonPath = path.join(PROJECT_ROOT, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      checks.push({ type: 'success', message: 'package.json 存在' })
    } else {
      checks.push({ type: 'error', message: 'package.json 不存在' })
    }
  } catch (error) {
    checks.push({ type: 'error', message: '无法检查 package.json' })
  }

  try {
    // 检查 node_modules 是否存在
    const nodeModulesPath = path.join(PROJECT_ROOT, 'node_modules')
    if (fs.existsSync(nodeModulesPath)) {
      checks.push({ type: 'success', message: 'node_modules 存在' })
    } else {
      checks.push({ type: 'warning', message: 'node_modules 不存在，可能需要运行 npm install' })
    }
  } catch (error) {
    checks.push({ type: 'warning', message: '无法检查 node_modules' })
  }

  try {
    // 检查磁盘空间（简单检查）
    const stats = fs.statSync(PROJECT_ROOT)
    checks.push({ type: 'success', message: '项目目录可访问' })
  } catch (error) {
    checks.push({ type: 'error', message: '项目目录不可访问' })
  }

  // 输出检查结果
  const hasErrors = checks.some(check => check.type === 'error')
  const hasWarnings = checks.some(check => check.type === 'warning')

  if (buildConfig.options.verbose || hasErrors || hasWarnings) {
    logStep('ENV', '构建环境检查:')
    checks.forEach(check => {
      switch (check.type) {
        case 'success':
          console.log('  ✅', check.message)
          break
        case 'warning':
          console.log('  ⚠️', check.message)
          break
        case 'error':
          console.log('  ❌', check.message)
          break
      }
    })
  }

  return !hasErrors
}

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

function logStep(step, message) {
  log(`[${step}] ${message}`, 'cyan')
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

// 清理输出目录
function cleanOutputDir() {
  if (buildConfig.options.cleanBeforeBuild) {
    logStep('CLEAN', '清理输出目录...')
    if (fs.existsSync(buildConfig.options.outputRoot)) {
      execSync(`rm -rf ${buildConfig.options.outputRoot}`)
    }
    execSync(`mkdir -p ${buildConfig.options.outputRoot}`)
    logSuccess('输出目录清理完成')
  }
}

// 设置环境变量
function setEnvironmentVariables() {
  Object.entries(buildConfig.env).forEach(([key, value]) => {
    process.env[key] = value
  })
  logStep('ENV', '环境变量设置完成')
}

// 检查并构建前端
function ensureFrontendBuild(forceRebuild = false) {
  // 如果已经检查过且成功，且不是强制重建，则跳过
  if (frontendBuildChecked && frontendBuildSuccess && !forceRebuild) {
    return true
  }

  const distDir = path.join(PROJECT_ROOT, 'dist')
  const indexHtmlPath = path.join(distDir, 'index.html')
  const assetsPath = path.join(distDir, 'assets')

  // 如果不是强制重建且dist目录存在，检查其完整性
  if (!forceRebuild && fs.existsSync(distDir)) {
    try {
      const distContents = fs.readdirSync(distDir)
      const indexExists = fs.existsSync(indexHtmlPath)
      const assetsExists = fs.existsSync(assetsPath)

      if (distContents.length > 0 && indexExists && assetsExists) {
        // 额外检查文件大小，确保不是空文件
        const indexStats = fs.statSync(indexHtmlPath)
        if (indexStats.size > 0) {
          logStep('FRONTEND', '前端构建产物已存在且完整，跳过前端构建')
          frontendBuildChecked = true
          frontendBuildSuccess = true
          return true
        }
      }
    } catch (error) {
      logWarning(`检查前端构建产物时出错: ${error.message}`)
    }
  }

  logStep(
    'FRONTEND',
    forceRebuild ? '构建前端项目...' : '前端构建产物不存在或不完整，开始构建前端...'
  )

  // 重试机制
  const maxRetries = 2
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        logStep('FRONTEND', `第 ${attempt} 次重试构建...`)
        // 重试前清理可能的残留文件
        if (fs.existsSync(distDir)) {
          execSync(`rm -rf "${distDir}"`)
        }
      }

      // 如果是重建或重试，先清理dist目录
      if ((forceRebuild || attempt > 1) && fs.existsSync(distDir)) {
        logStep('FRONTEND', '清理现有构建产物...')
        try {
          execSync(`rm -rf "${distDir}"`)
        } catch (cleanError) {
          logWarning(`清理构建产物时出现警告: ${cleanError.message}`)
        }
      }

      // 检查网络连接和依赖
      if (attempt === 1) {
        try {
          execSync('npm ls --depth=0', { stdio: 'pipe', cwd: PROJECT_ROOT })
        } catch (depError) {
          logWarning('检测到依赖问题，尝试修复...')
          execSync('npm install', {
            stdio: buildConfig.options.verbose ? 'inherit' : 'pipe',
            cwd: PROJECT_ROOT,
          })
        }
      }

      const startTime = Date.now()
      execSync('npm run build', {
        stdio: buildConfig.options.verbose ? 'inherit' : 'pipe',
        cwd: PROJECT_ROOT,
      })
      frontendBuildTime = Date.now() - startTime

      // 验证构建是否成功
      if (fs.existsSync(distDir) && fs.existsSync(indexHtmlPath) && fs.existsSync(assetsPath)) {
        // 额外检查文件大小，确保不是空文件
        const indexStats = fs.statSync(indexHtmlPath)
        if (indexStats.size > 0) {
          logSuccess('前端构建完成')
          frontendBuildChecked = true
          frontendBuildSuccess = true
          return true
        } else {
          throw new Error('index.html 文件为空')
        }
      } else {
        throw new Error('构建产物不完整')
      }
    } catch (error) {
      logError(`前端构建失败 (尝试 ${attempt}/${maxRetries}): ${error.message}`)

      if (attempt === maxRetries) {
        frontendBuildChecked = true
        frontendBuildSuccess = false

        // 提供故障排除建议
        logWarning('\n🔧 故障排除建议:')
        logWarning('   1. 检查网络连接')
        logWarning('   2. 运行 npm install 重新安装依赖')
        logWarning('   3. 运行 npm run clean 清理缓存')
        logWarning('   4. 检查 Node.js 版本兼容性')
        logWarning('   5. 查看详细错误日志\n')

        return false
      }

      // 等待一段时间后重试
      logStep('FRONTEND', '等待 2 秒后重试...')
      try {
        execSync('sleep 2', { stdio: 'pipe' })
      } catch {
        // Windows 兼容性
        const start = Date.now()
        while (Date.now() - start < 2000) {
          // 简单的等待循环
        }
      }
    }
  }

  return false
}

// 监控并确保前端构建产物存在
function monitorFrontendBuild() {
  const distDir = path.join(PROJECT_ROOT, 'dist')

  // 检查前端构建产物是否存在且完整
  if (!fs.existsSync(distDir)) {
    throw new Error('前端构建产物丢失，请先执行前端构建')
  }

  // 检查dist目录完整性
  try {
    const distContents = fs.readdirSync(distDir)
    const indexHtmlPath = path.join(distDir, 'index.html')

    if (distContents.length === 0 || !fs.existsSync(indexHtmlPath)) {
      throw new Error('前端构建产物不完整，请先执行前端构建')
    }

    logStep('FRONTEND', '前端构建产物检查通过')
  } catch (error) {
    if (error.message.includes('前端构建产物')) {
      throw error
    }
    throw new Error(`检查前端构建产物时出错: ${error.message}`)
  }
}

// 检查移动端构建要求
function checkMobileRequirements(platformName, config) {
  if (config.platform !== 'mobile') return true

  logStep('CHECK', `检查 ${platformName} 构建要求...`)

  const { requirements } = config
  if (requirements) {
    // 检查操作系统要求
    if (requirements.os === 'macOS' && process.platform !== 'darwin') {
      logError(`${platformName} 构建需要 macOS 系统`)
      return false
    }

    // 显示工具要求
    if (requirements.tools && requirements.tools.length > 0) {
      logStep('TOOLS', `${platformName} 需要以下工具: ${requirements.tools.join(', ')}`)
    }

    // 显示注意事项
    if (requirements.note) {
      logWarning(`${platformName}: ${requirements.note}`)
    }
  }

  return true
}

// 构建单个平台
function buildPlatform(platformName, config) {
  logStep('BUILD', `开始构建 ${platformName}...`)

  try {
    // 检查移动端构建要求
    if (!checkMobileRequirements(platformName, config)) {
      logError(`${platformName} 构建要求检查失败，跳过构建`)
      return
    }

    // 确保前端构建产物存在
    monitorFrontendBuild()

    // 确保输出根目录存在
    execSync(`mkdir -p ${buildConfig.options.outputRoot}`)

    let buildCommand

    if (config.platform === 'mobile') {
      // 移动端构建命令
      buildCommand = `tauri ${config.buildCommand}`
    } else {
      // 桌面端构建命令
      buildCommand = `tauri build --runner ${config.runner} --target ${config.target}`
    }

    logStep('TAURI', `执行: ${buildCommand}`)
    execSync(buildCommand, { stdio: buildConfig.options.verbose ? 'inherit' : 'pipe' })

    // 复制最终的安装包文件
    if (fs.existsSync(config.sourceDir)) {
      copyBuildArtifacts(platformName, config)
    } else {
      logWarning(`${platformName} 构建产物目录不存在: ${config.sourceDir}`)
    }

    // 清理临时文件
    if (buildConfig.options.cleanAfterBuild && config.platform === 'desktop') {
      const targetDir = path.dirname(config.sourceDir.replace('/release/bundle', ''))
      if (fs.existsSync(targetDir)) {
        try {
          // 清理构建产物和缓存文件
          const dirsToClean = [
            path.join(targetDir, 'release', 'bundle'),
            path.join(targetDir, 'release', 'deps'),
            path.join(targetDir, 'release', 'build'),
            path.join(targetDir, 'release', '.fingerprint'),
            path.join(targetDir, 'release', 'incremental'),
            path.join(targetDir, 'release', 'examples'),
          ]

          dirsToClean.forEach(dir => {
            if (fs.existsSync(dir)) {
              execSync(`rm -rf "${dir}"`)
              logSuccess(`已清理: ${path.relative(PROJECT_ROOT, dir)}`)
            }
          })

          // 清理特定架构目录下的缓存
          const archDirs = fs.readdirSync(targetDir).filter(item => {
            const itemPath = path.join(targetDir, item)
            return (
              fs.statSync(itemPath).isDirectory() &&
              (item.includes('apple-darwin') ||
                item.includes('pc-windows') ||
                item.includes('unknown-linux'))
            )
          })

          archDirs.forEach(archDir => {
            const archPath = path.join(targetDir, archDir)
            const archCacheDirs = [
              path.join(archPath, 'release', 'bundle'),
              path.join(archPath, 'release', 'deps'),
              path.join(archPath, 'release', 'build'),
              path.join(archPath, 'release', '.fingerprint'),
              path.join(archPath, 'release', 'incremental'),
              path.join(archPath, 'release', 'examples'),
            ]

            // 清理架构目录下的可执行文件
            if (fs.existsSync(path.join(archPath, 'release'))) {
              const releaseDir = path.join(archPath, 'release')
              const releaseFiles = fs.readdirSync(releaseDir)
              releaseFiles.forEach(file => {
                const filePath = path.join(releaseDir, file)
                const stat = fs.statSync(filePath)
                // 删除可执行文件和调试文件（不是目录且不是基本文件）
                if (stat.isFile() && !['.cargo-lock', 'CACHEDIR.TAG'].includes(file)) {
                  execSync(`rm -f "${filePath}"`)
                  logSuccess(`已清理可执行文件: ${path.relative(PROJECT_ROOT, filePath)}`)
                }
              })
            }

            archCacheDirs.forEach(dir => {
              if (fs.existsSync(dir)) {
                execSync(`rm -rf "${dir}"`)
                logSuccess(`已清理: ${path.relative(PROJECT_ROOT, dir)}`)
              }
            })

            // 检查架构目录是否可以完全清理
            const archReleasePath = path.join(archPath, 'release')
            if (fs.existsSync(archReleasePath)) {
              const releaseContents = fs.readdirSync(archReleasePath)
              // 如果 release 目录为空或只包含基本文件，则删除整个架构目录
              const basicFiles = ['.cargo-lock', 'CACHEDIR.TAG']
              const hasOnlyBasicFiles = releaseContents.every(item => basicFiles.includes(item))

              if (releaseContents.length === 0 || hasOnlyBasicFiles) {
                execSync(`rm -rf "${archPath}"`)
                logSuccess(`已清理整个架构目录: ${path.relative(PROJECT_ROOT, archPath)}`)
              }
            }
          })

          logStep('CLEAN', `已清理 ${platformName} 构建产物和缓存文件`)
        } catch (error) {
          logWarning(`清理 ${platformName} 临时文件时遇到权限问题，跳过清理: ${error.message}`)
        }
      }
    }

    logSuccess(`${platformName} 构建完成`)
  } catch (error) {
    logError(`${platformName} 构建失败: ${error.message}`)
    throw error
  }
}

// 复制构建产物
function copyBuildArtifacts(platformName, config) {
  if (config.platform === 'mobile') {
    // 移动端产物复制
    if (platformName.startsWith('ios')) {
      // iOS: 复制 .ipa 文件
      const ipaFiles = findFiles(config.sourceDir, '.ipa')
      ipaFiles.forEach(ipaFile => {
        const targetPath = path.join(buildConfig.options.outputRoot, path.basename(ipaFile))
        execSync(`cp "${ipaFile}" "${targetPath}"`)
        logSuccess(`已复制 ${path.basename(ipaFile)} 到 ${buildConfig.options.outputRoot}`)
      })

      // 同时复制 .app 文件用于模拟器
      const appFiles = findFiles(config.sourceDir, '.app', true)
      appFiles.forEach(appFile => {
        const targetPath = path.join(buildConfig.options.outputRoot, path.basename(appFile))
        execSync(`cp -r "${appFile}" "${targetPath}"`)
        logSuccess(`已复制 ${path.basename(appFile)} 到 ${buildConfig.options.outputRoot}`)
      })
    } else if (platformName.startsWith('android')) {
      // Android: 处理APK文件
      processAndroidArtifacts(platformName, config)
    }
  } else {
    // 桌面端产物复制
    if (platformName.startsWith('mac')) {
      // macOS: 复制 .dmg 文件
      const dmgDir = path.join(config.sourceDir, 'dmg')
      if (fs.existsSync(dmgDir)) {
        const dmgFiles = fs.readdirSync(dmgDir).filter(file => file.endsWith('.dmg'))
        dmgFiles.forEach(dmgFile => {
          const sourcePath = path.join(dmgDir, dmgFile)
          const targetPath = path.join(buildConfig.options.outputRoot, dmgFile)
          execSync(`cp "${sourcePath}" "${targetPath}"`)
          logSuccess(`已复制 ${dmgFile} 到 ${buildConfig.options.outputRoot}`)
        })
      }
    } else if (platformName.startsWith('win')) {
      // Windows: 复制 .exe 文件
      const nsisDir = path.join(config.sourceDir, 'nsis')
      if (fs.existsSync(nsisDir)) {
        const exeFiles = fs.readdirSync(nsisDir).filter(file => file.endsWith('.exe'))
        exeFiles.forEach(exeFile => {
          const sourcePath = path.join(nsisDir, exeFile)
          const targetPath = path.join(buildConfig.options.outputRoot, exeFile)
          execSync(`cp "${sourcePath}" "${targetPath}"`)
          logSuccess(`已复制 ${exeFile} 到 ${buildConfig.options.outputRoot}`)
        })
      }
    } else if (platformName.startsWith('linux')) {
      // Linux: 复制 .deb, .rpm, .AppImage 文件
      const debDir = path.join(config.sourceDir, 'deb')
      const rpmDir = path.join(config.sourceDir, 'rpm')
      const appimageDir = path.join(config.sourceDir, 'appimage')

      ;[debDir, rpmDir, appimageDir].forEach(dir => {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir)
          files.forEach(file => {
            const sourcePath = path.join(dir, file)
            const targetPath = path.join(buildConfig.options.outputRoot, file)
            const stat = fs.statSync(sourcePath)

            if (stat.isDirectory()) {
              execSync(`cp -r "${sourcePath}" "${targetPath}"`)
            } else {
              execSync(`cp "${sourcePath}" "${targetPath}"`)
            }
            logSuccess(`已复制 ${file} 到 ${buildConfig.options.outputRoot}`)
          })
        }
      })
    }
  }
}

// 查找指定扩展名的文件
function findFiles(dir, extension, isDirectory = false) {
  const files = []

  function searchDir(currentDir) {
    if (!fs.existsSync(currentDir)) return

    const items = fs.readdirSync(currentDir)
    items.forEach(item => {
      const itemPath = path.join(currentDir, item)
      const stat = fs.statSync(itemPath)

      if (isDirectory && stat.isDirectory() && item.endsWith(extension)) {
        files.push(itemPath)
      } else if (!isDirectory && stat.isFile() && item.endsWith(extension)) {
        files.push(itemPath)
      } else if (stat.isDirectory()) {
        searchDir(itemPath)
      }
    })
  }

  searchDir(dir)
  return files
}

// 获取项目版本号
function getProjectVersion() {
  try {
    const packageJsonPath = path.join(PROJECT_ROOT, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    return packageJson.version || '0.0.1'
  } catch (error) {
    logWarning('无法读取版本号，使用默认版本 0.0.1')
    return '0.0.1'
  }
}

// 获取架构信息
function getArchitecture(platformName) {
  if (platformName.includes('x86')) {
    return 'x86_64'
  } else if (platformName.includes('aarch') || platformName.includes('arm')) {
    return 'aarch64'
  }
  return 'universal'
}

// 清理Android构建缓存
function cleanAndroidCache() {
  logStep('CLEAN', '清理Android构建缓存...')

  const cacheDirs = [
    path.join(PROJECT_ROOT, 'src-tauri/gen/android/app/build/intermediates'),
    path.join(PROJECT_ROOT, 'src-tauri/gen/android/app/build/tmp'),
    path.join(PROJECT_ROOT, 'src-tauri/gen/android/.gradle/caches'),
    path.join(PROJECT_ROOT, 'src-tauri/target/aarch64-linux-android'),
    path.join(PROJECT_ROOT, 'src-tauri/target/armv7-linux-androideabi'),
    path.join(PROJECT_ROOT, 'src-tauri/target/i686-linux-android'),
    path.join(PROJECT_ROOT, 'src-tauri/target/x86_64-linux-android'),
  ]

  cacheDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        execSync(`rm -rf "${dir}"`)
        logSuccess(`已清理缓存目录: ${path.relative(PROJECT_ROOT, dir)}`)
      } catch (error) {
        logWarning(`清理缓存目录失败: ${path.relative(PROJECT_ROOT, dir)}`)
      }
    }
  })
}

// 清理构建后的临时目录
function cleanBuildCache() {
  logStep('CLEAN', '清理构建缓存...')

  const targetDir = path.join(PROJECT_ROOT, 'src-tauri/target')

  if (fs.existsSync(targetDir)) {
    try {
      execSync(`rm -rf "${targetDir}"/*`)
      logSuccess(`已清理构建缓存目录: ${path.relative(PROJECT_ROOT, targetDir)}`)
    } catch (error) {
      logWarning(`清理构建缓存目录失败: ${path.relative(PROJECT_ROOT, targetDir)}`)
    }
  } else {
    logWarning('构建缓存目录不存在，跳过清理')
  }
}

// 对APK进行签名
function signApk(apkPath) {
  logStep('SIGN', '对APK进行调试签名...')

  const keystorePath = path.join(PROJECT_ROOT, 'debug.keystore')

  // 创建调试密钥库（如果不存在）
  if (!fs.existsSync(keystorePath)) {
    logStep('KEYSTORE', '创建调试密钥库...')
    try {
      execSync(
        `keytool -genkey -v -keystore "${keystorePath}" -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"`,
        {
          stdio: 'pipe',
        }
      )
      logSuccess('调试密钥库创建成功')
    } catch (error) {
      logError(`创建密钥库失败: ${error.message}`)
      throw error
    }
  }

  // 对APK进行签名
  try {
    execSync(
      `jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore "${keystorePath}" -storepass android -keypass android "${apkPath}" androiddebugkey`,
      {
        stdio: 'pipe',
      }
    )
    logSuccess('APK签名完成')
  } catch (error) {
    logError(`APK签名失败: ${error.message}`)
    throw error
  }
}

// 处理Android构建产物
function processAndroidArtifacts(platformName, config) {
  const version = getProjectVersion()
  const architecture = getArchitecture(platformName)
  const projectName = 'template-tauri-react'

  // 查找APK文件
  const apkFiles = findFiles(config.sourceDir, '.apk')

  apkFiles.forEach(apkFile => {
    try {
      // 对APK进行签名
      signApk(apkFile)

      // 生成新的文件名
      const newFileName = `${projectName}_${version}_${architecture}.apk`
      const targetPath = path.join(buildConfig.options.outputRoot, newFileName)

      // 复制并重命名APK文件
      execSync(`cp "${apkFile}" "${targetPath}"`)
      logSuccess(`已复制并重命名APK: ${newFileName}`)
    } catch (error) {
      logError(`处理APK文件失败: ${error.message}`)
      // 如果签名失败，仍然复制原始文件
      const fallbackName = `${projectName}_${version}_${architecture}_unsigned.apk`
      const fallbackPath = path.join(buildConfig.options.outputRoot, fallbackName)
      execSync(`cp "${apkFile}" "${fallbackPath}"`)
      logWarning(`已复制未签名APK: ${fallbackName}`)
    }
  })

  // 处理AAB文件
  const aabFiles = findFiles(config.sourceDir, '.aab')
  aabFiles.forEach(aabFile => {
    const newFileName = `${projectName}_${version}_${architecture}.aab`
    const targetPath = path.join(buildConfig.options.outputRoot, newFileName)
    execSync(`cp "${aabFile}" "${targetPath}"`)
    logSuccess(`已复制并重命名AAB: ${newFileName}`)
  })

  // 清理Android构建缓存
  cleanAndroidCache()
}

// 按平台类型分组构建
function buildByPlatformType(platformType) {
  const platforms = Object.entries(buildConfig.targets).filter(
    ([_, config]) => config.platform === platformType
  )

  if (platforms.length === 0) {
    logWarning(`没有找到 ${platformType} 平台配置`)
    return
  }

  logStep('GROUP', `开始构建 ${platformType} 平台: ${platforms.map(([name]) => name).join(', ')}`)

  for (const [platformName, config] of platforms) {
    buildPlatform(platformName, config)
  }
}

// 显示帮助信息
function showHelp() {
  const platforms = Object.keys(buildConfig.targets)
  const desktopPlatforms = platforms.filter(
    name => buildConfig.targets[name].platform === 'desktop'
  )
  const mobilePlatforms = platforms.filter(name => buildConfig.targets[name].platform === 'mobile')

  console.log('\n🚀 Tauri 多平台构建工具')
  console.log('\n用法:')
  console.log('  node scripts/build.js [平台名称|平台类型]')
  console.log('\n平台类型:')
  console.log('  desktop    - 构建所有桌面平台')
  console.log('  mobile     - 构建所有移动平台')
  console.log('\n可用平台:')

  if (desktopPlatforms.length > 0) {
    console.log('  桌面平台:', desktopPlatforms.join(', '))
  }

  if (mobilePlatforms.length > 0) {
    console.log('  移动平台:', mobilePlatforms.join(', '))
  }

  console.log('\n示例:')
  console.log('  node scripts/build.js                    # 构建所有平台')
  console.log('  node scripts/build.js desktop            # 构建所有桌面平台')
  console.log('  node scripts/build.js mobile             # 构建所有移动平台')
  console.log('  node scripts/build.js mac-x86            # 构建指定平台')
  console.log('')
}

// 主函数
function main() {
  const args = process.argv.slice(2)
  const target = args[0]

  // 显示帮助
  if (target === '--help' || target === '-h') {
    showHelp()
    return
  }

  log('🚀 Tauri 多平台构建工具', 'bright')
  log('================================', 'blue')

  try {
    // 检查构建环境
    if (!checkBuildEnvironment()) {
      logError('构建环境检查失败，请修复上述问题后重试')
      process.exit(1)
    }

    // 设置环境变量
    setEnvironmentVariables()

    // 执行代码格式化
    logStep('FORMAT', '执行代码格式化...')
    try {
      execSync('npm run format', { stdio: buildConfig.options.verbose ? 'inherit' : 'pipe' })
      logSuccess('代码格式化完成')
    } catch (error) {
      logError(`代码格式化失败: ${error.message}`)
      process.exit(1)
    }

    // 构建前端项目
    logStep('FRONTEND', '构建前端项目...')
    resetFrontendBuildState()
    if (!ensureFrontendBuild(false)) {
      logError('前端构建失败，无法继续构建')
      process.exit(1)
    }

    if (!target || target === 'all') {
      // 构建所有平台
      cleanOutputDir()
      const platforms = Object.entries(buildConfig.targets)
      logStep('PLATFORMS', `将构建以下平台: ${platforms.map(([name]) => name).join(', ')}`)

      for (const [platformName, config] of platforms) {
        buildPlatform(platformName, config)
      }
    } else if (target === 'desktop' || target === 'mobile') {
      // 按平台类型构建
      cleanOutputDir()
      buildByPlatformType(target)
    } else if (buildConfig.targets[target]) {
      // 构建指定平台
      execSync(`mkdir -p ${buildConfig.options.outputRoot}`)
      buildPlatform(target, buildConfig.targets[target])
    } else {
      logError(`未知的构建目标: ${target}`)
      showHelp()
      process.exit(1)
    }

    // 构建完成后清理缓存
    if (buildConfig.options.cleanAfterBuild !== false) {
      cleanBuildCache()
    }

    log('================================', 'blue')
    logSuccess('所有构建任务完成！')
    log(`📦 构建产物位置: ${buildConfig.options.outputRoot}`, 'magenta')

    // 显示构建统计信息
    if (frontendBuildTime > 0) {
      log(`⏱️  前端构建耗时: ${(frontendBuildTime / 1000).toFixed(2)}秒`, 'cyan')
    }
    if (frontendBuildChecked && frontendBuildSuccess) {
      log('✅ 前端构建状态: 成功', 'green')
    } else if (frontendBuildChecked) {
      log('❌ 前端构建状态: 失败', 'red')
    }
  } catch (error) {
    log('================================', 'blue')
    logError('构建过程中发生错误')
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export {
  buildPlatform,
  cleanOutputDir,
  main,
  ensureFrontendBuild,
  monitorFrontendBuild,
  resetFrontendBuildState,
  checkBuildEnvironment,
}
