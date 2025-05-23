import { EnUsTranslation } from "./translations/en-us";
import { CzCsTranslation } from "./translations/cz-cs";

export type Translation = Record<string, string>;

const TRANSLATIONS = {
  "en-us": EnUsTranslation,
  "cz-cs": CzCsTranslation,
};

const getCurrentLang = (): string => {
  //return "cz-cs";

  const userLang =
    window.navigator.language || navigator["userLanguage"] || "en-us";
  if (userLang.includes("cs")) {
    return "cz-cs";
  }
  return "en-us";
};

const getTranslation = (key: string, placeholders = {}) => {
  const lang = getCurrentLang();
  const translations = TRANSLATIONS[lang];
  let translation = translations[key] || key;

  // Replace placeholders with actual values
  for (const [placeholder, value] of Object.entries(placeholders)) {
    translation = translation.replace(
      new RegExp(`{${placeholder}}`, "g"),
      value,
    );
  }

  return translation;
};

export { getTranslation as t };
