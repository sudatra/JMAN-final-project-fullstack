const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({
  domainId: {
    type: Number,
    autoIncrement: true,
  },
  name: String,
  description: String,
});

const Domain = mongoose.model("Domain", domainSchema);
module.exports = Domain;
