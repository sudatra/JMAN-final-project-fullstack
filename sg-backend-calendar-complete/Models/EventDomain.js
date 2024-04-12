const mongoose = require("mongoose");

const eventDomainSchema = new mongoose.Schema({
  eventId: String,
  domainId: String,
});
