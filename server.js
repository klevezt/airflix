const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { validateToken, tokenRefresh } = require("./middleware/auth");
const path = require("path");

const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
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
const login = require("./routes/login");
const refresh = require("./routes/refresh");
const imageTest = require("./routes/imageTest");

app.use("/users", validateToken, usersRouter);
app.use("/food", validateToken, foodRouter);
app.use("/drink", validateToken, drinkRouter);
app.use("/foodType", validateToken, foodTypeRouter);
app.use("/drinkType", validateToken, drinkTypeRouter);
app.use("/weekMenu", validateToken, weekMenuRouter);
app.use("/review", validateToken, review);
app.use("/alacarte", validateToken, alacarte);
app.use("/alacarteType", validateToken, alacarteType);
app.use("/staff", validateToken, staff);
app.use("/staffPosition", validateToken, staffPosition);
app.use("/events", validateToken, events);
app.use("/info", validateToken, info);
app.use("/service", validateToken, service);
app.use("/serviceType", validateToken, serviceType);
app.use("/rate", validateToken, rate);
// app.use("/refresh", tokenRefresh, refresh);
app.use("/login", login);
app.use("/imageTest", imageTest);

// var imgModel = require("./models/imageTest.model");

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () =>
  console.log(`API is running on http://localhost:${port}`)
);
