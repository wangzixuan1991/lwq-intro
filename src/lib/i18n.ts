import zh from '../i18n/zh.json';
import en from '../i18n/en.json';

export type Locale = 'zh' | 'en';
export const strings = { zh, en } as const;
export const t = (locale: Locale) => strings[locale];

export interface Bilingual {
  zh: string;
  en: string;
}

export const pickLang = (item: Bilingual | undefined, locale: Locale): string => {
  if (!item) return '';
  return item[locale] || item.zh || item.en || '';
};

export const localePath = (locale: Locale, path: string): string => {
  if (locale === 'en') {
    return path === '/' ? '/en/' : `/en${path}`;
  }
  return path;
};
