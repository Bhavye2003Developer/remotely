import { useEffect, useState } from "react";
import FullScreen from "./Mobile/FullScreen";
import Touchpad from "./Mobile/Touchpad";
import FileTransfer from "./Mobile/FileTransfer";
import Header from "./Mobile/Header";
import { BrowserView, MobileView } from "react-device-detect";
import BrowserHeader from "./Browser/BroswserHeader";

const Home = () => {
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
    <div className="w-full h-full">
      <MobileView>
        <div>
          <Touchpad socket={socket} />
          <Header />
          {/* <FullScreen /> */}
          {/* <FileTransfer /> */}
        </div>
      </MobileView>
      <BrowserView>
        <BrowserHeader />
        <div>
          <h1>This is desktop</h1>
        </div>
      </BrowserView>
    </div>
  );
};

export default Home;
