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
import localizationEnMainUI from "./localization/mainui/en.json";
import localizationFiMainUI from "./localization/mainui/fi.json";

import localizationEnEntries from "./localization/entries/en.json";
import localizationFiEntries from "./localization/entries/fi.json";

import localizationEnApp from "./localization/app/en.json";
import localizationFiApp from "./localization/app/fi.json";

import localizationEnCommon from "./localization/common/en.json";
import localizationFiCommon from "./localization/common/fi.json";

import localizationEnMessages from "./localization/messages/en.json";
import localizationFiMessages from "./localization/messages/fi.json";

import localizationEnMenu from "./localization/menu/en.json";
import localizationFiMenu from "./localization/menu/fi.json";

import localizationEnSettings from "./localization/settings/en.json";
import localizationFiSettings from "./localization/settings/fi.json";

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
    },
    fi: {
        ui: localizationFiMainUI,
        entries: localizationFiEntries,
        app: localizationFiApp,
        common: localizationFiCommon,
        messages: localizationFiMessages,
        menu: localizationFiMenu,
        settings: localizationFiSettings,
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
    use(initReactI18next).init({
        resources,
        lng: locale, //default language
    });

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
};

// Use English as the default locale.
setLocale("en");

// Create a type of the supported locale categories.
const ComponentValues = ["ui", "entries", "app", "common", "messages", "menu", "settings"] as const;
type TranslationComponents = (typeof ComponentValues)[number];

/**
 * Custom hook for the i18next {@link useTranslation} hook.
 * @param component The translation component (namespace) name.
 * @returns A function to localize strings with parameter support.
 */
const useLocalize = (component: TranslationComponents) => {
    const { t } = useTranslation([component]);

    const localize = (entryName: string, defaultValue?: string, params?: unknown) => {
        return t(entryName, defaultValue ?? entryName, params as never) as unknown as string;
    };

    return localize;
};

export { currentLocales, useLocalize, setLocale };
export { default } from "i18next";
