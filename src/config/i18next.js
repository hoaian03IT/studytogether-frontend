import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import global_en from "../translation/en/global.json";
import global_vi from "../translation/vi/global.json";
import { initReactI18next } from "react-i18next";

i18next
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        lng: "en",
        resources: {
            en: global_en,
            vi: global_vi,
        },
    });
