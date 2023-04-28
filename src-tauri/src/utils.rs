use directories::ProjectDirs;
use std::path::Path;

/// Returns a project config path string with the file name appended to it.
/// # Arguments
///
/// * `file_name` - the file name to append to the project config path.
///
/// # Remarks
/// If the path does not exists it will be created.
pub fn make_path(file_name: String) -> String {
    if let Some(proj_dirs) = ProjectDirs::from("net", "VPKSoft", "PasswordKeeper") {
        let path = proj_dirs.config_dir();

        make_path_if_not_exists(path);

        let path_str = path.join(file_name).into_os_string().into_string().unwrap();

        return path_str;
    }

    return String::new();
}

/// Creates a path including all the subfolders if one doesn't allready exist.
/// # Arguments
///
/// * `path` - the path to create if one doesn't exist.
pub fn make_path_if_not_exists(path: &Path) {
    if !path.exists() {
        std::fs::create_dir_all(path).expect("Failed to create application setting path.");
        println!("Directory created: '{}'.", path.display());
    } else {
        println!("Directory already exists: '{}'.", path.display());
    }
}
