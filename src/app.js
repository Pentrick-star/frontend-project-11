import axios from 'axios'
import onChange from 'on-change'
import i18next from 'i18next'
import initView from './view.js'
import resources from './locales/index.js'
import parse from './utils/parse.js'

export default () => {
  const state = {
    feeds: [],
    posts: [],
    form: {
      status: 'filling',
      error: null,
    },
  }

  const i18n = i18next.createInstance()
  i18n.init({
    lng: 'ru',
    resources,
  })

  const watchedState = onChange(state, initView(state, i18n))

  const form = document.querySelector('.rss-form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const url = formData.get('url')

    watchedState.form.status = 'sending'
    watchedState.form.error = null

    const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`
    axios.get(allOriginsUrl)
      .then((response) => {
        const { feed, posts } = parse(response.data.contents)
        watchedState.feeds.unshift(feed)
        watchedState.posts.unshift(...posts)
        watchedState.form.status = 'success'
      })
      .catch(() => {
        watchedState.form.status = 'error'
        watchedState.form.error = 'network'
      })
  })
}
