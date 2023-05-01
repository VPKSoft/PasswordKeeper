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

import themes from "devextreme/ui/themes";

export type DxThemeNames =
    | "generic.carmine.compact"
    | "generic.carmine"
    | "generic.contrast.compact"
    | "generic.contrast"
    | "generic.dark.compact"
    | "generic.dark"
    | "generic.darkmoon.compact"
    | "generic.darkmoon"
    | "generic.darkviolet.compact"
    | "generic.darkviolet"
    | "generic.greenmist.compact"
    | "generic.greenmist"
    | "generic.light.compact"
    | "generic.light"
    | "material.blue.dark.compact"
    | "material.blue.dark"
    | "material.blue.light.compact"
    | "material.blue.light"
    | "material.lime.dark.compact"
    | "material.lime.dark"
    | "material.lime.light.compact"
    | "material.lime.light"
    | "material.orange.dark.compact"
    | "material.orange.dark"
    | "material.orange.light.compact"
    | "material.orange.light"
    | "material.purple.dark.compact"
    | "material.purple.dark"
    | "material.purple.light.compact"
    | "material.purple.light"
    | "material.teal.dark.compact"
    | "material.teal.dark"
    | "material.teal.light.compact"
    | "material.teal.light"
    | "generic.softblue.compact"
    | "generic.softblue";

export const setTheme = (theme: DxThemeNames) => {
    const settingTheme = window.localStorage.getItem("dx-theme");
    const currentTheme = themes.current();
    if (theme !== currentTheme) {
        themes.current(theme);
    }

    if (settingTheme !== theme) {
        window.localStorage.setItem("dx-theme", theme);
    }
};
