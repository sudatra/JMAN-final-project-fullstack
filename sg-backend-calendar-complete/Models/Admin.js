const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminId: Number,
  name: String,
  password: String,
  email: String,
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
