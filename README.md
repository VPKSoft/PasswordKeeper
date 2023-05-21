# PasswordKeeper
A software to store login information into an encrypted file. 

[![Lint & Test deployment package](https://github.com/VPKSoft/PasswordKeeper/actions/workflows/main-lint-test-deploy.yml/badge.svg)](https://github.com/VPKSoft/PasswordKeeper/actions/workflows/main-lint-test-deploy.yml)

![image](https://github.com/VPKSoft/PasswordKeeper/assets/40712699/1590e60d-6f37-4c17-bd84-3e5f024e904e)

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
};
```

# Getting started
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
1. Keeping it simple, see: [The KISS Princible](https://en.wikipedia.org/wiki/KISS_principle)
2. I want to learn [rust](https://www.rust-lang.org)
3. To have the code base working fully cross platform
4. Have a simple structure with strong encryption for the file the data is stored into.
5. Progamming is a nice hobby 🤓

# Thanks to
* [Tauri](https://tauri.app)
* [Node.js](https://nodejs.org)
* [React](https://react.dev)
* [Font Awesome *Free*](https://fontawesome.com/search?o=r&m=free)
* [Weblate](https://weblate.org)
* [i18next](https://www.i18next.com)
* *UX Powered by* **[DevExtreme](https://js.devexpress.com/NonCommercial/)** *[Non-Commercial license](https://js.devexpress.com/Licensing/#NonCommercial)*, See: [DevExtreme Non-Commercial, Non-Competitive End User License Agreement](https://js.devexpress.com/EULAs/DevExtremeNonCommercial/)

