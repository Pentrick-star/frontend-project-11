 import * as yup from 'yup'
import i18next from 'i18next'

export default () => {
  const form = document.querySelector('.rss-form')
  const input = form.elements.url
  const feedback = document.querySelector('.feedback')

  const urls = new Set()

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = input.value.trim()

    const schema = yup.string().url().required().notOneOf([...urls])
    schema.validate(url)
      .then(() => {
        urls.add(url)
        input.classList.remove('is-invalid')
        feedback.textContent = ''
        input.value = ''
        input.focus()
        feedback.classList.remove('text-danger')
        feedback.classList.add('text-success')
        feedback.textContent = i18next.t('form.success')
      })
      .catch((err) => {
        input.classList.add('is-invalid')
        feedback.classList.remove('text-success')
        feedback.classList.add('text-danger')
        feedback.textContent = err.message
      })
  })
}
