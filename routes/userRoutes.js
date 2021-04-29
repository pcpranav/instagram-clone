const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  getUser,
  follow,
  unfollow,
  updatepic,
  resetPassword,
  newPassword,
} = require("../controllers/userControllers");
const protect = require("../middlewares/authMiddleware");

router.route("/api/signup").post(registerUser);
router.route("/api/login").post(loginUser);
router.route("/api/user/:id").get(protect, getUser);
router.route("/api/follow").put(protect, follow);
router.route("/api/unfollow").put(protect, unfollow);
router.route("/api/updatepic").put(protect, updatepic);
router.route("/api/resetpassword").post(resetPassword);
router.route("/api/newpassword").post(newPassword);
module.exports = router;
