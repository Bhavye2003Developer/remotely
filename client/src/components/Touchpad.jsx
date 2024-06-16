import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { getHypotenuse } from "../utils/geo";

const Touchpad = ({ socket }) => {
  const [pointerCoordinates, setPointerCoordinates] = useState([-1, -1]);
  const [isClicked, setIsClicked] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(0); // -1 -> right, 0 -> none, 1 -> left
  const [padSize, setPadSize] = useState([0, 0]);
  const canvasCenterCoord = useRef([0, 0]);
  const canvasRef = useRef(null);
  const isFirstTouch = useRef(null);

  useEffect(() => {
    if (pointerCoordinates[0] != -1 && pointerCoordinates[1] !== -1) {
      // console.log(pointerCoordinates);
      socket.send(
        JSON.stringify({
          pointerCoordinates,
          padSize,
          isFirstTouch: isFirstTouch.current,
          type: "move",
        })
      );
      isFirstTouch.current = 0;
    }
  }, [pointerCoordinates]);

  useEffect(() => {
    if (isClicked) {
      console.log("clicked");
      axios.post("http://192.168.1.35:3000/touchpad/click", { clicked: true });
    }
    setIsClicked(false);
  }, [isClicked]);

  useEffect(() => {
    if (isButtonClicked == -1) {
      console.log("right-clicked");
      axios.post("http://192.168.1.35:3000/touchpad/right-click", {
        right_clicked: true,
      });
    } else if (isButtonClicked == 1) {
      console.log("left-clicked");
      axios.post("http://192.168.1.35:3000/touchpad/left-click", {
        left_clicked: true,
      });
    }
    setIsButtonClicked(0);
  }, [isButtonClicked]);

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
      <div>
        <div>
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
            onTouchStart={(e) => {
              isFirstTouch.current = 1;
            }}
            onClick={() => {
              setIsClicked(true);
            }}
          ></canvas>
        </div>
        <div>
          <button onClick={() => setIsButtonClicked(1)}>Left Click</button>
          <button onClick={() => setIsButtonClicked(-1)}>Right click</button>
        </div>
      </div>
    </div>
  );
};

export default Touchpad;
