import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import { config } from "dotenv";

import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";

import {dbConnection}  from "./database/dbConnection.js";
import { errorMiddleWare } from "./middlewares/error.js";

// made connection from env file
const app = express();
config({ path: "./config/config.env" });

// dotenv.config({ path: "./config/config.env" });

//we use 'app.use' when we make a middleware
app.use(
  cors({
    //connection of frontend to backend
    // origin: [process.env.FRONTEND_URL], //using array in case we connect multiple frontend to the backend
    origin: [process.env.FRONTEND_URL], //using array in case we connect multiple frontend to the backend
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser()); //use for authorization of the user through cookie.
app.use(express.json()); //only parse the json data and neglect the rest.
app.use(express.urlencoded({ extended: true })); //converts string to json format.
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
); //use for uploading file, can also use 'multer'.

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

dbConnection();

app.use(errorMiddleWare);

export default app;
