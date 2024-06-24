import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  BrowserRouter as Router,
  Routes,
  Route,
  useOutletContext,
} from "react-router-dom";
import Touchpad from "./Touchpad";
import FileTransferer from "./FileTransferer";
import Header from "./Header";
import FileReceiver from "./FileReceiver";

const LocalHome = () => {
  const setRelativePath = useOutletContext();
  useEffect(() => {
    setRelativePath("/");
  }, []);

  return (
    <div className="p-8 flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Desktop Remote</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <Link to="/touchpad" className="text-blue-600 hover:underline">
            Touchpad
          </Link>
        </li>
        <li>
          <Link to="/send-file" className="text-blue-600 hover:underline">
            Send File to desktop
          </Link>
        </li>
        <li>
          <Link to="/receive-file" className="text-blue-600 hover:underline">
            Receive file from desktop
          </Link>
        </li>
      </ul>
    </div>
  );
};

const MobileHome = () => {
  const [relativePath, setRelativePath] = useState("/");

  return (
    <div className="bg-white min-h-screen">
      <Header relativePath={relativePath} />
      <Outlet context={setRelativePath} />
    </div>
  );
};

const Home = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MobileHome />}>
        <Route index element={<LocalHome />} />
        <Route path="/touchpad" element={<Touchpad />} />
        <Route path="/send-file" element={<FileTransferer />} />
        <Route path="/receive-file" element={<FileReceiver />} />
      </Route>
    </Routes>
  </Router>
);

export default Home;
