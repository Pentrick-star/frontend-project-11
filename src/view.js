export default (state, i18n) => () => {
  const feedsContainer = document.querySelector('.feeds')
  const postsContainer = document.querySelector('.posts')

  feedsContainer.innerHTML = ''
  postsContainer.innerHTML = ''

  if (state.feeds.length > 0) {
    const feedsCard = document.createElement('div')
    feedsCard.classList.add('card', 'border-0')

    const feedsCardBody = document.createElement('div')
    feedsCardBody.classList.add('card-body')

    const feedsTitle = document.createElement('h2')
    feedsTitle.classList.add('card-title', 'h4')
    feedsTitle.textContent = i18n.t('feeds')

    feedsCardBody.append(feedsTitle)
    feedsCard.append(feedsCardBody)

    const feedsList = document.createElement('ul')
    feedsList.classList.add('list-group', 'border-0', 'rounded-0')

    state.feeds.forEach((feed) => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'border-0', 'border-end-0')

      const h3 = document.createElement('h3')
      h3.classList.add('h6', 'm-0')
      h3.textContent = feed.title

      const p = document.createElement('p')
      p.classList.add('m-0', 'small', 'text-black-50')
      p.textContent = feed.description

      li.append(h3, p)
      feedsList.append(li)
    })

    feedsCard.append(feedsList)
    feedsContainer.append(feedsCard)
  }

  if (state.posts.length > 0) {
    const postsCard = document.createElement('div')
    postsCard.classList.add('card', 'border-0')

    const postsCardBody = document.createElement('div')
    postsCardBody.classList.add('card-body')

    const postsTitle = document.createElement('h2')
    postsTitle.classList.add('card-title', 'h4')
    postsTitle.textContent = i18n.t('posts')

    postsCardBody.append(postsTitle)
    postsCard.append(postsCardBody)

    const postsList = document.createElement('ul')
    postsList.classList.add('list-group', 'border-0', 'rounded-0')

    state.posts.forEach((post) => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

      const a = document.createElement('a')
      a.setAttribute('href', post.link)
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
      a.textContent = post.title

      const button = document.createElement('button')
      button.setAttribute('type', 'button')
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.textContent = i18n.t('view')

      li.append(a, button)
      postsList.append(li)
    })

    postsCard.append(postsList)
    postsContainer.append(postsCard)
  }
}
