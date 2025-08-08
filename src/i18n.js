import i18next from 'i18next'

const resources = {
  ru: {
    translation: {
      feedback: {
        success: 'RSS успешно загружен',
        errors: {
          invalidUrl: 'Ссылка должна быть валидным URL',
          alreadyExists: 'RSS уже существует',
          required: 'Поле не должно быть пустым',
          unknown: 'Неизвестная ошибка',
        },
      },
    },
  },
}

export default () => i18next.createInstance().init({
  lng: 'ru',
  debug: false,
  resources,
})
