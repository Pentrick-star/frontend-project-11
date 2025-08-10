export default (state, elements, i18n) => {
  const { feedback, input, submit, feedsList, postsList } = elements

  // Проверяем что все элементы существуют
  if (!feedback || !input || !submit || !feedsList || !postsList) {
    console.error('Some elements not found in view:', { feedback, input, submit, feedsList, postsList })
    return
  }

  // Сброс классов и текста
  input.classList.remove('is-invalid')
  feedback.classList.remove('invalid-feedback', 'text-success')
  feedback.textContent = ''

  // Блокировка кнопки при отправке
  submit.disabled = state.form.status === 'sending'

  // Ошибки
  if (state.form.status === 'error') {
    input.classList.add('is-invalid')
    const errorText = state.form.error ? i18n.t(state.form.error) : 'Unknown error'
    feedback.textContent = errorText
    feedback.classList.add('invalid-feedback')
  }

  // Успех
  if (state.form.status === 'success') {
    const successText = i18n.t('rssLoaded')
    feedback.textContent = successText
    feedback.classList.add('text-success')
    input.value = ''
    input.focus()
  }

  // Рендер списка фидов
  if (feedsList) {
    feedsList.innerHTML = ''
    if (state.feeds && state.feeds.length > 0) {
      state.feeds.forEach((feed) => {
        const li = document.createElement('li')
        li.classList.add('list-group-item')

        const title = document.createElement('h3')
        title.textContent = feed.title || 'Untitled'

        const description = document.createElement('p')
        description.textContent = feed.description || 'No description'

        li.append(title, description)
        feedsList.append(li)
      })
    }
  }

  // Рендер списка постов
  if (postsList) {
    postsList.innerHTML = ''
    if (state.posts && state.posts.length > 0) {
      state.posts.forEach((post) => {
        const li = document.createElement('li')
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start')

        const a = document.createElement('a')
        a.href = post.link || '#'
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.textContent = post.title || 'Untitled'
        a.classList.add(state.readPosts && state.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold')

        const button = document.createElement('button')
        button.type = 'button'
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
        button.textContent = i18n.t('view')
        button.dataset.id = post.id
        button.setAttribute('aria-label', i18n.t('view'))

        li.append(a, button)
        postsList.append(li)
      })
    }
  }
}
