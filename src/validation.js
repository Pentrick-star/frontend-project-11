export default () => {
  return (data) => {
    const { url } = data

    if (!url || url.trim() === '') {
      return { isValid: false, error: 'empty' }
    }

    try {
      new URL(url)
      return { isValid: true }
    }
    catch {
      return { isValid: false, error: 'invalidUrl' }
    }
  }
}
