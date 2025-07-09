# Docker 开发环境指南

本文档介绍如何使用 Docker 来创建标准化的 Tauri + React 开发环境。

## 🐳 为什么使用 Docker？

- **环境一致性**：确保所有开发者使用相同的开发环境
- **快速设置**：无需手动安装和配置各种工具
- **隔离性**：避免本地环境污染和冲突
- **跨平台**：在 Windows、macOS、Linux 上提供一致的体验
- **CI/CD 友好**：与持续集成环境保持一致

## 📋 前置要求

### 必需软件

1. **Docker Desktop**
   - [Windows](https://docs.docker.com/desktop/windows/install/)
   - [macOS](https://docs.docker.com/desktop/mac/install/)
   - [Linux](https://docs.docker.com/desktop/linux/install/)

2. **Docker Compose**
   - 通常随 Docker Desktop 一起安装
   - Linux 用户可能需要单独安装

### 系统要求

- **内存**：至少 8GB RAM（推荐 16GB）
- **存储**：至少 20GB 可用空间
- **CPU**：支持虚拟化的多核处理器

## 🚀 快速开始

### 1. 构建开发环境

```bash
# 克隆项目
git clone <your-repo-url>
cd template-tauri-react

# 构建 Docker 镜像
docker-compose -f docker-compose.dev.yml build
```

### 2. 启动开发环境

```bash
# 启动开发容器
docker-compose -f docker-compose.dev.yml up -d

# 进入开发容器
docker-compose -f docker-compose.dev.yml exec tauri-dev bash
```

### 3. 开始开发

在容器内执行：

```bash
# 检查环境
npm run check:env

# 桌面开发
npm run dev

# Android 开发
npm run dev:android
```

## 📱 Android 开发

### 启动 Android 模拟器

```bash
# 方法 1: 在主容器中启动
docker-compose -f docker-compose.dev.yml exec tauri-dev bash
npm run emulator:start

# 方法 2: 使用独立的模拟器服务
docker-compose -f docker-compose.dev.yml --profile emulator up android-emulator -d
```

### Android 开发工作流

```bash
# 进入开发容器
docker-compose -f docker-compose.dev.yml exec tauri-dev bash

# 检查 Android 环境
npm run check:env

# 初始化 Android 项目
npm run init:android

# 启动模拟器
npm run emulator:start

# 开始 Android 开发
npm run dev:android
```

## 🛠️ 常用命令

### Docker Compose 命令

```bash
# 构建镜像
docker-compose -f docker-compose.dev.yml build

# 启动服务
docker-compose -f docker-compose.dev.yml up -d

# 停止服务
docker-compose -f docker-compose.dev.yml down

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 进入容器
docker-compose -f docker-compose.dev.yml exec tauri-dev bash

# 重启服务
docker-compose -f docker-compose.dev.yml restart
```

### 容器内开发命令

```bash
# 环境检查
npm run check:env
npm run check:env:fix

# 开发模式
npm run dev                    # 桌面开发
npm run dev:android           # Android 开发
npm run dev:android:safe      # 安全的 Android 开发

# 模拟器管理
npm run emulator:status       # 查看状态
npm run emulator:start        # 启动模拟器
npm run emulator:stop         # 停止模拟器
npm run emulator:interactive  # 交互式选择

# 构建
npm run build:desktop         # 桌面构建
npm run build:android         # Android 构建
npm run build:mobile          # 所有移动平台
npm run build:all             # 所有平台
```

## 🔧 配置说明

### 端口映射

| 容器端口 | 主机端口 | 用途                 |
| -------- | -------- | -------------------- |
| 1420     | 1420     | Vite 开发服务器      |
| 3000     | 3000     | 备用开发端口         |
| 8080     | 8080     | 备用服务端口         |
| 5037     | 5037     | Android ADB          |
| 5554     | 5554     | Android 模拟器       |
| 5555     | 5555     | Android 模拟器控制台 |

### 卷挂载

| 主机路径      | 容器路径                  | 用途             |
| ------------- | ------------------------- | ---------------- |
| `.`           | `/workspace`              | 项目源代码       |
| `cargo-cache` | `/root/.cargo`            | Rust 依赖缓存    |
| `node-cache`  | `/workspace/node_modules` | Node.js 依赖缓存 |
| `android-sdk` | `/opt/android-sdk`        | Android SDK      |

### 环境变量

```bash
# 开发环境
NODE_ENV=development
RUST_LOG=debug
TAURI_DEBUG=true

# Android 环境
ANDROID_HOME=/opt/android-sdk
ANDROID_SDK_ROOT=/opt/android-sdk
ANDROID_NDK_HOME=/opt/android-sdk/ndk/25.2.9519653
```

## 🎯 最佳实践

### 1. 数据持久化

```bash
# 使用命名卷持久化重要数据
docker volume ls
docker volume inspect template-tauri-react_cargo-cache
```

### 2. 性能优化

```bash
# 为 Docker Desktop 分配足够资源
# 设置 → Resources → Advanced
# - CPU: 4+ 核心
# - Memory: 8+ GB
# - Swap: 2+ GB
```

### 3. 网络配置

```bash
# 如果需要访问主机服务
# 在容器内使用 host.docker.internal
curl http://host.docker.internal:8080
```

### 4. GPU 加速（Linux）

```bash
# 确保主机支持 GPU 加速
# 安装 nvidia-docker2 (NVIDIA GPU)
# 或配置 Intel/AMD GPU 支持
```

## 🐛 故障排除

### 常见问题

#### 1. 容器启动失败

```bash
# 检查 Docker 状态
docker info

# 查看容器日志
docker-compose -f docker-compose.dev.yml logs tauri-dev

# 重新构建镜像
docker-compose -f docker-compose.dev.yml build --no-cache
```

#### 2. Android 模拟器无法启动

```bash
# 检查 KVM 支持 (Linux)
ls -la /dev/kvm

# 检查嵌套虚拟化 (如果在虚拟机中运行)
cat /proc/cpuinfo | grep vmx

# 使用软件渲染
emulator -avd tauri_dev -gpu swiftshader_indirect
```

#### 3. 端口冲突

```bash
# 检查端口占用
netstat -tulpn | grep :1420

# 修改端口映射
# 编辑 docker-compose.dev.yml
ports:
  - "1421:1420"  # 使用不同的主机端口
```

#### 4. 权限问题

```bash
# 检查文件权限
ls -la /workspace

# 修复权限
sudo chown -R $(id -u):$(id -g) .
```

#### 5. 磁盘空间不足

```bash
# 清理 Docker 资源
docker system prune -a

# 清理卷
docker volume prune

# 查看磁盘使用
docker system df
```

### 调试技巧

#### 1. 进入调试模式

```bash
# 以调试模式启动容器
docker-compose -f docker-compose.dev.yml run --rm tauri-dev bash

# 查看环境变量
env | grep -E '(ANDROID|RUST|NODE)'

# 检查安装的工具
which rustc cargo node npm tauri
```

#### 2. 网络调试

```bash
# 测试网络连接
ping google.com
curl -I https://registry.npmjs.org

# 检查 DNS
nslookup registry.npmjs.org
```

#### 3. 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看容器进程
docker-compose -f docker-compose.dev.yml top
```

## 🔄 更新和维护

### 更新 Docker 镜像

```bash
# 拉取最新的基础镜像
docker pull ubuntu:22.04

# 重新构建
docker-compose -f docker-compose.dev.yml build --no-cache

# 清理旧镜像
docker image prune
```

### 备份和恢复

```bash
# 备份卷数据
docker run --rm -v template-tauri-react_cargo-cache:/data -v $(pwd):/backup ubuntu tar czf /backup/cargo-cache.tar.gz -C /data .

# 恢复卷数据
docker run --rm -v template-tauri-react_cargo-cache:/data -v $(pwd):/backup ubuntu tar xzf /backup/cargo-cache.tar.gz -C /data
```

## 📚 进阶用法

### 自定义 Dockerfile

如果需要自定义开发环境，可以修改 `Dockerfile.dev`：

```dockerfile
# 添加额外的工具
RUN apt-get update && apt-get install -y \
    your-additional-tool \
    && rm -rf /var/lib/apt/lists/*

# 安装额外的 Rust 工具
RUN cargo install your-rust-tool

# 设置自定义环境变量
ENV YOUR_CUSTOM_VAR=value
```

### 多阶段构建

```dockerfile
# 开发阶段
FROM ubuntu:22.04 as development
# ... 开发环境配置

# 生产构建阶段
FROM development as builder
# ... 构建配置

# 最终镜像
FROM ubuntu:22.04 as production
# ... 生产环境配置
```

### CI/CD 集成

```yaml
# .github/workflows/docker.yml
name: Docker Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker-compose -f docker-compose.dev.yml build
      - name: Run tests
        run: |
          docker-compose -f docker-compose.dev.yml run --rm tauri-dev npm test
```

## 🎉 总结

Docker 开发环境为 Tauri + React 项目提供了：

- ✅ **一致性**：所有开发者使用相同环境
- ✅ **便携性**：轻松在不同机器间迁移
- ✅ **隔离性**：避免本地环境冲突
- ✅ **可重现性**：确保构建结果一致
- ✅ **易维护性**：集中管理开发工具

通过合理使用 Docker，可以显著提高开发效率和团队协作体验。
