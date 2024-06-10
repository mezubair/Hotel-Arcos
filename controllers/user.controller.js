const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { signToken } = require("./auth.controller");

// const cors = require('cors');
// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
//   credentials: true
// }));

exports.createEmployee = catchAsync(async (req, res, next) => {
  if (req.body.role === "admin") {
    return next(new AppError("You are not supposed to signup as Admin", 400));
  }

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(401).json({
      status: "fail",
      message: "User already exists with this email",
    });
  }


  const newUser = new User({
    ...req.body,
  });

  await newUser.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    message: "User Successfully Registerd ",
  });
});


exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() - 10 * 1000), 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
  res.status(200).json({ status: "success" });
};

