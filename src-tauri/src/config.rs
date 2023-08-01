use serde_derive::{Deserialize, Serialize};

/// The software settings.
#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    /// The window position. NOTE:NOT CURRENTLY IN USE - AN EXAMPLE
    window_pos: (u32, u32),
    /// The current devextreme theme used by the application.
    dx_theme: String,
    /// The current application locale used by the i18next library
    locale: String,
    /// The lock view timeout in minutes for the application. 0 means disabled.
    lock_timeout: u32,
    /// An amount of attempts the user inputted password can be invalid before the application closes. 0 is disabled.
    failed_unlock_attempts: u32,
    /// A value indicating whether the plugin-window-state should be used to remember the previous window state.
    save_window_state: bool,
}

// The default value for the application configuration.
impl ::std::default::Default for AppConfig {
    fn default() -> Self {
        Self {
            window_pos: (320, 280),
            dx_theme: "generic.carmine".to_string(),
            locale: "en".to_string(),
            lock_timeout: 10,
            failed_unlock_attempts: 10,
            save_window_state: true,
        }
    }
}

/// Gets the application config from a file or default if one doesn't exist.
///
/// # Returns
/// An AppConfig value
pub fn get_app_config() -> AppConfig {
    let result = match confy::load("PasswordKeeper", None) {
        Ok(v) => v,
        Err(_e) => AppConfig::default(),
    };

    result
}

/// Saves the application config to a settings file using confy. The file format is TOML.
/// # Arguments
///
/// * `config` - the application configuration value.
///
/// # Returns
/// `true` if the config was successfully saved; `false` otherwise.
pub fn set_app_config(config: AppConfig) -> bool {
    let result = match confy::store("PasswordKeeper", None, config) {
        Ok(_) => true,
        Err(_) => false,
    };

    result
}
