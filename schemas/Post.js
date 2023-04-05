const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  departingTime: { type: Date, required: true, expires: 60 },
  departingLocation: [{ type: String }],
  arrivingLocation: [{ type: String }],
  driverId: { type: Number, required: true },
  passengers: [{ type: Number }],
  numAvailableSeats: { type: Number, required: true },
});

module.exports = mongoose.model("Post", PostSchema);
