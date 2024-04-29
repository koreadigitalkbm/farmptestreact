import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import langEn from './lang.en.json';
import langKo from './lang.ko.json';

const resources = {
    'en-US': {
        translations: langEn
    },
    'ko-KR': {
        translations: langKo
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources: resources,
        lng: 'ko-KR',
        debug: false,
        defaultNS: 'translations',
        ns: 'translations',
        keySepartor: false,
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    })

export default i18n;