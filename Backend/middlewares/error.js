class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

//when we create errorMiddleWare, we use 4 parameteres
export const errorMiddleWare = (err, req, res, next) => {
  err.message = err.message || "internal server error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CaseError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `JSONwebToken is invalid. Try again`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `JSONwebToken is invalid. Try again`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
