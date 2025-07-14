// Tauri 多平台构建配置
const buildConfig = {
  // 构建目标配置
  targets: {
    // 桌面平台
    'mac-x86': {
      target: 'x86_64-apple-darwin',
      runner: 'cargo',
      sourceDir: 'src-tauri/target/x86_64-apple-darwin/release/bundle',
      platform: 'desktop',
    },
    'mac-aarch': {
      target: 'aarch64-apple-darwin',
      runner: 'cargo',
      sourceDir: 'src-tauri/target/aarch64-apple-darwin/release/bundle',
      platform: 'desktop',
    },
    'win-x86': {
      target: 'x86_64-pc-windows-msvc',
      runner: 'cargo-xwin',
      sourceDir: 'src-tauri/target/x86_64-pc-windows-msvc/release/bundle',
      platform: 'desktop',
    },
    'win-aarch': {
      target: 'aarch64-pc-windows-msvc',
      runner: 'cargo-xwin',
      sourceDir: 'src-tauri/target/aarch64-pc-windows-msvc/release/bundle',
      platform: 'desktop',
    },
    'linux-x86': {
      target: 'x86_64-unknown-linux-gnu',
      runner: 'cargo',
      sourceDir: 'src-tauri/target/x86_64-unknown-linux-gnu/release/bundle',
      platform: 'desktop',
    },
    'linux-aarch': {
      target: 'aarch64-unknown-linux-gnu',
      runner: 'cargo',
      sourceDir: 'src-tauri/target/aarch64-unknown-linux-gnu/release/bundle',
      platform: 'desktop',
    },

    // 移动平台
    ios: {
      target: 'aarch64-apple-ios',
      runner: 'tauri',
      sourceDir: 'src-tauri/gen/apple/build/Release-iphoneos',
      platform: 'mobile',
      buildCommand: 'ios build',
      requirements: {
        os: 'macOS',
        tools: ['Xcode', 'iOS SDK'],
        note: '需要 Apple Developer 账号进行真机测试和发布',
      },
    },
    'ios-sim': {
      target: 'x86_64-apple-ios',
      runner: 'tauri',
      sourceDir: 'src-tauri/gen/apple/build/Release-iphonesimulator',
      platform: 'mobile',
      buildCommand: 'ios build --target x86_64-apple-ios',
      requirements: {
        os: 'macOS',
        tools: ['Xcode', 'iOS Simulator'],
        note: '用于iOS模拟器测试',
      },
    },
    android: {
      target: 'aarch64-linux-android',
      runner: 'tauri',
      sourceDir: 'src-tauri/gen/android/app/build/outputs/apk',
      platform: 'mobile',
      buildCommand: 'android build',
      requirements: {
        os: 'any',
        tools: ['Android Studio', 'Android SDK', 'NDK'],
        note: '需要配置Android开发环境',
      },
    },
    'android-x86': {
      target: 'i686-linux-android',
      runner: 'tauri',
      sourceDir: 'src-tauri/gen/android/app/build/outputs/apk',
      platform: 'mobile',
      buildCommand: 'android build --target i686-linux-android',
      requirements: {
        os: 'any',
        tools: ['Android Studio', 'Android SDK', 'NDK'],
        note: '用于Android x86模拟器',
      },
    },
  },

  // 构建选项
  options: {
    // 构建完成后是否清理临时文件
    cleanAfterBuild: true,
    // 是否在构建前清理输出目录
    cleanBeforeBuild: true,
    // 输出目录根路径
    outputRoot: 'dist-builds',
    // 是否显示详细日志
    verbose: true,
  },

  // 环境变量配置（用于解决跨平台编译问题）
  env: {
    PKG_CONFIG_ALLOW_CROSS: '1',
    GLIB_2_0_NO_PKG_CONFIG: '1',
    GOBJECT_2_0_NO_PKG_CONFIG: '1',
    GIO_2_0_NO_PKG_CONFIG: '1',
  },
}

export default buildConfig
