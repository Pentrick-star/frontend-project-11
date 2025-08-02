import { setLocale } from 'yup'

export default () => {
  setLocale({
    string: {
      url: 'app.messages.errors.invalidUrl',
    },
    mixed: {
      required: 'app.messages.errors.required',
      notOneOf: 'app.messages.errors.alreadyExists',
    },
  })
}
