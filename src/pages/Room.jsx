import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { io } from "socket.io-client";
import { Peer } from "peerjs";

const Room = ({ stream, localAudioTrack, localVideoTrack, setLobby }) => {
  // const [socket, setSocket] = useState(null);

  // const [remoteAudioTrack, setRemoteAudioTrack] = useState(null);
  // const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);

  // const remoteVideoRef = useRef(null);
  // const localVidoeRef = useRef(null);

  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  useEffect(() => {
    const socket = io(process.env.REACT_APP_URL);
    const peer = new Peer();
    peer.on("open", (id) => {
      console.log(`your peer id is ${id}`);
      socket?.emit("ready", id);
    });
    // setSocket(socket);

    // SEND YOUR OWN PEER-ID FOR THE OTHER PERSON TO CALL
    socket.on("room", (roomId) => {
      socket?.emit("send-offer", roomId, peer.id);
    });

    // CALL THE 2nd USER IN THE ROOM
    socket.on("offer", (remotePeerId) => {
      console.log("remotePeerId", remotePeerId);
      const call = peer.call(remotePeerId, stream);
      call.on("stream", (incomingStream) => {
        setRemoteMediaStream(incomingStream);
      });
    });

    // PICKUP THE INCOMING CALL
    peer.on("call", (call) => {
      // const { peer: callerId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream) => {
        setRemoteMediaStream(incomingStream);
      });
    });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <ReactPlayer url={stream} playing={true} muted={true} />

      {remoteMediaStream ? (
        <ReactPlayer url={remoteMediaStream} playing={true} muted={true} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Room;
