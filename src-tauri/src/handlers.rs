use base64::{engine::general_purpose, Engine as _};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::process::Command;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

// 系统信息结构体
#[derive(Debug, Serialize)]
pub struct SystemInfo {
    key: String,
    name: String,
    value: serde_json::Value,
}

// 版本信息结构体
#[derive(Debug, Serialize)]
pub struct VersionInfo {
    app_version: String,
    rust_version: String,
    os_version: String,
}

// 网络信息结构体
#[derive(Debug, Serialize)]
pub struct NetworkInfo {
    local_ip: String,
    public_ip: String,
}

// 硬盘信息结构体
#[derive(Debug, Serialize)]
pub struct DiskInfo {
    total: String,
    used: String,
    free: String,
}

// HTTP 请求配置
#[derive(Debug, Deserialize)]
pub struct HttpConfig {
    pub timeout: Option<u64>,
    pub headers: Option<HashMap<String, String>>,
    pub response_type: Option<String>,
}

// HTTP 请求选项
#[derive(Debug, Deserialize)]
pub struct HttpOptions {
    pub method: Option<String>,
    pub url: String,
    pub data: Option<serde_json::Value>,
    pub timeout: Option<u64>,
    pub headers: Option<HashMap<String, String>>,
    pub response_type: Option<String>,
}

// HTTP 响应结构体
#[derive(Debug, Serialize)]
pub struct HttpResponse {
    pub data: serde_json::Value,
    pub status: u16,
    pub status_text: String,
    pub headers: HashMap<String, String>,
    pub success: bool,
}

/**
 * 获取系统信息
 */
#[tauri::command]
pub async fn get_system_info() -> Result<Vec<SystemInfo>, String> {
    let arch = std::env::consts::ARCH.to_string();
    let platform = std::env::consts::OS.to_string();
    let cpu_count = num_cpus::get();

    // 获取总内存（字节）
    let total_memory = sysinfo::System::new_all().total_memory();
    let total_memory_gb = (total_memory as f64 / 1024.0 / 1024.0 / 1024.0).round() as u64;

    let system_info = vec![
        SystemInfo {
            key: "arch".to_string(),
            name: "系统架构".to_string(),
            value: serde_json::Value::String(arch),
        },
        SystemInfo {
            key: "platform".to_string(),
            name: "操作系统".to_string(),
            value: serde_json::Value::String(platform),
        },
        SystemInfo {
            key: "cpu_count".to_string(),
            name: "CPU 核心数".to_string(),
            value: serde_json::Value::Number(serde_json::Number::from(cpu_count)),
        },
        SystemInfo {
            key: "total_memory".to_string(),
            name: "总内存".to_string(),
            value: serde_json::Value::String(format!("{} GB", total_memory_gb)),
        },
    ];

    Ok(system_info)
}

/**
 * 获取版本信息
 */
#[tauri::command]
pub async fn get_version_info() -> Result<VersionInfo, String> {
    let app_version = env!("CARGO_PKG_VERSION").to_string();
    let rust_version = rustc_version_runtime::version().to_string();

    // 获取操作系统版本
    let os_version = match std::env::consts::OS {
        "windows" => {
            // Windows 版本获取
            match Command::new("cmd").args(["/C", "ver"]).output() {
                Ok(output) => String::from_utf8_lossy(&output.stdout).trim().to_string(),
                Err(_) => "Unknown Windows Version".to_string(),
            }
        }
        "macos" => {
            // macOS 版本获取
            match Command::new("sw_vers").arg("-productVersion").output() {
                Ok(output) => String::from_utf8_lossy(&output.stdout).trim().to_string(),
                Err(_) => "Unknown macOS Version".to_string(),
            }
        }
        "linux" => {
            // Linux 版本获取
            match std::fs::read_to_string("/etc/os-release") {
                Ok(content) => {
                    for line in content.lines() {
                        if line.starts_with("PRETTY_NAME=") {
                            return Ok(VersionInfo {
                                app_version,
                                rust_version,
                                os_version: line
                                    .split('=')
                                    .nth(1)
                                    .unwrap_or("Unknown Linux")
                                    .trim_matches('"')
                                    .to_string(),
                            });
                        }
                    }
                    "Unknown Linux Distribution".to_string()
                }
                Err(_) => "Unknown Linux Version".to_string(),
            }
        }
        _ => "Unknown OS".to_string(),
    };

    Ok(VersionInfo {
        app_version,
        rust_version,
        os_version,
    })
}

/**
 * 获取硬盘信息
 */
#[tauri::command]
pub async fn get_disk_info() -> Result<DiskInfo, String> {
    let output = match std::env::consts::OS {
        "windows" => Command::new("wmic")
            .args(["logicaldisk", "get", "size,freespace,caption"])
            .output(),
        "macos" | "linux" => Command::new("df").args(["-h", "/"]).output(),
        _ => return Err("不支持的操作系统".to_string()),
    };

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            parse_disk_info(&stdout)
        }
        Err(e) => Err(format!("获取硬盘信息失败: {}", e)),
    }
}

/**
 * 解析硬盘信息的辅助函数
 */
fn parse_disk_info(output: &str) -> Result<DiskInfo, String> {
    let lines: Vec<&str> = output.lines().collect();

    if std::env::consts::OS == "windows" {
        if lines.len() >= 2 {
            let parts: Vec<&str> = lines[1].split_whitespace().collect();
            if parts.len() >= 2 {
                let total_bytes: u64 = parts[1].parse().unwrap_or(0);
                let free_bytes: u64 = parts[0].parse().unwrap_or(0);
                let used_bytes = total_bytes.saturating_sub(free_bytes);

                return Ok(DiskInfo {
                    total: format!("{}GB", total_bytes / 1024 / 1024 / 1024),
                    free: format!("{}GB", free_bytes / 1024 / 1024 / 1024),
                    used: format!("{}GB", used_bytes / 1024 / 1024 / 1024),
                });
            }
        }
    } else {
        // macOS/Linux
        if lines.len() >= 2 {
            let parts: Vec<&str> = lines[1].split_whitespace().collect();
            if parts.len() >= 4 {
                return Ok(DiskInfo {
                    total: parts[1].to_string(),
                    used: parts[2].to_string(),
                    free: parts[3].to_string(),
                });
            }
        }
    }

    Err("解析硬盘信息失败".to_string())
}

/**
 * 获取文件路径（打开文件对话框）
 */
#[tauri::command]
pub async fn get_file_path(app: AppHandle) -> Result<Option<String>, String> {
    use std::sync::mpsc;
    use std::sync::{Arc, Mutex};

    let (tx, rx) = mpsc::channel();
    let tx = Arc::new(Mutex::new(Some(tx)));

    app.dialog()
        .file()
        .add_filter("所有文件", &["*"])
        .pick_file(move |file_path| {
            if let Some(sender) = tx.lock().unwrap().take() {
                let _ = sender.send(file_path);
            }
        });

    let file_path = rx.recv().map_err(|e| format!("接收文件路径失败: {}", e))?;
    Ok(file_path.map(|file_path| match file_path {
        tauri_plugin_dialog::FilePath::Path(path) => path.display().to_string(),
        tauri_plugin_dialog::FilePath::Url(url) => url.to_string(),
    }))
}

/**
 * 获取目录路径（打开目录对话框）
 */
#[tauri::command]
pub async fn get_directory_path(app: AppHandle) -> Result<Option<String>, String> {
    #[cfg(desktop)]
    {
        use std::sync::mpsc;
        use std::sync::{Arc, Mutex};

        let (tx, rx) = mpsc::channel();
        let tx = Arc::new(Mutex::new(Some(tx)));

        app.dialog().file().pick_folder(move |dir_path| {
            if let Some(sender) = tx.lock().unwrap().take() {
                let _ = sender.send(dir_path);
            }
        });

        let dir_path = rx.recv().map_err(|e| format!("接收目录路径失败: {}", e))?;
        Ok(dir_path.map(|dir_path| match dir_path {
            tauri_plugin_dialog::FilePath::Path(path) => path.display().to_string(),
            tauri_plugin_dialog::FilePath::Url(url) => url.to_string(),
        }))
    }

    #[cfg(mobile)]
    {
        let _ = app; // 避免未使用变量警告
                     // 移动平台不支持目录选择对话框
        Err("移动平台不支持目录选择功能".to_string())
    }
}

/**
 * 打开新窗口
 */
#[tauri::command]
pub async fn open_window(app: AppHandle, path: String) -> Result<(), String> {
    #[cfg(desktop)]
    let _window = tauri::WebviewWindowBuilder::new(
        &app,
        "child_window",
        tauri::WebviewUrl::App(format!("#{}", path).into()),
    )
    .title("子窗口")
    .inner_size(900.0, 720.0)
    .center()
    .resizable(false)
    .visible(true)
    .build()
    .map_err(|e| format!("创建窗口失败: {}", e))?;

    #[cfg(mobile)]
    let _window = tauri::WebviewWindowBuilder::new(
        &app,
        "child_window",
        tauri::WebviewUrl::App(format!("#{}", path).into()),
    )
    .build()
    .map_err(|e| format!("创建窗口失败: {}", e))?;

    Ok(())
}

/**
 * 关闭应用
 */
#[tauri::command]
pub async fn app_close(app: AppHandle) -> Result<(), String> {
    app.exit(0);
    Ok(())
}

/**
 * HTTP GET 请求
 */
#[tauri::command]
pub async fn http_get(url: String, config: Option<HttpConfig>) -> Result<HttpResponse, String> {
    make_http_request("GET".to_string(), url, None, config).await
}

/**
 * HTTP POST 请求
 */
#[tauri::command]
pub async fn http_post(
    url: String,
    data: Option<serde_json::Value>,
    config: Option<HttpConfig>,
) -> Result<HttpResponse, String> {
    make_http_request("POST".to_string(), url, data, config).await
}

/**
 * 通用 HTTP 请求
 */
#[tauri::command]
pub async fn http_request(options: HttpOptions) -> Result<HttpResponse, String> {
    let method = options.method.unwrap_or_else(|| "GET".to_string());
    let config = HttpConfig {
        timeout: options.timeout,
        headers: options.headers,
        response_type: options.response_type,
    };

    make_http_request(method, options.url, options.data, Some(config)).await
}

/**
 * 执行 HTTP 请求的辅助函数
 */
async fn make_http_request(
    method: String,
    url: String,
    data: Option<serde_json::Value>,
    config: Option<HttpConfig>,
) -> Result<HttpResponse, String> {
    let timeout = config.as_ref().and_then(|c| c.timeout).unwrap_or(10000); // 默认 10 秒超时

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_millis(timeout))
        .user_agent("Tauri-App/1.0.0")
        .build()
        .map_err(|e| format!("创建 HTTP 客户端失败: {}", e))?;

    let mut request_builder = match method.to_uppercase().as_str() {
        "GET" => client.get(&url),
        "POST" => client.post(&url),
        "PUT" => client.put(&url),
        "DELETE" => client.delete(&url),
        "PATCH" => client.patch(&url),
        _ => return Err(format!("不支持的 HTTP 方法: {}", method)),
    };

    // 添加自定义头部
    if let Some(config) = &config {
        if let Some(headers) = &config.headers {
            for (key, value) in headers {
                request_builder = request_builder.header(key, value);
            }
        }
    }

    // 添加请求体
    if let Some(data) = data {
        request_builder = request_builder.json(&data);
    }

    // 发送请求
    let response = request_builder
        .send()
        .await
        .map_err(|e| format!("HTTP 请求失败: {}", e))?;

    let status = response.status().as_u16();
    let status_text = response
        .status()
        .canonical_reason()
        .unwrap_or("Unknown")
        .to_string();
    let success = response.status().is_success();

    // 获取响应头
    let mut headers = HashMap::new();
    for (key, value) in response.headers() {
        if let Ok(value_str) = value.to_str() {
            headers.insert(key.to_string(), value_str.to_string());
        }
    }

    // 获取响应体
    let response_data = if let Some(config) = &config {
        match config.response_type.as_deref() {
            Some("buffer") => {
                let bytes = response
                    .bytes()
                    .await
                    .map_err(|e| format!("读取响应数据失败: {}", e))?;
                serde_json::Value::String(general_purpose::STANDARD.encode(bytes))
            }
            Some("base64") => {
                let bytes = response
                    .bytes()
                    .await
                    .map_err(|e| format!("读取响应数据失败: {}", e))?;
                serde_json::Value::String(general_purpose::STANDARD.encode(bytes))
            }
            _ => {
                // 默认尝试解析为 JSON，失败则返回文本
                let text = response
                    .text()
                    .await
                    .map_err(|e| format!("读取响应文本失败: {}", e))?;

                match serde_json::from_str::<serde_json::Value>(&text) {
                    Ok(json) => json,
                    Err(_) => serde_json::Value::String(text),
                }
            }
        }
    } else {
        // 默认处理
        let text = response
            .text()
            .await
            .map_err(|e| format!("读取响应文本失败: {}", e))?;

        match serde_json::from_str::<serde_json::Value>(&text) {
            Ok(json) => json,
            Err(_) => serde_json::Value::String(text),
        }
    };

    Ok(HttpResponse {
        data: response_data,
        status,
        status_text,
        headers,
        success,
    })
}
