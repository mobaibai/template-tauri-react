# Environment Setup Guide

This document provides detailed instructions for setting up the Tauri + React
development environment, including configuration steps for all supported
platforms.

## 📋 Table of Contents

- [Basic Requirements](#basic-requirements)
- [Desktop Platform Setup](#desktop-platform-setup)
- [Mobile Platform Setup](#mobile-platform-setup)

- [Development Tools Setup](#development-tools-setup)
- [Environment Verification](#environment-verification)
- [Common Issues](#common-issues)

## Basic Requirements

### Prerequisites

Before getting started, ensure your system meets Tauri's basic requirements:

- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Memory**: At least 4GB RAM (8GB+ recommended)
- **Storage**: At least 10GB available space
- **Network**: Stable internet connection (for downloading dependencies)

### Node.js Environment

1. **Install Node.js**:
   - Visit [Node.js official website](https://nodejs.org/)
   - Download and install LTS version (>= 18.0.0)

2. **Verify Installation**:

   ```bash
   node -v  # Should display version >= 18.0.0
   npm -v   # Should display version number
   ```

3. **Configure npm (Optional)**:

   ```bash
   # Set registry mirror (for users in China)
   npm config set registry https://registry.npmmirror.com/

   # Set global install directory
   npm config set prefix "~/.npm-global"
   ```

### Rust Environment

1. **Install Rust**:

   **macOS/Linux**:

   ```bash
   curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
   source ~/.cargo/env
   ```

   **Windows**:

   ```powershell
   # Run in PowerShell
   Invoke-WebRequest -Uri "https://win.rustup.rs/" -OutFile "rustup-init.exe"
   .\rustup-init.exe
   ```

2. **Verify Installation**:

   ```bash
   rustc --version  # Should display version >= 1.70.0
   cargo --version  # Should display version number
   ```

3. **Configure Rust (Optional)**:
   ```bash
   # Set registry mirror (for users in China)
   echo '[source.crates-io]' >> ~/.cargo/config.toml
   echo 'replace-with = "ustc"' >> ~/.cargo/config.toml
   echo '[source.ustc]' >> ~/.cargo/config.toml
   echo 'registry = "https://mirrors.ustc.edu.cn/crates.io-index"' >> ~/.cargo/config.toml
   ```

## Desktop Platform Setup

### macOS Setup

1. **Install Xcode Command Line Tools**:

   ```bash
   xcode-select --install
   ```

2. **Add Build Targets**:

   ```bash
   # Intel Mac
   rustup target add x86_64-apple-darwin

   # Apple Silicon Mac
   rustup target add aarch64-apple-darwin
   ```

3. **Install Additional Tools (Optional)**:

   ```bash
   # Install Homebrew
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Install NSIS (for Windows cross-compilation)
   brew install makensis
   ```

### Windows Setup

1. **Install Microsoft C++ Build Tools**:
   - Download and install
     [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - During installation, select "Desktop development with C++"
   - Or install the complete Visual Studio Community

2. **Install WebView2**:
   - Visit
     [WebView2 Runtime download page](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
   - Download and install "Evergreen Bootstrapper"

3. **Add Build Targets**:

   ```bash
   # Windows x64
   rustup target add x86_64-pc-windows-msvc

   # Windows ARM64
   rustup target add aarch64-pc-windows-msvc
   ```

4. **Configure Environment Variables**:
   ```powershell
   # Add to system PATH (if needed)
   $env:PATH += ";C:\Program Files\Microsoft Visual Studio\2022\BuildTools\MSBuild\Current\Bin"
   ```

### Linux Setup

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.0-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### Fedora/CentOS/RHEL

```bash
sudo dnf install -y \
  webkit2gtk4.0-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### Arch Linux

```bash
sudo pacman -S \
  webkit2gtk \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  gtk3 \
  libappindicator-gtk3 \
  librsvg
```

## Mobile Platform Setup

### iOS Setup

**System Requirements**:

- macOS 10.15+ (iOS development only supported on macOS)
- Xcode 12.0+
- iOS 13.0+ (target devices)

**Installation Steps**:

1. **Install Xcode**:

   ```bash
   # Install Xcode from App Store
   # Or use command line tools
   xcode-select --install
   ```

2. **Install iOS Targets**:

   ```bash
   rustup target add aarch64-apple-ios
   rustup target add x86_64-apple-ios          # Intel simulator
   rustup target add aarch64-apple-ios-sim     # Apple Silicon simulator
   ```

3. **Verify Setup**:

   ```bash
   # Check Xcode version
   xcodebuild -version

   # List available simulators
   xcrun simctl list devices
   ```

### Android Setup

**System Requirements**:

- Android Studio or Android SDK
- Android NDK
- Java 11+

**Installation Steps**:

1. **Install Java**:

   **macOS**:

   ```bash
   brew install openjdk@11
   echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
   ```

   **Windows**:
   - Download and install [OpenJDK 11](https://adoptium.net/)

   **Linux**:

   ```bash
   sudo apt install openjdk-11-jdk  # Ubuntu/Debian
   sudo dnf install java-11-openjdk-devel  # Fedora
   ```

2. **Install Android Studio**:
   - Download and install [Android Studio](https://developer.android.com/studio)
   - Install Android SDK and NDK

3. **Set Environment Variables**:

   **macOS/Linux**:

   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   export ANDROID_HOME=$HOME/Android/Sdk          # Linux
   export NDK_HOME=$ANDROID_HOME/ndk/[version]
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   **Windows**:

   ```powershell
   # Add to system environment variables
   $env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
   $env:NDK_HOME = "$env:ANDROID_HOME\ndk\[version]"
   $env:PATH += ";$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
   ```

4. **Install Android Targets**:

   ```bash
   rustup target add aarch64-linux-android
   rustup target add armv7-linux-androideabi
   rustup target add i686-linux-android
   rustup target add x86_64-linux-android
   ```

5. **Verify Setup**:

   ```bash
   # Check Android SDK
   sdkmanager --list

   # Check emulators
   emulator -list-avds

   # Check connected devices
   adb devices
   ```

## Local Build Setup

> **Note**: PC cross-platform builds are handled by GitHub Actions. Local setup only needs to support current system builds.

2. **Install NSIS (for creating installers)**:

   **macOS**:

   ```bash
   brew install makensis
   ```

   **Linux**:

   ```bash
   sudo apt install nsis  # Ubuntu/Debian
   sudo dnf install nsis  # Fedora
   ```

3. **Add Windows Targets**:
   ```bash
   rustup target add x86_64-pc-windows-msvc
   rustup target add aarch64-pc-windows-msvc
   ```

### Building Other Platforms on Windows

**Note**: Windows users cannot directly build macOS apps; macOS system and Xcode
are required.

## Development Tools Setup

### VS Code Setup

1. **Install Recommended Extensions**:
   - Tauri
   - rust-analyzer
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Importer
   - Prettier - Code formatter
   - ESLint

2. **Configuration Files** (included in project):
   - `.vscode/settings.json`
   - `.vscode/extensions.json`
   - `.vscode/launch.json`

### Git Setup

```bash
# Configure user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure line endings (Windows users)
git config --global core.autocrlf true

# Configure line endings (macOS/Linux users)
git config --global core.autocrlf input
```

## Environment Verification

### Automated Checks

The project provides automated environment checking tools:

```bash
# Check development environment
npm run check:env

# Auto-fix discovered issues
npm run check:env:fix

# Set up complete Android development environment
npm run setup:android
```

### Manual Verification

1. **Basic Environment**:

   ```bash
   node --version    # >= 18.0.0
   npm --version     # Any version
   rustc --version   # >= 1.70.0
   cargo --version   # Any version
   ```

2. **Desktop Platforms**:

   ```bash
   # macOS
   xcode-select -p

   # Windows
   where cl.exe

   # Linux
   pkg-config --exists webkit2gtk-4.0
   ```

3. **Mobile Platforms**:

   ```bash
   # iOS
   xcodebuild -version
   xcrun simctl list devices

   # Android
   java -version
   echo $ANDROID_HOME
   adb version
   ```

4. **Build Testing**:

   ```bash
   # Test desktop build
   npm run build:tauri

   # Test mobile builds (if configured)
   npm run build:ios     # macOS only
   npm run build:android
   ```

## Common Issues

### Permission Issues

**macOS**:

```bash
# If encountering permission issues
sudo xcode-select --reset
sudo xcodebuild -license accept
```

**Linux**:

```bash
# If encountering permission issues
sudo chown -R $USER:$USER ~/.cargo
sudo chown -R $USER:$USER ~/.rustup
```

### Network Issues

**Using Proxy**:

```bash
# npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Rust proxy
export HTTPS_PROXY=http://proxy.company.com:8080
export HTTP_PROXY=http://proxy.company.com:8080
```

**Using Mirrors**:

```bash
# npm mirror
npm config set registry https://registry.npmmirror.com/

# Rust mirror
echo '[source.crates-io]' >> ~/.cargo/config.toml
echo 'replace-with = "ustc"' >> ~/.cargo/config.toml
echo '[source.ustc]' >> ~/.cargo/config.toml
echo 'registry = "https://mirrors.ustc.edu.cn/crates.io-index"' >> ~/.cargo/config.toml
```

### Version Conflicts

```bash
# Update Rust toolchain
rustup update

# Update Node.js (using nvm)
nvm install --lts
nvm use --lts

# Clean caches
npm cache clean --force
cargo clean
```

### Disk Space

```bash
# Clean npm cache
npm cache clean --force

# Clean Rust cache
cargo clean
rustup toolchain list
rustup toolchain uninstall <unused-toolchain>

# Clean build cache
npm run clean:build-cache
```

## Related Links

- [Tauri Prerequisites Documentation](https://tauri.app/start/prerequisites/)
- [Rust Installation Guide](https://www.rust-lang.org/tools/install)
- [Node.js Download](https://nodejs.org/)
- [Android Developer Documentation](https://developer.android.com/studio/install)
- [iOS Developer Documentation](https://developer.apple.com/xcode/)

---

If you encounter issues during environment setup, please check the
[Troubleshooting Guide](TROUBLESHOOTING.en.md) or submit an Issue.
