const mongoose = require("mongoose");

const userEventInterestSchema = new mongoose.Schema({
  userId: String,
  eventId: String,
});

const UserEventInterest = mongoose.model(
  "UserEventInterest",
  userEventInterestSchema
);
module.exports = UserEventInterest;
