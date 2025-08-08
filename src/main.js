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
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const url = formData.get('url').trim()

    if (state.feeds.some((feed) => feed.url === url)) {
      watchedState.form.error = 'urlExists'
      watchedState.form.status = 'error'
      return
    }

    watchedState.form.status = 'sending'
    watchedState.form.error = null

    const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
      url,
    )}`

    axios
      .get(allOriginsUrl)
      .then((response) => {
        const { feed, posts } = parse(response.data.contents)
        feed.url = url
        watchedState.feeds.unshift(feed)
        watchedState.posts.unshift(...posts)
        watchedState.form.status = 'success'
      })
      .catch(() => {
        watchedState.form.status = 'error'
        watchedState.form.error = 'network'
      })
  })

  // Обработчик клика на кнопку просмотра
  const postsList = document.querySelector('.posts-list')
  postsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const postId = e.target.dataset.id
      const post = state.posts.find((p) => p.id === postId)
      if (!post) return

      // Помечаем пост как прочитанный
      watchedState.readPosts.add(postId)

      // Обновляем список постов
      watchedState.posts = [...watchedState.posts]

      // Показываем модальное окно
      const modalLabel = document.getElementById('modalLabel')
      const modalBody = document.querySelector('.modal-body')
      const modalLink = document.getElementById('modalLink')

      modalLabel.textContent = post.title
      modalBody.textContent = post.description
      modalLink.href = post.link

      // Bootstrap 5 modal
      const modalElement = document.getElementById('modal')
      const modal = new bootstrap.Modal(modalElement)
      modal.show()
    }
  })
}
