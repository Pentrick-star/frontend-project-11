import * as yup from 'yup'

export default (url, urls) => {
  const schema = yup.string().url().required().notOneOf(urls)
  return schema.validate(url)
}
