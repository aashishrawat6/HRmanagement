// it is made to catch unknown async error that we don't know

// this will take usercontroller as parameter
export const catchAsyncError = (theFunction) => {
  return (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};
