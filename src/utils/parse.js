export default (xmlString) => {
  // Проверяем доступность DOMParser
  if (typeof DOMParser === 'undefined') {
    throw new Error('DOMParser not available')
  }

  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlString, 'application/xml')

  // Проверяем ошибки парсинга
  const parserError = xml.querySelector('parsererror')
  if (parserError) {
    throw new Error('invalidRss')
  }

  const channel = xml.querySelector('channel')
  if (!channel) {
    throw new Error('invalidRss')
  }

  const feed = {
    title: channel.querySelector('title')?.textContent?.trim() ?? '',
    description: channel.querySelector('description')?.textContent?.trim() ?? '',
  }

  const items = xml.querySelectorAll('item')

  const posts = Array.from(items).map((item) => ({
    id: item.querySelector('guid')?.textContent?.trim() || item.querySelector('link')?.textContent?.trim() || '',
    title: item.querySelector('title')?.textContent?.trim() ?? '',
    description: item.querySelector('description')?.textContent?.trim() ?? '',
    link: item.querySelector('link')?.textContent?.trim() ?? '',
  }))

  // Проверяем что feed и posts не пустые
  if (!feed.title || !feed.description) {
    throw new Error('invalidRss')
  }

  if (posts.length === 0) {
    throw new Error('invalidRss')
  }

  return { feed, posts }
}
