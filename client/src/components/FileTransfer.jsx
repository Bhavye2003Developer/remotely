import axios from "axios";
import { useEffect, useState } from "react";
import file_transfer from "../utils/file_transfer";

const FileTransfer = () => {
  const [filesToTransfer, setFilesToTransfer] = useState(null);

  useEffect(() => {
    if (filesToTransfer) {
      file_transfer(filesToTransfer).then((res) => {
        console.log(res.data);
      });
    }
  }, [filesToTransfer]);

  return (
    <div>
      <h2>File transfer</h2>
      <input
        type="file"
        multiple
        onChange={(e) => setFilesToTransfer(e.target.files)}
      />
    </div>
  );
};

export default FileTransfer;
