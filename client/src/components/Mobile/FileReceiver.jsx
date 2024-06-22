import { useEffect, useRef, useState } from "react";
import WebRTC_setter from "../../utils/webRTC_setter";

const FileReceiver = () => {
  const [isConnectedToLocal, setIsConnectedToLocal] = useState(false);
  const [webrtc_setter, setWebRTC_setter] = useState(null);
  const [fileMetaData, setFileMetaData] = useState(null);
  const [fileAccessLink, setFileAccessLink] = useState("");
  const fileDownloadRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.35:3000/reach-signal-server");
    socket.onopen = () => {
      console.log("connected to ws server");
    };

    const webRTC_setter = new WebRTC_setter(socket);

    //receiver
    webRTC_setter.receiveAndSend_receiver(setFileMetaData);
    webRTC_setter.receiveFile(
      (signal) => setIsConnectedToLocal(signal),
      fileDownloadRef.current
    );
    setWebRTC_setter(webRTC_setter);

    return () => {
      console.log("closing ws connection...");
      socket.close();
    };
  }, []);

  useEffect(() => {
    console.log(fileMetaData);
  }, [fileMetaData]);

  return (
    <div>
      <a ref={fileDownloadRef} />
      <br />
      {isConnectedToLocal ? "connected" : "disconnected!"}
    </div>
  );
};

export default FileReceiver;
