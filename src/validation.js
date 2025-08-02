import * as yup from 'yup'

export default (url, urls) => {
  const schema = yup
    .string()
    .required()
    .url()
    .notOneOf(urls)

  return schema.validate(url)
}
