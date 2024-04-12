// const mongoose = require("../index");
const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

const skillSchema = new mongoose.Schema({
  name: String,
  category: String,
});

// skillSchema.plugin(autoIncrement.plugin, {
//   model: "Skill",
//   field: "skillId",
//   startAt: 1,
//   incrementBy: 1,
// });

const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;
