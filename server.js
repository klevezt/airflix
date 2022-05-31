const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const authToken = require("./middleware/authenticateToken");

const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET , POST, DELETE , PUT');
  next();
});
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB database");
});

const usersRouter = require("./routes/users");
const foodRouter = require("./routes/food");
const drinkRouter = require("./routes/drink");
const foodTypeRouter = require("./routes/foodType");
const drinkTypeRouter = require("./routes/drinkType");
const weekMenuRouter = require("./routes/weekMenu");
const review = require("./routes/review");
const alacarte = require("./routes/alacarte");
const alacarteType = require("./routes/alacarteType");
const staff = require("./routes/staff");
const staffPosition = require("./routes/staffPosition");
const events = require("./routes/events");
const info = require("./routes/info");
const service = require("./routes/service");
const serviceType = require("./routes/serviceType");
const rate = require("./routes/rate");

const auth = require("./routes/auth");
const error = require("./routes/error");

app.use("/users", authToken, usersRouter);
app.use("/food", authToken, foodRouter);
app.use("/drink", authToken, drinkRouter);
app.use("/foodType", authToken, foodTypeRouter);
app.use("/drinkType", authToken, drinkTypeRouter);
app.use("/weekMenu", authToken, weekMenuRouter);
app.use("/review", authToken, review);
app.use("/alacarte", authToken, alacarte);
app.use("/alacarteType", authToken, alacarteType);
app.use("/staff", authToken, staff);
app.use("/staffPosition", authToken, staffPosition);
app.use("/events", authToken, events);
app.use("/info", authToken, info);
app.use("/service", authToken, service);
app.use("/serviceType", authToken, serviceType);
app.use("/rate", authToken, rate);

app.use("/auth", auth);
app.use("/error", error);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () =>
  console.log(`API is running on http://localhost:${port}`)
);
