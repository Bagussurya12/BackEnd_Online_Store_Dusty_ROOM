import { fileTypeFromFile } from "file-type";
import { TYPE_IMAGE } from "./uploadFile.js";
import { unlink, access } from "node:fs/promises";

// async function checkFile(path) {
//   try {
//     await access(path);
//     return true;
//   } catch {
//     return false;
//   }
// }

export default async function checkFileType(req, res, next) {
  const file = req.file;
  const acceptMime = Object.keys(TYPE_IMAGE);
  const fileType = await fileTypeFromFile(file.path);

  if (!acceptMime.includes(fileType.mime)) {
    // const isExistFile = await checkFile(file.path);
    // if (isExistFile) {
    //   await unlink(file.path);
    // }
    await unlink(file.path);
    res.status(500).json({
      message: "FILE_INVALID",
    });
  }
  next();
}
