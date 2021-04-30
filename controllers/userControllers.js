const mongoose = require("mongoose");
const generateToken = require("../utils/generateToken");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const crypto = require("crypto");
require("dotenv").config();
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
//
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  })
);
//
const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password)
      return res.status(404).json({ error: "Please fill in all the fields." });

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(404)
        .json({ error: "User exists please login to continue." });
    }
    const user = await User.create({ name, email, password, pic });
    await user.save();

    res.json({ message: "Registered successfully!!!" });
  } catch (error) {
    message = error.message;
    res.status(400).json({ error: message });
  }
};
//
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res.status(404).json({ error: "Please fill in all the fields." });
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      const { _id, name, image, followers, following, pic } = user;

      res.json({
        token,
        userDetails: { _id, name, image, followers, following, pic },
      });
    } else {
      res.status(404).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    message = error.message;
    res.status(400).json({ error: message });
  }
};
//
const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (user) {
      const posts = await Post.find({ postedBy: req.params.id }).populate(
        "postedBy",
        "_id name"
      );
      res.json({ user, posts });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
};
//
const follow = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      }
    );
    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      { new: true }
    ).select("-password");

    res.json(result);
  } catch (error) {
    return res.status(422).json({ error });
  }
};
//
const unfollow = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    );
    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      { new: true }
    ).select("-password");

    res.json(result);
  } catch (error) {
    return res.status(422).json({ error });
  }
};
const updatepic = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { pic: req.body.pic } },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    res.status(422).json({ error });
  }
};
//
const resetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User dont exists with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        const resetUrl = `${process.env.MAILING_SITE}resetpassword/${token}`;
        const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
        transporter.sendMail({
          to: user.email,
          from: "pcpranavchandra@gmail.com",
          subject: "password reset",
          html: message,
        });
        res.json({ message: "check your email" });
      });
    });
  });
};
//
const newPassword = async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  try {
    const user = await User.findOne({
      resetToken: sentToken,
      expireToken: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(422).json({ error: "session expired" });
    }
    user.password = newPassword;
    user.resetToken = undefined;
    user.expireToken = undefined;

    await user.save();
    res.json({ message: "passwordchanged successfully!" });
  } catch (error) {
    res.json({ error });
  }
};
//
module.exports = {
  registerUser,
  loginUser,
  getUser,
  follow,
  unfollow,
  updatepic,
  resetPassword,
  newPassword,
};
