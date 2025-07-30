# 构建部署指南

本文档详细说明了 Tauri +
React 项目的构建、打包和部署流程，包括各平台的特定配置和最佳实践。

## 📋 目录

- [构建概述](#构建概述)
- [开发构建](#开发构建)
- [生产构建](#生产构建)
- [跨平台构建](#跨平台构建)
- [移动平台构建](#移动平台构建)
- [构建优化](#构建优化)
- [部署策略](#部署策略)
- [自动化部署](#自动化部署)
- [故障排除](#故障排除)

## 📋 构建概览

本项目支持多种构建方式：

- 🖥️ **桌面应用**：Windows、macOS、Linux（支持 GitHub Actions 自动构建）
- 📱 **移动应用**：iOS、Android（需要本地配置和构建）
- 🔄 **自动化构建**：GitHub Actions CI/CD（仅桌面平台）
- 🛠️ **本地构建**：开发和测试环境

> **⚠️ 重要说明**：GitHub
> Actions 工作流目前仅支持桌面平台的自动构建和发布。移动平台（iOS/Android）需要在本地环境进行配置和构建。

## 构建概述

### 构建架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   源代码        │───►│   构建过程      │───►│   构建产物      │
│                 │    │                 │    │                 │
│ • React 前端    │    │ • Vite 构建     │    │ • 桌面应用      │
│ • Rust 后端     │    │ • Rust 编译     │    │ • 移动应用      │
│ • 静态资源      │    │ • 资源打包      │    │ • 安装包       │
│ • 配置文件      │    │ • 代码签名      │    │ • 更新包       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 构建流程

1. **前端构建**：Vite 编译 React 代码并优化资源
2. **后端编译**：Rust 编译器生成原生二进制文件
3. **资源整合**：将前端资源嵌入到 Tauri 应用中
4. **平台打包**：生成特定平台的安装包
5. **代码签名**：为应用添加数字签名（可选）
6. **分发准备**：生成最终的分发文件

## 开发构建

### 快速开发

```bash
# 启动开发服务器（热重载）
npm run dev

# 分别启动前后端
npm run dev:frontend  # 启动 React 开发服务器
npm run dev:tauri     # 启动 Tauri 开发模式
```

### 开发构建配置

```json
// tauri.conf.json - 开发配置
{
  "build": {
    "beforeDevCommand": "npm run dev:frontend",
    "beforeBuildCommand": "npm run build:frontend",
    "devPath": "http://localhost:1420",
    "distDir": "../dist"
  },
  "tauri": {
    "bundle": {
      "active": false // 开发时不打包
    }
  }
}
```

### 开发工具

```bash
# 代码质量检查
npm run lint          # ESLint 检查
npm run type-check    # TypeScript 类型检查
npm run format        # Prettier 格式化

# 测试
npm run test          # 运行测试
npm run test:watch    # 监视模式测试
npm run test:coverage # 测试覆盖率

# Rust 开发工具
cargo check           # 快速语法检查
cargo clippy          # Rust 代码检查
cargo fmt             # Rust 代码格式化
```

## 生产构建

### 基础构建

```bash
# 完整生产构建
npm run build:tauri

# 仅构建前端
npm run build:frontend

# 仅构建 Tauri 应用
npm run build:tauri-only
```

### 构建配置优化

#### Vite 配置优化

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  // 构建优化
  build: {
    // 输出目录
    outDir: 'dist',

    // 资源内联阈值
    assetsInlineLimit: 4096,

    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },

    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // 源码映射
    sourcemap: false,

    // 目标浏览器
    target: 'esnext',
  },

  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // 环境变量
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
```

#### Tauri 配置优化

```json
// tauri.conf.json - 生产配置
{
  "build": {
    "beforeBuildCommand": "npm run build:frontend",
    "distDir": "../dist"
  },
  "tauri": {
    "bundle": {
      "active": true,
      "targets": "all",

      // 应用信息
      "identifier": "com.example.tauri-react-template",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],

      // 资源优化
      "resources": [],
      "externalBin": [],

      // 版本信息
      "copyright": "Copyright © 2024 Your Company",
      "category": "DeveloperTool",
      "shortDescription": "Tauri React Template",
      "longDescription": "A modern desktop application built with Tauri and React"
    },

    // 安全配置
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
    },

    // 窗口配置
    "windows": [
      {
        "title": "Tauri React Template",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

### Rust 构建优化

```toml
# Cargo.toml - 发布配置
[profile.release]
opt-level = 3          # 最高优化级别
lto = true             # 链接时优化
codegen-units = 1      # 单个代码生成单元
panic = "abort"        # 崩溃时直接退出
strip = true           # 移除调试符号

# 依赖优化
[profile.release.package."*"]
opt-level = 3

# 开发配置
[profile.dev]
opt-level = 0
debug = true
incremental = true
```

## 本地开发构建

### 当前系统构建

由于项目已配置 GitHub
Actions 进行自动化构建和发布，本地开发环境只需要支持当前系统的构建即可：

```bash
# 构建当前系统的桌面应用
npm run build:tauri
```

> **📝 说明**：
>
> - GitHub Actions 会自动处理 Windows、macOS、Linux 的跨平台构建
> - 本地开发只需要关注当前系统的构建和调试
> - 这样可以显著减少本地构建时间和复杂度

## 移动平台构建

### Android 构建

#### 🔧 环境配置

**前置要求**:

- Android SDK
- Android NDK
- Java Development Kit (JDK) 8+

**环境变量设置**:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_NDK_ROOT="$ANDROID_HOME/ndk/26.1.10909125"
export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/darwin-x86_64/bin"
```

**验证环境**:

```bash
npm run check:env
```

#### 🏗️ 构建流程

**自动化构建（推荐）**:

```bash
npm run build:android
```

此命令会自动完成：

- 构建 Android APK
- 自动进行调试签名
- 按版本号和架构重命名文件
- 复制到 `dist-builds` 目录
- 清理构建缓存

**手动签名（可选）**:

```bash
npm run sign:android
```

#### 📦 构建产物

**文件位置**:

- **最终APK**: `dist-builds/template-tauri-react_版本号_架构.apk`
- **最终AAB**: `dist-builds/template-tauri-react_版本号_架构.aab`
- **调试密钥库**: `debug.keystore`（项目根目录）

**命名格式**:

- APK: `template-tauri-react_0.0.1_universal.apk`
- AAB: `template-tauri-react_0.0.1_universal.aab`

#### 📱 安装到设备

**启用开发者选项**:

1. 进入 **设置** > **关于手机**
2. 连续点击 **版本号** 7 次
3. 返回设置，进入 **开发者选项**
4. 启用 **USB 调试**

**安装方法**:

```bash
# 通过 ADB 安装
adb install dist-builds/template-tauri-react_0.0.1_universal.apk

# 或手动传输到设备安装
```

#### 🔍 故障排除

**"无效安装包" 错误**:

- 确保使用已签名的 APK 文件
- 运行 `npm run sign:android` 重新签名

**NDK 工具链错误**:

- 检查 `ANDROID_NDK_ROOT` 环境变量
- 验证 NDK 版本兼容性
- 查看 `.cargo/config.toml` 配置

**构建失败**:

```bash
# 清理缓存
npm run clean:all

# 重新安装依赖
npm install

# 检查环境
npm run check:env
```

#### Android 配置

```json
// tauri.conf.json - Android 配置
{
  "tauri": {
    "bundle": {
      "android": {
        "packageName": "com.example.tauri_react_template",
        "versionCode": 1,
        "versionName": "0.0.1",
        "minSdkVersion": 24,
        "compileSdkVersion": 34,
        "targetSdkVersion": 34
      }
    }
  }
}
```

### iOS 构建

**前提条件**：

- macOS 系统
- Xcode 12.0+
- iOS 开发者账号（用于设备部署）

```bash
# 初始化 iOS 项目
npm run tauri ios init

# 开发构建
npm run dev:ios

# 生产构建
npm run build:ios

# 构建并运行在模拟器
npm run ios:sim

# 构建并运行在设备
npm run ios:dev
```

#### iOS 配置

```json
// tauri.conf.json - iOS 配置
{
  "tauri": {
    "bundle": {
      "iOS": {
        "developmentTeam": "YOUR_TEAM_ID",
        "bundleIdentifier": "com.example.tauri-react-template",
        "bundleVersion": "1",
        "bundleShortVersionString": "0.0.1",
        "minimumSystemVersion": "13.0"
      }
    }
  }
}
```

## 构建优化

### 构建性能优化

#### 1. 并行构建

```bash
# 使用多核心编译 Rust
export CARGO_BUILD_JOBS=8

# 或在 .cargo/config.toml 中配置
[build]
jobs = 8
```

#### 2. 增量构建

```bash
# 启用 Rust 增量编译
export CARGO_INCREMENTAL=1

# 或在 Cargo.toml 中配置
[profile.dev]
incremental = true
```

#### 3. 缓存优化

```bash
# 使用 sccache 加速 Rust 编译
cargo install sccache
export RUSTC_WRAPPER=sccache

# 使用 npm 缓存
npm config set cache ~/.npm-cache
```

### 构建产物优化

#### 1. 资源压缩

```typescript
// vite.config.ts - 资源压缩
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    // Gzip 压缩
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),

    // Brotli 压缩
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
})
```

#### 2. 代码分割

```typescript
// 动态导入实现代码分割
const LazyComponent = React.lazy(() => import('./LazyComponent'))

// 路由级别的代码分割
const routes = [
  {
    path: '/dashboard',
    component: React.lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/settings',
    component: React.lazy(() => import('./pages/Settings')),
  },
]
```

#### 3. 资源优化

```bash
# 图片优化
npm install --save-dev imagemin imagemin-webp

# SVG 优化
npm install --save-dev svgo
```

## 部署策略

### 桌面应用分发

#### 1. 直接分发

```bash
# 生成安装包
npm run build:tauri

# 安装包位置
# Windows: src-tauri/target/release/bundle/msi/
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/deb/
```

#### 2. 应用商店分发

**macOS App Store**：

```bash
# 配置 App Store 构建
npm run build:macos-store

# 使用 Xcode 上传到 App Store Connect
```

**Microsoft Store**：

```bash
# 生成 MSIX 包
npm run build:windows-store

# 使用 Partner Center 上传
```

#### 3. 自动更新

```json
// tauri.conf.json - 自动更新配置
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.example.com/{{target}}/{{current_version}}"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY"
    }
  }
}
```

### 移动应用分发

#### iOS App Store

```bash
# 构建发布版本
npm run build:ios:release

# 使用 Xcode 归档和上传
xcodebuild archive -workspace ios/App.xcworkspace -scheme App -archivePath App.xcarchive
xcodebuild -exportArchive -archivePath App.xcarchive -exportPath . -exportOptionsPlist ExportOptions.plist
```

#### Google Play Store

```bash
# 构建发布版本
npm run build:android:release

# 签名 APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key.keystore app-release-unsigned.apk alias_name

# 对齐 APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## 自动化部署

### 🤖 自动化部署

#### GitHub Actions

项目已配置完整的 GitHub Actions CI/CD 工作流，支持自动构建、测试和发布。

##### 🚀 功能特性

- ✅ **前端测试**: ESLint 检查、TypeScript 类型检查
- 🏗️ **多平台构建**: Windows、macOS、Linux 自动构建
- 📦 **自动发布**: GitHub Releases 创建和构建产物上传
- 🧹 **资源清理**: 自动清理临时文件，节省存储空间

##### 📋 支持平台

###### 桌面平台（GitHub Actions 自动构建）

- **macOS**: Intel (x86_64) 和 Apple Silicon (ARM64)
- **Windows**: x86_64 和 ARM64
- **Linux**: x86_64 和 ARM64 (AppImage, DEB, RPM)

###### 移动平台（需要本地配置）

- **iOS**: 需要 macOS 环境和 Xcode
- **Android**: 需要 Android SDK 和 NDK

##### 🔧 触发方式

1. **标签推送**: 推送以 `v` 开头的标签（如 `v1.0.0`）
2. **手动触发**: 在 GitHub Actions 页面手动运行
3. **Pull Request**: 自动运行测试（不发布）
4. **推送到主分支**: 运行测试构建

##### 🛠️ 使用方法

###### 自动发布（推荐）

```bash
# 创建并推送标签
git tag v1.0.0
git push origin v1.0.0

# 工作流将自动:
# 1. 运行前端测试
# 2. 构建所有平台
# 3. 创建 GitHub Release
# 4. 上传构建产物
```

###### 手动触发

1. 访问 GitHub Actions 页面
2. 选择 "Build and Release" 工作流
3. 点击 "Run workflow"
4. 配置构建选项（桌面/移动/全部）
5. 选择发布类型（正式/预发布/草稿）

##### 📦 构建产物

构建完成后，可在 GitHub Releases 页面下载：

- **macOS**: `.dmg` 安装包和 `.app` 应用包
- **Windows**: `.exe` 安装程序和 `.msi` 安装包
- **Linux**: `.AppImage`、`.deb` 和 `.rpm` 包

###### 文件命名规则

```
{应用名}-{版本号}-{平台标识}.{扩展名}
```

示例：

- `template-tauri-react-1.0.0-macOS-Intel.dmg`
- `template-tauri-react-1.0.0-Windows-x64.exe`
- `template-tauri-react-1.0.0-Linux-x64.AppImage`

##### 🔒 安全配置

###### 必需的 Secrets

- `GITHUB_TOKEN`: 自动提供，用于创建 Release

###### 可选的 Secrets（用于代码签名）

- `APPLE_CERTIFICATE`: macOS 应用签名证书
- `ANDROID_KEYSTORE`: Android 应用签名密钥

```yaml
# 支持的平台
platforms:
  desktop: [macos, windows, linux] # 自动构建
  mobile: [ios, android] # 需要本地配置
```

> **注意**: 移动端（iOS/Android）构建需要本地环境配置，GitHub Actions 暂不支持。

```yaml
# .github/workflows/build.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, ubuntu-20.04, windows-latest]

    runs-on: ${{ matrix.platform }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets:
            ${{ matrix.platform == 'macos-latest' &&
            'aarch64-apple-darwin,x86_64-apple-darwin' || '' }}

      - name: Install dependencies (Ubuntu)
        if: matrix.platform == 'ubuntu-20.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf

      - name: Install frontend dependencies
        run: npm ci

      - name: Build application
        run: npm run build:tauri
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.platform }}-build
          path: src-tauri/target/release/bundle/

  release:
    needs: build
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/')

    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: '**/*'
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 自动更新服务器

```javascript
// update-server.js
const express = require('express')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 3000

// 更新检查端点
app.get('/update/:platform/:version', (req, res) => {
  const { platform, version } = req.params

  // 检查是否有新版本
  const latestVersion = getLatestVersion()

  if (isNewerVersion(latestVersion, version)) {
    const updateInfo = {
      version: latestVersion,
      notes: getReleaseNotes(latestVersion),
      pub_date: new Date().toISOString(),
      platforms: {
        [platform]: {
          signature: getSignature(platform, latestVersion),
          url: getDownloadUrl(platform, latestVersion),
        },
      },
    }

    res.json(updateInfo)
  } else {
    res.status(204).send()
  }
})

function getLatestVersion() {
  // 从文件系统或数据库获取最新版本
  return '1.0.1'
}

function isNewerVersion(latest, current) {
  // 版本比较逻辑
  return latest !== current
}

function getSignature(platform, version) {
  // 获取文件签名
  const filePath = path.join(__dirname, 'releases', platform, version)
  const fileBuffer = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(fileBuffer).digest('hex')
}

function getDownloadUrl(platform, version) {
  return `https://releases.example.com/${platform}/${version}`
}

function getReleaseNotes(version) {
  return `Release notes for version ${version}`
}

app.listen(PORT, () => {
  console.log(`Update server running on port ${PORT}`)
})
```

## 故障排除

### 常见构建问题

#### 1. 内存不足

```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=8192"

# 减少 Rust 并行编译任务
export CARGO_BUILD_JOBS=2
```

#### 2. 依赖冲突

```bash
# 清理缓存
npm cache clean --force
cargo clean

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

#### 3. 本地构建失败

```bash
# 检查 Rust 工具链
rustup update
rustup default stable

# 检查 Tauri CLI
cargo install tauri-cli
```

### 构建日志分析

```bash
# 启用详细日志
export RUST_LOG=debug
export TAURI_DEBUG=1

# 构建时显示详细信息
npm run build:tauri -- --verbose

# 分析构建产物大小
npm run analyze
```

### 性能分析

```bash
# 分析构建时间
time npm run build:tauri

# 分析 Rust 编译时间
cargo build --timings

# 分析前端构建
npm run build:frontend -- --profile
```

---

更多信息请参考：

- [环境配置指南](ENVIRONMENT_SETUP.md)
- [开发指南](DEVELOPMENT_GUIDE.md)
- [故障排除指南](TROUBLESHOOTING.md)
- [缓存清理指南](CACHE_CLEANUP.md)
