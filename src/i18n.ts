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

import { use } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

// Import all translation files
import fiMessages from "devextreme/localization/messages/fi.json";
import enMessages from "devextreme/localization/messages/en.json";
import { loadMessages, locale as dxLocale } from "devextreme/localization";

import localizationEnMainUI from "./localization/en/mainui/localization.json";
import localizationFiMainUI from "./localization/fi/mainui/localization.json";

import localizationEnEntries from "./localization/en/entries/localization.json";
import localizationFiEntries from "./localization/fi/entries/localization.json";

import localizationEnApp from "./localization/en/app/localization.json";
import localizationFiApp from "./localization/fi/app/localization.json";

import localizationEnCommon from "./localization/en/common/localization.json";
import localizationFiCommon from "./localization/fi/common/localization.json";

import localizationEnMessages from "./localization/en/messages/localization.json";
import localizationFiMessages from "./localization/fi/messages/localization.json";

import localizationEnMenu from "./localization/en/menu/localization.json";
import localizationFiMenu from "./localization/fi/menu/localization.json";

import localizationEnSettings from "./localization/en/settings/localization.json";
import localizationFiSettings from "./localization/fi/settings/localization.json";

import localizationEnUpdates from "./localization/en/updates/localization.json";
import localizationFiUpdates from "./localization/fi/updates/localization.json";

// Create a structure for the localization data: LocaleCode.CategoryName.
const resources = {
    en: {
        ui: localizationEnMainUI,
        entries: localizationEnEntries,
        app: localizationEnApp,
        common: localizationEnCommon,
        messages: localizationEnMessages,
        menu: localizationEnMenu,
        settings: localizationEnSettings,
        updates: localizationEnUpdates,
    },
    fi: {
        ui: localizationFiMainUI,
        entries: localizationFiEntries,
        app: localizationFiApp,
        common: localizationFiCommon,
        messages: localizationFiMessages,
        menu: localizationFiMenu,
        settings: localizationFiSettings,
        updates: localizationFiUpdates,
    },
};

// Create a type of the supported locales.
const LocaleValues = ["fi", "en"] as const;
export type Locales = (typeof LocaleValues)[number];

// A type for a single locale with an English name.
export type LocaleCodeName = {
    code: Locales;
    name: string;
};

// Create an array of the supported locales with their English names.
const currentLocales: LocaleCodeName[] = [
    { code: "fi", name: "Finnish" },
    { code: "en", name: "English" },
];

/**
 * Initializes the i18next locale with the specified locale code.
 * @param locale The locale code to initialize the i18next with.
 */
const setLocale = (locale: Locales) => {
    void use(initReactI18next)
        .init({
            resources,
            lng: locale, //default language
        })
        .then(() => {
            switch (locale) {
                case "fi": {
                    loadMessages(fiMessages);
                    break;
                }
                case "en": {
                    loadMessages(enMessages);
                    break;
                }
                default: {
                    loadMessages(enMessages);
                    break;
                }
            }
            dxLocale(locale);
        });
};

// Use English as the default locale.
setLocale("en");

// Create a type of the supported locale categories.
const ComponentValues = ["ui", "entries", "app", "common", "messages", "menu", "settings", "updates"] as const;
type TranslationComponents = (typeof ComponentValues)[number];

/**
 * Custom hook for the i18next {@link useTranslation} hook.
 * @param component The translation component (namespace) name.
 * @returns A function to localize strings with parameter support.
 */
const useLocalize = (component: TranslationComponents) => {
    const { t } = useTranslation([component]);

    /**
     * A localization function returned by the {@link useLocalize} hook.
     * @param {string} entryName The name of the localization key.
     * @param {string?} defaultValue A default value if a localization key is not found.
     * @param params The interpolation parameters for the localization function. E.g. `{ interpolationName: interpolationValue }`.
     * @param escapeValue A value indicating whether the special characters should be escaped with interpolation. The default value is `true`.
     */
    const localize = (entryName: string, defaultValue?: string, params?: unknown, escapeValue?: boolean) => {
        const options = { interpolation: { escapeValue: escapeValue === undefined ? true : escapeValue } };
        const paramsNew = { ...(params as object), ...options };
        return t(entryName, defaultValue ?? entryName, paramsNew) as unknown as string;
    };

    return localize;
};

export { currentLocales, useLocalize, setLocale };
export { default } from "i18next";
