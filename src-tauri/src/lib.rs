// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod read_dir_recursive;
mod rss;
use read_dir_recursive::read_dir_recursive;
use rss::{fetch_and_parse_rss, Channel};
use tauri::AppHandle;

#[tauri::command]
fn get_dir_info(path: &str) -> String {
    println!("input path: {}", path);
    let dir_info = read_dir_recursive(path);

    dir_info
}

#[tauri::command]
fn get_rss(app: AppHandle, url: String) {
    println!("input rss url: {}", url);
    fetch_and_parse_rss(app, &url);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_dir_info, get_rss])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
