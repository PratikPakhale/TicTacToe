const next = document.querySelector('#next')
const username = document.querySelector('#username')

if(sessionStorage.getItem('turn') !== null){
  sessionStorage.clear()
}

next.addEventListener('click', () => {
  if(username.value !== ''){
    sessionStorage.setItem('username',username.value)
    window.location.href = "./server.html"
  }else{
    username.classList.toggle('alert')
    setTimeout(() => {
      username.classList.remove('alert')
    }, 3000)
  }
})