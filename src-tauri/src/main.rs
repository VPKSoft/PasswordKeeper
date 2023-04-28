#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use encryption::{decrypt_small_file, encrypt_small_file};

mod encryption;
mod utils;

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            my_custom_command,
            create_window,
            save_file,
            load_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn my_custom_command() {
    println!("I was invoked from TS!");
}

#[tauri::command]
async fn create_window(app: tauri::AppHandle) {
    tauri::WindowBuilder::new(&app, "label", tauri::WindowUrl::App("about.html".into()))
        .build()
        .unwrap();
}

#[tauri::command]
async fn save_file(json_data: String, file_name: String) -> bool {
    let result = !encrypt_small_file(&file_name, "password", &json_data).is_err();
    result
}

#[tauri::command]
async fn load_file(file_name: String) -> String {
    let result = match decrypt_small_file(&file_name, "password") {
        Ok(v) => v,
        Err(e) => panic!("Decrypt failed: {}", e),
    };
    result
}
