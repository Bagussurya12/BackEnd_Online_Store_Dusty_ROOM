import express from "express";
import dotenv from "dotenv";
import { connection } from "./connection.js";
import { uploadFile } from "./middlewares/uploadFile.js";
// import checkFileType from "./middlewares/checkFileType.js";

import indexRouter from "./routes/index.js";

const env = dotenv.config().parsed;

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(uploadFile);
// app.use(uploadFile, checkFileType);

app.use("/", indexRouter);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json(err);
});

// Connect to Database from MongoDB
connection();

app.listen(env.APP_PORT, () => {
  console.log(`Server Runing On Port ${env.APP_PORT}`);
});
