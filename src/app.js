import axios from 'axios'
import onChange from 'on-change'
import i18next from 'i18next'
import initView from './view.js'
import resources from './locales/index.js'
import parse from './utils/parse.js'
import _ from 'lodash'
import 'bootstrap/js/dist/modal'
import validateUrl from './validation.js'

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

        const existingLinks = watchedState.posts.map(post => post.link)
        const newPosts = posts.filter(post => !existingLinks.includes(post.link))

        if (newPosts.length > 0) {
          const newPostsWithIds = newPosts.map(post => ({
            ...post,
            id: _.uniqueId('post_'),
            feedId: feed.id,
          }))
          watchedState.posts.unshift(...newPostsWithIds)
        }
      })
      .catch(() => {
      })
  })

  Promise.all(feedPromises).finally(() => {
    setTimeout(() => updatePosts(watchedState, i18n), 5000)
  })
}

export default () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initApp()
    })
  }
  else {
    initApp()
  }

  function initApp() {
    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      submit: document.querySelector('button[type="submit"]'),
      feedback: document.querySelector('.feedback'),
      successMessage: document.querySelector('.success-message'),
      feedsList: document.querySelector('.feeds'),
      postsList: document.querySelector('.posts'),
    }

    if (!elements.form || !elements.input || !elements.submit || !elements.feedback || !elements.feedsList || !elements.postsList) {
      console.error('Some elements not found:', elements)
      return
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

    const i18n = i18next.createInstance()
    i18n.init({
      lng: 'ru',
      resources,
    })

    const watchedState = onChange(state, () => {
      try {
        initView(state, elements, i18n)
      }
      catch (error) {
        console.error('View update error:', error)
      }
    })

    initView(state, elements, i18n)

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const url = formData.get('url').trim()

      const validation = validateUrl()({ url })
      if (!validation.isValid) {
        watchedState.form.status = 'error'
        watchedState.form.error = validation.error
        return
      }

      watchedState.form.status = 'sending'
      watchedState.form.error = null

      if (watchedState.feeds.some(feed => feed.url === url)) {
        watchedState.form.status = 'error'
        watchedState.form.error = 'rssExists'
        return
      }

      axios.get(getProxiedUrl(url))
        .then((response) => {
          let feedData
          let postsData
          try {
            const parsed = parse(response.data.contents)
            feedData = parsed.feed
            postsData = parsed.posts
          }
          catch (error) {
            console.error('Parse error:', error)
            watchedState.form.status = 'error'
            watchedState.form.error = 'invalidRss'
            return
          }

          feedData.url = url
          feedData.id = _.uniqueId('feed_')

          const postsWithId = postsData.map(post => ({
            ...post,
            id: _.uniqueId('post_'),
            feedId: feedData.id,
          }))

          watchedState.feeds.unshift(feedData)
          watchedState.posts.unshift(...postsWithId)
          watchedState.form.status = 'success'

          updatePosts(watchedState, i18n)
        })
        .catch((error) => {
          console.error('Network error:', error)
          watchedState.form.status = 'error'
          watchedState.form.error = 'networkError'
        })
    })

    elements.postsList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const postId = e.target.dataset.id
        if (!postId) return

        const post = state.posts.find(p => p.id === postId)
        if (!post) return

        watchedState.readPosts.add(postId)
        watchedState.posts = [...watchedState.posts]

        const modalLabel = document.getElementById('modalLabel')
        const modalBody = document.querySelector('.modal-body')
        const modalLink = document.getElementById('modalLink')

        if (modalLabel && modalBody && modalLink) {
          modalLabel.textContent = post.title
          modalBody.textContent = post.description
          modalLink.href = post.link

          const modalElement = document.getElementById('modal')
          if (modalElement) {
            const modal = new window.bootstrap.Modal(modalElement)
            modal.show()
          }
        }
      }
    })
  }
}
