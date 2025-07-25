import axios from 'axios'

const getProxyUrl = (url) => {
  const encodedUrl = encodeURIComponent(url)
  return `https://allorigins.hexlet.app/get?disableCache=true&url=${encodedUrl}`
}

export default (url) =>
  axios
    .get(getProxyUrl(url))
    .then((res) => res.data.contents)
