const UserSkill = require("../Models/UserSkill");

// Controller for adding a skill to a user
exports.addUserSkill = async (req, res) => {
  const { userId } = req.params;
  const { skillId } = req.body;

  try {
    const addedSkill = new UserSkill({
      userId,
      skillId,
    });

    const addedUserSkill = await addedSkill.save();

    return res.status(200).send("Skill added successfully to User: ");
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Controller for deleting a skill from a user
exports.deleteUserSkill = async (req, res) => {
  const { userId } = req.params;
  const { skillId } = req.body;

  try {
    const deletedSkill = await UserSkill.deleteOne({ userId, skillId });

    return res.status(200).send("Skill deleted successfully from User: ");
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Controller for fetching the existing skills of a particular user
exports.getUserSkills = async (req, res) => {
  const { userId } = req.params;

  try {
    const userSkills = await UserSkill.find({ userId: userId });
    return res.status(200).send(userSkills);
  } catch (error) {
    console.error("Error fetching the user's skills", error);
  }
};
