const express = require("express");
const userRouter = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const userModel = require("../../model/userModel");
const blogModel = require("../../model/blogModel");
const blacklistModel = require("../../model/blacklist.model");

const authorization = require("../middewares/authorization");

const jwt = require("jsonwebtoken");
// -----------------------------------register----------------------------------------------------------

userRouter.post("/register", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    const hash = bcrypt.hashSync(req.body.password, 4);

    req.body.password = hash;

    await userModel.create(req.body);

    return res.status(200).json({ message: "user registered" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// -----------------------------------login----------------------------------------------------------

userRouter.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.jwt_secret_key
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.jwt_secret_key
    );
    res.json({ message: "login successfull", accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// -----------------------------------delete user----------------------------------------------------------

userRouter.delete("/delete/:id", authorization, async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// -----------------------------------update user----------------------------------------------------------

userRouter.patch("/update/:id", authorization, async (req, res) => {
  try {
    if (req.body.password) {
      const hash = bcrypt.hashSync(req.body.password, 4);
      req.body.password = hash;
    }
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "user updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// -----------------------------------logout----------------------------------------------------------

userRouter.post("/logout", async (req, res) => {
  try {
    const token = req.body.accessToken;
    const refreshToken = req.body.refreshToken;

    await blacklistModel.create({ token: token });
    await blacklistModel.create({ token: refreshToken });
    res.json({ message: "logut sccessful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// -----------------------------------refreshToken----------------------------------------------------------

userRouter.get("/refreshtoken", authorization, async (req, res) => {
  try {
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.jwt_secret_key,
      { expiresIn: "1m" }
    );

    res.json({ message: "token refresh successfull", accessToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
