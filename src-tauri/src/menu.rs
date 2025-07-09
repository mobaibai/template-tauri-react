use tauri::menu::{Menu, MenuBuilder, MenuEvent, MenuItemBuilder, SubmenuBuilder};
use tauri::{AppHandle, Emitter, Manager};

/// 菜单ID枚举
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum MenuId {
    Copy,
    Paste,
    SelectAll,
    QuickRestart,
    CloseCurrentWindow,
    CloseAllWindows,
    About,
    #[cfg(debug_assertions)]
    ToggleDevMode,
}

impl MenuId {
    pub fn as_str(&self) -> &'static str {
        match self {
            MenuId::Copy => "copy",
            MenuId::Paste => "paste",
            MenuId::SelectAll => "select_all",
            MenuId::QuickRestart => "quick_restart",
            MenuId::CloseCurrentWindow => "close_current_window",
            MenuId::CloseAllWindows => "close_all_windows",
            MenuId::About => "about",
            #[cfg(debug_assertions)]
            MenuId::ToggleDevMode => "toggle_dev_mode",
        }
    }
}

/// 创建应用菜单
pub fn create_menu(app: &AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    // 设置子菜单
    let settings_submenu = SubmenuBuilder::new(app, "设置")
        .item(
            &MenuItemBuilder::new("复制")
                .id(MenuId::Copy.as_str())
                .accelerator("CmdOrCtrl+C")
                .build(app)?,
        )
        .item(
            &MenuItemBuilder::new("粘贴")
                .id(MenuId::Paste.as_str())
                .accelerator("CmdOrCtrl+V")
                .build(app)?,
        )
        .item(
            &MenuItemBuilder::new("全选")
                .id(MenuId::SelectAll.as_str())
                .accelerator("CmdOrCtrl+A")
                .build(app)?,
        )
        .separator()
        .item(
            &MenuItemBuilder::new("快速重启")
                .id(MenuId::QuickRestart.as_str())
                .accelerator("CmdOrCtrl+R")
                .build(app)?,
        )
        .separator()
        .item(
            &MenuItemBuilder::new("关闭当前窗口")
                .id(MenuId::CloseCurrentWindow.as_str())
                .accelerator("CmdOrCtrl+W")
                .build(app)?,
        )
        .item(
            &MenuItemBuilder::new("关闭所有窗口")
                .id(MenuId::CloseAllWindows.as_str())
                .accelerator("CmdOrCtrl+Q")
                .build(app)?,
        )
        .build()?;

    // 帮助子菜单
    let help_submenu = SubmenuBuilder::new(app, "帮助")
        .item(
            &MenuItemBuilder::new("关于")
                .id(MenuId::About.as_str())
                .build(app)?,
        )
        .build()?;

    // 主菜单
    #[cfg_attr(not(debug_assertions), allow(unused_mut))]
    let mut menu_builder = MenuBuilder::new(app)
        .item(&settings_submenu)
        .item(&help_submenu);

    // 开发模式下添加开发者菜单
    #[cfg(debug_assertions)]
    {
        let dev_submenu = SubmenuBuilder::new(app, "开发者设置")
            .item(
                &MenuItemBuilder::new("切换到开发者模式")
                    .id(MenuId::ToggleDevMode.as_str())
                    .accelerator("CmdOrCtrl+Alt+I")
                    .build(app)?,
            )
            .build()?;
        menu_builder = menu_builder.item(&dev_submenu);
    }

    menu_builder.build()
}

/// 处理菜单事件
pub fn handle_menu_event(app: &AppHandle, event: &MenuEvent) {
    let menu_id = event.id().as_ref();

    match menu_id {
        "copy" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.emit("menu-copy", ());
            }
        }
        "paste" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.emit("menu-paste", ());
            }
        }
        "select_all" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.emit("menu-select-all", ());
            }
        }
        "quick_restart" => {
            app.restart();
        }
        "close_current_window" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.destroy();
            }
        }
        "close_all_windows" => {
            app.exit(0);
        }
        "about" => {
            let app_version = app.package_info().version.to_string();
            let system_info = format!(
                "版本信息：{}\n系统：{} {}\n架构：{}",
                app_version,
                std::env::consts::OS,
                std::env::consts::ARCH,
                std::env::consts::FAMILY
            );

            // 显示系统弹窗
            if let Some(_window) = app.get_webview_window("main") {
                use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};
                let dialog_message = format!("template-tauri-react脚手架\n\n{}", system_info);

                // 使用自定义按钮对话框
                app.dialog()
                    .message(dialog_message)
                    .title("关于")
                    .kind(MessageDialogKind::Info)
                    .buttons(MessageDialogButtons::OkCancelCustom(
                        "查看 GitHub".to_string(),
                        "确认".to_string(),
                    ))
                    .show(move |result| {
                        if result {
                            // 用户点击了"查看 GitHub"按钮，打开GitHub链接
                            if let Err(e) =
                                open::that("https://github.com/mobaibai/template-tauri-react")
                            {
                                eprintln!("Failed to open URL: {}", e);
                            }
                        }
                        // 如果result为false，用户点击了"确认"按钮，什么都不做
                    });
            }
        }
        "toggle_dev_mode" => {
            #[cfg(debug_assertions)]
            {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.open_devtools();
                }
            }
        }
        _ => {
            println!("未处理的菜单事件: {}", menu_id);
        }
    }
}
