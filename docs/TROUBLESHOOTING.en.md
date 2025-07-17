# Troubleshooting Guide

This document provides solutions to common issues encountered during Tauri +
React project development.

## 🔧 Quick Diagnosis

When encountering problems, first run the environment check tool:

```bash
# Check development environment
npm run check:env

# Automatically fix fixable issues
npm run check:env:fix
```

## 📱 Android Development Issues

### Issue 1: OpenSSL Compilation Error

**Problem Description:** When executing `yarn dev:android:safe`, `openssl-sys`
compilation fails with error:

```
warning: openssl-sys@0.9.109: Could not find directory of OpenSSL installation
error: failed to run custom build command for `openssl-sys v0.9.109`
```

**Solutions:**

1. **Recommended: Use rustls instead of OpenSSL**

   ```bash
   # Project is configured to use rustls-tls, if still having issues, clean and rebuild
   yarn clean:all
   yarn dev:android:safe
   ```

2. **Alternative: Configure OpenSSL environment variables**

   ```bash
   # macOS (using Homebrew)
   brew install openssl
   export OPENSSL_DIR=/opt/homebrew/opt/openssl
   export OPENSSL_LIB_DIR=/opt/homebrew/opt/openssl/lib
   export OPENSSL_INCLUDE_DIR=/opt/homebrew/opt/openssl/include

   # Or add to ~/.zshrc or ~/.bash_profile
   echo 'export OPENSSL_DIR=/opt/homebrew/opt/openssl' >> ~/.zshrc
   ```

3. **Use vendored OpenSSL** Add to `src-tauri/Cargo.toml`:
   ```toml
   [dependencies]
   openssl = { version = "0.10", features = ["vendored"] }
   ```

**Prevention:**

- Project is configured with `reqwest` using `rustls-tls` feature to avoid
  OpenSSL dependencies
- Regularly run `yarn check:env` to check environment configuration

### Issue 2: "No available Android Emulator detected"

**Symptoms:** Running `npm run dev:android` shows no available emulator

**Solutions:**

1. **Check emulator status:**

   ```bash
   npm run emulator:status
   ```

2. **Start emulator:**

   ```bash
   # Automatically start best emulator
   npm run emulator:start

   # Or interactive emulator selection
   npm run emulator:interactive
   ```

3. **Create new AVD (if none exists):**
   - Open Android Studio
   - Go to Tools → AVD Manager
   - Click "Create Virtual Device"
   - Select device model (Pixel series recommended)
   - Select system image (API 30+ recommended)
   - Complete creation

4. **Use safe startup command:**
   ```bash
   npm run dev:android:safe
   ```

### Issue 3: "Failed to run cargo build" (Error code 101)

**Symptoms:** Rust compilation fails, especially for `aarch64-linux-android`
target

**Solutions:**

1. **Check Rust Android targets:**

   ```bash
   rustup target list --installed | grep android
   ```

2. **Install missing targets:**

   ```bash
   rustup target add aarch64-linux-android
   rustup target add armv7-linux-androideabi
   rustup target add i686-linux-android
   rustup target add x86_64-linux-android
   ```

3. **Check Android NDK:**

   ```bash
   echo $ANDROID_HOME
   ls $ANDROID_HOME/ndk
   ```

4. **Reinstall NDK (if needed):**
   - Open Android Studio
   - Go to SDK Manager
   - Install NDK in SDK Tools tab

5. **Set environment variables:**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANDROID_HOME="$HOME/Library/Android/sdk"  # macOS
   export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/[version]"
   export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
   ```

### Issue 4: "ANDROID_HOME not set"

**Symptoms:** Environment variables not properly set

**Solutions:**

1. **Find Android SDK path:**

   ```bash
   # macOS default path
   ls ~/Library/Android/sdk

   # Or check in Android Studio
   # File → Project Structure → SDK Location
   ```

2. **Set environment variables:**

   ```bash
   # Temporary setting
   export ANDROID_HOME="$HOME/Library/Android/sdk"

   # Permanent setting (add to shell config file)
   echo 'export ANDROID_HOME="$HOME/Library/Android/sdk"' >> ~/.zshrc
   echo 'export PATH="$PATH:$ANDROID_HOME/platform-tools"' >> ~/.zshrc
   source ~/.zshrc
   ```

## 🍎 iOS Development Issues

### Issue 1: "xcodebuild not found"

**Symptoms:** Missing Xcode or Command Line Tools

**Solutions:**

1. **Install Xcode:**
   - Install Xcode from App Store
   - Or download Xcode Command Line Tools

2. **Install Command Line Tools:**

   ```bash
   xcode-select --install
   ```

3. **Verify installation:**
   ```bash
   xcodebuild -version
   xcrun --show-sdk-path
   ```

### Issue 2: iOS Simulator Issues

**Symptoms:** Cannot start or find iOS simulator

**Solutions:**

1. **List available simulators:**

   ```bash
   xcrun simctl list devices
   ```

2. **Start specific simulator:**

   ```bash
   xcrun simctl boot "iPhone 14"
   open -a Simulator
   ```

3. **Reset simulator (if problematic):**
   ```bash
   xcrun simctl erase all
   ```

## 🦀 Rust Related Issues

### Issue 1: "rustc not found"

**Symptoms:** Rust not installed or not properly configured

**Solutions:**

1. **Install Rust:**

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **Update Rust:**

   ```bash
   rustup update
   ```

3. **Verify installation:**
   ```bash
   rustc --version
   cargo --version
   ```

### Issue 2: Tauri CLI Issues

**Symptoms:** `tauri` command not available

**Solutions:**

1. **Install Tauri CLI:**

   ```bash
   cargo install tauri-cli
   ```

2. **Update Tauri CLI:**

   ```bash
   cargo install tauri-cli --force
   ```

3. **Check version:**
   ```bash
   tauri --version
   ```

## 🌐 Frontend Development Issues

### Issue 1: Node.js Version Issues

**Symptoms:** Build failures or dependency installation problems

**Solutions:**

1. **Check Node.js version:**

   ```bash
   node --version
   npm --version
   ```

2. **Upgrade Node.js (recommended using nvm):**

   ```bash
   # Install nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

   # Install latest LTS version
   nvm install --lts
   nvm use --lts
   ```

3. **Clean dependency cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue 2: Vite Development Server Issues

**Symptoms:** Frontend development server cannot start

**Solutions:**

1. **Check port usage:**

   ```bash
   lsof -i :1420
   ```

2. **Use different port:**

   ```bash
   npm run dev -- --port 3000
   ```

3. **Clean build cache:**
   ```bash
   npm run clean
   npm install
   ```

## 🔨 Build and Packaging Issues

### Issue 1: Cross-platform Build Failures

**Symptoms:** Errors when building for other platforms

**Solutions:**

1. **Check target platform support:**

   ```bash
   rustup target list --installed
   ```

2. **Install target platforms:**

   ```bash
   # Linux
   rustup target add x86_64-unknown-linux-gnu
   rustup target add aarch64-unknown-linux-gnu

   # Windows
   rustup target add x86_64-pc-windows-msvc
   rustup target add aarch64-pc-windows-msvc
   ```

### Issue 2: Code Signing Issues

**Symptoms:** Application cannot be properly signed or distributed

**Solutions:**

1. **Check signing configuration:**
   - Review signing settings in `src-tauri/tauri.conf.json`
   - Ensure certificate and key files exist

2. **Regenerate signing certificates:**
   ```bash
   # Android
   keytool -genkey -v -keystore release-key.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
   ```

## 🐛 Debugging Tips

### 1. Enable Verbose Logging

```bash
# Set environment variables to enable verbose logging
export RUST_LOG=debug
export TAURI_DEBUG=true

# Run commands
npm run dev:android
```

### 2. Check System Requirements

Run complete environment check:

```bash
npm run check:env
```

### 3. Clean and Reset

```bash
# Clean all build artifacts
npm run clean

# Reinstall dependencies
rm -rf node_modules
npm install

# Reinitialize mobile projects
npm run init:android
npm run init:ios
```

### 4. View Detailed Error Information

```bash
# Use --verbose flag for detailed output
tauri android dev --verbose
tauri ios dev --verbose
```

## 📞 Getting Help

If none of the above solutions resolve your issue, please:

1. **Check official documentation:**
   - [Tauri Official Documentation](https://tauri.app/)
   - [Tauri Mobile Guide](https://tauri.app/v1/guides/building/mobile/)

2. **Check GitHub Issues:**
   - [Tauri GitHub](https://github.com/tauri-apps/tauri/issues)
   - Search for related issues or create a new issue

3. **Community support:**
   - [Tauri Discord](https://discord.gg/tauri)
   - [Reddit r/tauri](https://reddit.com/r/tauri)

4. **Generate environment report:**
   ```bash
   npm run check:env
   # Check the generated env-check-report.json file
   ```

## 📋 Quick Command Reference

```bash
# Environment check
npm run check:env
npm run check:env:fix

# Emulator management
npm run emulator:status
npm run emulator:start
npm run emulator:stop

# Safe development
npm run dev:android:safe
npm run setup:android

# Clean and reset
npm run clean
npm run clean:dist

# Build
npm run build:desktop
npm run build:mobile
npm run build:all
```

---

**Tip:** When encountering issues, first run `npm run check:env` for automatic
diagnosis, which can resolve most common environment configuration problems.

## See Also

- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md) - Development environment
  configuration
- [Development Guide](DEVELOPMENT_GUIDE.en.md) - Development workflow and best
  practices
- [Android Build Guide](ANDROID_BUILD.en.md) - Android platform build
  configuration
- [Build & Deployment Guide](BUILD_DEPLOYMENT.en.md) - Multi-platform build and
  deployment
