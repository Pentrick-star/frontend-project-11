import axios from 'axios'
import _ from 'lodash'
import parse from './utils/parser.js'
import { renderPosts } from './view.js'

const getProxiedUrl = (url) => {
  const proxy = 'https://allorigins.hexlet.app/get'
  return `${proxy}?disableCache=true&url=${encodeURIComponent(url)}`
}

const updatePosts = (state, elements, i18n) => {
  const feedPromises = state.feeds.map((feed) => {
    const url = getProxiedUrl(feed.url)
    return axios.get(url)
      .then((response) => {
        const { posts } = parse(response.data.contents)

        const existingLinks = state.posts.map((post) => post.link)
        const newPosts = posts.filter((post) => !existingLinks.includes(post.link))

        if (newPosts.length > 0) {
          const newPostsWithIds = newPosts.map((post) => ({
            ...post,
            id: _.uniqueId('post_'),
            feedId: feed.id,
          }))
          state.posts = [...newPostsWithIds, ...state.posts]
          renderPosts(state, elements, i18n)
        }
      })
      .catch(() => {
        // Ошибки при обновлении игнорируем
      })
  })

  Promise.all(feedPromises)
    .finally(() => {
      setTimeout(() => updatePosts(state, elements, i18n), 5000)
    })
}

export default updatePosts
