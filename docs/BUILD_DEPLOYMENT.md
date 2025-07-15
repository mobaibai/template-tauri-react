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

## 跨平台构建

### 支持的平台

| 平台        | 架构          | 构建命令                          | 输出格式                        | 说明                         |
| ----------- | ------------- | --------------------------------- | ------------------------------- | ---------------------------- |
| Windows     | x64           | `npm run build:windows-x64`       | `.msi`, `.exe`                  | 兼容 ARM64 芯片              |
| ~~Windows~~ | ~~ARM64~~     | ~~`npm run build:windows-arm64`~~ | ~~`.msi`, `.exe`~~              | **已移除**: x64版本兼容ARM64 |
| macOS       | Intel         | `npm run build:macos-x64`         | `.dmg`, `.app`                  | Intel 芯片专用               |
| macOS       | Apple Silicon | `npm run build:macos-arm64`       | `.dmg`, `.app`                  | Apple Silicon 芯片专用       |
| Linux       | x64           | `npm run build:linux-x64`         | `.deb`, `.rpm`, `.AppImage`     | 兼容 ARM64 芯片              |
| ~~Linux~~   | ~~ARM64~~     | ~~`npm run build:linux-arm64`~~   | ~~`.deb`, `.rpm`, `.AppImage`~~ | **已移除**: x64版本兼容ARM64 |

> **重要变更说明**:
>
> - **Windows ARM64**: 已移除专用 ARM64 构建，x64 版本可在 ARM64 芯片上正常运行
> - **Linux ARM64**: 已移除专用 ARM64 构建，x64 版本可在 ARM64 芯片上正常运行
> - **macOS**: 保留两个架构的原生构建，因为性能差异显著
>
> 这样做的好处：
>
> - 减少构建时间和维护成本
> - 简化分发流程
> - x64 版本在 ARM64 上的兼容性已经足够好

### 跨平台构建脚本

```bash
#!/bin/bash
# scripts/build-all-platforms.sh

set -e

echo "🚀 开始跨平台构建..."

# 检查环境
echo "📋 检查构建环境..."
npm run check:env

# 清理之前的构建
echo "🧹 清理构建缓存..."
npm run clean

# 构建前端
echo "⚛️ 构建 React 前端..."
npm run build:frontend

# 当前平台构建
echo "🖥️ 构建当前平台..."
npm run build:tauri

# 跨平台构建（如果支持）
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "🍎 macOS 平台检测到，构建所有 macOS 目标..."
  npm run build:macos-x64
  npm run build:macos-arm64

  # 如果安装了交叉编译工具
  if command -v cargo-xwin &> /dev/null; then
    echo "🪟 交叉编译 Windows 目标..."
    npm run build:windows-x64
    npm run build:windows-arm64
  fi
fi

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  echo "🐧 Linux 平台检测到，构建 Linux 目标..."
  npm run build:linux-x64
fi

echo "✅ 跨平台构建完成！"
echo "📦 构建产物位置: src-tauri/target/release/bundle/"
```

### 交叉编译配置

#### Windows 交叉编译（在 macOS/Linux 上）

```bash
# 安装 cargo-xwin
cargo install --locked cargo-xwin

# 安装 Windows 目标
rustup target add x86_64-pc-windows-msvc
rustup target add aarch64-pc-windows-msvc

# 配置 .cargo/config.toml
[target.x86_64-pc-windows-msvc]
linker = "cargo-xwin"

[target.aarch64-pc-windows-msvc]
linker = "cargo-xwin"
```

#### 构建脚本配置

```json
// package.json - 跨平台构建脚本
{
  "scripts": {
    "build:windows-x64": "tauri build --target x86_64-pc-windows-msvc",
    "build:windows-arm64": "tauri build --target aarch64-pc-windows-msvc",
    "build:macos-x64": "tauri build --target x86_64-apple-darwin",
    "build:macos-arm64": "tauri build --target aarch64-apple-darwin",
    "build:linux-x64": "tauri build --target x86_64-unknown-linux-gnu",
    "build:all": "npm run build:frontend && npm run build:all-targets",
    "build:all-targets": "tauri build --target universal-apple-darwin"
  }
}
```

## 移动平台构建

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
        "bundleShortVersionString": "1.0.0",
        "minimumSystemVersion": "13.0"
      }
    }
  }
}
```

### Android 构建

**前提条件**：

- Android Studio 或 Android SDK
- Android NDK
- Java 11+

```bash
# 初始化 Android 项目
npm run tauri android init

# 开发构建
npm run dev:android

# 生产构建
npm run build:android

# 构建并运行在模拟器
npm run android:emu

# 构建并运行在设备
npm run android:dev
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
        "versionName": "1.0.0",
        "minSdkVersion": 24,
        "compileSdkVersion": 34,
        "targetSdkVersion": 34
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

### GitHub Actions

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

#### 3. 跨平台编译失败

```bash
# 检查目标是否已安装
rustup target list --installed

# 安装缺失的目标
rustup target add x86_64-pc-windows-msvc

# 检查交叉编译工具
which cargo-xwin
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
