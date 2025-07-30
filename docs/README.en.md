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
pnpm install

# 3. Check environment
pnpm run check:env

# 4. Start development server
pnpm run dev:tauri
```

### Common Commands

```bash
# Development
pnpm run dev:tauri        # Start Tauri development mode
pnpm run dev:ios          # iOS development mode
pnpm run dev:android      # Android development mode

# Build
pnpm run build:tauri      # Build desktop application
pnpm run build:ios        # Build iOS application
pnpm run build:android    # Build Android application

# Local build
pnpm run build:tauri      # Current system desktop app

# Note: PC cross-platform builds are handled by GitHub Actions

# Code quality
pnpm run lint             # ESLint check
pnpm run format           # Prettier formatting
pnpm run type-check       # TypeScript type check

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

### Core Documentation

- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md) - Detailed environment
  configuration instructions
- [Development Guide](DEVELOPMENT_GUIDE.en.md) - Development workflow, API
  reference and troubleshooting
- [Build & Deployment Guide](BUILD_DEPLOYMENT.en.md) - Local build, CI/CD and
  mobile deployment
  > > > > > > > dev

### Chinese Documentation

- [中文 README](../README.md) - 主要文档的中文版本
- [环境配置指南](ENVIRONMENT_SETUP.md) - 环境配置说明
- [开发指南](DEVELOPMENT_GUIDE.md) - 开发流程、API参考和故障排除
- [构建部署指南](BUILD_DEPLOYMENT.md) - 本地构建、CI/CD和移动端部署

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
