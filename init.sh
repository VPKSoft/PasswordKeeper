#!/bin/sh

# Based on a code by Krystian Safjan: See: https://safjan.com/bash-determine-if-linux-or-macos/

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac

npm install
mkdir ./dist
cargo install --path ./src-tauri
# wget https://use.fontawesome.com/releases/v6.4.0/fontawesome-free-6.4.0-web.zip
curl https://use.fontawesome.com/releases/v6.4.0/fontawesome-free-6.4.0-web.zip -o ./fontawesome-free-6.4.0-web.zip

if [ "$machine" == "Mac" ]; then # unzip doesn't seem to create directories in macOs
    mkdir -p ./src/assets/css

unzip fontawesome-free-6.4.0-web.zip -d ./src/assets/css
rm ./fontawesome-free-6.4.0-web.zip
