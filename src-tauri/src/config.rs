use std::path::PathBuf;

use serde_derive::{Deserialize, Serialize};
use tauri::Manager;
use tokio::fs;

use crate::encryption::{decrypt_small_file, encrypt_small_file};

/// The software settings.
#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    /// The current application locale used by the i18next library
    locale: String,
    /// The lock view timeout in minutes for the application. 0 means disabled.
    lock_timeout: u32,
    /// An amount of attempts the user inputted password can be invalid before the application closes. 0 is disabled.
    failed_unlock_attempts: u32,
    /// A value indicating whether the plugin-window-state should be used to remember the previous window state.
    save_window_state: bool,
    /// A value indicating whether to use dark mode with the application.
    dark_mode: bool,
    /// A value indicating whether a load error occurred.
    error: bool,
    /// An error message if one occurred.
    error_message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServerSettings {
    user_id: i64,
    server_address: String,
    server_username: String,
    server_password: String,
    user_collection_token: String,
    shared_collection_token: String,
    admin_username: Option<String>,
    admin_password: Option<String>,
}

// The default value for the application configuration.
impl ::std::default::Default for AppConfig {
    fn default() -> Self {
        Self {
            locale: "en".to_string(),
            save_window_state: false,
            error: false,
            error_message: "".to_string(),
            lock_timeout: 10,
            failed_unlock_attempts: 10,
            dark_mode: false,
        }
    }
}

impl AppConfig {
    /// Creates a new AppConfig with the given error message and config path.
    /// # Arguments
    ///
    /// * `emsg` - The error message
    /// * `cfg_path` - The config path
    ///
    /// # Returns
    /// An AppConfig value
    pub fn error(emsg: &String, cfg_path: &str) -> Self {
        Self {
            error_message: format!("{}: '{}'", emsg, cfg_path),
            error: true,
            locale: "en".to_string(),
            save_window_state: false,
            dark_mode: false,
            lock_timeout: 10,
            failed_unlock_attempts: 10,
        }
    }
}

/// The error codes for the get_server_settings function
#[derive(Debug, Serialize, Deserialize)]
pub enum ServerSettingsError {
    Success,
    /// The file was not found
    NotFound,
    /// The file couldn't be decrypted with the password
    PasswordFailed,
    /// The file couldn't be serialized
    SerializeFailed,
    /// The file couldn't be deserialized
    DeserializeFailed,
    /// The file couldn't be saved
    FileSaveFailed,
}

/// Gets the server settings from a file or default if one doesn't exist.
/// # Arguments
/// * `cfg_path` - The config path
/// * `password` - The password to use for decryption
///
/// # Returns
/// A result of a ServerSettings value or a ServerSettingsError if one occurred
pub fn get_server_settings(
    cfg_path: &str,
    password: &str,
) -> Result<ServerSettings, ServerSettingsError> {
    if !PathBuf::from(cfg_path).exists() {
        return Err(ServerSettingsError::NotFound);
    }

    let result = match decrypt_small_file(cfg_path, &password) {
        Ok(v) => v,
        Err(_) => {
            return Err(ServerSettingsError::PasswordFailed);
        }
    };

    let server_settings: ServerSettings = match serde_json::from_str(result.as_str()) {
        Ok(v) => v,
        Err(_) => {
            return Err(ServerSettingsError::DeserializeFailed);
        }
    };

    return Ok(server_settings);
}

/// Saves the server settings to a file with encryption.
/// # Arguments
/// * `cfg_path` - The config path
/// * `server_settings` - The server settings to save
/// * `password` - The password to use for encryption
///
/// # Returns
/// A ServerSettingsError to indicate success or failure
pub fn set_server_settings(
    cfg_path: &str,
    server_settings: ServerSettings,
    password: &str,
) -> Result<ServerSettingsError, ServerSettingsError> {
    let result = match serde_json::to_string(&server_settings) {
        Ok(v) => v,
        Err(_) => {
            return Err(ServerSettingsError::SerializeFailed);
        }
    };

    match encrypt_small_file(cfg_path, &password, &result) {
        Ok(_) => Ok(ServerSettingsError::Success),
        Err(_) => Err(ServerSettingsError::FileSaveFailed),
    }
}

/// Gets the application config from a file or default if one doesn't exist.
/// # Arguments
/// * `app_handle` - The Tauri application handle
///
/// # Returns
/// An AppConfig value
pub async fn get_app_config(cfg_path: &str) -> AppConfig {
    if !PathBuf::from(cfg_path).exists() {
        let success = set_app_config(cfg_path, AppConfig::default()).await;
        if !success {
            return AppConfig::error(&String::from("Failed to save default config"), cfg_path);
        }
    }

    let result = match fs::read(cfg_path).await {
        Ok(v) => {
            // The vector to string
            let result = match String::from_utf8(v) {
                Ok(v) => {
                    let config: AppConfig = match serde_json::from_str(v.as_str()) {
                        Ok(v) => v,
                        Err(e) => AppConfig::error(&e.to_string(), cfg_path),
                    };
                    config
                }
                Err(e) => AppConfig::error(&e.to_string(), cfg_path),
            };
            result
        }
        Err(e) => {
            let result = AppConfig::error(&e.to_string(), cfg_path);
            result
        }
    };

    result
}

/// Saves the application config to a settings file using serde. The file format is JSON.
/// # Arguments
///
/// * `app_handle` - The Tauri application handle
/// * `config` - the application configuration value.
///
/// # Returns
/// `true` if the config was successfully saved; `false` otherwise.
pub async fn set_app_config(cfg_path: &str, config: AppConfig) -> bool {
    let result = match serde_json::to_string(&config) {
        Ok(v) => {
            let result = match fs::write(cfg_path, v).await {
                Ok(_) => true,
                Err(_) => false,
            };
            result
        }
        Err(_) => false,
    };
    result
}

/// Gets the application config path with the given file name.
///
/// # Arguments
///
/// * `app_handle` - The Tauri application handle
/// * `file_name` - The file name to append to the config path
///
/// # Returns
/// The application config path with the given file name
pub async fn get_config_path(app_handle: &tauri::AppHandle, file_name: &str) -> String {
    let binding = match app_handle.path().app_config_dir() {
        Ok(mut v) => {
            if !v.exists() {
                match fs::create_dir_all(&v).await {
                    Ok(_) => {}
                    Err(_) => {}
                }
            }
            v.push(file_name);
            v
        }
        Err(_) => {
            return "".to_string();
        }
    };

    let app_data_dir = match binding.to_str() {
        Some(v) => v,
        None => {
            return "".to_string();
        }
    };

    app_data_dir.to_string()
}
