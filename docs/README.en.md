# Template Tauri React

A modern cross-platform desktop application template based on Tauri + React +
TypeScript + Vite.

[中文](../README.md) | English

## 📋 Project Overview

This is a feature-complete **Tauri + React + TypeScript** desktop application
template that integrates rich functional components, animation effects, system
information retrieval, network requests, 3D model display, and other features.
The project adopts a modern front-end and back-end separation architecture,
providing a complete solution for desktop application development.

### ✨ Core Features

- 🚀 **Modern Tech Stack**: React 18 + TypeScript + Vite + Tauri 2.0
- 🎨 **UI Framework**: Ant Design + UnoCSS Atomic CSS + SCSS
- 🔧 **Development Tools**: ESLint + Prettier + VS Code Configuration
- 📊 **State Management**: Zustand + SWR Data Fetching
- 🎭 **Animation System**: Custom Animation Components + CSS3 Animations
- 🌐 **Network Requests**: Encapsulated HTTP Client + Tauri IPC Communication
- 🖥️ **System Information**: Real-time System Monitoring + Hardware Information
  Retrieval
- 🎮 **3D Rendering**: Three.js Model Display Support
- 🔒 **Type Safety**: Complete TypeScript Support
- ⚡ **High Performance**: Rust Backend + Native System Calls
- 🤖 **CI/CD Automation**: GitHub Actions multi-platform build and auto-release

## 🎯 Supported Platforms

- **Desktop Platforms**: Windows (x64/ARM64), macOS (Intel/Apple Silicon), Linux
  (x64/ARM64)
- **Mobile Platforms**: iOS, Android

## 🚀 Quick Start

### Environment Requirements

- **Node.js**: >= 18.0.0
- **Rust**: >= 1.70.0
- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### Installation Steps

```bash
# 1. Clone the project
git clone <repository-url>
cd template-tauri-react

# 2. Install dependencies
npm install

# 3. Check environment
npm run check:env

# 4. Start development server
npm run dev:tauri
```

### Common Commands

```bash
# Development
npm run dev:tauri        # Start Tauri development mode
npm run dev:ios          # iOS development mode
npm run dev:android      # Android development mode

# Build
npm run build:tauri      # Build desktop application
npm run build:ios        # Build iOS application
npm run build:android    # Build Android application

# Cross-platform build
npm run build:mac-x86    # macOS Intel
npm run build:mac-aarch  # macOS Apple Silicon
npm run build:win-x86    # Windows x64
npm run build:win-aarch  # Windows ARM64

# Code quality
npm run lint             # ESLint check
npm run format           # Prettier formatting
npm run type-check       # TypeScript type check

# CI/CD (GitHub Actions)
# Push tag for automatic build and release
git tag v0.0.1 && git push origin v0.0.1
```

## 📁 Project Structure

```
template-tauri-react/
├── src-tauri/           # Tauri backend (Rust)
│   ├── src/             # Rust source code
│   ├── capabilities/    # Permission configuration
│   ├── icons/           # Application icons
│   └── tauri.conf.json  # Tauri configuration
├── src/                 # React frontend
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom Hooks
│   ├── stores/          # State management
│   ├── router/          # Router configuration
│   └── assets/          # Static assets
├── docs/                # Project documentation
├── scripts/             # Build scripts
└── dist-builds/         # Build artifacts
```

## 🎯 Features

- **🏠 Home Features**: Real-time system monitoring, counter demo, animation
  effects
- **🧩 Functional Components**: Follow navigation, global popups, icon display,
  route transitions
- **🎭 Animation System**: Opacity animations, scale animations, custom
  animations, transition effects
- **🌐 Network Requests**: HTTP client, IPC communication, SWR integration,
  error handling
- **🎮 3D Model Display**: Three.js integration, GLB/GLTF support, HDR
  environment mapping
- **🖥️ System Functions**: System information, network information, disk
  information, file operations, window management
- **🤖 CI/CD Automation**: GitHub Actions multi-platform automated build, test,
  and release

## 🚀 CI/CD Automation

This project includes a complete GitHub Actions CI/CD workflow that supports:

### 🔄 Automation Pipeline

- ✅ **Automated Testing**: ESLint checks, TypeScript type checking
- 🏗️ **Multi-platform Building**: macOS, Windows, Linux (Desktop platforms)
- 📦 **Auto Release**: GitHub Releases creation and artifact upload
- 🧹 **Resource Cleanup**: Automatic cleanup of temporary files to save storage

> **⚠️ Important Note**: The current GitHub Actions workflow only supports
> automated building and releasing for desktop platforms (macOS, Windows,
> Linux). For iOS and Android app building, please refer to the relevant
> documentation for local configuration.

### 🎯 Usage

**Automatic Release** (Recommended):

```bash
# Create version tag and push
git tag v0.0.1
git push origin v0.0.1
# Workflow runs automatically, builds all platforms and releases
```

**Manual Trigger**:

1. Visit GitHub Actions page
2. Select "Build and Release" workflow
3. Click "Run workflow" and configure options
4. Choose build target and release type

For detailed instructions, see [GitHub Actions Guide](GITHUB_ACTIONS.en.md)

## 📚 Documentation

### Development Guides

- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md) - Detailed environment
  configuration instructions
- [Development Guide](DEVELOPMENT_GUIDE.en.md) - Development workflow and best
  practices
- [Build & Deployment Guide](BUILD_DEPLOYMENT.en.md) - Cross-platform build and
  deployment
- [Features Documentation](FEATURES.en.md) - Project features and capabilities

### Platform Specific

- [Android Build Guide](ANDROID_BUILD.en.md) - Android platform build
  configuration

### Tools and Scripts

- [GitHub Actions CI/CD Guide](GITHUB_ACTIONS.en.md) - Automated build and
  release workflow
- [Frontend Build Optimization](frontend-build-optimization.en.md) - Frontend
  build optimization and edge case handling
- [Cache Cleanup Guide](CACHE_CLEANUP.en.md) - Build cache management
- [Troubleshooting Guide](TROUBLESHOOTING.en.md) - Common problem solutions

### API Reference

- [API Reference Documentation](API_REFERENCE.en.md) - Complete API interface
  documentation

### Chinese Documentation

- [中文 README](../README.md) - 主要文档的中文版本
- [环境配置指南](ENVIRONMENT_SETUP.md) - 环境配置说明
- [开发指南](DEVELOPMENT_GUIDE.md) - 开发流程和最佳实践
- [构建部署指南](BUILD_DEPLOYMENT.md) - 跨平台构建和部署
- [功能特性说明](FEATURES.md) - 项目功能和特性介绍
- [API 参考文档](API_REFERENCE.md) - 完整的 API 接口文档
- [Android 构建指南](ANDROID_BUILD.md) - Android 平台构建配置

- [GitHub Actions CI/CD 指南](GITHUB_ACTIONS.md) - 自动化构建和发布流程
- [前端构建优化与边界处理](frontend-build-optimization.md) - 前端构建优化和边界处理功能
- [缓存清理指南](CACHE_CLEANUP.md) - 构建缓存管理
- [故障排除指南](TROUBLESHOOTING.md) - 常见问题解决方案

## 🤝 Contributing

Welcome to submit Issues and Pull Requests! Please check the
[Contributing Guide](CONTRIBUTING.en.md) for detailed information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE)
file for details.

## 🔗 Related Links

- [Tauri Official Documentation](https://tauri.app/)
- [React Official Documentation](https://react.dev/)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [Vite Official Documentation](https://vitejs.dev/)

---

**If this template helps you, please give it a ⭐ Star!**
