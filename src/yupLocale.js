import { setLocale } from 'yup'

export default () => {
  setLocale({
    string: {
      url: 'feedback.errors.invalidUrl',
    },
    mixed: {
      required: 'feedback.errors.required',
      notOneOf: 'feedback.errors.alreadyExists',
    },
  })
}
