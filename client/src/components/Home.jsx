import { useEffect, useState } from "react";
import FullScreen from "./FullScreen";
import Touchpad from "./Touchpad";
import Keyboard from "./Keyboard";

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
      <Touchpad socket={socket} />
      <FullScreen />
      <Keyboard socket={socket} />
    </div>
  );
};

export default Home;
