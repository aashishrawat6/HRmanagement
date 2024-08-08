import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import { Job } from "../models/jobSchema.js";

// post application
export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume file required!",400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler(
        "Invalid file type, Please upload in PNG, JPEG, WEBP!",
        400
      )
    );
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error : ",
      cloudinaryResponse.error || "Unknown cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload resume.", 500));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantId = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  //
  const jobDetails=await Job.findById(jobId);
  if(!jobDetails){
    return next(new ErrorHandler("Job not found!", 404));
  }
  //
  const employerId = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantId ||
    !employerId ||
    !resume
  ) {
    return next(new ErrorHandler("Please fill all the field.", 400));
  }

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantId,
    employerId,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Application submitted!",
    application,
  });
});
 
// employer will get the list of applicant's applications

export const employerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler(
          "Job seeker is not allowed to access this resources!",
          400
        )
      );
    }

    const { _id } = req.user;
    const applications = await Application.find({ "employerId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

// jobseeker can see all its applications
export const jobseekerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer is not allowed to access this resources!",
          400
        )
      );  
    }

    const { _id } = req.params;
    const applications = await Application.find({ "applicationId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

//deleting the job application
export const jobseekerDeleteApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer is not allowed to access this resources!",
          400
        )
      );
    }

    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Oops, application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "application deleted successfully!",
    });
  }
);

