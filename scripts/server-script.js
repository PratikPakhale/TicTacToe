const createBtn = document.querySelector('#create')
const createBuffer = document.querySelector('.buffering-create')
const joinBtn = document.querySelector('#join')
const joinBuffer = document.querySelector('.buffering-join')
const serverID = document.querySelector('#serverID')
const http = new fetchAPI
const serverURL = "https://api.jsonstorage.net/v1/json/8ac63b60-b57d-4d33-977a-3a4a572d90c3"
const postURL = "https://api.jsonstorage.net/v1/json"
const postData = {
  'creator': null,
  'joiner': null,
  'turn': 'creator',
  'updatedOX': null,
  'end': false
}

let fetchedData, generatedURL

if(sessionStorage.getItem('username') === null){
  window.location.href = "./index.html"
}

serverID.focus()

createBtn.addEventListener('click', create)
joinBtn.addEventListener('click', join)

async function create(){
  if(serverID.value !== ''){
    disableBtns(createBtn, joinBtn, createBuffer)
    await http.post(postURL, postData)
      .then(data => generatedURL = data.uri)
      .catch(err => SYSerror(err));
    console.log(generatedURL)

    sessionStorage.setItem('gameURL',generatedURL)

    await http.get(serverURL)
      .then(data => fetchedData = data)
      .catch(err => SYSerror(err));
    fetchedData[serverID.value] = generatedURL
    
    await http.put(serverURL, fetchedData)
      .catch(err => SYSerror(err));

    fetchedData = postData
    fetchedData.creator = sessionStorage.getItem('username')

    await http.put(generatedURL, fetchedData)
      .catch(err => SYSerror(err));

    sessionStorage.setItem('player','creator')
    window.location.href = "./waiting.html"
  }else{
    errorserverID()
  }
}

async function join(){
  if(serverID.value !== ''){
    disableBtns(joinBtn, createBtn, joinBuffer)

    await http.get(serverURL)
      .then(data => fetchedData = data)
      .catch(err => SYSerror(err))

    if(fetchedData[serverID.value] !== undefined){

      sessionStorage.setItem('player','joiner')
      sessionStorage.setItem('gameURL',fetchedData[serverID.value])
      fetchedData.joiner = sessionStorage.getItem("username")

      await http.get(fetchedData[serverID.value])
        .then(data => fetchedData = data)
        .catch(err => SYSerror(err))
      console.log("fetched data of gameurl: ",fetchedData)
      if(fetchedData.joiner === null){
        if(fetchedData.creator === sessionStorage.getItem('username')){
          alert("Go back and change username")
        }else{
          fetchedData.joiner = sessionStorage.getItem('username')
          sessionStorage.setItem('opponentName',fetchedData.creator)
          sessionStorage.setItem('turn','Opponent')
          console.log(fetchedData)
          await http.put(sessionStorage.getItem('gameURL'), fetchedData)
            .catch(err => SYSerror(err));
          window.location.href = "./game.html"
        }
      }else{
        serverID.value = ""
        serverID.placeholder = " Unavailable"
        errorserverID()
        enableBtns()
      }
      
    }else{
      serverID.value = ""
      serverID.placeholder = " Not Found"
      errorserverID()
      enableBtns()
    }

  }else{
    errorserverID()
  }
}

function errorserverID(){
  serverID.classList.toggle('alert')
    setTimeout(() => {
      serverID.classList.remove('alert')
      serverID.placeholder = " Server ID"
      serverID.focus()
    }, 3000)
}

function disableBtns(btn1, btn2, buffer){
  btn1.style.display = "none"
  btn2.disabled = true
  buffer.style.display = "inline"
}

function enableBtns(){
  createBtn.style.display = "block"
  joinBtn.style.display = "block"
  createBuffer.style.display = "none"
  joinBuffer.style.display = "none"
  createBtn.disabled = false
  joinBtn.disabled = false
}

function SYSerror(error){
  console.error(error)
}