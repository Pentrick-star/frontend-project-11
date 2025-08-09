import axios from 'axios'
import onChange from 'on-change'
import i18next from 'i18next'
import initView from './view.js'
import resources from './locales/index.js'
import parse from './utils/parse.js'
import _ from 'lodash'

// Проверка валидности URL
const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

const getProxiedUrl = (url) => {
  const proxy = 'https://allorigins.hexlet.app/get'
  return `${proxy}?disableCache=true&url=${encodeURIComponent(url)}`
}

const updatePosts = (watchedState, i18n) => {
  const feedPromises = watchedState.feeds.map((feed) => {
    const url = getProxiedUrl(feed.url)
    return axios.get(url)
      .then((response) => {
        const { posts } = parse(response.data.contents)

        const existingLinks = watchedState.posts.map((post) => post.link)
        const newPosts = posts.filter((post) => !existingLinks.includes(post.link))

        if (newPosts.length > 0) {
          const newPostsWithIds = newPosts.map((post) => ({
            ...post,
            id: _.uniqueId('post_'),
            feedId: feed.id,
          }))
          watchedState.posts.unshift(...newPostsWithIds)
        }
      })
      .catch(() => {
        // Игнорируем ошибки обновления постов
      })
  })

  Promise.all(feedPromises)
    .finally(() => {
      setTimeout(() => updatePosts(watchedState, i18n), 5000)
    })
}

export default () => {
  const state = {
    feeds: [],
    posts: [],
    readPosts: new Set(),
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
  const input = form.querySelector('input[name="url"]')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = input.value.trim()

    // Валидация URL
    if (!isValidUrl(url)) {
      watchedState.form.status = 'error'
      watchedState.form.error = 'urlInvalid'
      return
    }

    // Проверка на дубликат URL
    const urlExists = watchedState.feeds.some((feed) => feed.url === url)
    if (urlExists) {
      watchedState.form.status = 'error'
      watchedState.form.error = 'urlExists'
      return
    }

    watchedState.form.status = 'sending'
    watchedState.form.error = null

    const proxiedUrl = getProxiedUrl(url)
    axios.get(proxiedUrl)
      .then((response) => {
        const { feed, posts } = parse(response.data.contents)

        feed.id = _.uniqueId('feed_')
        feed.url = url

        const postsWithId = posts.map((post) => ({
          ...post,
          id: _.uniqueId('post_'),
          feedId: feed.id,
        }))

        watchedState.feeds.unshift(feed)
        watchedState.posts.unshift(...postsWithId)
        watchedState.form.status = 'success'

        updatePosts(watchedState, i18n)
      })
      .catch(() => {
        watchedState.form.status = 'error'
        watchedState.form.error = 'network'
      })
  })
}
