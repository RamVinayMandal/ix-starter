import { createI18n } from 'vue-i18n';
import en from './locales/en/translation.json';
import de from './locales/de/translation.json';

const messages = {
  en,
  de
};

export function setupI18n() {
  const i18n = createI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
  });

  return i18n;
}