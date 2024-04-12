const Event = require("../Models/Event");
const User = require("../Models/User");
const UserEvent = require("../Models/UserEvent");
const nodemailer = require("nodemailer");
const UserEventInterest = require("../Models/UserEventInterest");
const dotenv = require("dotenv");

dotenv.config();

// Controller for adding an event to a user
exports.addUserEvent = async (req, res) => {
  const { userId } = req.params;
  const { eventId } = req.body;

  try {
    const existingUserEvent = await UserEventInterest.findOne({
      userId,
      eventId,
    });
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
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
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
};

// Controller for fetching user's registered events
exports.getUserEvents = async (req, res) => {
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
};
