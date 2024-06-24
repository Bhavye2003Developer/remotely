import { toast } from "react-toastify";

class WebRTC_setter {
  constructor(socket) {
    this.socket = socket;
    this.senderDataChannel = null;
    this.receiverPeerConnection = null;
    this.receiveBuffer = [];
    this.receivedSize = 0;
    this.fileMetaData = null;
  }

  async sendAndReceive_sender(setIsRemoteDataChannelConnected, setIsUploading) {
    const peerConnection = new RTCPeerConnection();

    // Create a data channel for sending files
    const dataChannel = peerConnection.createDataChannel("files-data");
    this.senderDataChannel = dataChannel;

    // Event handlers for data channel state changes
    dataChannel.onopen = () => setIsRemoteDataChannelConnected(true);
    dataChannel.onclose = () => setIsRemoteDataChannelConnected(false);

    // WebSocket message handling
    this.socket.onmessage = async (message) => {
      try {
        const msg = JSON.parse(message.data);
        if (msg.answer) {
          const remoteDesc = new RTCSessionDescription(msg.answer);
          await peerConnection.setRemoteDescription(remoteDesc);
          console.log("SDP exchange successful");
        } else if (msg.candidate) {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(msg.candidate)
          );
          console.log("ICE candidate exchange completed");
        } else if (msg.fileStatus) {
          setIsUploading(false);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    // ICE candidate handling
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.socket.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    // Create and send offer to initiate connection
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("Offer sent:", offer);
    this.socket.send(JSON.stringify({ offer }));
  }

  sendFile(fileToTransfer, setIsUploading) {
    const file = fileToTransfer;

    // Send file metadata
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
    this.socket.send(JSON.stringify(fileInfo));
    setIsUploading(true);

    // Function to read and send file slices
    const chunkSize = 16384; // 16KB
    const fileReader = new FileReader();
    let offset = 0;

    fileReader.addEventListener("error", (error) =>
      console.error("Error reading file:", error)
    );
    fileReader.addEventListener("abort", (event) =>
      console.log("File reading aborted:", event)
    );
    fileReader.addEventListener("load", (event) => {
      console.log("FileRead.onload ", event);
      this.senderDataChannel.send(event.target.result);
      offset += event.target.result.byteLength;
      if (offset < file.size) {
        readSlice(offset);
      }
    });

    const readSlice = (o) => {
      const slice = file.slice(o, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };

    readSlice(0);
  }

  async receiveAndSend_receiver(setFileMetaData) {
    const peerConnection = new RTCPeerConnection();
    this.receiverPeerConnection = peerConnection;

    // WebSocket message handling for receiver
    this.socket.onmessage = async (message) => {
      try {
        const msg = JSON.parse(message.data);
        if (msg.offer) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(msg.offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          console.log("Answer created and sent:", answer);
          this.socket.send(JSON.stringify({ answer }));
        } else if (msg.candidate) {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(msg.candidate)
          );
          console.log("ICE candidate received and added");
        } else if (msg.name && msg.size && msg.type && msg.lastModified) {
          await setFileMetaData(msg);
          this.fileMetaData = msg;
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    // ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.send(JSON.stringify({ candidate: event.candidate }));
      }
    };
  }

  receiveFile(setIsConnectedToLocal, fileDownloadRef) {
    this.receiverPeerConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;

      // Event handlers for data channel state changes
      receiveChannel.onopen = () => setIsConnectedToLocal(true);
      receiveChannel.onclose = () => setIsConnectedToLocal(false);

      // Event handler for receiving file data
      receiveChannel.onmessage = (event) => {
        this.receiveBuffer.push(event.data);
        this.receivedSize += event.data.byteLength;

        // Check if file transfer is complete
        if (this.receivedSize === this.fileMetaData.size) {
          const received = new Blob(this.receiveBuffer);
          const fileAccessLink = URL.createObjectURL(received);

          // Prepare download link
          fileDownloadRef.href = fileAccessLink;
          fileDownloadRef.download = this.fileMetaData.name;
          fileDownloadRef.textContent = `Click to download '${this.fileMetaData.name}' (${this.fileMetaData.size} bytes)`;

          toast.success("File received successfully");
          this.resetTransference();
        }
      };
    };
  }

  resetTransference() {
    // Reset variables after file transfer completion
    this.receiveBuffer = [];
    this.receivedSize = 0;
    this.fileMetaData = null;
  }

  closeChannels() {
    // Close data channels when cleaning up
    if (this.senderDataChannel) {
      this.senderDataChannel.close();
      this.senderDataChannel = null;
      console.log("Sender data channel closed");
    }

    if (this.receiverPeerConnection) {
      this.receiverPeerConnection.close();
      this.receiverPeerConnection = null;
      console.log("Receiver peer connection closed");
    }
  }
}

export default WebRTC_setter;
