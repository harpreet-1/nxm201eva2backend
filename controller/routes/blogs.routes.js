const express = require("express");
const blogRouter = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const blogModel = require("../../model/blogModel");
// const blogModel = require("../../model/blogModel");
const blacklistModel = require("../../model/blacklist.model");

const blogAuthorization = require("../middewares/blogs.auth");

const jwt = require("jsonwebtoken");
// -----------------------------------register----------------------------------------------------------
blogRouter.use(blogAuthorization);
blogRouter.post("/create", async (req, res) => {
  try {
    req.body.userId = req.decoded.userId;
    const blog = await blogModel.create(req.body);

    return res.status(200).json({ message: "blog created", blog: blog });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await blogModel.find();
    res.json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// -----------------------------------delete blog----------------------------------------------------------

blogRouter.delete("/delete/:id", blogAuthorization, async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "blog deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

blogRouter.patch("/update/:id", blogAuthorization, async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "blog updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = blogRouter;
