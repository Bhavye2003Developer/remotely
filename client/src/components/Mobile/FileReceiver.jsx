import { useEffect, useRef, useState } from "react";
import WebRTC_setter from "../../utils/webRTC_setter";

const FileReceiver = () => {
  const [isConnectedToLocal, setIsConnectedToLocal] = useState(false);
  const [fileMetaData, setFileMetaData] = useState(null);
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

    return () => {
      console.log("closing ws connection...");
      socket.close();
      webRTC_setter.closeChannels();
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
      <br />
      Go to 'http://localhost:5137/send-file' on your desktop
    </div>
  );
};

export default FileReceiver;
