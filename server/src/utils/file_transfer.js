const os = require("node:os");
const fs = require("fs");
const { formidable } = require("formidable");

const file_transfer = (req, res) => {
  const form = formidable({});
  return form.parse(req, (err, fields, files) => {
    if (err) {
      console.log("Error occured: ", err);
      return res.json({
        status: 1,
        msg: "Error uploading!",
      });
    }
    const homeDir = os.homedir();
    const filesIndexes = Object.keys(files);
    filesIndexes.forEach((fileIndex) => {
      const properties = files[fileIndex][0];
      fs.writeFileSync(
        `${homeDir}\\${properties.originalFilename}`,
        fs.readFileSync(properties.filepath)
      );
      console.log("file saved successfully...", fileIndex);
    });
    return res.json({
      status: 0,
      msg: "uploaded successfully",
    });
  });
};

module.exports = { file_transfer };
