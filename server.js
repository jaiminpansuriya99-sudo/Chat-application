require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const readline = require("readline");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static("public"));

let chatHistory = [];

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Send old messages
  socket.emit("chat history", chatHistory);

  socket.on("chat message", (msgObj) => {
    // Show client message in the console
    console.log(`💬 [Client ${socket.id}]: ${msgObj.text}`);

    const cleanMsg = {
      id: msgObj.id || Date.now(),
      sender: msgObj.sender || "client",
      text: String(msgObj.text),
      status: "sent",
      clientId: msgObj.clientId
    };

    chatHistory.push(cleanMsg);
    io.emit("new message", cleanMsg); // send to all
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Setup terminal readline to read inputs and reply directly to clients
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", (line) => {
  const text = line.trim();
  if (!text) return;

  const serverMsg = {
    id: Date.now(),
    sender: "server",
    text: text,
    status: "sent"
  };

  chatHistory.push(serverMsg);
  io.emit("new message", serverMsg);
  console.log(`✉️ [Server Reply Sent]: ${text}`);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💡 Type anything here in this CMD window and press Enter to reply to all clients!`);
  console.log(`-------------------------------------------------------------------------------`);
});
