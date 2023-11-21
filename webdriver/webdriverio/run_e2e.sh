#!/bin/sh
# required: sudo apt-get install webkit2gtk-driver
cargo install tauri-driver
cd ../../
npm run test-release
cd webdriver/webdriverio
xvfb-run npm test
