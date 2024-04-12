// const mongoose = require("../index");
const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

const eventSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    date: String,
    startTime: String,
    endTime: String,
    location: String,
    trainer: String,
    imgUrl: String,
    capacity: Number,
    registered: {
      type: Number,
      default: 0,
    },
    resourceLink: String,
    domain: String,
  },
  { timestamps: true }
);

eventSchema.pre("validate", async function (next) {
  try {
    const existingEvent = await this.model("Event").findOne({
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      location: this.location,
      trainer: this.trainer,
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

// eventSchema.plugin(autoIncrement.plugin, {
//   model: "Event",
//   field: "eventId",
//   startAt: 1,
//   incrementBy: 1,
// });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
