
const http = new fetchAPI
//UI variables

const round = document.querySelector('#round')
const you = document.querySelector('.your-score')
const opponent = document.querySelector('.opp-score')
const yourName = document.querySelector('#yourName')
const opponentName = document.querySelector('#opponentName')
const turn = document.querySelector('#turn')

let fetchedData,updatedOX='0',count=0

if(sessionStorage.getItem('player') === null || sessionStorage.getItem('gameURL') === null){
  if(sessionStorage.getItem('username') === null){
    window.location.href = "./index.html"
  }else{
    window.location.href = "./server.html"
  }
}

if(sessionStorage.getItem('updateX') === null && sessionStorage.getItem('updateO') === null){
  sessionStorage.setItem('round','1')
  sessionStorage.setItem('you','0')
  sessionStorage.setItem('opponent','0')
  sessionStorage.setItem('updateX','')
  sessionStorage.setItem('updateO','')
}

loadOngoingGame()
function loadOngoingGame(){
  round.textContent = sessionStorage.getItem('round')
  you.textContent = sessionStorage.getItem('you')
  opponent.textContent = sessionStorage.getItem('opponent')
  yourName.value = sessionStorage.getItem('username')
  opponentName.value = sessionStorage.getItem('opponentName')
  turn.value = sessionStorage.getItem('turn')
  for(let i = 0; i < sessionStorage.getItem('updateX').length ; i++){
    if(document.getElementById(sessionStorage.getItem('updateX')[i]) !== null){
      document.getElementById(sessionStorage.getItem('updateX')[i]).value = "X"
    document.getElementById(sessionStorage.getItem('updateX')[i]).innerText = "X"
    document.getElementById(sessionStorage.getItem('updateX')[i]).disabled = true
    }
  }
  for(let i = 0; i < sessionStorage.getItem('updateO').length ; i++){
    if(document.getElementById(sessionStorage.getItem('updateO')[i]) !== null){
      document.getElementById(sessionStorage.getItem('updateO')[i]).value = "O"
      document.getElementById(sessionStorage.getItem('updateO')[i]).innerText = "O"
      document.getElementById(sessionStorage.getItem('updateO')[i]).disabled = true
    }
  }
}
if(turn.value === "Opponent"){
  console.log("initializing waiting")
  waitingForResponse()
}

async function btnClick(id){
  if(turn.value === "Your" && document.getElementById(id).value !== "X" && document.getElementById(id).value !== "O"){
    sessionStorage.setItem('updateX',sessionStorage.getItem('updateX')+id)
    sessionStorage.setItem('turn','Opponent')
    await http.get(sessionStorage.getItem('gameURL'))
      .then(data => fetchedData=data)
      .catch(err => console.error(err))

    fetchedData.updatedOX = id
    if(sessionStorage.getItem("player") === 'joiner'){
      fetchedData.turn = 'creator'
    }else{
      fetchedData.turn = 'joiner'
    }
    await http.put(sessionStorage.getItem('gameURL'),fetchedData)
      .catch(err => console.log(err))
    
    loadOngoingGame()
    checkGameOver()
    waitingForResponse()
  }
}

async function waitingForResponse(){
  await http.get(sessionStorage.getItem('gameURL'))
    .then(data => fetchedData = data)
    .catch(err => console.error(err))

  if(fetchedData.end === true){
    alert("Game Ended")
    sessionStorage.clear()
    location.reload()
  }
  if(fetchedData.turn === sessionStorage.getItem('player')){
    sessionStorage.setItem('updateO',sessionStorage.getItem('updateO')+fetchedData.updatedOX)
    sessionStorage.setItem('turn','Your')
    updatedOX = fetchedData.updatedOX
    loadOngoingGame()
    checkGameOver()
  }else{
    setTimeout(waitingForResponse, 100)
  }
  count++
}

function gv(id){
	return document.getElementById(id).value;
}

// check for the game to over
function checkGameOver(){
	if(gv('1') == gv('2') && gv('2') == gv('3') && gv('1') == gv('3') && gv('1') != ""){
		winner(gv('1'));
		console.log('wins for 1 2 3 for '+gv('1'));
	}else if(gv('4') == gv('5') && gv('5') == gv('6') && gv('4') == gv('6') && gv('4') != ""){
		winner(gv('4'));
		console.log('wins for 4 5 6 for '+gv('4'));
	}else if(gv('7') == gv('8') && gv('8') == gv('9') && gv('7') == gv('9') && gv('7') != ""){
		winner(gv('7'));
		console.log('wins for 7 8 9 for '+gv('7'));
	}else if(gv('1') == gv('4') && gv('4') == gv('7') && gv('1') == gv('7') && gv('1') != ""){
		winner(gv('1'));
		console.log('wins for 1 4 7 for '+gv('1'));
	}else if(gv('2') == gv('5') && gv('5') == gv('8') && gv('2') == gv('8') && gv('2') != ""){
		winner(gv('2'));
		console.log('wins for 2 5 8 for '+gv('2'));
	}else if(gv('3') == gv('6') && gv('6') == gv('9') && gv('3') == gv('9') && gv('3') != ""){
		winner(gv('3'));
		console.log('wins for 3 6 9 for '+gv('3'));
	}else if(gv('1') == gv('5') && gv('5') == gv('9') && gv('1') == gv('9') && gv('1') != ""){
		winner(gv('1'));
		console.log('wins for 1 5 9 for '+gv('1'));
	}else if(gv('3') == gv('5') && gv('5') == gv('7') && gv('3') == gv('7') && gv('3') != ""){
		winner(gv('3'));
		console.log('wins for 3 5 7 for '+gv('3'));
	}else{
		let i,counter = 0;
		for(i=1;i<10;i++){
			if(document.getElementById(i).value != 'O' && document.getElementById(i).value != 'X'){
				counter = 1;
			}
		}
		if(counter == 0){
			sessionStorage.setItem('updateX','')
			sessionStorage.setItem('updateO','')
      sessionStorage.setItem('round',parseInt(sessionStorage.getItem('round'))+1)
			location.reload();
		}else{
			return;
		}
		
	}
	return;
}

// who's the winner?
function winner(ox){
	if(ox != ""){
	if(ox == 'X'){
		sessionStorage.setItem('you',parseInt(sessionStorage.getItem('you'))+1)
    sessionStorage.setItem('round',parseInt(sessionStorage.getItem('round'))+1)
    sessionStorage.setItem('updateX','')
		sessionStorage.setItem('updateO','')
    location.reload();
	}else if(ox == 'O'){
		sessionStorage.setItem('opponent',parseInt(sessionStorage.getItem('opponent'))+1)
    sessionStorage.setItem('round',parseInt(sessionStorage.getItem('round'))+1)
    sessionStorage.setItem('updateX','')
		sessionStorage.setItem('updateO','')
    location.reload();
	}
	}else{
		return;
	}
	
}

document.querySelector('.end-game').addEventListener('click',end)
async function end(){
  await http.get(sessionStorage.getItem('gameURL'))
    .then(data => fetchedData=data)
    .catch(err => console.error(err))
  fetchedData.end = true
  await http.put(sessionStorage.getItem('gameURL'),fetchedData)
    .catch(err => console.error(err))
  sessionStorage.clear()
  location.reload()
}