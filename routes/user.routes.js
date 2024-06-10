const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

router.get("/test", userController.test);
router.post("/create-employee", authController.protect,authController.checkAdmin, userController.createEmployee);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logout);

module.exports = router;
