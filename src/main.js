import 'bootstrap/dist/css/bootstrap.min.css'
import onChange from 'on-change'
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

const watchedState = onChange(state, initView(state, elements))

elements.formEl.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  const url = formData.get('url').trim()

  const urls = state.feeds.map((feed) => feed.url)

  validate(url, urls)
    .then(() => {
      // Условная заглушка добавления ленты
      state.feeds.push({ url })
      watchedState.form = { status: 'valid', error: null }
    })
    .catch((err) => {
      watchedState.form = { status: 'invalid', error: 'Ссылка невалидна или уже добавлена' }
    })
})
