const mongoose = require("mongoose");
const blogSchema = mongoose.Schema({
  userId: { type: String, require: true },
  content: { type: String, require: true },
});

const blogModel = mongoose.model("blog", blogSchema);

module.exports = blogModel;
