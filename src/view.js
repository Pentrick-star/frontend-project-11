export default (state, elements, i18n) => {
  const { feedback, input, submit, feedsList, postsList } = elements

  // Сброс классов ошибок и текста
  input.classList.remove('is-invalid')
  feedback.classList.remove('invalid-feedback', 'text-success')
  feedback.textContent = ''

  // Обработка статуса формы
  if (state.form.status === 'filling') {
    submit.disabled = false
  }

  if (state.form.status === 'sending') {
    submit.disabled = true
  }

  if (state.form.status === 'error') {
    submit.disabled = false
    input.classList.add('is-invalid')
    feedback.textContent = i18n.t(state.form.error)
    feedback.classList.add('invalid-feedback')
  }

  if (state.form.status === 'success') {
    submit.disabled = false
    input.value = ''
    feedback.textContent = i18n.t('rssLoaded')
    feedback.classList.add('text-success')
  }

  // Отрисовка фидов
  feedsList.innerHTML = ''
  state.feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item')

    const title = document.createElement('h3')
    title.textContent = feed.title

    const description = document.createElement('p')
    description.textContent = feed.description

    li.append(title, description)
    feedsList.append(li)
  })

  // Отрисовка постов
  postsList.innerHTML = ''
  state.posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start')

    const a = document.createElement('a')
    a.href = post.link
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.textContent = post.title
    a.classList.add(state.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold')

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
