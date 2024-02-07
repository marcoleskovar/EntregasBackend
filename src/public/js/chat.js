const socket = io()
const input = document.getElementById('messageInput')
const container = document.getElementById('chatBox')
const username = document.getElementById('username').textContent
    
input.onkeyup = async (event) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim().length > 0){
        sendMessage(event.currentTarget.value)
        input.value = ''
    }
}

const sendMessage = async (msg) => {
    try{
        const message = {
            user: username,
            message: msg
        }
        await fetch ('/chat', {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        socket.emit('message', message)
    }
    catch(e){
        console.log(e);
    }
}

socket.on('chat', async data => {
    const div = document.createElement('div')
    const user = document.createElement('span')
    const message = document.createElement('span')

    user.textContent = data.user + ": "
    message.textContent = data.message

    div.appendChild(user)
    div.appendChild(message)
    container.appendChild(div)
    container.appendChild(document.createElement('hr'))
})