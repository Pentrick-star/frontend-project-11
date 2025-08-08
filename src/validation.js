import * as yup from 'yup'

export default (i18n) => {
  yup.setLocale({
    mixed: {
      required: () => i18n.t('empty'),
      notOneOf: () => i18n.t('rssExists'),
    },
    string: {
      url: () => i18n.t('invalidUrl'),
    },
  })

  return yup.object({
    url: yup.string().required().url(),
  })
}
