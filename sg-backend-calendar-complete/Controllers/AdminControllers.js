const Admin = require("../Models/Admin");

// Controller for creating an admin
exports.createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    return res.status(200).send(admin);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller for fetching admin details
exports.getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findOne({ adminId: req.adminId });
    if (!admin) {
      return res.status(404).send({ error: "Admin not found" });
    }
    return res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }
};
