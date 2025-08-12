import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      signupDescription: "To continue to the app please create an account",
      continue: "Continue",
    },
  },
  tn: {
    translation: {
      signupDescription: "பயன்பாட்டிற்குத் தொடர, ஒரு கணக்கை உருவாக்கவும்.",
      continue: "தொடரவும்",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
