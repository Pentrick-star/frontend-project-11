import { v4 as uuidv4 } from 'uuid'
import loadRss from './utils/loadRss.js'
import parseRss from './utils/parseRss.js'
import render from './view.js'

const initApp = (i18nInstance) => {
  const state = {
    feeds: [],
    posts: [],
    readPosts: new Set(),
    modalPostId: null,
    form: {
      valid: true,
      error: null,
    },
    loading: {
      state: 'idle',
      error: null,
    },
  }

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input[name="url"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    submit: document.querySelector('button[type="submit"]'),
  }

  const watchedState = render(elements, state)

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

        elements.form.reset()
        elements.input.focus()
      })
      .catch((err) => {
        watchedState.loading.state = 'failed'
        watchedState.loading.error = err.isParsing ? 'invalidRSS' : 'networkError'
      })
  })

  elements.posts.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const postId = e.target.dataset.id
      watchedState.modalPostId = postId
    }
  })

  return { state, watchedState }
}

export default initApp
