import * as yup from 'yup'

export default (url, urls) => {
  const schema = yup.string().url().notOneOf(urls).required()
  return schema.validate(url)
}
