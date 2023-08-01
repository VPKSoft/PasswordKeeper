/*
MIT License

Copyright (c) 2023 Petteri Kautonen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { invoke } from "@tauri-apps/api/tauri";
import { DxThemeNames } from "../utilities/ThemeUtils";
import { Locales } from "../i18n";

/**
 * The software settings returned by the Tauri app.
 */
export type Settings = {
    /** The current devextreme theme used by the application. */
    dx_theme: DxThemeNames;
    /** The window position. NOTE:NOT CURRENTLY IN USE - AN EXAMPLE */
    window_pos: Array<number>;
    /** The current application locale used by the i18next library. */
    locale: Locales;
    /** The lock view timeout in minutes for the application. 0 means disabled. */
    lock_timeout: number;
    /** An amount of attempts the user inputted password can be invalid before the application closes. 0 is disabled. */
    failed_unlock_attempts: number;
    /** A value indicating whether the plugin-window-state should be used to remember the previous window state. */
    save_window_state: boolean;
};

/**
 * Loads the application settings from the settings file.
 * Also the local storage is updated with the setting data so it can be used without a reload.
 * @returns {Promise<Settings>} A promise to the application settings.
 */
const loadSettings = async () => {
    try {
        const settings = (await invoke("load_settings")) as Settings;
        window.localStorage.setItem("settings", JSON.stringify(settings));
        return settings;
    } catch {
        return null;
    }
};

/**
 * Saves the application setting into a file.
 * Also the local storage is updated with the setting data so it can be used without a reload.
 * @param {Settings} settings The application settings to save into a file.
 * @returns {Promise<void>} A promise to save the application settings.
 */
const saveSettings = async (settings: Settings) => {
    try {
        await invoke("save_settings", { config: settings });
        window.localStorage.setItem("settings", JSON.stringify(settings));
        return true;
    } catch {
        return false;
    }
};

export { loadSettings, saveSettings };
