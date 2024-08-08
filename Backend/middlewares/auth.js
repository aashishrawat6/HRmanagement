import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies; //will get token from cookie

  if (!token) {
    return next(new ErrorHandler("user not authorized", 400));
  }

  //decoding the token to save the user
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
  
});
