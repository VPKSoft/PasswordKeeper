# PasswordKeeper
A software to store login information into an encrypted file. 

[![Lint & Test deployment package](https://github.com/VPKSoft/PasswordKeeper/actions/workflows/main-lint-test-deploy.yml/badge.svg)](https://github.com/VPKSoft/PasswordKeeper/actions/workflows/main-lint-test-deploy.yml)

# The encryption
The encryption algorithm used is [AES-GCM-SIV](https://en.wikipedia.org/wiki/AES-GCM-SIV) with [Argon2](https://en.wikipedia.org/wiki/Argon2) / Argon2id key derivation function.

# The file structure
|Entry|Length|
|---|---|
|Random [salt](https://en.wikipedia.org/wiki/Salt_(cryptography))|32 bytes|
|Random [nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce)|12 bytes|
|The length of the encrypted data|8 bytes (64-bit) unsigned integer|
|The encrypted data|N bytes|

# Getting started
* Install [rust](https://www.rust-lang.org) & cargo.
* Install [Node.js](https://nodejs.org)
* Run the init script, `init.ps1` for Windows, `init.sh` for Linux. *TODO: Mac*.
For linux Mint I needed to install the following packages for the rust build:
```sh
sudo apt-get install webkit2gtk-4.0
sudo apt-get install libjavascriptcoregtk4.0
sudo apt-get install libsoup2.4
```
* Install [VS Code](https://code.visualstudio.com)
* Add plugins to [VS Code](https://code.visualstudio.com)
  - [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
  - [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
  - [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)

* Debug with <kbd>F5</kbd>

### Todo
See: [TODO](docs/TODO.md)

### Thanks to
* [Tauri](https://tauri.app)
* [Node.js](https://nodejs.org)
* [React](https://react.dev)
* [Font Awesome *Free*](https://fontawesome.com/search?o=r&m=free)
* [Weblate](https://weblate.org)
* [i18next](https://www.i18next.com)
* *UX Powered by* **[DevExtreme](https://js.devexpress.com/NonCommercial/)** *[Non-Commercial license](https://js.devexpress.com/Licensing/#NonCommercial)*, See: [DevExtreme Non-Commercial, Non-Competitive End User License Agreement](https://js.devexpress.com/EULAs/DevExtremeNonCommercial/)

