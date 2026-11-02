const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    showId: {
      type: Schema.Types.ObjectId,
      ref: "shows",
      required: [true, "show id is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "user id is required"],
    },
    numberOfTicket: {
      type: Number,
      required: [true, "Number of ticket is required"],
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

const bookingModel = mongoose.model("booking", bookingSchema);
module.exports = bookingModel;
