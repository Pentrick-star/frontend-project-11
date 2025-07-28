import axios from 'axios'
import parse from './utils/parseRss.js'

const getFeedData = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`
  return axios.get(proxyUrl).then((response) => response.data.contents)
}

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`

const updatePosts = (state, watchedState) => {
  const promises = state.feeds.map((feed) => {
    return getFeedData(feed.url)
      .then((rawData) => {
        const { posts } = parse(rawData)
        const existingLinks = state.posts.map((post) => post.link)

        const newPosts = posts
          .filter((post) => !existingLinks.includes(post.link))
          .map((post) => ({
            ...post,
            id: generateId(),
            feedId: feed.id,
          }))

        if (newPosts.length > 0) {
          state.posts.unshift(...newPosts)
        }
      })
      .catch(() => {
        
      })
  })

  Promise.all(promises).finally(() => {
    setTimeout(() => updatePosts(state, watchedState), 5000)
  })
}

export default updatePosts
