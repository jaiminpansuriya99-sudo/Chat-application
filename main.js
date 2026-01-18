const socket = io();
const username = prompt("Enter your name");

document.getElementById('user').innerText = username;
socket.emit('join', username);

const messages = document.getElementById('messages');
const typing = document.getElementById('typing');
const input = document.getElementById('msg');

function addMessage(msg, mine) {
    const div = document.createElement('div');
    div.className = `msg ${mine ? 'me' : 'other'}`;
    div.innerHTML = `
        ${msg.user}: ${msg.text}
        ${mine ? `<span class="tick" id="t${msg.id}">✔</span>` : ''}
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

document.getElementById('send').onclick = () => {
    if(input.value){
        socket.emit('message', input.value);
        input.value = '';
    }
};

input.oninput = () => socket.emit('typing');

socket.on('message', msg => {
    addMessage(msg, msg.user === username);
    if(msg.user !== username){
        socket.emit('seen', msg.id);
    }
});

socket.on('seen', id => {
    const tick = document.getElementById('t'+id);
    if(tick) tick.innerText = '✔✔';
});

socket.on('typing', user => {
    typing.innerText = `${user} is typing...`;
    setTimeout(()=> typing.innerText='',1000);
});

socket.on('history', history => {
    history.forEach(m => addMessage(m, m.user === username));
});

document.getElementById('dark').onclick = () => {
    document.body.classList.toggle('dark');
};
