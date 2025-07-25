export default (rssContent) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(rssContent, 'application/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    const error = new Error('ParseError')
    error.isParsing = true
    throw error
  }

  const feed = {
    title: doc.querySelector('channel > title').textContent,
    description: doc.querySelector('channel > description').textContent,
  }

  const posts = [...doc.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }))

  return { feed, posts }
}
