import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

const form = document.getElementById('rss-form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const input = form.querySelector('input')
  // Тут потом будет логика добавления RSS
  console.log('RSS URL:', input.value)
})
