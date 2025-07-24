import * as yup from 'yup'

export default (urls) => {
  const schema = yup.string()
    .required('URL обязателен')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(urls, 'RSS уже существует')

  return (url) => schema.validate(url, { abortEarly: false })
}
