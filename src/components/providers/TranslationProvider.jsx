import { createContext, useState } from "react";
import englishFlag from "../../assets/united-kingdom.png";
import VNFlag from "../../assets/vietnam-flag.png";
import { useTranslation } from "react-i18next";

const TranslationContext = createContext();

const languages = [
    { id: "en", name: "English", image: englishFlag },
    { id: "vi", name: "Tiếng Việt", image: VNFlag },
];

function TranslationProvider({ children }) {
    const [language, setLanguage] = useState(languages[0]);
    const { t: translation, i18n } = useTranslation();

    const toggleLanguageOption = (option) => {
        setLanguage(option);
        i18n.changeLanguage(option.id);
    };

    return (
        <TranslationContext.Provider value={{ languageSets: languages, language, toggleLanguageOption, translation }}>
            {children}
        </TranslationContext.Provider>
    );
}

export { TranslationProvider, TranslationContext };
