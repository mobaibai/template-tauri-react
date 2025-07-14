// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod handlers;
#[cfg(desktop)]
mod menu;

use std::time::Duration;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// 创建 Loading 窗口（不显示）
#[tauri::command]
async fn create_loading_window(app: AppHandle) -> Result<(), String> {
    #[cfg(desktop)]
    let _loading_window =
        WebviewWindowBuilder::new(&app, "loading", WebviewUrl::App("#/start-loading".into()))
            .inner_size(400.0, 400.0)
            .center() // 窗口居中显示
            .decorations(false)
            .skip_taskbar(true)
            .resizable(false)
            .always_on_top(true)
            .visible(false) // 创建时不显示
            .build()
            .map_err(|e| format!("Failed to create loading window: {}", e))?;

    #[cfg(mobile)]
    let _loading_window =
        WebviewWindowBuilder::new(&app, "loading", WebviewUrl::App("#/start-loading".into()))
            .build()
            .map_err(|e| format!("Failed to create loading window: {}", e))?;

    Ok(())
}

/// 前端加载完成后显示 Loading 窗口
#[tauri::command]
async fn notify_loading_ready(app: AppHandle) -> Result<(), String> {
    // 显示 loading 窗口
    if let Some(_loading_window) = app.get_webview_window("loading") {
        #[cfg(desktop)]
        _loading_window
            .show()
            .map_err(|e| format!("Failed to show loading window: {}", e))?;

        #[cfg(mobile)]
        {
            // 移动平台窗口默认可见，无需额外操作
        }

        // 1.8秒后创建主窗口并关闭 loading 窗口
        let app_handle = app.clone();
        tauri::async_runtime::spawn(async move {
            tokio::time::sleep(Duration::from_millis(1800)).await;

            // 创建主窗口
            if let Err(e) = create_main_window(app_handle.clone()).await {
                eprintln!("Failed to create main window: {}", e);
            }

            // 关闭 loading 窗口
            if let Some(loading_win) = app_handle.get_webview_window("loading") {
                #[cfg(desktop)]
                if let Err(e) = loading_win.close() {
                    eprintln!("Failed to close loading window: {}", e);
                }

                #[cfg(mobile)]
                {
                    // 移动平台窗口管理由系统处理
                    let _ = loading_win; // 避免未使用变量警告
                }
            }
        });
    } else {
        return Err("Loading window not found".to_string());
    }

    Ok(())
}

/// 更新窗口标题
#[tauri::command]
async fn update_window_title(app: AppHandle, title: String) -> Result<(), String> {
    if let Some(main_window) = app.get_webview_window("main") {
        #[cfg(desktop)]
        main_window
            .set_title(&title)
            .map_err(|e| format!("Failed to set window title: {}", e))?;

        #[cfg(mobile)]
        {
            // 移动平台可能不支持动态标题更新
            let _ = title; // 避免未使用变量警告
        }
    } else {
        return Err("Main window not found".to_string());
    }
    Ok(())
}

/// 创建主窗口
#[tauri::command]
async fn create_main_window(app: AppHandle) -> Result<(), String> {
    // 检查main窗口是否已存在，如果不存在则创建
    if app.get_webview_window("main").is_none() {
        #[cfg(desktop)]
        let _main_window = WebviewWindowBuilder::new(&app, "main", WebviewUrl::App("/".into()))
            .title("Tauri React 模板 - 首页")
            .inner_size(1280.0, 800.0)
            // .min_inner_size(1280.0, 800.0)
            .center() // 窗口居中显示
            .resizable(true)
            .visible(true)
            .build()
            .map_err(|e| format!("Failed to create main window: {}", e))?;

        #[cfg(mobile)]
        let _main_window = WebviewWindowBuilder::new(&app, "main", WebviewUrl::App("/".into()))
            .build()
            .map_err(|e| format!("Failed to create main window: {}", e))?;

        // 在Tauri 2.x中，窗口标题在创建时设置
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(desktop)]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // 创建菜单 (仅桌面平台)
            let menu = menu::create_menu(app.handle())?;
            app.set_menu(menu)?;

            // 创建 Loading 窗口
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = create_loading_window(app_handle).await {
                    eprintln!("Failed to create loading window: {}", e);
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            // 系统信息相关
            handlers::get_system_info,
            handlers::get_version_info,
            handlers::get_disk_info,
            // 文件操作相关
            handlers::get_file_path,
            handlers::get_directory_path,
            // 窗口操作相关
            handlers::open_window,
            handlers::app_close,
            create_loading_window,
            create_main_window,
            notify_loading_ready,
            update_window_title,
            // HTTP 请求相关
            handlers::http_get,
            handlers::http_post,
            handlers::http_request
        ])
        .on_menu_event(|app, event| {
            menu::handle_menu_event(app, &event);
        });

    #[cfg(mobile)]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // 创建 Loading 窗口
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = create_loading_window(app_handle).await {
                    eprintln!("Failed to create loading window: {}", e);
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            // 系统信息相关
            handlers::get_system_info,
            handlers::get_version_info,
            handlers::get_disk_info,
            // 文件操作相关
            handlers::get_file_path,
            handlers::get_directory_path,
            // 窗口操作相关
            handlers::open_window,
            handlers::app_close,
            create_loading_window,
            create_main_window,
            notify_loading_ready,
            update_window_title,
            // HTTP 请求相关
            handlers::http_get,
            handlers::http_post,
            handlers::http_request
        ]);

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
