export default (state, elements, i18n) => {
  const { inputEl, feedbackEl } = elements

  const renderForm = (formState) => {
    switch (formState.status) {
      case 'valid':
        inputEl.classList.remove('is-invalid')
        feedbackEl.classList.remove('text-danger')
        feedbackEl.classList.add('text-success')
        feedbackEl.textContent = i18n.t('feedback.success')
        inputEl.value = ''
        inputEl.focus()
        break

      case 'invalid':
        inputEl.classList.add('is-invalid')
        feedbackEl.classList.remove('text-success')
        feedbackEl.classList.add('text-danger')
        feedbackEl.textContent = i18n.t(formState.error) || i18n.t('feedback.errors.unknown')
        break

      default:
        break
    }
  }

  return (path, value) => {
    if (path === 'form') {
      renderForm(value)
    }
  }
}
