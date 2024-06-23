import { useEffect, useState } from "react";
import file_transfer from "../../utils/file_transfer";
import WebRTC_setter from "../../utils/webRTC_setter";

const FileTransfer = () => {
  const [filesToTransfer, setFilesToTransfer] = useState(null);
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
    webRTC_setter.sendAndReceive_sender((signal) => {
      console.log("signal: ", signal);
      setIsRemoteDataChannelConnected(signal);
    });

    setWebRTC_setter(webRTC_setter);

    return () => {
      console.log("closing ws connection...");
      socket.close();
      // webRTC_setter.closeChannels()
    };
  }, []);

  const handleUpload = () => {
    if (filesToTransfer && filesToTransfer.length > 0) {
      // setIsUploading(true);
      // file_transfer(filesToTransfer, false).then((res) => {

      console.log("files to send: ", filesToTransfer[0]);
      setIsUploading(false);
      // setMessage({ status: res.data.status, msg: res.data.msg });
      // });

      webrtc_setter.sendFile(filesToTransfer[0]);

      // send file to webrtc_setter
    } else {
      setMessage({ status: -1, msg: "No file uploaded" });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">
        File Transfer |{" "}
        {isRemoteDataChannelConnected ? "connected" : "disconnected"}
      </h2>

      <div className="border border-gray-300 p-3 rounded-lg mb-4">
        <label className="cursor-pointer w-full h-full flex justify-center items-center">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setFilesToTransfer(e.target.files)}
            disabled={isRemoteDataChannelConnected ? false : true}
          />
          <span className="text-blue-600">Choose files</span>
        </label>
      </div>

      {filesToTransfer && filesToTransfer.length > 0 && (
        <div className="text-gray-600 mb-4">1 selected</div>
      )}

      <div className="w-full mt-4">
        <button
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          onClick={handleUpload}
          disabled={isRemoteDataChannelConnected ? false : true}
        >
          Upload
        </button>
        {isUploading ? (
          <div className="mt-4 flex justify-center items-center">
            <span className="text-gray-600">Uploading</span>
            <span className="animate-pulse text-gray-600">...</span>
          </div>
        ) : (
          <h3
            className={`mt-4 ${
              message?.status === -1
                ? "text-gray-600"
                : message?.status === 0
                ? "text-green-600"
                : message?.status === 1
                ? "text-red-600"
                : ""
            }`}
          >
            {message?.msg}
          </h3>
        )}
      </div>
    </div>
  );
};

export default FileTransfer;
