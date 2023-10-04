import i18next, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import { getEnv, noop } from '@utils';



const { CUSTOM_NODE_ENV } = getEnv();
const isDev = CUSTOM_NODE_ENV === 'development';

let translationCheck = {
    i18nextPlugin: { type: '3rdParty' } as const,
    showTranslations: noop,
};

export const i18n = i18next;
export const openTranslationWindow = () => translationCheck.showTranslations(i18n);

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

export const SUPPORTED_LANGUAGES = {
    RU: 'ru',
    EN: 'en',
} satisfies Record<string, string>;

const localResources : Resource = {
    ru: {
        local: {
            'Welcome to React': 'на русском',
        },
    },

    en: {
        translation: {
            'Welcome to React': 'Welcome to React and react-i18next',
        },
    },
};

export const i18nInit = async() => {
    if (isDev) {
        translationCheck = await import('translation-check');
    }

    await (i18n
        .use(initReactI18next)
        .use(LanguageDetector)
        .use(translationCheck.i18nextPlugin)
        .use(HttpBackend)
        .init<HttpBackendOptions>({
            // resources,
            partialBundledLanguages: true,
            debug: isDev,
            interpolation: {
                escapeValue: false,
            },
            // defaultNS: 'local',
            load: 'languageOnly',
            // ns: ['local'],
            ns: [],
            resources: {},
            defaultNS: undefined,
            backend: {
                loadPath: './locales/{{lng}}/{{ns}}.json',

            },
            // fallbackLng: 'en',
        })
    );
    // i18n.loadNamespaces('local');
    // i18next.addResourceBundle('ru', 'local', localResources.ru, true);
};