import i18n from 'i18next'

import ru from '../locales/ru/translation.json'
import en from '../locales/en/translation.json'

export default () => {
  const instance = i18n.createInstance()
  return instance.init({
    lng: 'ru',
    fallbackLng: 'en',
    debug: false,
    resources: {
      ru: { translation: ru },
      en: { translation: en },
    },
  })
}
