import { useEffect, useState } from "react";
import WebRTC_setter from "../../utils/webRTC_setter";

const FileTransfer = () => {
  const [fileToTransfer, setFileToTransfer] = useState(null);
  const [message, setMessage] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoteDataChannelConnected, setIsRemoteDataChannelConnected] =
    useState(false);

  const [webrtc_setter, setWebRTC_setter] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.35:3000/reach-signal-server");
    socket.onopen = () => {
      console.log("connected to ws server");
    };

    const webRTC_setter = new WebRTC_setter(socket);

    // sender
    webRTC_setter.sendAndReceive_sender(
      (signal) => {
        console.log("signal: ", signal);
        setIsRemoteDataChannelConnected(signal);
      },
      (signal) => setIsUploading(signal)
    );

    setWebRTC_setter(webRTC_setter);

    return () => {
      console.log("closing ws connection...");
      socket.close();
      webRTC_setter.closeChannels();
    };
  }, []);

  const handleUpload = () => {
    if (fileToTransfer && fileToTransfer.length > 0) {
      console.log("files to send: ", fileToTransfer[0]);
      webrtc_setter.sendFile(fileToTransfer[0], (signal) =>
        setIsUploading(signal)
      );
    } else {
      setMessage({ status: -1, msg: "No file uploaded" });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
        File Transfer
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            isRemoteDataChannelConnected
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {isRemoteDataChannelConnected ? "Connected" : "Disconnected"}
        </span>
      </h2>

      <div className="border border-gray-300 p-4 rounded-lg mb-4 hover:border-blue-500 transition duration-300">
        <label className="cursor-pointer w-full h-full flex justify-center items-center">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFileToTransfer(e.target.files)}
            disabled={!isRemoteDataChannelConnected || isUploading}
          />
          <span className="text-blue-600 hover:text-blue-800 transition duration-300">
            Choose files
          </span>
        </label>
      </div>

      {fileToTransfer && fileToTransfer.length > 0 && (
        <div className="text-gray-600 mb-4">
          {fileToTransfer[0].name} selected
        </div>
      )}

      <div className="w-full mt-6">
        <button
          className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 ${
            (!isRemoteDataChannelConnected || isUploading) &&
            "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleUpload}
          disabled={!isRemoteDataChannelConnected || isUploading}
        >
          Upload
        </button>
        {isUploading ? (
          <div className="mt-4 flex justify-center items-center space-x-2">
            <span className="text-gray-600">Uploading</span>
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          message?.msg && (
            <h3
              className={`mt-4 text-center ${
                message.status === -1
                  ? "text-gray-600"
                  : message.status === 0
                  ? "text-green-600"
                  : message.status === 1
                  ? "text-red-600"
                  : ""
              }`}
            >
              {message.msg}
            </h3>
          )
        )}
      </div>
    </div>
  );
};

export default FileTransfer;
