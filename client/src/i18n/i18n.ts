import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import { isDev, noop } from '@utils';
import ruJSON from '@locales/ru/bundled.json';
import enJSON from '@locales/en/bundled.json';
import { ValueOf } from 'ts-essentials';



let translationCheck = {
    i18nextPlugin: { type: '3rdParty' } as const,
    showTranslations: noop,
};

const openTranslationWindow = () => translationCheck.showTranslations(i18n);

const NAMESPACES = {
    BUNDLED: 'bundled',
    LOADABLE: 'loadable',
} as const;

const SUPPORTED_LANGUAGES = {
    RU: 'ru',
    EN: 'en',
} as const;

export const TRANSLATION = {
    SUPPORTED_LANGUAGES,
    NAMESPACES,
    i18n,
    openTranslationWindow,
} as const;

type BundledResources = Record<
    ValueOf<typeof TRANSLATION.SUPPORTED_LANGUAGES>,
    Record<
        (typeof TRANSLATION.NAMESPACES)[Uppercase<typeof TRANSLATION.NAMESPACES.BUNDLED>],
        object
    >
>;

const bundledResources: BundledResources = {
    [TRANSLATION.SUPPORTED_LANGUAGES.RU]: { [TRANSLATION.NAMESPACES.BUNDLED]: ruJSON },
    [TRANSLATION.SUPPORTED_LANGUAGES.EN]: { [TRANSLATION.NAMESPACES.BUNDLED]: enJSON },
};

export const i18nInit = async() => {
    if (isDev()) {
        translationCheck = await import('translation-check');
    }

    await (i18n
        .use(initReactI18next)
        .use(LanguageDetector)
        .use(translationCheck.i18nextPlugin)
        .use(HttpBackend)
        .init<HttpBackendOptions>({
            resources: bundledResources,
            partialBundledLanguages: true,
            debug: isDev(),
            interpolation: {
                escapeValue: false,
            },
            load: 'languageOnly',
            ns: [TRANSLATION.NAMESPACES.BUNDLED],
            fallbackLng: TRANSLATION.SUPPORTED_LANGUAGES.EN,
        })
    );
};