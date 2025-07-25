import * as yup from 'yup'
import i18next from 'i18next'

const setYupLocale = () => {
  yup.setLocale({
    string: {
      url: () => i18next.t('form.errors.invalidUrl'),
    },
    mixed: {
      notOneOf: () => i18next.t('form.errors.duplicate'),
      required: () => i18next.t('form.errors.required'),
    },
  })
}

export default setYupLocale
