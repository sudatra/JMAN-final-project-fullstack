// const mongoose = require("../index");
const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  isPasswordSet: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  designation: {
    type: String,
    default: "Employee",
  },
});

// userSchema.plugin(autoIncrement.plugin, {
//   model: "User",
//   field: "userId",
//   startAt: 1,
//   incrementBy: 1,
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
