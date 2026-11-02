const Show = require("../models/shows.model");
const httpStatusCode = require("../utils/httpStatusCode");
const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const {
  clearBookingCache,
  getBookingCache,
  setBookingCache,
  clearBookingCacheByUserId,
  getBookingCacheByUserId,
  setBookingCacheByUserId,
} = require("./bookingCache.service");
const { clearShowCache, clearShowCacheById } = require("./showCache.service");

const createBookingService = async ({ showId, userId, numberOfTicket }) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const show = await Show.findById(showId).session(session);
    if (!show) {
      const error = new Error("Show not found");
      error.statusCode = httpStatusCode.NOT_FOUND;
      throw error;
    }

    if (Number(numberOfTicket) > Number(show.avaliableSeats)) {
      const error = new Error(" This number of Ticket is not available");
      error.statusCode = httpStatusCode.BAD_REQUEST;
      throw error;
    }

    show.avaliableSeats = Number(show.avaliableSeats) - Number(numberOfTicket);
    await show.save({ session });

    const [newBooking] = await Booking.create(
      [
        {
          showId,
          userId,
          numberOfTicket,
        },
      ],
      { session },
    );
    await session.commitTransaction();
    await clearBookingCache();
    await clearBookingCacheByUserId(userId);
    await clearShowCache();
    await clearShowCacheById(show._id);

    return newBooking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

// startSession() → Creates a session.
// startTransaction() → Starts a transaction inside that session.
// commitTransaction() → Saves all transaction changes.
// abortTransaction() → Rolls back all transaction changes.
// endSession() → Closes the session.

const cancelBookingService = async ({ userId, bookingId }) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const booking = await Booking.findOne({
      userId: userId,
      _id: bookingId,
    }).session(session);
    if (!booking) {
      const error = new Error("booking ticket for this user is not found");
      error.statusCode = httpStatusCode.NOT_FOUND;
      throw error;
    }
    if (booking.status === "cancelled") {
      const error = new Error("booking ticket already cancelled");
      error.statusCode = httpStatusCode.BAD_REQUEST;
      throw error;
    }
    const show = await Show.findOne({ _id: booking.showId }).session(session);
    if (!show) {
      const error = new Error("show not found for this book");
      error.statusCode = httpStatusCode.NOT_FOUND;
      throw error;
    }

    booking.status = "cancelled";
    await booking.save({ session });
    show.avaliableSeats =
      Number(show.avaliableSeats) + Number(booking.numberOfTicket);
    await show.save({ session });
    await session.commitTransaction();
    await clearBookingCache();
    await clearBookingCacheByUserId(userId);
    await clearShowCache();
    await clearShowCacheById(show._id);
    return booking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

// 4. View Booking History
// • Fetch and display the user's booking history.

const getAllBookingHistoryService = async () => {
  const bookingsCache = await getBookingCache();
  if (bookingsCache) {
    return { bookings: bookingsCache, source: "redis" };
  }
  const bookings = await Booking.aggregate([
    {
      $lookup: {
        from: "shows",
        foreignField: "_id",
        localField: "showId",
        as: "show",
      },
    },
    {
      $unwind: "$show",
    },
    {
      $lookup: {
        from: "theaters",
        foreignField: "_id",
        localField: "show.theaterId",
        as: "theater",
      },
    },
    {
      $unwind: "$theater",
    },
    {
      $lookup: {
        from: "movies",
        foreignField: "_id",
        localField: "show.movieId",
        as: "movie",
      },
    },
    {
      $unwind: "$movie",
    },
  ]);
  if (bookings.length === 0) {
    const error = new Error("no bookings found");
    error.statusCode = httpStatusCode.OK;
    throw error;
  }
  await setBookingCache(bookings);

  return { bookings: bookings, source: "mongoDB" };
};



const getBookingHistoryByUserIdService = async (userId) => {
  const bookingByUserIdCache = await getBookingCacheByUserId(userId);
  if (bookingByUserIdCache) {
    return { bookings: bookingByUserIdCache, source: "redis" };
  }
  const bookings = await Booking.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "shows",
        foreignField: "_id",
        localField: "showId",
        as: "show",
      },
    },
    {
      $unwind: "$show",
    },
    {
      $lookup: {
        from: "theaters",
        foreignField: "_id",
        localField: "show.theaterId",
        as: "theater",
      },
    },
    {
      $unwind: "$theater",
    },
    {
      $lookup: {
        from: "movies",
        foreignField: "_id",
        localField: "show.movieId",
        as: "movie",
      },
    },
    {
      $unwind: "$movie",
    }
  ]);
  if (bookings.length === 0) {
    const error = new Error("no bookings found");
    error.statusCode = httpStatusCode.OK;
    throw error;
  }
 

  await setBookingCacheByUserId({ bookings: bookings, userId: userId });
  return { bookings: bookings, source: "mongoDB" };
};
module.exports = {
  createBookingService,
  cancelBookingService,
  getAllBookingHistoryService,
  getBookingHistoryByUserIdService,
};
