const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
// const { UserManager } = require("./managers/userManager");
const UserManager = require("./managers/userManager");
const userManager = new UserManager();
const app = express();
const server = http.createServer(app);

app.use(cors());
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle client connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  //add the client as soon as the connection is established.
  userManager.addUser("randomName", socket);

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
