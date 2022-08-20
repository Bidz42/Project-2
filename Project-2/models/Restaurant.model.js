const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, ref: "User"
    },
    name: {
        type: String,
        required: [true, "Must include name"]
    },
    cuisine: {
        type: String,
        required: [true]
    }}
    , {minimize: false});

const Restaurant = model('Restaurant', restaurantSchema);

module.exports = Restaurant
