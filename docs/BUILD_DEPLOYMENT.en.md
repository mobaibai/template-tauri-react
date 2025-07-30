# Build & Deployment Guide

This document provides detailed instructions for building, packaging, and
deploying Tauri + React projects, including platform-specific configurations and
best practices.

## 📋 Table of Contents

- [Build Overview](#build-overview)
- [Development Build](#development-build)
- [Production Build](#production-build)
- [Local Build](#local-build)
- [Mobile Platform Build](#mobile-platform-build)
- [Build Optimization](#build-optimization)
- [Deployment Strategies](#deployment-strategies)
- [Automated Deployment](#automated-deployment)
- [Troubleshooting](#troubleshooting)

## Build Overview

This project supports multiple build approaches:

- 🖥️ **Desktop Applications**: Windows, macOS, Linux (GitHub Actions automated
  builds)
- 📱 **Mobile Applications**: iOS, Android (local configuration and builds
  required)
- 🔄 **Automated Builds**: GitHub Actions CI/CD (desktop platforms only)
- 🛠️ **Local Builds**: Development and testing environments

> **⚠️ Important Note**: GitHub Actions workflow currently only supports
> automated building and releasing for desktop platforms. Mobile platforms
> (iOS/Android) require local environment configuration and building.

### Build Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Source Code   │───►│   Build Process │───►│   Build Output  │
│                 │    │                 │    │                 │
│ • React Frontend│    │ • Vite Build    │    │ • Desktop App   │
│ • Rust Backend  │    │ • Rust Compile  │    │ • Mobile App    │
│ • Static Assets │    │ • Asset Bundle  │    │ • Installers    │
│ • Config Files  │    │ • Code Signing  │    │ • Update Packs  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Build Process

1. **Frontend Build**: Vite compiles React code and optimizes assets
2. **Backend Compile**: Rust compiler generates native binaries
3. **Asset Integration**: Frontend assets are embedded into Tauri app
4. **Platform Packaging**: Generate platform-specific installers
5. **Code Signing**: Add digital signatures to apps (optional)
6. **Distribution Prep**: Generate final distribution files

## Development Build

### Quick Development

```bash
# Start development server (hot reload)
npm run dev

# Start frontend and backend separately
npm run dev:frontend  # Start React dev server
npm run dev:tauri     # Start Tauri dev mode
```

### Development Build Configuration

```json
// tauri.conf.json - Development config
{
  "build": {
    "beforeDevCommand": "npm run dev:frontend",
    "beforeBuildCommand": "npm run build:frontend",
    "devPath": "http://localhost:1420",
    "distDir": "../dist"
  },
  "tauri": {
    "bundle": {
      "active": false // No bundling in dev mode
    }
  }
}
```

### Development Tools

```bash
# Code quality checks
npm run lint          # ESLint check
npm run type-check    # TypeScript type check
npm run format        # Prettier formatting

# Testing
npm run test          # Run tests
npm run test:watch    # Watch mode testing
npm run test:coverage # Test coverage

# Rust development tools
cargo check           # Quick syntax check
cargo clippy          # Rust code linting
cargo fmt             # Rust code formatting
```

## Production Build

### Basic Build

```bash
# Complete production build
npm run build:tauri

# Frontend only
npm run build:frontend

# Tauri app only
npm run build:tauri-only
```

### Build Configuration Optimization

#### Vite Configuration Optimization

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  // Build optimization
  build: {
    // Output directory
    outDir: 'dist',

    // Asset inline threshold
    assetsInlineLimit: 4096,

    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },

    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Source maps
    sourcemap: false,

    // Target browsers
    target: 'esnext',
  },

  // Path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
```

#### Tauri Configuration Optimization

```json
// tauri.conf.json - Production config
{
  "build": {
    "beforeBuildCommand": "npm run build:frontend",
    "distDir": "../dist"
  },
  "tauri": {
    "bundle": {
      "active": true,
      "targets": "all",

      // App information
      "identifier": "com.example.tauri-react-template",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],

      // Resource optimization
      "resources": [],
      "externalBin": [],

      // Version information
      "copyright": "Copyright © 2024 Your Company",
      "category": "DeveloperTool",
      "shortDescription": "Tauri React Template",
      "longDescription": "A modern desktop application built with Tauri and React"
    },

    // Security configuration
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
    },

    // Window configuration
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

### Rust Build Optimization

```toml
# Cargo.toml - Release configuration
[profile.release]
opt-level = 3          # Maximum optimization
lto = true             # Link-time optimization
codegen-units = 1      # Single codegen unit
panic = "abort"        # Abort on panic
strip = true           # Strip debug symbols

# Dependency optimization
[profile.release.package."*"]
opt-level = 3

# Development configuration
[profile.dev]
opt-level = 0
debug = true
incremental = true
```

## Local Build

> **Important**: Cross-platform builds are handled by GitHub Actions. Local
> development only needs to build for current system.

### Local Development Build

For local development, you only need to build for your current system:

```bash
# Build for current system
npm run build:tauri
```

### GitHub Actions Automated Build

The project uses GitHub Actions for automated cross-platform builds. When you
push a tag or manually trigger the workflow, it will automatically build for all
supported platforms (Windows, macOS, Linux).

## Mobile Platform Build

### iOS Build

**Prerequisites**:

- macOS system
- Xcode 12.0+
- iOS Developer Account (for device deployment)

```bash
# Initialize iOS project
npm run tauri ios init

# Development build
npm run dev:ios

# Production build
npm run build:ios

# Build and run on simulator
npm run ios:sim

# Build and run on device
npm run ios:dev
```

#### iOS Configuration

```json
// tauri.conf.json - iOS configuration
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

### Android Build

**Prerequisites**:

- Android Studio or Android SDK
- Android NDK
- Java 11+

```bash
# Initialize Android project
npm run tauri android init

# Development build
npm run dev:android

# Production build
npm run build:android

# Build and run on emulator
npm run android:emu

# Build and run on device
npm run android:dev
```

#### Android Configuration

```json
// tauri.conf.json - Android configuration
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

## Build Optimization

### Build Performance Optimization

#### 1. Parallel Building

```bash
# Use multi-core Rust compilation
export CARGO_BUILD_JOBS=8

# Or configure in .cargo/config.toml
[build]
jobs = 8
```

#### 2. Incremental Building

```bash
# Enable Rust incremental compilation
export CARGO_INCREMENTAL=1

# Or configure in Cargo.toml
[profile.dev]
incremental = true
```

#### 3. Cache Optimization

```bash
# Use sccache for Rust compilation acceleration
cargo install sccache
export RUSTC_WRAPPER=sccache

# Use npm cache
npm config set cache ~/.npm-cache
```

### Build Output Optimization

#### 1. Asset Compression

```typescript
// vite.config.ts - Asset compression
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),

    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
})
```

#### 2. Code Splitting

```typescript
// Dynamic imports for code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'))

// Route-level code splitting
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

#### 3. Asset Optimization

```bash
# Image optimization
npm install --save-dev imagemin imagemin-webp

# SVG optimization
npm install --save-dev svgo
```

## Deployment Strategies

### Desktop App Distribution

#### 1. Direct Distribution

```bash
# Generate installers
npm run build:tauri

# Installer locations
# Windows: src-tauri/target/release/bundle/msi/
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/deb/
```

#### 2. App Store Distribution

**macOS App Store**:

```bash
# Configure App Store build
npm run build:macos-store

# Upload to App Store Connect using Xcode
```

**Microsoft Store**:

```bash
# Generate MSIX package
npm run build:windows-store

# Upload using Partner Center
```

#### 3. Auto-Update

```json
// tauri.conf.json - Auto-update configuration
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

### Mobile App Distribution

#### iOS App Store

```bash
# Build release version
npm run build:ios:release

# Archive and upload using Xcode
xcodebuild archive -workspace ios/App.xcworkspace -scheme App -archivePath App.xcarchive
xcodebuild -exportArchive -archivePath App.xcarchive -exportPath . -exportOptionsPlist ExportOptions.plist
```

#### Google Play Store

```bash
# Build release version
npm run build:android:release

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key.keystore app-release-unsigned.apk alias_name

# Align APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## Automated Deployment

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

### Auto-Update Server

```javascript
// update-server.js
const express = require('express')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 3000

// Update check endpoint
app.get('/update/:platform/:version', (req, res) => {
  const { platform, version } = req.params

  // Check for new version
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
  // Get latest version from filesystem or database
  return '1.0.1'
}

function isNewerVersion(latest, current) {
  // Version comparison logic
  return latest !== current
}

function getSignature(platform, version) {
  // Get file signature
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

## Troubleshooting

### Common Build Issues

#### 1. Out of Memory

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Reduce Rust parallel compilation
export CARGO_BUILD_JOBS=2
```

#### 2. Dependency Conflicts

```bash
# Clean cache
npm cache clean --force
cargo clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 3. Local build failures

```bash
# Check Rust toolchain
rustup update
rustup default stable

# Check Tauri CLI
cargo install tauri-cli
```

### Build Log Analysis

```bash
# Enable verbose logging
export RUST_LOG=debug
export TAURI_DEBUG=1

# Show detailed build information
npm run build:tauri -- --verbose

# Analyze build output size
npm run analyze
```

### Performance Analysis

```bash
# Analyze build time
time npm run build:tauri

# Analyze Rust compilation time
cargo build --timings

# Analyze frontend build
npm run build:frontend -- --profile
```

---

For more information, please refer to:

- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md)
- [Development Guide](DEVELOPMENT_GUIDE.en.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Cache Cleanup Guide](CACHE_CLEANUP.md)
