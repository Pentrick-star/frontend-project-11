export default () => {
  return (data) => {
    const { url } = data

    // Check if URL is empty
    if (!url || url.trim() === '') {
      return { isValid: false, error: 'empty' }
    }

    // Check if URL is valid
    try {
      new URL(url)
      return { isValid: true }
    } catch {
      return { isValid: false, error: 'invalidUrl' }
    }
  }
}
