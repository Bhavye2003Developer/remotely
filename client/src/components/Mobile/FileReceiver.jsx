import { useEffect, useState } from "react";
import WebRTC_setter from "../../utils/webRTC_setter";

const FileReceiver = () => {
  const [isConnectedToLocal, setIsConnectedToLocal] = useState(false);
  const [webrtc_setter, setWebRTC_setter] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.35:3000/reach-signal-server");
    socket.onopen = () => {
      console.log("connected to ws server");
    };

    const webRTC_setter = new WebRTC_setter(socket);

    //receiver
    webRTC_setter.receiveAndSend_receiver((signal) =>
      setIsConnectedToLocal(signal)
    );

    setWebRTC_setter(webRTC_setter);

    return () => {
      console.log("closing ws connection...");
      socket.close();
    };
  }, []);

  return (
    <div>
      <button className="border border-black p-2 rounded-lg m-5">
        Receive
      </button>

      {isConnectedToLocal ? "connected" : "disconnected!"}
    </div>
  );
};

export default FileReceiver;
