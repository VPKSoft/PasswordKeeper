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
