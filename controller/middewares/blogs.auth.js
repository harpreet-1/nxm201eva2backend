const express = require("express");
const userRouter = express.Router();
const blacklistModel = require("../../model/blacklist.model");
const bcrypt = require("bcrypt");
const userModel = require("../../model/userModel");
const blogModel = require("../../model/blogModel");

const jwt = require("jsonwebtoken");

const blogAuthorization = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const isblacklisted = await blacklistModel.findOne({ token: token });

    if (isblacklisted) {
      return res.status(400).send("please login");
    }
    var decoded = jwt.verify(token, process.env.jwt_secret_key);

    console.log(decoded);
    req.decoded = decoded;

    // return res.json("decoded");

    if (
      (req.method == "DELETE" || req.method == "PATCH") &&
      decoded.role == "User"
    ) {
      console.log(decoded);

      const blog = blogModel.findById(req.params.id);

      if (!blog) {
        return res.status(400).send("blog not found");
      }
      if (blog.userId == decoded.userId) {
        next();
      }
    } else if (decoded.role == "moderator") {
      next();
    }
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = blogAuthorization;
