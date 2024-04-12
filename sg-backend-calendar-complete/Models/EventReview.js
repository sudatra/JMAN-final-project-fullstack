const mongoose = require("mongoose");

const eventReviewSchema = new mongoose.Schema({
  eventId: String,
  reviewCount: Number,
  suggestion: String,
});
