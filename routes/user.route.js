"use strict";

var express         = require("express");
var userController  = require("../controllers/user.controller");
var md_auth         = require("../middlewares/authenticated");

var api = express.Router();
api.post("/auth/login", userController.login);
api.post("/users",       md_auth.ensureAuth, userController.register);
api.put("/users/:id",    md_auth.ensureAuth, userController.updateUser);
api.delete("/users/:id", md_auth.ensureAuth, userController.deleteUser);
api.get("/users/:id",    md_auth.ensureAuth, userController.getUser);
api.get("/users",        md_auth.ensureAuth, userController.listUsers);

module.exports = api; 