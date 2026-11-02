const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    genre: {
      type: [String],
      trim: true,
      required: [true, "Genre is required"],
    },
    language: {
      type: String,
      trim: true,
      required: [true, "Language is required"],
    },
    director: {
      type: String,
      trim: true,
      required: [true, "Director is required"],
    },
    cast: {
      type: [String],
      required: [true, "Casts are required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    releaseDate: {
      type: Date,
      required: [true, "Release date is required"],
    },
    poster_image: {
      type: String,
    },
    poster_public_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const movieModel = mongoose.model("movie", movieSchema);
module.exports = movieModel;
