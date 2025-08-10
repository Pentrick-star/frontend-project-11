import axios from 'axios'
import onChange from 'on-change'
import initI18n from './i18n.js'
import view from './view.js'
import parse from './utils/parse.js'
import validationSchema from './validation.js'
import _ from 'lodash'

const runApp = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input[name="url"]'),
    submit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsList: document.querySelector('.feeds-list'),
    postsList: document.querySelector('.posts-list'),
  }

  const state = {
    feeds: [],
    posts: [],
    readPosts: new Set(),
    form: {
      status: 'filling',
      error: null,
    },
  }

  initI18n().then((i18n) => {
    const watchedState = onChange(state, () => {
      view(state, elements, i18n)
    })

    const schema = validationSchema(i18n)

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()
      const url = elements.input.value.trim()

      schema.validate({ url }, { abortEarly: false })
        .then(() => {
          if (watchedState.feeds.some((feed) => feed.url === url)) {
            watchedState.form.status = 'error'
            watchedState.form.error = 'rssExists'
            return
          }

          watchedState.form.status = 'sending'
          watchedState.form.error = null

          const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

          axios.get(allOriginsUrl)
            .then((response) => {
              let feedData
              let postsData
              try {
                const parsed = parse(response.data.contents)
                feedData = parsed.feed
                postsData = parsed.posts
              } catch {
                watchedState.form.status = 'error'
                watchedState.form.error = 'noValidRss'
                return
              }

              feedData.id = _.uniqueId('feed_')

              const postsWithId = postsData.map((post) => ({
                ...post,
                id: _.uniqueId('post_'),
                feedId: feedData.id,
              }))

              watchedState.feeds.unshift(feedData)
              watchedState.posts.unshift(...postsWithId)

              watchedState.form.status = 'success'
            })
            .catch(() => {
              watchedState.form.status = 'error'
              watchedState.form.error = 'networkError'
            })
        })
        .catch(() => {
          watchedState.form.status = 'error'
          watchedState.form.error = 'invalidUrl'
        })
    })

    elements.postsList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const postId = e.target.dataset.id
        const post = state.posts.find((p) => p.id === postId)
        if (!post) return

        watchedState.readPosts.add(postId)
        watchedState.posts = [...watchedState.posts]

        // Показ модального окна Bootstrap 5
        const modalLabel = document.getElementById('modalLabel')
        const modalBody = document.querySelector('.modal-body')
        const modalLink = document.getElementById('modalLink')

        modalLabel.textContent = post.title
        modalBody.textContent = post.description
        modalLink.href = post.link

        const modalElement = document.getElementById('modal')
        const modal = new bootstrap.Modal(modalElement)
        modal.show()
      }
    })
  })
}

runApp()
