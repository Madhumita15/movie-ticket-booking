const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const showSchema = new Schema(
  {
    theaterId: {
      type: Schema.Types.ObjectId,
      ref: "theater",
      required: [true, "Theater is required"],
    },

    movieId: {
      type: Schema.Types.ObjectId,
      ref: "movie",
      required: [true, "Movie is required"],
    },
    screenNumber: {
      type: Number,
      required: [true, "Screen Number is required"],
      min: 1
    },
    showTiming: {
      type: Date,
      required: [true, "Show timing is required"],
    },
    avaliableSeats: {
        type: Number,
        min: 0
    },
    totalSeats: {
        type: Number,
        min: 1,
        required: true
    }
  },
  {
    timestamps: true,
  },
);

const showModel = mongoose.model("show", showSchema);
module.exports = showModel;
