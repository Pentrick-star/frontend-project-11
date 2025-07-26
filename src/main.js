import initI18n from './i18n.js'
import initApp from './initApp.js'
import updatePosts from './updatePosts.js'

initI18n().then(() => {
  const { state, watchedState } = initApp()
  updatePosts(state, watchedState)
})
