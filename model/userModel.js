const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  role: { type: String, default: "User", enum: ["User", "moderator "] },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
