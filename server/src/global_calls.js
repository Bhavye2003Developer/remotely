const robot = require("robotjs");

let previousPoint = [-1, -1];
robot.setMouseDelay(0);

const global_ws = (app) => {
  app.ws("/real-time", (ws, req) => {
    console.log("WebSocket connection established");
    ws.on("error", (err) => {
      console.log("Error occurred:", err);
    });
    ws.on("message", (msg) => {
      const data = JSON.parse(msg);
      const type = data.type;

      if (type === "move") {
        // move the cursor
        const { pointerCoordinates, isFirstTouch } = data;
        const [coordinateX, coordinateY] = pointerCoordinates;
        const { x: currentCursorPosX, y: currentCursorPosY } =
          robot.getMousePos();

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
      } else if (type === "special_key_press") {
        const key = data.value;
        console.log("special-type: ", key);
        robot.keyTap(key);
      } else if (type === "typing") {
        // enable keyboard
        const textToBeTyped = data.data;
        console.log("to be writen: ", textToBeTyped);
        robot.typeString(textToBeTyped);
      }
    });
    ws.on("close", () => {
      console.log("WebSocket was closed");
    });
  });
};

module.exports = global_ws;
