import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

//Import all translation files
import localizationEnMainUI from "./localization/mainui/en.json";
import localizationFiMainUI from "./localization/mainui/fi.json";

import localizationEnEntries from "./localization/entries/en.json";
import localizationFiEntries from "./localization/entries/fi.json";

import localizationEnApp from "./localization/app/en.json";
import localizationFiApp from "./localization/app/fi.json";

const resources = {
    en: {
        ui: localizationEnMainUI,
        entries: localizationEnEntries,
        app: localizationEnApp,
    },
    fi: {
        ui: localizationFiMainUI,
        entries: localizationFiEntries,
        app: localizationFiApp,
    },
};

const LocaleValues = ["fi", "en"] as const;
type Locales = (typeof LocaleValues)[number];

const setLocale = (locale: Locales) => {
    i18next.use(initReactI18next).init({
        resources,
        lng: locale, //default language
    });
};

setLocale("en");

const ComponentValues = ["ui", "entries", "app"] as const;

type TranslationComponents = (typeof ComponentValues)[number];

/**
 * Custom hook for the i18next @see useTranslation hook.
 * @param component The translation component (namespace) name.
 * @returns A function to localize strings with parameter support.
 */
const useLocalize = (component: TranslationComponents) => {
    const { t } = useTranslation([component]);

    const localize = (entryName: string, defaultValue?: string, params?: unknown) => {
        return t(entryName, defaultValue ?? entryName, params as never);
    };

    return localize;
};

export { useLocalize, setLocale };
export { default } from "i18next";
