import loadRss from './utils/loadRss.js'
import parseRss from './utils/parseRss.js'
import onChange from 'on-change'
import { v4 as uuidv4 } from 'uuid'

const initApp = (i18nInstance) => {
  const state = {
    feeds: [],
    posts: [],
    form: {
      valid: true,
      error: null,
    },
    loading: {
      state: 'idle', // 'loading', 'failed', 'success'
      error: null,
    },
  }

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input[name="url"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    submit: document.querySelector('button[type="submit"]'),
  }

  const watchedState = onChange(state, (path, value) => {
    // тут позже добавим отрисовку фидов и постов
  })

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = elements.input.value.trim()
    watchedState.loading.state = 'loading'

    loadRss(url)
      .then((rssContent) => {
        const { feed, posts } = parseRss(rssContent)

        const feedId = uuidv4()
        const newFeed = { ...feed, id: feedId, url }
        const newPosts = posts.map((post) => ({
          ...post,
          id: uuidv4(),
          feedId,
        }))

        watchedState.feeds.push(newFeed)
        watchedState.posts.push(...newPosts)
        watchedState.loading.state = 'success'

        // очищаем форму
        elements.form.reset()
        elements.input.focus()
      })
      .catch((err) => {
        watchedState.loading.state = 'failed'
        watchedState.loading.error = err.isParsing ? 'invalidRSS' : 'networkError'
      })
  })
}

export default initApp
