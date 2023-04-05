const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  displayName: { type: String, required: true },
  studentId: { type: Number, required: true },
  email: { type: String, required: true },
  emailVerified: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  numRidesCompleted: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  gender: {
    type: String,
    enum: {
      values: ["Male", "Female", "Non-Binary"],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
  preferences: {
    gender: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    numRidesCompleted: { type: Number, default: 0 },
  },

  rideRequests: [
    {
      postId: { type: ObjectId },
      userId: { type: ObjectId },
      accepted: { type: Boolean, default: false },
    },
  ],

  reviews: [
    {
      reviewerEmail: { type: String, required: true },
      role: {
        type: String,
        enum: {
          values: ["Driver", "Passenger"],
          message: "{VALUE} is not supported",
        },
        required: true,
      },
      rating: { type: Number, min: 0, max: 5, required: true},
      text: { type: String },
      _id: { type: ObjectId },
    },
  ],

});

module.exports = mongoose.model("User", UserSchema);
