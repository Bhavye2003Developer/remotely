import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";

const Touchpad = () => {
  const [pointerCoordinates, setPointerCoordinates] = useState([-1, -1, 0]);
  const [canvasCoordinates, setCanvasCoordinates] = useState([-1, -1]);
  const [padSize, setPadSize] = useState([0, 0]);
  const canvasCenterCoord = useRef([0, 0]);
  const canvasRef = useRef(null);

  const cnt = useRef(0);

  useEffect(() => {
    axios
      .post("http://192.168.1.35:3000/touchpad", {
        pointerCoordinates,
        padSize,
      })
      .then((res) => {
        // console.log("response: ", res);
      });
    cnt.current += 1;
  }, [pointerCoordinates]);

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();

      console.log(rect.left, rect.top, rect.right, rect.bottom);
      console.log((rect.right - rect.left) / 2);

      setCanvasCoordinates([rect.left, rect.top, rect.right, rect.bottom]);

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
          const hypotenuseFromCenter = Math.sqrt(
            Math.pow(x2 - canvasCenterCoord.current[0], 2) +
              Math.pow(y2 - canvasCenterCoord.current[1], 2)
          );

          const pointPerpendicularDistance = canvasCenterCoord.current[1] - y2;

          const thetaInRadians = Math.asin(
            pointPerpendicularDistance / hypotenuseFromCenter
          );

          setPointerCoordinates([x2, y2, hypotenuseFromCenter]);

          let thetaInDegree = thetaInRadians * (180 / 3.14);

          const base = x2 - canvasCenterCoord.current[0];
          if (base >= 0 && pointPerpendicularDistance >= 0)
            thetaInDegree = 180 - thetaInDegree;
          else if (base > 0 && pointPerpendicularDistance < 0)
            thetaInDegree = Math.abs(thetaInDegree) + 180;
          else if (base < 0 && pointPerpendicularDistance < 0)
            thetaInDegree = 270 + (90 + thetaInDegree);
        }}
      ></canvas>
      <br />
      {`Hypotenuse: ${pointerCoordinates[2]}`}
      <br />
      {`centerX: ${canvasCenterCoord.current[0]} centerY: ${canvasCenterCoord.current[1]}`}
      <br />
      {`padSize: ${padSize[0]}, ${padSize[1]}`}
      <br />
      {cnt.current}
    </div>
  );
};

export default Touchpad;
