import initI18n from './i18n.js'
import initApp from './initApp.js'
import updatePosts from './updatePosts.js'

initI18n().then((i18nInstance) => {
  const { state, watchedState } = initApp(i18nInstance)
  updatePosts(state, watchedState)
})
