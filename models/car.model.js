'use strict';

var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var CarSchema = Schema({
    brand        : String,
    model        : String,
    year         : Number,
    licensePlate : String,
    state: {
        type:      String,
        enum:      ["perfecto", "daño menor", "reparacion urgente", "en reparacion", "descarte"],
    }
});

module.exports = mongoose.model("Car", CarSchema);