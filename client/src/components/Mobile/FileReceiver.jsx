import { useEffect, useRef, useState } from "react";
import WebRTC_setter from "../../utils/webRTC_setter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutletContext } from "react-router-dom";

const FileReceiver = () => {
  const [isConnectedToLocal, setIsConnectedToLocal] = useState(false);
  const [fileMetaData, setFileMetaData] = useState(null);
  const fileDownloadRef = useRef(null);

  const setRelativePath = useOutletContext();
  useEffect(() => {
    setRelativePath(location.pathname);

    const socket = new WebSocket("ws://192.168.1.35:3000/reach-signal-server");
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      toast.success("Connected to WebSocket server");
    };
    socket.onclose = () => {
      console.log("WebSocket connection closed");
      toast.error("WebSocket connection closed");
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket error");
    };

    const webRTC_setter = new WebRTC_setter(socket);

    // Receiver setup
    webRTC_setter.receiveAndSend_receiver(setFileMetaData);
    webRTC_setter.receiveFile(
      (signal) => setIsConnectedToLocal(signal),
      fileDownloadRef.current
    );

    return () => {
      console.log("Closing WebSocket connection...");
      socket.close();
      webRTC_setter.closeChannels();
    };
  }, []);

  useEffect(() => {
    console.log(fileMetaData);
    if (fileMetaData) {
      toast.info(`Received file: ${fileMetaData.fileName}`);
    }
  }, [fileMetaData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">File Receiver</h2>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            isConnectedToLocal
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {isConnectedToLocal ? "Connected" : "Disconnected"}
        </span>
      </div>
      <p className="text-base mb-4">
        {isConnectedToLocal
          ? "Ready to receive files. If not receiving, ensure the sender is active."
          : "Please open 'http://localhost:5173/send-file' on your desktop to start sending files."}
      </p>
      <a ref={fileDownloadRef} className="hidden"></a>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default FileReceiver;
