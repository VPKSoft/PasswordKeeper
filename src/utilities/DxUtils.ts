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

import { Settings } from "../types/Settings";

// A dirty and easy solution for the title colors "fitting" the selected theme.
const titleColor = (type: "background" | "foreground", fallback: string) => {
    if (window) {
        const value = window.localStorage.getItem("settings");
        if (value === null) {
            return fallback;
        }
        const settings = JSON.parse(value) as Settings;

        switch (settings.dx_theme) {
            case "generic.carmine":
            case "generic.carmine.compact": {
                return type === "foreground" ? "#f05b41" : "#dee1e3";
            }
            case "generic.contrast":
            case "generic.contrast.compact": {
                return type === "foreground" ? "#cf00d7" : "#fff";
            }
            case "generic.dark":
            case "generic.dark.compact": {
                return type === "foreground" ? "#1ca8dd" : "#4d4d4d";
            }
            case "generic.darkmoon":
            case "generic.darkmoon.compact": {
                return type === "foreground" ? "#1ca8dd" : "#4d4d4d";
            }
            case "generic.darkviolet":
            case "generic.darkviolet.compact": {
                return type === "foreground" ? "#9c63ff" : "#343840";
            }
            case "generic.greenmist":
            case "generic.greenmist.compact": {
                return type === "foreground" ? "#3cbab2" : "#dedede";
            }
            case "generic.light":
            case "generic.light.compact": {
                return type === "foreground" ? "#337ab7" : "#ddd";
            }
            case "material.blue.dark":
            case "material.blue.dark.compact": {
                return type === "foreground" ? "#03a9f4" : "#515159";
            }
            case "material.blue.light":
            case "material.blue.light.compact": {
                return type === "foreground" ? "#03a9f4" : "#e0e0e0";
            }
            case "material.lime.dark":
            case "material.lime.dark.compact": {
                return type === "foreground" ? "#cddc39" : "#515159";
            }
            case "material.orange.dark":
            case "material.orange.dark.compact": {
                return type === "foreground" ? "#ff5722" : "#515159";
            }
            case "material.orange.light":
            case "material.orange.light.compact": {
                return type === "foreground" ? "#ff5722" : "#e0e0e0";
            }
            case "material.purple.dark":
            case "material.purple.dark.compact": {
                return type === "foreground" ? "#9c27b0" : "#515159";
            }
            case "material.purple.light":
            case "material.purple.light.compact": {
                return type === "foreground" ? "#9c27b0" : "#e0e0e0";
            }
            case "material.teal.dark":
            case "material.teal.dark.compact": {
                return type === "foreground" ? "#009688" : "#515159";
            }
            case "generic.softblue":
            case "generic.softblue.compact": {
                return type === "foreground" ? "#7ab8eb" : "#e8eaeb";
            }
            case "material.lime.light":
            case "material.lime.light.compact": {
                return type === "foreground" ? "#cddc39" : "#e0e0e0";
            }
            case "material.teal.light":
            case "material.teal.light.compact": {
                return type === "foreground" ? "#009688" : "#e0e0e0";
            }
        }
    }

    return fallback;
};

export { titleColor };
