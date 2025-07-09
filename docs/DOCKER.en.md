# Docker Development Environment Guide

This document describes how to use Docker to create a standardized Tauri + React
development environment.

## 🐳 Why Use Docker?

- **Environment Consistency**: Ensures all developers use the same development
  environment
- **Quick Setup**: No need to manually install and configure various tools
- **Isolation**: Avoids local environment pollution and conflicts
- **Cross-platform**: Provides consistent experience on Windows, macOS, Linux
- **CI/CD Friendly**: Maintains consistency with continuous integration
  environments

## 📋 Prerequisites

### Required Software

1. **Docker Desktop**
   - [Windows](https://docs.docker.com/desktop/windows/install/)
   - [macOS](https://docs.docker.com/desktop/mac/install/)
   - [Linux](https://docs.docker.com/desktop/linux/install/)

2. **Docker Compose**
   - Usually installed with Docker Desktop
   - Linux users may need to install separately

### System Requirements

- **Memory**: At least 8GB RAM (16GB recommended)
- **Storage**: At least 20GB available space
- **CPU**: Multi-core processor with virtualization support

## 🚀 Quick Start

### 1. Build Development Environment

```bash
# Clone the project
git clone <your-repo-url>
cd template-tauri-react

# Build Docker image
docker-compose -f docker-compose.dev.yml build
```

### 2. Start Development Environment

```bash
# Start development container
docker-compose -f docker-compose.dev.yml up -d

# Enter development container
docker-compose -f docker-compose.dev.yml exec tauri-dev bash
```

### 3. Start Development

Execute in container:

```bash
# Check environment
npm run check:env

# Desktop development
npm run dev

# Android development
npm run dev:android
```

## 📱 Android Development

### Start Android Emulator

```bash
# Method 1: Start in main container
docker-compose -f docker-compose.dev.yml exec tauri-dev bash
npm run emulator:start

# Method 2: Use standalone emulator service
docker-compose -f docker-compose.dev.yml --profile emulator up android-emulator -d
```

### Android Development Workflow

```bash
# Enter development container
docker-compose -f docker-compose.dev.yml exec tauri-dev bash

# Check Android environment
npm run check:env

# Initialize Android project
npm run init:android

# Start emulator
npm run emulator:start

# Start Android development
npm run dev:android
```

## 🛠️ Common Commands

### Docker Compose Commands

```bash
# Build image
docker-compose -f docker-compose.dev.yml build

# Start services
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Enter container
docker-compose -f docker-compose.dev.yml exec tauri-dev bash

# Restart services
docker-compose -f docker-compose.dev.yml restart
```

### Development Commands in Container

```bash
# Environment check
npm run check:env
npm run check:env:fix

# Development mode
npm run dev                    # Desktop development
npm run dev:android           # Android development
npm run dev:android:safe      # Safe Android development

# Emulator management
npm run emulator:status       # Check status
npm run emulator:start        # Start emulator
npm run emulator:stop         # Stop emulator
npm run emulator:interactive  # Interactive selection

# Build
npm run build:desktop         # Desktop build
npm run build:android         # Android build
npm run build:mobile          # All mobile platforms
npm run build:all             # All platforms
```

## 🔧 Configuration

### Port Mapping

| Container Port | Host Port | Purpose                  |
| -------------- | --------- | ------------------------ |
| 1420           | 1420      | Vite development server  |
| 3000           | 3000      | Backup development port  |
| 8080           | 8080      | Backup service port      |
| 5037           | 5037      | Android ADB              |
| 5554           | 5554      | Android emulator         |
| 5555           | 5555      | Android emulator console |

### Volume Mounts

| Host Path     | Container Path            | Purpose              |
| ------------- | ------------------------- | -------------------- |
| `.`           | `/workspace`              | Project source       |
| `cargo-cache` | `/root/.cargo`            | Rust dependencies    |
| `node-cache`  | `/workspace/node_modules` | Node.js dependencies |
| `android-sdk` | `/opt/android-sdk`        | Android SDK          |

### Environment Variables

```bash
# Development environment
NODE_ENV=development
RUST_LOG=debug
TAURI_DEBUG=true

# Android environment
ANDROID_HOME=/opt/android-sdk
ANDROID_SDK_ROOT=/opt/android-sdk
ANDROID_NDK_HOME=/opt/android-sdk/ndk/25.2.9519653
```

## 🎯 Best Practices

### 1. Data Persistence

```bash
# Use named volumes to persist important data
docker volume ls
docker volume inspect template-tauri-react_cargo-cache
```

### 2. Performance Optimization

```bash
# Allocate sufficient resources for Docker Desktop
# Settings → Resources → Advanced
# - CPU: 4+ cores
# - Memory: 8+ GB
# - Swap: 2+ GB
```

### 3. Network Configuration

```bash
# If you need to access host services
# Use host.docker.internal in container
curl http://host.docker.internal:8080
```

### 4. GPU Acceleration (Linux)

```bash
# Ensure host supports GPU acceleration
# Install nvidia-docker2 (NVIDIA GPU)
# Or configure Intel/AMD GPU support
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Container Startup Failure

```bash
# Check Docker status
docker info

# View container logs
docker-compose -f docker-compose.dev.yml logs tauri-dev

# Rebuild image
docker-compose -f docker-compose.dev.yml build --no-cache
```

#### 2. Android Emulator Won't Start

```bash
# Check KVM support (Linux)
ls -la /dev/kvm

# Check nested virtualization (if running in VM)
cat /proc/cpuinfo | grep vmx

# Use software rendering
emulator -avd tauri_dev -gpu swiftshader_indirect
```

#### 3. Port Conflicts

```bash
# Check port usage
netstat -tulpn | grep :1420

# Modify port mapping
# Edit docker-compose.dev.yml
ports:
  - "1421:1420"  # Use different host port
```

#### 4. Permission Issues

```bash
# Check file permissions
ls -la /workspace

# Fix permissions
sudo chown -R $(id -u):$(id -g) .
```

#### 5. Insufficient Disk Space

```bash
# Clean Docker resources
docker system prune -a

# Clean volumes
docker volume prune

# View disk usage
docker system df
```

### Debugging Tips

#### 1. Enter Debug Mode

```bash
# Start container in debug mode
docker-compose -f docker-compose.dev.yml run --rm tauri-dev bash

# View environment variables
env | grep -E '(ANDROID|RUST|NODE)'

# Check installed tools
which rustc cargo node npm tauri
```

#### 2. Network Debugging

```bash
# Test network connectivity
ping google.com
curl -I https://registry.npmjs.org

# Check DNS
nslookup registry.npmjs.org
```

#### 3. Performance Monitoring

```bash
# View container resource usage
docker stats

# View container processes
docker-compose -f docker-compose.dev.yml top
```

## 🔄 Updates and Maintenance

### Update Docker Images

```bash
# Pull latest base images
docker pull ubuntu:22.04

# Rebuild
docker-compose -f docker-compose.dev.yml build --no-cache

# Clean old images
docker image prune
```

### Backup and Restore

```bash
# Backup volume data
docker run --rm -v template-tauri-react_cargo-cache:/data -v $(pwd):/backup ubuntu tar czf /backup/cargo-cache.tar.gz -C /data .

# Restore volume data
docker run --rm -v template-tauri-react_cargo-cache:/data -v $(pwd):/backup ubuntu tar xzf /backup/cargo-cache.tar.gz -C /data
```

## 📚 Advanced Usage

### Custom Dockerfile

If you need to customize the development environment, you can modify
`Dockerfile.dev`:

```dockerfile
# Add additional tools
RUN apt-get update && apt-get install -y \
    your-additional-tool \
    && rm -rf /var/lib/apt/lists/*

# Install additional Rust tools
RUN cargo install your-rust-tool

# Set custom environment variables
ENV YOUR_CUSTOM_VAR=value
```

### Multi-stage Build

```dockerfile
# Development stage
FROM ubuntu:22.04 as development
# ... development environment configuration

# Production build stage
FROM development as builder
# ... build configuration

# Final image
FROM ubuntu:22.04 as production
# ... production environment configuration
```

### CI/CD Integration

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

## 🎉 Summary

The Docker development environment provides the following for Tauri + React
projects:

- ✅ **Consistency**: All developers use the same environment
- ✅ **Portability**: Easy migration between different machines
- ✅ **Isolation**: Avoids local environment conflicts
- ✅ **Reproducibility**: Ensures consistent build results
- ✅ **Maintainability**: Centralized management of development tools

By properly using Docker, you can significantly improve development efficiency
and team collaboration experience.

## See Also

- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md) - Development environment
  configuration
- [Development Guide](DEVELOPMENT_GUIDE.en.md) - Development workflow and best
  practices
- [Build & Deployment Guide](BUILD_DEPLOYMENT.en.md) - Multi-platform build and
  deployment
