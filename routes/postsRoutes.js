const express = require("express");
const router = express.Router();
const {
  createPost,
  allPosts,
  myPosts,
  like,
  unlike,
  deletePost,
  subscribedPosts,
} = require("../controllers/postsControllers");
const protect = require("../middlewares/authMiddleware");
router.route("/api/createpost").post(protect, createPost);
router.route("/api/allposts").get(protect, allPosts);
router.route("/api/myposts").get(protect, myPosts);
router.route("/api/like").put(protect, like);
router.route("/api/unlike").put(protect, unlike);
router.route("/api/deletepost/:postId").delete(protect, deletePost);
router.route("/api/subscribedposts").get(protect, subscribedPosts);
module.exports = router;
