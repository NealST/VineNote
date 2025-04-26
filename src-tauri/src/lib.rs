// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod read_dir_recursive;
use read_dir_recursive::read_dir_recursive;

#[tauri::command]
fn get_dir_info(path: &str) -> String {
    println!("input path: {}", path);
    let dir_info = read_dir_recursive(path);

    dir_info
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_dir_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
