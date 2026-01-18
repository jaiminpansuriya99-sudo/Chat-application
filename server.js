const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const readline = require('readline');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let chatHistory = [];

io.on('connection', socket => {
    console.log('✅ Client connected');

    
    socket.emit('chat history', chatHistory);

   
    socket.on('chat message', msgObj => {

        
        const cleanMsg = {
            id: msgObj.id,
            sender: 'client',
            text: String(msgObj.text),
            status: 'sent'
        };

        chatHistory.push(cleanMsg);

        // ✅ TERMINAL ME CLIENT MESSAGE SHOW
        console.log(`Client: ${cleanMsg.text}`);

        // send to other clients
        socket.broadcast.emit('new message', cleanMsg);
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});

/* 👇 SERVER SE MESSAGE (TERMINAL → CLIENT) */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', input => {
    if (!input.trim()) return;

    const serverMsg = {
        id: Date.now(),
        sender: 'server',
        text: input,
        status: 'sent'
    };

    chatHistory.push(serverMsg);

    console.log(`You: ${input}`);
    io.emit('new message', serverMsg);
});

server.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
