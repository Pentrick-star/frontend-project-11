export default (xmlString) => {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlString, 'application/xml')

  const parserError = xml.querySelector('parsererror')
  if (parserError) {
    throw new Error('invalidRss')
  }

  const channel = xml.querySelector('channel')
  if (!channel) {
    throw new Error('invalidRss')
  }

  const feed = {
    title: channel.querySelector('title')?.textContent ?? '',
    description: channel.querySelector('description')?.textContent ?? '',
  }

  const items = xml.querySelectorAll('item')

  const posts = Array.from(items).map((item) => ({
    id: item.querySelector('guid')?.textContent || item.querySelector('link')?.textContent,
    title: item.querySelector('title')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
    link: item.querySelector('link')?.textContent ?? '',
  }))

  return { feed, posts }
}
