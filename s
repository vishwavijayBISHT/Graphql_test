const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const bcrypt = require("bcryptjs");
const { dateToString } = require("../../helpers/date");

const tranformEvent = (event) => {
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event._doc.creator),
    date: new Date(event._doc.date).toISOString(),
  };
};

const events = (eventids) => {
  return Event.findById({ _id: { $in: eventids } })
    .then((events) => {
      return events.map((event) => {
        return tranformEvent(event);
      });
    })
    .catch((err) => {
      throw err;
    });
};
const singleEvent = async (id) => {
  try {
    const event = await Event.findById(id);
    return tranformEvent(event);
  } catch (err) {
    throw err;
  }
};
const user = (userid) => {
  return User.findById(userid)
    .then((user) => {
      return {
        ...user._doc,
        _id: user.id,

        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map((event) => {
          return tranformEvent(event);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  bookings: async () => {
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
  createEvent: (args) => {
    let createdevent;

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5fead57a4f576f6a908f57fe",
    });
    return event
      .save()
      .then((result) => {
        createdevent = tranformEvent(result);
        return User.findById("5fead57a4f576f6a908f57fe");
      })
      .then((user) => {
        user.createdEvents.push(event);
        return user.save();
      })
      .then((result) => {
        return createdevent;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  createUser: async (a) => {
    try {
      console.log(a);
      const { email, password } = a.userInput;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("user already exists");
      }
      const user = new User({
        email,
        password: bcrypt.hashSync(password, 12),
      });
      const res = await user.save();

      return { ...res._doc, password: null };
    } catch (err) {
      throw new Error("user not created", err);
    }
  },
  bookEvent: async (args) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: "5fed526dc160946878c1d8e6",
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
  cancelbooking: async (args) => {
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
