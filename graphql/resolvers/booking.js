const Booking = require("../../models/booking");
const { singleEvent, user, tranformEvent } = require("./merge");
const Event = require("../../models/event");
const { dateToString } = require("../../helpers/date");

// const tranformEvent = (event) => {
//   return {
//     ...event._doc,
//     date: new Date(event._doc.date).toISOString(),
//     creator: user.bind(this, event._doc.creator),
//     date: new Date(event._doc.date).toISOString(),
//   };
// };

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("un auyhenticated");
    }
    try {
      const booking = await Booking.find();
      return booking.map((booking) => {
        return {
          ...booking._doc,
          id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: dateToString(booking.createdAt),
          updatedAt: new Date(booking.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("un auyhenticated");
    }
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });
      const result = await booking.save();
      return {
        ...result._doc,
        _id: result.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking.createdAt).toISOString(),
        updatedAt: new Date(booking.updatedAt).toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
  cancelbooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("un auyhenticated");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = tranformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
