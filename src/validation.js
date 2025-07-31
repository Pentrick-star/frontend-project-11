import * as yup from 'yup'
import i18next from 'i18next'

export default (url, urls) => {
  const schema = yup.string()
    .url(i18next.t('form.errors.invalidUrl'))
    .notOneOf([...urls], i18next.t('form.errors.duplicate'))

  return schema.validate(url)
}
