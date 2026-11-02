const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const theaterSchema = new Schema({
  theaterName: {
    type: String,
    trim: true,
    required: [true, "Theater name is required"],
  },
  location: {
    type: String,
    trim: true,
    required: [true, "Location is required"]
  },
  numberOfScreens: {
    type: Number,
    required: [true, "Number of screen is required"],
    min: 1
  },
},
{
    timestamps: true
});

const theaterModel = mongoose.model("theater", theaterSchema);
module.exports = theaterModel;
