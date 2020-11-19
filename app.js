"use strict";

var express         = require("express");
var bodyParser      = require("body-parser");
var cors            = require("cors");
var app             = express();
var userRoutes      = require("./routes/user.route");
var carRoutes       = require("./routes/car.route")


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/api", userRoutes);
app.use("/api", carRoutes);


module.exports = app;