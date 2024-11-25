/*
MIT License

Copyright (c) 2024 Petteri Kautonen

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

import * as React from "react";
import { invoke } from "@tauri-apps/api/core";
import { Locales } from "../../i18n";

/**
 * The software settings returned by the Tauri app.
 */
export type Settings = {
    /** The lock view timeout in minutes for the application. 0 means disabled. */
    lock_timeout: number;
    /** An amount of attempts the user inputted password can be invalid before the application closes. 0 is disabled. */
    failed_unlock_attempts: number;
    /** The current application locale used by the i18next library. */
    locale: Locales;
    /** A value indicating whether the plugin-window-state should be used to remember the previous window state. */
    save_window_state: boolean;
    /** A value indicating whether to use dark mode with the application. */
    dark_mode: boolean;
    /** A value indicating whether a load error occurred. */
    error: boolean;
    /** An error message if one occurred. */
    error_message: string;
};

/**
 * Loads the application settings from the settings file.
 * Also the local storage is updated with the setting data so it can be used without a reload.
 * @returns {Promise<Settings>} A promise to the application settings.
 */
const loadSettings = async () => {
    const settingDeserialized = globalThis.localStorage.getItem("settings") as string | null;
    const localSettings = settingDeserialized === null ? null : (JSON.parse(settingDeserialized) as Settings);
    if (localSettings !== null && !localSettings.error) {
        return localSettings;
    }
    const settings = (await invoke("load_settings")) as Settings;
    if (settings.error) {
        globalThis.localStorage.removeItem("settings");
    } else {
        globalThis.localStorage.setItem("settings", JSON.stringify(settings));
    }
    return settings;
};

/**
 * Saves the application setting into a file.
 * Also the local storage is updated with the setting data so it can be used without a reload.
 * @param {Settings} settings The application settings to save into a file.
 * @returns {Promise<void>} A promise to save the application settings.
 */
const saveSettings = async (settings: Settings) => {
    await invoke("save_settings", { config: settings });
    globalThis.localStorage.setItem("settings", JSON.stringify(settings));
};

/**
 * Custom hook that retrieves and manages application settings.
 *
 * @param {function} onErrorCallback - Callback function to notify of any errors.
 * @param {function} onSettingsSavedCallback - Callback function to notify when the settings are saved.
 * @return {array} An array containing the current settings, a boolean indicating if the settings are loaded, a function to update the settings, and a function to reload the settings.
 */
const useSettings = (
    onSettingsSavedCallback?: (setting: Settings) => void,
    onErrorCallback?: (error: Error | string | unknown) => void
): [Settings | null, boolean, (settings: Settings) => Promise<void>, () => Promise<void>] => {
    const [currentSettings, setCurrentSettings] = React.useState<Settings | null>(null);

    const reloadSettings = React.useCallback(async () => {
        try {
            const settings = await loadSettings();
            if (settings.error) {
                onErrorCallback?.(new Error(settings.error_message));
                setCurrentSettings(null);
                return;
            }
            setCurrentSettings(settings);
        } catch (error) {
            onErrorCallback?.(error);
        }
    }, [onErrorCallback]);

    const settingsLoaded = React.useMemo(() => {
        return currentSettings !== null;
    }, [currentSettings]);

    const updateSettings = React.useCallback(
        async (settings: Settings) => {
            try {
                await saveSettings(settings);
                setCurrentSettings(settings);
                onSettingsSavedCallback?.(settings);
            } catch (error) {
                onErrorCallback?.(error);
            }
        },
        [onErrorCallback, onSettingsSavedCallback]
    );

    React.useEffect(() => {
        void reloadSettings();
    }, [reloadSettings]);

    return [currentSettings, settingsLoaded, updateSettings, reloadSettings];
};

export { useSettings };
