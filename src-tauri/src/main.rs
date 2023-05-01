/*
MIT License

Copyright (c) 2023 Petteri Kautonen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use encryption::{decrypt_small_file, encrypt_small_file};
use serde::{Deserialize, Serialize};

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
async fn save_file(json_data: String, file_name: String, password: String) -> bool {
    let result = !encrypt_small_file(&file_name, &password, &json_data).is_err();
    result
}

#[derive(Serialize, Deserialize)]
struct StringResult {
    value: String,
    error: bool,
}

#[tauri::command]
async fn load_file(file_name: String, password: String) -> StringResult {
    let result = match decrypt_small_file(&file_name, &password) {
        Ok(v) => StringResult {
            value: v,
            error: false,
        },
        Err(e) => StringResult {
            value: e.to_string(),
            error: true,
        },
    };
    result
}
