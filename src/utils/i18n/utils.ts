import { LocaleType } from "./LocaleProvider";

export const LOCALE_KEY: string = "LOCALE";

const supportedLocale: Array<LocaleType> = [
  {
    id: 1,
    name: "English",
    locale: "en",
    isSupported: true,
  },
  {
    id: 2,
    name: "Hindi",
    locale: "hi",
    isSupported: true,
  },
  {
    id: 3,
    name: "Gujarati",
    locale: "gu",
    isSupported: true,
  },
];

export const locales = supportedLocale;

export const supportedLocales = locales.filter(
  (lang: LocaleType) => lang.isSupported
);
