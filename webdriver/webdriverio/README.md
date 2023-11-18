# E2E tests for the PasswordKeeper

E2E test drafts for the PasswordKeeper application. The tests use [WebdriverIO](https://webdriver.io) test framework.

The tests are written based on the instructions on the [Tauri documentation](https://tauri.app/v1/guides/testing/webdriver/example/webdriverio).

## TODO
* Create actual sane tests
* Add CI/CD flow for the the E2E tests.

## Usage
**Linux**
For *Linux* run the *run_e2e.sh* script file. The following package is required to be installed: `webkit2gtk-driver`.

**Windows**
For *Windows* run the *run_e2e.ps1* script file. The [Microsoft Edge WebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver) needs to be extracted to a folder in the path.

**macOS**
Not implemented yet, see: [tauri-driver](https://crates.io/crates/tauri-driver):
*"[Todo] macOS w/ Appium Mac2 Driver (probably)"*
🤷‍♂️