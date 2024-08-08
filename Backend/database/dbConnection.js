import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "HRmanagement",
    })
    .then(() => {
      console.log("connected to database!");
    })
    .catch((err) => {
      console.log(`error occured while connecting to database : ${err}`);
    });
};
