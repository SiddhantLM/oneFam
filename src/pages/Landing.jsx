import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setAudioTracks,
//   setLoading,
//   setStream,
//   setVideoTracks,
// } from "../slice/streamSlice";
import ReactPlayer from "react-player";

const Landing = ({ stream, getCam, loading, joinRoom }) => {
  useEffect(() => {
    getCam();
  }, [getCam]);

  return (
    <div className="flex flex-col items-center">
      {stream === null && <div> Please allow camera and audio permission </div>}

      {stream !== null && (
        <div>
          <h1 className="text-center mb-4 font-bold text-4xl">
            check your hair section
          </h1>
          <ReactPlayer url={stream} playing={true} muted={true} />
        </div>
      )}

      {loading === false && (
        <div className="">
          <button
            type="button"
            className=" bg-slate-200 p-2 border border-black mt-10 hover:text-xl rounded-md font-semibold hover:bg-blue-500 hover:scale-105 transition duration-200 "
            onClick={joinRoom}
          >
            Join room
          </button>
        </div>
      )}
    </div>
  );
};

export default Landing;
