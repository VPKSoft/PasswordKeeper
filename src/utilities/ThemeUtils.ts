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

// Dynamic imports for the DevExtreme themes.
const carmine_compact = () => import("devextreme/dist/css/dx.carmine.compact.css");
const carmine = () => import("devextreme/dist/css/dx.carmine.css");
const contrast = () => import("devextreme/dist/css/dx.contrast.css");
const contrast_compact = () => import("devextreme/dist/css/dx.contrast.compact.css");
const dark = () => import("devextreme/dist/css/dx.dark.css");
const dark_compact = () => import("devextreme/dist/css/dx.dark.compact.css");
const darkmoon = () => import("devextreme/dist/css/dx.darkmoon.css");
const darkmoon_compact = () => import("devextreme/dist/css/dx.darkmoon.compact.css");
const darkviolet = () => import("devextreme/dist/css/dx.darkviolet.css");
const darkviolet_compact = () => import("devextreme/dist/css/dx.darkviolet.compact.css");
const greenmist = () => import("devextreme/dist/css/dx.greenmist.css");
const greenmist_compact = () => import("devextreme/dist/css/dx.greenmist.compact.css");
const light = () => import("devextreme/dist/css/dx.light.css");
const light_compact = () => import("devextreme/dist/css/dx.light.compact.css");
const material_blueDark = () => import("devextreme/dist/css/dx.material.blue.dark.css");
const material_blueDark_compact = () => import("devextreme/dist/css/dx.material.blue.dark.compact.css");
const material_blueLight = () => import("devextreme/dist/css/dx.material.blue.light.css");
const material_blueLight_compact = () => import("devextreme/dist/css/dx.material.blue.light.compact.css");
const material_limeDark = () => import("devextreme/dist/css/dx.material.lime.dark.css");
const material_limeDark_compact = () => import("devextreme/dist/css/dx.material.lime.dark.compact.css");
const material_limeLight = () => import("devextreme/dist/css/dx.material.lime.light.css");
const material_limeLight_compact = () => import("devextreme/dist/css/dx.material.lime.light.compact.css");
const material_orangeDark = () => import("devextreme/dist/css/dx.material.orange.dark.css");
const material_orangeDark_compact = () => import("devextreme/dist/css/dx.material.orange.dark.compact.css");
const material_orangeLight = () => import("devextreme/dist/css/dx.material.orange.light.css");
const material_orangeLight_compact = () => import("devextreme/dist/css/dx.material.orange.light.compact.css");
const material_purpleDark = () => import("devextreme/dist/css/dx.material.purple.dark.css");
const material_purpleDark_compact = () => import("devextreme/dist/css/dx.material.purple.dark.compact.css");
const material_purpleLight = () => import("devextreme/dist/css/dx.material.purple.light.css");
const material_purpleLight_compact = () => import("devextreme/dist/css/dx.material.purple.light.compact.css");
const material_tealDark = () => import("devextreme/dist/css/dx.material.teal.dark.css");
const material_tealDark_compact = () => import("devextreme/dist/css/dx.material.teal.dark.compact.css");
const material_tealLight = () => import("devextreme/dist/css/dx.material.teal.light.css");
const material_tealLight_compact = () => import("devextreme/dist/css/dx.material.teal.light.compact.css");
const material_softBlue = () => import("devextreme/dist/css/dx.softblue.css");
const material_softBlue_compact = () => import("devextreme/dist/css/dx.softblue.compact.css");

/**
 * The DevExtreme theme names as an array of strings.
 */
export const dxThemes = [
    "generic.carmine.compact",
    "generic.carmine",
    "generic.contrast.compact",
    "generic.contrast",
    "generic.dark.compact",
    "generic.dark",
    "generic.darkmoon.compact",
    "generic.darkmoon",
    "generic.darkviolet.compact",
    "generic.darkviolet",
    "generic.greenmist.compact",
    "generic.greenmist",
    "generic.light.compact",
    "generic.light",
    "material.blue.dark.compact",
    "material.blue.dark",
    "material.blue.light.compact",
    "material.blue.light",
    "material.lime.dark.compact",
    "material.lime.dark",
    "material.lime.light.compact",
    "material.lime.light",
    "material.orange.dark.compact",
    "material.orange.dark",
    "material.orange.light.compact",
    "material.orange.light",
    "material.purple.dark.compact",
    "material.purple.dark",
    "material.purple.light.compact",
    "material.purple.light",
    "material.teal.dark.compact",
    "material.teal.dark",
    "material.teal.light.compact",
    "material.teal.light",
    "generic.softblue.compact",
    "generic.softblue",
] as const;

/**
 * A type for DevExtreme themes.
 */
export type DxThemeNames = (typeof dxThemes)[number];

/**
 * Sets the current DevExtreme theme using a dynamic import of the CSS file.
 * To keep the application theming correct the the window should be reloaded after setting the theme.
 * @param theme The name of the theme to set.
 */
export const setTheme = async (theme: DxThemeNames) => {
    const settingTheme = window.localStorage.getItem("dx-theme");
    // the current import is deprecated:
    // eslint-disable-next-line import/no-named-as-default-member
    const currentTheme = themes.current();
    if (theme !== currentTheme) {
        switch (theme) {
            case "generic.carmine": {
                await carmine();
                break;
            }
            case "generic.carmine.compact": {
                await carmine_compact();
                break;
            }
            case "generic.contrast": {
                await contrast();
                break;
            }
            case "generic.contrast.compact": {
                await contrast_compact();
                break;
            }
            case "generic.dark": {
                await dark();
                break;
            }
            case "generic.dark.compact": {
                await dark_compact();
                break;
            }
            case "generic.darkmoon": {
                await darkmoon();
                break;
            }
            case "generic.darkmoon.compact": {
                await darkmoon_compact();
                break;
            }
            case "generic.darkviolet": {
                void darkviolet();
                break;
            }
            case "generic.darkviolet.compact": {
                await darkviolet_compact();
                break;
            }
            case "generic.greenmist": {
                await greenmist();
                break;
            }
            case "generic.greenmist.compact": {
                await greenmist_compact();
                break;
            }
            case "generic.light": {
                await light();
                break;
            }
            case "generic.light.compact": {
                await light_compact();
                break;
            }
            case "generic.softblue": {
                await material_softBlue();
                break;
            }
            case "generic.softblue.compact": {
                await material_softBlue_compact();
                break;
            }
            case "material.blue.dark": {
                await material_blueDark();
                break;
            }
            case "material.blue.dark.compact": {
                await material_blueDark_compact();
                break;
            }
            case "material.blue.light": {
                await material_blueLight();
                break;
            }
            case "material.blue.light.compact": {
                await material_blueLight_compact();
                break;
            }
            case "material.lime.dark": {
                await material_limeDark();
                break;
            }
            case "material.lime.dark.compact": {
                await material_limeDark_compact();
                break;
            }
            case "material.lime.light": {
                await material_limeLight();
                break;
            }
            case "material.lime.light.compact": {
                await material_limeLight_compact();
                break;
            }
            case "material.orange.dark": {
                await material_orangeDark();
                break;
            }
            case "material.orange.dark.compact": {
                await material_orangeDark_compact();
                break;
            }
            case "material.orange.light": {
                await material_orangeLight();
                break;
            }
            case "material.orange.light.compact": {
                await material_orangeLight_compact();
                break;
            }
            case "material.purple.dark": {
                await material_purpleDark();
                break;
            }
            case "material.purple.dark.compact": {
                await material_purpleDark_compact();
                break;
            }
            case "material.purple.light": {
                await material_purpleLight();
                break;
            }
            case "material.purple.light.compact": {
                await material_purpleLight_compact();
                break;
            }
            case "material.teal.dark": {
                await material_tealDark();
                break;
            }
            case "material.teal.dark.compact": {
                await material_tealDark_compact();
                break;
            }
            case "material.teal.light": {
                await material_tealLight();
                break;
            }
            case "material.teal.light.compact": {
                await material_tealLight_compact();
                break;
            }
            default: {
                await carmine_compact();
                break;
            }
        }
    }

    if (settingTheme !== theme) {
        window.localStorage.setItem("dx-theme", theme);
    }
};
