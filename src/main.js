import i18next from 'i18next'
import onChange from 'on-change'
import _ from 'lodash'
import axios from 'axios'
import resources from './locales/index.js'
import parse from './utils/parse.js'
import initView from './view.js'
import updatePosts from './updatePosts.js'
import validate from './validation.js'

const getProxiedUrl = (url) => {
  const proxy = 'https://allorigins.hexlet.app/get'
  return `${proxy}?disableCache=true&url=${encodeURIComponent(url)}`
}

const app = async () => {
  const i18n = i18next.createInstance()
  await i18n.init({
    lng: 'ru',
    fallbackLng: 'en',
    debug: false,
    resources
  })

  const state = {
    feeds: [],
    posts: [],
    readPosts: new Set(),
    form: {
      status: 'filling',
      error: null
    }
  }

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input[name="url"]'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector('button[type="submit"]'),
    feedsList: document.querySelector('.feeds-list'),
    postsList: document.querySelector('.posts-list')
  }

  const watchedState = onChange(state, () => initView(state, elements, i18n))

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    watchedState.form.status = 'filling'
    watchedState.form.error = null

    const formData = new FormData(e.target)
    const url = formData.get('url').trim()

    const schema = validate(i18n)
    schema.validate({ url }, { abortEarly: false })
      .then(() => {
        if (watchedState.feeds.some((feed) => feed.url === url)) {
          watchedState.form.status = 'error'
          watchedState.form.error = 'errors.urlExists'
          throw new Error('URL exists')
        }
        watchedState.form.status = 'sending'
        return axios.get(getProxiedUrl(url))
      })
      .then((response) => {
        const { feed, posts } = parse(response.data.contents)
        feed.url = url
        feed.id = _.uniqueId('feed_')

        const postsWithId = posts.map((post) => ({
          ...post,
          id: _.uniqueId('post_'),
          feedId: feed.id
        }))

        watchedState.feeds.unshift(feed)
        watchedState.posts.unshift(...postsWithId)
        watchedState.form.status = 'success'

        updatePosts(watchedState, elements, i18n)
      })
      .catch((error) => {
        if (error.message === 'URL exists') {
          return
        }
        if (error.name === 'ValidationError') {
          watchedState.form.status = 'error'
          watchedState.form.error = error.errors[0]
          return
        }
        watchedState.form.status = 'error'
        watchedState.form.error = 'errors.network'
      })
  })

  elements.postsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id
      watchedState.readPosts.add(id)
      initView(state, elements, i18n)
      // Здесь можно открыть модальное окно с содержимым поста (если нужно)
    }
  })
}

app()
