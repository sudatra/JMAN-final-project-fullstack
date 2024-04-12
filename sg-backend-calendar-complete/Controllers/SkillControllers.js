const Skill = require("../Models/Skill");

// Controller for adding a skill
exports.addSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    return res.status(200).send(skill);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller for fetching all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    return res.status(200).send(skills);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Controller for deleting a skill
exports.deleteSkill = async (req, res) => {
  const { skillId } = req.params;

  try {
    const deletedSkill = await Skill.findByIdAndDelete(skillId);
    return res.status(200).send(deletedSkill);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Controller for fetching a particular skill by skillId
exports.getSkillById = async (req, res) => {
  const { skillId } = req.params;
  try {
    const skill = await Skill.findById(skillId);
    return res.status(200).send(skill);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};
