const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generateRandomPassword } = require("../utils/utils");
const Admin = require("../Models/Admin");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Controller for creating a user
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const password = generateRandomPassword(10);

    const userPresent = await User.findOne({ email: email });
    if (userPresent) {
      return res.status(400).send("User Already exists!!");
    }

    const user = await User.create({ name, email, password });

    const token = crypto.randomBytes(20).toString("hex");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000, // Token expires in 1 hour (3600000 milliseconds)
          },
        }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const mailOptions = {
        from: process.env.ADMIN_EMAIL, // Enter your email
        to: email,
        subject: "Reset Your Password",
        text: `Click the following link to reset your password: http://localhost:3001/reset-password/${token}`,
      };

      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to send email from backend" });
    }

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller for fetching user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Controller for fetching all users
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    return res.status(200).send(allUsers);
  } catch (error) {
    console.error("Error fetching all users: ", error);
  }
};

// Controller for fetching a particular user by userId
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Controller for resetting user password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.isPasswordSet = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ message: "Password updated Successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update password" });
  }
};

// Controller for user login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // First, try to find the user
  let foundUser = await User.findOne({ email: email });
  let isUser = true;

  // If not found as a user, try finding as an admin
  if (!foundUser) {
    foundUser = await Admin.findOne({ email: email });
    isUser = false;
  }

  // If no record is found in both collections
  if (!foundUser) {
    return res.status(401).json({ error: "No user found with this email." });
  }

  // Check password (PLAIN TEXT - Not recommended)
  if (foundUser.password !== password) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  // Generate token assuming use of JWT
  const token = jwt.sign(
    {
      userId: foundUser._id,
      userType: isUser ? "user" : "admin",
    },
    isUser ? process.env.USER_JWT : process.env.ADMIN_JWT,
    { expiresIn: "1h" }
  );

  return res.json({
    message: "Logged in successfully",
    token,
    userType: isUser ? "user" : "admin",
  });
};
