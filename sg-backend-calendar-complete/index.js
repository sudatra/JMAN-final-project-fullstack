const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { generateRandomPassword } = require("./utils/utils.js");

const Admin = require("./Models/Admin");
const User = require("./Models/User");
const Event = require("./Models/Event");
const Skill = require("./Models/Skill");
const UserSkill = require("./Models/UserSkill");
const UserEvent = require("./Models/UserEvent");
const UserEventInterest = require("./Models/UserEventInterest.js");

const app = express();

// middleware setup

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const withAuthUser = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, "MY_USER_KEY", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
};

const withAuthAdmin = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, "MY_ADMIN_KEY", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      req.adminId = decoded.adminId;
      next();
    }
  });
};

// mongoose
//   .connect(
//     "mongodb+srv://shreeOm:360HpJ3FIxYUZxNf@myjmancluster.wjrwitu.mongodb.net/"
//   )
//   .then(() => {
//     console.log("MongoDB Connected");
//     // autoIncrement.initialize(mongoose.connection);
//   })
//   .catch((error) => console.log(error));
mongoose
  .connect("mongodb+srv://mail2sudatra:jman600113@cluster0.ut5ms.mongodb.net/")
  .then(() => {
    console.log("MongoDB Connected");
    // autoIncrement.initialize(mongoose.connection);
  })
  .catch((error) => console.log(error));

// const transporter = nodemailer.createTransport({
//   port: 465,
//   host: "smtp.gmail.com",
//   auth: {
//     user: "omshree.osj18705@gmail.com",
//     pass: "xjku culd uhsc vmmr",
//   },
//   secure: true,
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sudatraghosh@gmail.com",
    pass: "ijfc gtvu kpkv hqdu",
  },
});

// Route for creating an admin
app.post("/admin", async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    return res.status(200).send(admin);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Route for creating an user
app.post("/user", async (req, res) => {
  try {
    const { name, email } = req.body;
    const password = generateRandomPassword(10);

    const userPresent = await User.findOne({ email: email });
    if (userPresent) {
      return res.status(400).send("User Already exists!!");
    }

    const user = await User.create({ name, email, password });

    const token = crypto.randomBytes(20).toString("hex");

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
        from: "sudatraghosh@gmail.com", // Enter your email
        to: email,
        subject: "Reset Your Password",
        text: `Here is your default password: ${password}. Click the following link to reset your password: http://localhost:3001/reset-password/${token}`,
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
});

// Route for updating the user's password
app.post("/reset-password/:token", async (req, res) => {
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
});

// Login
app.post("/login", async (req, res) => {
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
    isUser ? "MY_USER_KEY" : "MY_ADMIN_KEY",
    { expiresIn: "1h" }
  );

  return res.json({
    message: "Logged in successfully",
    token,
    userType: isUser ? "user" : "admin",
  });
});

// Route to fetch admin-details
app.get("/admin-details", withAuthAdmin, async (req, res) => {
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
});

// Route to fetch user-details
app.get("/user-details", withAuthUser, async (req, res) => {
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
});

// Route to fetch all users
app.get("/fetch-all-users", async (req, res) => {
  try {
    const allUsers = await User.find();
    return res.status(200).send(allUsers);
  } catch (error) {
    console.error("Error fetching all users: ", error);
  }
});

// Route to fetch an user given his userId
app.get("/fetch-user-detail/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    return res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching a particular user", error);
  }
});

// Route to create a new event
app.post("/create-event", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(200).send(event);

    const allUsers = await User.find();

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "sudatraghosh@gmail.com",
    //     pass: "ijfc gtvu kpkv hqdu",
    //   },
    // });

    allUsers.map((user) => {
      const mailOptions = {
        from: "omshree.osj18705@gmail.com",
        to: user.email,
        subject: "New Event Arrived!!!!",
        text: `Hello ${user.name},\n\nAn Event is created just for you!! ${event._id}.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ");
        }
      });
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Route to fetch all events
app.get("/fetch-events", async (req, res) => {
  try {
    const events = await Event.find();
    return res.status(200).send(events);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Route to edit an event
app.post("/edit-event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const dataToUpdate = req.body;

  try {
    const response = await Event.findByIdAndUpdate(eventId, dataToUpdate, {
      new: true,
    });

    if (!response) {
      return res.status(404).send({ error: "Event not found" });
    }

    const allRegisteredUsers = await UserEvent.find({ eventId: eventId });
    const userIds = allRegisteredUsers.map((user) => user.userId);

    const users = await User.find({ _id: { $in: userIds } });
    const emailIds = users.map((user) => user.email);

    console.log(emailIds);

    users.forEach((user) => {
      const mailOptions = {
        from: "sudatraghosh@gmail.com",
        to: user.email,
        subject: "Event Updates!!!!",
        text: `Hello ${user.name},\n\nEvent ${eventId} has been edited!!.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ");
        }
      });
    });

    return res.send(response);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});

// Route to delete an event
app.delete("/delete-event/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const response = await Event.findByIdAndDelete(eventId);

    if (!response) {
      return res.status(404).send({ error: "Event not found" });
    }

    return res.send(response);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});

// Route to fetch a particular event
app.get("/fetch-event/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const response = await Event.findById(eventId);

    if (!response) {
      return res.status(404).send({ error: "Event not found" });
    }

    return res.send(response);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});

// Route to add skills
app.post("/add-skill", async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    return res.status(200).send(skill);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Route to fetch all skills
app.get("/fetch-skills", async (req, res) => {
  try {
    const skills = await Skill.find();
    return res.status(200).send(skills);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});

// Route to delete a skill
app.delete("/delete-skill/:skillId", async (req, res) => {
  const { skillId } = req.params;

  try {
    const deletedSkill = await Skill.findByIdAndDelete(skillId);
    return res.status(200).send(deletedSkill);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});

// Route to add a skill to an user
app.post("/user-skill-add/:userId", async (req, res) => {
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
});

// Route to delete a skill from an user
app.delete("/user-skill-delete/:userId", async (req, res) => {
  const { userId } = req.params;
  const { skillId } = req.body;

  try {
    const deletedSkill = await UserSkill.deleteOne({ userId, skillId });

    return res.status(200).send("Skill deleted successfully from User: ");
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});

// Route to fetch the existing skills of a particular user
app.get("/user-skill-fetch/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userSkills = await UserSkill.find({ userId: userId });
    return res.status(200).send(userSkills);
  } catch (error) {
    console.error("Error fetching the user's skills", error);
  }
});

// Route to fetch a particular skill by the skill id
app.get("/particular-skill-fetch/:skillId", async (req, res) => {
  const { skillId } = req.params;

  try {
    const skill = await Skill.findById(skillId);
    return res.status(200).send(skill);
  } catch (error) {
    console.error("Unable to fetch the particular skill", error);
  }
});

// Route to add an event to an user along with sending email notification
app.post("/user-event-add/:userId", async (req, res) => {
  const { userId } = req.params;
  const { eventId } = req.body;

  try {
    const existingUserEvent = await UserEvent.findOne({ userId, eventId });
    if (existingUserEvent) {
      return res.status(400).send("Event is already registered for this user.");
    }

    const addedEvent = new UserEvent({
      userId,
      eventId,
    });

    const addedUserEvent = await addedEvent.save();

    const UserDetail = await User.findById(userId);

    const IncrementRegistered = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { registered: 1 } },
      { new: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sudatraghosh@gmail.com",
        pass: "ijfc gtvu kpkv hqdu",
      },
    });

    const mailOptions = {
      from: "sudatraghosh@gmail.com",
      to: UserDetail.email,
      subject: "Event Registration Notification",
      text: `Hello ${UserDetail.name},\n\nYou have successfully registered for the event ${eventId}.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ");
      }
    });

    return res.status(200).send("Event added successfully to User: ");
  } catch (error) {
    console.error("Error adding event to user: ", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

// Route to fetch user's registered events
app.get("/user-event-fetch/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const registeredEvents = await UserEvent.find({ userId: userId });

    if (!registeredEvents) {
      return res.status(404).send({ error: "Events not found" });
    }

    // res.send(registeredEvents);
    return res.status(200).send(registeredEvents);
  } catch (error) {
    console.error("Error Fetching registered events: ", error);
  }
});

// Route to send an email to the admin (self-email) to show that a particular user has shown interest in a event
app.post("/user-event-interest/:userId", async (req, res) => {
  const { userId } = req.params;
  const { eventId } = req.body;

  try {
    const existingUserEventInterest = await UserEventInterest.findOne({
      userId,
      eventId,
    });
    if (existingUserEventInterest) {
      console.log("User has already shown interest in this event.");
      return res.status(400).send("Event is already in user's interest.");
    }

    const addedEventInterest = new UserEventInterest({
      userId,
      eventId,
    });

    const addedUserEventInterest = await addedEventInterest.save();

    const UserDetail = await User.findById(userId);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sudatraghosh@gmail.com",
        pass: "ijfc gtvu kpkv hqdu",
      },
    });

    const mailOptions = {
      from: "sudatraghosh@gmail.com",
      to: "sudatraghosh@gmail.com",
      subject: "Event Interest Notification",
      text: `Hello Admin,\n\n${UserDetail._id} has shown interest for the event ${eventId}.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ");
      }
    });

    return res.status(200).send("Event added successfully to User: ");
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});

// Route to get all the users interested in an event to be checked by the admin
app.get("/event-interests/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const allInterests = await UserEventInterest.find({ eventId: eventId });
    return res.status(200).send(allInterests);
  } catch (error) {
    console.error("Error fetching event interests", error);
  }
});

// Route to fetch user's interested events
app.get("/user-event-interest-fetch/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const interestedEvents = await UserEventInterest.find({ userId: userId });

    if (!interestedEvents) {
      return res.status(404).send({ error: "Events not found" });
    }

    return res.status(200).send(interestedEvents);
  } catch (error) {
    console.error("Error Fetching interested events: ", error);
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
