import i18n from 'i18next'

import translationEn from './en.json'
import translationAr from './ar.json'

const resources = {
  en: {
    translation: translationEn
  },
  ar: {
    translation: translationAr
  }
}

i18n
  .init({
    resources,
    lng: 'ar',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
