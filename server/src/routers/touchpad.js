const express = require("express");
const robot = require("robotjs");
const router = express.Router();

let previousPoint = [-1, -1];
robot.setMouseDelay(0);

router.ws("/move", (ws, req) => {
  console.log("WebSocket connection established");
  ws.on("error", (err) => {
    console.log("Error occurred:", err);
  });
  ws.on("message", (msg) => {
    const { pointerCoordinates, isFirstTouch } = JSON.parse(msg);
    const [coordinateX, coordinateY] = pointerCoordinates;
    const { x: currentCursorPosX, y: currentCursorPosY } = robot.getMousePos();

    if (coordinateX !== -1 && coordinateY !== -1) {
      if (isFirstTouch === 1) {
        previousPoint = [coordinateX, coordinateY];
      } else {
        const divX = coordinateX - previousPoint[0];
        const divY = coordinateY - previousPoint[1];
        const cursorToBePlacePosX = currentCursorPosX + divX * 2;
        const cursorToBePlacePosY = currentCursorPosY + divY * 2;
        robot.moveMouse(cursorToBePlacePosX, cursorToBePlacePosY);
        console.log(
          `Moving cursor: current(${currentCursorPosX}, ${currentCursorPosY}) -> new(${cursorToBePlacePosX}, ${cursorToBePlacePosY})`
        );
        previousPoint = [coordinateX, coordinateY];
      }
    }
  });
  ws.on("close", () => {
    console.log("WebSocket was closed");
  });
});

router.post("/click", (req, res) => {
  robot.mouseClick();
  res.json({ success: true });
});

router.post("/right-click", (req, res) => {
  robot.mouseClick("right");
  res.json({ success: true });
});

router.post("/left-click", (req, res) => {
  robot.mouseClick("left");
  res.json({ success: true });
});

module.exports = router;
