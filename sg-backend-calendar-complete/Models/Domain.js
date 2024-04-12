// const mongoose = require("../index");
const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

const domainSchema = new mongoose.Schema({
  domainId: {
    type: Number,
    autoIncrement: true,
  },
  name: String,
  description: String,
});

// domainSchema.plugin(autoIncrement.plugin, {
//   model: "Domain",
//   field: "domainId",
//   startAt: 1,
//   incrementBy: 1,
// });

const Domain = mongoose.model("Domain", domainSchema);
module.exports = Domain;
