import { useEffect, useState } from "react";
import FullScreen from "./FullScreen";
import Touchpad from "./Touchpad";
import FileTransfer from "./FileTransfer";
import Header from "./Header";

const MobileHome = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.35:3000/real-time");
    socket.onopen = () => {
      console.log("connected to ws server");
    };
    setSocket(socket);

    return () => {
      console.log("closing ws connection...");
      socket.close();
    };
  }, []);

  if (!socket) return <div>Loading...</div>;
  return (
    <div>
      <div>
        <Header />
        <Touchpad socket={socket} />
        {/* <FullScreen /> */}
        {/* <FileTransfer /> */}
      </div>
    </div>
  );
};

export default MobileHome;
