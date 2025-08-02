import onChange from 'on-change'
import i18next from 'i18next'

export default (state, elements) => {
  const { input, feedback } = elements

  const renderValid = () => {
    input.classList.remove('is-invalid')
    feedback.textContent = ''
    feedback.classList.remove('text-danger')
  }

  const renderInvalid = (messageKey) => {
    input.classList.add('is-invalid')
    feedback.textContent = i18next.t(messageKey)
    feedback.classList.add('text-danger')
  }

  const watcher = onChange(state, (path, value) => {
    if (path === 'form.valid') {
      if (value) renderValid()
    }

    if (path === 'form.error') {
      renderInvalid(value)
    }
  })

  return watcher
}
