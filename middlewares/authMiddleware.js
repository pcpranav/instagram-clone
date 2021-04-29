const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
//
module.exports = async (req, res, next) => {
  let token;
  try {
    const { authorization } = req.headers;
    if (authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
      } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Not authorized" });
      }
    } else {
      return res.status(401).json({ error: "login to continue" });
    }
  } catch (error) {
    message = error.message;
    res.status(400).json({ error: message });
  }
};
