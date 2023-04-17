const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const userRouter = require("./controller/routes/user.routes");
const blogRouter = require("./controller/routes/blogs.routes");

app.use("/users", userRouter);
app.use("/blogs", blogRouter);
app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(process.env.mongoDB_URL);
    console.log("connected");
  } catch (error) {
    console.log(" not connected", error);
  }
  console.log("server running");
});
