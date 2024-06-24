import { useEffect, useState } from "react";
import file_transfer from "../../utils/file_transfer";
import { useOutletContext } from "react-router-dom";

const FileTransfer = () => {
  const [filesToTransfer, setFilesToTransfer] = useState(null);
  const [message, setMessage] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const setRelativePath = useOutletContext();
  useEffect(() => {
    setRelativePath(location.pathname);
  }, []);

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
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">File Transfer</h2>

      <div className="border border-gray-300 p-4 rounded-lg mb-4 hover:border-blue-500 transition duration-300">
        <label className="cursor-pointer w-full h-full flex justify-center items-center">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setFilesToTransfer(e.target.files)}
          />
          <span className="text-blue-600 hover:text-blue-800 transition duration-300">
            Choose files
          </span>
        </label>
      </div>

      {filesToTransfer && filesToTransfer.length > 0 && (
        <div className="text-gray-600 mb-4">
          {filesToTransfer.length} file
          {filesToTransfer.length > 1 ? "s" : ""} selected
        </div>
      )}

      <div className="w-full mt-6">
        <button
          className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 ${
            !filesToTransfer && "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleUpload}
          disabled={!filesToTransfer}
        >
          Upload
        </button>
        {isUploading ? (
          <div className="mt-4 flex justify-center items-center space-x-2">
            <span className="text-gray-600">Uploading</span>
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          message?.msg && (
            <h3
              className={`mt-4 text-center ${
                message.status === -1
                  ? "text-gray-600"
                  : message.status === 0
                  ? "text-green-600"
                  : message.status === 1
                  ? "text-red-600"
                  : ""
              }`}
            >
              {message.msg}
            </h3>
          )
        )}
      </div>
    </div>
  );
};

export default FileTransfer;
