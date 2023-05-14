#!/bin/sh
npm install
mkdir -p ./src/assets/css/devextreme
cp -r ./node_modules/devextreme/dist/css/* ./src/assets/css/devextreme
mkdir ./dist
cargo install --path ./src-tauri
wget https://use.fontawesome.com/releases/v6.4.0/fontawesome-free-6.4.0-web.zip
unzip fontawesome-free-6.4.0-web.zip -d ./src/assets/css
rm ./fontawesome-free-6.4.0-web.zip