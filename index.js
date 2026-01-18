require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",   // allow frontend domain
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
    const cleanMsg = {
      id: Date.now(),
      sender: msgObj.sender || "client",
      text: String(msgObj.text),
      status: "sent"
    };

    chatHistory.push(cleanMsg);

    io.emit("new message", cleanMsg); // send to all
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ MUST use Render PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
