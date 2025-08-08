export default (state, i18nInstance) => (path, value) => {
  if (path === 'feeds') {
    const feedsList = document.querySelector('.feeds-list')
    feedsList.innerHTML = ''

    state.feeds.forEach((feed) => {
      const feedItem = document.createElement('li')
      feedItem.classList.add('list-group-item')

      const title = document.createElement('h3')
      title.textContent = feed.title

      const description = document.createElement('p')
      description.textContent = feed.description

      feedItem.append(title, description)
      feedsList.append(feedItem)
    })
  }

  if (path === 'posts' || path === 'readPosts') {
    const postsList = document.querySelector('.posts-list')
    postsList.innerHTML = ''

    state.posts.forEach((post) => {
      const postItem = document.createElement('li')
      postItem.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start'
      )

      const postTitle = document.createElement('a')
      postTitle.href = post.link
      postTitle.target = '_blank'
      postTitle.rel = 'noopener noreferrer'
      postTitle.textContent = post.title
      postTitle.classList.add(state.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold')

      const button = document.createElement('button')
      button.type = 'button'
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.textContent = i18nInstance.t('view')
      button.dataset.id = post.id
      button.setAttribute('aria-label', i18nInstance.t('view'))

      postItem.append(postTitle, button)
      postsList.append(postItem)
    })
  }

  if (path === 'form.status') {
    const submitButton = document.querySelector('button[type="submit"]')
    if (value === 'sending') {
      submitButton.disabled = true
    } else {
      submitButton.disabled = false
    }
  }

  if (path === 'form.error') {
    const feedback = document.querySelector('.feedback')
    if (!feedback) return
    if (value) {
      feedback.textContent = i18nInstance.t(`errors.${value}`)
      feedback.classList.add('text-danger')
    } else {
      feedback.textContent = ''
      feedback.classList.remove('text-danger')
    }
  }
}
