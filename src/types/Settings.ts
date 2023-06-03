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

export type Settings = {
    dx_theme: DxThemeNames;
    window_pos: Array<number>;
    locale: string;
    lock_timeout: number;
    failed_unlock_attempts: number;
};

const loadSettings = async () => {
    try {
        const settings = (await invoke("load_settings")) as Settings;
        window.localStorage.setItem("settings", JSON.stringify(settings));
        return settings;
    } catch {
        return null;
    }
};

const saveSettings = async (settings: Settings) => {
    try {
        invoke("save_settings", { config: settings });
        window.localStorage.setItem("settings", JSON.stringify(settings));
        return true;
    } catch {
        return false;
    }
};

export { loadSettings, saveSettings };
