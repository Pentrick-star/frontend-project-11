import onChange from 'on-change'

const renderValid = (input, feedback) => {
  input.classList.remove('is-invalid')
  feedback.textContent = ''
  feedback.classList.remove('text-danger', 'text-success')
}

const renderInvalid = (input, feedback, error) => {
  input.classList.add('is-invalid')
  feedback.textContent = error
  feedback.classList.add('text-danger')
}

const resetForm = (form) => {
  form.reset()
  form.querySelector('input').focus()
}

const renderFeeds = (feeds, container) => {
  container.innerHTML = ''
  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const title = document.createElement('h2')
  title.classList.add('card-title', 'h4')
  title.textContent = 'Фиды'

  cardBody.append(title)
  card.append(cardBody)

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')

  feeds.forEach((feed) => {
    const item = document.createElement('li')
    item.classList.add('list-group-item', 'border-0', 'border-end-0')

    const feedTitle = document.createElement('h3')
    feedTitle.classList.add('h6', 'm-0')
    feedTitle.textContent = feed.title

    const feedDesc = document.createElement('p')
    feedDesc.classList.add('m-0', 'small', 'text-black-50')
    feedDesc.textContent = feed.description

    item.append(feedTitle, feedDesc)
    list.append(item)
  })

  card.append(list)
  container.append(card)
}

const renderPosts = (posts, readPosts, container, state) => {
  container.innerHTML = ''
  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const title = document.createElement('h2')
  title.classList.add('card-title', 'h4')
  title.textContent = 'Посты'

  cardBody.append(title)
  card.append(cardBody)

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')

  posts.forEach((post) => {
    const item = document.createElement('li')
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

    const link = document.createElement('a')
    link.setAttribute('href', post.link)
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    link.dataset.id = post.id
    link.classList.add(readPosts.has(post.id) ? 'fw-normal' : 'fw-bold')
    link.textContent = post.title

    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    button.setAttribute('data-id', post.id)
    button.setAttribute('data-bs-toggle', 'modal')
    button.setAttribute('data-bs-target', '#modal')
    button.textContent = 'Просмотр'

    item.append(link, button)
    list.append(item)
  })

  card.append(list)
  container.append(card)
}

const renderModal = (post) => {
  const modalTitle = document.querySelector('.modal-title')
  const modalBody = document.querySelector('.modal-body')
  const modalLink = document.querySelector('.full-article')

  modalTitle.textContent = post.title
  modalBody.textContent = post.description
  modalLink.setAttribute('href', post.link)
}

const renderStatus = (loadingState, loadingError, elements) => {
  const feedback = elements.feedback
  feedback.textContent = ''
  feedback.classList.remove('text-danger', 'text-success')

  if (loadingState === 'loading') {
    feedback.textContent = 'Загрузка...'
  } else if (loadingState === 'failed') {
    const errorMessage = loadingError === 'invalidRSS' ? 'Ошибка: Неверный RSS' : 'Ошибка сети'
    feedback.textContent = errorMessage
    feedback.classList.add('text-danger')
  } else if (loadingState === 'success') {
    feedback.textContent = 'RSS успешно загружен'
    feedback.classList.add('text-success')
  }
}

const render = (elements, state) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.valid') {
      if (value) {
        renderValid(elements.input, elements.feedback)
      }
    }

    if (path === 'form.error') {
      renderInvalid(elements.input, elements.feedback, value)
    }

    if (path === 'form.processed') {
      resetForm(elements.form)
    }

    if (path === 'feeds') {
      renderFeeds(state.feeds, elements.feeds)
    }

    if (path === 'posts' || path === 'readPosts') {
      renderPosts(state.posts, state.readPosts, elements.posts, state)
    }

    if (path === 'modalPostId') {
      const post = state.posts.find((p) => p.id === value)
      renderModal(post)
      state.readPosts.add(post.id)
    }

    if (path === 'loading.state' || path === 'loading.error') {
      renderStatus(state.loading.state, state.loading.error, elements)
    }
  })

  return watchedState
}

export default render
