const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controller/auth/authController");

const router = require("express").Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/forgotpassword").post(forgotPassword)
router.route("/resetpassword").post(resetPassword)

module.exports = router;
