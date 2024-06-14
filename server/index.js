const express = require("express");
const cors = require("cors");
const robot = require("robotjs");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const screenSize = robot.getScreenSize();

console.log(robot.getMousePos());

// arr = [
//   [10, 20],
//   [20, 30],
//   [30, 40],
//   [40, 50],
// ];

// for (i in arr) {
//   robot.moveMouseSmooth(arr[i][0], arr[i][1]);
//   // console.log();
// }

let previousPoint = [-1, -1, 0];

app.post("/touchpad", (req, res) => {
  console.log("hit");
  const [coordinateX, coordinateY, theta] = req.body.pointerCoordinates;
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

    const padPointDistance = Math.sqrt(
      Math.pow(coordinateX - previousPoint[0], 2) +
        Math.pow(coordinateY - previousPoint[1], 2)
    );

    // const cursorToBePlacePosX = 

    console.log(
      `theta -> ${theta}, coordinates -> ${coordinateX} ${coordinateY}, prevCoordinates -> ${previousPoint}`
    );

    previousPoint = [coordinateX, coordinateY, theta];

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
