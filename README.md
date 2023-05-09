# PasswordKeeper
A software to store login information into an encrypted file. 

# The encryption
The encryption algorithm used is [AES-GCM-SIV](https://en.wikipedia.org/wiki/AES-GCM-SIV) with [Argon2](https://en.wikipedia.org/wiki/Argon2) / Argon2id key derivation function.

# The file structure
|Entry|Length|
|---|---|
|Random [salt](https://en.wikipedia.org/wiki/Salt_(cryptography))|32 bytes|
|Random [nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce)|12 bytes|
|The length of the encrypted data|8 bytes (64-bit) unsigned integer|
|The encrypted data|N bytes|


### Todo
* Add keyboard listener to dialogs
* ~~Add delete possibility~~
* ~~Add generic confirm dialog with yes/no/cancel~~
* Sync toolbar and menu item deleted statuses to
  - File being open
  - Item / category selected state
* ~~Add settings popup~~
* Add window positioning
* Add about popup with license
* ~~Adjust the theming of the window title based on the selected DevExtreme theme~~
* Remember windows size & position (See: https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/window-state)

### Thanks to
* [Tauri](https://tauri.app)
* [Node.js](https://nodejs.org)
* [React](https://react.dev)
* *UX Powered by* **[DevExtreme](https://js.devexpress.com/NonCommercial/)** *[Non-Commercial license](https://js.devexpress.com/Licensing/#NonCommercial)*, See: [DevExtreme Non-Commercial, Non-Competitive End User License Agreement](https://js.devexpress.com/EULAs/DevExtremeNonCommercial/)

