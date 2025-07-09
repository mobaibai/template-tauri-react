# GitHub Actions CI/CD Workflow Guide

This project includes a complete GitHub Actions CI/CD workflow that supports
automatic building, testing, and releasing of multi-platform applications.

## 🚀 Features

### Automation Pipeline

- ✅ **Frontend Testing**: Automatic ESLint and TypeScript type checking
- 🏗️ **Multi-platform Building**: Support for macOS, Windows, Linux, iOS,
  Android
- 📦 **Auto Release**: Automatic GitHub Releases creation and artifact upload
- 🧹 **Resource Cleanup**: Automatic workflow artifact cleanup to save storage
- 📋 **Package Management**: Uses pnpm (>=10.0.0) for fast and efficient
  dependency management

### Supported Platforms

#### Desktop Platforms

- **macOS**: Intel (x86_64) and Apple Silicon (ARM64)
- **Windows**: x86_64 and ARM64
- **Linux**: x86_64 and ARM64 (AppImage, DEB, RPM)

#### Mobile Platforms

- **iOS**: Support for iOS 13.0+
- **Android**: Support for Android 7.0+ (API 24)

## Prerequisites

### Environment Requirements

- **Operating System**: Support for macOS, Windows, Linux
- **Node.js**: 22.17.0 (consistent with `.nvmrc` file)
- **pnpm**: 10.x or higher
- **Rust**: Latest stable version

### Node.js Version Management

The project uses `.nvmrc` file to manage Node.js version (currently 22.17.0)
uniformly, ensuring consistency between local development and CI/CD
environments:

- **Local Development**: Use `nvm use` or `fnm use` to automatically switch to
  the specified version
- **GitHub Actions**: Automatically reads version via
  `node-version-file: '.nvmrc'`
- **Version Consistency**: Prevents build issues caused by Node.js version
  differences

### Required Files

- **Project root must contain `pnpm-lock.yaml` file**
- **Project root must contain `.nvmrc` file specifying Node.js version**

## 🔧 Workflow Configuration

### Trigger Conditions

The workflow automatically triggers on:

1. **Push to main branch**: `push` to `main` or `master` branch
2. **Pull Request**: PR targeting main branch
3. **Tag push**: Push tags starting with `v` (e.g., `v1.0.0`)
4. **Manual trigger**: Manual run through GitHub interface

### Manual Trigger Options

When manually triggering through GitHub interface, you can choose:

- **Build Target**:
  - `desktop`: Build desktop versions only
  - `mobile`: Build mobile versions only
  - `all`: Build all platforms

- **Release Type**:
  - `release`: Official release
  - `prerelease`: Pre-release version
  - `draft`: Draft release

## 📋 Workflow Steps

### 1. Frontend Testing (`frontend-test`)

```yaml
- Setup Node.js environment
- Install pnpm (>=10.0.0)
- Install Node.js dependencies using pnpm
- Run ESLint checks
- Run TypeScript type checking
- Build frontend project
- Upload frontend build artifacts
```

### 2. Desktop Platform Builds

#### macOS Build (`build-macos`)

```yaml
- Support x86_64 and aarch64 architectures
- Auto-configure Rust toolchain
- Generate .dmg installer
- Upload build artifacts
```

#### Windows Build (`build-windows`)

```yaml
- Support x86_64 and aarch64 architectures
- Auto-configure Rust toolchain
- Generate .exe installer
- Upload build artifacts
```

#### Linux Build (`build-linux`)

```yaml
- Support x86_64 and aarch64 architectures
- Configure cross-compilation environment
- Generate AppImage, DEB, RPM packages
- Upload build artifacts
```

### 3. Mobile Platform Builds

#### iOS Build (`build-ios`)

```yaml
- Configure Xcode environment
- Initialize iOS project
- Build iOS application
- Upload build artifacts
```

#### Android Build (`build-android`)

```yaml
- Configure Android SDK and NDK
- Initialize Android project
- Build APK file
- Upload build artifacts
```

### 4. Release Process

#### Create Release (`create-release`)

```yaml
- Auto-generate version number
- Create GitHub Release
- Generate detailed release notes
- Support draft and pre-release
```

#### Upload Build Artifacts (`upload-release-assets`)

```yaml
- Download all build artifacts
- Rename files to identify platforms
- Upload to GitHub Release
- Support multiple file formats
```

## 🛠️ Usage

### Automatic Release (Recommended)

1. **Create and push tag**:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Workflow runs automatically**:
   - Auto-build all platforms
   - Create GitHub Release
   - Upload all build artifacts

### Manual Trigger

1. **Visit GitHub Actions page**:

   ```
   https://github.com/your-username/your-repo/actions
   ```

2. **Select "Build and Release" workflow**

3. **Click "Run workflow"**

4. **Configure options**:
   - Select branch
   - Choose build target
   - Choose release type

5. **Click "Run workflow" to start building**

### Test Build Only

When pushing code to main branch or creating Pull Request, the workflow will:

- Run frontend tests
- Build desktop versions (no release)
- Verify code quality

## 📦 Build Artifacts

### File Naming Convention

Build artifacts are named according to:

```
{app-name}-{version}-{platform-identifier}.{extension}
```

Examples:

- `template-tauri-react-1.0.0-macOS-Intel.dmg`
- `template-tauri-react-1.0.0-Windows-x64.exe`
- `template-tauri-react-1.0.0-Linux-x64.AppImage`
- `iOS-template-tauri-react-1.0.0.ipa`
- `Android-template-tauri-react-1.0.0.apk`

### Download Locations

After build completion, download from:

1. **GitHub Releases**: Official released versions
2. **Actions Artifacts**: Test build temporary files (auto-deleted after 3 days)

## 🔒 Security Configuration

### Required Secrets

The workflow uses these GitHub Secrets:

- `GITHUB_TOKEN`: Auto-provided, used for creating releases and uploading files

### Optional Secrets

For code signing or special configuration, you can add:

- `APPLE_CERTIFICATE`: macOS app signing certificate
- `APPLE_CERTIFICATE_PASSWORD`: Certificate password
- `ANDROID_KEYSTORE`: Android app signing key
- `ANDROID_KEYSTORE_PASSWORD`: Key password

## 🐛 Troubleshooting

### Common Issues

1. **Build Failure**:
   - Check Node.js version consistency:

     ```bash
     # Check local Node.js version
     node --version

     # Use version from .nvmrc file
     nvm use  # or fnm use
     ```

   - Check if dependencies are correctly installed:
     ```bash
     pnpm install --frozen-lockfile
     ```
   - Ensure `pnpm-lock.yaml` and `.nvmrc` exist and are up-to-date
   - Check Rust toolchain:
     ```bash
     rustup update
     ```
   - Review error messages in build logs
   - Ensure script commands in `package.json` are correct

2. **Release Failure**:
   - Check if you have sufficient permissions
   - Ensure tag format is correct (starts with `v`)
   - Check `GITHUB_TOKEN` permissions

3. **Mobile Build Failure**:
   - Ensure mobile environment is correctly configured
   - Check SDK and NDK versions
   - Verify project configuration files

### Debugging Tips

1. **View detailed logs**:
   - Click specific workflow run on Actions page
   - Expand failed steps to see detailed errors

2. **Local testing**:

   ```bash
   # Test frontend build
   pnpm run build

   # Test desktop build
   pnpm run build:desktop

   # Test specific platform
   pnpm run build:mac-x86
   ```

3. **Check configuration**:
   - Verify `build.config.js` configuration
   - Check `tauri.conf.json` settings
   - Confirm `package.json` scripts

## 📚 Related Documentation

- [Build and Deployment Guide](BUILD_DEPLOYMENT.en.md)
- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md)
- [Troubleshooting Guide](TROUBLESHOOTING.en.md)
- [Frontend Build Optimization](frontend-build-optimization.en.md)

## 🤝 Contributing

If you find issues with the workflow configuration or have improvement
suggestions, please:

1. Submit Issues to report problems
2. Create Pull Requests to provide fixes
3. Participate in discussions for improvement proposals

---

**Note**: For first-time use, it's recommended to verify the workflow
configuration on a test branch first, ensuring everything works properly before
using in production.
