class WebRTC_setter {
  constructor(socket) {
    this.socket = socket;
    this.senderDataChannel = null;
  }

  async sendAndReceive_sender(setIsRemoteDataChannelConnected) {
    const peerConnection = new RTCPeerConnection();

    const dataChannel = peerConnection.createDataChannel("files-data");

    this.senderDataChannel = dataChannel;

    dataChannel.onopen = () => setIsRemoteDataChannelConnected(true);
    dataChannel.onclose = () => {
      setIsRemoteDataChannelConnected(false);
    };

    this.socket.onmessage = async (message) => {
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
        await this.socket.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("offer sending: ", offer);
    this.socket.send(JSON.stringify({ offer: offer }));
  }

  file_transfer(fileToTransfer) {
    console.log("file transferring...");
    this.senderDataChannel.send(JSON.stringify(fileToTransfer));
  }

  async receiveAndSend_receiver(setIsConnectedToLocal) {
    const peerConnection = new RTCPeerConnection();

    peerConnection.ondatachannel = () => {};

    this.socket.onmessage = async (message) => {
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
          this.socket.send(JSON.stringify({ answer: answer }));
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
        this.socket.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    peerConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onopen = () => setIsConnectedToLocal(true);
      receiveChannel.onclose = () => setIsConnectedToLocal(false);
    };
  }
}

export default WebRTC_setter;
