"use strict";
var Car = require("../models/car.model");

const registerCar = async (req, res) => {
    var params = req.body;
    var car = new Car();
    if (req.user.role != "admin") {
        return res.status(403).send({ message: "forbidden" });
    }
    if (isMissingParam(params)) {
        return res.status(403).send({ message: "Missing params" });
    }

        car.brand        = params.brand;
        car.model        = params.model;
        car.year         = params.year;
        car.licensePlate = params.licensePlate;
        car.state        = params.state;
    try {
        var carFound = await Car.find({ licensePlate: car.licensePlate }).exec();
        if (carFound.length > 0) {
            return res.status(404).send({ message: "Car already exists" });
        }
        var registredCar = await car.save();
        if (!registredCar) {
            return res.status(404).send({ message: "Error saving car" })
        }
        return res.status(200).send({ message: "Car saved successfully", car: registredCar });
    } catch (error) {
        console.error(error);
        return res.status(404).send(error);
    }
}

const getCar = async (req, res) => {
    try {
        var foundCar = await Car.findById(req.params.id).exec();
        if (!foundCar) {
            return res.status(404).send({ message: "Car not found" });
        }
        return res.status(200).send({ car: foundCar });
    } catch (error) {
        console.error(error);
        return res.status(404).send(error);
    }
}

const updateCar = async (req, res) => {
    var params = req.body;
    if (req.user.role != "admin") {
        return res.status(403).send({ message: "Forbidden" });
    }
    try {
        var objToUpdate = {
            brand       : params.brand,
            model       : params.model,
            year        : params.year,
            licensePlate: params.licensePlate,
        }
        params.state ? objToUpdate.state = params.state : null;

        var updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            objToUpdate,
            { new: true },
        ).exec();

        if (!updatedCar) {
            return res.status(404).send({ message: "Error updated car" })
        }
        return res.status(200).send({ message: "Car updated successfully", car: updatedCar });
    } catch (error) {
        console.error(error);
        return res.status(404).send(error);
    }
}

const deleteCar = async (req, res) => {
    if (req.user.role != "admin") {
        return res.status(403).send({ message: "Forbidden" });
    }
    try {
        var deletedCar = await Car.findByIdAndRemove(req.params.id).exec();
        if (!deletedCar) {
            return res.status(404).send({ message: "Error updating car" });
        }
        return res.status(200).send({ message: "Car deleted successful" });
    } catch (error) {
        console.error(error);
        return res.status(404).send(error);
    }
}

const listCars = async (req, res) => {
    try {
        var foundCars = await Car.find().exec();
        if (!foundCars || foundCars.length == 0) {
            return res.status(404).send({ message: "Cars not found" });
        }
        return res.status(200).send({ cars: foundCars });
    } catch (error) {
        console.error(error);
        return res.status(404).send(error);
    }
}

const isMissingParam = (params) =>
!params.brand         ||
!params.model         ||
!params.year          ||
!params.licensePlate  ||
!params.state;

module.exports = {
    registerCar,
    getCar,
    updateCar,
    deleteCar,
    listCars,

}