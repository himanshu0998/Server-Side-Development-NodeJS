const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
},{
    timestamps: true //automatically adds two timestamps: created at and updated at in each stored document
});

var Dishes = mongoose.model('Dish', dishSchema); //mongo aautomatically creates a collection named as plural form of the 1st parameter, i.e, Dish -> Dishes

module.exports = Dishes; 