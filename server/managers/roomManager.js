// import { User, UserManager } from "./userManager";

let GLOBAL_ROOM_ID = 1;

// export interface Room {
//   // roomId: string,
//   user1: User;
//   user2: User;
// }

class RoomManager {
  // private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  createRoom(user1, user2) {
    const roomId = this.generate().toString();
    const room = {
      // roomId,
      user1,
      user2,
    };
    this.rooms.set(roomId, room);

    user1.socket.emit("room", roomId);

    // user2.socket.emit("send-offer", {
    //   roomId,
    // });

    return room;
  }

  onSendOffer(roomId, peerId, socketId) {
    const room = this.rooms.get(roomId);
    // console.log(room);
    if (!room) {
      return;
    }
    const receivingUser =
      socketId === room.user1.socket.id ? room.user2 : room.user1;
    // console.log("user", receivingUser);
    receivingUser.socket.emit("offer", peerId);
  }

  onOffer(roomId, sdp, senderSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }

    const receivingUser =
      senderSocketId === room.user1.socket.id ? room.user2 : room.user1;
    receivingUser.socket.emit("offer", {
      sdp,
      roomId,
    });
  }

  onAnswer(roomId, sdp, senderSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    const receivingUser =
      senderSocketId === room.user1.socket.id ? room.user2 : room.user1;
    receivingUser.socket.emit("answer", {
      sdp,
      roomId,
    });
  }

  onIceCandidates(
    roomId,
    senderSocketid,
    candidate,
    type = "sender" | "receiver"
  ) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    receivingUser.socket.emit("add-ice-candidate", { candidate, type });
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
}

module.exports = RoomManager;
