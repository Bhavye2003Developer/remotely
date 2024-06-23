const get_ip = require("./get_ip");
const localIpAddress = get_ip();
console.log(localIpAddress);

const signaling_server = async (app, expressWs) => {
  const open = (await import("open")).default;

  app.ws("/reach-signal-server", (ws, req) => {
    console.log(
      "WebSocket connection established - signaling server",
      req.socket.remoteAddress,
      "hostname: ",
      req.hostname
    );

    const client_ip = req.socket.remoteAddress.split(":")[3];

    if (client_ip !== localIpAddress) {
      open("http://localhost:5173/send-file");
      console.log("external client added");
    }

    ws.on("error", (err) => {
      console.log("Error occurred:", err);
    });

    ws.on("message", (msg) => {
      console.log("Webrtc: ", msg, JSON.parse(msg));

      const data = JSON.parse(msg);
      console.log("data from client: ", data);

      expressWs.getWss().clients.forEach((client) => {
        if (client !== ws) client.send(msg);
      });
    });
  });
};

module.exports = signaling_server;
