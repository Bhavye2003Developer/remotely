const express = require("express");
const cors = require("cors");
const app = express();
const expressWs = require("express-ws")(app);
const touchpad = require("./routers/touchpad");
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/touchpad", touchpad);

app.get("/", (req, res) => {
  console.log("hitted");
  res.send("");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
