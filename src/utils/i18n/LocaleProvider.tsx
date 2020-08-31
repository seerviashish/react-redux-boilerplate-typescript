import React, { Component, ReactNode } from "react";
import { I18nProvider } from "@lingui/react";
import { LOCALE_KEY, locales } from "./utils";

import enCatalog from "./locales/en/messages";
import hiCatalog from "./locales/hi/messages";
import guCatalog from "./locales/gu/messages";

import { Client } from "src/db/client/models/Client";
import {
  getByKey,
  save as saveClientDB,
} from "src/db/client/repositories/ClientRepository";
import { cdb } from "src/db/ClientDB";

const DEFAULT_LOCALE_EN: string = "en";
const LOCALE_HI: string = "hi";
const LOCALE_GU: string = "gu";

export type LocaleContextType = {
  resolved?: boolean;
  error?: any;
  locale?: string;
  changeLocale?: (name: string) => void;
  localeList?: Array<LocaleType>;
};

export type LocaleType = {
  id: number;
  name: string;
  locale: string;
  isSupported: boolean;
};

const defaultState = {
  resolved: false,
  locale: "en",
  error: null,
  catalog: undefined,
  localeList: locales,
};

const Context = React.createContext<LocaleContextType>(defaultState);

const { Consumer, Provider } = Context;

export { Consumer, Context };

type Props = {
  children: ReactNode;
  locale?: string;
};

type State = {
  resolved: boolean;
  locale: string;
  error?: any;
  catalogs?: any;
};

class LocaleProvider extends Component<Props, State> {
  readonly state: State = {
    resolved: false,
    locale: DEFAULT_LOCALE_EN,
    error: null,
    catalogs: undefined,
  };

  changeLocale = (name: string) => {
    this.loadCatalog(name).then((catalog) => {
      this.setState(
        (state) => ({
          catalogs: {
            ...state.catalogs,
            [name]: catalog,
          },
          locale: name,
        }),
        () => {
          this.storeAppLocale(name);
        }
      );
    });
  };

  getAppLocale = async (): Promise<string | undefined> => {
    const client: Client | undefined = await getByKey(LOCALE_KEY, cdb);
    const systemLanguage: string | undefined = this.systemLanguage();
    if (client) {
      return client.value;
    }
    if (systemLanguage) {
      return systemLanguage;
    }
    return undefined;
  };

  systemLanguage = (): string | undefined => {
    if (window && window.navigator && window.navigator.language) {
      const lang = window.navigator.language;
      const langSplit = lang.replace("-", "_").toLowerCase().split("_");

      const supportLang: any = locales
        .filter((lang: LocaleType) => lang.isSupported)
        .map((lang: LocaleType) => {
          return lang.locale;
        });
      if (
        langSplit &&
        langSplit.length > 0 &&
        supportLang &&
        supportLang.includes(langSplit[0])
      ) {
        return langSplit[0];
      }
    }
    return undefined;
  };

  loadCatalog = async (language: string): Promise<any> => {
    if (language === DEFAULT_LOCALE_EN) {
      return enCatalog;
    }
    if (language === LOCALE_HI) {
      return hiCatalog;
    }
    if (language === LOCALE_GU) {
      return guCatalog;
    }
  };

  private storeAppLocale = async (locale: string): Promise<any> => {
    return await saveClientDB(new Client(LOCALE_KEY, locale), cdb);
  };

  componentDidMount() {
    this.getAppLocale()
      .then(async (appLocale: string | undefined) => {
        const locale = appLocale ? appLocale : DEFAULT_LOCALE_EN;
        this.loadCatalog(locale).then((catalog) => {
          this.setState((state) => ({
            catalogs: {
              ...state.catalogs,
              [locale]: catalog,
            },
            locale,
            resolved: true,
          }));
        });
      })
      .catch((error) => {
        this.setState({ error, resolved: true });
      });
  }
  render() {
    const { catalogs, locale, resolved } = this.state;
    return (
      resolved && (
        <Provider
          value={{
            ...this.state,
            changeLocale: this.changeLocale,
            localeList: locales,
          }}
        >
          <I18nProvider language={locale} catalogs={catalogs}>
            {this.props.children}
          </I18nProvider>
        </Provider>
      )
    );
  }
}

export default LocaleProvider;
