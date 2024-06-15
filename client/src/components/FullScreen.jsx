import { useState } from "react";

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
        {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
    </div>
  );
};

export default FullScreen;
