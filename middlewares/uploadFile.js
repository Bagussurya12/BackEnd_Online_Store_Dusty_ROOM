import crypto from "crypto";
import multer, { diskStorage } from "multer";

export const TYPE_IMAGE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/pdf": "pdf",
  "image/psd": "psd",
  "image/cdr": "cdr",
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images");
  },
  filename(req, file, cb) {
    const uuid = crypto.randomUUID();
    const ext = TYPE_IMAGE[file.mimetype];
    cb(null, `${uuid}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const acceptMime = Object.keys(TYPE_IMAGE);
  if (!acceptMime.includes(file.mimetype)) {
    cb({ message: "IMAGE_NOT_ACCEPTED" }, false);
  } else {
    cb(null, true);
  }
};
const maxSize = 5 * 1024 * 1024; //1MB

const uploadFile = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).single("image");

export { uploadFile };
