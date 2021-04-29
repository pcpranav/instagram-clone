const express = require("express");
require("dotenv").config();
const connectDb = require("./config/db");
const app = express();

const port = process.env.PORT || 5000;

connectDb();

require("./models/userModel");
require("./models/postsModel");

app.use(express.json());

app.use(require("./routes/userRoutes"));
app.use(require("./routes/postsRoutes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`server is running on Port ${port}`);
});
