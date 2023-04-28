npm install
cd ./util
./copy_devextreme_styles.ps1
./download_extract_fontawesome.ps1
cd ..
mkdir ./dist
cargo install --path ./src-tauri