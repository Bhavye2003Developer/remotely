import axios from "axios";
import { FILE_UPLOAD_URL } from "./config";

export default async (filesToTransfer, isMobile = true) => {
  console.log(filesToTransfer);
  const formData = new FormData();

  console.log(filesToTransfer, typeof filesToTransfer);
  const fileIndexes = Object.keys(filesToTransfer);
  console.log(fileIndexes);

  fileIndexes.forEach((_, index) => {
    formData.append(`file_${index + 1}`, filesToTransfer[index]);
  });

  const result = await axios.post(isMobile ? FILE_UPLOAD_URL : "", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};
