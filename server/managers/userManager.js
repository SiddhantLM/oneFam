// import { Socket } from "socket.io";
const RoomManager = require("./roomManager");

// export interface User {
//   userId: string;
//   socket: Socket;
// }

// const User {
//   userId,
//   socket
// }

class UserManager {
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  addUser(userId, socket) {
    this.users.push({ userId, socket });
    this.queue.push(socket.id);

    socket.emit("lobby");
    // this.clearQueue();
    this.initHandlers(socket);
  }

  clearQueue() {
    console.log("clear queues", this.queue.length);
    if (this.queue.length < 2) {
      return;
    }

    const id1 = this.queue.pop();
    const id2 = this.queue.pop();

    console.log("id1 = ", id1, " id2 = ", id2);

    const user1 = this.users.find((user) => user.socket.id === id1);
    const user2 = this.users.find((user) => user.socket.id === id2);

    if (!user1 || !user2) {
      return;
    }

    const room = this.roomManager.createRoom(user1, user2);
    this.clearQueue();
  }

  initHandlers(socket) {
    // socket.on("offer", ({ sdp, roomId }) => {
    //   this.roomManager.onOffer(roomId, sdp, socket.id);
    // });

    socket.on("ready", (id) => {
      this.clearQueue();
    });

    socket.on("send-offer", (roomId, peerId) => {
      console.log("received peer id", peerId);
      console.log("received room id", roomId);

      this.roomManager.onSendOffer(roomId, peerId, socket.id);
    });

    socket.on("answer", ({ sdp, roomId }) => {
      this.roomManager.onAnswer(roomId, sdp, socket.id);
    });

    socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
      this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
    });
  }
}

module.exports = UserManager;
