import onChange from 'on-change'
import validate from './validation.js'
import view from './view.js'

export default () => {
  const form = document.querySelector('form')
  const input = form.querySelector('input')
  const feedback = document.querySelector('.feedback')

  const state = {
    urls: [],
    form: {
      valid: true,
      error: null,
    },
  }

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.valid' && value) {
      view.renderValid(input, feedback)
    } else if (path === 'form.error') {
      view.renderInvalid(input, feedback, value)
    }
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = input.value.trim()
    const validateUrl = validate(watchedState.urls)

    validateUrl(url)
      .then(() => {
        watchedState.urls.push(url)
        watchedState.form.valid = true
        view.resetForm(form)
      })
      .catch((err) => {
        watchedState.form.valid = false
        watchedState.form.error = err.message
      })
  })
}
