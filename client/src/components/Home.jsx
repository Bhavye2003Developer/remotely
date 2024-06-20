import { BrowserView, MobileView } from "react-device-detect";
import MobileHome from "./Mobile/MobileHome";
import BrowserHome from "./Browser/BrowserHome";

const Home = () => {
  return (
    <div className="w-full h-full">
      <MobileView>
        <MobileHome />
      </MobileView>
      <BrowserView>
        <BrowserHome />
      </BrowserView>
    </div>
  );
};

export default Home;
