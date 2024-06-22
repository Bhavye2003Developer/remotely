class WebRTC_setter {
  constructor(socket) {
    this.socket = socket;
    this.senderDataChannel = null;
    this.receiverPeerConnection = null;
    this.receiveBuffer = [];
    this.receivedSize = 0;
    this.fileMetaData = null;
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

  sendFile(fileToTransfer) {
    // console.log("file transferring...");
    // this.senderDataChannel.send(JSON.stringify(fileToTransfer));

    const file = fileToTransfer;

    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };

    this.socket.send(JSON.stringify(fileInfo));

    if (file.size === 0)
      return { msg: "File is empty, please select a non-empty file" };
    // max progress -> file.size
    const chunkSize = 16384; // 16KB
    const fileReader = new FileReader();
    let offset = 0;

    console.log(
      `File is ${[file.name, file.size, file.type, file.lastModified].join(
        " "
      )} offset - ${offset}`
    );

    fileReader.addEventListener("error", (error) =>
      console.error("Error reading file:", error)
    );
    fileReader.addEventListener("abort", (event) =>
      console.log("File reading aborted:", event)
    );
    fileReader.addEventListener("load", (e) => {
      console.log("FileRead.onload ", e);
      this.senderDataChannel.send(e.target.result);
      offset += e.target.result.byteLength;
      // sendProgress.value = offset;
      if (offset < file.size) {
        readSlice(offset);
      }
    });
    const readSlice = (o) => {
      console.log("readSlice ", o);
      const slice = file.slice(offset, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };
    readSlice(0);
  }

  async receiveAndSend_receiver(setFileMetaData) {
    const peerConnection = new RTCPeerConnection();
    this.receiverPeerConnection = peerConnection;
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
        } else if (msg.name && msg.size && msg.type && msg.lastModified) {
          // console.log("setting fileMetaData");
          await setFileMetaData(msg);
          this.fileMetaData = msg;
        }
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.send(JSON.stringify({ candidate: event.candidate }));
      }
    };
  }

  receiveFile(setIsConnectedToLocal, fileDownloadRef) {
    this.receiverPeerConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onopen = () => setIsConnectedToLocal(true);
      receiveChannel.onclose = () => setIsConnectedToLocal(false);
      receiveChannel.onmessage = (event) => {
        this.receiveBuffer.push(event.data);
        this.receivedSize += event.data.byteLength;
        console.log(
          "current fileSize: ",
          this.receivedSize,
          this.fileMetaData.size
        );
        if (this.receivedSize == this.fileMetaData.size) {
          const received = new Blob(this.receiveBuffer);
          const fileAccessLink = URL.createObjectURL(received);

          console.log("file downloaded completed", fileAccessLink);

          console.log(fileDownloadRef);
          fileDownloadRef.href = fileAccessLink;
          fileDownloadRef.download = this.fileMetaData.name;
          fileDownloadRef.textContent = `Click to download '${this.fileMetaData.name}' (${this.fileMetaData.size} bytes)`;

          this.receiveBuffer = [];
          this.fileMetaData = null;
          // const bitrate = Math.round(
          //   (this.receivedSize * 8) / (new Date().getTime() - timestampStart)
          // );
        }
      };
    };
  }
}

export default WebRTC_setter;
