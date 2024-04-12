const mongoose = require("mongoose");

const userSkillSchema = new mongoose.Schema({
  userId: String,
  skillId: String,
});

userSkillSchema.pre("validate", async function (next) {
  try {
    const existingEvent = await this.model("UserSkill").findOne({
      userId: this.userId,
      skillId: this.skillId,
    });
    if (existingEvent) {
      // If an event with the same name exists, throw an error
      throw new Error("Event with the same name already exists");
    }
    next();
  } catch (error) {
    next(error);
  }
});
const UserSkill = mongoose.model("UserSkill", userSkillSchema);
module.exports = UserSkill;
