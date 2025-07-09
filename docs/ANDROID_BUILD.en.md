# Android Build Guide

This document describes how to build and sign Android APK files.

## Prerequisites

1. **Android SDK**: Ensure Android SDK is installed
2. **Android NDK**: Ensure Android NDK is installed
3. **Java Development Kit (JDK)**: Ensure JDK 8 or higher is installed

## Environment Configuration

### 1. Set Environment Variables

Add the following environment variables to your shell configuration file (e.g.,
`~/.bashrc`, `~/.zshrc`):

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_NDK_ROOT="$ANDROID_HOME/ndk/26.1.10909125"
export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/darwin-x86_64/bin"
```

### 2. Verify Environment

Run the environment check script:

```bash
npm run check:env
```

## Build and Signing Steps

### Automated Build (Recommended)

```bash
npm run build:android
```

This command will automatically complete the following steps:

- Build Android APK
- Automatically perform debug signing
- Rename files according to version number and architecture
- Copy to `dist-builds` directory
- Clean build cache

### Manual Signing (Optional)

If you need to sign an existing APK separately:

```bash
npm run sign:android
```

This command will:

- Automatically create debug keystore (if it doesn't exist)
- Sign the APK
- Verify the signature is successful
- Generate signed APK file: `app-universal-release-signed.apk`

## File Locations

### Build Artifacts

- **Final APK**: `dist-builds/template-tauri-react_version_architecture.apk`
- **Final AAB**: `dist-builds/template-tauri-react_version_architecture.aab`
- **Debug Keystore**: `debug.keystore` (project root directory)

### Naming Format

Build artifacts will be automatically renamed according to the following format:

- APK: `template-tauri-react_0.0.1_universal.apk`
- AAB: `template-tauri-react_0.0.1_universal.aab`

Where:

- `template-tauri-react`: Project name
- `0.0.1`: Version number read from package.json
- `universal`: Architecture automatically identified based on build target
  (universal/aarch64/x86_64)

### Build Directory Structure

```
dist-builds/                    # Final build artifacts directory
├── template-tauri-react_0.0.1_universal.apk
├── template-tauri-react_0.0.1_universal.aab
└── ...

src-tauri/gen/android/         # Temporary build directory (will be cleaned)
├── app/build/outputs/
└── ...
```

## Install to Device

### 1. Enable Developer Options

On your Android device:

1. Go to **Settings** > **About phone**
2. Tap **Build number** 7 times to enable developer options
3. Return to Settings, go to **Developer options**
4. Enable **USB debugging**

### 2. Allow Unknown Sources Installation

1. Go to **Settings** > **Security**
2. Enable **Unknown sources** or **Allow installation of unknown apps**

### 3. Install APK

Method 1: Install via ADB

```bash
adb install dist-builds/template-tauri-react_0.0.1_universal.apk
```

Method 2: Manual Installation

1. Transfer the `dist-builds/template-tauri-react_0.0.1_universal.apk` file to
   your Android device
2. Tap the APK file on the device
3. Follow the prompts to complete installation

## Troubleshooting

### 1. "Invalid Installation Package" Error

This is usually caused by an unsigned APK. Make sure to use a signed APK file:

- Use `app-universal-release-signed.apk` instead of
  `app-universal-release-unsigned.apk`
- Run `npm run sign:android` to ensure the APK is properly signed

### 2. NDK Toolchain Errors

If you encounter NDK-related errors:

1. Ensure the `ANDROID_NDK_ROOT` environment variable is correctly set
2. Check if the NDK version is compatible
3. Review the toolchain configuration in `.cargo/config.toml`

### 3. Build Failures

If the build fails:

1. Run `npm run clean:all` to clean all caches
2. Reinstall dependencies: `npm install`
3. Check environment configuration: `npm run check:env`

## New Features

### Automated Build Process

- ✅ **Automatic Signing**: Automatically performs debug signing after build
  completion
- ✅ **Smart Renaming**: Automatically renames files based on version number and
  architecture
- ✅ **Artifact Management**: Automatically copies to unified `dist-builds`
  directory
- ✅ **Cache Cleanup**: Automatically cleans temporary files and cache after
  build completion
- ✅ **Version Recognition**: Automatically reads version number from
  `package.json`
- ✅ **Architecture Recognition**: Automatically identifies architecture type
  based on build target

### Build Optimization

- 🚀 **Parallel Building**: Supports parallel building for multiple
  architectures
- 🧹 **Cache Management**: Automatically cleans Android build cache to avoid
  disk space waste
- 📦 **Unified Output**: All platform build artifacts are stored in the unified
  `dist-builds` directory

## Important Notes

### Debug Signing vs Release Signing

- Currently using **debug signing**, only for development and testing
- Debug-signed APKs cannot be published to Google Play Store
- Production environment requires signing with official release keys

### Keystore Security

- `debug.keystore` is a debug keystore with password `android`
- Use secure keystore and strong passwords for production environment
- Do not commit production keystores to version control systems

## Production Release

⚠️ **Important Reminder**: The signing method in this guide is only for
development and testing. For production release, you need to:

1. Create a release keystore
2. Sign with release keys
3. Optimize APK alignment
4. Upload to Google Play Store or other app stores

## Related Scripts

- `npm run build:android` - Build Android APK
- `npm run sign:android` - Debug sign APK
- `npm run check:env` - Check development environment configuration
- `npm run dev:android` - Start Android development mode

## See Also

- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md) - Development environment
  configuration
- [Development Guide](DEVELOPMENT_GUIDE.en.md) - Development workflow and best
  practices
- [Build & Deployment Guide](BUILD_DEPLOYMENT.en.md) - Multi-platform build and
  deployment
