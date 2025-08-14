import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      signupDescription: "To continue to the app please create an account",
      continue: "Continue",
      almostDone: "Almost done",
      companyDetails: "Enter your company's basic details",
      save: "Save",
    },
  },
  tn: {
    translation: {
      signupDescription: "பயன்பாட்டிற்குத் தொடர, ஒரு கணக்கை உருவாக்கவும்.",
      continue: "தொடரவும்",
      almostDone: "கிட்டத்தட்ட முடிந்தது",
      companyDetails: "உங்கள் நிறுவனத்தின் அடிப்படை விவரங்களை உள்ளிடவும்",
      save: "சேமிக்க",
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
