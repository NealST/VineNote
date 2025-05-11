// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod read_dir_recursive;
mod rss;
mod search_keyword;

use read_dir_recursive::read_dir_recursive;
use rss::fetch_and_parse_rss;
use tauri::AppHandle;
use search_keyword::{search_files, SearchResult};
use std::path::Path;
use log::{error, info};

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

#[tauri::command]
async fn search_content(dir_path: String, keyword: String) -> Result<Vec<SearchResult>, String> {
  info!("Starting search in {} for keyword: {}", dir_path, keyword);
  let path = Path::new(&dir_path);
  if !path.exists() {
    return Err("Directory does not exist".to_string());
  }
  match search_files(path, &keyword) {
    Ok(results) => {
        info!("Search completed. Found {} matching files", results.len());
        Ok(results)
    }
    Err(e) => {
        error!("Search failed: {}", e);
        Err(format!("Search failed: {}", e))
    }
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_dir_info, get_rss, search_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
