const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const AppError = require("./utils/appError");
const connectDB = require("./database")
const userRouter = require("./routes/user.routes")
const permissionRoutes = require("./routes/permission.routes")
const customerRoutes = require("./routes/customer.routes")
const globalErrorHandler = require("./controllers/error.controller");
const cors = require("cors")
require("./controllers/seeding")



connectDB();
const app = express();
app.use(cors());

// Middlewares
app.use(express.json());
app.use("/api/v1/", userRouter);
app.use('/api/v1/', permissionRoutes);
app.use('/api/v1/', customerRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
