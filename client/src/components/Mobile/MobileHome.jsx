import Touchpad from "./Touchpad";
import FileTransferer from "./FileTransferer";
import Header from "./Header";
import FileReceiver from "./FileReceiver";
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

const LocalHome = () => {
  return (
    <div>
      <h1>Welcome to Desktop Remote</h1>
      <ul>
        <li>
          <Link to="/touchpad">Touchpad</Link>
        </li>
        <li>
          <Link to="/send-file">Send File to desktop</Link>
        </li>
        <li>
          <Link to="/receive-file">Receive file from desktop</Link>
        </li>
      </ul>
    </div>
  );
};

const MobileHome = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileHome />,
    children: [
      {
        path: "/",
        element: <LocalHome />,
      },
      {
        path: "/touchpad",
        element: <Touchpad />,
      },
      {
        path: "/send-file",
        element: <FileTransferer />,
      },
      {
        path: "/receive-file",
        element: <FileReceiver />,
      },
    ],
  },
]);

const Home = () => <RouterProvider router={router} />;

export default Home;
