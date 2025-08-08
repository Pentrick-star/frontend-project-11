import axios from 'axios'
import onChange from 'on-change'
import i18next from 'i18next'
import initView from './view.js'
import resources from './locales/index.js'
import parse from './utils/parse.js'
import _ from 'lodash'

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

        // Собираем ссылки уже известных постов
        const existingLinks = watchedState.posts.map((post) => post.link)
        // Фильтруем новые посты
        const newPosts = posts.filter((post) => !existingLinks.includes(post.link))

        if (newPosts.length > 0) {
          // Добавляем id и feedId к новым постам
          const newPostsWithIds = newPosts.map((post) => ({
            ...post,
            id: _.uniqueId('post_'),
            feedId: feed.id,
          }))

          watchedState.posts.unshift(...newPostsWithIds)
        }
      })
      .catch(() => {
        // Ошибки игнорируем, чтобы не прерывать цепочку обновления
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
        feed.id = _.uniqueId('feed_')
        const postsWithId = posts.map((post) => ({
          ...post,
          id: _.uniqueId('post_'),
          feedId: feed.id,
        }))

        watchedState.feeds.unshift(feed)
        watchedState.posts.unshift(...postsWithId)
        watchedState.form.status = 'success'

        // Запускаем обновление постов после успешного добавления первого фида
        updatePosts(watchedState, i18n)
      })
      .catch(() => {
        watchedState.form.status = 'error'
        watchedState.form.error = 'network'
      })
  })
}
