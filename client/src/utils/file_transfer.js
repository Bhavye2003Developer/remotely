import axios from "axios";

export default async (filesToTransfer, isMobile = true) => {
  console.log(filesToTransfer);
  const formData = new FormData();

  console.log(filesToTransfer, typeof filesToTransfer);
  const fileIndexes = Object.keys(filesToTransfer);
  console.log(fileIndexes);

  fileIndexes.forEach((_, index) => {
    formData.append(`file_${index + 1}`, filesToTransfer[index]);
  });

  const result = await axios.post(
    isMobile ? "http://192.168.1.35:3000/upload" : "",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return result;
};
