import i18next from 'i18next'

const resources = {
  ru: {
    translation: {
      form: {
        errors: {
          invalidUrl: 'Ссылка должна быть валидным URL',
          duplicate: 'RSS уже существует',
          required: 'Не должно быть пустым',
        },
        success: 'RSS успешно загружен',
      },
      buttons: {
        add: 'Добавить',
      },
      placeholders: {
        url: 'Ссылка RSS',
      },
    },
  },
}

const initI18n = () => i18next.init({
  lng: 'ru',
  debug: false,
  resources,
})

export default initI18n
