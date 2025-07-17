# Template Tauri React

一个基于 Tauri + React + TypeScript + Vite 的现代化跨平台桌面应用模板。

[English](docs/README.en.md) | 中文

## 📋 项目概述

这是一个功能完整的 **Tauri + React + TypeScript**
桌面应用模板，集成了丰富的功能组件、动画效果、系统信息获取、网络请求、3D模型展示等特性。项目采用现代化的前后端分离架构，为桌面应用开发提供了完整的解决方案。

### ✨ 核心特性

- 🚀 **现代化技术栈**：React 18 + TypeScript + Vite + Tauri 2.0
- 🎨 **UI 框架**：Ant Design + UnoCSS 原子化CSS + SCSS
- 🔧 **开发工具**：ESLint + Prettier + VS Code 配置
- 📊 **状态管理**：Zustand + SWR 数据获取
- 🎭 **动画系统**：自定义动画组件 + CSS3 动画
- 🌐 **网络请求**：封装的 HTTP 客户端 + Tauri IPC 通信
- 🖥️ **系统信息**：实时系统监控 + 硬件信息获取
- 🎮 **3D 渲染**：Three.js 模型展示支持
- 🔒 **类型安全**：完整的 TypeScript 支持
- ⚡ **高性能**：Rust 后端 + 原生系统调用
- 🤖 **CI/CD 自动化**：GitHub Actions 多平台构建和自动发布

## 🎯 支持平台

- **桌面平台**：Windows (x64/ARM64)、macOS (Intel/Apple Silicon)、Linux
  (x64/ARM64)
- **移动平台**：iOS、Android

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **Rust**: >= 1.70.0
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd template-tauri-react

# 2. 安装依赖
npm install

# 3. 检查环境
npm run check:env

# 4. 启动开发服务器
npm run dev:tauri
```

### 常用命令

```bash
# 开发
npm run dev:tauri        # 启动 Tauri 开发模式
npm run dev:ios          # iOS 开发模式
npm run dev:android      # Android 开发模式

# 构建
npm run build:tauri      # 构建桌面应用
npm run build:ios        # 构建 iOS 应用
npm run build:android    # 构建 Android 应用

# 跨平台构建
npm run build:mac-x86    # macOS Intel
npm run build:mac-aarch  # macOS Apple Silicon
npm run build:win-x86    # Windows x64
npm run build:win-aarch  # Windows ARM64

# 代码质量
npm run lint             # ESLint 检查
npm run format           # Prettier 格式化
npm run type-check       # TypeScript 类型检查

# CI/CD (GitHub Actions)
# 推送标签自动构建和发布
git tag v1.0.0 && git push origin v1.0.0
```

## 📁 项目结构

```
template-tauri-react/
├── src-tauri/           # Tauri 后端（Rust）
│   ├── src/             # Rust 源码
│   ├── capabilities/    # 权限配置
│   ├── icons/           # 应用图标
│   └── tauri.conf.json  # Tauri 配置
├── src/                 # React 前端
│   ├── components/      # 可复用组件
│   ├── pages/           # 页面组件
│   ├── hooks/           # 自定义 Hooks
│   ├── stores/          # 状态管理
│   ├── router/          # 路由配置
│   └── assets/          # 静态资源
├── docs/                # 项目文档
├── scripts/             # 构建脚本
└── dist-builds/         # 构建产物
```

## 🎯 功能特性

- **🏠 首页功能**：实时系统监控、计数器演示、动画效果
- **🧩 功能组件**：跟随导航、全局弹窗、图标展示、路由过渡
- **🎭 动画系统**：透明度动画、缩放动画、自定义动画、过渡效果
- **🌐 网络请求**：HTTP客户端、IPC通信、SWR集成、错误处理
- **🎮 3D模型展示**：Three.js集成、GLB/GLTF支持、HDR环境贴图
- **🖥️ 系统功能**：系统信息、网络信息、硬盘信息、文件操作、窗口管理
- **🤖 CI/CD 自动化**：GitHub Actions 多平台自动构建、测试和发布

## 🚀 CI/CD 自动化

本项目配置了完整的 GitHub Actions CI/CD 工作流，支持：

### 🔄 自动化流程

- ✅ **自动测试**：ESLint 检查、TypeScript 类型检查
- 🏗️ **多平台构建**：macOS、Windows、Linux、iOS、Android
- 📦 **自动发布**：GitHub Releases 创建和构建产物上传
- 🧹 **资源清理**：自动清理临时文件，节省存储空间

### 🎯 使用方法

**自动发布** (推荐):

```bash
# 创建版本标签并推送
git tag v1.0.0
git push origin v1.0.0
# 工作流自动运行，构建所有平台并发布
```

**手动触发**:

1. 访问 GitHub Actions 页面
2. 选择 "Build and Release" 工作流
3. 点击 "Run workflow" 并配置选项
4. 选择构建目标和发布类型

详细说明请查看 [GitHub Actions 使用指南](docs/GITHUB_ACTIONS.md)

## 📚 文档

### 开发指南

- [环境配置指南](docs/ENVIRONMENT_SETUP.md) - 详细的环境配置说明
- [开发指南](docs/DEVELOPMENT_GUIDE.md) - 开发流程和最佳实践
- [构建部署指南](docs/BUILD_DEPLOYMENT.md) - 跨平台构建和部署
- [功能特性说明](docs/FEATURES.md) - 项目功能和特性介绍

### 平台特定

- [Android 构建指南](docs/ANDROID_BUILD.md) - Android 平台构建配置

### 工具和脚本

- [GitHub Actions CI/CD 指南](docs/GITHUB_ACTIONS.md) - 自动化构建和发布流程
- [前端构建优化与边界处理](docs/frontend-build-optimization.md) - 前端构建优化和边界处理功能
- [缓存清理指南](docs/CACHE_CLEANUP.md) - 构建缓存管理
- [故障排除指南](docs/TROUBLESHOOTING.md) - 常见问题解决方案

### API 参考

- [API 参考文档](docs/API_REFERENCE.md) - 完整的 API 接口文档

### 英文文档

- [English README](docs/README.en.md) - English version of main documentation
- [Environment Setup (EN)](docs/ENVIRONMENT_SETUP.en.md) - Environment
  configuration guide
- [Development Guide (EN)](docs/DEVELOPMENT_GUIDE.en.md) - Development workflow
  and best practices
- [Build & Deployment (EN)](docs/BUILD_DEPLOYMENT.en.md) - Cross-platform build
  and deployment
- [Features (EN)](docs/FEATURES.en.md) - Project features and capabilities
- [API Reference (EN)](docs/API_REFERENCE.en.md) - Complete API documentation
- [Android Build Guide (EN)](docs/ANDROID_BUILD.en.md) - Android platform build
  configuration
- [GitHub Actions CI/CD Guide (EN)](docs/GITHUB_ACTIONS.en.md) - Automated build
  and release workflow
- [Frontend Build Optimization (EN)](docs/frontend-build-optimization.en.md) -
  Frontend build optimization and edge case handling
- [Cache Cleanup (EN)](docs/CACHE_CLEANUP.en.md) - Build cache management
- [Troubleshooting (EN)](docs/TROUBLESHOOTING.en.md) - Common problem solutions

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！请查看 [贡献指南](docs/CONTRIBUTING.md)
了解详细信息。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。

## 🔗 相关链接

- [Tauri 官方文档](https://tauri.app/)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)

---

**如果这个模板对您有帮助，请给个 ⭐ Star！**
