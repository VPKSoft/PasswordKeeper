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

use auth2fa::{gen_secret_otpauth, Auth2FAResult};
use config::{get_app_config, set_app_config, AppConfig};
use encryption::{decrypt_small_file, encrypt_small_file};
use serde::{Deserialize, Serialize};

mod auth2fa;
mod config;
mod encryption;

/// Run the Tauri application.
#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_file,
            load_file,
            load_settings,
            save_settings,
            gen_otpauth,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn save_file(json_data: String, file_name: String, password: String) -> bool {
    let result = !encrypt_small_file(&file_name, &password, &json_data).is_err();
    result
}

/// A result struct for the `load_file` function.
#[derive(Serialize, Deserialize)]
struct StringResult {
    /// The file contents as JSON if the result was successful.
    value: String,
    /// A value indicating whether the `load_file` function succeeded.
    error: bool,
}

/// Loads the application settings requested by the frontend.
///
/// # Returns
/// Application settings.
#[tauri::command]
async fn load_settings() -> AppConfig {
    get_app_config()
}

/// Generates an OTPAuth key with the specified OTPAuth URL.
/// # Arguments
///
/// * `otpauth` - The OTPAuth URL.
///
/// # Returns
/// An `Auth2FAResult` `struct` value.
///
/// # Remarks
/// * In case of error the the `Auth2FAResult.success` value is set to `false`.
#[tauri::command]
async fn gen_otpauth(otpauth: String) -> Auth2FAResult {
    gen_secret_otpauth(otpauth)
}

/// Saves the settings passed from the frontend.
///
/// # Arguments
///
/// `config` - the application configuration.
///
/// # Returns
/// `true` if the settings were saved successfully; `false` otherwise.
#[tauri::command]
async fn save_settings(config: AppConfig) -> bool {
    set_app_config(config)
}

/// Loads a file requested by the frontend.
/// # Arguments
///
/// * `file_name` - the file to load.
/// * `password` - the password to use for decryption.
///
/// # Returns
/// A `StringResult` indicating success or failure with the file contents decrypted.
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
