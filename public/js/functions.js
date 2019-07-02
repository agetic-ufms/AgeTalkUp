const signinForm = document.getElementById('signin')
const chatForm = document.getElementById('chat')
const socket = io();
let userName = null

const changeView = () => {
    if (userName) {
        chatForm.style.display = 'flex'
        signinForm.style.display = 'none'
    } else {
        chatForm.style.display = 'none'
        signinForm.style.display = 'block'
    }
}

const signin = (event) => {
    console.log(event.target)
    event.preventDefault()
    if (!event.target.user.value) {
        alert("Informe um nome de usuário!")
        return
    }
    userName = event.target.user.value
    socket.emit('join', userName)
    changeView()
}

const send = (event) => {
    event.preventDefault()
    if (!event.target.message.value) {
        alert("Escreva uma mensagem antes de clicar em enviar.")
        return
    }
    socket.emit('send', {
        user: userName,
        text: event.target.message.value
    });
    addMyMessage(event.target.message.value)
    event.target.message.value = ""
}

const join = (user) => {
    const template = `<div class="join">
        <span class="join-in"><strong>${user}</strong> 
        entrou no chat</span></div>`

    document.querySelector('#chat .messages').innerHTML += template
}

const disconnect = (user) => {
    const template = `<div class="disconnect">
        <span class="disconnect-in"><strong>${user}</strong> 
        saiu do chat</span></div>`

    document.querySelector('#chat .messages').innerHTML += template
}

const addMessage = (user, message) => {
    const tamplate = `<div class="message"><span class="message-in">
    <span class="tail-container"></span>
    <h4>${user}</h4><p>${message}</p></span></div>`

    document.querySelector('#chat .messages').innerHTML += tamplate
}

const addMyMessage = (message) => {
    const template = `<div class="my-message"><span class="message-in">
    <span class="tail-container"></span>
    <p>${message}</p></span></div>`

    document.querySelector('#chat .messages').innerHTML += template
}

window.addEventListener('load', changeView)
document.getElementById('signin').addEventListener('submit', signin)
document.getElementById('send').addEventListener('submit', send)
socket.on('join', user => join(user))
socket.on('disconnect', user => disconnect(user))
socket.on('send', (user, message) => addMessage(user, message))