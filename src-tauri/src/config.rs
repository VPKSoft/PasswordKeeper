use serde_derive::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    window_pos: (u32, u32),
    dx_theme: String,
}

impl ::std::default::Default for AppConfig {
    fn default() -> Self {
        Self {
            window_pos: (320, 280),
            dx_theme: "generic.carmine".to_string(),
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
