import FullScreen from "./FullScreen";
import Touchpad from "./Touchpad";
import FileTransferer from "./FileTransferer";
import Header from "./Header";
import FileReceiver from "./FileReceiver";

const MobileHome = () => {
  return (
    <div>
      <div>
        <Header />
        {/* <Touchpad /> */}
        {/* <FullScreen /> */}
        {/* <FileTransferer/> */}
        <FileReceiver />
      </div>
    </div>
  );
};

export default MobileHome;
