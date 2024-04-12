const Event = require("../Models/Event");
const UserEvent = require("../Models/UserEvent");
const User = require("../Models/User");
const nodemailer = require("nodemailer");
const UserEventInterest = require("../Models/UserEventInterest");
const dotenv = require("dotenv");

dotenv.config();

// Controller for creating an event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(200).send(event);

    const allUsers = await User.find();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    allUsers.map((user) => {
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
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
};

// Controller for fetching all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    return res.status(200).send(events);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller for fetching a particular event by eventId
exports.getEventById = async (req, res) => {
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
};

// Controller for editing an event
exports.editEvent = async (req, res) => {
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    users.forEach((user) => {
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
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
};

// Controller for deleting an event
exports.deleteEvent = async (req, res) => {
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
};

// Controller for getting event interests by eventId
exports.getEventInterests = async (req, res) => {
  const { eventId } = req.params;

  try {
    const allInterests = await UserEventInterest.find({ eventId: eventId });
    return res.status(200).send(allInterests);
  } catch (error) {
    console.error("Error fetching event interests", error);
  }
};
