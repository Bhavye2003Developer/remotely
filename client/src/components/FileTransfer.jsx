import { useState } from "react";
import file_transfer from "../utils/file_transfer";

const FileTransfer = () => {
  const [filesToTransfer, setFilesToTransfer] = useState(null);
  const [message, setMessage] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    if (filesToTransfer && filesToTransfer.length > 0) {
      setIsUploading(true);
      file_transfer(filesToTransfer).then((res) => {
        setIsUploading(false);
        setMessage({ status: res.data.status, msg: res.data.msg });
      });
    } else {
      setMessage({ status: -1, msg: "No file uploaded" });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">File Transfer</h2>

      <div className="border border-gray-300 p-3 rounded-lg mb-4">
        <label className="cursor-pointer w-full h-full flex justify-center items-center">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setFilesToTransfer(e.target.files)}
          />
          <span className="text-blue-600">Choose files</span>
        </label>
      </div>

      {filesToTransfer && filesToTransfer.length > 0 && (
        <div className="text-gray-600 mb-4">
          {filesToTransfer.length} file{filesToTransfer.length > 1 ? "s" : ""}{" "}
          selected
        </div>
      )}

      <div className="w-full mt-4">
        <button
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          onClick={handleUpload}
        >
          Upload
        </button>
        {isUploading ? (
          <div className="mt-4 flex justify-center items-center">
            <span className="text-gray-600">Uploading</span>
            <span className="animate-pulse text-gray-600">...</span>
          </div>
        ) : (
          <h3
            className={`mt-4 ${
              message?.status === -1
                ? "text-gray-600"
                : message?.status === 0
                ? "text-green-600"
                : message?.status === 1
                ? "text-red-600"
                : ""
            }`}
          >
            {message?.msg}
          </h3>
        )}
      </div>
    </div>
  );
};

export default FileTransfer;
