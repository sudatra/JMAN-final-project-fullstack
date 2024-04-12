const User = require("../Models/User");
const UserEventInterest = require("../Models/UserEventInterest");

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Controller for adding user's interest in an event
exports.addUserEventInterest = async (req, res) => {
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
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
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
};

// Controller for fetching user's event interests
exports.getUserEventInterests = async (req, res) => {
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
};

// Controller for sending mail to interested users after event registration full
exports.sendRegistrationFullMail = async (req, res) => {
  const { eventId } = req.body;
  // console.log(eventId);

  try {
    const users = await UserEventInterest.find({ eventId: eventId });
    // console.log(users);

    if (!users) {
      return res.status(400).send("Error: Users not found");
    }

    const userIds = users.map((user) => user.userId);
    const userdetails = await User.find({ _id: { $in: userIds } });

    console.log(userdetails);
    const emailIds = userdetails.map((user) => user.email);
    console.log(emailIds);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    emailIds.forEach((email) => {
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "Event Updates!!!!",
        text: `\n\nEvent ${eventId} has been fully registered!!.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent-----------------: ");
        }
      });
    });

    res
      .status(200)
      .send("Event registered successfully and max capacity reached");
  } catch (error) {
    return res.status(500).send("Error sending mail to interested users");
  }
};
