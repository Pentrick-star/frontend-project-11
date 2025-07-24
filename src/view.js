const renderValid = (input, feedback) => {
  input.classList.remove('is-invalid')
  feedback.textContent = ''
}

const renderInvalid = (input, feedback, error) => {
  input.classList.add('is-invalid')
  feedback.textContent = error
}

const resetForm = (form) => {
  form.reset()
  form.querySelector('input').focus()
}

export default {
  renderValid,
  renderInvalid,
  resetForm,
}
