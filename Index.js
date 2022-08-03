const express = require("express");
const app = express();
const router = express.Router();
const Feedback = require("./Models/Feedback.js");


app.use(express.static(__dirname + "/public"));
var cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const mongURI = process.env.MongoURI;
const connectToMongo = () => {
  mongoose
    .connect(mongURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
};
connectToMongo();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
// available routes
// ROUTE 1: get all the feedbacks using:get "/api/feedbacks/getuser"
router.get("/fetch_feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("some error ocured");
  }
});

async function findUserByEmail(email) {
  try {
    return Feedback.findOne({ email: email.toLowerCase() });
  } catch (error) {
    throw new Error(`Unable to connect to the database.`);
  }
}
router.post("/post-feedback", async (req, res) => {
  try {
    const feedData = new Feedback({
      name: req.body.name,
      email: req.body.email,
      feed: req.body.feedback,
    });
    const userWithEmail = await findUserByEmail(feedData.email);
    if (userWithEmail) {
      return response.status(409).send({ message: "Email is already taken." });
    }
    feedData.save().then((data) => {
      res.status(200).json({ sucess: "sucess" });
      // 			res.render('FeedbackForm',
      // { msg: "Your feedback successfully saved." });
    });
  } catch (error) {
    res.status(400).json();
    // res.render('FeedbackForm',
    // 	{ msg: "Check Details." });
  }
});
router.get("/", async (req, res) => {
  try {
    
    res.json("works ")
  } catch (error) {
    res.status(400).json();
    // res.render('FeedbackForm',
    // 	{ msg: "Check Details." });
  }
});

app.use("/", router);
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${port}`)
})
