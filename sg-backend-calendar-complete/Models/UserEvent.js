const mongoose = require("mongoose");

const userEventSchema = new mongoose.Schema({
  userId: String,
  eventId: String,
  status: String,
});

const UserEvent = mongoose.model("UserEvent", userEventSchema);
module.exports = UserEvent;
