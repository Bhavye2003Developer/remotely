const signaling_server = (app, expressWs) => {
  app.ws("/reach-signal-server", (ws, req) => {
    console.log("WebSocket connection established - signaling server");
    ws.on("error", (err) => {
      console.log("Error occurred:", err);
    });
    ws.on("message", (msg) => {
      console.log("Webrtc: ", msg, JSON.parse(msg));
      expressWs.getWss().clients.forEach((client) => {
        if (client !== ws) client.send(msg);
      });
    });
  });
};

module.exports = signaling_server;
