const configuration = {
  iceServers: [],
};

async function sendAndReceive_sender(socket) {
  const peerConnection = new RTCPeerConnection();

  const dataChannel = peerConnection.createDataChannel("files-data");

  dataChannel.addEventListener("open", (event) => {
    console.log("data channel opened");
  });

  socket.onmessage = async (message) => {
    if (message.data) {
      const msg = JSON.parse(message.data);
      if (msg.answer) {
        const remoteDesc = new RTCSessionDescription(msg.answer);
        await peerConnection.setRemoteDescription(remoteDesc);
        console.log("inside: ", remoteDesc);
        console.log("SDP exchange successfull");
      } else if (msg.candidate) {
        console.log("got candidate - ", msg.candidate);
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(msg.candidate)
        );
        console.log("got candidate - ", msg.candidate);
        console.log("ice candidate exchange completed");
      }
    }
  };

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      await socket.send(JSON.stringify({ candidate: event.candidate }));
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log("offer sending: ", offer);
  socket.send(JSON.stringify({ offer: offer }));
}

async function receiveAndSend_receiver(socket) {
  const peerConnection = new RTCPeerConnection(configuration);

  socket.onmessage = async (message) => {
    console.log(`data: ${message.data}`);
    if (message.data) {
      const msg = JSON.parse(message.data);
      if (msg.offer) {
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(msg.offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log("answer: ", answer);
        socket.send(JSON.stringify({ answer: answer }));
      } else if (msg.candidate) {
        console.log("got candidate - ", msg.candidate);
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(msg.candidate)
        );
      }
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.send(JSON.stringify({ candidate: event.candidate }));
    }
  };
}

export { sendAndReceive_sender, receiveAndSend_receiver };
