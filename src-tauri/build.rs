fn main() {
    // 设置跨平台编译环境变量
    if std::env::var("CARGO_CFG_TARGET_OS").unwrap_or_default() == "windows" {
        // 禁用一些可能导致编译器检测失败的特性
        println!("cargo:rustc-env=DISABLE_COMPILER_DETECTION=1");

        // 设置 Windows 特定的编译标志
        if std::env::var("CARGO_CFG_TARGET_ARCH").unwrap_or_default() == "x86_64" {
            println!("cargo:rustc-link-arg=/SUBSYSTEM:WINDOWS");
        }
    }

    // 抑制一些跨平台编译的警告
    println!("cargo:rustc-env=SUPPRESS_CROSS_COMPILE_WARNINGS=1");

    tauri_build::build()
}
