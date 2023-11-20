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

use arboard::Clipboard;
use auth2fa::{gen_secret_otpauth, Auth2FAResult};
use config::{get_app_config, set_app_config, AppConfig};
use encryption::{decrypt_small_file, encrypt_small_file};
use fonts::get_font_families;
use serde::{Deserialize, Serialize};

mod auth2fa;
mod config;
mod encryption;
mod fonts;

/// Run the Tauri application.
#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            save_file,
            load_file,
            load_settings,
            get_font_families_data,
            save_settings,
            gen_otpauth,
            clear_clipboard,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Saves the specified JSON data into a file encrypted with the specified password.
///
/// # Arguments
/// * `json_data` - The JSON data to encrypt into the file contents.
/// * `file_name` - The file name to save the data into.
/// * `password` - The password to use for the data encryption.
///
/// # Returns
/// * `bool` value indicating whether the save operation was successful.
#[tauri::command]
async fn save_file(json_data: String, file_name: String, password: String) -> bool {
    let result = !encrypt_small_file(&file_name, &password, &json_data).is_err();
    result
}

/// Sets the clipboard text to an empty `String` if the specified `current_supposed_value` matches the current clipboard content as `String`.
///
/// # Arguments
/// * `current_supposed_value` - the `String` value the clipboard is supposed to contain in order to clear the clipboard value.
///
/// # Returns
/// `true` if the clipboard data was successfully reset; `false` otherwise.
#[tauri::command]
async fn clear_clipboard(current_supposed_value: String) -> bool {
    let mut clipboard = Clipboard::new().unwrap();

    let current_text = match clipboard.get_text() {
        Ok(text) => text,
        Err(_) => "".to_string(),
    };

    let mut result = false;

    if current_text == current_supposed_value {
        result = match clipboard.set_text("".to_string()) {
            Ok(_) => true,
            Err(_) => false,
        };
    }

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

#[derive(Serialize, Deserialize)]
struct StringListResult {
    value: Vec<String>,
    error: bool,
}

/// Loads the system font families for the frontend in alphabetic order.
///
/// # Returns
/// A `StringListResult` value with the font families and a flag indicating whether an error occurred.
#[tauri::command]
async fn get_font_families_data() -> StringListResult {
    let result = match get_font_families() {
        Ok(family_vec) => StringListResult {
            error: false,
            value: family_vec,
        },
        Err(_) => StringListResult {
            error: true,
            value: Vec::new(),
        },
    };

    result
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
