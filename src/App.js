import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Room from "./pages/Room";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [stream, setStream] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lobby, setLobby] = useState(true);

  const getCam = () => {
    const media = window.navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((media) => {
        const audio = media.getAudioTracks()[0];
        const video = media.getVideoTracks()[0];
        setStream(media);
        setLocalAudioTrack(audio);
        setLocalVideoTrack(video);
        //   setCurr(media);
        setLoading(false);
      })
      .catch((error) => {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          console.error("User denied the camera/microphone access.");
          alert(
            "Permission denied! Please allow access to the camera and microphone."
          );
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          console.error("No camera/microphone devices found.");
          alert("No camera or microphone found on this device.");
        } else {
          console.error("Error accessing media devices:", error);
        }
      });
  };

  const joinRoom = () => {
    setLobby(false);
  };

  return (
    <div className="flex min-h-screen w-11/2 mx-auto items-center ">
      {/* <Routes>
        <Route
          path="/"
          element={
            <Landing stream={stream} getCam={getCam} loading={loading} />
          }
        />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes> */}

      {lobby ? (
        <Landing
          stream={stream}
          getCam={getCam}
          loading={loading}
          joinRoom={joinRoom}
        />
      ) : (
        <Room
          stream={stream}
          localAudioTrack={localAudioTrack}
          localVideoTrack={localVideoTrack}
          setLobby={setLobby}
        />
      )}
    </div>
  );
}

export default App;
