import FileTransferer from "./FileTransferer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/send-file",
    element: <FileTransferer />,
  },
]);

const BrowserHome = () => {
  return <RouterProvider router={router} />;
};

export default BrowserHome;
