use serde_derive::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    window_pos: (u32, u32),
    dx_theme: String,
    locale: String,
    lock_timeout: u32,
    failed_unlock_attempts: u32,
}

impl ::std::default::Default for AppConfig {
    fn default() -> Self {
        Self {
            window_pos: (320, 280),
            dx_theme: "generic.carmine".to_string(),
            locale: "en".to_string(),
            lock_timeout: 10,
            failed_unlock_attempts: 10,
        }
    }
}

pub fn get_app_config() -> AppConfig {
    let result = match confy::load("PasswordKeeper", None) {
        Ok(v) => v,
        Err(_e) => AppConfig::default(),
    };

    result
}

pub fn set_app_config(config: AppConfig) -> bool {
    let result = match confy::store("PasswordKeeper", None, config) {
        Ok(_) => true,
        Err(_) => false,
    };

    result
}
