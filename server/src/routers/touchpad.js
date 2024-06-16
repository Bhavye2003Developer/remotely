const express = require("express");
const robot = require("robotjs");
const router = express.Router();

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
