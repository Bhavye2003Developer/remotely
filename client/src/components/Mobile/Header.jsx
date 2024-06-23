import { Link } from "react-router-dom";
import FullScreen from "./FullScreen";

const Header = () => {
  return (
    <div>
      <div className="flex justify-between">
        <h3 className="">
          <Link to={"/"}>{"<"}</Link>
        </h3>
        <h3 className="w-full text-center">Desktop Remote</h3>
        <FullScreen />
      </div>
    </div>
  );
};

export default Header;
