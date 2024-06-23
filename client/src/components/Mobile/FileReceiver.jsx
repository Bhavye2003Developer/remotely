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

    // Receiver setup
    webRTC_setter.receiveAndSend_receiver(setFileMetaData);
    webRTC_setter.receiveFile(
      (signal) => setIsConnectedToLocal(signal),
      fileDownloadRef.current
    );

    return () => {
      console.log("closing ws connection...");
      socket.close();
      // webRTC_setter.closeChannels();
    };
  }, []);

  useEffect(() => {
    console.log(fileMetaData);
  }, [fileMetaData]);

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md">
      <p className="text-lg font-semibold mb-4">
        {isConnectedToLocal ? "Connected" : "Disconnected!"}
      </p>
      <p className="text-base">
        If not opened, Go to 'http://localhost:5173/send-file' on your desktop
      </p>
      <a ref={fileDownloadRef} />
    </div>
  );
};

export default FileReceiver;
