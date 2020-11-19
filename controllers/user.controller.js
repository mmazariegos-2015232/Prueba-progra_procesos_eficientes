'use strict';

var bcrypt      = require("../services/bcrypt");
var jwt         = require("../services/jwt");
var User        = require("../models/user.model");

const createDefaultAdminUser = async () => {
    var user = new User();
    
    try {
      user.name     = "admin";
      user.username = "admin";
      user.role     = "admin";
      user.password = await bcrypt.hashField("admin");
      var foundUser = await User.findOne({ username: user.username.toLowerCase() }).exec();
      if (!foundUser) {
        var createdUser = await user.save();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const register = async (req, res) => {
    var params  = req.body;
    var user    = new User();
    var roles   = ["operador"];
    if (req.user.role != "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }
    if (isMissingParam(params)) {
      return res.status(403).send({ message: "Missing params" });
    }
    if (!roles.includes(params.role)) {
      return res.status(403).send({ message: "Invalid role" });
    }
    try {
      user.name             = params.name;
      user.lastname         = params.lastname;
      user.email            = params.email.toLowerCase();
      user.username         = params.username.toLowerCase();
      user.role             = params.role;
      user.password         = await bcrypt.hashField(params.password);
      var foundUsers = await User.find({
        $or: [{ email: user.email.toLowerCase() }, { username: user.username.toLowerCase() }]
      }).exec();
      if (foundUsers.length > 0) {
        return res.status(418).send({ message: "Username or code taken by another user" });
      }
      var createdUser = await user.save();
      if (!createdUser) {
        return res.status(404).send({ message: "Error saving user" });
      }
      user.password = undefined;
      return res.status(200).send({ message: "User saved successfully", user: createdUser });
    } catch (error) {
      console.error(error);
      return res.status(404).send(error);
    }
  }

  const login = async (req, res) => {
    var params = req.body;
    if ((!params.username && !params.email) || !params.password) {
      return res.status(403).send({ message: "Missing params" });
    }
    try {
      var foundUser = await User.findOne({
        $or: [{ email: params.username.toLowerCase() }, { username: params.username.toLowerCase() }]
      }).exec();
      if (!foundUser) {
        return res.status(403).send({ message: "Invalid user" });
      }
      var check = await bcrypt.compareWithHashed(params.password, foundUser.password);
      if (!check) {
        return res.status(403).send({ message: "Invalid password" });
      }
      foundUser.password = undefined;
      if (params.gettoken != "true") {
        return res.status(200).send({ message: "Successful authentication", user: foundUser });
      }
      return res.status(200).send({ message: "User logged in successfully", token: jwt.createToken(foundUser) });
    } catch (error) {
      console.error(error);
      return res.status(404).send(error);
    }
  }

  const updateUser = async (req, res) => {
    var params = req.body;
    if (req.user.role != "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }
    try {
      var objToUpdate = {
        name:             params.name,
        lastname:         params.lastname,
      }
      params.password ? objToUpdate.password = await bcrypt.hashField(params.password) : null;
      params.role ? objToUpdate.role = params.role : null;
  
      var updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        objToUpdate,
        { new: true },
      ).exec();
  
      if (!updatedUser) {
        return res.status(404).send({ message: "Error updated user" })
      }
      return res.status(200).send({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(404).send(error);
    } 
  
  }
  
  const deleteUser = async (req, res) => {
    if (req.user.role != "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }
    try {
      var foundUserAdmin = await User.findById(req.params.id).exec();
      if (foundUserAdmin.role == "admin") {
        return res.status(404).send({ message: "The admin user cannot be removed" });
      }
      var deletedUser = await User.findByIdAndRemove(req.params.id).exec();
      if (!deletedUser) {
        return res.status(404).send({ message: "Error updating user" });
      }
      return res.status(200).send({ message: "User deleted successful" });
    } catch (error) {
      console.error(error);
      return res.status(404).send(error);
    }
  }
  
  const getUser = async (req, res) => {
    if (req.user.role != "admin" && req.user.sub != req.params.id) {
      return res.status(403).send({ message: "Forbidden" });
    }
    try {
      var foundUser = await User.findById(req.params.id).exec();
      if (!foundUser) {
        return res.status(404).send({ message: "User not found" });
      }
      foundUser.password = undefined;
      return res.status(200).send({ user: foundUser });
    } catch (error) {
      console.error(error);
      return res.status(404).send(error);
    }
  }
  
  const listUsers = async (req, res) => {
    if (req.user.role != "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }
    try {
      var foundUsers = await User.find().exec();
      if (!foundUsers || foundUsers.length == 0) {
        return res.status(404).send({ message: "Users not found" });
      }
      return res.status(200).send({ users: foundUsers });
    } catch (error) {
      console.error(error);
      return res.status(404).send(error);
    }
  }


  const isMissingParam = params =>
  !params.name            ||
  !params.lastname        ||
  !params.email           ||
  !params.username        ||
  !params.role            ||
  !params.password;

  module.exports = {
    createDefaultAdminUser,
    register,
    login,
    updateUser,
    deleteUser,
    getUser,
    listUsers,
  }