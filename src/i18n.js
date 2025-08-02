import i18next from 'i18next'
import resources from '../locales/ru/translation.json'

export default () => i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: { translation: resources },
  },
})
