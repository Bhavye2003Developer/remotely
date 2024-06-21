import { useEffect, useState } from "react";
import { receiveAndSend_receiver } from "../../utils/webRTC_setter";

const FileTransfererDesktop = () => {
  const [socket, setSocket] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.35:3000/reach-signal-server");
    socket.onopen = () => {
      console.log("connected to ws server");
    };

    //receiver
    receiveAndSend_receiver(socket);

    setSocket(socket);

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
    </div>
  );
};

export default FileTransfererDesktop;
