import FullScreen from "./FullScreen";
import Touchpad from "./Touchpad";
import FileTransferer from "./FileTransferer";
import Header from "./Header";
import FileTransfererDesktop from "./FileTransfererDesktop";

const MobileHome = () => {
  return (
    <div>
      <div>
        <Header />
        {/* <Touchpad /> */}
        {/* <FullScreen /> */}
        {/* <FileTransferer/> */}
        <FileTransfererDesktop />
      </div>
    </div>
  );
};

export default MobileHome;
