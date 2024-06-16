import { useState } from "react";
import FullscreenSymbol from "../assets/fullscreen-symbol.svg?react";
import ExitFullscreenSymbol from "../assets/exit-fullscreen-symbol.svg?react";

const FullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          if (!isFullScreen) document.documentElement.requestFullscreen();
          else document.exitFullscreen();
          setIsFullScreen(!isFullScreen);
        }}
      >
        <div className="w-5">
          {isFullScreen ? <ExitFullscreenSymbol /> : <FullscreenSymbol />}
        </div>
      </button>
    </div>
  );
};

export default FullScreen;
