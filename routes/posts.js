var express = require("express");
var router = express.Router();
const Post = require("../schemas/Post");

//Retrieve posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Retrieve post by postId
router.get("/get-post/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    res.send(post);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Create post
router.put("/create-post", async (req, res, next) => {
  const post = new Post({
    departingTime: req.body.departingTime,
    departingLocation: req.body.departingLocation,
    arrivingLocation: req.body.arrivingLocation,
    driverId: req.body.driverId,
    numAvailableSeats: req.body.numAvailableSeats,
  });
  try {
    await post.save();
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Edit post
router.post("/edit-post", async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const update = req.body.update;
    await Post.findByIdAndUpdate(postId, { $set: { ...update } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete("/delete-post", async (req, res, next) => {
  try {
    const postId = req.body.postId;
    await Post.findByIdAndDelete(postId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
