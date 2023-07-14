# PasswordKeeper
A software to store login information into an encrypted file. 

[![Lint & Test deployment package](https://github.com/VPKSoft/PasswordKeeper/actions/workflows/main-lint-test-deploy.yml/badge.svg)](https://github.com/VPKSoft/PasswordKeeper/actions/workflows/main-lint-test-deploy.yml)

![image](https://github.com/VPKSoft/PasswordKeeper/assets/40712699/c4e0893b-32b0-4d27-9051-55e31a2dc271)

# The encryption
The encryption algorithm used is [AES-GCM-SIV](https://en.wikipedia.org/wiki/AES-GCM-SIV) with [Argon2](https://en.wikipedia.org/wiki/Argon2) / Argon2id key derivation function.

# The file structure
|Entry|Length|
|---|---|
|Random [salt](https://en.wikipedia.org/wiki/Salt_(cryptography))|32 bytes|
|Random [nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce)|12 bytes|
|The length of the encrypted data|8 bytes (64-bit) unsigned integer|
|The encrypted data|N bytes|

## The data structure within the file
The login information data is stored as an [JSON](https://en.wikipedia.org/wiki/JSON) array to the with the following [TypeScript](https://www.typescriptlang.org) type definition:
```typescript
/**
 * The entry / category data format for the program.
 */
export type DataEntry = {
    /** The name of the entry or a category. */
    name: string;
    /** The optional domain for the login credentials. */
    domain?: string | undefined;
    /** The host address where the login information is to be used. */
    address?: string | undefined;
    /** The user name for the credentials. */
    userName?: string | undefined;
    /** The password for the login credentials. */
    password?: string | undefined;
    /** Additional notes for the login information. */
    notes?: string | undefined;
    /** An unique identifier for an entry or a category. */
    id: number;
    /** In case of an entry the parent category for the entry. Otherwise -1. */
    parentId: number;
    /** The key <--> URL for OTP authentication. */
    otpAuthKey?: string;
};
```

# Install
## Windows
Download the [PasswordKeeper_0.2.3_x64-setup.exe](https://github.com/VPKSoft/PasswordKeeper/releases/download/app-v0.2.3/PasswordKeeper_0.2.3_x64-setup.exe), ignore the warnings and install the software.
If the installation fails you may need to install webview2, See: https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section

## Linux
1. Download the [password-keeper_0.2.3_amd64.AppImage](https://github.com/VPKSoft/PasswordKeeper/releases/download/app-v0.2.3/password-keeper_0.2.3_amd64.AppImage)
2. Run `chmod +x password-keeper_0.2.3_amd64.AppImage` on the file.
3. Run the password-keeper_0.2.3_amd64.AppImage file.

## macOS
1. Download the [PasswordKeeper_x64.app.tar.gz](https://github.com/VPKSoft/PasswordKeeper/releases/download/app-v0.2.3/PasswordKeeper_x64.app.tar.gz)
2. Extract the `PasswordKeeper.app` from the file
3. Run `xattr -c PasswordKeeper.app` on the file.
4. Run the `PasswordKeeper.app`

# Getting started with the source code
* Install [rust](https://www.rust-lang.org) & cargo.
* Install [Node.js](https://nodejs.org)
* Run the init script, `init.ps1` for Windows, `init.sh` for Linux & Mac.
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

# Why this software
I know there are a million password managers available already. The current solution I'm using is [VeraCrypt](https://www.veracrypt.fr/code/VeraCrypt/) virtual disk with an encrypted [LibreOffice](https://www.libreoffice.org) Calc file inside the disk. This is challenging to open for a quick review and I always forget to close the file or unmount the virtual disk - feel free to use the tip though 😄
Well, that was background noise - the reasons:
1. Keeping it simple, see: [The KISS Principle](https://en.wikipedia.org/wiki/KISS_principle)
2. I want to learn [rust](https://www.rust-lang.org)
3. To have the code base working fully cross platform
4. Have a simple structure with strong encryption for the file the data is stored into.
5. Programming is a nice hobby 🤓

# Thanks to
* [Tauri](https://tauri.app)
* [Node.js](https://nodejs.org)
* [React](https://react.dev)
* [Font Awesome *Free*](https://fontawesome.com/search?o=r&m=free)
* [Weblate](https://weblate.org)
* [i18next](https://www.i18next.com)
* [React Countdown Circle Timer](https://www.npmjs.com/package/react-countdown-circle-timer)
* [Html5-QRCode](https://www.npmjs.com/package/html5-qrcode)
* [totp-rs](https://crates.io/crates/totp-rs)
* *UX Powered by* **[DevExtreme](https://js.devexpress.com/NonCommercial/)** *[Non-Commercial license](https://js.devexpress.com/Licensing/#NonCommercial)*, See: [DevExtreme Non-Commercial, Non-Competitive End User License Agreement](https://js.devexpress.com/EULAs/DevExtremeNonCommercial/)
