import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { getHypotenuse } from "../utils/geo";

const Touchpad = () => {
  const [pointerCoordinates, setPointerCoordinates] = useState([-1, -1]);
  const [isClicked, setIsClicked] = useState(false);
  const [padSize, setPadSize] = useState([0, 0]);
  const canvasCenterCoord = useRef([0, 0]);
  const canvasRef = useRef(null);
  const isFirstTouch = useRef(null);

  useEffect(() => {
    axios.post("http://192.168.1.35:3000/touchpad/move", {
      pointerCoordinates,
      padSize,
      isFirstTouch: isFirstTouch.current,
    });
    isFirstTouch.current = 0;
  }, [pointerCoordinates]);

  useEffect(() => {
    console.log("clicked");
    axios.post("http://192.168.1.35:3000/touchpad/click", { clicked: true });
    setIsClicked(false);
  }, [isClicked]);

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();

      const padWidth = canvasRef.current.offsetWidth;
      const padHeight = canvasRef.current.offsetHeight;

      canvasCenterCoord.current = [
        rect.right - padWidth / 2,
        rect.bottom - padHeight / 2,
      ];

      setPadSize([padWidth, padHeight]);
    }
  }, [canvasRef.current]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <h2>Touchpad</h2>
      <canvas
        style={{
          width: "90%",
          height: 300,
          padding: "10px",
          paddingLeft: 20,
          backgroundColor: "#000132",
          overflow: "hidden",
        }}
        ref={canvasRef}
        onTouchMove={(e) => {
          const x2 = e.changedTouches[0].clientX;
          const y2 = e.changedTouches[0].clientY;

          const hypotenuse = getHypotenuse(x2, y2, canvasCenterCoord);

          setPointerCoordinates([x2, y2, hypotenuse]);
        }}
        onTouchStart={() => (isFirstTouch.current = 1)}
        onClick={() => {
          setIsClicked(true);
        }}
      ></canvas>
    </div>
  );
};

export default Touchpad;
