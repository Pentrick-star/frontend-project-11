import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

import initI18n from './i18n.js'
import applyYupLocale from './yupLocale.js'
import initView from './view.js'
import validate from './validation.js'

const state = {
  feeds: [],
  form: {
    valid: true,
    error: null, // хранится КОД ошибки из yup
  },
}

const elements = {
  form: document.getElementById('rss-form'),
  input: document.querySelector('#rss-form input'),
  feedback: document.querySelector('.form-text'),
  submit: document.querySelector('#rss-form button'),
  title: document.querySelector('h1'),
}

initI18n().then(() => {
  applyYupLocale()

  // Инициализируем тексты
  elements.title.textContent = i18next.t('app.title')
  elements.input.placeholder = i18next.t('app.form.inputPlaceholder')
  elements.submit.textContent = i18next.t('app.form.submit')

  const watchedState = initView(state, elements)

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = elements.input.value.trim()

    validate(url, state.feeds)
      .then(() => {
        watchedState.form.valid = true
        watchedState.form.error = null
        watchedState.feeds.push(url)

        elements.form.reset()
        elements.input.focus()
      })
      .catch((err) => {
        watchedState.form.valid = false
        watchedState.form.error = err.message
      })
  })
})
