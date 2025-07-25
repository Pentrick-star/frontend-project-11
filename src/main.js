import initI18n from './i18n.js'
import setYupLocale from './yupLocale.js'
import initApp from './app.js'

initI18n().then(() => {
  setYupLocale()
  initApp()
})
