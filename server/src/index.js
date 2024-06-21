const express = require("express");
const cors = require("cors");
const app = express();
const expressWs = require("express-ws")(app);
const touchpad = require("./routers/touchpad");
const global_ws = require("./utils/global_calls");
const { file_transfer } = require("./utils/file_transfer");
const signaling_server = require("./utils/signaling_server");
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/touchpad", touchpad);
global_ws(app);
signaling_server(app, expressWs);

app.post("/upload", (req, res) => {
  console.log("uploading...");
  const response = file_transfer(req, res);
  return response;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
