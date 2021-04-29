const mongoose = require("mongoose");
const Post = mongoose.model("Post");
//
const createPost = async (req, res) => {
  try {
    const { title, body, imageUrl } = req.body;
    if (!title || !body || !imageUrl)
      return res.status(404).json({ error: "Please fill in all details." });

    const post = await Post.create({
      title,
      body,
      image: imageUrl,
      postedBy: req.user,
    });
    await post.save();
    res.json({ message: "new post created succcessfully!!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//
const allPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("postedBy", "_id name")
      .sort("-createdAt");
    res.status(200).json({ posts });
  } catch (error) {
    message = error.message;
    res.status(404).json({ error: message });
  }
};
//
const myPosts = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );
    res.status(200).json({ posts });
  } catch (error) {
    message = error.message;
    res.status(400).json({ error: message });
  }
};
//
const like = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    res.json(result);
  } catch (error) {
    return res.status(422).json({ error });
  }
};
//
const unlike = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    res.json(result);
  } catch (error) {
    return res.status(422).json({ error });
  }
};
//
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate(
      "postedBy",
      "_id"
    );
    if (post.postedBy._id.toString() === req.user._id.toString()) {
      await post.remove();
      res.json({ message: "Deleted successfully." });
    }
  } catch (error) {
    console.log(error);
  }
};
//
const subscribedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      postedBy: { $in: req.user.following },
    })
      .populate("postedBy", "_id name")
      .sort("-createdAt");
    res.status(200).json({ posts });
  } catch (error) {
    message = error.message;
    res.status(400).json({ error: message });
  }
};
module.exports = {
  createPost,
  allPosts,
  myPosts,
  like,
  unlike,
  deletePost,
  subscribedPosts,
};
