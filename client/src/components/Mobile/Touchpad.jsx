import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getHypotenuse } from "../../utils/geo";
import Keyboard from "./Keyboard";

const Touchpad = ({ socket }) => {
  const [pointerCoordinates, setPointerCoordinates] = useState([-1, -1]);
  const [isClicked, setIsClicked] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(0); // -1 -> right, 0 -> none, 1 -> left
  const [padSize, setPadSize] = useState([0, 0]);
  const canvasCenterCoord = useRef([0, 0]);
  const canvasRef = useRef(null);
  const isFirstTouch = useRef(null);

  useEffect(() => {
    if (pointerCoordinates[0] !== -1 && pointerCoordinates[1] !== -1) {
      console.log(pointerCoordinates);
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
      setIsClicked(false);
    }
  }, [isClicked]);

  useEffect(() => {
    if (isButtonClicked === -1) {
      console.log("right-clicked");
      axios.post("http://192.168.1.35:3000/touchpad/right-click", {
        right_clicked: true,
      });
    } else if (isButtonClicked === 1) {
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
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <h2 className="text-3xl font-bold mb-6">Touchpad</h2>
      <div className="w-full max-w-md">
        <canvas
          className="bg-gray-800 w-full h-96 rounded-lg shadow-lg"
          ref={canvasRef}
          onTouchMove={(e) => {
            const x2 = e.changedTouches[0].clientX;
            const y2 = e.changedTouches[0].clientY;
            const hypotenuse = getHypotenuse(x2, y2, canvasCenterCoord);
            setPointerCoordinates([x2, y2, hypotenuse]);
          }}
          onTouchStart={() => {
            isFirstTouch.current = 1;
          }}
          onClick={() => {
            setIsClicked(true);
          }}
        ></canvas>
        <div className="flex w-full mt-4">
          <button
            onClick={() => setIsButtonClicked(1)}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 rounded-l-lg mr-1 h-12 text-white transition-colors duration-300"
          >
            Left Click
          </button>
          <button
            onClick={() => setIsButtonClicked(-1)}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 rounded-r-lg h-12 text-white transition-colors duration-300"
          >
            Right Click
          </button>
        </div>
      </div>
      <div className="w-full">
        <Keyboard socket={socket} />
      </div>
    </div>
  );
};

export default Touchpad;
