const express = require("express");
const robot = require("robotjs");
const router = express.Router();

const screenSize = robot.getScreenSize();
let previousPoint = [-1, -1];
robot.setMouseDelay(2);

router.post("/move", (req, res) => {
  const [coordinateX, coordinateY] = req.body.pointerCoordinates;
  const isFirstTouch = req.body.isFirstTouch;
  const padSize = req.body.padSize;

  const [currentCursorPosX, currentCursorPosY] = [
    robot.getMousePos().x,
    robot.getMousePos().y,
  ];

  if (coordinateX === -1 && coordinateY === -1) {
    const mouseCurPos = robot.getMousePos();
    return res.json(mouseCurPos);
  } else {
    // const PadTouchPosX = (coordinates[0] * screenSize.width) / padSize[0];
    // const PadTouchPosY = (coordinates[1] * screenSize.height) / padSize[1];

    if (isFirstTouch === 1) previousPoint = [coordinateX, coordinateY];
    else {
      const divX = coordinateX - previousPoint[0];
      const divY = coordinateY - previousPoint[1];

      const cursorToBePlacePosX = currentCursorPosX + divX;
      const cursorToBePlacePosY = currentCursorPosY + divY;

      robot.moveMouse(cursorToBePlacePosX, cursorToBePlacePosY);

      console.log(
        `hit - touchpad\tcoordinates -> ${coordinateX} ${coordinateY}, prevCoordinates -> ${previousPoint}`
      );
      previousPoint = [coordinateX, coordinateY];
    }
    res.json([]);
  }
});

router.post("/click", (req, res) => {
  // robot.mouseClick();
  res.json();
});

module.exports = router;
