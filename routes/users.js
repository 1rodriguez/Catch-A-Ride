var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
const User = require("../schemas/User");
const Post = require("../schemas/Post");

//Get user by email
router.get("/get-user-by-email/:email", async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.sendStatus(404);
    } else {
      res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Get user by mongoId
router.get("/get-user-by-id/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Get user by studentId
router.get("/get-user-by-student-id/:id", async (req, res, next) => {
  const studentId = req.params.id;
  try {
    const user = await User.findOne({ studentId: studentId });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Create user
router.put("/create-user", async (req, res, next) => {
  try {
    const user = req.body.user;
    await User.create(user);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Update user
router.post("/update-user", async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const update = req.body.update;
    await User.findByIdAndUpdate(userId, { $set: { ...update } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Update preferences for user
router.post("/update-preferences", async (req, res, next) => {
  try {
    const update = {
      preferences: req.body.preferences,
    };
    const userId = req.body.userId;
    await User.findByIdAndUpdate(userId, update);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Send ride request to join ride
router.post("/send-ride-request", async (req, res, next) => {
  const driverId = req.body.driverId;
  const userId = req.body.userId;
  const postId = req.body.postId;
  try {
    const request = { postId: postId, userId: userId };
    await User.findOneAndUpdate(
      { studentId: driverId },
      {
        $push: { rideRequests: request },
      }
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Accept ride request
router.post("/accept-ride-request", async (req, res, next) => {
  const studentId = req.body.studentId;
  const postId = req.body.postId;
  const userId = req.body.userId;
  try {
    // Get ride requests for driver with respective studentId
    const { rideRequests } = await User.findOne({ studentId: studentId });
    const { passengers } = await Post.findById(postId);
    // Get rider information
    const rider = await User.findById(userId);
    const updatedPassengers = passengers;
    const updatedRideRequests = rideRequests;
    //Add rider to the post
    updatedPassengers.push(rider.studentId);
    updatedRideRequests.forEach((rideRequest) => {
      if (
        rideRequest.postId.toString() === postId &&
        rideRequest.userId.toString() === userId
      ) {
        rideRequest.accepted = true;
      }
    });
    await User.findOneAndUpdate(
      { studentId: studentId },
      { $set: { rideRequests: [...updatedRideRequests] } }
    );
    await Post.findByIdAndUpdate(postId, {
      $set: {
        passengers: [...updatedPassengers],
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Delete ride request
router.delete("/delete-ride-request", async (req, res, next) => {
  const studentId = req.body.studentId;
  const postId = req.body.postId;
  const userId = req.body.userId;
  try {
    const { rideRequests } = await User.findOne({ studentId: studentId });
    const updatedRideRequests = rideRequests.filter(
      (rideRequest) =>
        rideRequest.userId.toString() !== userId ||
        rideRequest.postId.toString() !== postId
    );
    await User.findOneAndUpdate(
      { studentId: studentId },
      { $set: { rideRequests: [...updatedRideRequests] } }
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Ban user
router.post("/ban-user", async (req, res, next) => {
  const email = req.body.email;
  try {
    await User.findOneAndUpdate({ email: email }, { banned: true });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Unban user
router.post("/unban-user", async (req, res, next) => {
  const email = req.body.email;
  try {
    await User.findOneAndUpdate({ email: email }, { banned: false });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Return ban status
router.get("/check-ban-status/:email", async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.send({ banned: user.banned });
    } else {
      res.send({ banned: false });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// post a review
router.post("/post-review", async (req, res, next) => {
  const email = req.body.email;
  const reviewerEmail = req.body.reviewerEmail;
  const role = req.body.role;
  const rating = req.body.rating;
  const text = req.body.text;
  const id = new mongoose.Types.ObjectId();
  try {
    const review = {
      reviewerEmail: reviewerEmail,
      role: role,
      rating: rating,
      text: text,
      _id: id,
    };
    await User.findOneAndUpdate(
      { email: email },
      { $push: { reviews: review } }
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// delete a review
router.delete("/delete-review", async (req, res, next) => {
  const email = req.body.email;
  const id = req.body.id;
  try {
    const { reviews } = await User.findOne({ email: email });
    const updatedReviews = reviews.filter(
      (review) => review._id.toString() !== id
    );
    await User.findOneAndUpdate(
      { email: email },
      { $set: { reviews: updatedReviews } }
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Get ride history of user
router.get("/get-ride-history/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    const studentId = user.studentId;
    const rides = await Post.find({
      $or: [{ driverId: studentId }, { passengers: studentId }],
    });
    res.send(rides);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
