"use strict";

var express         = require("express");
var carController  = require("../controllers/car.controller");
var md_auth         = require("../middlewares/authenticated");

var api = express.Router();
api.post("/cars",       md_auth.ensureAuth, carController.registerCar);
api.get("/cars/:id",    md_auth.ensureAuth, carController.getCar);
api.put("/cars/:id",    md_auth.ensureAuth, carController.updateCar);
api.delete("/cars/:id", md_auth.ensureAuth, carController.deleteCar);
api.get("/cars",        md_auth.ensureAuth, carController.listCars);

module.exports = api;