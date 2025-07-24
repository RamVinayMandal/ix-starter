import { createI18n } from "vue-i18n";
import en from "./locales/en/translation.json";
import de from "./locales/de/translation.json";

const messages = {
  en,
  de,
};

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
  globalInjection: true,
});

export { i18n };

export function setupI18n() {
  return i18n;
}
