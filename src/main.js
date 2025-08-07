import 'bootstrap/dist/css/bootstrap.min.css'

const form = document.querySelector('.rss-form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  // Временно просто alert
  alert('Форма отправлена!')
})
