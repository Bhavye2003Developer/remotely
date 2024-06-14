const express = require("express");
const cors = require("cors");
const robot = require("robotjs");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const screenSize = robot.getScreenSize();

console.log(robot.getMousePos());

let previousPoint = [-1, -1];

app.post("/touchpad", (req, res) => {
  console.log("hit");
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
        `coordinates -> ${coordinateX} ${coordinateY}, prevCoordinates -> ${previousPoint}`
      );

      previousPoint = [coordinateX, coordinateY];
    }

    res.json([]);
  }
});

app.get("/", (req, res) => {
  console.log("hitted");
  res.send("");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
