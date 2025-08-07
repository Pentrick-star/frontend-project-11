import 'bootstrap/dist/css/bootstrap.min.css'
import onChange from 'on-change'
import i18nInit from './i18n.js'
import setYupLocale from './yupLocale.js'
import validate from './validation.js'
import initView from './view.js'

const state = {
  form: {
    status: null,
    error: null,
  },
  feeds: [],
}

const elements = {
  formEl: document.querySelector('.rss-form'),
  inputEl: document.querySelector('input[name="url"]'),
  feedbackEl: document.createElement('p'),
}

elements.feedbackEl.classList.add('feedback', 'mt-2')
elements.inputEl.after(elements.feedbackEl)

const i18nPromise = i18nInit()
setYupLocale()

i18nPromise.then((i18n) => {
  const watchedState = onChange(state, initView(state, elements, i18n))

  elements.formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const url = formData.get('url').trim()
    const urls = state.feeds.map((feed) => feed.url)

    validate(url, urls)
      .then(() => {
        state.feeds.push({ url })
        watchedState.form = { status: 'valid', error: null }
      })
      .catch((err) => {
        watchedState.form = { status: 'invalid', error: err.message }
      })
  })
})
